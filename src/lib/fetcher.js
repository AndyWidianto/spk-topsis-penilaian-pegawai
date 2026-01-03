let isRefreshing = false;
let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem("accessToken");
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
                if (!r.ok) {
                    if (r.status === 403) return window.location.href = "/login";
                    throw new Error("Refresh gagal");
                };
                return r.json();
            })
            .then((res) => {
                console.log("Response Refreshing: ", res);
                localStorage.setItem("accessToken", res.accessToken);
                token = res.accessToken;
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
    await refreshPromise;
    options["headers"] = { ...options.headers, Authorization: `Bearer ${token}` };
    return fetch(url, { ...options, credentials: "include" });
}

export function getUser() {
    const token = localStorage.getItem("accessToken");
    console.log("Ini token", token);
    if (token) {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        const userJson = JSON.parse(decoded);
        console.log("User dari Token: ", userJson);
        return userJson;
    }
    return null;
}