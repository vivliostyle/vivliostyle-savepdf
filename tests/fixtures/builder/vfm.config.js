import baseConfig from './workspace.config.js';

export default {
  ...baseConfig,
  entry: [
    ...baseConfig.entry,
    {
      path: 'manuscript/frontmatter.md',
    },
  ],
  workspaceDir: '.vs-vfm',
  vfm: {
    hardLineBreaks: true,
    disableFormatHtml: true,
  },
  cover: undefined,
};
