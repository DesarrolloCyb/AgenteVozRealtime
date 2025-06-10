export function extractData<T = any>(response: { status: boolean; data: T[] }): T[] {
    return response.data;
}

export async function fetchClientData() {
    const res = await fetch("http://192.168.51.210:803/Home/getCH");
    const json = await res.json();
    return extractData(json);
}