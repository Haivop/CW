export const base_url = "http://localhost:3000";

function register(){
    window.location.assign(base_url + "/sign-up")
}

function prevPage(){
    window.history.back();
}

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
    $(".interactable.playlist").bind("click", (event) => {
        window.location.assign(base_url.concat("/playlists/" + event.target.attributes.value.value));
    });

    $(".interactable.track").bind("click", (event) => {
        window.location.assign(base_url.concat("/tracks/" + event.target.attributes.value.value));
    });
});