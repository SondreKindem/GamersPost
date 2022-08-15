export function setCssVariables(variables) {
    for (const name in variables) {
        document.querySelector('html').style.setProperty(`--${name}`, variables[name]);
    }
}

export let currentTheme = "classic"

export function saveTheme(theme) {
    localStorage.setItem("theme", JSON.stringify(theme))
}

export function setTheme(theme) {
    setCssVariables(theme)
    saveTheme(theme)
    currentTheme = theme.name
}

export function loadTheme() {
    const themeString = localStorage.getItem("theme")
    if (themeString) {
        const themeObject = JSON.parse(themeString)
        setCssVariables(themeObject)
        currentTheme = themeObject.name
    } else {
        setCssVariables(classicTheme)
        currentTheme = "classic"
    }
}

export const lightTheme = {
    name: "light",
    primaryColor: "#930056",
    background: "#ececec",
    textColor: "rgb(30,30,30)",
    borderRadius: "5px",
    articleBackground: "rgba(0,0,0,0.06)",
    articleRadius: "5px",
    articleBorder: "none",
    checkboxBackground: "#fff",
    checkboxTextColor: "inherit",
    buttonBackground: "#1a1a1a",
}

export const darkTheme = {
    name: "dark",
    primaryColor: "#930056",
    background: "#242424",
    textColor: "#FFFFFFDD",
    borderRadius: "5px",
    articleBackground: "rgba(0,0,0,0.27)",
    articleRadius: "5px",
    articleBorder: "none",
    checkboxBackground: "rgba(0,0,0,0.27)",
    checkboxTextColor: "inherit",
    buttonBackground: "#1a1a1a",
}

export const classicTheme = {
    name: "classic",
    primaryColor: "#930056",
    background: "#d2b79c url('background.jpg') repeat",
    textColor: "rgb(30,30,30)",
    borderRadius: "5px",
    articleBackground: "transparent",
    articleRadius: "0",
    articleBorder: "7px solid rgba(34,24,20,0.19)",
    checkboxBackground: "#120d0b",
    checkboxTextColor: "#FFFFFFDD",
    buttonBackground: "#120d0b",
}