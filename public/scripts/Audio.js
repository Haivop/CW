class AudioWithRef extends Audio{
    constructor(url, ref){
        super(url);
        this.nextAudio = ref;
    }
}

async function initAudio(url, ref){
    const audio = new AudioWithRef(url, ref);
    return audio;
}