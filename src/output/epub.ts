import type { JSDOM } from '@vivliostyle/jsdom';
import archiver from 'archiver';
import { lookup as lookupLanguage } from 'bcp-47-match';
import { XMLBuilder } from 'fast-xml-parser';
import { copy, remove } from 'fs-extra/esm';
import GithubSlugger from 'github-slugger';
import { lookup as mime } from 'mime-types';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import upath from 'upath';
import { v4 as uuid } from 'uuid';
import serializeToXml from 'w3c-xmlserializer';
import {
  EPUB_CONTAINER_XML,
  EPUB_LANDMARKS_COVER_ENTRY,
  EPUB_LANDMARKS_TITLE,
  EPUB_LANDMARKS_TOC_ENTRY,
  EPUB_NS,
  TOC_TITLE,
  XML_DECLARATION,
} from '../const.js';
import { Logger } from '../logger.js';
import {
  PageListResourceTreeRoot,
  TocResourceTreeRoot,
  getJsdomFromUrlOrFile,
  parsePageListDocument,
  parseTocDocument,
} from '../processor/html.js';
import type {
  Contributor,
  LocalizableStringObject,
  LocalizableStringOrObject,
  PublicationLinks,
  PublicationManifest,
  ResourceCategorization,
} from '../schema/publication.schema.js';
import { DetailError, useTmpDirectory } from '../util.js';

interface ManifestEntry {
  href: string;
  mediaType: string;
  properties?: string;
}

interface LandmarkEntry {
  type: string;
  href: string;
  text: string;
}

interface SpineEntry {
  href: string;
}

const TOC_ID = 'toc';
const LANDMARKS_ID = 'landmarks';
const PAGELIST_ID = 'page-list';
const COVER_IMAGE_MIMETYPES = [
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];

const changeExtname = (filepath: string, newExt: string) => {
  let ext = upath.extname(filepath);
  return `${filepath.slice(0, -ext.length)}${newExt}`;
};

const getRelativeHref = (target: string, baseUrl: string, rootUrl: string) => {
  const absBasePath = upath.join('/', baseUrl);
  const absRootPath = upath.join('/', rootUrl);
  const hrefUrl = new URL(encodeURI(target), pathToFileURL(absBasePath));
  if (hrefUrl.protocol !== 'file:') {
    return target;
  }
  if (/\.html?$/.test(hrefUrl.pathname)) {
    hrefUrl.pathname = changeExtname(hrefUrl.pathname, '.xhtml');
  }
  const pathname = upath.posix.relative(
    pathToFileURL(upath.dirname(absRootPath)).pathname,
    hrefUrl.pathname,
  );
  return `${pathname}${hrefUrl.search}${hrefUrl.hash}`;
};

const normalizeLocalizableString = (
  value: LocalizableStringOrObject | undefined,
  availableLanguages: string[],
): string | undefined => {
  if (!value) {
    return;
  }
  const values = [value]
    .flat()
    .map((value) => (typeof value === 'string' ? { value } : value));
  const localizedValues = values.filter(
    (v): v is LocalizableStringObject & { language: string } => !!v.language,
  );
  const preferredLang = lookupLanguage(
    localizedValues.map((v) => v.language),
    availableLanguages,
  );
  if (preferredLang) {
    return localizedValues[
      localizedValues.findIndex((v) => v.language === preferredLang)
    ].value;
  }
  return values.find((v) => !v.language)?.value;
};

const appendManifestProperty = (entry: ManifestEntry, newProperty: string) => {
  entry.properties = entry.properties
    ? Array.from(new Set([...entry.properties.split(' '), newProperty])).join(
        ' ',
      )
    : newProperty;
};

