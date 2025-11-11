 function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(`Timeout: ${selector} not found`);
      }
    }, 100);
  });
}

 function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 function clickElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
    el.dispatchEvent(event);
  } else {
    console.warn(`Element not found: ${selector}`);
  }
}

function setInputValue(selector, inputValue) {
  try {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`No element found for selector: ${selector}`);
      return false;
    }

    const previousValue = element.value;

    // Get native setter from the prototype
    const prototype = Object.getPrototypeOf(element);
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (valueSetter) {
      valueSetter.call(element, inputValue);
    } else {
      element.value = inputValue;
    }

    // For React tracking (must be before input event)
    const tracker = element._valueTracker;
    if (tracker) tracker.setValue(previousValue);

    // Dispatch events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  } catch (error) {
    console.error('Error setting input value:', error);
    return false;
  }
}




function setSelectValue(selector, value) {
  const el = document.querySelector(selector);
  if (!el || el.tagName.toUpperCase() !== "SELECT") {
    console.warn(`Select element not found or invalid: ${selector}`);
    return false;
  }

  const searchValue = value.trim().toLowerCase();
  const options = Array.from(el.options);
  const matchedOption = options.find(
    opt =>
      opt.value.toLowerCase() === searchValue ||
      opt.text.toLowerCase() === searchValue
  );

  if (!matchedOption) {
    console.warn(`Value "${value}" not found for: ${selector}`);
    return false;
  }


  // Set new value
  el.value = matchedOption.value;


  el.dispatchEvent(new Event("change", { bubbles: true }));

  return true;
}



 function navigateTo(url) {
  window.location.href = url;
}

 function goBack() {
  window.history.back();
}

 function goForward() {
  window.history.forward();
}



 function hoverElement(selector) {
  const el = document.querySelector(selector);
  if (el) {
    const event = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
    el.dispatchEvent(event);
  } else {
    console.warn(`Element not found: ${selector}`);
  }
}

 function scrollToElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  else console.warn(`Element not found: ${selector}`);
}

function setCheckboxOrRadioValue(selector, cValue = true) {
  const el = document.querySelector(selector);

  if (!el) {
    console.warn(`Checkbox or radio not found: ${selector}`);
    return;
  }

  // Convert string values "true"/"false" to boolean
  if (typeof cValue === "string") {
    const lower = cValue.toLowerCase().trim();
    if (lower === "true") cValue = true;
    else if (lower === "false") cValue = false;
  }

  if (el.type === "checkbox" || el.type === "radio") {
    if (el.checked !== cValue) {
      el.checked = cValue;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  } else {
    console.warn(`Element is not a checkbox or radio: ${selector}`);
  }
}


export {waitForElement,wait,clickElement,hoverElement,scrollToElement,setCheckboxOrRadioValue,goForward,goBack,navigateTo,setInputValue,setSelectValue}