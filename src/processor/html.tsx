import jsdom, {
  ResourceLoader as BaseResourceLoader,
  JSDOM,
  VirtualConsole,
} from '@vivliostyle/jsdom';
import DOMPurify from 'dompurify';
import { toHtml } from 'hast-util-to-html';
import { fileURLToPath, pathToFileURL } from 'node:url';
import upath from 'upath';
import MIMEType from 'whatwg-mimetype';
import { ManuscriptEntry } from '../config/resolve.js';
import type {
  StructuredDocument,
  StructuredDocumentSection,
} from '../config/schema.js';
import { Logger } from '../logger.js';
import { decodePublicationManifest } from '../output/webbook.js';
import type { PublicationManifest } from '../schema/publication.schema.js';
import {
  DetailError,
  assertPubManifestSchema,
  isValidUri,
  writeFileIfChanged,
} from '../util.js';

export const createVirtualConsole = (onError: (error: DetailError) => void) => {
  const virtualConsole = new jsdom.VirtualConsole();
  /* v8 ignore start */
  virtualConsole.on('error', (message) => {
    Logger.debug('[JSDOM Console] error:', message);
  });
  virtualConsole.on('warn', (message) => {
    Logger.debug('[JSDOM Console] warn:', message);
  });
  virtualConsole.on('log', (message) => {
    Logger.debug('[JSDOM Console] log:', message);
  });
  virtualConsole.on('info', (message) => {
    Logger.debug('[JSDOM Console] info:', message);
  });
  virtualConsole.on('dir', (message) => {
    Logger.debug('[JSDOM Console] dir:', message);
  });
  virtualConsole.on('jsdomError', (error) => {
    // Most of CSS using Paged media will be failed to run CSS parser of JSDOM.
    // We just ignore it because we don't use CSS parse results.
    // https://github.com/jsdom/jsdom/blob/a39e0ec4ce9a8806692d986a7ed0cd565ec7498a/lib/jsdom/living/helpers/stylesheets.js#L33-L44
    // see also: https://github.com/jsdom/jsdom/issues/2005
    if (error.message === 'Could not parse CSS stylesheet') {
      return;
    }
    onError(
      new DetailError(
        'Error occurred when loading content',
        error.stack ?? error.message,
      ),
    );
  });
  /* v8 ignore stop */
  return virtualConsole;
};

export const htmlPurify = DOMPurify(new JSDOM('').window);

export class ResourceLoader extends BaseResourceLoader {
  fetcherMap = new Map<string, jsdom.AbortablePromise<Buffer>>();

  fetch(url: string, options?: jsdom.FetchOptions) {
    Logger.debug(`[JSDOM] Fetching resource: ${url}`);
    const fetcher = super.fetch(url, options);
    if (fetcher) {
      this.fetcherMap.set(url, fetcher);
    }
    return fetcher;
  }

  static async saveFetchedResources({
    fetcherMap,
    rootUrl,
    outputDir,
    onError,
  }: {
    fetcherMap: Map<string, jsdom.AbortablePromise<Buffer>>;
    rootUrl: string;
    outputDir: string;
    onError?: (error: Error) => void;
  }) {
    const rootHref = /^https?:/i.test(new URL(rootUrl).protocol)
      ? new URL('/', rootUrl).href
      : new URL('.', rootUrl).href;

    const normalizeToLocalPath = (urlString: string, mimeType?: string) => {
      let url = new URL(urlString);
      url.hash = '';
      if (mimeType === 'text/html' && !/\.html?$/.test(url.pathname)) {
        url.pathname = `${url.pathname.replace(/\/$/, '')}/index.html`;
      }
      let relTarget = upath.relative(rootHref, url.href);
      return decodeURI(relTarget);
    };

    const fetchedResources: { url: string; encodingFormat?: string }[] = [];
    await Promise.allSettled(
      [...fetcherMap.entries()].flatMap(async ([url, fetcher]) => {
        if (!url.startsWith(rootHref)) {
          return [];
        }
        return (
          fetcher
            .then(async (buffer) => {
              let encodingFormat: string | undefined;
              try {
                const contentType = fetcher.response?.headers['content-type'];
                if (contentType) {
                  encodingFormat = new MIMEType(contentType).essence;
                }
                /* v8 ignore next 3 */
              } catch (e) {
                /* NOOP */
              }
              const relTarget = normalizeToLocalPath(url, encodingFormat);
              const target = upath.join(outputDir, relTarget);
              fetchedResources.push({ url: relTarget, encodingFormat });
              writeFileIfChanged(target, buffer);
            })
            /* v8 ignore next */
            .catch(onError)
        );
      }),
    );
    return fetchedResources;
  }
}

