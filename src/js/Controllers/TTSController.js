import RpcFactory from './RpcFactory'
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
        this.speakID = null;
        this.currentlyPlaying = null;
    }
    addListener(listener) {
        this.listener = listener
    }

    playAudio() {
        if(this.filePlaylist.length === 0) {
            this.audioPlayer.onended = null;
            if(!this.audioPlayer.paused) {
                this.audioPlayer.pause();
                this.audioPlayer.src = "";
                return;
            }
        }

        var path = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        this.audioPlayer.onerror = (event) => {
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }    
            } else {
                this.speakEnded();
            }
        }

        this.audioPlayer.onended = () => {
            this.audioPlayer.src ="";
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }
            } else {
                this.speakEnded();
            }
        }
        this.currentlyPlaying = "FILE";
        this.audioPlayer.src = path;
        this.audioPlayer.play();
    }

    speak() {
        if(this.filePlaylist.length === 0) {
            return;
        }

        var text = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        var speechPlayer = new SpeechSynthesisUtterance();

        speechPlayer.onend = () => {
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }    
            } else {
                this.speakEnded();
            }
        }

        speechPlayer.onerror = (event) => {
            console.log("Text to speech error. Make sure your browser supports SpeechSynthesisUtterance");
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }    
            } else {
                this.speakEnded();
            }
        }

        this.currentlyPlaying = "TEXT";
        speechPlayer.text = text;
        speechPlayer.volume = 1;
        speechPlayer.rate = 1;
        speechPlayer.pitch = 0;
        window.speechSynthesis.speak(speechPlayer)

    }

    stopSpeak(stopSpeakingID) {
        const speakID = this.speakID;
        this.speakID = null;
        if (this.currentlyPlaying === "FILE") {
            this.audioPlayer.onended = null;
            this.audioPlayer.pause();
            this.audioPlayer.src = "";
        } else if (this.currentlyPlaying === "TEXT") {
            window.speechSynthesis.pause();
            window.speechSynthesis.cancel();
        }
        this.filePlaylist = [];
        this.currentlyPlaying = null;
        this.listener.send(RpcFactory.TTSStopSpeakingSuccess(stopSpeakingID));
        this.listener.send(RpcFactory.TTSSpeakAborted(speakID));
        this.listener.send(RpcFactory.TTSStoppedNotification());
    }

    speakEnded() {
        if (!this.speakID) {
            return;
        }
        this.listener.send(RpcFactory.TTSSpeakSuccess(this.speakID));
        this.listener.send(RpcFactory.TTSStoppedNotification());

        this.speakID = null;
        this.currentlyPlaying = null;
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
                this.filePlaylist = []
                for (var i=0; i<ttsChunks.length; i++) {
                        this.filePlaylist.push(ttsChunks[i])
                }
                this.speakID = rpc.id;
                this.listener.send(RpcFactory.TTSStartedNotification());

                if(this.filePlaylist.length > 0) {
                    if(this.filePlaylist[0].type === "FILE") {
                        this.playAudio();
                    } else if (this.filePlaylist[0].type === "TEXT"){
                        this.speak();
                    }
                }
                
                return null;
            case "StopSpeaking":
                if (this.currentlyPlaying) {
                    this.stopSpeak(rpc.id);
                    return null;
                }
                const infoString = "No active TTS";
                return { rpc: RpcFactory.ErrorResponse(rpc, 6, infoString) }
            default:
                return false;
        }
    }
}

let controller = new TTSController ()
export default controller
