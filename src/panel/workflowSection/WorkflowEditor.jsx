import {  useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { MousePointerClick, Keyboard, CheckSquare, ListFilter, GripVertical, ChevronUp, ChevronDown,  Trash } from "lucide-react";
import { useSheetData } from "../context/SheetContext";
import { sendMessageToInspectedWindow } from "../utils/extension";
import { useWorkflowsData } from "../context/WorkflowContext";
import { copyValue } from "../utils/extension";
import { v4 as uuid } from "uuid";




export default function WorkflowEditor({ existingWorkflow = null }) {
    const {refetchWorkflows} = useWorkflowsData()
  

  
  const [steps, setSteps] = useState(existingWorkflow?.steps || []);
  const [workflowName,setWorkflowName] = useState(existingWorkflow?.name || "NewWorkflow");
  
  
  useEffect(() => {
    const handleMessage = (msg, sender, sendResponse) => {
      if(msg.action=="updateWorkflow"){
          setSteps(msg.workflow);

      }
    };
    
    chrome.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const updateStep = (id, property, value) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, [property]: value||"" } : step
      )
    );
  };

  const deleteStep = (id) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
  };
  
  const saveWorkflow = async () => {
    if(!workflowName) return alert("Please enter a workflow name")

    const myFlow = { workflowId: existingWorkflow?.workflowId || uuid(), name:workflowName, steps: steps, };
  
    const { workflows = [] } = await chrome.storage.local.get("workflows");
    let updatedWorkflows = [];
  
    if (existingWorkflow) {
      // Edit mode: replace existing workflow by id
      updatedWorkflows = workflows.map(wf => wf.workflowId === existingWorkflow.workflowId ? myFlow : wf );
    } else {
      // Add mode
      updatedWorkflows = [myFlow, ...workflows];
    }
  
    await chrome.storage.local.set({ workflows: updatedWorkflows });
    refetchWorkflows()
  
    console.log(`${existingWorkflow ? "Updated" : "Saved"} workflow:`, myFlow);
  };

  
  




  const loglocalstroage = async () => {
    const existingWorkflows = await chrome.storage.local.get("workflows");
    const workflows = existingWorkflows.workflows||[];
    console.log(workflows);
  }

  const clearLocalStorage = async () => {
    await chrome.storage.local.clear();
    console.log("Local storage cleared.");
  }

return (
  <div className="p-3 space-y-3  mx-auto">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold">Workflow Steps</h1>
      <span className="text-xs text-muted-foreground">
        {steps.length} step{steps.length !== 1 ? 's' : ''}
      </span>
    </div>

    {/* Workflow name */}
    <div className="flex items-center gap-2">
      
      <input
        type="text"
        id="name"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="flex-1 rounded border border-zinc-700 bg-zinc-800 p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Workflow name"
      />
    </div>

    {/* Buttons */}
    <div className="flex flex-wrap gap-2">
      <button className="button-subtle" onClick={startWorkflowRecording}>Start</button>
      <button className="button-subtle" onClick={stopWorkflowRecording}>Stop</button>
      <button className="button-subtle" onClick={saveWorkflow}>Save</button>
      {/* <button className="button-subtle" onClick={loglocalstroage}>Log</button> */}
      {/* <button className="button-subtle" onClick={clearLocalStorage}>Clear</button> */}
    </div>
    <VariablesAvailable/>

    {/* Hint */}
    <p className="text-xs text-muted-foreground leading-snug border-t border-border pt-2">
      Drag and drop to reorder steps.
    </p>

    {/* Step List */}
    <div className="overflow-y-auto">
      <StepList
        steps={steps}
        setSteps={setSteps}
        getStepIcon={getStepIcon}
        getStepColor={getStepColor}
        updateStep={updateStep}
        deleteStep={deleteStep}
      />
    </div>
  </div>
);

}







