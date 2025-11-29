async function like() {
    fetch(window.location.href, {
            method: 'PATCH',
    }).then(() => {window.location.reload()});
};

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
    console.log(title);
    console.log(artists);
    console.log(genres);
    console.log(public_flag.checked);

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

