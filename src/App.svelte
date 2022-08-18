<script>
    import Article from "./lib/Article.svelte";
    import {createClient} from '@supabase/supabase-js'
    import {sites, websites} from './stores/stores.js';
    import Sidebar from "./lib/Sidebar.svelte";
    import {supabaseKey, supabaseUrl} from "./lib/Constants.js";
    import IntersectionObserver from "./lib/IntersectionObserver.svelte";
    import Header from "./lib/Header.svelte";
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
<rss version="2.0">
<channel>
<atom:link href="http://airedale.futurecdn.net/feeds/en_feed_96a4cb95.rss-fse?nb_results=50" rel="self" type="application/rss+xml"/>
<title> PCGamer latest </title>
<link>
http://airedale.futurecdn.net/feeds/en_feed_96a4cb95.rss-fse?nb_results=50
</link>
<description> </description>
<lastBuildDate>Thu, 18 Aug 2022 08:18:30 +0000</lastBuildDate>
<language>en</language>
<item>
<title>
Today's Wordle 425 answer and hint: Thursday, August 18
</title>
<dc:content>
<p>If you&apos;re having some trouble with today&apos;s Wordle, you can find the answer to the daily challenge right here. And if you&apos;re just after a few clues or some general tips on how to play everyone&apos;s favourite online word game then you&apos;ll be pleased to know I&apos;ve got all of that covered too.</p><p>Today&apos;s answer just hit me like a bolt of lightning out of the blue, possibly as some sort of cosmic apology for yesterday&apos;s sorry efforts. I&apos;ll take the win, even though I&apos;m not entirely sure where it came from.</p> <h2 class="article-body__section" id="section-wordle-hint"><span>Wordle hint</span></h2> <h2 id="today-apos-s-wordle-a-hint-for-thursday-august-18-2">Today&apos;s Wordle: A hint for Thursday, August 18</h2> <p>Bow strings, bed springs, and even classical harps can make today&apos;s word; the special sort of sound that only comes when something taut is pulled, plucked, or suddenly released after being squashed down. </p> <h2 id="wordle-help-3-tips-for-beating-wordle-every-day-xa0-2">Wordle help: 3 tips for beating Wordle every day </h2> <p>If there&apos;s one thing better than playing Wordle, it&apos;s playing Wordle well, which is why I&apos;m going to share a few quick tips to help set you on the path to success:</p> <ul><li>A good opener contains a balanced mix of unique vowels and consonants. </li><li>A tactical second guess helps to narrow down the pool of letters quickly.</li><li>The solution may contain repeat letters.</li></ul> <p>There&apos;s no time pressure beyond making sure it&apos;s done by midnight. So there&apos;s no reason to not treat the game like a casual newspaper crossword and come back to it later if you&apos;re coming up blank.</p> <h2 class="article-body__section" id="section-wordle-answer"><span>Wordle answer</span></h2> <figure class="van-image-figure inline-layout" data-bordeaux-image-check ><div class='image-full-width-wrapper'><div class='image-widthsetter' style="max-width:1433px;"><p class="vanilla-image-block" style="padding-top:58.41%;"><img id="SFSHqWXvje8qzJ6GARdU9V" name="oSwSXbTfEeHZvwFKrG7TYE.jpg" alt="Wordle today" src="https://cdn.mos.cms.futurecdn.net/SFSHqWXvje8qzJ6GARdU9V.jpg" mos="" align="middle" fullscreen="" width="1433" height="837" attribution="" endorsement="" class=""></p></div></div><figcaption itemprop="caption description" class=" inline-layout"><span class="credit" itemprop="copyrightHolder">(Image credit: Josh Wardle)</span></figcaption></figure> <h2 id="what-is-the-wordle-425-answer-2">What is the Wordle 425 answer?</h2> <p>Let&apos;s keep your win streak going. The answer to the August 18 (425) Wordle is<strong> TWANG</strong>. </p> <h2 class="article-body__section" id="section-previous-answers"><span>Previous answers</span></h2> <h2 id="wordle-archive-which-words-have-been-used-2">Wordle archive: Which words have been used</h2> <p>The more past Wordle answers you can cram into your memory banks, the better your chances of guessing today&apos;s Wordle answer without accidentally picking a solution that&apos;s already been used. Past Wordle answers can also give you some excellent ideas for fun starting words that keep your daily puzzle solving fresh.</p><p>Here are some recent Wordle solutions:</p> <ul><li><strong>August 17: </strong>TWICE</li><li><strong>August 16:</strong> GRUEL</li><li><strong>August 15:</strong> POKER</li><li><strong>August 14:</strong> KHAKI</li><li><strong>August 13:</strong> HUNKY</li><li><strong>August 12:</strong> LABEL</li><li><strong>August 11: </strong>GLEAN</li><li><strong>August 10:</strong> CLING</li><li><strong>August 9:</strong> PATTY</li><li><strong>August 8:</strong> UNFIT</li></ul> <h2 id="learn-more-about-wordle-xa0-2">Learn more about Wordle </h2> <p>Every day Wordle presents you with six rows of five boxes, and it&apos;s up to you to work out which secret five-letter word is hiding inside them.</p><p>You&apos;ll want to <a href="https://www.pcgamer.com/best-wordle-starting-word/" target="_blank"><u>start with a strong word</u></a> like ALERT—something containing multiple vowels, common consonants, and no repeat letters. Hit Enter and the boxes will show you which letters you&apos;ve got right or wrong. If a box turns ⬛️, it means that letter isn&apos;t in the secret word at all. 🟨 means the letter is in the word, but not in that position. 🟩 means you&apos;ve got the right letter in the right spot.</p><p>You&apos;ll want your second go to compliment the first, using another "good" word to cover any common letters you missed last time while also trying to avoid any letter you now know for a fact isn&apos;t present in today&apos;s answer.</p><p>After that it&apos;s just a case of using what you&apos;ve learned to narrow your guesses down to the right word. You have six tries in total and can only use real words (so no filling the boxes with EEEEE to see if there&apos;s an E). Don&apos;t forget letters can repeat too (ex: BOOKS).</p><p>If you need any further advice feel free to check out our <a href="https://www.pcgamer.com/how-to-play-wordle-tips-rules/" target="_blank"><u>Wordle tips</u></a>, and if you&apos;d like to find out which words have already been used you&apos;ll find those below.</p> <p>Originally, Wordle was dreamed up by software engineer <a href="https://www.powerlanguage.co.uk/" target="_blank"><u>Josh Wardle</u></a>, as a surprise for his partner who loves word games. From there it spread to his family, and finally got released to the public. The word puzzle game has since inspired tons of <a href="https://www.pcgamer.com/best-games-like-wordle/" target="_blank"><u>games like Wordle</u></a>, refocusing the daily gimmick around music or math or geography. It wasn&apos;t long before Wordle became so popular it was <a href="https://www.pcgamer.com/wordle-sells-to-the-new-york-times-for-a-seven-figure-sum/" target="_blank"><u>sold to the New York Times for seven figures</u></a>. Surely it&apos;s only a matter of time before we all solely communicate in tricolor boxes. </p>
</dc:content>
<link>
https://www.pcgamer.com/todays-wordle-425-answer-hint
</link>
<description>
Wordle today: The solution and a hint for Thursday's puzzle.
</description>
<guid isPermaLink="false">ZSsoeTRZCGbL3ZecvrdMvh</guid>
<enclosure url="http://cdn.mos.cms.futurecdn.net/YRxEUnLEJxerocrem2ezeV.jpg" type="image/jpeg" length="0"/>
<pubDate>Thu, 18 Aug 2022 07:01:51 +0000</pubDate>
<content:encoded>
<article> <p>If you&apos;re having some trouble with today&apos;s Wordle, you can find the answer to the daily challenge right here. And if you&apos;re just after a few clues or some general tips on how to play everyone&apos;s favourite online word game then you&apos;ll be pleased to know I&apos;ve got all of that covered too.</p><p>Today&apos;s answer just hit me like a bolt of lightning out of the blue, possibly as some sort of cosmic apology for yesterday&apos;s sorry efforts. I&apos;ll take the win, even though I&apos;m not entirely sure where it came from.</p> <h2 class="article-body__section" id="section-wordle-hint"><span>Wordle hint</span></h2> <h2 id="today-apos-s-wordle-a-hint-for-thursday-august-18-5">Today&apos;s Wordle: A hint for Thursday, August 18</h2> <p>Bow strings, bed springs, and even classical harps can make today&apos;s word; the special sort of sound that only comes when something taut is pulled, plucked, or suddenly released after being squashed down. </p> <h2 id="wordle-help-3-tips-for-beating-wordle-every-day-xa0-5">Wordle help: 3 tips for beating Wordle every day </h2> <p>If there&apos;s one thing better than playing Wordle, it&apos;s playing Wordle well, which is why I&apos;m going to share a few quick tips to help set you on the path to success:</p> <ul><li>A good opener contains a balanced mix of unique vowels and consonants. </li><li>A tactical second guess helps to narrow down the pool of letters quickly.</li><li>The solution may contain repeat letters.</li></ul> <p>There&apos;s no time pressure beyond making sure it&apos;s done by midnight. So there&apos;s no reason to not treat the game like a casual newspaper crossword and come back to it later if you&apos;re coming up blank.</p> <h2 class="article-body__section" id="section-wordle-answer"><span>Wordle answer</span></h2> <figure class="van-image-figure inline-layout" data-bordeaux-image-check ><div class='image-full-width-wrapper'><div class='image-widthsetter' style="max-width:1433px;"><p class="vanilla-image-block" style="padding-top:58.41%;"><img id="SFSHqWXvje8qzJ6GARdU9V" name="oSwSXbTfEeHZvwFKrG7TYE.jpg" alt="Wordle today" src="https://cdn.mos.cms.futurecdn.net/SFSHqWXvje8qzJ6GARdU9V.jpg" mos="" align="middle" fullscreen="" width="1433" height="837" attribution="" endorsement="" class=""></p></div></div><figcaption itemprop="caption description" class=" inline-layout"><span class="credit" itemprop="copyrightHolder">(Image credit: Josh Wardle)</span></figcaption></figure> <h2 id="what-is-the-wordle-425-answer-5">What is the Wordle 425 answer?</h2> <p>Let&apos;s keep your win streak going. The answer to the August 18 (425) Wordle is<strong> TWANG</strong>. </p> <h2 class="article-body__section" id="section-previous-answers"><span>Previous answers</span></h2> <h2 id="wordle-archive-which-words-have-been-used-5">Wordle archive: Which words have been used</h2> <p>The more past Wordle answers you can cram into your memory banks, the better your chances of guessing today&apos;s Wordle answer without accidentally picking a solution that&apos;s already been used. Past Wordle answers can also give you some excellent ideas for fun starting words that keep your daily puzzle solving fresh.</p><p>Here are some recent Wordle solutions:</p> <ul><li><strong>August 17: </strong>TWICE</li><li><strong>August 16:</strong> GRUEL</li><li><strong>August 15:</strong> POKER</li><li><strong>August 14:</strong> KHAKI</li><li><strong>August 13:</strong> HUNKY</li><li><strong>August 12:</strong> LABEL</li><li><strong>August 11: </strong>GLEAN</li><li><strong>August 10:</strong> CLING</li><li><strong>August 9:</strong> PATTY</li><li><strong>August 8:</strong> UNFIT</li></ul> <h2 id="learn-more-about-wordle-xa0-5">Learn more about Wordle </h2> <p>Every day Wordle presents you with six rows of five boxes, and it&apos;s up to you to work out which secret five-letter word is hiding inside them.</p><p>You&apos;ll want to <a href="https://www.pcgamer.com/best-wordle-starting-word/" target="_blank"><u>start with a strong word</u></a> like ALERT—something containing multiple vowels, common consonants, and no repeat letters. Hit Enter and the boxes will show you which letters you&apos;ve got right or wrong. If a box turns ⬛️, it means that letter isn&apos;t in the secret word at all. 🟨 means the letter is in the word, but not in that position. 🟩 means you&apos;ve got the right letter in the right spot.</p><p>You&apos;ll want your second go to compliment the first, using another "good" word to cover any common letters you missed last time while also trying to avoid any letter you now know for a fact isn&apos;t present in today&apos;s answer.</p><p>After that it&apos;s just a case of using what you&apos;ve learned to narrow your guesses down to the right word. You have six tries in total and can only use real words (so no filling the boxes with EEEEE to see if there&apos;s an E). Don&apos;t forget letters can repeat too (ex: BOOKS).</p><p>If you need any further advice feel free to check out our <a href="https://www.pcgamer.com/how-to-play-wordle-tips-rules/" target="_blank"><u>Wordle tips</u></a>, and if you&apos;d like to find out which words have already been used you&apos;ll find those below.</p> <p>Originally, Wordle was dreamed up by software engineer <a href="https://www.powerlanguage.co.uk/" target="_blank"><u>Josh Wardle</u></a>, as a surprise for his partner who loves word games. From there it spread to his family, and finally got released to the public. The word puzzle game has since inspired tons of <a href="https://www.pcgamer.com/best-games-like-wordle/" target="_blank"><u>games like Wordle</u></a>, refocusing the daily gimmick around music or math or geography. It wasn&apos;t long before Wordle became so popular it was <a href="https://www.pcgamer.com/wordle-sells-to-the-new-york-times-for-a-seven-figure-sum/" target="_blank"><u>sold to the New York Times for seven figures</u></a>. Surely it&apos;s only a matter of time before we all solely communicate in tricolor boxes. </p> </article>
</content:encoded>
</item>
	</channel>
