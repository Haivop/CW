document.getElementById("edit-account-btn").addEventListener("click", () => {
    $("#edit-account").toggle(100);
    $("#overlay").toggle(1);
});

$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents("#edit-account").length > 0) {
        $("#edit-account").hide(100);
        $("#overlay").hide(1);
    };
});