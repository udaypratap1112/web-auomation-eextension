import React from 'react'
import { useSheetData } from '../context/SheetContext'
import { sendMessageToInspectedWindow } from '../utils/extension'
import{Moon,Sun} from 'lucide-react'

const Toolbar = () => {
    const{isTabDark,setIsTabDark}=useSheetData()

    function handleClick(){
        const tabTheme=!isTabDark
        sendMessageToInspectedWindow({action:"toggleTheme",isTabDark:tabTheme})
        setIsTabDark(tabTheme)
    }
    function handleRecordworkflow(){
      sendMessageToInspectedWindow({action:"recordUser"})
    }
    function stopRecording(){
      sendMessageToInspectedWindow({action:"stopRecording"})
    }


  return (

    <div className='w-full flex gap-2'>
        <button className='button-subtle' onClick={handleClick}>{isTabDark?<Moon size={18}/>:<Sun size={18}/>}</button>
        <button className='button-subtle' onClick={handleRecordworkflow}>Record Workfloe</button>
        <button className='button-subtle' onClick={stopRecording}>Stop Recording</button>


    </div>
  )
}

export default Toolbar