</rss>
        `, 'text/xml')
        const itemNodes = document.getElementsByTagName("item")
        for (const node of itemNodes){
            console.log("CONTENT:")
            console.log(document.getElementsByTagName("dc:content"))


            // Try to find media:content
            const mediaContent = node.getElementsByTagName("media:content")
            if (mediaContent && mediaContent.length > 0) {
                console.log("FOUND IN media:content")
                console.log(mediaContent[0].getAttribute("url"))
            }

            // Try to find enclosure tag
            const enclosure = node.getElementsByTagName("enclosure")
            if (enclosure && enclosure.length > 0) {
                console.log("FOUND IN enclosure")
                console.log(enclosure[0].getAttribute("url"))
            }

            // Try to find image in description
            const desc = node.getElementsByTagName("description")[0].innerText
            const match = desc.match(/src=["|'](.+?[\.jpg|\.gif|\.png|\.jpeg])["|']/i)
            if (match) {
                console.log("FOUND IN DESCRIPTION")
                console.log(match[1])
            }

            console.log("NONE FOUND")
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

    function settingsSaved() {
        window.scrollTo(0, 0);
        refreshArticles()
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
                image: d.website_id === 14 ? "https://sonkin.no/thegamerspost/proxy/proxy.php?url=" + d.image : d.image
             })
        }
        articles = newArticles
        loading = false
        if (data.length < perPage) {
            endReached = true;
            console.log("reached end")
        }
        setTimeout(() => bricksInstance.pack(), 50)
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
