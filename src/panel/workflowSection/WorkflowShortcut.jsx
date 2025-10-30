import React from "react";
import { useWorkflowsData } from "../context/WorkflowContext";
import { useSheetData } from "../context/SheetContext";
import { sendMessageToActiveTab } from "../utils/extension";

const QuickRunPopup = () => {
  const { workflows } = useWorkflowsData();
  const { currentRowData } = useSheetData();

  // 🟢 Run selected workflow
  async function startAutomation(workflow) {
    sendMessageToActiveTab( {
            action: "runWorkflow",
            workflow: workflow,
            data: Object.fromEntries(currentRowData.entries()),
          })
  }

  return (
    <div className="fixed bottom-4 right-20 w-72 max-h-[60vh] overflow-y-auto bg-card  border border-border rounded-2xl shadow-2xl p-3 z-[9999]  transition-all duration-300" >
      <h2 className="text-sm font-semibold mb-2 ml-2"> Run Workflow </h2>

      {workflows.length === 0 ? (
        <p className="text-sm text-gray-500 text-center"> No workflows found. </p>
      ) : (
        <ul className="space-y-2">
          {workflows.map((wf) => (
            <li
              key={wf.workflowId}
              onClick={() => startAutomation(wf)}
              className="cursor-pointer select-none
                         bg-background border border-border rounded-lg 
                         px-3 py-2 text-sm font-medium
                         hover:brightness-110 active:scale-95 
                         transition flex items-center justify-between"
            >
              <span className="truncate">
                {wf.name || "Untitled Workflow"}
              </span>
              {/* <span className="text-xs opacity-70">
                {wf.steps.length} step{wf.steps.length !== 1 ? "s" : ""}
              </span> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuickRunPopup;