export async function getJsdomFromUrlOrFile({
  src,
  resourceLoader,
  virtualConsole = createVirtualConsole((error) => {
    throw error;
  }),
}: {
  src: string;
  resourceLoader?: ResourceLoader;
  virtualConsole?: VirtualConsole;
}) {
  const url = isValidUri(src) ? new URL(src) : pathToFileURL(src);
  let dom: JSDOM;
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    dom = await JSDOM.fromURL(src, {
      virtualConsole,
      resources: resourceLoader,
    });
  } else if (url.protocol === 'file:') {
    if (resourceLoader) {
      const file = resourceLoader._readFile(fileURLToPath(url));
      resourceLoader.fetcherMap.set(url.href, file);
    }
    dom = await JSDOM.fromFile(fileURLToPath(url), {
      virtualConsole,
      resources: resourceLoader,
      contentType: 'text/html; charset=UTF-8',
    });
  } else {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }
  return dom;
}

export function getJsdomFromString({
  html,
  virtualConsole = createVirtualConsole((error) => {
    throw error;
  }),
}: {
  html: string;
  virtualConsole?: VirtualConsole;
}) {
  return new JSDOM(html, {
    virtualConsole,
  });
}

export async function getStructuredSectionFromHtml(
  htmlPath: string,
  href?: string,
) {
  const dom = await getJsdomFromUrlOrFile({ src: htmlPath });
  const { document } = dom.window;
  const allHeadings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((el) => {
      // Exclude headings contained by blockquote
      // TODO: Make customizable
      return !el.matches('blockquote *');
    })
    .sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      return position & 2 /* DOCUMENT_POSITION_PRECEDING */
        ? 1
        : position & 4 /* DOCUMENT_POSITION_FOLLOWING */
          ? -1
          : 0;
    });

  function traverse(headers: Element[]): StructuredDocumentSection[] {
    if (headers.length === 0) {
      return [];
    }
    const [head, ...tail] = headers;
    const section = head.parentElement!;
    const id = head.id || section.id;
    const level = Number(head.tagName.slice(1));
    let i = tail.findIndex((s) => Number(s.tagName.slice(1)) <= level);
    i = i === -1 ? tail.length : i;
    return [
      {
        headingHtml: htmlPurify.sanitize(head.innerHTML),
        headingText: head.textContent?.trim().replace(/\s+/g, ' ') || '',
        level,
        ...(href && id && { href: `${href}#${encodeURIComponent(id)}` }),
        ...(id && { id }),
        children: traverse(tail.slice(0, i)),
      },
      ...traverse(tail.slice(i)),
    ];
  }
  return traverse(allHeadings);
}

const getTocHtmlStyle = ({
  pageBreakBefore,
  pageCounterReset,
}: {
  pageBreakBefore?: 'recto' | 'verso' | 'left' | 'right';
  pageCounterReset?: number;
}) => {
  if (!pageBreakBefore && typeof pageCounterReset !== 'number') {
    return null;
  }
  return /* css */ `
${
  pageBreakBefore
    ? `:root {
  break-before: ${pageBreakBefore};
}`
    : ''
}
${
  typeof pageCounterReset === 'number'
    ? `@page :nth(1) {
  counter-reset: page ${Math.floor(pageCounterReset - 1)};
}`
    : ''
}
`;
};

type HastElement = import('hast').ElementContent | import('hast').Root;

