<script>
    import Counter from './lib/Counter.svelte'
    import {onMount} from "svelte"
    import Masonry from 'svelte-bricks'
    import Article from "./lib/Article.svelte";
    import {createClient} from '@supabase/supabase-js'
    import {styles, sites} from './stores/stores.js';

    /**
     * @type {DbArticle[]}
     */
    let articles = []
    let [minColWidth, maxColWidth, gap] = [$styles.width, $styles.width, $styles.gap]
    $: items = [...articles]

    let page = 0
    let perPage = 30

    onMount(async () => {
        await getMoreArticles()
    })

    async function refreshArticles() {
        page = 0
        articles = []
        await getMoreArticles()
    }

    async function getMoreArticles() {
        const supabase = createClient("https://iagdzpliocjxklsfazoy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZ2R6cGxpb2NqeGtsc2Zhem95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk4Nzk5NzgsImV4cCI6MTk3NTQ1NTk3OH0.NEMqTjZBKRXp3Xy0itRQltaovJz-FQVfyaRVV-phi0A")
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
    }

    function getPagination() {
        const limit = perPage ? +perPage : 3
        const from = page ? page * limit : 0
        const to = page ? from + perPage - 1 : perPage - 1
        return {from, to}
    }

</script>

<main>
    <h1>Vite + Svelte</h1>
    <Masonry
            items={articles}
            minColWidth={minColWidth}
            maxColWidth={maxColWidth}
            gap={gap}
            let:item
    >
        <Article article={item}/>
    </Masonry>

    <div class="card">
        <Counter/>
    </div>

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
