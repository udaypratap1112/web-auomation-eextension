import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './views/App.jsx'
import { enableDarkMode, disableDarkMode, toggleDarkMode, toggleDarkByState } from './utils/theme.js'
import { recordUserWorkflow } from './utils/recordWorkflow.js'
import { runWorkflow } from './utils/runWorkflow.js'

console.log('[CRXJS] Hello world from content script!')

chrome.runtime.sendMessage({ action: 'getTheme' }, function (response) {
  console.log(response) // undefined if no response
  if (!response) return
  if (response.action == 'changeTheme') {
    console.log(response.isTabDark)
    toggleDarkByState(response.isTabDark)
  }
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'toggleTheme':
      console.log('Request to change the theme')
      toggleDarkMode()
      break

    case 'runWorkflow':
      console.log("Running workflow");
      runWorkflow(message.workflow,message.data)
      break

    case 'recordUser':
      console.log("Request to start user interaction recording");
      recordUserWorkflow()
      break

    case 'stopRecording':
      console.log("Request to start stop recording");
      window.stopRecording()
      break

    default:
      console.warn('Unknown action:', message.action)
      break
  }
})

// const container = document.createElement('div')
// container.id = 'crxjs-app'
// document.body.appendChild(container)
// createRoot(container).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
