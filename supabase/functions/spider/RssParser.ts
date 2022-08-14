// @ts-nocheck
import {Namespaces, RssModel, rssModel, Utils} from "./Helpers.ts";

export class RssParser {
    getChannelTitle(node) {
        return Utils.getElementTextContent(node, 'title');
    }

    getChannelLinks = (node) => {
        const links = Utils.getChildElements(node, 'link');

        return links.map((link) => ({
            url: link.textContent,
            rel: link.getAttribute('rel'),
        }));
    };

    getChannelDescription = (node) =>
        Utils.getElementTextContent(node, 'description');

    getChannelLanguage = (node) =>
        Utils.getElementTextContent(node, 'language');

    getChannelCopyright = (node) =>
        Utils.getElementTextContent(node, 'copyright');

    getChannelAuthors = (node) => {
        const authors = Utils.getElementTextContentArray(node, 'managingEditor');

        return authors.map((author) => ({
            name: author,
        }));
    };

    getChannelLastUpdated = (node) =>
        Utils.getElementTextContent(node, 'lastBuildDate');

    getChannelLastPublished = (node) =>
        Utils.getElementTextContent(node, 'pubDate');

    getChannelCategories = (node) => {
        const categories = Utils.getElementTextContentArray(node, 'category');

        return categories.map((category) => ({
            name: category,
        }));
    };

    getChannelImage = (node) => {
        const imageNodes = Utils.getChildElements(node, 'image');

        if (imageNodes.length === 0) {
            return {
                url: undefined,
                title: undefined,
                description: undefined,
                width: undefined,
                height: undefined,
            };
        }

        const imageNode = imageNodes[0];

        return {
            url: Utils.getElementTextContent(imageNode, 'url'),
            title: Utils.getElementTextContent(imageNode, 'title'),
            description: Utils.getElementTextContent(imageNode, 'description'),
            width: Utils.getElementTextContent(imageNode, 'width'),
            height: Utils.getElementTextContent(imageNode, 'height'),
        };
    };

    private getItemTitle(node) {
        return Utils.getElementTextContent(node, 'title');
    }

    getItemLinks(node) {
        const links = Utils.getChildElements(node, 'link');

        return links.map((link) => ({
            url: link.textContent,
            rel: link.getAttribute('rel'),
        }));
    };

    getItemDescription(node) {
        return Utils.getElementTextContent(node, 'description');
    }

    getItemContent(node) {
        return Utils.getElementTextContent(node, 'encoded', Namespaces.content);
    }

    getItemAuthors(node) {
        let authors = Utils.getElementTextContentArray(node, 'author');

        if (authors.length === 0) {
            authors = Utils.getElementTextContentArray(node, 'dc:creator');
        }

        return authors.map((author) => ({
            name: author,
        }));
    };

    getItemCategories(node) {
        let categories = Utils.getElementTextContentArray(node, 'category');

        if (categories.length === 0) {
            categories = Utils.getElementTextContentArray(node, 'dc:subject');
        }

        return categories.map((category) => ({
            name: category,
        }));
    };

    getItemId(node) {
        return Utils.getElementTextContent(node, 'guid');
    }

    getItemPublished(node) {
        return Utils.getElementTextContent(node, 'pubDate') ||
            Utils.getElementTextContent(node, 'dc:date')
    }

    getItemEnclosures(node) {
        const enclosures = Utils.getChildElements(node, 'enclosure');

        return enclosures.map((enclosure) => ({
            url: enclosure.getAttribute('url'),
            length: enclosure.getAttribute('length'),
            mimeType: enclosure.getAttribute('type'),
        }));
    };

    private mapChannelFields(document) {
        const channelNodes = Utils.getElements(document, 'channel');

        if (!channelNodes || channelNodes.length === 0) {
            throw new Error('Could not find channel node');
        }

        const channelNode = channelNodes[0];

        return {
            title: this.getChannelTitle(channelNode),
            links: this.getChannelLinks(channelNode),
            description: this.getChannelDescription(channelNode),
            language: this.getChannelLanguage(channelNode),
            copyright: this.getChannelCopyright(channelNode),
            authors: this.getChannelAuthors(channelNode),
            lastUpdated: this.getChannelLastUpdated(channelNode),
            lastPublished: this.getChannelLastPublished(channelNode),
            categories: this.getChannelCategories(channelNode),
            image: this.getChannelImage(channelNode)
        };
    };

    public mapItems(document) {
        const itemNodes = Utils.getElements(document, 'item');

        return itemNodes.map((item) => ({
            title: this.getItemTitle(item),
            links: this.getItemLinks(item),
            description: this.getItemDescription(item),
            content: this.getItemContent(item),
            id: this.getItemId(item),
            authors: this.getItemAuthors(item),
            categories: this.getItemCategories(item),
            published: this.getItemPublished(item),
            enclosures: this.getItemEnclosures(item)
        }));
    };

    public parse(document): RssModel {
        return ({
            ...rssModel,
            type: 'rss-v2',
            ...this.mapChannelFields(document),
            items: this.mapItems(document),
        })
    }
}