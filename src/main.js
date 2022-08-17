import './app.css'
import App from './App.svelte'
import {loadTheme} from "./lib/Theming.js";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

loadTheme()

TimeAgo.addDefaultLocale(en)

const app = new App({
    target: document.getElementById('app')
})


export default app
