export function setAuth(token, role, email) {
    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
}

export function getAuth() {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    return token ? { token, role, email } : null;
}

export function logout() {
    localStorage.clear();
}
