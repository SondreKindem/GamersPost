// @ts-nocheck
import {DOMParser} from "https://esm.sh/linkedom";
import {RssParser} from "./RssParser.ts";
import {AtomParser} from "./AtomParser.ts";
import {RssModel, rssModel} from "./Helpers.ts";

export class Parser {
    getParser(document) {
        const isRssSpecification =
            document.getElementsByTagName('channel')[0] !== undefined;
        const isAtomSpecification =
            document.getElementsByTagName('feed')[0] !== undefined;

        if (isRssSpecification) {
            console.log("RSS PARSER")
            return new RssParser();
        }

        if (isAtomSpecification) {
            console.log("ATOM PARSER")
            return new AtomParser();
        }

        return null;
    };

    public parse(feed): Promise<RssModel> {
        console.log("Attempt parse")
        return new Promise((resolve, reject) => {
            const document = new DOMParser({
                errorHandler: (_level, msg) => {
                    console.log(msg)
                    reject(msg);
                },
            }).parseFromString(feed, 'text/xml');

            const parser = this.getParser(document);

            if (!parser) {
                console.log('Unable to determine parser type')
                reject('Unable to determine parser type');
            }

            const parsedFeed = parser.parse(document);

            //console.log(JSON.stringify(parsedFeed))

            resolve(parsedFeed);
        });
    }
}







