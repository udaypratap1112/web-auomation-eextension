 import { finder } from "@medv/finder";
 
 function recordUserWorkflow() {
    const workflow = [];
  
    
  
    function updateWorkflow(step) {
      console.log('Step recorded: ',step);
      const last = workflow[workflow.length - 1];
      if (last && last.type === step.type && last.selector === step.selector) {
        workflow[workflow.length - 1] = step; // Replace last step
      } else {
        workflow.push(step);
      }
      chrome.runtime.sendMessage({action:"updateWorkflow",workflow:workflow});
    }
  
    const clickHandler = (e) => {
      const selector = finder(e.target);
      updateWorkflow({ type: 'click', selector,id:Date.now().toString() });
    };
  
    const inputHandler = (e) => {
      const selector = finder(e.target);
      const tag = e.target.tagName.toLowerCase();
      const type = e.target.type;
      const id=Date.now().toString()
  
      if (type === 'checkbox' || type === 'radio') {
        updateWorkflow({ type: 'checkbox/radio', selector, value: e.target.checked,id });
      } else if (tag === 'select') {
        updateWorkflow({ type: 'select', selector, value: e.target.value,id });
      } else {
        updateWorkflow({ type: 'type', selector, value: e.target.value,id });
      }
    };
  
    document.addEventListener('click', clickHandler, true);
    document.addEventListener('change', inputHandler, true);
    document.addEventListener('input', inputHandler, true);
    insertRecordingUI()
  
    console.log('🟢 Recording started. Run `stopRecording()` to stop and view the workflow.');
  
    window.stopRecording = () => {
      document.removeEventListener('click', clickHandler, true);
      document.removeEventListener('change', inputHandler, true);
      document.removeEventListener('input', inputHandler, true);
      removeRecordingUI()
      console.log('🛑 Recording stopped.');
      console.log('📋 Final Workflow:');
      console.log(workflow);
      return workflow;
    };
  
    return workflow;
  }


  export {recordUserWorkflow}




/**
 * Insert a minimal recording UI with a red dot + "Recording" text
 * @returns {HTMLElement} - The UI element
 */
function insertRecordingUI() {
  // Remove existing UI if present
  const existing = document.getElementById("recording-ui");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "recording-ui";

  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: "rgba(31, 41, 55, 0.9)", // dark semi-transparent
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: "12px",
    fontWeight: "500",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 999999,
  });

  // Red pulsing dot
  const dot = document.createElement("div");
  Object.assign(dot.style, {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    boxShadow: "0 0 6px rgba(239,68,68,0.6)",
    animation: "blipPulse 1s infinite alternate",
  });

  // Add pulsing keyframes
  const style = document.createElement("style");
  style.id = "recording-ui-style";
  style.innerHTML = `
    @keyframes blipPulse {
      from { transform: scale(1); opacity: 0.8; }
      to { transform: scale(1.4); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  const text = document.createElement("span");
  text.innerText = "Recording";

  container.appendChild(dot);
  container.appendChild(text);
  document.body.appendChild(container);

  return container;
};

/**
 * Remove the recording UI
 */
function removeRecordingUI() {
  const ui = document.getElementById("recording-ui");
  if (ui) ui.remove();

  const style = document.getElementById("recording-ui-style");
  if (style) style.remove();
}

