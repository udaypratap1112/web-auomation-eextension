import * as handlers from './pageHandlers'


function runWorkflow(workflow, data) {
    
  const workflowSteps=workflow.steps;
  console.log("ruuning workflow",workflow);
  console.log("Running workflow: ",workflow.name)

  if(workflowSteps.length<1){
      console.log("NO steps found in workflow");
      return
  }
  console.log(data);

  const executeStep = async (step) => {
    await handlers.wait(50); // Optional delay between steps
    let { type, selector, value } = step;


    let nValue

    if (value && typeof value=="string" && value.startsWith('$')) {
      const key = value.slice(1);
      nValue = data[key];
    }else{
        nValue=value
    }

    try {
      switch (type) {
        case 'click':
          handlers.clickElement(selector)
          break;

        case 'type':
          handlers.setInputValue(selector, nValue);
          break;

        case 'checkbox/radio':
          handlers.setCheckboxOrRadioValue(selector, nValue);
          break;

        case 'select':
          handlers.setSelectValue(selector, nValue);
          break;

        // case 'navigate':
        //   navigateTo(selector);
        //   break;

        // case 'back':
        //   goBack();
        //   break;

        // case 'forward':
        //   goForward();
        //   break;

        // case 'keyboard':
        //   triggerKeyboardShortcut(text, checked); // `text` is key, `checked` is modifiers
        //   break;

        // case 'hover':
        //   hoverElement(selector);
        //   break;

        // case 'scroll':
        //   scrollToElement(selector);
        //   break;

        default:
          console.warn(`Unknown action type: ${type}`);
      }
    } catch (error) {
      console.error(`Error executing step: ${error}`);
    }
  };

  workflowSteps.forEach(executeStep);
}


export {runWorkflow}