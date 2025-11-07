import { useState } from "react";
import crxLogo from "@/assets/crx.svg";

import SheetReader from "./sheetSection/SheetReader";
import WorkflowEditor from "./workflowSection/WorkflowEditor";
import WorkFlows from "./workflowSection/WorkFlows";
import ReactWorkflowEditor from "../components/reactFlow/ReactWorkflowEditor";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);


  const handleOpenEditor = (workflow) => {
    setSelectedWorkflow(workflow);
    setActiveTab("editor");
  };
  const createWorkFlow = (workflow) => {
    setSelectedWorkflow(null);
    setActiveTab("editor");
  };

  const handleBackToWorkflows = () => {
    setSelectedWorkflow(null);
    setActiveTab("workflows");
  };

  return (
    <div className="bg-background text-foreground min-h-screen ">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-1 font-inter text-sm">
        {activeTab === "home" && <SheetReader />}

        {/* {activeTab === "workflows" && ( <WorkFlows onOpenEditor={handleOpenEditor} createWorkFlow={createWorkFlow} /> )} */}
        {activeTab === "workflows" && ( <ReactWorkflowEditor/> )}

        {activeTab === "editor" && ( <WorkflowEditor existingWorkflow={selectedWorkflow} onBack={handleBackToWorkflows} /> )}
      </div>
    </div>
  );
}

// ---------------------- Navbar ----------------------
function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-card text-base mb-4">
      <ul className="grid grid-cols-2 font-medium">
        <li className={`flex justify-center cursor-pointer pb-2 border-b-4 transition-all pt-2 ${ activeTab === "home" ? "border-foreground" : "border-transparent" }`}
         onClick={() => setActiveTab("home")} > Home </li>

        <li className={`flex justify-center cursor-pointer pb-2 border-b-4 transition-all pt-2 ${ activeTab === "workflows" ? "border-foreground" : "border-transparent" }`}
         onClick={() => setActiveTab("workflows")} > Workflows </li>
      </ul>
    </nav>
  );
}
