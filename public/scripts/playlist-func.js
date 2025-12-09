import { base_url } from "./script.js";

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
            const prev = i-1 >= 0 ? i-1 : this.tracks.length - 1;
            const next = i+1 <= this.tracks.length - 1 ? i+1 : 0;

            this.tracks[parseInt(i)].nextAudio = this.tracks[parseInt(next)];
            this.tracks[parseInt(i)].prevAudio = this.tracks[parseInt(prev)];
        }
    }
};

function formatDuration(duration){
    let minutes = Math.trunc(duration/60);
    let seconds = Math.ceil(duration % 60);

    minutes = minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString();
    seconds = seconds.toString().length === 1 ? "0" + seconds.toString() : seconds.toString();

    return minutes + ":" + seconds;
}

document.addEventListener("DOMContentLoaded", async () => {
    const playbackBtn = document.getElementById("start-playback");
    let playlist = [];
    let audio = HTMLElement;
    let animation = null;
    const audios = document.querySelectorAll("audio.in-playlist");
    const audioPlayerContainer = document.getElementById('audio-player');
    const audioDurationSlider = document.querySelector("#audio-duration > input");
    const durationDisplay = document.getElementById("max-duration");
    const currentDuration = document.getElementById("current-duration");

    const whilePlaying = () => {
        audioDurationSlider.value = Math.ceil(audio.currentTime);
        currentDuration.textContent = formatDuration(audioDurationSlider.value);
        audioPlayerContainer.style.setProperty('--seek-before-width', `${audioDurationSlider.value / audioDurationSlider.max * 100}%`);
        animation = requestAnimationFrame(whilePlaying);
    }

    document.getElementById("start-playback").addEventListener("click", async () => {
        const activated = playbackBtn.activated;
        audioPlayerContainer.classList.toggle("hidden");

        if(activated) {
            playbackBtn.activated = false;
            stop();
        }
        else {
            playbackBtn.activated = true;
            playback();
        }
    });

    const showRangeProgress = (rangeInput) => {
        if(rangeInput === audioDurationSlider) 
            audioPlayerContainer.style.setProperty('--seek-before-width', 
                rangeInput.value / rangeInput.max * 100 + '%');
        else audioPlayerContainer.style.setProperty('--volume-before-width', 
            rangeInput.value / rangeInput.max * 100 + '%');
    }

    audioDurationSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
    });

    for(let audio of audios){
        const audioObj = new AudioWithRef(audio, audio.src);
        playlist.push(audioObj);
    }
    
    playlist = new Playlist(playlist);
    playlist.build();

    function setDurationMax(audio){
        audioDurationSlider.max = Math.ceil(audio.duration);
    }

    async function displayDuration(audio){
        const maxDuration = audio.duration;
        durationDisplay.textContent = formatDuration(maxDuration);
    }

    async function playback(current = playlist.current){
        audio = current.element;

        audioDurationSlider.style.animation = `${audio.duration} linear slide-in`

        audioDurationSlider.addEventListener("input", () => {
            currentDuration.textContent = formatDuration(audioDurationSlider.value);
            console.log(audio.paused);
            if(!audio.paused) {
                cancelAnimationFrame(animation);
            }
        });

        audioDurationSlider.addEventListener("change", () => {
            audio.currentTime = audioDurationSlider.value;
            console.log(audio.paused);
            if(!audio.paused) {
                requestAnimationFrame(whilePlaying);
            }
        });

        playlist.current = current;

        current.play();

        displayDuration(audio);
        setDurationMax(audio);

        requestAnimationFrame(whilePlaying);

        current.element.addEventListener("ended", () => {
            console.log(current.nextAudio);
            playback(current.nextAudio);
        });
    };

    async function stop(current = playlist.current){
        cancelAnimationFrame(animation);
        current.pause();
    };

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

    document.getElementById("download").addEventListener("click", async () => {
        window.location.assign(window.location.href + "/download");
    });

    document.getElementById("add-playlist-btn").addEventListener("click", () => {
        fetch(window.location.href, {
            method: "POST",
        }).then((Response) => {
            console.log(Response.status);
            if(Response.status === 403) window.location.assign(base_url);
            else window.location.reload();
        });
    });

    document.getElementById("delete-playlist-btn").addEventListener("click", () => {
        fetch(window.location.href, {
            method: "DELETE",
        }).catch((err) => {
            if(err) console.error(err);
        }).then(() => window.location.replace(base_url + "/"));
    });

    document.getElementById("remove-track-from-playlist-btn").addEventListener("click", () => {
        const button = document.getElementById("remove-track-from-playlist-btn");
        const playlistId = button.attributes.playlist.value;
        const trackId = button.attributes.track.value;

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
    });

    document.getElementById("edit-playlist-btn").addEventListener("click", () => {
        $("#edit-playlist").toggle(100);
        $("#overlay").toggle(1);
    });

    document.getElementById("send-editted-btn").addEventListener("click", () => {
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
    });
});



$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents("#edit-playlist").length > 0) {
        $("#edit-playlist").hide(100);
        $("#overlay").hide(1);
    };
});