export async function exportEpub({
  webpubDir,
  entryHtmlFile,
  manifest,
  relManifestPath,
  target,
  epubVersion,
}: {
  webpubDir: string;
  entryHtmlFile?: string;
  manifest: PublicationManifest;
  relManifestPath?: string;
  target: string;
  epubVersion: '3.0';
}) {
  Logger.debug('Export EPUB', {
    webpubDir,
    entryHtmlFile,
    relManifestPath,
    target,
    epubVersion,
  });

  const [tmpDir] = await useTmpDirectory();
  fs.mkdirSync(upath.join(tmpDir, 'META-INF'), { recursive: true });
  await copy(webpubDir, upath.join(tmpDir, 'EPUB'));

  const uid = `urn:uuid:${uuid()}`;
  const entryHtmlRelPath =
    entryHtmlFile &&
    upath.relative(webpubDir, upath.resolve(webpubDir, entryHtmlFile));

  const findPublicationLink = (
    relType: string,
    list?: ResourceCategorization,
    filter?: (e: PublicationLinks) => boolean,
  ) =>
    [list]
      .flat()
      .find(
        (e): e is PublicationLinks =>
          typeof e === 'object' && e.rel === relType && (!filter || filter(e)),
      );
  const tocResource = findPublicationLink('contents', [
    ...[manifest.readingOrder || []].flat(),
    ...[manifest.resources || []].flat(),
  ]);
  const pageListResource = findPublicationLink('pagelist', [
    ...[manifest.readingOrder || []].flat(),
    ...[manifest.resources || []].flat(),
  ]);
  // NOTE: EPUB allows one cover-image item unlike web publication
  // vivliostyle-cli takes the first cover resource.
  const pictureCoverResource = findPublicationLink(
    'cover',
    manifest.resources,
    (e) =>
      COVER_IMAGE_MIMETYPES.includes(e.encodingFormat || mime(e.url) || ''),
  );
  const htmlCoverResource = findPublicationLink(
    'cover',
    [
      ...[manifest.readingOrder || []].flat(),
      ...[manifest.resources || []].flat(),
    ],
    (e) => /\.html?$/.test(e.url),
  );

  const manifestItem = [
    ...[manifest.links || []].flat(),
    ...[manifest.readingOrder || []].flat(),
    ...[manifest.resources || []].flat(),
  ].reduce(
    (acc, val) => {
      const { url, encodingFormat } =
        typeof val === 'string' ? ({ url: val } as PublicationLinks) : val;
      // Only accepts path-like url
      try {
        new URL(url);
        return acc;
      } catch (e) {
        /* NOOP */
      }
      if (!fs.existsSync(upath.join(tmpDir, 'EPUB', url))) {
        return acc;
      }
      const mediaType = encodingFormat || mime(url) || 'text/plain';
      acc[url] = {
        href: url,
        mediaType,
      };
      if (/\.html?$/.test(url)) {
        acc[url].href = changeExtname(url, '.xhtml');
        acc[url].mediaType = 'application/xhtml+xml';
      }
      if (url === pictureCoverResource?.url) {
        acc[url].properties = 'cover-image';
      }
      return acc;
    },
    {} as Record<string, ManifestEntry>,
  );

  const htmlFiles = Object.keys(manifestItem).filter((url) =>
    /\.html?$/.test(url),
  );
  let tocHtml = htmlFiles.find((f) => f === tocResource?.url);
  const readingOrder = [manifest.readingOrder || entryHtmlRelPath]
    .flat()
    .flatMap((v) => (v ? (typeof v === 'string' ? { url: v } : v) : []));
  if (!tocHtml) {
    Logger.logWarn(
      'No table of contents document was found. for EPUB output, we recommend to enable `toc` option in your Vivliostyle config file to generate a table of contents document.',
    );
    tocHtml =
      htmlFiles.find((f) => f === entryHtmlRelPath) || readingOrder[0].url;
  }
  const spineItems = readingOrder.map<SpineEntry>(({ url }) => ({
    href: changeExtname(url, '.xhtml'),
  }));
  if (!(tocHtml in manifestItem)) {
    manifestItem[tocHtml] = {
      href: changeExtname(tocHtml, '.xhtml'),
      mediaType: 'application/xhtml+xml',
    };
  }
  appendManifestProperty(manifestItem[tocHtml], 'nav');

  const landmarks: LandmarkEntry[] = [
    {
      type: 'toc',
      href: `${manifestItem[tocHtml].href}#${TOC_ID}`,
      text: EPUB_LANDMARKS_TOC_ENTRY,
    },
  ];
  if (htmlCoverResource) {
    landmarks.push({
      type: 'cover',
      href: changeExtname(htmlCoverResource.url, '.xhtml'),
      text: EPUB_LANDMARKS_COVER_ENTRY,
    });
  }

  const contextDir = upath.join(tmpDir, 'EPUB');
  type XhtmlEntry = Resolved<ReturnType<typeof transpileHtmlToXhtml>>;
  const processHtml = async (target: string) => {
    let parseResult: XhtmlEntry;
    try {
      parseResult = await transpileHtmlToXhtml({
        target,
        contextDir,
      });
    } catch (error) {
      const thrownError = error as Error;
      throw new DetailError(
        `Failed to transpile document to XHTML: ${target}`,
        thrownError.stack ?? thrownError.message,
      );
    }
    if (parseResult.hasMathmlContent) {
      appendManifestProperty(manifestItem[target], 'mathml');
    }
    if (parseResult.hasRemoteResources) {
      appendManifestProperty(manifestItem[target], 'remote-resources');
    }
    if (parseResult.hasScriptedContent) {
      appendManifestProperty(manifestItem[target], 'scripted');
    }
    if (parseResult.hasSvgContent) {
      appendManifestProperty(manifestItem[target], 'svg');
    }
    return parseResult;
  };

  const processResult: Record<string, XhtmlEntry> = {};
  Logger.debug(`Transpiling ToC HTML to XHTML: ${tocHtml}`);
  processResult[tocHtml] = await processHtml(tocHtml);
  for (const target of htmlFiles.filter((f) => f !== tocHtml)) {
    Logger.debug(`Transpiling HTML to XHTML: ${target}`);
    processResult[target] = await processHtml(target);
  }

  // Process ToC document
  const { document: entryDocument } = processResult[tocHtml].dom.window;
  const docLanguages = [manifest.inLanguage]
    .flat()
    .filter((v): v is string => Boolean(v));
  if (docLanguages.length === 0) {
    docLanguages.push(entryDocument.documentElement.lang || 'en');
  }
  const docTitle =
    normalizeLocalizableString(manifest.name, docLanguages) ||
    entryDocument.title;
  if (!docTitle) {
    throw new Error('EPUB must have a title of one or more characters');
  }
  const { tocResourceTree } = await processTocDocument({
    dom: processResult[tocHtml].dom,
    target: tocHtml,
    contextDir,
    readingOrder,
    docLanguages,
    landmarks,
  });

  // Process PageList document
  const pageListHtml = pageListResource?.url || entryHtmlRelPath;
  if (pageListHtml && pageListHtml in processResult) {
    await processPagelistDocument({
      dom: processResult[pageListHtml].dom,
      target: pageListHtml,
      contextDir,
    });
  }

  if (relManifestPath) {
    await remove(upath.join(tmpDir, 'EPUB', relManifestPath));
    delete manifestItem[relManifestPath];
  }

  // META-INF/container.xml
  fs.writeFileSync(
    upath.join(tmpDir, 'META-INF/container.xml'),
    EPUB_CONTAINER_XML,
    'utf8',
  );

  // EPUB/content.opf
  Logger.debug(`Generating content.opf`);
  fs.writeFileSync(
    upath.join(tmpDir, 'EPUB/content.opf'),
    buildEpubPackageDocument({
      epubVersion,
      uid,
      docTitle,
      docLanguages,
      manifest,
      spineItems,
      manifestItems: Object.values(manifestItem),
    }),
    'utf8',
  );

  await compressEpub({ target, sourceDir: tmpDir });
}

