// @ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {serve} from "https://deno.land/std@0.131.0/http/server.ts"
import {createClient} from 'https://esm.sh/@supabase/supabase-js@^1.33.2'
import {Parser} from "./Parser.ts";
import {DbArticle, RssModel} from "./Helpers.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
    try {
        const techraptor = await fetchTechRaptor()

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const now = new Date()
        now.setDate(now.getDate() - 15)
        const {data: existingArticles, error} = await supabase
            .from('articles')
            .select('link,published')
            .gt("published", now.toISOString())

        if (!existingArticles && error) {
            console.log(JSON.stringify(error))
            return
        }

        // loop through new articles, and check if they exist in old
        const techRaptorArticles = getNewArticles(techraptor, 2, existingArticles)
        const newArticles: DbArticle[] = [].concat(techRaptorArticles)

        console.log("Found new articles: " + newArticles.length)
        console.log("INSERTING NEW DATA")

        const {data: insertData, error: insertError} = await supabase
            .from('articles')
            .insert(newArticles)

        if (insertError != null) {
            const responseString = JSON.stringify({
                msg: "Error inserting to db",
                error: insertError
            })
            return new Response(responseString, {
                headers: {"Content-Type": "application/json"},
                status: 400
            })
        }

        return new Response("OK", {
            headers: {"Content-Type": "application/json"},
            status: 200
        })

    } catch (e) {
        console.log("ERROR")
        console.log(e)
        return new Response(
            JSON.stringify(e),
            {headers: {"Content-Type": "application/json"}},
        )
    }
})

function getNewArticles(rssFeed: RssModel, siteId: number, existingArticles: DbArticle[]): DbArticle[] {
    const newArticles: DbArticle[] = []
    console.log("PARSING ARTICLES")
    for (const article of rssFeed.items) {
        if (existingArticles.some(a => a.link === article.id && new Date(a.published).getTime() === new Date(article.published).getTime())) {
            // Already exists, skip this one
            continue
        }

        newArticles.push({
            title: article.title,
            link: article.id,
            description: article.description,
            author: article.authors.map(a => a.name).join(", "),
            published: new Date(article.published),
            website_id: 2
        })
    }

    return newArticles
}

async function fetchTechRaptor() {
    try {
        const res = await fetch("https://techraptor.net/feed");
        const text = await res.text()
        console.log(text)
        const parser = new Parser()
        return await parser.parse(text)
    } catch (e: Error) {
        console.log("Techraptor failed")
        console.log(e.message)
        console.log(e.stack)
    }
}


// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
