# JavaScript API

<!-- START JavaScript API -->
## Exported members

### Functions

- [`build`](#build)
- [`createVitePlugin`](#createviteplugin)
- [`init`](#init)
- [`preview`](#preview)

### Type Aliases

- [`StructuredDocument`](#structureddocument)
- [`StructuredDocumentSection`](#structureddocumentsection)
- [`VivliostyleConfigSchema`](#vivliostyleconfigschema)

## Functions

### build()

> **build**(`options`): `Promise`\<`void`\>

Build publication file(s) from the given configuration.

```ts
import { build } from '@vivliostyle/cli';
build({
  configPath: './vivliostyle.config.js',
  logLevel: 'silent',
});
```

#### Parameters

• **options**

• **options.author?**: `string` = `...`

• **options.bleed?**: `string` = `...`

• **options.browser?**: `"chromium"` \| `"firefox"` \| `"webkit"` = `...`

• **options.config?**: `string` = `...`

• **options.configData?**: `null` \| `object` & `object` \| `object` & `object`[] = `...`

• **options.cropMarks?**: `boolean` = `...`

• **options.cropOffset?**: `string` = `...`

• **options.css?**: `string` = `...`

• **options.cwd?**: `string` = `...`

• **options.enableStaticServe?**: `boolean` = `...`

• **options.enableViewerStartPage?**: `boolean` = `...`

• **options.executableBrowser?**: `string` = `...`

• **options.ignoreHttpsErrors?**: `boolean` = `...`

• **options.image?**: `string` = `...`

• **options.input?**: `string` = `...`

• **options.language?**: `string` = `...`

• **options.logLevel?**: `"silent"` \| `"info"` \| `"verbose"` \| `"debug"` = `...`

• **options.openViewer?**: `boolean` = `...`

• **options.output?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.preflight?**: `"press-ready"` \| `"press-ready-local"` = `...`

• **options.preflightOption?**: `string` \| `string`[] = `...`

• **options.pressReady?**: `boolean` = `...`

• **options.proxyBypass?**: `string` = `...`

• **options.proxyPass?**: `string` = `...`

• **options.proxyServer?**: `string` = `...`

• **options.proxyUser?**: `string` = `...`

• **options.quick?**: `boolean` = `...`

• **options.readingProgression?**: `"ltr"` \| `"rtl"` = `...`

• **options.renderMode?**: `"local"` \| `"docker"` = `...`

• **options.sandbox?**: `boolean` = `...`

• **options.singleDoc?**: `boolean` = `...`

• **options.size?**: `string` = `...`

• **options.style?**: `string` = `...`

• **options.theme?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.timeout?**: `number` = `...`

• **options.title?**: `string` = `...`

• **options.userStyle?**: `string` = `...`

• **options.viewer?**: `string` = `...`

• **options.viewerParam?**: `string` = `...`

#### Returns

`Promise`\<`void`\>

***

### createVitePlugin()

> **createVitePlugin**(`inlineConfig`): `Promise`\<`Plugin`[]\>

#### Parameters

• **inlineConfig** = `{}`

• **inlineConfig.author?**: `string` = `...`

• **inlineConfig.bleed?**: `string` = `...`

• **inlineConfig.browser?**: `"chromium"` \| `"firefox"` \| `"webkit"` = `...`

• **inlineConfig.config?**: `string` = `...`

• **inlineConfig.configData?**: `null` \| `object` & `object` \| `object` & `object`[] = `...`

• **inlineConfig.cropMarks?**: `boolean` = `...`

• **inlineConfig.cropOffset?**: `string` = `...`

• **inlineConfig.css?**: `string` = `...`

• **inlineConfig.cwd?**: `string` = `...`

• **inlineConfig.enableStaticServe?**: `boolean` = `...`

• **inlineConfig.enableViewerStartPage?**: `boolean` = `...`

• **inlineConfig.executableBrowser?**: `string` = `...`

• **inlineConfig.ignoreHttpsErrors?**: `boolean` = `...`

• **inlineConfig.image?**: `string` = `...`

• **inlineConfig.input?**: `string` = `...`

• **inlineConfig.language?**: `string` = `...`

• **inlineConfig.logLevel?**: `"silent"` \| `"info"` \| `"verbose"` \| `"debug"` = `...`

• **inlineConfig.openViewer?**: `boolean` = `...`

• **inlineConfig.output?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **inlineConfig.preflight?**: `"press-ready"` \| `"press-ready-local"` = `...`

• **inlineConfig.preflightOption?**: `string` \| `string`[] = `...`

• **inlineConfig.pressReady?**: `boolean` = `...`

• **inlineConfig.proxyBypass?**: `string` = `...`

• **inlineConfig.proxyPass?**: `string` = `...`

• **inlineConfig.proxyServer?**: `string` = `...`

• **inlineConfig.proxyUser?**: `string` = `...`

• **inlineConfig.quick?**: `boolean` = `...`

• **inlineConfig.readingProgression?**: `"ltr"` \| `"rtl"` = `...`

• **inlineConfig.renderMode?**: `"local"` \| `"docker"` = `...`

• **inlineConfig.sandbox?**: `boolean` = `...`

• **inlineConfig.singleDoc?**: `boolean` = `...`

• **inlineConfig.size?**: `string` = `...`

• **inlineConfig.style?**: `string` = `...`

• **inlineConfig.theme?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **inlineConfig.timeout?**: `number` = `...`

• **inlineConfig.title?**: `string` = `...`

• **inlineConfig.userStyle?**: `string` = `...`

• **inlineConfig.viewer?**: `string` = `...`

• **inlineConfig.viewerParam?**: `string` = `...`

#### Returns

`Promise`\<`Plugin`[]\>

***

### init()

> **init**(`options`): `Promise`\<`void`\>

Initialize a new vivliostyle.config.js file.

#### Parameters

• **options**

• **options.author?**: `string` = `...`

• **options.bleed?**: `string` = `...`

• **options.browser?**: `"chromium"` \| `"firefox"` \| `"webkit"` = `...`

• **options.config?**: `string` = `...`

• **options.configData?**: `null` \| `object` & `object` \| `object` & `object`[] = `...`

• **options.cropMarks?**: `boolean` = `...`

• **options.cropOffset?**: `string` = `...`

• **options.css?**: `string` = `...`

• **options.cwd?**: `string` = `...`

• **options.enableStaticServe?**: `boolean` = `...`

• **options.enableViewerStartPage?**: `boolean` = `...`

• **options.executableBrowser?**: `string` = `...`

• **options.ignoreHttpsErrors?**: `boolean` = `...`

• **options.image?**: `string` = `...`

• **options.input?**: `string` = `...`

• **options.language?**: `string` = `...`

• **options.logLevel?**: `"silent"` \| `"info"` \| `"verbose"` \| `"debug"` = `...`

• **options.openViewer?**: `boolean` = `...`

• **options.output?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.preflight?**: `"press-ready"` \| `"press-ready-local"` = `...`

• **options.preflightOption?**: `string` \| `string`[] = `...`

• **options.pressReady?**: `boolean` = `...`

• **options.proxyBypass?**: `string` = `...`

• **options.proxyPass?**: `string` = `...`

• **options.proxyServer?**: `string` = `...`

• **options.proxyUser?**: `string` = `...`

• **options.quick?**: `boolean` = `...`

• **options.readingProgression?**: `"ltr"` \| `"rtl"` = `...`

• **options.renderMode?**: `"local"` \| `"docker"` = `...`

• **options.sandbox?**: `boolean` = `...`

• **options.singleDoc?**: `boolean` = `...`

• **options.size?**: `string` = `...`

• **options.style?**: `string` = `...`

• **options.theme?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.timeout?**: `number` = `...`

• **options.title?**: `string` = `...`

• **options.userStyle?**: `string` = `...`

• **options.viewer?**: `string` = `...`

• **options.viewerParam?**: `string` = `...`

#### Returns

`Promise`\<`void`\>

***

### preview()

> **preview**(`options`): `Promise`\<`void`\>

Open a browser for previewing the publication.

#### Parameters

• **options**

• **options.author?**: `string` = `...`

• **options.bleed?**: `string` = `...`

• **options.browser?**: `"chromium"` \| `"firefox"` \| `"webkit"` = `...`

• **options.config?**: `string` = `...`

• **options.configData?**: `null` \| `object` & `object` \| `object` & `object`[] = `...`

• **options.cropMarks?**: `boolean` = `...`

• **options.cropOffset?**: `string` = `...`

• **options.css?**: `string` = `...`

• **options.cwd?**: `string` = `...`

• **options.enableStaticServe?**: `boolean` = `...`

• **options.enableViewerStartPage?**: `boolean` = `...`

• **options.executableBrowser?**: `string` = `...`

• **options.ignoreHttpsErrors?**: `boolean` = `...`

• **options.image?**: `string` = `...`

• **options.input?**: `string` = `...`

• **options.language?**: `string` = `...`

• **options.logLevel?**: `"silent"` \| `"info"` \| `"verbose"` \| `"debug"` = `...`

• **options.openViewer?**: `boolean` = `...`

• **options.output?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.preflight?**: `"press-ready"` \| `"press-ready-local"` = `...`

• **options.preflightOption?**: `string` \| `string`[] = `...`

• **options.pressReady?**: `boolean` = `...`

• **options.proxyBypass?**: `string` = `...`

• **options.proxyPass?**: `string` = `...`

• **options.proxyServer?**: `string` = `...`

• **options.proxyUser?**: `string` = `...`

• **options.quick?**: `boolean` = `...`

• **options.readingProgression?**: `"ltr"` \| `"rtl"` = `...`

• **options.renderMode?**: `"local"` \| `"docker"` = `...`

• **options.sandbox?**: `boolean` = `...`

• **options.singleDoc?**: `boolean` = `...`

• **options.size?**: `string` = `...`

• **options.style?**: `string` = `...`

• **options.theme?**: `string` \| `object` & `object` \| (`string` \| `object` & `object`)[] = `...`

• **options.timeout?**: `number` = `...`

• **options.title?**: `string` = `...`

• **options.userStyle?**: `string` = `...`

• **options.viewer?**: `string` = `...`

• **options.viewerParam?**: `string` = `...`

#### Returns

`Promise`\<`void`\>

## Type Aliases

### StructuredDocument

> **StructuredDocument**: `object`

#### Type declaration

| Name | Type |
| ------ | ------ |
| `children` | [`StructuredDocument`](api-javascript.md#structureddocument)[] |
| `href` | `string` |
| `sections`? | [`StructuredDocumentSection`](api-javascript.md#structureddocumentsection)[] |
| `title` | `string` |

#### See

https://github.com/vivliostyle/vivliostyle-cli/blob/main/docs/config.md

***

### StructuredDocumentSection

> **StructuredDocumentSection**: `object`

#### Type declaration

| Name | Type |
| ------ | ------ |
| `children` | [`StructuredDocumentSection`](api-javascript.md#structureddocumentsection)[] |
| `headingHtml` | `string` |
| `headingText` | `string` |
| `href`? | `string` |
| `id`? | `string` |
| `level` | `number` |

#### See

https://github.com/vivliostyle/vivliostyle-cli/blob/main/docs/config.md

***

### VivliostyleConfigSchema

> **VivliostyleConfigSchema**: `v.InferInput`\<*typeof* [`VivliostyleConfigSchema`](api-javascript.md#vivliostyleconfigschema)\>

#### See

https://github.com/vivliostyle/vivliostyle-cli/blob/main/docs/config.md

<!-- END JavaScript API -->
