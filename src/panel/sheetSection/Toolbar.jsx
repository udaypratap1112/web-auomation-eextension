import React, { useState } from 'react'
import { useSheetData } from '../context/SheetContext'
import { sendMessageToActiveTab,getCurrentTabID } from '../utils/extension'
import{Moon,Sun} from 'lucide-react'

const Toolbar = () => {
   const { currentRowData } = useSheetData();
    const [condition, setCondition] = useState("")

   
    function handleRecordworkflow(){
      sendMessageToActiveTab({action:"recordUser"})
    }
    function stopRecording(){
      sendMessageToActiveTab({action:"stopRecording"})
    }
    function preprocessUserCode(codeString) {
  return codeString
    .trim()
    .replace(/\r\n/g, "\n"); // normalize newlines
}

    function runCondition(){
      // sendMessageToActiveTab({action:"runCustomCode",data:{name:"uday",age:23},code:condition})
      console.log(JSON.stringify(condition))
      let contxt=Object.fromEntries(currentRowData.entries())
      

      const kk=preprocessUserCode(condition)
      executeCodeInTab(`console.log("Context from extension:", context); ${kk} `, contxt );
    }


  return (

    <div className='w-full flex flex-col gap-2'>
        <button className='button-subtle' onClick={handleThemeChange}>{<Moon size={18}/>}</button>
        <button className='button-subtle' onClick={handleRecordworkflow}>Record Workfloe</button>
        <button className='button-subtle' onClick={stopRecording}>Stop Recording</button>
        <textarea value={condition} onChange={(e)=>setCondition(e.target.value)}/>
        <button className='button-subtle' onClick={runCondition}>Run Condition</button>



    </div>
  )
}

export default Toolbar




async function handleThemeChange() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = new URL(tab.url).hostname;

  const { darkSites = [] } = await chrome.storage.local.get("darkSites");
  const index = darkSites.indexOf(domain);

  if (index === -1) {
    darkSites.push(domain);
  } else {
    darkSites.splice(index, 1);
  }

  await chrome.storage.local.set({ darkSites });

  // 🔹 Send message to active tab
  await sendMessageToActiveTab({ action: "toggleTheme"});
}




async function executeCodeInTab(codeString,context){

  const tabId= await getCurrentTabID()

    await chrome.scripting.executeScript({
    target: { tabId },
    func: (code, context) => {
      try {
        // ⚠️ This new Function runs in the PAGE context
        const run = new Function('context', code);
        run(context);
      } catch (err) {
        console.error('Error executing injected code:', err);
      }
    },
    args: [codeString, context],
    world: "MAIN", // ✅ Ensures it runs in the page's DOM world
  });

}