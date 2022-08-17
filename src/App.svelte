<script>
    import Article from "./lib/Article.svelte";
    import {createClient} from '@supabase/supabase-js'
    import {sites, websites} from './stores/stores.js';
    import Sidebar from "./lib/Sidebar.svelte";
    import {supabaseKey, supabaseUrl} from "./lib/Constants.js";
    import IntersectionObserver from "./lib/IntersectionObserver.svelte";
    import Header from "./lib/Header.svelte";
    import {DOMParser} from "https://esm.sh/linkedom";
    import {onMount} from "svelte";
    import Bricks from 'bricks.js'

    /**
     * @type {DbArticle[]}
     */
    let articles = []
    let loading = false
    let endReached = false
    $: items = [...articles]

    let page = 0
    let perPage = 30

    let bricksWrapper
    let bricksInstance

    const sizes = [
        {columns: 1, gutter: 10},
        {mq: '550px', columns: 1, gutter: 10},
        {mq: '1070px', columns: 2, gutter: 10},
        {mq: '1624px', columns: 3, gutter: 10},
        {mq: '2340px', columns: 4, gutter: 10},
    ]

    onMount(async () => {
        const storedSites = localStorage.getItem("sites")
        if (storedSites) {
            $sites = JSON.parse(storedSites)
        }

        await fetchAvailableWebsites()

        bricksInstance = Bricks({
            container: "#bricks",
            packed: 'data-packed',
            sizes: sizes
        })
        bricksInstance.resize(true)

        await getMoreArticles()

        /*const document = new DOMParser({
            errorHandler: (_level, msg) => {
                console.log(msg)
            },
        }).parseFromString(`
<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns:og="http://ogp.me/ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:schema="http://schema.org/" xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:sioct="http://rdfs.org/sioc/types#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" xmlns:xsd="http://www.w3.org/2001/XMLSchema#" version="2.0" xml:base="https://techraptor.net/">
	<channel>
		<title>TechRaptor</title>
		<link>https://techraptor.net/</link>
		<description/>
		<language>en</language>
		<item>
			<title>Is the Impressive Scale of Sapiens Worth It All?</title>
			<link>https://techraptor.net/gaming/previews/is-impressive-scale-of-sapiens-worth-it-all</link>
			<description>  &lt;a href="https://techraptor.net/gaming/previews/is-impressive-scale-of-sapiens-worth-it-all" hreflang="en"&gt;&lt;img src="https://techraptor.net/sites/default/files/styles/image_header/public/2022-08/Sapiens%20Preview%20Header%20%281%29.jpg?itok=Nn3YX07n" width="852" height="479" alt="Sapiens Preview Header" loading="lazy" typeof="Image" class="image-style-image-header" /&gt;&lt;br /&gt;
&lt;br /&gt;
&lt;/a&gt;&lt;br /&gt;
&lt;br /&gt;
Sapiens is an ambitious indie life simulator set on a massive scale, but is that large scale enough to carry it to prominence? &lt;br /&gt;
&lt;a href="https://techraptor.net/gaming/previews/is-impressive-scale-of-sapiens-worth-it-all"&gt;Read this article on TechRaptor&lt;/a&gt;</description>
			<pubDate>Sat, 06 Aug 2022 12:00:01 -0400</pubDate>
			<dc:creator>Robert Grosso</dc:creator>
			<guid isPermaLink="true">https://techraptor.net/gaming/previews/is-impressive-scale-of-sapiens-worth-it-all</guid>
		</item>
	</channel>
</rss>
        `, 'text/xml')
        const itemNodes = document.getElementsByTagName("item")
        for (const node of itemNodes){
            console.log("waaaaaas")
            const imageNode = node.getElementsByTagName("media:content")
            console.log(imageNode)
            if(imageNode && imageNode.length > 0){
                console.log(imageNode[0].getAttribute("url"))
            } else {
                console.log("nope")
                const desc = node.getElementsByTagName("description")[0].innerText
                const match = desc.match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1]
                console.log(match)
                console.log(desc.replace(/(<img|<br) .*?>/g,""))
            }
        }*/
    })

    async function fetchAvailableWebsites() {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const {data, error} = await supabase
            .from('websites')
            .select()

        if (data) {
            const foundWebsites = {}
            for (const site of data) {
                foundWebsites[site.id] = site
            }
            websites.update(() => foundWebsites)
        }
    }

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
        console.log("next page plssss")
        if (!loading && !endReached) {
            page += 1;
            await getMoreArticles()
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
                description: d.description.trim(),
                published: new Date(d.published),
                title: d.title,
                website_id: d.website_id,
                image: d.image
            })
        }
        articles = newArticles
        loading = false
        if (data.length < perPage) {
            endReached = true;
            console.log("reached end")
        }
    }

    function getPagination() {
        const limit = perPage ? +perPage : 3
        const from = page ? page * limit : 0
        const to = page ? from + perPage - 1 : perPage - 1
        return {from, to}
    }

</script>

<main class="main-wrap">
    <Sidebar on:save={settingsSaved}/>

    <Header/>

    <div bind:this={bricksWrapper} id="bricks" class="bricks-wrap">
        {#if bricksInstance !== undefined}
            {#each articles as article}
                <Article article={article} on:load={() => bricksInstance.pack()}/>
            {/each}
        {/if}
    </div>

    {#if articles.length > 0}
        <IntersectionObserver on:intersect={getNextPage} let:intersecting top="800"/>
    {/if}

    <p style="margin-top: 50px">
        <a href="https://github.com/sondrekindem/gamerspost" target="_blank">[Source]</a>
    </p>

</main>

<style>
    .main-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .bricks-wrap {
        margin-left: 0;
        margin-right: 0;

    }

    @media screen and (max-width: 530px) {
        .bricks-wrap {
            width: 90vw !important;
        }
    }
</style>