export const defaultTocTransform = {
  transformDocumentList:
    (nodeList: StructuredDocument[]) =>
    (propsList: { children: HastElement | HastElement[] }[]): HastElement => {
      return (
        <ol>
          {nodeList
            .map((a, i) => [a, propsList[i]] as const)
            .flatMap(
              ([{ href, title, sections }, { children, ...otherProps }]) => {
                // don't display the document title if it has only one top-level H1 heading
                if (sections?.length === 1 && sections[0].level === 1) {
                  return [children].flat().flatMap((e) => {
                    if (e.type === 'element' && e.tagName === 'ol') {
                      return e.children;
                    }
                    return e;
                  });
                }
                return (
                  <li {...otherProps}>
                    <a {...{ href }}>{title}</a>
                    {children}
                  </li>
                );
              },
            )}
        </ol>
      );
    },
  transformSectionList:
    (nodeList: StructuredDocumentSection[]) =>
    (propsList: { children: HastElement | HastElement[] }[]): HastElement => {
      return (
        <ol>
          {nodeList
            .map((a, i) => [a, propsList[i]] as const)
            .map(
              ([{ headingHtml, href, level }, { children, ...otherProps }]) => {
                const headingContent = {
                  type: 'raw',
                  value: headingHtml,
                };
                return (
                  <li {...otherProps} data-section-level={level}>
                    {href ? (
                      <a {...{ href }}>{headingContent}</a>
                    ) : (
                      <span>{headingContent}</span>
                    )}
                    {children}
                  </li>
                );
              },
            )}
        </ol>
      );
    },
};

export function generateDefaultTocHtml({
  language,
  title,
}: {
  language?: string;
  title?: string;
}) {
  const toc = (
    <html lang={language}>
      <head>
        <meta charset="utf-8" />
        <title>{title || ''}</title>
        <style data-vv-style></style>
      </head>
      <body>
        <h1>{title || ''}</h1>
        <nav id="toc" role="doc-toc" />
      </body>
    </html>
  );
  return toHtml(toc);
}

export async function generateTocListSection({
  entries,
  distDir,
  sectionDepth,
  transform = {},
}: {
  entries: Pick<ManuscriptEntry, 'target' | 'title'>[];
  distDir: string;
  sectionDepth: number;
  transform?: Partial<typeof defaultTocTransform>;
}): Promise<string> {
  const {
    transformDocumentList = defaultTocTransform.transformDocumentList,
    transformSectionList = defaultTocTransform.transformSectionList,
  } = transform;

  const structure = await Promise.all(
    entries.map(async (entry) => {
      const href = encodeURI(upath.relative(distDir, entry.target));
      const sections =
        sectionDepth >= 1
          ? await getStructuredSectionFromHtml(entry.target, href)
          : [];
      return {
        title: entry.title || upath.basename(entry.target, '.html'),
        href: encodeURI(upath.relative(distDir, entry.target)),
        sections,
        children: [], // TODO
      };
    }),
  );
  const docToc = transformDocumentList(structure)(
    structure.map((doc) => {
      function renderSectionList(
        sections: StructuredDocumentSection[],
      ): HastElement | HastElement[] {
        const nodeList = sections.flatMap((section) => {
          if (section.level > sectionDepth) {
            return [];
          }
          return section;
        });
        if (nodeList.length === 0) {
          return [];
        }
        return transformSectionList(nodeList)(
          nodeList.map((node) => ({
            children: [renderSectionList(node.children || [])].flat(),
          })),
        );
      }
      return {
        children: [renderSectionList(doc.sections || [])].flat(),
      };
    }),
  );

  return toHtml(docToc, { allowDangerousHtml: true });
}

export async function processTocHtml(
  dom: JSDOM,
  {
    manifestPath,
    tocTitle,
    styleOptions = {},
    entries,
    distDir,
    sectionDepth,
    transform,
  }: Parameters<typeof generateTocListSection>[0] & {
    manifestPath: string;
    tocTitle: string;
    styleOptions?: Parameters<typeof getTocHtmlStyle>[0];
  },
): Promise<JSDOM> {
  const { document } = dom.window;
  if (
    !document.querySelector(
      'link[rel="publication"][type="application/ld+json"]',
    )
  ) {
    const l = document.createElement('link');
    l.setAttribute('rel', 'publication');
    l.setAttribute('type', 'application/ld+json');
    l.setAttribute('href', encodeURI(upath.relative(distDir, manifestPath)));
    document.head.appendChild(l);
  }

  const style = document.querySelector('style[data-vv-style]');
  if (style) {
    const textContent = getTocHtmlStyle(styleOptions);
    if (textContent) {
      style.textContent = textContent;
    } else {
      style.remove();
    }
  }

  const nav = document.querySelector('nav, [role="doc-toc"]');
  if (nav && !nav.hasChildNodes()) {
    const h2 = document.createElement('h2');
    h2.textContent = tocTitle;
    nav.appendChild(h2);
    nav.innerHTML += await generateTocListSection({
      entries,
      distDir,
      sectionDepth,
      transform,
    });
  }
  return dom;
}

