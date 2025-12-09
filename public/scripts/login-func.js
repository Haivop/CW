import { base_url } from "./script.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("cancel").addEventListener("click", () => {
        window.history.back();
    });

    document.getElementById("register").addEventListener("click", () => {
        window.location.replace(base_url + "/sign-up");
    });
});