const base_url = "http://localhost:8080";

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