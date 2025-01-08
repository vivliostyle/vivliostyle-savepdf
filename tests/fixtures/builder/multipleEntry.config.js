import baseConfig from './workspace.config.js';

export default [
  {
    ...baseConfig,
    workspaceDir: '.vs-multipleEntry/one',
    toc: false,
    cover: undefined,
  },
  {
    ...baseConfig,
    entry: [
      {
        path: 'manuscript/frontmatter.md',
      },
      {
        rel: 'contents',
      },
    ],
    workspaceDir: '.vs-multipleEntry/two',
    cover: undefined,
  },
];
