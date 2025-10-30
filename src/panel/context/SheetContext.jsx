import React, { useState, createContext, useContext, useEffect } from 'react';
import { getCurrentTabID,isChromeExtensionEnvironment } from '../utils/extension';
/**
 * @typedef {Object} SheetDataContextType
 * @property {Array<Array<any>>} sheetData - The entire sheet data with rows and columns.
 * @property {Function} setSheetData - Function to update the sheet data.
 * @property {Object} currentRowData - The data of the currently selected row in object form.
 * @property {Function} setCurrentRowData - Function to manually set current row data.
 * @property {number} currentRow - The index of the currently selected row. 
 * @property {number} currentHeader - The index of the currently selected row. 
 * @property {Function} setCurrentRow - Function to update the current row index.          
 * @property {Function} setCurrentHeader - Function to update the current row index.          
 */

// Create the context
/** @type {React.Context<SheetDataContextType | undefined>} */
const SheetDataContext = createContext(undefined);

/**
 * Provider component that wraps children with sheet data context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will consume the context.
 * @returns {JSX.Element}
 */
const SheetDataProvider = ({ children }) => {
  const [sheetData, setSheetData] = useState([]); // Initialize as an empty array
  const [currentRowData, setCurrentRowData] = useState(()=>new Map()); // Current row's data in object format
  const [currentRow, setCurrentRow] = useState(2); // Row index (1-based; 0 is header)
  const [currentHeader,setCurrentHeader]=useState(1)
  const [isTabDark,setIsTabDark]=useState(false)

  useEffect(() => {
    if (sheetData.length > 0 && currentRow > 0 &&currentRow < sheetData.length&&currentHeader>0) {
      
      const rowData = sheetData[currentRow-1];
      const headers = sheetData[currentHeader-1];
      const rowMap = new Map();
    headers.forEach((header, index) => {
      rowMap.set(String(header).trim() || `Column${index + 1}`, rowData[index]);
    });

      setCurrentRowData(rowMap);
    } else {
      setCurrentRowData(new Map());
    }
  }, [sheetData, currentRow,currentHeader]);


useEffect(() => {
  function handleMessage(message, sender, sendResponse) {
    // Immediately tell Chrome this handler will respond asynchronously
    (async () => {
      try {
        const inspectedTabId = await getCurrentTabID(); // unified function

        if (sender.tab && sender.tab.id === inspectedTabId) {
          console.log("Received message from inspected tab:", message);

          // Example: respond with theme info
          sendResponse({ action: "changeTheme", isTabDark });
        }
      } catch (err) {
        console.error("Error in message handler:", err);
      }
    })();

    return true; // ✅ Keep the message channel open for async sendResponse()
  }

  chrome.runtime.onMessage.addListener(handleMessage);

  return () => {
    chrome.runtime.onMessage.removeListener(handleMessage);
  };
}, [isTabDark]);



  const contextValue = { sheetData, setSheetData, currentRowData, setCurrentRowData, currentRow, setCurrentRow,currentHeader,setCurrentHeader,isTabDark,setIsTabDark};

  return (
    <SheetDataContext.Provider value={contextValue}>
      {children}
    </SheetDataContext.Provider>
  );
};

/**
 * Custom hook to access sheet data context.
 *
 * @returns {SheetDataContextType} Sheet data context values.
 * @throws Will throw an error if used outside of the SheetDataProvider.
 */
const useSheetData = () => {
  const context = useContext(SheetDataContext);
  if (!context) {
    throw new Error('useSheetData must be used within a SheetDataProvider');
  }
  return context;
};

export { SheetDataProvider, useSheetData };

