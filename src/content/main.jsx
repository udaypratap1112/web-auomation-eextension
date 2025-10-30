import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './views/App.jsx'
import { syncDarkMode } from './utils/theme.js'
import { recordUserWorkflow } from './utils/recordWorkflow.js'
import { runWorkflow } from './utils/runWorkflow.js'
import Jexl from 'jexl'

console.log('[CRXJS] Hello world from content script!')

syncDarkMode()


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'toggleTheme':
      console.log('Request to change the theme')
      syncDarkMode()
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

    case 'runCondition':
      console.log("running the condition");
      aaFunction(message.data,message.condition);
      
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


async function aaFunction(data,condition){
  let result= await Jexl.eval(condition,{data})
  console.log(result)
}