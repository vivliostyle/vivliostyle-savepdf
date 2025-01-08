export default {
  title: 'title',
  author: 'author',
  entry: [
    { rel: 'cover' },
    {
      rel: 'contents',
      theme: 'manuscript/sample-theme.css',
      pageBreakBefore: 'recto',
      pageCounterReset: 1,
    },
    'manuscript/soda.md',
    {
      rel: 'cover',
      output: 'another-cover.html',
      theme: 'manuscript/sample-theme.css',
      imageSrc: 'manuscript/cover2.png',
      imageAlt: 'yuno',
      pageBreakBefore: 'left',
    },
  ],
  output: [],
  workspaceDir: '.vs-multipleCoverPages',
  toc: true,
  cover: 'manuscript/cover.png',
  theme: '../themes/debug-theme',
};
