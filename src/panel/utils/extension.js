function isChromeExtensionEnvironment() {
  return typeof chrome !== 'undefined' && typeof chrome.tabs !== 'undefined' && typeof chrome.storage !== 'undefined'
}

 async function getInspectedWindowTabID() {
    // 🧠 If inside a DevTools panel or side panel:
  if (chrome.devtools?.inspectedWindow) {
    return chrome.devtools.inspectedWindow.tabId;
  }

  // 🧩 Otherwise (e.g. background, popup, etc.)
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) throw new Error("No active tab found");
  return tabs[0].id;
}

async function sendMessageToInspectedWindow(msg) {
  if (isChromeExtensionEnvironment()) {
    const tabId =  await getInspectedWindowTabID()
    chrome.tabs.sendMessage(tabId, msg)
  }
}

 function copyValue(value) {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.style.position = 'fixed' // Avoid scrolling to bottom
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      const successful = document.execCommand('copy')
      console.log(successful ? 'Copied to clipboard:' : 'Copy failed:', value)
    } catch (err) {
      console.error('Fallback: Unable to copy', err)
    }

    document.body.removeChild(textarea)
  }


const handleExport = (workflows) => {
  // Convert workflows array to JSON
  const json = JSON.stringify(workflows, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Use Chrome downloads API
  chrome.downloads.download(
    {
      url,               // Object URL of the blob
      filename: "workflows.json", // Default filename
      saveAs: true       // Shows "Save As" dialog
    },
    (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError);
      } else {
        console.log("Download started, ID:", downloadId);
      }
      // Revoke object URL after starting download
      URL.revokeObjectURL(url);
    }
  );
};

const handleImport = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedWorkflows = JSON.parse(e.target.result);

      if (!Array.isArray(importedWorkflows)) {
        alert("⚠️ Invalid file format: must be an array of workflows.");
        return;
      }

      // Get existing workflows from storage
      chrome.storage.local.get({ workflows: [] }, (result) => {
        const existing = result.workflows;

        // Merge logic: replace if workflowId exists, else add
        const updatedWorkflowsMap = {};

        // First, add all existing workflows to the map
        existing.forEach((wf) => {
          updatedWorkflowsMap[wf.workflowId] = wf;
        });

        // Then, overwrite/add imported workflows
        importedWorkflows.forEach((wf) => {
          updatedWorkflowsMap[wf.workflowId] = wf;
        });

        // Convert back to array
        const updatedWorkflows = Object.values(updatedWorkflowsMap);

        // Save merged workflows
        chrome.storage.local.set({ workflows: updatedWorkflows }, () => {
          setWorkflows(updatedWorkflows);
          alert("✅ Workflows imported successfully!");
        });
      });
    } catch (err) {
      alert("❌ Failed to read file: " + err.message);
    }
  };

  reader.readAsText(file);
};




export{isChromeExtensionEnvironment,getInspectedWindowTabID,sendMessageToInspectedWindow,copyValue,handleExport,handleImport}