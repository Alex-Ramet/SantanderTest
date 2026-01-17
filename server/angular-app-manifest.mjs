
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1208, hash: 'c3b1b1b898440cbb17d552f9f899e23c365fc91072bce38a1298cb3b1c6de492', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1553, hash: '7d65732360a492116019ec463abf85345f5a2505c1a0ad8fff1dd866f79e85df', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 104130, hash: '775f0665942d2b486ce2d644f76c43b5a18574615659089f05935dfb6353d8fe', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-KL2REGEI.css': {size: 5421, hash: 'IjFKRTKZjDI', text: () => import('./assets-chunks/styles-KL2REGEI_css.mjs').then(m => m.default)}
  },
};
