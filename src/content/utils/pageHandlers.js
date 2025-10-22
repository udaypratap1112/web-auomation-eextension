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

function setInputValue(selector, value) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`Input not found: ${selector}`);
    return false;
  }

  el.focus();

  // Save the current value (React-specific)
  const lastValue = el.value;
  el.value = value;

  // React internal tracking fix
  const tracker = el._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }

  // Dispatch events to notify any framework listeners
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));

  el.blur();

  return true;
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

  // Store previous value before change
  const lastValue = el.value;

  // Set new value
  el.value = matchedOption.value;

  // React fix (other frameworks ignore)
  const tracker = el._valueTracker;
  if (tracker) tracker.setValue(lastValue);

  // Fire events to notify all frameworks
  el.dispatchEvent(new Event("input", { bubbles: true }));
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

 function triggerKeyboardShortcut(key, modifiers = {}) {
  const event = new KeyboardEvent('keydown', {
    key: key,
    ctrlKey: modifiers.ctrl || false,
    shiftKey: modifiers.shift || false,
    altKey: modifiers.alt || false,
    metaKey: modifiers.meta || false,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
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


export {waitForElement,wait,clickElement,hoverElement,scrollToElement,setCheckboxOrRadioValue,triggerKeyboardShortcut,goForward,goBack,navigateTo,setInputValue,setSelectValue}