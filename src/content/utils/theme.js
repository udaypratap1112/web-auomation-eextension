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

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const style = document.getElementById(darkModeStyleId);
    if (style) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function toggleDarkByState(isDark){
    // const style = document.getElementById(darkModeStyleId);
    if(isDark){
        enableDarkMode()
    }else{
        disableDarkMode
    }

}

export {enableDarkMode,disableDarkMode,toggleDarkMode,toggleDarkByState}
