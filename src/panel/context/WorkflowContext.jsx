import { createContext, useContext, useEffect, useState } from "react";


/**
 * @typedef {Object} WorkflowsDataContextType
 * @property {Array<Object>} workflows - The workflow data.
 * @property {Function} setWorkflows - Function to update the workflow
 * @property {Function} refetchWorkflows - Refetch all the workflows from storage
       
 */




const WorkflowsContext= createContext(undefined);

function WorkflowsContextProvider({children}){
    const [workflows, setWorkflows] = useState([])

      useEffect(() => {
        chrome.storage.local.get({ workflows: [] }, result => {
          setWorkflows(result.workflows)
        })
      }, [])

      function refetchWorkflows(){
        chrome.storage.local.get({ workflows: [] }, result => {
          setWorkflows(result.workflows)
        })
      }


    return(
        <WorkflowsContext.Provider value={{workflows,setWorkflows,refetchWorkflows}}>
            {children}
        </WorkflowsContext.Provider>
    )
}


/**
 * 
 * @returns {WorkflowsDataContextType}
 */
const useWorkflowsData = () => {
  const context = useContext(WorkflowsContext);
  if (!context) {
    throw new Error('useWorkflowsData must be used inside WorkflowsContextProvider ');
  }
  return context;
};

export {useWorkflowsData,WorkflowsContextProvider}