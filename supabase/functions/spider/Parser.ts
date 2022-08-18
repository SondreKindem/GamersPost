// @ts-nocheck
import {DOMParser} from "https://esm.sh/linkedom";
import {RssParser} from "./RssParser.ts";
import {AtomParser} from "./AtomParser.ts";
import {RssModel} from "./Helpers.ts";

export class Parser {
    getParser(document) {
        const isRssSpecification =
            document.getElementsByTagName('channel')[0] !== undefined;
        const isAtomSpecification =
            document.getElementsByTagName('feed')[0] !== undefined;

        if (isRssSpecification) {
            return new RssParser();
        }

        if (isAtomSpecification) {
            return new AtomParser();
        }

        return null;
    };

    public parse(feed): Promise<RssModel> {
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







