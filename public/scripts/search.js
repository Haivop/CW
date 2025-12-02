import { base_url } from "./script.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search");
    const filters = window.location.href.match(/&f=.*/) ? window.location.href.match(/&f=.*/) : "";
    console.log(filters);
    
    input.addEventListener("keydown", (event) => {
        if(event.keyCode === 13) window.location.replace(base_url + "/search?q=" + input.value + filters);
    });

    document.getElementById("search-btn").addEventListener("click", () => {
        window.location.replace(base_url + "/search?q=" + input.value + filters);
    });
});