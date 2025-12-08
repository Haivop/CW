import { base_url } from "./script.js";

document.addEventListener("DOMContentLoaded", () => {
    $("#artists-menu-toggle").bind("click", function (event) {
        $("#artists-menu").finish().toggle(100).
            css({
                top: event.pageY + "px",
                left: event.pageX + "px",
            });
    });

    $("#genres-menu-toggle").bind("click", (event) => {
        $("#genres-menu").finish().toggle(100).
            css({
                top: event.pageY + "px",
                left: event.pageX + "px",
            });
    });

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#artists-menu").length > 0) {
            $("#artists-menu").hide(100);
        };

    if (!$(e.target).parents("#genres-menu").length > 0) {
            $("#genres-menu").hide(100);
        };
    });

    document.getElementById("like-btn").addEventListener("click", (event) => {
        fetch(window.location.href, {
                method: 'PATCH',
        }).then(() => {window.location.reload()});
    });

    document.getElementById("add-to-playlist").addEventListener("click", (event) => {
        $("#add-track-form").toggle(100);
        $("#overlay").toggle(1);
    });


    document.getElementById("edit-btn").addEventListener("click", (event) => {
        $("#edit-track").toggle(100);
        $("#overlay").toggle(1);
    });

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#add-track-form").length > 0) {
            $("#add-track-form").hide(100);
        };
        if (!$(e.target).parents("#edit-track").length > 0) {
            $("#edit-track").hide(100);
        };

        if (!$(e.target).parents("#edit-track").length > 0 && !$(e.target).parents("#add-track-form").length > 0){
            $("#overlay").hide(1);
        };
    });

    document.getElementById("delete-btn").addEventListener("click", (event) => {
        fetch(window.location.href, {
            method: 'DELETE',
        })
        .catch((err) => console.log(err))
        .then(() => {
            window.location.replace(base_url + "/");
        });
    });

    document.getElementById("edit-sbm-btn").addEventListener("click", (event) => {
        const formData = new FormData();
        const title = document.getElementById("title-inp");
        const artists = document.getElementById("artists-inp");
        const genres = document.getElementById("genres-inp");
        const public_flag = document.getElementById("public-flag-inp");
        const image = document.getElementById("image-inp");

        const checked = public_flag.checked ? 1 : 0;

        formData.append(title.name, title.value);
        formData.append(artists.name, artists.value);
        formData.append(genres.name, genres.value);
        formData.append(public_flag.name, checked);
        formData.append(image.name, image.files[0]);

        fetch(window.location.href, {
            method: "PUT",
            body: formData,
        }).then(() => window.location.reload())
        .catch((err) => console.log(err))
    });

    document.getElementById("rmv-track-from-playlist").addEventListener("click", (event) => {
        const content = {
            playlists: event.currentTarget.value
        }
        fetch(window.location.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(content),
        })
        .catch((err) => console.log(err))
        .then(() => window.location.reload());
    });
});

