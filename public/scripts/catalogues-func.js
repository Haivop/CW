document.addEventListener("DOMContentLoaded", () => {
    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#create-playlist-form").length > 0) {
            $("#create-playlist-form").hide(100);
            $("#overlay").hide(1);
        };
    });
    document.getElementById("create-playlist-btn").addEventListener("click", () => {
        $("#create-playlist-form").toggle(100);
        $("#overlay").toggle(1);
    });
})
