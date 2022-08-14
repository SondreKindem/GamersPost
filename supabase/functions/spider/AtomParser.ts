// @ts-nocheck
import {rssModel, Utils} from "./Helpers.ts";

export class AtomParser {
    getChannelTitle = (node) => Utils.getElementTextContent(node, 'title');

    getChannelLinks = (node) => {
        const links = Utils.getChildElements(node, 'link');

        return links.map((link) => ({
            url: link.getAttribute('href'),
            rel: link.getAttribute('rel'),
        }));
    };

    getChannelDescription = (node) =>
        Utils.getElementTextContent(node, 'subtitle');

    getChannelCopyright = (node) =>
        Utils.getElementTextContent(node, 'rights');

    getChannelAuthors = (node) => {
        const authors = Utils.getChildElements(node, 'author');

        return authors.map((author) => ({
            name: Utils.getElementTextContent(author, 'name'),
        }));
    };

    getChannelLastUpdated = (node) =>
        Utils.getElementTextContent(node, 'updated');

    getChannelLastPublished = (node) =>
        Utils.getElementTextContent(node, 'published');

    getChannelCategories = (node) => {
        const categories = Utils.getChildElements(node, 'category');

        return categories.map((category) => ({
            name: category.getAttribute('term'),
        }));
    };

    getChannelImage = (node) => {
        let img = Utils.getElementTextContent(node, 'image');

        if (img === '' || img === undefined) {
            img = Utils.getElementTextContent(node, 'logo');
        }

        if (img === '' || img === undefined) {
            img = Utils.getElementTextContent(node, 'icon');
        }

        return {
            url: img,
            title: undefined,
            description: undefined,
            width: undefined,
            height: undefined,
        };
    };

    getItemTitle = (node) => Utils.getElementTextContent(node, 'title');

    getItemLinks = (node) => {
        const links = Utils.getChildElements(node, 'link');
        const linksWithoutEnclosures = links.filter(
            (link) => link.getAttribute('rel') !== 'enclosure'
        );

        return linksWithoutEnclosures.map((link) => ({
            url: link.getAttribute('href'),
            rel: link.getAttribute('rel'),
        }));
    };

    getItemDescription = (node) =>
        Utils.getElementTextContent(node, 'summary');

    getItemContent = (node) => Utils.getElementTextContent(node, 'content');

    getItemImage = (node) => Utils.getElementTextContent(node, 'icon');

    getItemAuthors = (node) => {
        const authors = Utils.getChildElements(node, 'author');

        return authors.map((author) => ({
            name: Utils.getElementTextContent(author, 'name'),
        }));
    };

    getItemCategories = (node) => {
        const categories = Utils.getChildElements(node, 'category');

        return categories.map((category) => ({
            name: category.getAttribute('term'),
        }));
    };

    getItemPublished = (node) => {
        let pub = Utils.getElementTextContent(node, 'updated');

        if (pub === '' || pub === undefined) {
            pub = Utils.getElementTextContent(node, 'published');
        }

        return pub;
    };

    getItemId = (node) => Utils.getElementTextContent(node, 'id');

    getItemEnclosures = (node) => {
        const links = Utils.getChildElements(node, 'link');
        const enclosureLinks = links.filter(
            (link) => link.getAttribute('rel') === 'enclosure'
        );

        return enclosureLinks.map((link) => ({
            url: link.getAttribute('href'),
            length: link.getAttribute('length'),
            mimeType: link.getAttribute('type'),
        }));
    };

    mapChannelFields = (document) => {
        const channelNodes = Utils.getElements(document, 'feed');

        if (!channelNodes || channelNodes.length === 0) {
            throw new Error('Could not find channel node');
        }

        const channelNode = channelNodes[0];

        return {
            title: this.getChannelTitle(channelNode),
            links: this.getChannelLinks(channelNode),
            description: this.getChannelDescription(channelNode),
            copyright: this.getChannelCopyright(channelNode),
            authors: this.getChannelAuthors(channelNode),
            lastUpdated: this.getChannelLastUpdated(channelNode),
            lastPublished: this.getChannelLastPublished(channelNode),
            categories: this.getChannelCategories(channelNode),
            image: this.getChannelImage(channelNode),
        };
    };

    mapItems = (document) => {
        const itemNodes = Utils.getElements(document, 'entry');

        return itemNodes.map((item) => ({
            title: this.getItemTitle(item),
            links: this.getItemLinks(item),
            description: this.getItemDescription(item),
            id: this.getItemId(item),
            imageUrl: this.getItemImage(item),
            content: this.getItemContent(item),
            authors: this.getItemAuthors(item),
            categories: this.getItemCategories(item),
            published: this.getItemPublished(item),
            enclosures: this.getItemEnclosures(item),
        }));
    };

    public parse(document): rssModel {
        return ({
            ...rssModel,
            type: 'atom-v1',
            ...this.mapChannelFields(document),
            items: this.mapItems(document),
        })
    }
}