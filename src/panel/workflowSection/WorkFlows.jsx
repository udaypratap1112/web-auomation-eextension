import React from "react";
import { Edit, Play, Trash, Plus } from "lucide-react";
import { useWorkflowsData } from "../context/WorkflowContext";
import { useSheetData } from "../context/SheetContext";
import { handleExport, sendMessageToInspectedWindow } from "../utils/extension";


const WorkFlows = ({ onOpenEditor }) => {
  const { workflows, setWorkflows } = useWorkflowsData();
  const { currentRowData } = useSheetData();

  // 🟢 Run automation for selected workflow
  async function startAutomation(workflow, data = {}) {
  
    sendMessageToInspectedWindow( {
        action: "runWorkflow",
        workflow: workflow,
        data: Object.fromEntries(currentRowData.entries()),
      })
  }

  // 🔴 Delete workflow and update storage
  const deleteWorkflow = async (workflowId) => {
    console.log(`Deleting workflow with ID: ${workflowId}`);
    const { workflows = [] } = await chrome.storage.local.get("workflows");
    const updatedWorkflows = workflows.filter(
      (wf) => wf.workflowId !== workflowId
    );
    await chrome.storage.local.set({ workflows: updatedWorkflows });
    setWorkflows(updatedWorkflows);
    console.log(`Deleted workflow with ID: ${workflowId}`);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="sm:text-xl font-bold">Saved Workflows</h2>

        <div className="flex gap-1 text-xs sm:text-sm">

        <button onClick={() => handleExport(workflows)} className="button-filled" > <Plus/> Export </button>
        <button onClick={() => onOpenEditor(null)} className="button-filled" > <Plus/> Create Workflow </button>
        </div>
        
      </div>

      {/* List of workflows */}
      {workflows.length === 0 ? (
        <p className="text-gray-500">No workflows found.</p>
      ) : (
        <ul className="space-y-2">
          {workflows.map((workflow) => (
            <li
              key={workflow.workflowId}
              className="bg-card rounded-lg shadow p-3 border border-border flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {workflow.name || "Untitled Workflow"}
                </p>
                <small className="brightness-80 font-light">
                  {workflow.steps.length} step
                  {workflow.steps.length !== 1 ? "s" : ""}
                </small>
              </div>

              <div className="flex">
                <button className="button-ghost" onClick={() => startAutomation(workflow, currentRowData)} >
                <Play size={20} className="" />
                </button>

                <button className="button-ghost" onClick={() => onOpenEditor(workflow)}>
                  <Edit size={20} className=""  />
                </button>
                <button className="button-ghost"  onClick={() => deleteWorkflow(workflow.workflowId)} >
                  <Trash size={20} className=""/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkFlows;
