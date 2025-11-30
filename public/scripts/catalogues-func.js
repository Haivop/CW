function createPlaylist(){
    $("#create-playlist-form").toggle(100);
    $("#overlay").toggle(1);
}

$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents("#create-playlist-form").length > 0) {
        $("#create-playlist-form").hide(100);
        $("#overlay").hide(1);
    };
});