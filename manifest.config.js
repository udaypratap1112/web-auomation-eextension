import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
  },
  permissions: [
    "scripting","tabs", "storage", "activeTab","clipboardRead",
  "clipboardWrite",'sidePanel',"downloads"
  ],

  action: {
    default_icon: {
      48: 'public/logo.png',
    },
    // default_popup: 'src/popup/index.html',
  },
  
background:{
  service_worker:"src/background/background.js"
},

  devtools_page:"src/devtools/index.html",
  content_scripts: [{
    js: ['src/content/main.jsx'],
    matches: ['https://*/*'],
  }],
  side_panel: {
    default_path: 'src/panel/index.html',
  },
})
