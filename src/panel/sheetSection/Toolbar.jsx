import React, { useState } from 'react'
import { useSheetData } from '../context/SheetContext'
import { sendMessageToActiveTab } from '../utils/extension'
import{Moon,Sun} from 'lucide-react'

const Toolbar = () => {
    const{isTabDark,setIsTabDark}=useSheetData()
    const [condition, setCondition] = useState("")

    function handleClick(){
        const tabTheme=!isTabDark
        sendMessageToActiveTab({action:"toggleTheme",isTabDark:tabTheme})
        setIsTabDark(tabTheme)
    }
    function handleRecordworkflow(){
      sendMessageToActiveTab({action:"recordUser"})
    }
    function stopRecording(){
      sendMessageToActiveTab({action:"stopRecording"})
    }

    function runCondition(){
      sendMessageToActiveTab({action:"runCondition",data:{name:"uday",age:23},condition:condition})
    }


  return (

    <div className='w-full flex flex-col gap-2'>
        <button className='button-subtle' onClick={handleClick}>{isTabDark?<Moon size={18}/>:<Sun size={18}/>}</button>
        <button className='button-subtle' onClick={handleRecordworkflow}>Record Workfloe</button>
        <button className='button-subtle' onClick={stopRecording}>Stop Recording</button>
        <textarea value={condition} onChange={(e)=>setCondition(e.target.value)}/>
        <button className='button-subtle' onClick={runCondition}>Run Condition</button>



    </div>
  )
}

export default Toolbar