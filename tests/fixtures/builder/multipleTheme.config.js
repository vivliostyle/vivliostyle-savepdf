export default {
  title: 'title',
  theme: ['@vivliostyle/theme-academic', 'manuscript/sample-theme.css'],
  entry: {
    path: 'manuscript/soda.md',
    theme: [
      {
        specifier: '../themes/debug-theme',
        import: ['theme.css', 'additional-theme.css'],
      },
      { specifier: 'manuscript/sample-theme.css' },
    ],
  },
  output: [],
  workspaceDir: '.vs-multipleTheme',
  toc: true,
};