async function writeAsXhtml(dom: JSDOM, absPath: string) {
  const xhtml = `${XML_DECLARATION}\n${serializeToXml(dom.window.document)}`;
  await fs.promises.writeFile(changeExtname(absPath, '.xhtml'), xhtml, 'utf8');
}

async function transpileHtmlToXhtml({
  target,
  contextDir,
}: {
  target: string;
  contextDir: string;
}): Promise<{
  dom: JSDOM;
  hasMathmlContent: boolean;
  hasRemoteResources: boolean;
  hasScriptedContent: boolean;
  hasSvgContent: boolean;
}> {
  const absPath = upath.join(contextDir, target);
  const dom = await getJsdomFromUrlOrFile({ src: absPath });
  const { document } = dom.window;
  // `xmlns` will be supplied in later serialization process
  document.documentElement.removeAttribute('xmlns');
  document.documentElement.setAttribute('xmlns:epub', EPUB_NS);

  document.querySelectorAll('a[href]').forEach((el) => {
    const href = decodeURI(el.getAttribute('href')!);
    el.setAttribute('href', getRelativeHref(href, target, target));
  });

  await writeAsXhtml(dom, absPath);
  await fs.promises.unlink(absPath);
  return {
    dom,
    // FIXME: Yes, I recognize this implementation is inadequate.
    hasMathmlContent: !!document.querySelector('math'),
    hasRemoteResources: !!document.querySelector(
      '[src^="http://"], [src^="https://"]',
    ),
    hasScriptedContent: !!document.querySelector('script, form'),
    hasSvgContent: !!document.querySelector('svg'),
  };
}

function replaceWithNavElement(dom: JSDOM, el: Element) {
  const nav = dom.window.document.createElement('nav');
  while (el.firstChild) {
    nav.appendChild(el.firstChild);
  }
  for (let i = 0; i < el.attributes.length; i++) {
    nav.attributes.setNamedItem(el.attributes[i].cloneNode() as Attr);
  }
  el.parentNode?.replaceChild(nav, el);
  return nav;
}

