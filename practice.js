function recordUserWorkflow() {
  const workflow = [];
  const selectorCache = new WeakMap();
  const inputTimers = new WeakMap();

  // Generate a stable, unique selector for an element
  function getUniqueSelector(el) {
    if (selectorCache.has(el)) return selectorCache.get(el);

    if (el.id) {
      selectorCache.set(el, `#${el.id}`);
      return `#${el.id}`;
    }

    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      let part = el.tagName.toLowerCase();

      if (el.className) {
        // Filter dynamic/react classes
        const classes = el.className
          .trim()
          .split(/\s+/)
          .filter(c => c && !/^sc-|^jsx-/.test(c))
          .join('.');
        if (classes) part += `.${classes}`;
      }

      const siblings = Array.from(el.parentNode.children).filter(
        sibling => sibling.tagName === el.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(el);
        part += `:nth-of-type(${index + 1})`;
      }

      parts.unshift(part);
      el = el.parentElement;
    }

    const selector = parts.length ? parts.join(' > ') : null;
    selectorCache.set(el, selector);
    return selector;
  }

  // Update workflow array and send the latest step to background
  function updateWorkflow(step) {
    const last = workflow[workflow.length - 1];

    // Replace last step if same type and selector to avoid duplicates
    if (last && last.type === step.type && last.selector === step.selector) {
      workflow[workflow.length - 1] = step;
    } else {
      workflow.push(step);
    }

    console.log(step);
    // Send only the latest step
    chrome.runtime.sendMessage({ step });
    console.log('Step recorded:', step.type, step.selector);
  }

  // Handle clicks
  const clickHandler = (e) => {
    // Ignore clicks on the recorder UI itself
    // if (e.target.closest('#recorder-ui')) return;

    const selector = getUniqueSelector(e.target);
    updateWorkflow({ type: 'click', selector, id: Date.now().toString(), time: Date.now() });
  };

  // Handle inputs, checkboxes, radios, selects
  const inputHandler = (e) => {
    const selector = getUniqueSelector(e.target);
    const tag = e.target.tagName.toLowerCase();
    const type = e.target.type;
    const id = Date.now().toString();
    const recordStep = () => {
      if (type === 'checkbox' || type === 'radio') {
        updateWorkflow({ type: 'checkbox', selector, checked: e.target.checked, id, time: Date.now() });
      } else if (tag === 'select') {
        updateWorkflow({ type: 'select', selector, value: e.target.value, id, time: Date.now() });
      } else {
        updateWorkflow({ type: 'type', selector, value: e.target.value, id, time: Date.now() });
      }
    };

    recordStep()
  };

  // Attach event listeners
  document.addEventListener('click', clickHandler, true);
  document.addEventListener('change', inputHandler, true);
  document.addEventListener('input', inputHandler, true);

  console.log('🟢 Recording started. Run `stopRecording()` to stop and view the workflow.');

  // Stop recording function
  window.stopRecording = () => {
    document.removeEventListener('click', clickHandler, true);
    document.removeEventListener('change', inputHandler, true);
    document.removeEventListener('input', inputHandler, true);

    console.log('🛑 Recording stopped.');
    console.log('📋 Final Workflow:');
    console.log(JSON.stringify(workflow, null, 2));
    return workflow;
  };

  return workflow;
}
