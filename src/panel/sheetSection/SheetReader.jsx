import { useMemo, useState } from 'react'
import { useSheetData } from '../context/SheetContext'
import * as XLSX from 'xlsx'
import { Bot, Search } from 'lucide-react'
import Toolbar from './Toolbar'
import { copyValue } from '../utils/extension'
import QuickRunPopup from '../workflowSection/WorkflowShortcut'
// import AutomationShortcut from '../components/AutomationShortcut'

const SheetReader = () => {
  const [file, setFile] = useState(null)
  const { sheetData, setSheetData, currentRowData, currentRow, setCurrentRow, currentHeader, setCurrentHeader } = useSheetData()
  const [showWorkflow, setShowWorkflow] = useState(false)

  const handleFileChange = async event => {
    const cfile = event.target.files[0]
    setFile(cfile)
    if (!cfile) return

    const reader = new FileReader()
    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheet]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: true, defval: '' })
      console.log(jsonData)
      setSheetData(jsonData)
    }
    reader.readAsArrayBuffer(cfile)
  }

 
  return (
    <div className='px-2 rounded-lg space-y-6'>
      {/* [FORMS] */}
      <div className='grid grid-cols-3 gap-2 items-end opacity-70'>
        <div className='w-full'>
          <label className='block'>Upload File</label>
           <input type='file' onChange={handleFileChange} className='w-full' />
          {/* {file && <p className='mt-2 text-sm '>Selected file: {file.name}</p>} */}
        </div>
        <div className='w-full'>
          <label className='block'>Header</label>
          <input type='number' value={currentHeader} onChange={e => setCurrentHeader(e.target.value)} className='w-full' />
        </div>
        <div className='w-full'>
          <label>Row</label>
          <div className='flex items-center relative'>

            <input type='number' value={currentRow} onChange={e => setCurrentRow(e.target.value)} className='block w-full' />
            <span className='absolute left-10 pointer-events-none'>/{sheetData.length}</span>
          </div>
        </div>
          {/* <button onClick={() => setCurrentRow(Number(currentRow) + 1)} className='block w-full'> Next </button> */}
      </div>



      {/* <div className='mb-0'>
        Showing row {currentRow} (from 1 to {sheetData.length} rows)
      </div> */}

      {/* {TABLE} */}
 <SheetTable/>

      <div className='fixed bg-foreground rounded-lg p-2 bottom-5 right-5'>
        <span className='text-background' onClick={() => setShowWorkflow(prev => !prev)}>
          <Bot />
        </span>
      </div>
        {showWorkflow && <QuickRunPopup />}
      <Toolbar/>
    </div>
  )
}

export default SheetReader



function SheetTable(){
  const [search, setSearch] = useState("")
  const {currentRowData}=useSheetData()


  const filteredRows = useMemo(() => {
  if (!search) return Array.from(currentRowData.entries()); // show all
  const lowerSearch = search.toLowerCase();
  return Array.from(currentRowData.entries()).filter(
    ([key]) => key.toLowerCase().includes(lowerSearch)
  );
}, [currentRowData, search]);


  return(
    <div className='w-full  rounded overflow-x-auto'>
        <table className='w-full text-left  border-collapse'>
          <thead className='border-b border-border'>
            <tr>
              <th className='relative flex items-center'>
                <span className='absolute left-2'><Search size={16}/></span>
                <input type="text" placeholder='Search Header' className='no-input-style py-3 px-2 outline-none font-medium pl-8' value={search} onChange={(e)=>setSearch(e.target.value)} />
              </th>
              <th className='px-2 '>Values</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border '>
            {!currentRowData || currentRowData.size === 0 ? (
              <tr>
                <td colSpan='2' className='py-2 text-center'> No results found. </td>
              </tr>
            ) : (
              filteredRows.map(([key, value]) => (
                <tr key={key} className='hover:bg-input'>
                  <td className='p-3 font-medium ' onClick={() => copyValue(value)}> {key} </td>
                  <td className='p-3 font-medium break-words' onClick={() => copyValue(value)}> {value} </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  )
}
