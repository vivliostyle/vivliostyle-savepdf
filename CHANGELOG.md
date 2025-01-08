# [9.0.0-next.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v9.0.0-next.0...v9.0.0-next.1) (2025-01-06)

# [9.0.0-next.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.17.1...v9.0.0-next.0) (2025-01-06)

## [8.17.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.17.0...v8.17.1) (2024-11-27)

### Bug Fixes

- Fix accidental release ([ddd92b3](https://github.com/vivliostyle/vivliostyle-cli/commit/ddd92b31f169fc87d8ab8a6b61cb1e84a4f5eb61))

# [8.17.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.16.2...v8.17.0) (2024-11-27)

### Bug Fixes

- Fix to work `--browser` option ([da522f7](https://github.com/vivliostyle/vivliostyle-cli/commit/da522f7aad8d45e5ea1e77c7778ad450b6a6034e)), closes [#546](https://github.com/vivliostyle/vivliostyle-cli/issues/546)
- Update Vivliostyle.js to 2.30.7: Layout bug fixes ([3e3310c](https://github.com/vivliostyle/vivliostyle-cli/commit/3e3310c6d246002cd3dc261aaf3e7bf9edf26b7e))

### Features

- Update Playwright to 1.49.0 (Chromium 131.0.6778.33) ([eadf6da](https://github.com/vivliostyle/vivliostyle-cli/commit/eadf6da7c6507ff16576b4dbf088c4eec7578e1d))

## [8.16.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.16.1...v8.16.2) (2024-11-18)

### Bug Fixes

- Update Vivliostyle.js to 2.30.6: Bug Fixes ([52e4839](https://github.com/vivliostyle/vivliostyle-cli/commit/52e48399a0060dcdc1d5b52939f7b27088241a86))

## [8.16.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.16.0...v8.16.1) (2024-11-06)

### Bug Fixes

- Fixed to generate tagged PDF ([d75a47d](https://github.com/vivliostyle/vivliostyle-cli/commit/d75a47d5a0911ed5849832a5a82976dbc9f77c93)), closes [#539](https://github.com/vivliostyle/vivliostyle-cli/issues/539)
- Handle symlinks correctly when copying workspace directory ([#536](https://github.com/vivliostyle/vivliostyle-cli/issues/536)) ([a96f678](https://github.com/vivliostyle/vivliostyle-cli/commit/a96f67832c87e2dc528b0fe76edf02832b8fada7))

# [8.16.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.15.0...v8.16.0) (2024-10-21)

### Bug Fixes

- Ensure template files are not copied into webpub/epub ([da93797](https://github.com/vivliostyle/vivliostyle-cli/commit/da9379771c2422c0ac13bc758db19bcc008ccd3b))
- Escape path references that includes non-ascii chars ([ea882d1](https://github.com/vivliostyle/vivliostyle-cli/commit/ea882d16c6755afa0b3afbf1c88a4f54fe5adc1e)), closes [#525](https://github.com/vivliostyle/vivliostyle-cli/issues/525)
- Fix not to include publication.json itself in its resources property ([0c55356](https://github.com/vivliostyle/vivliostyle-cli/commit/0c55356e21444773ca0b65d146b5570ae901b1e3)), closes [#523](https://github.com/vivliostyle/vivliostyle-cli/issues/523)
- Update Vivliostyle.js to 2.30.5: Bug Fixes ([cfe3095](https://github.com/vivliostyle/vivliostyle-cli/commit/cfe3095b5ff5f5a65443b888faafb73ae7430373))

### Features

- add document processor from markdown into html extension point ([919de86](https://github.com/vivliostyle/vivliostyle-cli/commit/919de86fbd5289a50d0075c5a66ca311b1dcd8e3))
- support HTTP Proxy configuration via cli flag or environment variable ([c8f2c69](https://github.com/vivliostyle/vivliostyle-cli/commit/c8f2c69646f95918fd3190e481781c890726877f))
- support ignoreHTTPSErrors when Playwright browser opens a new page ([63f2557](https://github.com/vivliostyle/vivliostyle-cli/commit/63f2557710715b8d6b2383a5ed07e150103211d4))
- Update Playwright to 1.48.1 (Chromium 130.0.6723.31) ([865cf5f](https://github.com/vivliostyle/vivliostyle-cli/commit/865cf5fe5990ec0838a990f1de74ff069e425131))

# [8.15.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.14.1...v8.15.0) (2024-10-03)

### Bug Fixes

- Set a project title if ToC title is not set ([88b227c](https://github.com/vivliostyle/vivliostyle-cli/commit/88b227c07d5048a2b6a2f144ff36b7c954f8dda9))
- Upgreade Prettier formatter to v3 ([1d9ea0c](https://github.com/vivliostyle/vivliostyle-cli/commit/1d9ea0caeb334040ca4776d8e9e418ea813fac2b))

### Features

- Add feature generating ToC/cover documents from existing MD/HTML ([92764d8](https://github.com/vivliostyle/vivliostyle-cli/commit/92764d8a2df2e859502de2ef55ad8c89622e1f0d))
- Renew internal config schema validator ([9e485ab](https://github.com/vivliostyle/vivliostyle-cli/commit/9e485abd65f18de8d1a466acaf14531688397a15))

## [8.14.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.14.0...v8.14.1) (2024-08-20)

### Bug Fixes

- Update Vivliostyle.js to 2.30.4: Bug fix ([4e435ce](https://github.com/vivliostyle/vivliostyle-cli/commit/4e435ceaec3dfb0d2eb24d1fe51499ef5e24299d))

# [8.14.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.13.1...v8.14.0) (2024-08-19)

### Bug Fixes

- Update Vivliostyle.js to 2.30.3: Fix for Chromium 128 ([22609f0](https://github.com/vivliostyle/vivliostyle-cli/commit/22609f0f2cb522941d42f4dfa4715b4bafe81b6e))

### Features

- Update Playwright to 1.46.1 (Chromium 128.0.6613.18) ([d7335d6](https://github.com/vivliostyle/vivliostyle-cli/commit/d7335d645e14ee52eb2c1d9520138718dd5f213c)), closes [#504](https://github.com/vivliostyle/vivliostyle-cli/issues/504)

## [8.13.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.13.0...v8.13.1) (2024-08-11)

### Bug Fixes

- error: cheerio does not provide an export named default ([45a1f6b](https://github.com/vivliostyle/vivliostyle-cli/commit/45a1f6b6e687ac508c97d783ca5cd6521878285a)), closes [#500](https://github.com/vivliostyle/vivliostyle-cli/issues/500)

# [8.13.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.12.1...v8.13.0) (2024-07-25)

### Bug Fixes

- Update Vivliostyle.js to 2.30.2: Bug Fixes ([9fa6aca](https://github.com/vivliostyle/vivliostyle-cli/commit/9fa6aca5a448b17a3b3ba908c9d6345a54331454))

### Features

- Update Playwright to 1.45.2 (Chromium 127.0.6533.17) ([885878f](https://github.com/vivliostyle/vivliostyle-cli/commit/885878ffbead28e27cbf997a66a71cdba33cb247))

## [8.12.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.12.0...v8.12.1) (2024-06-14)

### Bug Fixes

- Update Vivliostyle.js to 2.30.1: Bug Fix ([0990d07](https://github.com/vivliostyle/vivliostyle-cli/commit/0990d070b160bd1c459eaf912643cac63c5f13ef))

# [8.12.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.11.0...v8.12.0) (2024-06-04)

### Features

- Update Playwright to 1.44.1 (Chromium 125.0.6422.14) ([d32d6a4](https://github.com/vivliostyle/vivliostyle-cli/commit/d32d6a4b0e20b63ba70ddd59d0433ae150b1dca0))
- Update Vivliostyle.js to 2.30.0: Chinese UI, Pagination bugfix, and more ([c2330ce](https://github.com/vivliostyle/vivliostyle-cli/commit/c2330ce08d4dbff6a70f0cf136f9fb7465466d56))

# [8.11.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.10.0...v8.11.0) (2024-05-31)

### Bug Fixes

- Reflect manuscript title changes in preview mode ([695a636](https://github.com/vivliostyle/vivliostyle-cli/commit/695a636062e159e5281bf3fdbd69ce472b01e2ef))

### Features

- Support adding sections for generated ToC documents ([9abc3b5](https://github.com/vivliostyle/vivliostyle-cli/commit/9abc3b565b91baecbda6d8a25630355a700f8ecb))
- Update a toc option of vivliostyle.config.js ([7525a6f](https://github.com/vivliostyle/vivliostyle-cli/commit/7525a6fd5ab59ebc5fb26cc880a9d8549b21fa43))

# [8.10.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.9.1...v8.10.0) (2024-05-03)

### Bug Fixes

- Chromium processes and tmp files remain after exit with Ctrl+C on Windows ([548b420](https://github.com/vivliostyle/vivliostyle-cli/commit/548b4200b66add5137cfc87ed7a10477f001cc85)), closes [#479](https://github.com/vivliostyle/vivliostyle-cli/issues/479)
- Display errors that occurred during preview ([f7d14b2](https://github.com/vivliostyle/vivliostyle-cli/commit/f7d14b26a54635d9c552ca34ebb20c83a354c5b5))
- Ensure to work reloading the config file correctly in preview mode ([59a3b33](https://github.com/vivliostyle/vivliostyle-cli/commit/59a3b336c5ee86bf5514d2378e732111c00f80d5))
- Speed up reloading config files ([025581f](https://github.com/vivliostyle/vivliostyle-cli/commit/025581f4abb0da125429e9d7a30802838d2770a1))

### Features

- Update Playwright to 1.43.1 (Chromium 124.0.6367.29) ([07ce938](https://github.com/vivliostyle/vivliostyle-cli/commit/07ce9385b133cd6ebf4ce3299212c37ced0e5229))
- Update Vivliostyle.js to 2.29.0: Update CSS text-spacing support ([4a36af9](https://github.com/vivliostyle/vivliostyle-cli/commit/4a36af92cccb861b3d026004a9f395c64d44da82))

## [8.9.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.9.0...v8.9.1) (2024-03-12)

### Bug Fixes

- Drop support exporting a legacy NCX document ([b7c4fde](https://github.com/vivliostyle/vivliostyle-cli/commit/b7c4fdedb813e6d40fa61cdaadddcc5913a52e6a))
- Drop support setting a legacy `guide` element in EPUB OPF ([21200d6](https://github.com/vivliostyle/vivliostyle-cli/commit/21200d663614310595f0d6f49516ffd49327c5d1))
- Update Vivliostyle.js to 2.28.1: Bug Fix ([e47c2f3](https://github.com/vivliostyle/vivliostyle-cli/commit/e47c2f3fb5fd1008d1e7c1fe5f543a89403ac5ec))

# [8.9.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.8.0...v8.9.0) (2024-03-03)

### Bug Fixes

- Do not generate nav element if `nav[epub:type]` exists in ToC HTML ([8a09ea7](https://github.com/vivliostyle/vivliostyle-cli/commit/8a09ea762f39d66fd51dbfc93a99fe955a705796))
- Improved order of inserting nav elements in EPUB ([177f18e](https://github.com/vivliostyle/vivliostyle-cli/commit/177f18ee4bce883071081f4564bac3add464ccb9))
- Insert titles into generated nav elements in EPUB ([bcc441b](https://github.com/vivliostyle/vivliostyle-cli/commit/bcc441b8fdfa66ec5e14fdc1d6035ff6f9381a18))

### Features

- Update Playwright to 1.42.1 (Chromium 123.0.6312.4) ([6822bdb](https://github.com/vivliostyle/vivliostyle-cli/commit/6822bdbbcc064b660d882fad4836bf82413db52c))
- Update Vivliostyle.js to 2.28.0: Bug fixes and error handling ([0d610db](https://github.com/vivliostyle/vivliostyle-cli/commit/0d610db06ab440af2cf6621b923a3e9ccad1fb48))

# [8.8.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.7.0...v8.8.0) (2024-02-09)

### Features

- Update Vivliostyle.js to 2.27.0: Default stylesheet update and bug fixes ([53146e4](https://github.com/vivliostyle/vivliostyle-cli/commit/53146e4970ca244eb9c45944e39dd7ff6ae62f79))

# [8.7.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.6.0...v8.7.0) (2024-01-22)

### Bug Fixes

- Delete publication.json when given a single input file ([90ecbbb](https://github.com/vivliostyle/vivliostyle-cli/commit/90ecbbb967e8b8bf1267100995852c89bd147282))
- Improve file selector not to include unnecessary files into Webpub/EPUB ([a1921e2](https://github.com/vivliostyle/vivliostyle-cli/commit/a1921e23f5a8b65541f9dfd4ddb6fed4744691cf)), closes [#461](https://github.com/vivliostyle/vivliostyle-cli/issues/461)
- Set version attribute when building EPUB using config ([3721113](https://github.com/vivliostyle/vivliostyle-cli/commit/3721113623e8cbe9cf41479ae0c1ceec6739c047)), closes [#460](https://github.com/vivliostyle/vivliostyle-cli/issues/460)

### Features

- Enable EPUB compression ([5f5e61d](https://github.com/vivliostyle/vivliostyle-cli/commit/5f5e61d3cea4749d69464265677fbdbb24e7c3ef)), closes [#462](https://github.com/vivliostyle/vivliostyle-cli/issues/462)
- Update Playwright to 1.41.1 (Chromium 121.0.6167.57) ([45e6364](https://github.com/vivliostyle/vivliostyle-cli/commit/45e6364c14aefb348924e9ecc59bce7afe396d06))
- Update Vivliostyle.js to 2.26.0: Update CSS text-spacing support ([26d12f8](https://github.com/vivliostyle/vivliostyle-cli/commit/26d12f8e0ad32036693850766a363ec9bd4a8a8e))

# [8.6.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.5.1...v8.6.0) (2023-12-04)

### Bug Fixes

- Update Vivliostyle.js to 2.25.9: Bug Fixes ([2277350](https://github.com/vivliostyle/vivliostyle-cli/commit/2277350e3d47daa7b4f60d20edbb4cad7c17dc7e))

### Features

- Update Playwright to 1.40.1 (Chromium 120.0.6099.28) ([f116090](https://github.com/vivliostyle/vivliostyle-cli/commit/f11609036c8fad3bbf653a313bafafbd1dfe4022))

## [8.5.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.5.0...v8.5.1) (2023-11-06)

### Bug Fixes

- Update VFM to 2.2.1: Bug Fix ([06fbfa9](https://github.com/vivliostyle/vivliostyle-cli/commit/06fbfa958466fd408392e190b786713aefbf95b4))
- Update Vivliostyle.js to 2.25.8: Bug Fix ([7d56caa](https://github.com/vivliostyle/vivliostyle-cli/commit/7d56caa85af81ead4ee44a3755256dbeb71bc4ee))

# [8.5.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.4.1...v8.5.0) (2023-11-03)

### Bug Fixes

- Allow copying assets which is included in gitignore or in symlinks ([f5fd963](https://github.com/vivliostyle/vivliostyle-cli/commit/f5fd963a7b088577f3eb45002777394604841345))
- Allow xhtml/xht files to be used as input of Webbook/EPUB ([9a0590a](https://github.com/vivliostyle/vivliostyle-cli/commit/9a0590ae5b6d70a0bc646f5f3e2f34654248c942))
- Copy .htm files for webbook ([7127c42](https://github.com/vivliostyle/vivliostyle-cli/commit/7127c42a2a16e5c5c88a18ee5967e398c6b628aa))
- Include node_module files for copy targets of webpub ([1a24f89](https://github.com/vivliostyle/vivliostyle-cli/commit/1a24f89672acd3f696309518cfe82ca0582b9ea1))

### Features

- Add the copyAsset option to allow for more fine-tuning of the asset copying process ([62b41f3](https://github.com/vivliostyle/vivliostyle-cli/commit/62b41f3f90d7ffb6a62f0a748b05450cbb856526))
  - The `includeAssets` option is now deprecated.

## [8.4.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.4.0...v8.4.1) (2023-10-24)

### Bug Fixes

- Update Vivliostyle.js to 2.25.7: Bug Fix ([a2fac64](https://github.com/vivliostyle/vivliostyle-cli/commit/a2fac6484010b119eeadba5c74944a105f847947))

# [8.4.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.3.1...v8.4.0) (2023-10-16)

### Features

- disable chromium sandbox by default ([bb82165](https://github.com/vivliostyle/vivliostyle-cli/commit/bb82165545ee5d5ba35a0ef3631950502d2b2ec4)), closes [#446](https://github.com/vivliostyle/vivliostyle-cli/issues/446)
- Update Playwright to 1.39.0 (Chromium 119.0.6045.9) ([fa1d764](https://github.com/vivliostyle/vivliostyle-cli/commit/fa1d764bf48f75201bb4f078562703e1ebbb6405))
- Update VFM to 2.2.0: New features to control sectionization ([da0ec85](https://github.com/vivliostyle/vivliostyle-cli/commit/da0ec856f321a62ebc52d4ca9b2e517214cf640b))

## [8.3.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.3.0...v8.3.1) (2023-10-03)

### Bug Fixes

- Update Vivliostyle.js to 2.25.6: Viewer UI Bug Fixes ([5cbb756](https://github.com/vivliostyle/vivliostyle-cli/commit/5cbb756e4e6443ae77db4e88c561dd7dc9d10965))

# [8.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.2.0...v8.3.0) (2023-09-21)

### Bug Fixes

- Fix logging message when the file is updated during preview ([bb5a44e](https://github.com/vivliostyle/vivliostyle-cli/commit/bb5a44e255aa789d599a647b8d7d61ec47859734))

### Features

- Preview should be terminated when the previewing page is closed ([89f8bb4](https://github.com/vivliostyle/vivliostyle-cli/commit/89f8bb4c506b516da4aa0a96b1a70c25f27b4958))
- Update Playwright to 1.38.0 (Chromium 117.0.5938.62) ([cf1b671](https://github.com/vivliostyle/vivliostyle-cli/commit/cf1b671b8efbf42c7be181647bfac744cb5f3214))

# [8.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.1.2...v8.2.0) (2023-08-10)

### Bug Fixes

- Set lang attributes for generated toc documents ([4c71411](https://github.com/vivliostyle/vivliostyle-cli/commit/4c714116644a9511a398689183327785337fcc9e)), closes [#170](https://github.com/vivliostyle/vivliostyle-cli/issues/170)
- Update Vivliostyle.js to 2.25.5: Bug Fixes ([20449f3](https://github.com/vivliostyle/vivliostyle-cli/commit/20449f389b06a3ca96dc0a7b66ffb2c8565f92c7))

### Features

- Add a feature generating cover HTMLs ([6ff97b5](https://github.com/vivliostyle/vivliostyle-cli/commit/6ff97b5e7e090e61646d14239720340b2d82b123))
- Add pageBreakBefore and pageCounterReset options ([f3d0fbb](https://github.com/vivliostyle/vivliostyle-cli/commit/f3d0fbb2492f8800b04d61013bcd8ca39c98635e))
- Support multiple cover pages ([9f761f5](https://github.com/vivliostyle/vivliostyle-cli/commit/9f761f5ec4075622eb4f61e74f4127b2738a9d36))

## [8.1.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.1.1...v8.1.2) (2023-07-28)

### Bug Fixes

- Update Vivliostyle.js to 2.25.4: Viewer bugfix ([518b401](https://github.com/vivliostyle/vivliostyle-cli/commit/518b4018a2e8d7d8b5f65476f76bc4fab76dfa53))

## [8.1.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.1.0...v8.1.1) (2023-07-25)

### Bug Fixes

- Fix broken release of v8.1.0 ([063a695](https://github.com/vivliostyle/vivliostyle-cli/commit/063a695e376d26cbe07904f2d8b86722d667ba0e)), closes [#429](https://github.com/vivliostyle/vivliostyle-cli/issues/429)

# [8.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.0.1...v8.1.0) (2023-07-25)

### Bug Fixes

- Migrate Jest to Vitest ([e20d817](https://github.com/vivliostyle/vivliostyle-cli/commit/e20d817f6513c6b1805909da783574a76f57f1d7))
- Remove obsoleted cli flags checker ([30ed466](https://github.com/vivliostyle/vivliostyle-cli/commit/30ed466a094cfb929406a3dc858b16a5281b968c))
- Set resources property for web publication manifest ([3d6fa6a](https://github.com/vivliostyle/vivliostyle-cli/commit/3d6fa6a2e1dbf09ae8da9f66d8830836f0553f51))
- Update Vivliostyle.js to 2.25.3: Bug Fixes ([e283af3](https://github.com/vivliostyle/vivliostyle-cli/commit/e283af38179990572da15b8b294261feb3938beb))

### Features

- Add --reading-progression CLI option ([8c4353c](https://github.com/vivliostyle/vivliostyle-cli/commit/8c4353c357cd26960709fad286f144b42f57b788))
- Add a log level option for CLI and JavaScript API ([f3b9b6a](https://github.com/vivliostyle/vivliostyle-cli/commit/f3b9b6ae288b428f54b93ffdc3677dbe07a140e5))
- Add EPUB for output option ([19b1dab](https://github.com/vivliostyle/vivliostyle-cli/commit/19b1dab11128881893d3388dc57455137a74fb18))
- Make --verbose option deprecated ([dab272d](https://github.com/vivliostyle/vivliostyle-cli/commit/dab272df1ec1c2a4d385eeb97c36d6b3e30f6065))
- Support single HTML → webpub convertion ([8b2a87c](https://github.com/vivliostyle/vivliostyle-cli/commit/8b2a87c2b332fbac69a873cb214aec6c8b2e8077))

## [8.0.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v8.0.0...v8.0.1) (2023-06-22)

### Bug Fixes

- config.workspaceDir should be honored when cliFlags.input is given ([1c67007](https://github.com/vivliostyle/vivliostyle-cli/commit/1c670071a22f9d24254f916f25df6a06ff322222)), closes [#402](https://github.com/vivliostyle/vivliostyle-cli/issues/402) [#402](https://github.com/vivliostyle/vivliostyle-cli/issues/402)
- Preserve output directory structure when single imput is set ([b5bc015](https://github.com/vivliostyle/vivliostyle-cli/commit/b5bc015062303cabe325215add0f9ca9044ce4e9))
- preview minimum font-size problem depending on locale on macOS ([c15e9e0](https://github.com/vivliostyle/vivliostyle-cli/commit/c15e9e0a30d0513ef4c6ec3dfc73400d38eabb27)), closes [#399](https://github.com/vivliostyle/vivliostyle-cli/issues/399)
- Update Vivliostyle.js to 2.25.2: Bugfix on variable fonts ([f3e81ca](https://github.com/vivliostyle/vivliostyle-cli/commit/f3e81ca92760bed5b1b291b0025e40fba03b2ec7))

# [8.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.4.0...v8.0.0) (2023-06-12)

### Features

- Update Playwright to 1.35.0 (Chromium 115.0.5790.13) ([1610cac](https://github.com/vivliostyle/vivliostyle-cli/commit/1610cac51d74995d5418084994e1ef04744ae8a6))
- Update Ubuntu version on Docker to jammy (22.04LTS) ([ffbbd99](https://github.com/vivliostyle/vivliostyle-cli/commit/ffbbd99e6a407ce527a21f56bc20384fb768116f)), closes [#410](https://github.com/vivliostyle/vivliostyle-cli/issues/410)
- Upgrade minimum node version ([6e94857](https://github.com/vivliostyle/vivliostyle-cli/commit/6e9485761300750466eadf7c0a48a709af2a80ce))

### BREAKING CHANGES

- Minimum supported version of Node.js becomes v16

# [7.4.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.3.0...v7.4.0) (2023-05-31)

### Bug Fixes

- Update Vivliostyle.js to 2.25.1: Bug Fixes ([5f862ca](https://github.com/vivliostyle/vivliostyle-cli/commit/5f862cad05188d758ca76968e2e98459af50abd7))

### Features

- Update Playwright to 1.34.3 (Chromium 114.0.5735.26) ([8dde831](https://github.com/vivliostyle/vivliostyle-cli/commit/8dde8317e7bd3fb208077cb96477880999ae3560))

# [7.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.5...v7.3.0) (2023-05-15)

### Features

- Update Playwright to 1.33.0 (Chromium 113.0.5672.53) ([101c98e](https://github.com/vivliostyle/vivliostyle-cli/commit/101c98ef12071bac0f93a1e66f5641d20566e694))
- Update Vivliostyle.js to 2.25.0: Support CSS Running Elements ([ca6ff7e](https://github.com/vivliostyle/vivliostyle-cli/commit/ca6ff7e3879572a3c31fb35f7e2ec775174a7b43))

## [7.2.5](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.4...v7.2.5) (2023-04-29)

### Bug Fixes

- Fix dependency issue; fix [#400](https://github.com/vivliostyle/vivliostyle-cli/issues/400) ([b879960](https://github.com/vivliostyle/vivliostyle-cli/commit/b879960c28950924d1ec7478a2954d93fb9003da))

## [7.2.4](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.3...v7.2.4) (2023-04-20)

### Bug Fixes

- Update Vivliostyle.js to 2.24.3: Bug Fixes ([88c1405](https://github.com/vivliostyle/vivliostyle-cli/commit/88c1405be904b2b82833ff1ca3afc2bfd4e0c1e0))

## [7.2.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.2...v7.2.3) (2023-04-20)

### Bug Fixes

- Avoid infinite loop during glob files ([d36a021](https://github.com/vivliostyle/vivliostyle-cli/commit/d36a021ad47f858f268970fd06e19cd3370baba2))
- Copy ignored files into webpub output ([efc30f2](https://github.com/vivliostyle/vivliostyle-cli/commit/efc30f2d5d2e99c16590c63f7f3d004edf555aee))
- Prevent nested copy occuring with multiple times of build ([cb84f7a](https://github.com/vivliostyle/vivliostyle-cli/commit/cb84f7a571c3ffe03e2b11e0be7797a143952062))

## [7.2.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.1...v7.2.2) (2023-04-12)

### Bug Fixes

- Update Vivliostyle.js to 2.24.2: Bug Fixes ([ed08d91](https://github.com/vivliostyle/vivliostyle-cli/commit/ed08d91db06a453f746108a024db41d3d67a48f3))

## [7.2.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.2.0...v7.2.1) (2023-04-01)

### Bug Fixes

- prevent confirm dialog from being auto-dismissed ([dd61be8](https://github.com/vivliostyle/vivliostyle-cli/commit/dd61be885a95623995cf2b4203ec87b5ea8af4f6))
- Update Vivliostyle.js to 2.24.1: Bug Fix ([64f722b](https://github.com/vivliostyle/vivliostyle-cli/commit/64f722b9a4d9723a1beae32fe6baa612a2a3e657))

# [7.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.1.1...v7.2.0) (2023-04-01)

### Features

- set UI language of Vivliostyle Viewer ([73dc48a](https://github.com/vivliostyle/vivliostyle-cli/commit/73dc48a52e915241b2815cd10a2d749edb85fc82))
- Update Vivliostyle.js to 2.24.0: improved Viewer features ([6094439](https://github.com/vivliostyle/vivliostyle-cli/commit/6094439b7710c53d5b872a5b1f55f7d4a7dc1e82))
- Viewer parameter setting: `--viewer-param` option (viewerParam property) ([72a749d](https://github.com/vivliostyle/vivliostyle-cli/commit/72a749de29a0bd0fb1ea7a84f00c5b1cc6fa3325)), closes [#169](https://github.com/vivliostyle/vivliostyle-cli/issues/169)

## [7.1.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.1.0...v7.1.1) (2023-03-25)

### Bug Fixes

- Update Vivliostyle.js to 2.23.2: Bug Fix (Regression) ([4c258c0](https://github.com/vivliostyle/vivliostyle-cli/commit/4c258c04c939a83ab0d70e46b83936796134bdd4))

# [7.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v7.0.0...v7.1.0) (2023-03-24)

### Bug Fixes

- Update Vivliostyle.js to 2.23.1: Bug Fixes ([5567cdb](https://github.com/vivliostyle/vivliostyle-cli/commit/5567cdbdd317c6b0951e4be3d8078b719c8ee79f))

### Features

- Update Playwright to 1.32.0 (Chromium 112.0.5615.29) ([38f447f](https://github.com/vivliostyle/vivliostyle-cli/commit/38f447fe90da64fb0c95f8303f25ddee5fc87507))

# [7.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.3.1...v7.0.0) (2023-03-13)

### Features

- Update VFM to 2.1.0 ([f53d141](https://github.com/vivliostyle/vivliostyle-cli/commit/f53d141a06365e6a0d44c6ada74f087035d9a85a))
- Update Vivliostyle.js to 2.23.0: New syntax of CSS text-spacing properties ([7a4049c](https://github.com/vivliostyle/vivliostyle-cli/commit/7a4049c4fb663e413808347080ecbe33b56446d0))

### BREAKING CHANGES

- VFM v1 → v2

## [6.3.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.3.0...v6.3.1) (2023-02-23)

### Bug Fixes

- Update Playwright to 1.31.1 (Chromium 111.0.5563.19, bugfixed on Windows) ([6cb5c21](https://github.com/vivliostyle/vivliostyle-cli/commit/6cb5c21e624a11300475c5ea1a012ff3ce0f94b4))

# [6.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.2.3...v6.3.0) (2023-02-22)

### Bug Fixes

- browser address bar should not be focused when starting preview ([cb48ff7](https://github.com/vivliostyle/vivliostyle-cli/commit/cb48ff7612088aeabd89c01f1f2f6941838a150a))
- preview minimum font-size problem depending on locale ([d1c779e](https://github.com/vivliostyle/vivliostyle-cli/commit/d1c779e36172f9ce6e6790a534cc6f736723c89a))
- Update Vivliostyle.js to 2.22.4: Bug Fixes ([9cc01b4](https://github.com/vivliostyle/vivliostyle-cli/commit/9cc01b4f003d4361f31935f65bcf918c34d1796c))

### Features

- Update Playwright to 1.31.0 (Chromium 111.0.5563.19) ([5a6cdcc](https://github.com/vivliostyle/vivliostyle-cli/commit/5a6cdccf0dfdb5accf94059be0ac8534e14b36aa))

## [6.2.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.2.2...v6.2.3) (2023-02-18)

### Bug Fixes

- Allow loose specifiers for local theme directories; fix [#373](https://github.com/vivliostyle/vivliostyle-cli/issues/373) ([832a160](https://github.com/vivliostyle/vivliostyle-cli/commit/832a1606087731608fc92fbc5808e360f587e950))

## [6.2.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.2.1...v6.2.2) (2023-01-29)

### Bug Fixes

- Update Vivliostyle.js to 2.22.3: Fix PDF internal link bug ([5fc0e86](https://github.com/vivliostyle/vivliostyle-cli/commit/5fc0e869fa1e68e6d5fe478e1e57e26e7e4c9d99))

## [6.2.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.2.0...v6.2.1) (2023-01-26)

### Bug Fixes

- Update Vivliostyle.js to 2.22.2: Leader layout bug fixes ([26c66d5](https://github.com/vivliostyle/vivliostyle-cli/commit/26c66d58d7319ad44e9cc8a2cb0f876265d6da60))

# [6.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.1.0...v6.2.0) (2023-01-25)

### Bug Fixes

- ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows ([d76692a](https://github.com/vivliostyle/vivliostyle-cli/commit/d76692a20ada631f23da3af23a5a95c88848d430)), closes [#362](https://github.com/vivliostyle/vivliostyle-cli/issues/362)
- preview crashes when config has `toc: true` ([15dfcc7](https://github.com/vivliostyle/vivliostyle-cli/commit/15dfcc72a572e05c3b1d240390cd39ae8b717e38)), closes [#354](https://github.com/vivliostyle/vivliostyle-cli/issues/354)

### Features

- Update Playwright to 1.30.0 (Chromium 110.0.5481.38) ([48f7ee2](https://github.com/vivliostyle/vivliostyle-cli/commit/48f7ee26271965351f51c7470b71584d4d284450))
- Update Vivliostyle.js to 2.22.0: Support CSS leader() function ([8036fa5](https://github.com/vivliostyle/vivliostyle-cli/commit/8036fa5547745b5874ef8b762e0ed93826c96319))

# [6.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v6.0.0...v6.1.0) (2023-01-06)

### Bug Fixes

- stop using Chromium's `--headless=chrome` mode that causes layout problem on HiDPI display ([8c990d0](https://github.com/vivliostyle/vivliostyle-cli/commit/8c990d03f9295cfb308412e3a27f9754764915ce)), closes [#357](https://github.com/vivliostyle/vivliostyle-cli/issues/357)

### Features

- Update Playwright to 1.29.1 (Chromium 109.0.5414.46) ([80461b5](https://github.com/vivliostyle/vivliostyle-cli/commit/80461b5d91aa70f49e6803bc9c13cbbb25a7ccca))
- Update Vivliostyle.js to 2.21.1: Enable very thin border width; Update CSS text-spacing ([b819768](https://github.com/vivliostyle/vivliostyle-cli/commit/b8197686134fc8bf6e11f95f6b65f936d25edc24))

# [6.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.9.0...v6.0.0) (2022-12-17)

### Bug Fixes

- Prevent recursive reference of same symlink ([751de6a](https://github.com/vivliostyle/vivliostyle-cli/commit/751de6a679c52cd55486510ac3ce904643dece6a))

### Features

- Allow importing multiple themes and specify custom import path(s) ([65506c8](https://github.com/vivliostyle/vivliostyle-cli/commit/65506c8224d57c1bf912bded824bfe6850b5a347))
- Renew the theme installation logic ([dab7669](https://github.com/vivliostyle/vivliostyle-cli/commit/dab7669fa0731c3ce3d63bf492bb63c774bfcac8))
- Support Node.js ESM ([59df357](https://github.com/vivliostyle/vivliostyle-cli/commit/59df357f35d7910787e8f9ec4724cd55b8b97db8))
- Update Vivliostyle.js to 2.20.0: CSS lh/rlh units and margin-break property support ([b5d8d8f](https://github.com/vivliostyle/vivliostyle-cli/commit/b5d8d8f2b9e59dd877572cdafdaebd1a1941101d))

### BREAKING CHANGES

- vivliostyle-cli now provides codes as ESM

# [5.9.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.8.1...v5.9.0) (2022-11-17)

### Bug Fixes

- remove no longer necessary chromium option to enable LayoutNGPrinting ([3309491](https://github.com/vivliostyle/vivliostyle-cli/commit/330949122070b2eb5b25b377702d244be2c8e205)), closes [#347](https://github.com/vivliostyle/vivliostyle-cli/issues/347)
- Update Vivliostyle.js to 2.192.2: Bug Fixes ([6c140cc](https://github.com/vivliostyle/vivliostyle-cli/commit/6c140ccbe9ba74b285c5a195505f4423652351d3))

### Features

- Update Playwright to 1.28.0 (Chromium 108.0.5359.29) ([334d246](https://github.com/vivliostyle/vivliostyle-cli/commit/334d246c3dfe191e1b6f94618f7e5c6dd8729b2c)), closes [#347](https://github.com/vivliostyle/vivliostyle-cli/issues/347)

## [5.8.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.8.0...v5.8.1) (2022-10-21)

### Bug Fixes

- Update Vivliostyle.js to 2.19.1: Bug Fix ([ba8ebce](https://github.com/vivliostyle/vivliostyle-cli/commit/ba8ebce3d324c330bdcf1c56f083d5bcd6245072))

# [5.8.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.7.0...v5.8.0) (2022-10-18)

### Features

- Update Vivliostyle.js to 2.19.0: Support :is()/:not()/:where()/:has() pseudo-classes ([8d1299a](https://github.com/vivliostyle/vivliostyle-cli/commit/8d1299a63e30d2876bf6345b9bd043b819bdd8ea))

# [5.7.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.6.2...v5.7.0) (2022-10-12)

### Bug Fixes

- Update Vivliostyle.js to 2.18.4: Bug Fixes ([0accd81](https://github.com/vivliostyle/vivliostyle-cli/commit/0accd8198971060e60673e556e842b1ce3469121))

### Features

- Update Playwright to 1.27.0 (Chromium 107.0.5304.18) ([05ce2c0](https://github.com/vivliostyle/vivliostyle-cli/commit/05ce2c0bbcc39307941f00f2daa387fce5804997))

## [5.6.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.6.1...v5.6.2) (2022-09-30)

### Bug Fixes

- Update Vivliostyle.js to 2.18.3: Bug fix on text-spacing ([8e2d039](https://github.com/vivliostyle/vivliostyle-cli/commit/8e2d03930ef91dba05133481d233f4d8eb2500b6))

## [5.6.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.6.0...v5.6.1) (2022-09-30)

### Bug Fixes

- Update Vivliostyle.js to 2.18.2: Bug fixes on text-spacing and viewer ([9123122](https://github.com/vivliostyle/vivliostyle-cli/commit/91231225866b89d26b0789addd090691ed9bab61))

# [5.6.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.5.1...v5.6.0) (2022-09-24)

### Bug Fixes

- case-insensitive pathname comparison is necessary for Windows ([972f02a](https://github.com/vivliostyle/vivliostyle-cli/commit/972f02afbac4eb7b33fe1d2081a319519daceed9)), closes [#325](https://github.com/vivliostyle/vivliostyle-cli/issues/325) [#325](https://github.com/vivliostyle/vivliostyle-cli/issues/325)
- page size with !important in author stylesheets should have higher priority than --size option ([fae01c5](https://github.com/vivliostyle/vivliostyle-cli/commit/fae01c58a62027cfd63a38d97504157da242317f))

### Features

- add custom CSS option (--css) and crop marks options (--crop-marks, --bleed, --crop-offset) ([72c5801](https://github.com/vivliostyle/vivliostyle-cli/commit/72c5801d0e4cac0fe13e30845adc3cdae028dbaf))
- allow empty input for preview command to open Viewer start page ([9bec5a9](https://github.com/vivliostyle/vivliostyle-cli/commit/9bec5a9f43ed4e5b683f5acb521886d54abd6003))
- Update Playwright to 1.26.0 (Chromium 106.0.5249.30) ([ea2a077](https://github.com/vivliostyle/vivliostyle-cli/commit/ea2a07713b667b138862ce50291d455e4c099217))
- Update Vivliostyle.js to 2.18.1: improved viewer settings and bug fixes ([637fd5b](https://github.com/vivliostyle/vivliostyle-cli/commit/637fd5b1551424304124d689bf1f896612c61d86))

## [5.5.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.5.0...v5.5.1) (2022-08-09)

### Bug Fixes

- Update Vivliostyle.js to 2.17.1: Bug Fixes ([d26c01c](https://github.com/vivliostyle/vivliostyle-cli/commit/d26c01c96300b488d69fba9434d77098780ec97f))

# [5.5.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.4.0...v5.5.0) (2022-07-30)

### Features

- Update Playwright to 1.24.2 (Chromium 104.0.5112.48) ([8a2bdec](https://github.com/vivliostyle/vivliostyle-cli/commit/8a2bdec73e039dd052aa0f027b3c556209d84e91)), closes [#299](https://github.com/vivliostyle/vivliostyle-cli/issues/299)

# [5.4.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.3.0...v5.4.0) (2022-07-29)

### Features

- Update Vivliostyle.js to 2.17.0: Supports CSS Variables ([8533a30](https://github.com/vivliostyle/vivliostyle-cli/commit/8533a30e6c1f78bc5eae70894677af09a7ddd56c))

# [5.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.2.4...v5.3.0) (2022-07-19)

### Features

- Update Vivliostyle.js to 2.16.0: Improve CSS support ([d61e62d](https://github.com/vivliostyle/vivliostyle-cli/commit/d61e62d797b58fc11136f9061f8ff6f0cc43a587))

## [5.2.4](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.2.3...v5.2.4) (2022-07-08)

### Bug Fixes

- Update Vivliostyle.js to 2.15.8: Bug Fixes ([f0559e5](https://github.com/vivliostyle/vivliostyle-cli/commit/f0559e560410775e25cdd4da6b5d09c5b03b7af9))

## [5.2.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.2.1...v5.2.3) (2022-07-04)

### Bug Fixes

- Update Vivliostyle.js to 2.15.7: Fix float layout on printing ([36c891d](https://github.com/vivliostyle/vivliostyle-cli/commit/36c891d174e1f878864e36595fb9217e8569b9c3))

## [5.2.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.2.0...v5.2.1) (2022-07-03)

### Bug Fixes

- Unnecessary blank page added to the last in output PDF ([fda8991](https://github.com/vivliostyle/vivliostyle-cli/commit/fda89913a879cb337138d19fa15712c82581d594)), closes [#312](https://github.com/vivliostyle/vivliostyle-cli/issues/312)

# [5.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.1.0...v5.2.0) (2022-07-03)

### Bug Fixes

- Build not terminated when --render-mode=docker --http ([4d84329](https://github.com/vivliostyle/vivliostyle-cli/commit/4d84329791ebcff4ed16b92510c580a27b08963c)), closes [#298](https://github.com/vivliostyle/vivliostyle-cli/issues/298)
- Reduce size of Docker image ([0dd443b](https://github.com/vivliostyle/vivliostyle-cli/commit/0dd443bd9495373915d30f13b97556feef892817)), closes [#305](https://github.com/vivliostyle/vivliostyle-cli/issues/305)
- Update Vivliostyle.js to 2.15.6: fix to use Chromium LayoutNG ([d21b8ef](https://github.com/vivliostyle/vivliostyle-cli/commit/d21b8ef475d546b11b83afcb20b3fa2e4fab85d5))

### Features

- Improve font configuration in the docker image ([57e644c](https://github.com/vivliostyle/vivliostyle-cli/commit/57e644c6a06b9be36316322afa6d956f8238c6ec))
- Set chromium option --enable-blink-features=LayoutNGPrinting ([454b4a6](https://github.com/vivliostyle/vivliostyle-cli/commit/454b4a67234eba27d38592ec940c3cafdef0169f)), closes [1121942#c79](https://github.com/1121942/issues/c79)
- Update Playwright to 1.23.1 (Chromium 104.0.5112.20) ([c7f0af9](https://github.com/vivliostyle/vivliostyle-cli/commit/c7f0af9d2a0814cdcedc988e307fbe96be21f2a3))

# [5.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.0.1...v5.1.0) (2022-06-12)

### Bug Fixes

- Update Vivliostyle.js to 2.15.5: Fix layout problem with Chrome>=102 ([ecfdbb8](https://github.com/vivliostyle/vivliostyle-cli/commit/ecfdbb8a0e1776a1a6eb8b0df2b8ac81cf73d36d))

### Features

- Update Playwright to 1.22.2 (Chromium 102.0.5005.40) ([20f3d6a](https://github.com/vivliostyle/vivliostyle-cli/commit/20f3d6ab4f6b874a34b59aeb0f15878a623f968e))

## [5.0.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v5.0.0...v5.0.1) (2022-06-06)

### Bug Fixes

- Add patches for published packages ([2e4b363](https://github.com/vivliostyle/vivliostyle-cli/commit/2e4b36308eef62023aea051e6b0ff90920728b11))

# [5.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.12.4...v5.0.0) (2022-06-06)

# Experimental support of Firefox & Webkit (preview command only)

You can now use Firebox or Webkit browser to preview Vivliostyle viewer! To use this, please set an argument below

```
vivliostyle preview --browser firefox
```

### chore

- Drop Node v12 support ([9407f88](https://github.com/vivliostyle/vivliostyle-cli/commit/9407f88f9c3aee28e3845d1bb9b0ad61efb4a389))

### Features

- Experimental support of Firefox & Webkit ([0cedeca](https://github.com/vivliostyle/vivliostyle-cli/commit/0cedeca3ee21019fcef8b95c332d70fd6f0e1dcb))
- Rename executableChromium option to executableBrowser ([f012071](https://github.com/vivliostyle/vivliostyle-cli/commit/f0120714bac5482d31a8ad5a28ecc9ba1fbf3c36))
- Switch Puppeteer into Playwright ([95884ea](https://github.com/vivliostyle/vivliostyle-cli/commit/95884ea97691a3db9d59481e6e0a165d1b012348))

### BREAKING CHANGES

- Node v14 is now the minimum supported version

## [4.12.4](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.12.3...v4.12.4) (2022-06-01)

### Bug Fixes

- Update Vivliostyle.js to 2.15.4: Bug Fixes ([a51f0a8](https://github.com/vivliostyle/vivliostyle-cli/commit/a51f0a89348f3237b90709dc556e10298ba83e41))
- vivliostyle build hangs up at "Launching build environment" ([398419e](https://github.com/vivliostyle/vivliostyle-cli/commit/398419ec60d88223eda266fdd9ff3f988ff1d15a)), closes [#294](https://github.com/vivliostyle/vivliostyle-cli/issues/294)

## [4.12.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.12.2...v4.12.3) (2022-05-29)

### Bug Fixes

- Disable timeout of browser startup ([33dd2e2](https://github.com/vivliostyle/vivliostyle-cli/commit/33dd2e23b81e0ec9193a7336a1c80dc8ac8bbf3c))
- Update VFM to 1.2.2 ([c9208f0](https://github.com/vivliostyle/vivliostyle-cli/commit/c9208f02dee6b67861ce1f6fec5a581504e092d7))
- Update Vivliostyle.js to 2.15.3: Bug Fixes ([41a5254](https://github.com/vivliostyle/vivliostyle-cli/commit/41a525486e47ad52ace398e5cd22f77a74e32060))

## [4.12.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.12.1...v4.12.2) (2022-05-23)

### Bug Fixes

- Update Vivliostyle.js to 2.15.2: Bug Fixes ([07be017](https://github.com/vivliostyle/vivliostyle-cli/commit/07be01726c3f2190b93bc182cc87eda6a89b244a))
- wrong "Built …" message and unnecessary reloading on preview ([e752402](https://github.com/vivliostyle/vivliostyle-cli/commit/e7524024fd209f453914e1d9e2f72bae50c51ee2)), closes [#284](https://github.com/vivliostyle/vivliostyle-cli/issues/284)

## [4.12.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.12.0...v4.12.1) (2022-05-06)

### Bug Fixes

- Update Vivliostyle.js to 2.15.1: Fix page size problem ([1ff2c40](https://github.com/vivliostyle/vivliostyle-cli/commit/1ff2c40bf7f4e4229b057d5e9180c227361cb966))

# [4.12.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.11.0...v4.12.0) (2022-05-06)

### Features

- Add TrimBox and BleedBox to output PDF ([f301d2a](https://github.com/vivliostyle/vivliostyle-cli/commit/f301d2a2cef409f0ba2dfe1d3c409204baed2f4f)), closes [#277](https://github.com/vivliostyle/vivliostyle-cli/issues/277)
- Update Puppeteer-core to 13.7.0: support chrome headless mode ([a0266d0](https://github.com/vivliostyle/vivliostyle-cli/commit/a0266d0ba55e0dae05632305f2ef17d95265c5b4))
- Update Vivliostyle.js to 2.15.0: Improve printing support ([5504a95](https://github.com/vivliostyle/vivliostyle-cli/commit/5504a95e9d6b9535f7fe09a29b3253cc5946052f))
- Use new chrome headless mode ([e8d570b](https://github.com/vivliostyle/vivliostyle-cli/commit/e8d570b042e63daa2b97d76fcae6b0a67e70aafc))

# [4.11.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.10.0...v4.11.0) (2022-04-21)

### Features

- Update Puppeteer-core to 13.6.0 (Chromium 101) ([4e94326](https://github.com/vivliostyle/vivliostyle-cli/commit/4e9432631e7cbe3c7238b8c3f182207a00fce32c))

# [4.10.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.9.0...v4.10.0) (2022-04-20)

### Bug Fixes

- closes [#261](https://github.com/vivliostyle/vivliostyle-cli/issues/261); Allow arbitrary VFM options ([7507e7b](https://github.com/vivliostyle/vivliostyle-cli/commit/7507e7b8d82178b0ae4cccfaddf71eae9c931f67))
- Failed to load document when --viewer option is specified ([706accf](https://github.com/vivliostyle/vivliostyle-cli/commit/706accf7a6d865bf7a49c3820936d0b121024deb)), closes [#265](https://github.com/vivliostyle/vivliostyle-cli/issues/265)
- Process not terminated in docker mode ([b15d828](https://github.com/vivliostyle/vivliostyle-cli/commit/b15d82881b2879f352fd55f43d41c4f210c87fd8)), closes [#269](https://github.com/vivliostyle/vivliostyle-cli/issues/269)
- Update Vivliostyle.js to 2.14.6: Bug Fixes ([ea9c3ef](https://github.com/vivliostyle/vivliostyle-cli/commit/ea9c3ef9e8b89fafed325243f8e3e3fd55536393))
- Use appropreate teardown and logging ([36aa617](https://github.com/vivliostyle/vivliostyle-cli/commit/36aa61788f9a9c704b4c2fcc3e8cc060eca9a6cb))

### Features

- closes [#229](https://github.com/vivliostyle/vivliostyle-cli/issues/229); support multiple entries of config ([5b0ffbb](https://github.com/vivliostyle/vivliostyle-cli/commit/5b0ffbb8d0139510ef08ef99ed4ea6bc04a4b935))
- closes [#244](https://github.com/vivliostyle/vivliostyle-cli/issues/244); Clarify schema errors on console ([4409106](https://github.com/vivliostyle/vivliostyle-cli/commit/4409106be77f8d4653394353c2842513ec859c15))
- Expose config schemas ([fc5ab43](https://github.com/vivliostyle/vivliostyle-cli/commit/fc5ab43852b0d5e8009c562fd5fe69d69ada745d))

# [4.9.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.8.3...v4.9.0) (2022-04-11)

### Bug Fixes

- Update Vivliostyle.js to 2.14.5: Fix text-spacing caused wrong page break ([1b6f13f](https://github.com/vivliostyle/vivliostyle-cli/commit/1b6f13f5f96187e8196b55183421a8b9011590e0))

### Features

- Update Puppeteer-core to 13.5.2 (Chromium 100) ([89645cf](https://github.com/vivliostyle/vivliostyle-cli/commit/89645cf1592640a44e5812ce63424252d54a2309))

## [4.8.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.8.2...v4.8.3) (2022-04-11)

## [4.8.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.8.1...v4.8.2) (2022-02-21)

### Bug Fixes

- Update Vivliostyle.js to 2.14.4: Fix wrong page break with ruby ([68be62e](https://github.com/vivliostyle/vivliostyle-cli/commit/68be62e1f3eff896b5f19fcb6905172f4c426c2a))

## [4.8.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.8.0...v4.8.1) (2022-02-18)

### Bug Fixes

- Update Vivliostyle.js to 2.14.3: Fix bugs on links in output PDF ([790c8ae](https://github.com/vivliostyle/vivliostyle-cli/commit/790c8aeca975e88f5ced32fc4250bfed4d1dc29e))

# [4.8.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.7.0...v4.8.0) (2022-02-14)

### Bug Fixes

- Update Vivliostyle.js to 2.14.2: bug fixes ([615560f](https://github.com/vivliostyle/vivliostyle-cli/commit/615560f4cc3dabf87593268c7d82f9602d81527a))

### Features

- Update Puppeteer-core to 13.3.1 (Chromium 99) ([456c4b8](https://github.com/vivliostyle/vivliostyle-cli/commit/456c4b8d0a3a61ff54d8ff97c6238e4e072d1914))

# [4.7.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.6.0...v4.7.0) (2022-02-06)

### Bug Fixes

- Correct "title" to "name" in publication.json readingOrder ([9a4b6a0](https://github.com/vivliostyle/vivliostyle-cli/commit/9a4b6a0f9a9f275839bb4c48f0ca21d28fd8e686)), closes [#241](https://github.com/vivliostyle/vivliostyle-cli/issues/241)
- export cli flags interfaces ([d7ff892](https://github.com/vivliostyle/vivliostyle-cli/commit/d7ff8921760306373b3b0c3bb604f121c95ddf11))
- importing command api causes process exit ([bed6183](https://github.com/vivliostyle/vivliostyle-cli/commit/bed618317584bb280484544931c380cc3e3e2e86))

### Features

- Add readingProgression config option ([6b1193e](https://github.com/vivliostyle/vivliostyle-cli/commit/6b1193ea3af8deec82f9b65ed92baee7d58eccb4)), closes [#221](https://github.com/vivliostyle/vivliostyle-cli/issues/221)
- Improve Vivliostyle.js/Chromium version info in output PDF ([2b48c29](https://github.com/vivliostyle/vivliostyle-cli/commit/2b48c29ad7dced68b2062ce9e7a0cac18f036731)), closes [#220](https://github.com/vivliostyle/vivliostyle-cli/issues/220) [#238](https://github.com/vivliostyle/vivliostyle-cli/issues/238)
- Set ReadingDirection in output PDF ([3d023e2](https://github.com/vivliostyle/vivliostyle-cli/commit/3d023e20f2fb013aef9873a2b0f2e626ccaf8094)), closes [#221](https://github.com/vivliostyle/vivliostyle-cli/issues/221)
- Update @vivliostyle/vfm to v1.2.1 ([02b68ed](https://github.com/vivliostyle/vivliostyle-cli/commit/02b68ed4e7dd37bb046979c1b9eedfabc2e76700))
- Update Vivliostyle.js to 2.14.1: Improved text-spacing support ([4bcdbb7](https://github.com/vivliostyle/vivliostyle-cli/commit/4bcdbb76575854ec17c222f68fcc7d9514c07238))

# [4.6.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.5.0...v4.6.0) (2022-01-18)

### Bug Fixes

- Make timeout building PDF configurable ([7ad2c40](https://github.com/vivliostyle/vivliostyle-cli/commit/7ad2c4051ef1026de0a9c107cb9f7c5a14f35441))

### Features

- Add http server mode ([f3407ad](https://github.com/vivliostyle/vivliostyle-cli/commit/f3407ade71e6ecc7cd57bc223cbdf9a876666d95))
- Add viewer option ([011f834](https://github.com/vivliostyle/vivliostyle-cli/commit/011f834cfc5bea3ab7df521b9ef7a2a5ecc25496))
- Update @vivliostyle/vfm to v1.1.0 ([3abf1ad](https://github.com/vivliostyle/vivliostyle-cli/commit/3abf1adb90b6f8a219b7b6f11986b1eb594a11db))
- Update Vivliostyle.js to 2.13.0: Allow JavaScript in documents, etc. ([ae790aa](https://github.com/vivliostyle/vivliostyle-cli/commit/ae790aa3578c75d9bf137a6c81f824881ca65f8d))

# [4.5.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.4.1...v4.5.0) (2021-11-30)

### Features

- Update Puppetter-core to 12.0.1 ([2eb4e45](https://github.com/vivliostyle/vivliostyle-cli/commit/2eb4e454c0d4104cc0e9d94b3a503cff8c521aec))

## [4.4.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.4.0...v4.4.1) (2021-11-19)

### Bug Fixes

- Update Vivliostyle.js to 2.12.1: Fix bugs on math and text with ruby ([e5f0346](https://github.com/vivliostyle/vivliostyle-cli/commit/e5f0346c793fd282b1e9b31c6155e70060072794))

# [4.4.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.3.2...v4.4.0) (2021-11-13)

### Features

- Update Vivliostyle.js to 2.12.0: support text-spacing and hanging-punctuation ([dea228b](https://github.com/vivliostyle/vivliostyle-cli/commit/dea228b4c59486ae2af328d890c083f059e4eb87))

## [4.3.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.3.1...v4.3.2) (2021-11-01)

## [4.3.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.3.0...v4.3.1) (2021-10-18)

# [4.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.2.1...v4.3.0) (2021-10-10)

### Features

- Improve PDF metadata ([#97](https://github.com/vivliostyle/vivliostyle-cli/issues/97)) ([6020f29](https://github.com/vivliostyle/vivliostyle-cli/commit/6020f293de710f94e12e2b77298e6f3a9c68d404))
- Update vivliostyle.js to 2.11.1 ([10ba1a6](https://github.com/vivliostyle/vivliostyle-cli/commit/10ba1a616319e90c32ef1c33bcfb938330dbd38f))

## [4.2.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.2.0...v4.2.1) (2021-09-26)

### Bug Fixes

- TypeError: Cannot read properties of null (reading 'getMetadata') ([2ee3faa](https://github.com/vivliostyle/vivliostyle-cli/commit/2ee3faa7935f2af497e71bbb016671369736f7f7)), closes [/github.com/vivliostyle/vivliostyle-cli/issues/214#issuecomment-924811171](https://github.com//github.com/vivliostyle/vivliostyle-cli/issues/214/issues/issuecomment-924811171) [#214](https://github.com/vivliostyle/vivliostyle-cli/issues/214)

# [4.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.1.0...v4.2.0) (2021-09-18)

### Features

- Update vivliostyle.js to 2.10.0 ([219eab1](https://github.com/vivliostyle/vivliostyle-cli/commit/219eab125a577465a64b22a0f2b2ba739b9ba556))

# [4.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v4.0.0...v4.1.0) (2021-09-11)

### Features

- Update vivliostyle.js to 2.9.1 ([f19b085](https://github.com/vivliostyle/vivliostyle-cli/commit/f19b085e4e61c9f38f88933b4bfcdbac17857b6c))

# [4.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.5.2...v4.0.0) (2021-08-28)

### chore

- Update node engines ([30abdfa](https://github.com/vivliostyle/vivliostyle-cli/commit/30abdfac9d7bb563c9831059d8b564bee55ec358))

### Features

- Add render mode supports docker ([b2931b3](https://github.com/vivliostyle/vivliostyle-cli/commit/b2931b3e4c230633acb794c673e79cde93bd6d3d))
- Lazy install chromium ([966f02c](https://github.com/vivliostyle/vivliostyle-cli/commit/966f02ca4c406155bab69c9d65c9c6b4d2f2ea17))
- Support preflight options ([1c78975](https://github.com/vivliostyle/vivliostyle-cli/commit/1c789753dff747fe1f23e8eb3ca573ce7214944f))

### BREAKING CHANGES

- Node v12 is now the minimum supported version
- Switched to use puppeteer-core rather than puppeteer. If you're using vivliostyle-cli in any containers, you should run puppeteer's install.js and contain the browser runtime.

## [3.5.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.5.1...v3.5.2) (2021-07-23)

### Bug Fixes

- VFM frontmatter not processed ([68deef2](https://github.com/vivliostyle/vivliostyle-cli/commit/68deef2effdec36252ef4548b30867438bdd4d5a)), closes [#196](https://github.com/vivliostyle/vivliostyle-cli/issues/196)

## [3.5.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.5.0...v3.5.1) (2021-07-14)

### Bug Fixes

- Support new VFM API ([770e108](https://github.com/vivliostyle/vivliostyle-cli/commit/770e10848e0dc4276e1819f9afed627f93263d4c))

# [3.5.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.4.0...v3.5.0) (2021-05-03)

### Features

- Update @vivliostyle/vfm to v1.0.0-alpha.19 ([8979762](https://github.com/vivliostyle/vivliostyle-cli/commit/8979762b002209cf74e79b088db9444b509de346))
- Update @vivliostyle/vfm to v1.0.0-alpha.21 ([e66190b](https://github.com/vivliostyle/vivliostyle-cli/commit/e66190b62acaef94f52db4d3f02627b4bd8257fe))
- Update puppeteer to 9.0.0 ([af39584](https://github.com/vivliostyle/vivliostyle-cli/commit/af39584f6d64e72b4079a7d453fd6c1fade07edc))

# [3.4.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.3.0...v3.4.0) (2021-04-16)

### Bug Fixes

- extract function that reloads the configuration file ([40b5b83](https://github.com/vivliostyle/vivliostyle-cli/commit/40b5b83220a54e17a925bc28046cced988bc121e))

### Features

- Update vivliostyle (core@2.8.0, vfm@v1.0.0-alpha.18) ([23f940d](https://github.com/vivliostyle/vivliostyle-cli/commit/23f940d2e13a5588bc06aa11f104732800856d9e))
- vivliostyle preview reload when vivliostyle.config.js updated ([3079688](https://github.com/vivliostyle/vivliostyle-cli/commit/30796886124136332b08a3776cccaf2ba6fc7c26))

# [3.3.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.2.1...v3.3.0) (2021-04-07)

### Bug Fixes

- lack of test snapshot ([53600e1](https://github.com/vivliostyle/vivliostyle-cli/commit/53600e1bbaace88725362238bf58d9bff66aae84))

### Features

- add VFM options (hardLineBreaks, disableFormatHtml) to vivliostyle.config.js ([e4ec8f6](https://github.com/vivliostyle/vivliostyle-cli/commit/e4ec8f60063dd9465fb38d3e5110a6c2f8b9e8b6))
- Update option structure ([de6ae25](https://github.com/vivliostyle/vivliostyle-cli/commit/de6ae25980ee0c92a2fcd9e30a8fb3fe91b0e6f2))
- Update Vivliostyle version to 2.7.0 ([8dab20f](https://github.com/vivliostyle/vivliostyle-cli/commit/8dab20f9fca651dff89b50585841d70eed5cb4cb))

## [3.2.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.2.0...v3.2.1) (2021-03-29)

### Bug Fixes

- Update Vivliostyle version to 2.6.2 ([fe058df](https://github.com/vivliostyle/vivliostyle-cli/commit/fe058df59a6802ea054db78571dadeeab229933f))

# [3.2.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.1.2...v3.2.0) (2021-03-29)

### Bug Fixes

- Non-ASCII directory/file is not available. Error: Validation of pubManifest failed ([f84fca4](https://github.com/vivliostyle/vivliostyle-cli/commit/f84fca4aae6aa71ed37d2948b55de53535ab0429)), closes [#155](https://github.com/vivliostyle/vivliostyle-cli/issues/155)
- Preview watch not refreshed when CSS file is changed ([298ecf7](https://github.com/vivliostyle/vivliostyle-cli/commit/298ecf7da7fee9c7840f8c6d02e91621c7e314b9))

### Features

- Add --single-doc and --quick options ([6ccd68f](https://github.com/vivliostyle/vivliostyle-cli/commit/6ccd68fc36f30ce07e7bdfb7180d0e7f2d1b4daf))
- Add additional/user stylesheet options ([026306a](https://github.com/vivliostyle/vivliostyle-cli/commit/026306adbf7050103f3b2d265e62d5f3a013bc01)), closes [#112](https://github.com/vivliostyle/vivliostyle-cli/issues/112)
- Replace preview UI with Vivliostyle Viewer ([18265f2](https://github.com/vivliostyle/vivliostyle-cli/commit/18265f2f8999195e06cfbf976b021fd6de99888f)), closes [#41](https://github.com/vivliostyle/vivliostyle-cli/issues/41)

## [3.1.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.1.1...v3.1.2) (2021-03-06)

### Bug Fixes

- Failed to load from web because of CORS error ([1cb1baf](https://github.com/vivliostyle/vivliostyle-cli/commit/1cb1baf756d4ecb9466db6b17d7e1b58dfaa9dd3))
- Preview watch not working as expected ([7607d74](https://github.com/vivliostyle/vivliostyle-cli/commit/7607d744bbb37d690f8f5478e9f301886ddba2b9))

### Features

- Update vivliostyle core version to 2.5.2 ([b5ad780](https://github.com/vivliostyle/vivliostyle-cli/commit/b5ad78039edbe33be1b4fef97572b2b67274fb42))

## [3.1.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.1.0...v3.1.1) (2021-02-28)

# [3.1.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.3...v3.1.0) (2021-02-27)

### Bug Fixes

- exmaples/theme-preset size(JIS-B6 -> A5) ([a50fe02](https://github.com/vivliostyle/vivliostyle-cli/commit/a50fe0223795241b36afd5f630bf9eb6f54ac2ba))

### Features

- Update vivliostyle core version to 2.5 ([7b49393](https://github.com/vivliostyle/vivliostyle-cli/commit/7b493934d4258722ffa403ec636e1ee11069fb9b))

## [3.0.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.2...v3.0.3) (2021-02-09)

### Bug Fixes

- Update core deps ([f7ab4d3](https://github.com/vivliostyle/vivliostyle-cli/commit/f7ab4d346986cbb3d091fc3b6b51deb38e1dab15))

## [3.0.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.1...v3.0.2) (2021-02-09)

### Bug Fixes

- Place resources file on build time ([56a5e8b](https://github.com/vivliostyle/vivliostyle-cli/commit/56a5e8b9e4206a52a2456a0e84bbeed7549c4b6a))

## [3.0.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0...v3.0.1) (2021-02-07)

### Bug Fixes

- Fix to raise errors on falsy input ([a38dd85](https://github.com/vivliostyle/vivliostyle-cli/commit/a38dd851ab232e6ee949b593b3579f88954fa2c5))

# :tada: [3.0.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v2.1.3...v3.0.0) (2021-02-07)

## Introduce of the new configure file, `vivliostyle.config.js`!

We added support for a new config file format that allows you to save and share the build settings of your publications. See [examples](examples/) for a detailed description of what you can do with this config file.

## Revise the command line options (multiple output etc.)

The CLI command line options have been revised to allow for more flexible I/O configuration. The biggest topic is that we can now set multiple output destinations simultaneously!

```
vivliostyle build -o publication/ -f webpub -o draft.pdf -f pdf
```

## Support official Vivliostyle themes

We can now easily apply the various preset themes provided by Vivliostyle. Of course, you can also load your own CSS as a theme.

```
vivliostyle build input.md -T @vivliostyle/theme-techbook -o draft.pdf
```

# [3.0.0-rc.1](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-rc.0...v3.0.0-rc.1) (2021-02-07)

### Bug Fixes

- Can't load from Web URL ([e0e6689](https://github.com/vivliostyle/vivliostyle-cli/commit/e0e668951613ac49e5c253cf235f54e8af07c445))
- set process.cwd() to workspaceDir and entryContextDir ([811d879](https://github.com/vivliostyle/vivliostyle-cli/commit/811d8799f3a65ba472d01ee7212d0f2d4f270a5e))

### Features

- Add examples ([faca5c9](https://github.com/vivliostyle/vivliostyle-cli/commit/faca5c9bd30f6a7da4cecc4ff4095e72271b8b1d))

# [3.0.0-rc.0](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.6...v3.0.0-rc.0) (2021-02-06)

### Bug Fixes

- Cancel to set toc as resources ([3bd5bdc](https://github.com/vivliostyle/vivliostyle-cli/commit/3bd5bdc2676a3e70bb694d1eadd5061f9922974f))
- Correct the behavior of exporting webbook ([f5c9ae2](https://github.com/vivliostyle/vivliostyle-cli/commit/f5c9ae292db7236a2763fb9b564518ace36fcd66))
- Delete the default language config ([b40f75f](https://github.com/vivliostyle/vivliostyle-cli/commit/b40f75fce9d6f698396fed4cdff8a5d0b06eafb9))
- Ensure to exit a process ([b59a39d](https://github.com/vivliostyle/vivliostyle-cli/commit/b59a39df47d9f54da5cccdf2a40baf1f406ea581))
- Fix build option parser ([5a1767a](https://github.com/vivliostyle/vivliostyle-cli/commit/5a1767a5e9dcff51c914d3b3176bc30b93a5e658))
- Fix judging method to detect entry file type ([ef63e7d](https://github.com/vivliostyle/vivliostyle-cli/commit/ef63e7d0cff546963183e9b80877518975b6341e))
- Fix process of removing tmp file ([8b1f4ba](https://github.com/vivliostyle/vivliostyle-cli/commit/8b1f4ba9cb382cfb5da53528a8fc9a3596cfcfc6))
- Fix the context resolver on specifying a config file ([918099a](https://github.com/vivliostyle/vivliostyle-cli/commit/918099aed9a001780d429ad801d6c912d9c1a143))
- Fix to reflect language settings to manuscript outputs ([35253d3](https://github.com/vivliostyle/vivliostyle-cli/commit/35253d30f9069e7007aabc42ed9709053f45a015))
- Make element selectable on broker UI ([5adf95c](https://github.com/vivliostyle/vivliostyle-cli/commit/5adf95c82e1245981436a31adeaafb6b145a6ef4))
- Merge output config correctly ([8b3b518](https://github.com/vivliostyle/vivliostyle-cli/commit/8b3b51809720e3ed1eb6d0fd81d8f7ea3b47b7cc))
- More graceful webbook exports ([07d89d5](https://github.com/vivliostyle/vivliostyle-cli/commit/07d89d5161f5196f4b17d8bcb6ce970205e4da03))
- Set project names from input context ([2358f65](https://github.com/vivliostyle/vivliostyle-cli/commit/2358f65052867ce0dd2fa0c860cd20c42e220064))
- Support implicit exports ([34a3a40](https://github.com/vivliostyle/vivliostyle-cli/commit/34a3a4018aa0c3f2326beec2a5e14ff593b91560))
- Support themes for HTML inputs and toc ([baeff19](https://github.com/vivliostyle/vivliostyle-cli/commit/baeff1924353bf2a4bff010283c6ab5c5fda5f14))
- Use Cheerio for (X)HTML parser ([1188952](https://github.com/vivliostyle/vivliostyle-cli/commit/118895217fc88884a845697ba0600b8d582c3619))
- Webbook export ([4eeb30a](https://github.com/vivliostyle/vivliostyle-cli/commit/4eeb30a53b864b9c17f43548718d1b5fee8fe234))

### Features

- Add `workspaceDir` `includeAssets` configs ([d1ce8b2](https://github.com/vivliostyle/vivliostyle-cli/commit/d1ce8b2081f7637f37c92454ec89dddc5f8aee8f))
- Add tests for config parser codes ([f123ee5](https://github.com/vivliostyle/vivliostyle-cli/commit/f123ee50b2e677bed08f934fbaa0e7eb89bb6efb))
- Add validator not to overwrite source files ([4fe2244](https://github.com/vivliostyle/vivliostyle-cli/commit/4fe22440b680d376b5756e78171fcbe044801234))
- Change to use hash by passing broker parameters ([1ea1ddd](https://github.com/vivliostyle/vivliostyle-cli/commit/1ea1ddd760b144802d1e5403b6572d88fb660f56))
- Drop supports of exporting web manifest from single HTML ([2494dc5](https://github.com/vivliostyle/vivliostyle-cli/commit/2494dc52faf5758fd143a157a0345a76fbc03756))
- Enable to set vivliostyle.config.js as an input argument ([860fed1](https://github.com/vivliostyle/vivliostyle-cli/commit/860fed1d73c463d3bce894aed1d6458ad5939968))
- Format auto-generated HTMLs ([399690d](https://github.com/vivliostyle/vivliostyle-cli/commit/399690d4cb9f1b49fe119ed34bf35fc9effe1f79))
- Implement in-place file transform ([b8eb374](https://github.com/vivliostyle/vivliostyle-cli/commit/b8eb37440e971c00e03257192192ba60ff10b38d))
- Implement multiple target outputs ([8603dbf](https://github.com/vivliostyle/vivliostyle-cli/commit/8603dbfd529bd596cfc3d5b465e19eee2c66b367))
- Import Publication Manifest schema ([1ef8483](https://github.com/vivliostyle/vivliostyle-cli/commit/1ef84833a3dadcdcdfa4240423e6c6abeb3e455e))
- Rename manifest.json to publication.json ([5556932](https://github.com/vivliostyle/vivliostyle-cli/commit/555693265f866708b692df50b1cfd7f9c7d3530f))
- Rename output format; webbook -> webpub ([04472ed](https://github.com/vivliostyle/vivliostyle-cli/commit/04472edbaa475391d3e720764926f07313520320))
- Revise CLI options ([aca9cf3](https://github.com/vivliostyle/vivliostyle-cli/commit/aca9cf3285ff4cec28dd341c34dd185ac11ef8cc))
- Support multiple -o and -f options ([50f57ca](https://github.com/vivliostyle/vivliostyle-cli/commit/50f57cad8016b41d5c4c97dc4635141425f459cd))
- Support to input publication manifests directly ([23a5ec7](https://github.com/vivliostyle/vivliostyle-cli/commit/23a5ec7762d0549d2ceead85261fae61d77c5169))
- Support various input formats ([4e75580](https://github.com/vivliostyle/vivliostyle-cli/commit/4e75580d5ba5e79b487d42d6db6bc19d0b7334f4))
- Support webbook export of single entry ([71d3fb2](https://github.com/vivliostyle/vivliostyle-cli/commit/71d3fb228e0ec9f3b9cb4a1fa128b483daafdea1))
- Support zipped EPUB inputs ([dac8afc](https://github.com/vivliostyle/vivliostyle-cli/commit/dac8afc07795910e188f5e17ee27d4dbace527e5))
- Update config schema ([b8f4be4](https://github.com/vivliostyle/vivliostyle-cli/commit/b8f4be41b736ac52e592783b79201a5eb8e36e9e))
- Update manifest schema ([fb6d955](https://github.com/vivliostyle/vivliostyle-cli/commit/fb6d955bc4c5f3026330776a3f391a779403a69e))
- Update the config template ([e09a898](https://github.com/vivliostyle/vivliostyle-cli/commit/e09a898842fffc749f47aae2839209fcf02a2440))
- Update toc APIs ([78e2d1b](https://github.com/vivliostyle/vivliostyle-cli/commit/78e2d1bef4daee343ab75aa9010a1446269bd37d))
- Use file-based protocol to serve the broker page ([b10f446](https://github.com/vivliostyle/vivliostyle-cli/commit/b10f44688102e0dbcc5ae63a63ed15d47661ee68))

# [3.0.0-pre.6](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.5...v3.0.0-pre.6) (2021-01-13)

### Bug Fixes

- Local theme package copied to wrong place when updated during preview ([ee05f3e](https://github.com/vivliostyle/vivliostyle-cli/commit/ee05f3e18932fc8f27c5343e9353cf16d2810359)), closes [#93](https://github.com/vivliostyle/vivliostyle-cli/issues/93)

### Features

- display stacktrace on error ([42ca8f1](https://github.com/vivliostyle/vivliostyle-cli/commit/42ca8f11c049758f6c2c30d640ce14caeae52216))

# [3.0.0-pre.5](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.4...v3.0.0-pre.5) (2020-12-30)

### Bug Fixes

- --language,--size, --theme options for init command is not working. ([6feec71](https://github.com/vivliostyle/vivliostyle-cli/commit/6feec71c13c5f0f2dce737c22d49d0b26a9fd610))
- include yarn.lock ([605897e](https://github.com/vivliostyle/vivliostyle-cli/commit/605897ef6884a92d110fd8f3eb4004bfaf1dae5b))
- remove .posix and update upath 2.0.1 ([594b8dd](https://github.com/vivliostyle/vivliostyle-cli/commit/594b8dd8099a57b677d2c713f6b06a8b136fff07))
- toc test fails due to separator on Windows ([6a4ab12](https://github.com/vivliostyle/vivliostyle-cli/commit/6a4ab121f01f466fe43d7a0e233f77e69616def4))

### Features

- init command document to 3.0.0 specification ([32906ef](https://github.com/vivliostyle/vivliostyle-cli/commit/32906efa0726f23531862682c86878f5d91cfe05))
- init command to 3.0.0 specification ([cf30818](https://github.com/vivliostyle/vivliostyle-cli/commit/cf308180565413399c0367f149d9e6eaa00942d7))

# [3.0.0-pre.4](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.3...v3.0.0-pre.4) (2020-11-01)

# [3.0.0-pre.3](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.2...v3.0.0-pre.3) (2020-08-06)

### Bug Fixes

- Errors due to path problem on Windows ([8eeadee](https://github.com/vivliostyle/vivliostyle-cli/commit/8eeadeed053a1e665c94c95d5cc5b5f0debbecde))

### Features

- inject title and style into raw html as well ([d9afa06](https://github.com/vivliostyle/vivliostyle-cli/commit/d9afa06904b5b1abeef4763365d1814305cb9ed0))

# [3.0.0-pre.2](https://github.com/vivliostyle/vivliostyle-cli/compare/v3.0.0-pre.1...v3.0.0-pre.2) (2020-07-02)

### Bug Fixes

- avoid infinite globby loop ([e7d9d64](https://github.com/vivliostyle/vivliostyle-cli/commit/e7d9d643cfb5edc6fbb2a657f41e4afe0e35ea58))
- flush before running press-ready ([de28656](https://github.com/vivliostyle/vivliostyle-cli/commit/de286567c0159fe5faa341650a4e6f541f84020d))
- prepend toc ([141c657](https://github.com/vivliostyle/vivliostyle-cli/commit/141c657e924729786d5e08e73ca6a35d011c55e6))
- remove unncessary options ([3151d16](https://github.com/vivliostyle/vivliostyle-cli/commit/3151d16488ae5f87a6578f686657c1f081f0e3da))
- use title as a output filename ([0e3b31a](https://github.com/vivliostyle/vivliostyle-cli/commit/0e3b31adb1561386db8bc07e11ad68ff66913805))
- **init:** abort if config file exists ([8e45ab1](https://github.com/vivliostyle/vivliostyle-cli/commit/8e45ab1381b71d476568572f4ddf6fc01f5d2d41))
- startLogging after error ([1c6670d](https://github.com/vivliostyle/vivliostyle-cli/commit/1c6670d16c6cbe96591866b89884b1bae7457251))

### Features

- cover field ([bc3a70e](https://github.com/vivliostyle/vivliostyle-cli/commit/bc3a70ecd7a7ce099a0b9f88af8c4b842a23a3d6))
- validate vivliostyle.config.js ([7e43b1e](https://github.com/vivliostyle/vivliostyle-cli/commit/7e43b1e2eb3f1ff197970abe5f8c54f60173d8a1))

## 2.0.0-pre.0 (2019-12-19)

- :arrow_up: Version 1.3.0 ([173420b](https://github.com/vivliostyle/vivliostyle-cli/commit/173420b))
- :arrow_up: Version 1.3.1 ([04bfa6f](https://github.com/vivliostyle/vivliostyle-cli/commit/04bfa6f))
- #11 #13 Fix entrypoint loader to load EPUB and XHTML ([2cc03eb](https://github.com/vivliostyle/vivliostyle-cli/commit/2cc03eb))
- 2.0.0-pre.0 ([c5f33d0](https://github.com/vivliostyle/vivliostyle-cli/commit/c5f33d0))
- Add instruction ([1ed2787](https://github.com/vivliostyle/vivliostyle-cli/commit/1ed2787))
- Adopt subcommand system ([158c9e8](https://github.com/vivliostyle/vivliostyle-cli/commit/158c9e8))
- Create README.md ([7b71309](https://github.com/vivliostyle/vivliostyle-cli/commit/7b71309))
- fix broker path ([964af52](https://github.com/vivliostyle/vivliostyle-cli/commit/964af52))
- Rename save -> build ([1af35d3](https://github.com/vivliostyle/vivliostyle-cli/commit/1af35d3))
- Rename viola -> vivliostyle ([d55299b](https://github.com/vivliostyle/vivliostyle-cli/commit/d55299b))
- Update codes for new command name ([7422282](https://github.com/vivliostyle/vivliostyle-cli/commit/7422282))
- Update test command ([c2b0bee](https://github.com/vivliostyle/vivliostyle-cli/commit/c2b0bee))
- Use serve-handler ([3c6a36d](https://github.com/vivliostyle/vivliostyle-cli/commit/3c6a36d))
- Vivliostyle 2019.1.106 ([a680a61](https://github.com/vivliostyle/vivliostyle-cli/commit/a680a61))
- Vivliostyle 2019.8.101 ([7d5f94c](https://github.com/vivliostyle/vivliostyle-cli/commit/7d5f94c))
- fix: add enum definitions ([391f2ac](https://github.com/vivliostyle/vivliostyle-cli/commit/391f2ac))
- fix: automatically find chrome port to avoid conflict ([bd0d213](https://github.com/vivliostyle/vivliostyle-cli/commit/bd0d213)), closes [#24](https://github.com/vivliostyle/vivliostyle-cli/issues/24)
- fix: cover chrome-remote-interface ([5f3bbed](https://github.com/vivliostyle/vivliostyle-cli/commit/5f3bbed))
- fix: migrate from vivliostyle to @vivliostyle/core ([980ca9c](https://github.com/vivliostyle/vivliostyle-cli/commit/980ca9c))
- fix: port cli to TypeScript ([1b29b2c](https://github.com/vivliostyle/vivliostyle-cli/commit/1b29b2c))
- fix(npm): publish /broker to npm ([a6f1c2f](https://github.com/vivliostyle/vivliostyle-cli/commit/a6f1c2f))
- fix(test): test subcommand ([e0baff1](https://github.com/vivliostyle/vivliostyle-cli/commit/e0baff1))
- chore: add keywords, homepage, bugs to package.json ([aee4c6c](https://github.com/vivliostyle/vivliostyle-cli/commit/aee4c6c))
- chore: add prettier to match styles ([90addac](https://github.com/vivliostyle/vivliostyle-cli/commit/90addac))
- chore: add travis ([1ffbb02](https://github.com/vivliostyle/vivliostyle-cli/commit/1ffbb02))
- chore: cosmetic changes ([478dfa1](https://github.com/vivliostyle/vivliostyle-cli/commit/478dfa1))
- chore: cosmetic changes ([71586e1](https://github.com/vivliostyle/vivliostyle-cli/commit/71586e1))
- chore: export interfaces ([7aeac7f](https://github.com/vivliostyle/vivliostyle-cli/commit/7aeac7f))
- chore: fix command ([f9966de](https://github.com/vivliostyle/vivliostyle-cli/commit/f9966de))
- chore: Fix editorconfig ([7aa65c7](https://github.com/vivliostyle/vivliostyle-cli/commit/7aa65c7))
- chore: ignore clutter ([4d8896c](https://github.com/vivliostyle/vivliostyle-cli/commit/4d8896c))
- chore: omit viola-savepdf notice ([7271553](https://github.com/vivliostyle/vivliostyle-cli/commit/7271553))
- chore: publish declaration files ([fa47ff9](https://github.com/vivliostyle/vivliostyle-cli/commit/fa47ff9))
- chore: remove Makefile in favor of proper test suite ([365f427](https://github.com/vivliostyle/vivliostyle-cli/commit/365f427))
- chore: rename vivliostyle-savepdf to @vivliostyle/cli ([8152e1f](https://github.com/vivliostyle/vivliostyle-cli/commit/8152e1f))
- chore: update deps ([d151840](https://github.com/vivliostyle/vivliostyle-cli/commit/d151840))
- chore: update preact from 8 to 10 ([1036990](https://github.com/vivliostyle/vivliostyle-cli/commit/1036990))
- chore(test): fix test to show stderr when command failed ([865bf2e](https://github.com/vivliostyle/vivliostyle-cli/commit/865bf2e))
- test: add test ([7512f9b](https://github.com/vivliostyle/vivliostyle-cli/commit/7512f9b))
- test: checks if savepdf generates pdf without err ([9694093](https://github.com/vivliostyle/vivliostyle-cli/commit/9694093))
- test: invoke test before push ([62b5b87](https://github.com/vivliostyle/vivliostyle-cli/commit/62b5b87))
- feat: mvp ([683c5de](https://github.com/vivliostyle/vivliostyle-cli/commit/683c5de))

### BREAKING CHANGE

- command has been changed from savepdf to vivliostyle

## <small>1.2.7 (2019-03-11)</small>

- :arrow_up: version 1.2.2 ([d07dfe1](https://github.com/vivliostyle/vivliostyle-cli/commit/d07dfe1))
- :arrow_up: version 1.2.3 ([8f8cc72](https://github.com/vivliostyle/vivliostyle-cli/commit/8f8cc72))
- :arrow_up: version 1.2.4 ([60987a6](https://github.com/vivliostyle/vivliostyle-cli/commit/60987a6))
- :arrow_up: Version 1.2.5 ([5cf0999](https://github.com/vivliostyle/vivliostyle-cli/commit/5cf0999))
- :arrow_up: Version 1.2.6 ([326e6b7](https://github.com/vivliostyle/vivliostyle-cli/commit/326e6b7))
- :arrow_up: Version 1.2.7 ([358e96b](https://github.com/vivliostyle/vivliostyle-cli/commit/358e96b))
- add 'root' cli option ([47773a1](https://github.com/vivliostyle/vivliostyle-cli/commit/47773a1))
- Add book mode ([c34a99c](https://github.com/vivliostyle/vivliostyle-cli/commit/c34a99c))
- Add Dockerfile ([c86c03f](https://github.com/vivliostyle/vivliostyle-cli/commit/c86c03f))
- Bump dependency versions ([8f4c4e3](https://github.com/vivliostyle/vivliostyle-cli/commit/8f4c4e3))
- Bump up dependency versions ([22d8b0f](https://github.com/vivliostyle/vivliostyle-cli/commit/22d8b0f))
- change option order / pass root option to preview mode ([913f20d](https://github.com/vivliostyle/vivliostyle-cli/commit/913f20d))
- fix index path in save.js ([3061be8](https://github.com/vivliostyle/vivliostyle-cli/commit/3061be8))
- fix listen address to localhost ([43d40ca](https://github.com/vivliostyle/vivliostyle-cli/commit/43d40ca))
- Fix parsing preset size ([5f2a7c5](https://github.com/vivliostyle/vivliostyle-cli/commit/5f2a7c5))
- Improve preview page navigator ([016899a](https://github.com/vivliostyle/vivliostyle-cli/commit/016899a))
- Integrate MathJax ([db5b2eb](https://github.com/vivliostyle/vivliostyle-cli/commit/db5b2eb))
- Make configurable loading mode ([068ed0b](https://github.com/vivliostyle/vivliostyle-cli/commit/068ed0b))
- remove part of query string from path ([e5021f6](https://github.com/vivliostyle/vivliostyle-cli/commit/e5021f6))
- Show app version in preview page ([afeeea3](https://github.com/vivliostyle/vivliostyle-cli/commit/afeeea3))
- support to flattened node_modules ([d3bc592](https://github.com/vivliostyle/vivliostyle-cli/commit/d3bc592))
- Update to show the vivliostyle version ([3fa880d](https://github.com/vivliostyle/vivliostyle-cli/commit/3fa880d))
- Update urls for Vivliostyle.org ([f89a326](https://github.com/vivliostyle/vivliostyle-cli/commit/f89a326))

## <small>1.2.1 (2017-12-08)</small>

- :arrow_up: version 1.2.1 ([7b020bd](https://github.com/vivliostyle/vivliostyle-cli/commit/7b020bd))
- add --no-sandbox option ([d4e51bd](https://github.com/vivliostyle/vivliostyle-cli/commit/d4e51bd))
- add a guide message in case of ECONNREFUSED error ([5ec588e](https://github.com/vivliostyle/vivliostyle-cli/commit/5ec588e))
- add a guide message in case of ECONNREFUSED error in headless mode ([67bdf64](https://github.com/vivliostyle/vivliostyle-cli/commit/67bdf64))
- Fix error handling ([2e7648a](https://github.com/vivliostyle/vivliostyle-cli/commit/2e7648a))
- make previewer enable to launch without sandbox ([bf2727d](https://github.com/vivliostyle/vivliostyle-cli/commit/bf2727d))
- make save.js enable to launch without sandbox ([caca589](https://github.com/vivliostyle/vivliostyle-cli/commit/caca589))

## 1.2.0 (2017-11-21)

- :arrow_up: version 1.2.0 ([a43717e](https://github.com/vivliostyle/vivliostyle-cli/commit/a43717e))
- Add preview mode ([a4acbe1](https://github.com/vivliostyle/vivliostyle-cli/commit/a4acbe1))
- Fix print CSS ([60f9c09](https://github.com/vivliostyle/vivliostyle-cli/commit/60f9c09))
- Improve broker page ([e86d410](https://github.com/vivliostyle/vivliostyle-cli/commit/e86d410))
- Update package ([a838577](https://github.com/vivliostyle/vivliostyle-cli/commit/a838577))

## 1.1.0 (2017-08-02)

- :arrow_up: version 1.1.0 ([5fa41c8](https://github.com/vivliostyle/vivliostyle-cli/commit/5fa41c8))
- Add page size option ([32d89b4](https://github.com/vivliostyle/vivliostyle-cli/commit/32d89b4))
- Create LICENSE ([ee6d44e](https://github.com/vivliostyle/vivliostyle-cli/commit/ee6d44e))
- Implement very simple script ([a748e18](https://github.com/vivliostyle/vivliostyle-cli/commit/a748e18))
- Set print media emulation ([36370de](https://github.com/vivliostyle/vivliostyle-cli/commit/36370de))
