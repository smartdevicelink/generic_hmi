import RpcFactory from './RpcFactory';
import store from '../store';
import { speak } from '../actions';

const RESPONSE_CORRELATION_MS = 1000;
const ALERT_CORRELATION_MS = 100;
class TTSController {
    constructor() {
        this.addListener = this.addListener.bind(this);
        this.onResetTimeout = this.onResetTimeout.bind(this);
        this.audioPlayer = new Audio();
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
        if(store.getState().ui[store.getState().activeApp].speak.speakType.includes('ALERT')) return;
        let resPeriod = store.getState().resetTimeout.resetPeriod;

        this.listener.send(RpcFactory.OnResetTimeout(messageId, 'TTS.Speak', resPeriod));
    }

    playAudio(rpc) {
        if (this.filePlaylist.length === 0) {
            this.audioPlayer.onended = null;
            if (!this.audioPlayer.paused) {
                this.audioPlayer.pause();
                this.audioPlayer.src = "";
                return;
            }
        }

        var path = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        this.audioPlayer.onerror = (event) => {
            if (this.filePlaylist[0]) {
                if (this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT") {
                    this.speak();
                }
            } else {
                this.speakEnded();
            }
        }

        this.audioPlayer.onended = () => {
            this.audioPlayer.src = "";
            this.playNext(rpc);
        }
        this.currentlyPlaying = "FILE";
        this.audioPlayer.src = path;
        this.audioPlayer.play();
    }

    speak(rpc) {
        if (this.filePlaylist.length === 0) {
            return;
        }

        var text = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        // Dont allow empty strings
        if (!text) {
            if (this.filePlaylist[0]) {
                if (this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT") {
                    this.speak();
                }
            } else {
                this.speakEnded();
            }
            return;
        }

        var speechPlayer = new SpeechSynthesisUtterance();

        speechPlayer.onend = () => {
            this.playNext(rpc);
        }

        speechPlayer.onerror = (event) => {
            console.log("Text to speech error. Make sure your browser supports SpeechSynthesisUtterance");
            if (this.filePlaylist[0]) {
                if (this.filePlaylist[0].type === "FILE") {
                    this.playAudio(rpc);
                } else if (this.filePlaylist[0].type === "TEXT") {
                    this.speak(rpc);
                }
            } else {
                this.speakEnded();
            }
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

    playNext(rpc) {
        var file = this.filePlaylist[0];
        if (file !== undefined) {
            if (file.type === "FILE") {
                this.playAudio(rpc);
            } else if (file.type === "TEXT") {
                this.speak(rpc);
            } else if (file.type === "REPLY") {
                // REPLY is not an HMI_API type, it is internal used
                // in case more things will be added to the filePlaylist,
                // so that TTS Speak will be replied to before speaking next message
                this.filePlaylist.shift();
                clearInterval(this.timers[file.id]);
                this.speakEnded();
                this.listener.send(RpcFactory.TTSSpeakSuccess(file.id));
            }
        } else {
            this.speakEnded();
        }
    }

    isSpeakFinished() {
        return !this.currentlyPlaying;
    }

    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "IsReady":
                return { rpc: RpcFactory.IsReadyResponse(rpc, true) }
            case "GetSupportedLanguages":
                return { rpc: RpcFactory.GetSupportedLanguagesResponse(rpc) }
            case "GetLanguage":
                return { rpc: RpcFactory.GetLanguageResponse(rpc) }
            case "GetCapabilities":
                return { "rpc": RpcFactory.TTSGetCapabilitiesResponse(rpc) }
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
                store.dispatch(speak(
                    rpc.params.appID,
                    rpc.id,
                    rpc.params.playTone,
                    rpc.params.speakType,
                    rpc.params.ttsChunks
                ));
                var ttsChunks = rpc.params.ttsChunks
                this.filePlaylist = []
                for (var i = 0; i < ttsChunks.length; i++) {
                    if (ttsChunks[i].type.includes('FILE') || ttsChunks[i].type.includes('TEXT'))
                        this.filePlaylist.push(ttsChunks[i])
                }
                // REPLY is not an HMI_API type, it is internal used
                // in case more things will be added to the filePlaylist,
                // so that TTS Speak will be replied to before speaking next message
                this.filePlaylist.push({ type: 'REPLY', id: rpc.id });

                if (this.filePlaylist.length > 0) {
                    if (this.filePlaylist[0].type === "FILE") {
                        this.playAudio(rpc);
                    } else if (this.filePlaylist[0].type === "TEXT") {
                        this.speak(rpc);
                    }
                }
                this.timers[rpc.id] = setInterval(this.onResetTimeout, 9000, rpc.id);
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

let controller = new TTSController()
export default controller
