// contentScript.js

let darkModeStyleId = 'my-dark-mode-style';

/**
 * Apply dark mode to the page
 */
function enableDarkMode() {
    if (document.getElementById(darkModeStyleId)) return; // already applied

    const style = document.createElement('style');
    style.id = darkModeStyleId;
    style.innerHTML = `
        html {
            filter: invert(1) hue-rotate(180deg);
            
        }
        img, video, iframe {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Remove dark mode from the page
 */
function disableDarkMode() {
    const style = document.getElementById(darkModeStyleId);
    if (style) style.remove();
}


async function syncDarkMode() {
  const { darkSites = [] } = await chrome.storage.local.get("darkSites");
  const domain = location.hostname;

  if (darkSites.includes(domain)) {
    enableDarkMode();
  } else {
    // if style exists but domain isn't in array → remove it
    disableDarkMode();
  }
}


export {enableDarkMode,disableDarkMode,syncDarkMode}
