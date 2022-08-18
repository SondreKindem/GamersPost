<script>
    import {fly, fade} from 'svelte/transition';
    import Hamburger from "./Hamburger.svelte";
    import {createEventDispatcher} from "svelte";
    import {sites, websites} from "../stores/stores.js";
    import CustomCheckbox from "./CustomCheckbox.svelte";
    import CustomRadio from "./CustomRadio.svelte";
    import {classicTheme, currentTheme, darkTheme, lightTheme, setTheme} from "./Theming.js";

    export let show = false;

    let sitesChanged = false
    let sitesSaved = false
    const dispatch = createEventDispatcher()
    let theme = currentTheme
    let selectedSitesOnOpen = [...$sites]

    function toggleOpen() {
        show = !show;
        if (show === true) {
            // Save the state as it was on sidebar open
            selectedSitesOnOpen = [...$sites]
        } else if (!sitesSaved) {
            resetSelection()
        }
        sitesSaved = false
    }

    function resetSelection() {
        sites.update(() => selectedSitesOnOpen)
    }

    function saveClicked() {
        localStorage.setItem("sites", JSON.stringify($sites))
        dispatch("save", {
            sitesChanged: sitesChanged
        })
        sitesSaved = true
        toggleOpen()
    }

    function websiteChanged(id) {
        if (!$sites.includes(id)) {
            $sites = [...$sites, id]
        } else {
            $sites = $sites.filter(s => s !== id)
        }
        sitesChanged = true
        console.log($sites)
    }

    function themeChanged(event) {
        switch (event.detail.value) {
            case "light":
                setTheme(lightTheme)
                break;
            case "dark":
                setTheme(darkTheme)
                break;
            case "classic":
                setTheme(classicTheme)
                break;
        }
    }
</script>

<Hamburger bind:open={show} on:change={toggleOpen}/>
{#if show}
    <nav transition:fly={{x: -350, opacity: 1}}>
        <div class="inner-wrap">
            <h2>Themes</h2>
            <form>
                <CustomRadio name="Classic" id="classic" checked={currentTheme==="classic"} on:change={themeChanged}/>
                <CustomRadio name="Light" id="light" checked={currentTheme==="light"} on:change={themeChanged}/>
                <CustomRadio name="Dark" id="dark" checked={currentTheme==="dark"} on:change={themeChanged}/>
            </form>

            <h2>Sources</h2>
            {#each Object.entries($websites) as [key, website]}
                <CustomCheckbox id="{website.id}" name="{website.name}" checked={$sites.includes(website.id)}
                                on:changed={() => websiteChanged(website.id)}/>
            {/each}

            <button id="save-button" class="big-button" on:click={saveClicked}>Save</button>
        </div>
    </nav>
    <div class="overlay" on:click={toggleOpen} transition:fade={{duration: 120}}></div>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--background);
        overflow-y: auto;
        width: 350px;
        z-index: 800;
        border-right: 1px solid #aaa;
    }

    .inner-wrap {
        position: relative;
        margin: 2rem 1rem 0.6rem;
        padding-bottom: 15px;
    }

    #save-button {
        position: sticky;
        bottom: 10px;
        z-index: 999;
        margin-left: 80px;
        margin-right: -2px;
        width: 220px!important;
        background-color: var(--primaryColor)!important;
    }
    #save-button:hover {
        position: sticky;
        bottom: 10px;
        z-index: 999;
        margin-left: 80px;
        background-color: #7e004b !important;
    }

    .overlay {
        z-index: 700;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .5);
    }
</style>