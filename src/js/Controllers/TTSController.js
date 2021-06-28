import RpcFactory from './RpcFactory'
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this);
        this.onResetTimeout = this.onResetTimeout.bind(this);
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
        this.playNext = this.playNext.bind(this);
        this.speakID = null;
        this.currentlyPlaying = null;
        this.timers = {};
        this.speechSynthesisInterval = null;
    }
    addListener(listener) {
        this.listener = listener
    }

    onResetTimeout(appID, methodName) {
        this.listener.send(RpcFactory.OnResetTimeout(appID, "TTS", methodName))
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
        this.currentlyPlaying = "FILE";
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

        if (this.speechSynthesisInterval) {
            clearInterval(this.speechSynthesisInterval);
            this.speechSynthesisInterval = null;
        }

        this.currentlyPlaying = "TEXT";
        speechPlayer.text = text;
        speechPlayer.volume = 1;
        speechPlayer.rate = 1;
        speechPlayer.pitch = 0;
        window.speechSynthesis.speak(speechPlayer);

        // Workaround for chrome issue where long utterances time out
        this.speechSynthesisInterval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                clearInterval(this.speechSynthesisInterval)
                this.speechSynthesisInterval = null;
            } else {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            }
        }, 14000);
    }

    stopSpeak(stopSpeakingID) {
        const speakID = this.speakID;
        this.speakID = null;
        this.cleanup();
        clearInterval(this.timers[speakID]);
        this.listener.send(RpcFactory.TTSStopSpeakingSuccess(stopSpeakingID));
        this.listener.send(RpcFactory.TTSSpeakAborted(speakID));
        this.listener.send(RpcFactory.TTSStoppedNotification());
    }

    cleanup() {
        this.audioPlayer.onended = null;
        this.audioPlayer.pause();
        this.audioPlayer.src = "";
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
        this.filePlaylist = [];
        this.currentlyPlaying = null;
    }

    speakEnded() {
        if (this.speakID) {
            this.listener.send(RpcFactory.TTSSpeakSuccess(this.speakID));
            clearInterval(this.timers[this.speakID]);
            this.speakID = null;
        }
        this.cleanup();
        this.listener.send(RpcFactory.TTSStoppedNotification());
    }

    queueTTS(text, type='TEXT') {
        this.filePlaylist.push({
            type: type,
            text: text
        });

        if (!this.currentlyPlaying) {
            this.listener.send(RpcFactory.TTSStartedNotification());
            this.playNext();
        }
    }

    playNext() {
        var file = this.filePlaylist.shift();
        if (file !== undefined) {
            if (file.type === "FILE") {
                this.playAudio(file.text);
            } else if (file.type === "TEXT") {
                this.speak(file.text);
            }
        } else {
            this.speakEnded();
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
                if (this.speakID) {
                    return { 
                        rpc: RpcFactory.ErrorResponse(rpc, 4, "Speak request already in progress")
                    };
                }
                var ttsChunks = rpc.params.ttsChunks
                for (var i=0; i<ttsChunks.length; i++) {
                        this.filePlaylist.push(ttsChunks[i])
                }
                this.speakID = rpc.id;
                this.listener.send(RpcFactory.TTSStartedNotification());

                if (!this.currentlyPlaying) {
                    this.listener.send(RpcFactory.TTSStartedNotification());
                    this.playNext();
                }
                this.timers[rpc.id] = setInterval(this.onResetTimeout, 9000, rpc.params.appID, "TTS.Speak");
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
