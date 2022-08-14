<script>

    /**
     * @type {DbArticle}
     */
    export let article;
</script>

<div class="article">
    <h2 class="header"><a href={article.link}>{article.title}</a></h2>
    <span>{article.published.toLocaleString()}</span>
    <div class="content">
        {@html article.description}
    </div>
</div>

<style>
    .article {
        padding: 10px;
        min-height: 120px;
        background-color: var(--articleBackground);
        border-radius: 5px;
    }

    :global(.content *) {
        width: 100%!important;
        height: auto!important;
        border-radius: 3px;
    }
    .content {
        text-align: left;
    }
    .header > a {
        color: inherit!important;
        text-decoration: inherit;
        font-weight: inherit;
    }
</style>