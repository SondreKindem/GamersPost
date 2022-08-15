<script>
    import {onMount} from "svelte"
    import Masonry from 'svelte-bricks'
    import Article from "./lib/Article.svelte";
    import {createClient} from '@supabase/supabase-js'
    import {styles, sites} from './stores/stores.js';
    import Sidebar from "./lib/Sidebar.svelte";
    import {supabaseKey, supabaseUrl} from "./lib/Constants.js";
    import IntersectionObserver from "./lib/IntersectionObserver.svelte";

    /**
     * @type {DbArticle[]}
     */
    let articles = []
    let loading = false
    let endReached = false
    let [minColWidth, maxColWidth, gap] = [$styles.width, $styles.width, $styles.gap]
    $: items = [...articles]

    let page = 0
    let perPage = 30

    onMount(async () => {
        const storedSites = localStorage.getItem("sites")
        if (storedSites) {
            $sites = JSON.parse(storedSites)
        }
        await getMoreArticles()
    })

    async function refreshArticles() {
        page = 0
        articles = []
        await getMoreArticles()
    }

    function settingsSaved(event) {
        if (event.detail.sitesChanged) {
            refreshArticles()
        }
    }

    async function getNextPage() {
        if (!loading && !endReached) {
            page += 1;
            await getMoreArticles()
            console.log("WOOO INTERSECT !")
        }
    }

    async function getMoreArticles() {
        loading = true
        const supabase = createClient(supabaseUrl, supabaseKey)
        const {from, to} = getPagination(page, perPage);
        const {data, error} = await supabase
            .from('articles')
            .select()
            .in("website_id", $sites)
            .order("published", {ascending: false})
            .range(from, to)
        console.log(data)
        console.log(error)

        const newArticles = [...articles]

        for (const d of data) {
            newArticles.push({
                id: d.id,
                created_at: new Date(d.created_at),
                link: d.link,
                author: d.author,
                description: d.description.replace(/<br\/?[^>]+(>|$)/g, "").trim(),
                published: new Date(d.published),
                title: d.title,
                website_id: d.website_id
            })
        }
        articles = newArticles
        loading = false
        if (data.length < perPage) {
            endReached = true;
        }
    }

    function getPagination() {
        const limit = perPage ? +perPage : 3
        const from = page ? page * limit : 0
        const to = page ? from + perPage - 1 : perPage - 1
        return {from, to}
    }

</script>

<main>
    <Sidebar on:save={settingsSaved}/>
    <h1>The Gamer's Post</h1>
    <Masonry
            items={articles}
            minColWidth={minColWidth}
            maxColWidth={maxColWidth}
            gap={gap}
            let:item
    >
        <Article article={item}/>
    </Masonry>

    <IntersectionObserver on:intersect={getNextPage} let:intersecting top="800"/>

    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte
        app framework powered by Vite!
    </p>

    <p class="read-the-docs">
        Click on the Vite and Svelte logos to learn more
    </p>
</main>

<style>

</style>