const getCoverHtmlStyle = ({
  pageBreakBefore,
}: {
  pageBreakBefore?: 'recto' | 'verso' | 'left' | 'right';
}) => /* css */ `
${
  pageBreakBefore
    ? `:root {
  break-before: ${pageBreakBefore};
}`
    : ''
}
body {
  margin: 0;
}
[role="doc-cover"] {
  display: block;
  width: 100vw;
  height: 100vh;
  object-fit: contain;
}
@page {
  margin: 0;
}
`;

export function generateDefaultCoverHtml({
  language,
  title,
}: {
  language?: string;
  title?: string;
}) {
  const toc = (
    <html lang={language}>
      <head>
        <meta charset="utf-8" />
        <title>{title || ''}</title>
        <style data-vv-style></style>
      </head>
      <body>
        <section role="region" aria-label="Cover">
          <img role="doc-cover" />
        </section>
      </body>
    </html>
  );
  return toHtml(toc);
}

export async function processCoverHtml(
  dom: JSDOM,
  {
    imageSrc,
    imageAlt,
    styleOptions = {},
  }: {
    imageSrc: string;
    imageAlt: string;
    styleOptions?: Parameters<typeof getCoverHtmlStyle>[0];
  },
): Promise<JSDOM> {
  const { document } = dom.window;
  const style = document.querySelector('style[data-vv-style]');
  if (style) {
    const textContent = getCoverHtmlStyle(styleOptions);
    if (textContent) {
      style.textContent = textContent;
    } else {
      style.remove();
    }
  }

  const cover = document.querySelector('img[role="doc-cover"]');
  if (cover && !cover.hasAttribute('src')) {
    cover.setAttribute('src', encodeURI(imageSrc));
  }
  if (cover && !cover.hasAttribute('alt')) {
    cover.setAttribute('alt', imageAlt);
  }
  return dom;
}

export async function processManuscriptHtml(
  dom: JSDOM,
  {
    title,
    style,
    contentType,
    language,
  }: {
    title?: string;
    style?: string[];
    contentType?: 'text/html' | 'application/xhtml+xml';
    language?: string | null;
  },
): Promise<JSDOM> {
  const { document } = dom.window;
  if (title) {
    if (!document.querySelector('title')) {
      const t = document.createElement('title');
      document.head.appendChild(t);
    }
    document.title = title;
  }
  for (const s of style ?? []) {
    const l = document.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', encodeURI(s));
    document.head.appendChild(l);
  }
  if (language) {
    if (contentType === 'application/xhtml+xml') {
      if (!document.documentElement.getAttribute('xml:lang')) {
        document.documentElement.setAttribute('lang', language);
        document.documentElement.setAttribute('xml:lang', language);
      }
    } else {
      if (!document.documentElement.getAttribute('lang')) {
        document.documentElement.setAttribute('lang', language);
      }
    }
  }
  return dom;
}

