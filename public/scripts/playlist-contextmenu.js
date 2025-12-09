import { base_url } from "./script.js";

document.addEventListener("DOMContentLoaded", () => {
    $(".interactable.playlist").bind("contextmenu", function (event) {
        event.preventDefault();

        const loginFlag = $("#loggin-flag").val();
        const isOwnerFlag = $(this).attr("isOwner");
        const href = $(this).children("a").attr("href");

        if($(this).hasClass("playlist")) {
            const isSavedFlag = $(this).attr("isSaved");
            const saveContextButton = $("#playlist-menu #save-pl-opt");
            const deleteContextButton = $("#playlist-menu #delete-pl-opt");

            $("#playlist-menu").attr("value", href)

            document.querySelector("#playlist-menu #save-pl-opt").textContent = isSavedFlag === "true" ? "Unsave" : "Save";

            desideSaveButtonVisibility(saveContextButton, loginFlag, isOwnerFlag);
            desideDeleteButtonVisibility(deleteContextButton, loginFlag, isOwnerFlag);

            $("#playlist-menu").finish().toggle(100).
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px",
                });
        };
    });

    function desideSaveButtonVisibility(button, loginFlag, isOwnerFlag){
        if(
            loginFlag === "true" && 
            button.hasClass("hidden") &&
            isOwnerFlag === "false"
        ) {
            button.removeClass("hidden");
        } else if (
            (loginFlag === "false" || 
            isOwnerFlag === "true") &&
            !button.hasClass("hidden")
        ) {
            button.addClass("hidden");
        }  
    }

    function desideDeleteButtonVisibility(button, loginFlag, isOwnerFlag){
        if(
            loginFlag === "true" && 
            button.hasClass("hidden") &&
            isOwnerFlag === "true"
        ) {
            button.removeClass("hidden");
        } else if (
            (loginFlag === "false" || 
            isOwnerFlag === "false") &&
            !button.hasClass("hidden")
        ) {
            button.addClass("hidden");
        }  
    }

    $(document).bind("mousedown", function (e) {
        if (!$(e.target).parents("#playlist-menu").length > 0) {
            $("#playlist-menu").hide(100);
        };
    });

    $("#playlist-menu li").click(function(){
        const href = $(this).parent("ul").attr("value");
        switch($(this).attr("data-action")) {
            case "play": 
                playPlaylist(href); 
                break;
            case "save": 
                savePlaylist(href); 
                break;
            case "download": 
                downloadPlaylist(href); 
                break;
            case "delete": 
                deletePlaylist(href)
                break;
        };

        $("#playlist-menu").hide(100);
    });
});

async function playPlaylist(href){
    window.location.assign(base_url.concat(href));
}

async function downloadPlaylist(href){
    window.location.assign(base_url + href.concat("/download"));
}

async function savePlaylist(href){
    fetch(base_url + href, {
        method: "POST"
    }).then(() => window.location.reload());
}

async function deletePlaylist(href){
    fetch(base_url.concat(href), {
        method: "DELETE"
    }).then(() => window.location.reload());
};