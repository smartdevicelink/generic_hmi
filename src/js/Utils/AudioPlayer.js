class AudioPlayer {
    constructor() {
        this.audio = new Audio();
    }

    play(url) {
        this.audio.src = url;
        this.audio.play().then(_ =>
            console.log('audio streaming starting @ ', url)
        ).catch(err =>
            console.error('failed to stream audio: ', err)
        )
    }

    pause() {
        if (this.audio.src !== '') {
            this.audio.pause();
            this.audio.src = '';
        }
    }
}

const audio = new AudioPlayer();
export default audio;