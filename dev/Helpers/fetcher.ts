/**
 * @class Fetcher
 * used for fetching documents
 */
class Fetcher {
    /**
     * Fetch JSON through promise
     * @param {string} path
     * @returns {Promise<any>}
     */
    public static async fetchJSONFile(path:string) {
        const response = await fetch(path);
        return await response.json();
    }
}