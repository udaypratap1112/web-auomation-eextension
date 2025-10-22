chrome.devtools.panels.create(
    "Uday pratap",
    null,
    "/src/panel/index.html",//this is the html file which will be shown in devtools panel
    () => {
      console.log("DevTools panel created");
    }
  );
  