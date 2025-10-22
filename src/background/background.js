chrome.action.onClicked.addListener((tab) => {
  try {
    // Open side panel for the current tab
    chrome.sidePanel.open({ tabId: tab.id });

    // Optionally set the side panel page dynamically
    // chrome.sidePanel.setOptions({
    //   tabId: tab.id,
    //   path: "sidepanel.html"
    // });

    console.log("Side panel opened for tab:", tab.id);
  } catch (err) {
    console.error("Failed to open side panel:", err);
  }
});
