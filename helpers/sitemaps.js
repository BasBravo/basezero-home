
export const getFileSitemapContent = async (file) => {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();
        return text;
    } catch (error) {
        console.error(error.message);
    }
}

export const getExternalSitemapContent = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
};


export const getUrlsFromSitemap = async (url, type) => {

    const content = type === 'file' ? await getFileSitemapContent(url) : await getExternalSitemapContent(url);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const urls = xmlDoc.getElementsByTagName("loc");
    const urlsArray = Array.from(urls).map(url => url.textContent);
    return urlsArray;


};
