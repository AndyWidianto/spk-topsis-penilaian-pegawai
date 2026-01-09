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

export async function JWTDecode() {
    let token = localStorage.getItem("accessToken");
    if (token && token !== "undefined") {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        const userJson = JSON.parse(decoded);
        return userJson;
    }
    const res = await fetch("/api/auth/refresh-token", { method: "GET", credentials: "include" });
    if (res.status === 403) return window.location.href = "/login";
    if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
        const payload = resJson.accessToken.split('.')[1];
        const decoded = atob(payload);
        const userJson = JSON.parse(decoded);
        return userJson;
    }
    return null;
}