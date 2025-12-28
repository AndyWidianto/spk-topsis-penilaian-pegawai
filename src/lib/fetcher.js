
export let token = "";

export function updateToken(newToken) {
    token = newToken;
}

let isRefresing = false;
let refreshPromise = null;

export async function fetchWithAuth(url, options={}) {

    const res = await fetch(url, { ...options, credentials: "include" });
    if (res.status !== 401) {
        return res;
    }

    if (url.includes("/api/auth/refresh-token")) {
        throw new Error("Unauthorized");
    }

    if (!isRefresing) {
        isRefresing = true;
        refreshPromise = fetch("/api/auth/refresh-token", { method: "GET", credentials: "include" })
        .then(async (r) => {
            if (!r.ok) throw new Error("Refresh gagal");
            return r.json();
        })
        .finally(() => {
            isRefresing = false;
        })
    }
    await refreshPromise;

    return fetch(url, { ...options, credentials: "include" });
}