export async function fetchLinkedPublicationManifest({
  dom,
  resourceLoader,
  baseUrl,
}: {
  dom: JSDOM;
  resourceLoader: ResourceLoader;
  baseUrl: string;
}): Promise<{ manifest: PublicationManifest; manifestUrl: string } | null> {
  const { document } = dom.window;

  const linkEl = document.querySelector('link[href][rel="publication"]');
  if (!linkEl) {
    return null;
  }
  const href = linkEl.getAttribute('href')!.trim();
  let manifest: PublicationManifest;
  let manifestUrl = baseUrl;
  if (href.startsWith('#')) {
    const scriptEl = document.getElementById(href.slice(1));
    if (scriptEl?.getAttribute('type') !== 'application/ld+json') {
      return null;
    }
    Logger.debug(`Found embedded publication manifest: ${href}`);
    try {
      manifest = JSON.parse(scriptEl.innerHTML);
    } catch (error) {
      const thrownError = error as Error;
      throw new DetailError(
        'Failed to parse manifest data',
        typeof thrownError.stack,
      );
    }
  } else {
    Logger.debug(`Found linked publication manifest: ${href}`);
    const url = new URL(href, baseUrl);
    manifestUrl = url.href;
    const buffer = await resourceLoader.fetch(url.href);
    if (!buffer) {
      throw new Error(`Failed to fetch manifest JSON file: ${url.href}`);
    }
    const manifestJson = buffer.toString();
    try {
      manifest = JSON.parse(manifestJson);
    } catch (error) {
      const thrownError = error as Error;
      throw new DetailError(
        'Failed to parse manifest data',
        typeof thrownError.stack,
      );
    }
  }

  try {
    assertPubManifestSchema(manifest);
  } catch (error) {
    Logger.logWarn(
      `Publication manifest validation failed. Processing continues, but some problems may occur.\n${error}`,
    );
  }
  return {
    manifest: decodePublicationManifest(manifest),
    manifestUrl,
  };
}

export type TocResourceTreeItem = {
  element: HTMLElement;
  label: HTMLElement;
  children?: TocResourceTreeItem[];
};
export type TocResourceTreeRoot = {
  element: HTMLElement;
  heading?: HTMLElement;
  children: TocResourceTreeItem[];
};

export function parseTocDocument(dom: JSDOM): TocResourceTreeRoot | null {
  const { document } = dom.window;

  const docTocEl = document.querySelectorAll('[role="doc-toc"]');
  if (docTocEl.length === 0) {
    return null;
  }
  const tocRoot = docTocEl.item(0);

  const parseTocItem = (element: Element): TocResourceTreeItem | null => {
    if (element.tagName !== 'LI') {
      return null;
    }
    const label = element.children.item(0);
    const ol = element.children.item(1);
    if (!label || (label.tagName !== 'A' && label.tagName !== 'SPAN')) {
      return null;
    }
    if (!ol || ol.tagName !== 'OL') {
      return { element: element as HTMLElement, label: label as HTMLElement };
    }
    const children = Array.from(ol.children).reduce<
      TocResourceTreeItem[] | null
    >((acc, val) => {
      if (!acc) {
        return acc;
      }
      const res = parseTocItem(val);
      return res && [...acc, res];
    }, []);
    return (
      children && {
        element: element as HTMLElement,
        label: label as HTMLElement,
        children,
      }
    );
  };

  let heading: HTMLElement | undefined;
  for (let child of Array.from(tocRoot.children)) {
    if (child.tagName === 'OL') {
      const children = Array.from(child.children).reduce<
        TocResourceTreeItem[] | null
      >((acc, val) => {
        if (!acc) {
          return acc;
        }
        const res = parseTocItem(val);
        return res && [...acc, res];
      }, []);
      return children && { element: tocRoot as HTMLElement, heading, children };
    } else if (
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP'].includes(child.tagName)
    ) {
      heading = child as HTMLElement;
    } else {
      return null;
    }
  }
  return null;
}

export type PageListResourceTreeItem = {
  element: HTMLElement;
};
export type PageListResourceTreeRoot = {
  element: HTMLElement;
  heading?: HTMLElement;
  children: PageListResourceTreeItem[];
};

export function parsePageListDocument(
  dom: JSDOM,
): PageListResourceTreeRoot | null {
  const { document } = dom.window;

  const docPageListEl = document.querySelectorAll('[role="doc-pagelist"]');
  if (docPageListEl.length === 0) {
    return null;
  }
  const pageListRoot = docPageListEl.item(0);

  let heading: HTMLElement | undefined;
  for (let child of Array.from(pageListRoot.children)) {
    if (child.tagName === 'OL') {
      const children = Array.from(child.children).reduce<
        PageListResourceTreeItem[] | null
      >((acc, element) => {
        return (
          acc &&
          (element.tagName === 'LI'
            ? [...acc, { element: element as HTMLElement }]
            : null)
        );
      }, []);
      return (
        children && { element: pageListRoot as HTMLElement, heading, children }
      );
    } else if (
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HGROUP'].includes(child.tagName)
    ) {
      heading = child as HTMLElement;
    } else {
      return null;
    }
  }
  return null;
}
