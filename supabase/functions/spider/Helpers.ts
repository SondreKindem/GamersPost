// @ts-nocheck
export type RssModel = {
    type: string,
    title: string
    links: [
        {
            url: string,
            rel: string,
        },
    ],
    description: string,
    language: string,
    copyright: string,
    authors: [
        {
            name: string,
        },
    ],
    lastUpdated: string,
    lastPublished: string,
    categories: [
        {
            name: string,
        },
    ],
    image: {
        url: string,
        title: string,
        description: string,
        width: number,
        height: number,
    },
    items: [
        {
            title: string,
            links: [
                {
                    url: string,
                    rel: string,
                },
            ],
            id: string,
            imageUrl: string,
            description: string,
            content: string,
            categories: [
                {
                    name: string,
                },
            ],
            authors: [
                {
                    name: string,
                },
            ],
            published: string,
            enclosures: [
                {
                    url: string,
                    length: string,
                    mimeType: string,
                },
            ],
        },
    ],
}

export type DbArticle = {
    id: number,
    created_at: Date,
    title: string,
    link: string,
    description: string,
    author: string,
    published: Date,
    image: string,
    website_id: number
}

export const rssModel = {
    type: undefined,
    title: undefined,
    links: [
        {
            url: undefined,
            rel: undefined,
        },
    ],
    description: undefined,
    language: undefined,
    copyright: undefined,
    authors: [
        {
            name: undefined,
        },
    ],
    lastUpdated: undefined,
    lastPublished: undefined,
    categories: [
        {
            name: undefined,
        },
    ],
    image: {
        url: undefined,
        title: undefined,
        description: undefined,
        width: undefined,
        height: undefined,
    },
    itunes: {
        author: [
            {
                name: undefined,
            },
        ],
        block: undefined,
        categories: [
            {
                name: undefined,
                subCategories: [
                    {
                        name: undefined,
                    },
                ],
            },
        ],
        image: undefined,
        explicit: undefined,
        complete: undefined,
        newFeedUrl: undefined,
        owner: {
            name: undefined,
            email: undefined,
        },
        subtitle: undefined,
        summary: undefined,
    },
    items: [
        {
            title: undefined,
            links: [
                {
                    url: undefined,
                    rel: undefined,
                },
            ],
            image: undefined,
            id: undefined,
            imageUrl: undefined,
            description: undefined,
            content: undefined,
            categories: [
                {
                    name: undefined,
                },
            ],
            authors: [
                {
                    name: undefined,
                },
            ],
            published: undefined,
            enclosures: [
                {
                    url: undefined,
                    length: undefined,
                    mimeType: undefined,
                },
            ],
            itunes: {
                authors: [
                    {
                        name: undefined,
                    },
                ],
                block: undefined,
                duration: undefined,
                explicit: undefined,
                image: undefined,
                isClosedCaptioned: undefined,
                order: undefined,
                subtitle: undefined,
                summary: undefined,
            },
        },
    ],
};

export class Namespaces {
    static itunes = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
    static content = 'http://purl.org/rss/1.0/modules/content/';
    static media = "http://search.yahoo.com/mrss/"
}

export class Utils {
    static decodeHtmlEntity = (str) => {
        return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    };

    static getElements = (node, tagName) => {
        if (!node || !node.getElementsByTagName(tagName)) {
            return [];
        }

        const elements = node.getElementsByTagName(tagName);

        return Array.prototype.slice.call(elements);
    };

    static getChildElements = (node, tagName, namespace) => {
        if (!node) {
            return [];
        }

        const elements = namespace
            ? node.getElementsByTagNameNS(namespace, tagName)
            : node.getElementsByTagName(tagName);

        if (!elements) {
            return [];
        }

        return Array.prototype.filter.call(
            elements,
            (element) => element.parentNode.nodeName === node.nodeName
        );
    };

    static getElementTextContentArray = (node, tagName, namespace) => {
        const nodes = this.getChildElements(node, tagName, namespace);

        if (!nodes || nodes.length === 0) {
            return [];
        }

        return nodes.map((node) => node.textContent);
    };

    static getElementTextContent = (node, tagName, namespace) => {
        const array = this.getElementTextContentArray(node, tagName, namespace);

        return array.length === 0 ? undefined : array[0];
    };
}