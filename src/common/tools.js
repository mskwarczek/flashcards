export const apiCall = async (endpoint) => {
    const response = await fetch('/api' + endpoint);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
}