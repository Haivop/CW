async function like() {
    fetch(window.location.href, {
            method: 'PATCH',
    }).then(() => {window.location.reload()});
};

async function addTrackToPlaylists() {
    $("#add-track-form").toggle(100);
    $("#overlay").toggle(1);
}

async function editTrack() {
    $("#edit-track").toggle(100);
    $("#overlay").toggle(1);
}

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

async function deleteTrack(){
    fetch(window.location.href, {
            method: 'DELETE',
    });
};

async function sendEdittedTrack(){
    const formData = new FormData();
    const title = document.getElementById("title-inp");
    const artists = document.getElementById("artists-inp");
    const genres = document.getElementById("genres-inp");
    const public_flag = document.getElementById("public-flag-inp");
    const image = document.getElementById("image-inp");

    formData.append(title.name, title.value);
    formData.append(artists.name, artists.value);
    formData.append(genres.name, genres.value);
    formData.append(public_flag.name, public_flag.checked);
    formData.append(image.name, image.files[0]);

    fetch(window.location.href, {
        method: "PUT",
        body: formData,
    }).then(() => { window.location.reload() }).catch((err) => {
        console.log(err);
    })
};

