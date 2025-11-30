const base_url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    $(".interactable.track").bind("contextmenu", function (event) {
        event.preventDefault();

        const loginFlag = $("#loggin-flag").val();
        const isOwnerFlag = $(this).attr("isOwner");
        const href = $(this).children("a").attr("href");

        if($(this).hasClass("track")) {
            const isLikedFlag = $(this).attr("isLiked");
            const likeContextButton = $("#track-menu #like-tr-opt");
            const deleteContextButton = $("#track-menu #delete-tr-opt");
            $("#track-menu").attr("value", href);

            document.querySelector("#track-menu #like-tr-opt").innerHTML = isLikedFlag === "true" ? "Unlike" : "Like";

            desideLikeButtonVisibility(likeContextButton, loginFlag, isOwnerFlag);
            desideDeleteButtonVisibility(deleteContextButton, isOwnerFlag);

            $("#track-menu").finish().toggle(100).
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px",
                });
        }
    });

    function desideLikeButtonVisibility(button, loginFlag){
        if(
            loginFlag === "true" && 
            button.hasClass("hidden")
        ) {
            button.removeClass("hidden");
        } else if (
            loginFlag === "false" &&
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
        if (!$(e.target).parents("#track-menu").length > 0) {
            $("#track-menu").hide(100);
        };
    });

    $("#track-menu li").click(function(){
        const href = $(this).parent("ul").attr("value");
        switch($(this).attr("data-action")) {
            case "play": 
                playTrack(href); 
                break;
            case "like": 
                likeTrack(href); 
                break;
            case "download": 
                downloadTrack(href); 
                break;
            case "delete": 
                deleteTrack(href); 
                break;
        };
    
        $("#track-menu").hide(100);
    });
});

async function playTrack(href){
    window.location.assign(base_url.concat(href));
}

async function likeTrack(href){
    fetch(base_url + href, {
        method: "PATCH"
    }).then((Response) => console.log(Response.status));
    window.location.reload();
}

async function downloadTrack(href){
    console.log(href.concat("/download"));
    window.location.href = href.concat("/download");
}

async function deleteTrack(href){
    fetch(base_url + href, {
        method: "DELETE"
    }).then((Response) => console.log(Response.status));
}

