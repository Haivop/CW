const base_url = "http://localhost:3000";

class AudioWithRef {
    constructor(element, url){
        this.element = element;
        this.audio = new Audio(url);
        this.nextAudio = null;
        this.prevAudio = null;
    }

    play(){
        this.element.play();
    }

    pause(){
        this.element.pause();
    }
}

class Playlist {
    constructor(audioArr){
        this.tracks = audioArr;
        this.current = audioArr[0];
    }

    build(){
        for(let i = 0; i < this.tracks.length; i++){
            i = parseInt(i);
            const prev = i-1 >= 0 ? i-1 : this.tracks.length - 1;
            const next = i+1 <= this.tracks.length - 1 ? i+1 : 0;

            this.tracks[i].nextAudio = this.tracks[next];
            this.tracks[i].prevAudio = this.tracks[prev];
        }
    }
}

async function addPlaylist() {
    fetch(window.location.href, {
        method: "POST",
    });
};

async function downloadPlaylist(href) {
    window.location.href = href;
};

async function deletePlaylist(){
    fetch(window.location.href, {
        method: "DELETE",
    });
}

async function sendEdittedPlaylist(){
    const formData = new FormData();

    const title = document.getElementById("title-inp");
    const image_file = document.getElementById("image-inp")

    formData.append(title.name, title.value);
    formData.append(image_file.name, image_file.files[0]);

    fetch(window.location.href, {
        method: "PUT",
        body: formData,
    }).then(() => {
        window.location.reload();
    }).catch((err) => {
        if(err) console.log(err);
    });
};

async function removeFromPlaylist(playlistId, trackId){
    console.log(base_url + "/tracks/" + trackId, playlistId)

    const content = {
        playlists: playlistId
    }
    fetch(base_url + "/tracks/" + trackId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(content),
    }).then(() => {
       window.location.reload();
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    const playbackBtn = document.getElementById("start-playback");
    let playlist = [];
    const audios = document.querySelectorAll("audio.in-playlist");
    for(let i = 0; i < audios.length; i++){
        const audio = new AudioWithRef(audios[i], audios[i].src);
        playlist.push(audio);
    }
    
    playlist = new Playlist(playlist);
    playlist.build();

    async function playback(current = playlist.current){
        playlist.current = current;
        current.play();

        current.element.addEventListener("ended", () => {
            console.log(current.nextAudio);
            playback(current.nextAudio);
        });
    };

    async function stop(current = playlist.current){
        current.pause();
    };

    document.getElementById("start-playback").addEventListener("click", async () => {
        const activated = playbackBtn.activated;

        if(activated) {
            playbackBtn.activated = false;
            stop();
        }
        else {
            playbackBtn.activated = true;
            playback();
        }
    });

    document.getElementById("forward").addEventListener("click", async () => {
        playlist.current = playlist.current.nextAudio;
        if(playbackBtn.activated){
            stop(playlist.current.prevAudio);
            playback(playlist.current);
        }
    });

    document.getElementById("backward").addEventListener("click", async () => {
        playlist.current = playlist.current.prevAudio;
        if(playbackBtn.activated) {
            stop(playlist.current.nextAudio);
            playback(playlist.current);
        }
    });
});

function editPlaylist(){
    $("#edit-playlist").toggle(100);
    $("#overlay").toggle(1);
}

$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents("#edit-playlist").length > 0) {
        $("#edit-playlist").hide(100);
        $("#overlay").hide(1);
    };
});
