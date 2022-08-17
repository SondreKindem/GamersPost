<script>
    import {createEventDispatcher, onMount} from "svelte";
    import TimeAgo from 'javascript-time-ago'
    import {websites} from "../stores/stores.js";

    /** @type {DbArticle} */
    export let article;

    let timeAgo = ""

    const dispatch = createEventDispatcher()

    onMount(() => {
        const timeAgoFormatter = new TimeAgo('en-US')
        timeAgo = timeAgoFormatter.format(article.published)
    })

    function onImageLoad() {
        dispatch("load")
    }
</script>

<div class="article">
    <h2 class="header"><a href={article.link} target="_blank">{article.title}</a></h2>
    <div class="info-row">
        <b>{$websites[article.website_id]?.name}</b>
        <span>{timeAgo}</span>
    </div>
    {#if article.image}
        <a href={article.link} target="_blank">
            <img class="image" alt="article image" src="{article.image}" on:load={onImageLoad}/>
        </a>
    {/if}
    <div class="content">
        {@html article.description}
    </div>
    <div class="article-border"></div>
</div>

<style>
    .article {
        padding: 10px;
        min-height: 120px;
        width: 90vw;
        margin: auto;
        background-color: var(--articleBackground);
        border-radius: var(--articleRadius);
    }

    .article-border {
        height: 15px;
        border-bottom: var(--articleBorder)
    }

    .info-row {
        display: flex;
        justify-content: space-between;
    }

    @media screen and (min-width: 531px) {
        .article {
            width: 500px;
            margin: 0;
        }
    }

    .image {
        width: 100% !important;
        height: auto !important;
        border-radius: 3px;
    }

    :global(.content *) {
        width: 100% !important;
        height: auto !important;
        border-radius: 3px;
    }

    :global(.content h2) {
        font-size: 1.2em;
    }

    .content {
        text-align: left;
    }

    .header {
        font-size: 1.8rem;
        line-height: 1.9rem;
        margin-bottom: 5px;
        margin-top: 10px;
    }

    .header > a {
        color: inherit !important;
        text-decoration: inherit;
        font-weight: inherit;
    }

    .header > a:hover {
        color: #a63532 !important;
    }
</style>