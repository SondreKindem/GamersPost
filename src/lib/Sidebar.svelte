<script>
    import {fly, fade} from 'svelte/transition';
    import Hamburger from "./Hamburger.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {createClient} from "@supabase/supabase-js";
    import {supabaseKey, supabaseUrl} from "./Constants.js";
    import {sites} from "../stores/stores.js";
    import CustomCheckbox from "./CustomCheckbox.svelte";
    import CustomRadio from "./CustomRadio.svelte";
    import {classicTheme, currentTheme, darkTheme, lightTheme, setTheme} from "./Theming.js";

    export let show = true;

    /**
     * @type {DbWebsite[]}
     */
    let websites = []
    let sitesChanged = false
    const dispatch = createEventDispatcher()
    let theme = currentTheme

    onMount(async () => {
        websites = await loadSites()
    })

    function saveClicked() {
        localStorage.setItem("sites", JSON.stringify($sites))
        dispatch("save", {
            sitesChanged: sitesChanged
        })
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

    /**
     * @returns {Promise<DbWebsite[]>}
     */
    async function loadSites() {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const {data, error} = await supabase
            .from('websites')
            .select()
        return data ?? []
    }
</script>

<Hamburger bind:open={show}/>
{#if show}
    <nav transition:fly={{x: -300, opacity: 1}}>
        <div class="inner-wrap">
            <h2>Themes</h2>
            <form>
                <CustomRadio name="Classic" id="classic" checked={currentTheme==="classic"} on:change={themeChanged}/>
                <CustomRadio name="Light" id="light" checked={currentTheme==="light"} on:change={themeChanged}/>
                <CustomRadio name="Dark" id="dark" checked={currentTheme==="dark"} on:change={themeChanged}/>
            </form>

            <h2>Sources</h2>
            {#each websites as website}
                <CustomCheckbox id="{website.id}" name="{website.name}" checked={$sites.includes(website.id)}
                                on:changed={() => websiteChanged(website.id)}/>
            {/each}

            <button class="big-button" on:click={saveClicked}>Save</button>
        </div>
    </nav>
    <div class="overlay" on:click={() => show = !show} transition:fade={{duration: 120}}></div>
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--background);
        overflow-y: auto;
        width: 300px;
        z-index: 800;
        border-right: 1px solid #aaa;
    }

    .inner-wrap {
        position: relative;
        margin: 2rem 1rem 0.6rem;
        padding-bottom: 80px;
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