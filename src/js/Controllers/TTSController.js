import RpcFactory from './RpcFactory'
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
        
        this.currentlyPlaying = false;
        this.playNext = this.playNext.bind(this);
    }
    addListener(listener) {
        this.listener = listener
    }

    playAudio(path) {
        this.audioPlayer.onerror = (event) => {
            console.warn(event);
            this.playNext();
        }

        this.audioPlayer.onended = () => {
            this.audioPlayer.src ="";
            this.playNext();
        }

        this.audioPlayer.src = path;
        this.audioPlayer.play();
    }

    speak(text) {;
        var speechPlayer = new SpeechSynthesisUtterance();

        speechPlayer.onend = () => {
            this.playNext();
        }

        speechPlayer.onerror = (event) => {
            console.warn("TTS error. Make sure your browser supports SpeechSynthesisUtterance");
            this.playNext();
        }

        speechPlayer.text = text;
        speechPlayer.volume = 1;
        speechPlayer.rate = 1;
        speechPlayer.pitch = 0;
        window.speechSynthesis.speak(speechPlayer);
    }

    queueTTS(text, type='TEXT') {
        this.filePlaylist.push({
            type: type,
            text: text
        });

        if (!this.currentlyPlaying) {
            this.playNext();
        }
    }

    playNext() {
        var file = this.filePlaylist.shift();
        if (file !== undefined) {
            this.currentlyPlaying = true;

            if (file.type === "FILE") {
                this.playAudio(file.text);
            } else if (file.type === "TEXT") {
                this.speak(file.text);
            }
        } else {
            this.currentlyPlaying = false;
            this.finishPlaying();
        }
    }

    finishPlaying() {
        this.audioPlayer.onended = null;
        if (!this.audioPlayer.paused) {
            this.audioPlayer.pause();
            this.audioPlayer.src = "";
        }
    }
    
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch(methodName) {
            case "IsReady":
                return {rpc: RpcFactory.IsReadyResponse(rpc, true)}
            case "GetSupportedLanguages":
                return { rpc: RpcFactory.GetSupportedLanguagesResponse(rpc) }
            case "GetLanguage":
                return { rpc: RpcFactory.GetLanguageResponse(rpc) }
            case "GetCapabilities":
                return {"rpc": RpcFactory.TTSGetCapabilitiesResponse(rpc)}
            case "ChangeRegistration":
                return true
            case "AddCommand":
                return true
            case "SetGlobalProperties":
                return true
            case "Speak":
                var ttsChunks = rpc.params.ttsChunks
                for (var i=0; i<ttsChunks.length; i++) {
                        this.filePlaylist.push(ttsChunks[i])
                }

                if (false === this.currentlyPlaying) {
                    this.playNext();
                }
                
                return true;
            default:
                return false;
        }
    }
}

let controller = new TTSController ()
export default controller