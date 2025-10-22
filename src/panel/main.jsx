import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SheetDataProvider } from './context/SheetContext.jsx'
import { WorkflowsContextProvider } from './context/WorkflowContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SheetDataProvider>
      <WorkflowsContextProvider>
        <App />
      </WorkflowsContextProvider>
    </SheetDataProvider>
  </StrictMode>,
)
