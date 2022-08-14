import './app.css'
import App from './App.svelte'
import {loadTheme} from "./lib/Theming.js";

loadTheme()

const app = new App({
    target: document.getElementById('app')
})


export default app
