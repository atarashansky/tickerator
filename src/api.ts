import { API_KEY, API_BASE, API_VERSION } from "./globals";

export const fetchQuery = async (queryName: string, arg: string): Promise<any> => {
    const version = API_VERSION[queryName] ?? 3;
    const response = await fetch(`${API_BASE}${version}/${queryName}/${arg}apikey=${API_KEY}`);
    return response.json();;
}