async function processTocDocument({
  dom,
  target,
  contextDir,
  readingOrder,
  docLanguages,
  landmarks,
}: {
  dom: JSDOM;
  target: string;
  contextDir: string;
  readingOrder: PublicationLinks[];
  docLanguages: string[];
  landmarks: LandmarkEntry[];
}): Promise<{ tocResourceTree: TocResourceTreeRoot | null }> {
  const { document } = dom.window;

  let tocResourceTree: TocResourceTreeRoot | null = null;
  if (!document.querySelector('nav[epub:type]')) {
    tocResourceTree = parseTocDocument(dom);
    if (tocResourceTree) {
      const nav = replaceWithNavElement(dom, tocResourceTree.element);
      nav.setAttribute('id', TOC_ID);
      nav.setAttribute('epub:type', 'toc');
    } else {
      Logger.debug(`Generating toc nav element: ${target}`);

      const nav = document.createElement('nav');
      nav.setAttribute('id', TOC_ID);
      nav.setAttribute('role', 'doc-toc');
      nav.setAttribute('epub:type', 'toc');
      nav.setAttribute('hidden', '');
      const h2 = document.createElement('h2');
      h2.textContent = TOC_TITLE;
      nav.appendChild(h2);
      const ol = document.createElement('ol');
      tocResourceTree = {
        element: nav,
        children: [],
      };

      for (const content of readingOrder) {
        let name = normalizeLocalizableString(content.name, docLanguages);
        if (!name) {
          const dom = await getJsdomFromUrlOrFile({
            src: upath.join(contextDir, changeExtname(content.url, '.xhtml')),
          });
          name = dom.window.document.title;
        }
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = name;
        a.href = getRelativeHref(content.url, '', target);
        li.appendChild(a);
        ol.appendChild(li);
        tocResourceTree.children.push({ element: li, label: a });
      }

      nav.appendChild(ol);
      document.body.appendChild(nav);
      Logger.debug('Generated toc nav element', nav.outerHTML);
    }

    if (landmarks.length > 0) {
      Logger.debug(`Generating landmark nav element: ${target}`);
      const nav = document.createElement('nav');
      nav.setAttribute('epub:type', 'landmarks');
      nav.setAttribute('id', LANDMARKS_ID);
      nav.setAttribute('hidden', '');
      const h2 = document.createElement('h2');
      h2.textContent = EPUB_LANDMARKS_TITLE;
      nav.appendChild(h2);
      const ol = document.createElement('ol');
      for (const { type, href, text } of landmarks) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('epub:type', type);
        a.setAttribute('href', getRelativeHref(href, '', target));
        a.text = text;
        li.appendChild(a);
        ol.appendChild(li);
      }
      nav.appendChild(ol);
      document.body.appendChild(nav);
      Logger.debug('Generated landmark nav element', nav.outerHTML);
    }
  }

  // Remove a publication manifest linked to ToC html.
  // When converting to EPUB, HTML files are converted to XHTML files
  // and no longer conform to Web publication, so we need to
  // explicitly remove the publication manifest.
  const publicationLinkEl = document.querySelector(
    'link[href][rel="publication"]',
  );
  if (publicationLinkEl) {
    const href = publicationLinkEl.getAttribute('href')!.trim();
    if (href.startsWith('#')) {
      const scriptEl = document.getElementById(href.slice(1));
      if (scriptEl?.getAttribute('type') === 'application/ld+json') {
        scriptEl.parentNode?.removeChild(scriptEl);
      }
    }
    publicationLinkEl.parentNode?.removeChild(publicationLinkEl);
  }

  const absPath = upath.join(contextDir, target);
  await writeAsXhtml(dom, absPath);
  return { tocResourceTree };
}

async function processPagelistDocument({
  dom,
  target,
  contextDir,
}: {
  dom: JSDOM;
  target: string;
  contextDir: string;
}): Promise<{ pageListResourceTree: PageListResourceTreeRoot | null }> {
  const pageListResourceTree = parsePageListDocument(dom);
  if (pageListResourceTree) {
    const nav = replaceWithNavElement(dom, pageListResourceTree.element);
    nav.setAttribute('id', PAGELIST_ID);
    nav.setAttribute('epub:type', 'page-list');
  }

  const absPath = upath.join(contextDir, target);
  await writeAsXhtml(dom, absPath);
  return { pageListResourceTree };
}