const StepItem = ({ step, getStepIcon, getStepColor,updateStep,deleteStep }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Reorder.Item key={step.id} value={step} className="cursor-move border border-zinc-800 shadow-sm hover:shadow-md  rounded-lg bg-zinc-900/50" dragListener={true} dragControls={undefined} layoutId={step.id} >

      <div className="flex items-center gap-3 cursor-pointer p-3 justify-between" >
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-500" />
          <div className={`flex items-center gap-1 px-3 text-sm rounded-full ${getStepColor(step.type)}`}> {getStepIcon(step.type)} {step.type} </div>
        </div>
       
        <div className="flex items-center gap-3 text-gray-500">
          <span className="text-sm text-gray-300">{truncateSelector(step.selector,20)}</span>
          <Trash size={16} className="hover:text-red-800" onClick={()=>deleteStep(step.id)} />
          <span onClick={() => setIsExpanded(!isExpanded)}> {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>} </span>
        </div>
      </div>
      {isExpanded && (
        <div className="py-6 border-t border-zinc-800 px-5 sm:px-10">
          {(step.selector||step.selector=="") && (
            <div className="flex gap-1 items-center text-xs">
              <label htmlFor="" className="w-15" >Selector</label>
              <input type="text" className="bg-zinc-800 px-2 py-1 border border-zinc-700 rounded-sm w-full" value={step.selector}  onChange={(e)=>updateStep(step.id,"selector",e.target.value)}/>
            </div>
          )}
          {/* {(step.text||step.text=="") && (
            <div className="mt-1 flex gap-1 text-xs items-center">
              <label htmlFor="" className="w-15">Value</label>
              <input type="text" className="bg-zinc-800 px-2 py-1 border border-zinc-700 rounded-sm w-full" value={step.text} onChange={(e)=>updateStep(step.id,"text",e.target.value)}/>
            </div>
          )}
          {step.checked !== undefined && (
            <div className="text-xs mt-1 flex gap-1 items-center">
              <label htmlFor="" className="w-15">Checked</label>
              <input type="text" className="bg-zinc-800 px-2 py-1 border border-zinc-700 rounded-sm w-full" value={step.checked} onChange={(e)=>updateStep(step.id,"checked",e.target.value)}/>
            </div>
          )} */}
          {(step.value||step.value=="") && (
            <div className="text-xs mt-1 flex gap-1 items-center">
              <label htmlFor="" className="w-15">Value</label>
              <input type="text" className="bg-zinc-800 px-2 py-1 border border-zinc-700 rounded-sm w-full" value={step.value} onChange={(e)=>updateStep(step.id,"value",e.target.value)}/>
            </div>
          )}
        </div>
      )}
    
  </Reorder.Item>
  );
};

const StepList = ({ steps, setSteps, getStepIcon, getStepColor,updateStep,deleteStep }) => {
  return (
    <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-3" layoutScroll>
      {steps.map((step) => (
        <StepItem
          key={step.id}
          step={step}
          getStepIcon={getStepIcon}
          getStepColor={getStepColor}
          updateStep={updateStep}
          deleteStep={deleteStep}
        />
      ))}
    </Reorder.Group>
  );
};



const getStepIcon = (type) => {
  switch (type) {
    case "click":
      return <MousePointerClick className="h-4 w-4" />;
    case "type":
      return <Keyboard className="h-4 w-4" />;
    case "checkbox/radio":
      return <CheckSquare className="h-4 w-4" />;
    case "select":
      return <ListFilter className="h-4 w-4" />;
    default:
      return <MousePointerClick className="h-4 w-4" />;
  }
};

const getStepColor = (type) => {
  switch (type) {
    case "click":
      return "dark:bg-blue-900 dark:text-blue-300";
    case "type":
      return "dark:bg-green-900 dark:text-green-300";
    case "checkbox/radio":
      return "dark:bg-purple-900 dark:text-purple-300";
    case "select":
      return "dark:bg-amber-900 dark:text-amber-300";
    default:
      return "dark:bg-gray-800 dark:text-gray-300";
  }
};

const truncateSelector = (selector, maxLength = 40) => {
  return selector.length > maxLength ? selector.substring(0, maxLength) + "..." : selector;
};


function startWorkflowRecording() {
  sendMessageToInspectedWindow({action:"recordUser"})
}

function stopWorkflowRecording() {
  sendMessageToInspectedWindow({action:"stopRecording"})
}




const VariablesAvailable = () => {
  const { sheetData, currentHeader } = useSheetData();
  const headers = sheetData[currentHeader-1]||[];
  

  return (
    <div className="mb-5 p-3 bg-card border border-border rounded-lg">
      {/* Header */}
      <h2 className="font-semibold text-sm text-muted-foreground mb-2">
        Data available from current sheet
      </h2>

      {/* Variables */}
      <div className="flex flex-wrap gap-2">
        {headers.length === 0 ? (
          <span className="text-xs text-gray-500">No variables available</span>
        ) : (
          headers.map((header, index) => (
            <span
              key={index}
              className="bg-foreground text-background  px-2 py-1 rounded-full text-xs"
              onClick={()=>copyValue(`$${String(header).trim()}`)}
            >
              ${String(header).trim()}
            </span>
          ))
        )}
      </div>
    </div>
  );
};