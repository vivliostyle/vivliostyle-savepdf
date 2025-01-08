# Config Reference

The configuration files `vivliostyle.config.js` and `vivliostyle.config.json` accept the [`VivliostyleConfigSchema`](#vivliostyleconfigschema) for configuring the Vivliostyle CLI. You can also refer to the type schema of the configuration from TypeScript files.

```ts
import { VivliostyleConfigSchema } from '@vivliostyle/cli';
```

## Config API

<!-- START config API -->
### VivliostyleConfigSchema

#### Type definition

```ts
type VivliostyleConfigSchema =
  | BuildTask[]
  | BuildTask;
```

### BuildTask

#### Properties

- `BuildTask`

  - `entry`: (string | [ContentsEntryConfig](#contentsentryconfig) | [CoverEntryConfig](#coverentryconfig) | [ArticleEntryConfig](#articleentryconfig))[] | [ArticleEntryConfig](#articleentryconfig) | string  
    Entry file(s) of the document.

  - `title`: string  
    Title of the document.

  - `author`: string  
    Author of the document.

  - `theme`: ([ThemeConfig](#themeconfig) | string)[] | [ThemeConfig](#themeconfig) | string  
    Theme package path(s) or URL(s) of the CSS file.

  - `entryContext`: string  
    Directory containing the referenced entry file(s).

  - `output`: ([OutputConfig](#outputconfig) | string)[] | [OutputConfig](#outputconfig) | string  
    Output options.

  - `workspaceDir`: string  
    Directory where intermediate files (e.g., manuscript HTMLs, publication.json) are saved. (default: `.vivliostyle`)

  - ~~`includeAssets`~~ _Deprecated_  
    Use `copyAsset.includes` instead.

  - `copyAsset`: [CopyAssetConfig](#copyassetconfig)  
    Options for asset files to be copied when exporting output.

  - `size`: string  
    PDF output size. (default: `letter`)
    - Preset: `A5`, `A4`, `A3`, `B5`, `B4`, `JIS-B5`, `JIS-B4`, `letter`, `legal`, `ledger`
    - Custom (comma-separated): `182mm,257mm` or `8.5in,11in`

  - `pressReady`: boolean  
    Generate a press-ready PDF compatible with PDF/X-1a. (default: `false`)
    This option is equivalent to setting `"preflight": "press-ready"`.

  - `language`: string  
    Language of the document.

  - `readingProgression`: "ltr" | "rtl"  
    Specifies the reading progression of the document.
    This is typically determined automatically by the CSS writing-mode.
    Use this option only if explicit configuration is needed.

  - `toc`: [TocConfig](#tocconfig) | boolean | string  
    Options for Table of Contents (ToC) documents.

  - ~~`tocTitle`~~ _Deprecated_  
    Use `toc.title` instead

  - `cover`: [CoverConfig](#coverconfig) | string  
    Options for cover images and cover page documents.

  - `timeout`: number  
    Timeout limit for waiting for the Vivliostyle process (in ms). (default: `120000`)

  - `documentProcessor`: (option: import("@vivliostyle/vfm").StringifyMarkdownOptions, metadata: import("@vivliostyle/vfm").Metadata) => import("unified").Processor  
    Custom function to provide a unified Processor for converting markdown to HTML.

  - `vfm`: [VfmConfig](#vfmconfig)  
    Options for converting Markdown into a stringified format (HTML).

  - `image`: string  
    Docker image used for rendering.

  - ~~`http`~~ _Deprecated_  
    This option is enabled by default, and the file protocol is no longer supported.

  - `viewer`: string  
    URL of a custom viewer to display content instead of the default Vivliostyle CLI viewer.
    Useful for using a custom viewer with staging features (e.g., `https://vivliostyle.vercel.app/`).

  - `viewerParam`: string  
    Parameters for the Vivliostyle viewer (e.g., `allowScripts=false&pixelRatio=16`).

  - `browser`: "chromium" | "firefox" | "webkit"  
    EXPERIMENTAL SUPPORT: Specifies the browser type for launching the Vivliostyle viewer.
    Currently, Firefox and Webkit support only the preview command.

  - `base`: string  
    Base path of the served documents. (default: `/vivliostyle`)

  - `server`: [ServerConfig](#serverconfig)  
    Options for the preview server.

  - `static`: {[key: (string)]: (string)[] | string}  
    Specifies static files to be served by the preview server.
    ```js
    export default {
      static: {
        '/static': 'path/to/static',
        '/': ['root1', 'root2'],
      },
    };
    ```

  - `temporaryFilePrefix`: string  
    Prefix for temporary file names.

  - `vite`: import("vite").UserConfig  
    Configuration options for the Vite server.

  - `viteConfigFile`: string | boolean  
    Path to the Vite config file.
    If a falsy value is provided, Vivliostyle CLI ignores the existing Vite config file.

#### Type definition

```ts
type BuildTask = {
  entry:
    | (
        | string
        | ContentsEntryConfig
        | CoverEntryConfig
        | ArticleEntryConfig
      )[]
    | ArticleEntryConfig
    | string;
  title?: string;
  author?: string;
  theme?:
    | (ThemeConfig | string)[]
    | ThemeConfig
    | string;
  entryContext?: string;
  output?:
    | (OutputConfig | string)[]
    | OutputConfig
    | string;
  workspaceDir?: string;
  includeAssets?: string[] | string;
  copyAsset?: CopyAssetConfig;
  size?: string;
  pressReady?: boolean;
  language?: string;
  readingProgression?: "ltr" | "rtl";
  toc?: TocConfig | boolean | string;
  tocTitle?: string;
  cover?: CoverConfig | string;
  timeout?: number;
  documentProcessor?: (
    option: import("@vivliostyle/vfm").StringifyMarkdownOptions,
    metadata: import("@vivliostyle/vfm").Metadata,
  ) => import("unified").Processor;
  vfm?: VfmConfig;
  image?: string;
  http?: boolean;
  viewer?: string;
  viewerParam?: string;
  browser?:
    | "chromium"
    | "firefox"
    | "webkit";
  base?: string;
  server?: ServerConfig;
  static?: {
    [key: string]: string[] | string;
  };
  temporaryFilePrefix?: string;
  vite?: import("vite").UserConfig;
  viteConfigFile?: string | boolean;
};
```

### ContentsEntryConfig

#### Properties

- `ContentsEntryConfig`

  - `rel`: "contents"

  - `path`: string

  - `output`: string

  - `title`: string

  - `theme`: ([ThemeConfig](#themeconfig) | string)[] | [ThemeConfig](#themeconfig) | string

  - `pageBreakBefore`: ("left" | "right" | "recto" | "verso")  
    Specifies the page break position before this document.
    Useful for determining which side the first page of the document should be placed on in a two-page spread.

  - `pageCounterReset`: number  
    Resets the starting page number of this document to the specified integer.
    Useful for controlling page numbers when including a page.

#### Type definition

```ts
type ContentsEntryConfig = {
  rel: "contents";
  path?: string;
  output?: string;
  title?: string;
  theme?:
    | (ThemeConfig | string)[]
    | ThemeConfig
    | string;
  pageBreakBefore?:
    | "left"
    | "right"
    | "recto"
    | "verso";
  pageCounterReset?: number;
};
```

### ThemeConfig

#### Properties

- `ThemeConfig`

  - `specifier`: string  
    The specifier name for importing the theme package or the path to a CSS file.
    - An npm-style package argument is allowed (e.g., `@vivliostyle/theme-academic@1`, `./local-pkg`).
    - A URL or a local path to a CSS file is allowed (e.g., `./style.css`, `https://example.com/style.css`).

  - `import`: (string)[] | string  
    The path(s) to the CSS file(s) to import from the package.
    Specify this if you want to import files other than the default.

#### Type definition

```ts
type ThemeConfig = {
  specifier: string;
  import?: string[] | string;
};
```

### CoverEntryConfig

#### Properties

- `CoverEntryConfig`

  - `rel`: "cover"

  - `path`: string

  - `output`: string

  - `title`: string

  - `theme`: ([ThemeConfig](#themeconfig) | string)[] | [ThemeConfig](#themeconfig) | string

  - `imageSrc`: string

  - `imageAlt`: string

  - `pageBreakBefore`: ("left" | "right" | "recto" | "verso")  
    Specifies the page break position before this document.
    Useful for determining which side the first page of the document should be placed on in a two-page spread.

#### Type definition

```ts
type CoverEntryConfig = {
  rel: "cover";
  path?: string;
  output?: string;
  title?: string;
  theme?:
    | (ThemeConfig | string)[]
    | ThemeConfig
    | string;
  imageSrc?: string;
  imageAlt?: string;
  pageBreakBefore?:
    | "left"
    | "right"
    | "recto"
    | "verso";
};
```

### ArticleEntryConfig

#### Properties

- `ArticleEntryConfig`

  - `path`: string

  - `output`: string

  - `title`: string

  - `theme`: ([ThemeConfig](#themeconfig) | string)[] | [ThemeConfig](#themeconfig) | string

  - `encodingFormat`: string

  - `rel`: (string)[] | string

#### Type definition

```ts
type ArticleEntryConfig = {
  path: string;
  output?: string;
  title?: string;
  theme?:
    | (ThemeConfig | string)[]
    | ThemeConfig
    | string;
  encodingFormat?: string;
  rel?: string[] | string;
};
```

### OutputConfig

#### Properties

- `OutputConfig`

  - `path`: string  
    Specifies the output file name or directory. (default: `<title>.pdf`)

  - `format`: "pdf" | "epub" | "webpub"  
    Specifies the output format.

  - `renderMode`: "local" | "docker"  
    If set to `docker`, Vivliostyle will render the PDF using a Docker container. (default: `local`)

  - `preflight`: "press-ready" | "press-ready-local"  
    Apply the process to generate a print-ready PDF.

  - `preflightOption`: (string)[]  
    Options for the preflight process (e.g., `gray-scale`, `enforce-outline`).
    Refer to the press-ready documentation for more information: [press-ready](https://github.com/vibranthq/press-ready)

#### Type definition

```ts
type OutputConfig = {
  path: string;
  format?: "pdf" | "epub" | "webpub";
  renderMode?: "local" | "docker";
  preflight?:
    | "press-ready"
    | "press-ready-local";
  preflightOption?: string[];
};
```

### CopyAssetConfig

#### Properties

- `CopyAssetConfig`

  - `includes`: (string)[]  
    Directories and files to include as asset files. Supports wildcard characters for glob patterns.

  - `excludes`: (string)[]  
    Directories and files to exclude from asset files. Supports wildcard characters for glob patterns.

  - `includeFileExtensions`: (string)[]  
    File extensions to include as asset files. (default: `[png, jpg, jpeg, svg, gif, webp, apng, ttf, otf, woff, woff2]`)

  - `excludeFileExtensions`: (string)[]  
    File extensions to exclude from asset files.

#### Type definition

```ts
type CopyAssetConfig = {
  includes?: string[];
  excludes?: string[];
  includeFileExtensions?: string[];
  excludeFileExtensions?: string[];
};
```

### TocConfig

#### Properties

- `TocConfig`

  - `title`: string  
    Title of the generated ToC document.

  - `htmlPath`: string  
    Location where the generated ToC document will be saved. (default: `index.html`)

  - `sectionDepth`: number  
    Depth of sections to include in the ToC document. (default: `0`)

  - `transformDocumentList`: (nodeList: [StructuredDocument](#structureddocument)[]) => (propsList: { children: any }[]) => any  
    Function to transform the document list.

  - `transformSectionList`: (nodeList: [StructuredDocumentSection](#structureddocumentsection)[]) => (propsList: { children: any }[]) => any  
    Function to transform the section list.

#### Type definition

```ts
type TocConfig = {
  title?: string;
  htmlPath?: string;
  sectionDepth?: number;
  transformDocumentList?: (
    nodeList: StructuredDocument[],
  ) => (
    propsList: { children: any }[],
  ) => any;
  transformSectionList?: (
    nodeList: StructuredDocumentSection[],
  ) => (
    propsList: { children: any }[],
  ) => any;
};
```

### StructuredDocument

#### Properties

- `StructuredDocument`

  - `title`: string

  - `href`: string

  - `children`: ([StructuredDocument](#structureddocument))[]

  - `sections`: ([StructuredDocumentSection](#structureddocumentsection))[]

#### Type definition

```ts
type StructuredDocument = {
  title: string;
  href: string;
  children: StructuredDocument[];
  sections?: StructuredDocumentSection[];
};
```

### StructuredDocumentSection

#### Properties

- `StructuredDocumentSection`

  - `headingHtml`: string

  - `headingText`: string

  - `level`: number

  - `children`: ([StructuredDocumentSection](#structureddocumentsection))[]

  - `href`: string

  - `id`: string

#### Type definition

```ts
type StructuredDocumentSection = {
  headingHtml: string;
  headingText: string;
  level: number;
  children: StructuredDocumentSection[];
  href?: string;
  id?: string;
};
```

### CoverConfig

#### Properties

- `CoverConfig`

  - `src`: string  
    Path to the cover image for the cover page.

  - `name`: string  
    Alternative text for the cover image.

  - `htmlPath`: string | boolean  
    Path where the generated cover document will be saved. (default: `cover.html`)
    If set to a falsy value, the cover document will not be generated.

#### Type definition

```ts
type CoverConfig = {
  src: string;
  name?: string;
  htmlPath?: string | boolean;
};
```

### VfmConfig

#### Properties

- `VfmConfig`

  - `style`: (string)[] | string  
    Path(s) or URL(s) to custom stylesheets.

  - `partial`: boolean  
    Output markdown fragments instead of a full document.

  - `title`: string  
    Title of the document (ignored in partial mode).

  - `language`: string  
    Language of the document (ignored in partial mode).

  - `replace`: ({test: RegExp; match: (result: RegExpMatchArray, h: any) => Object | string})[]  
    Handlers for replacing matched HTML strings.

  - `hardLineBreaks`: boolean  
    Insert `<br>` tags at hard line breaks without requiring spaces.

  - `disableFormatHtml`: boolean  
    Disable automatic HTML formatting.

  - `math`: boolean  
    Enable support for math syntax.

#### Type definition

```ts
type VfmConfig = {
  style?: string[] | string;
  partial?: boolean;
  title?: string;
  language?: string;
  replace?: {
    test: RegExp;
    match: (
      result: RegExpMatchArray,
      h: any,
    ) => Object | string;
  }[];
  hardLineBreaks?: boolean;
  disableFormatHtml?: boolean;
  math?: boolean;
};
```

### ServerConfig

#### Properties

- `ServerConfig`

  - `host`: boolean | string  
    IP address the server should listen on.
    Set to `true` to listen on all addresses.
    (default: `true` if a PDF build with Docker render mode is required, otherwise `false`)

  - `port`: number  
    Port the server should listen on. (default: `13000`)

  - `proxy`: {[key: (string)]: import("vite").ProxyOptions | string}  
    Custom proxy rules for the Vivliostyle preview server.

#### Type definition

```ts
type ServerConfig = {
  host?: boolean | string;
  port?: number;
  proxy?: {
    [key: string]:
      | import("vite").ProxyOptions
      | string;
  };
};
```
<!-- END config API -->