function buildEpubPackageDocument({
  epubVersion,
  manifest,
  uid,
  docTitle,
  docLanguages,
  spineItems,
  manifestItems,
}: Pick<Parameters<typeof exportEpub>[0], 'epubVersion'> & {
  manifest: PublicationManifest;
  uid: string;
  docTitle: string;
  docLanguages: string[];
  spineItems: SpineEntry[];
  manifestItems: ManifestEntry[];
}): string {
  const slugger = new GithubSlugger();
  slugger.reset();

  const bookIdentifier = slugger.slug('bookid');
  const normalizeDate = (value: string | number | undefined) =>
    value && `${new Date(value).toISOString().split('.')[0]}Z`;

  const transformToGenericTextNode = <T = {}>(value: unknown, attributes?: T) =>
    [value]
      .flat()
      .filter(Boolean)
      .map((v) => ({ ...(attributes || {}), '#text': `${value}` }));
  const transformContributor = (
    contributorMap: Record<string, Contributor | undefined>,
  ) =>
    Object.entries(contributorMap).flatMap(([type, contributor]) =>
      contributor
        ? [contributor].flat().map((entry, index) => ({
            _id: slugger.slug(`${type}-${index + 1}`),
            '#text':
              typeof entry === 'string'
                ? entry
                : normalizeLocalizableString(entry.name, docLanguages),
          }))
        : [],
    );

  const itemIdMap = new Map<string, string>();
  manifestItems.forEach(({ href }) => {
    itemIdMap.set(href, slugger.slug(href));
  });

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    attributeNamePrefix: '_',
  });
  return builder.build({
    '?xml': {
      _version: '1.0',
      _encoding: 'UTF-8',
    },
    package: {
      _xmlns: 'http://www.idpf.org/2007/opf',
      _version: epubVersion,
      '_unique-identifier': bookIdentifier,
      '_xml:lang': docLanguages[0],
      metadata: {
        '_xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'dc:identifier': {
          _id: bookIdentifier,
          '#text': uid,
        },
        'dc:title': docTitle,
        'dc:language': docLanguages,
        'dc:creator': transformContributor({
          // TODO: Define proper order
          author: manifest.author,
          creator: manifest.creator,
          editor: manifest.editor,
          artist: manifest.artist,
          illustrator: manifest.illustrator,
          colorist: manifest.colorist,
          penciler: manifest.penciler,
          inker: manifest.inker,
          letterer: manifest.letterer,
          translator: manifest.translator,
          readBy: manifest.readBy,
        }),
        'dc:publisher': transformContributor({
          publisher: manifest.publisher,
        }),
        'dc:contributor': transformContributor({
          contributor: manifest.contributor,
        }),
        'dc:date': transformToGenericTextNode(
          normalizeDate(manifest.datePublished),
        ),
        'dc:rights': transformToGenericTextNode(
          manifest.copyrightHolder &&
            `© ${manifest.copyrightYear ? `${manifest.copyrightYear} ` : ''}${
              manifest.copyrightHolder
            }`,
        ),
        'dc:subject': transformToGenericTextNode(
          manifest['dc:subject'] || manifest.subject,
        ),
        meta: [
          ...transformToGenericTextNode(
            normalizeDate(manifest.dateModified || Date.now()),
            {
              _property: 'dcterms:modified',
            },
          ),
          ...(() => {
            const coverImage = manifestItems.find(
              (it) => it.properties === 'cover-image',
            );
            return coverImage
              ? [{ _name: 'cover', _content: itemIdMap.get(coverImage.href) }]
              : [];
          })(),
        ],
      },
      manifest: {
        item: manifestItems.map(({ href, mediaType, properties }) => ({
          _id: itemIdMap.get(href),
          _href: encodeURI(href),
          '_media-type': mediaType,
          ...(properties ? { _properties: properties } : {}),
        })),
      },
      spine: {
        ...(manifest.readingProgression
          ? { '_page-progression-direction': manifest.readingProgression }
          : {}),
        itemref: [
          ...spineItems.map(({ href }) => ({
            _idref: itemIdMap.get(href),
          })),
        ],
      },
    },
  });
}

async function compressEpub({
  target,
  sourceDir,
}: {
  target: string;
  sourceDir: string;
}): Promise<void> {
  Logger.debug(`Compressing EPUB: ${target}`);
  const output = fs.createWriteStream(target);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level
  });
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      Logger.debug(`Compressed EPUB: ${target}`);
      resolve();
    });
    output.on('error', reject);
    archive.on('warning', reject);
    archive.on('error', reject);
    archive.pipe(output);

    archive.append('application/epub+zip', {
      name: 'mimetype',
      // mimetype should not be compressed
      // https://www.w3.org/TR/epub-33/#sec-zip-container-mime
      store: true,
    });
    archive.directory(upath.join(sourceDir, 'META-INF'), 'META-INF');
    archive.directory(upath.join(sourceDir, 'EPUB'), 'EPUB');
    archive.finalize();
  });
}
