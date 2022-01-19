import RpcFactory from './RpcFactory';
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this);
        this.onResetTimeout = this.onResetTimeout.bind(this);
        this.audioPlayer = new Audio();
        this.audioPlayer.preload = 'none';
        this.filePlaylist = [];
        this.playNext = this.playNext.bind(this);
        this.currentlyPlaying = null;
        this.timers = {};
        this.speechSynthesisInterval = null;
    }
    addListener(listener) {
        this.listener = listener
    }

    onResetTimeout(messageId) {
        this.listener.send(RpcFactory.OnResetTimeout(messageId, 'TTS.Speak', 10000));
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

    speak(text) {
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
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speechPlayer);
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();

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
        var file = this.filePlaylist.shift();
        while (file) {
            if (file.type === 'REPLY') {
                clearInterval(this.timers[file.id]);
                this.listener.send(RpcFactory.TTSSpeakAborted(file.id));
            }
            file = this.filePlaylist.shift();
        }

        this.cleanup();
        this.listener.send(RpcFactory.TTSStoppedNotification());
        this.listener.send(RpcFactory.TTSStopSpeakingSuccess(stopSpeakingID));
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
            } else if (file.type === "REPLY") {
                // REPLY is not an HMI_API type, it is internal used
                // in case more things will be added to the filePlaylist,
                // so that TTS Speak will be replied to before speaking next message
                clearInterval(this.timers[file.id]);
                this.listener.send(RpcFactory.TTSSpeakSuccess(file.id));
                return this.playNext();
            }
        } else if (this.currentlyPlaying) {
            this.speakEnded();
        }
    }

    isAlertSpeakInProgress() {
        for(const file of this.filePlaylist) {
            if(file.type === 'REPLY' && file.speakType.includes('ALERT')) return true;
        }
        return false;
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
                if (this.currentlyPlaying) {
                    return { 
                        rpc: RpcFactory.ErrorResponse(rpc, 4, "Speak request already in progress")
                    };
                }
                var ttsChunks = rpc.params.ttsChunks
                for (var i=0; i<ttsChunks.length; i++) {
                    if (ttsChunks[i].type.includes('FILE') || ttsChunks[i].type.includes('TEXT'))
                        this.filePlaylist.push(ttsChunks[i])
                }
                // REPLY is not an HMI_API type, it is internal used
                // in case more things will be added to the filePlaylist,
                // so that TTS Speak will be replied to before speaking next message
                this.filePlaylist.push({ type: 'REPLY', id: rpc.id, speakType: rpc.params.speakType });

                this.listener.send(RpcFactory.TTSStartedNotification());
                this.playNext();
                if(!rpc.params.speakType.includes('ALERT'))
                    this.timers[rpc.id] = setInterval(this.onResetTimeout, 10000, rpc.id);
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
