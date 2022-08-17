<script>
    import {createEventDispatcher} from "svelte";

    /** @type {DbArticle} */
    export let article;

    const dispatch = createEventDispatcher()

    function onImageLoad() {
        dispatch("load")
    }
</script>

<div class="article">
    <h2 class="header"><a href={article.link} target="_blank">{article.title}</a></h2>
    <span>{article.published.toLocaleString()}</span>
    {#if article.image}
        <a href={article.link} target="_blank">
            <img class="image" alt="article image" src="{article.image}" on:load={onImageLoad}/>
        </a>
    {/if}
    <div class="content">
        {@html article.description}
    </div>
</div>

<style>
    .article {
        padding: 10px;
        min-height: 120px;
        width: 90vw;
        margin: auto;
        background-color: var(--articleBackground);
        border-radius: var(--articleRadius);
        border-bottom: var(--articleBorder)
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

    .content {
        text-align: left;
    }

    .header {
        font-size: 1.8rem;
        line-height: 1.9rem;
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