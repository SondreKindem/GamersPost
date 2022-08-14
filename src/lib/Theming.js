export function setCssVariables(variables) {
    for (const name in variables) {
        document.querySelector('html').style.setProperty(`--${name}`, variables[name]);
    }
}

export function saveDefaultTheme(theme) {
    localStorage.setItem("theme", JSON.stringify(theme))
}

export function loadTheme() {
    const themeString = localStorage.getItem("theme")
    if (themeString) {
        const themeObject = JSON.parse(themeString)
        setCssVariables(themeObject)
    } else {
        setCssVariables(defaultTheme)
    }
}

export const defaultTheme = {
    background: "#242424",
    textColor: "#FFFFFFDD",
    borderRadius: "5px",
    articleBackground: "#747bff"
}