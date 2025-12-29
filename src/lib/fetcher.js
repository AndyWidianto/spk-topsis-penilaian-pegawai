
let token = "";

export function updateToken(newToken) {
    token = newToken;
}
export function getToken() {
    return token;
}

let isRefreshing = false;
let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {

    options["headers"] = { ...options?.haeders, Authorization: `Bearer ${token}` };
    const res = await fetch(url, { ...options, credentials: "include" });
    if (res.status !== 401) {
        return res;
    }

    if (url.includes("/api/auth/refresh-token")) {
        throw new Error("Unauthorized");
    }

    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = fetch("/api/auth/refresh-token", { method: "GET", credentials: "include" })
            .then(async (r) => {
                if (!r.ok) throw new Error("Refresh gagal");
                return r.json();
            })
            .then((res) => {
                console.log("Response Refreshing: ", res);
                updateToken(res.accessToken);
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
    await refreshPromise;
    options["headers"] = { ...options.headers, Authorization: `Bearer ${token}` };
    return fetch(url, { ...options, credentials: "include" });
}