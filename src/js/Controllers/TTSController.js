import RpcFactory from './RpcFactory';
import store from '../store';
import {
    onSpeak
} from '../actions';
import EventEmitter from "reactjs-eventemitter";

const RESPONSE_CORRELATION_MS = 1000;
const ALERT_CORRELATION_MS = 100;
class TTSController {
    constructor() {
        this.addListener = this.addListener.bind(this);
        this.onResetTimeout = this.onResetTimeout.bind(this);
        this.onSpeakTimeout = this.onSpeakTimeout.bind(this);
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
        this.speakID = null;
        this.currentlyPlaying = null;
        this.timers = {};
        this.speechSynthesisInterval = null;

    }
    addListener(listener) {
        this.listener = listener
    }

    onResetTimeout(appID, methodName) {
        let activeApp = store.getState().activeApp;
        let resPeriod = store.getState().ui[activeApp].resetTimeout.resetTimeoutValue;
        let messageId = store.getState().ui[activeApp].speak.msgID;

        const finalResetPeriod = resPeriod - RESPONSE_CORRELATION_MS;

        this.listener.send(RpcFactory.OnResetTimeout(messageId, 'TTS.Speak', resPeriod));
    }

    playAudio(rpc) {
        if (this.filePlaylist.length === 0) {
            this.audioPlayer.onended = null;
            if (rpc.params.speakType !== "ALERT") {
                this.listener.send(RpcFactory.TTSSpeakResponse(rpc))
            }
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
        window.speechSynthesis.speak(speechPlayer)

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
        clearInterval(this.timers[speakID]);
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
        clearInterval(this.timers[this.speakID]);
        this.speakID = null;
        this.currentlyPlaying = null;
    }

    onSpeakTimeout(msgID) {
        delete this.timers[msgID]

        this.listener.send(RpcFactory.TTSSpeakResponse({ id: msgID, method: 'TTS.Speak' }))
        EventEmitter.emit('TTSTimeout');
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
                if (this.speakID) {
                    return {
                        rpc: RpcFactory.ErrorResponse(rpc, 4, "Speak request already in progress")
                    };
                }
                store.dispatch(onSpeak(
                    rpc.id,
                    rpc.params.appID,
                    rpc.params.playTone,
                    rpc.params.speakType,
                    rpc.params.ttsChunks
                ))
                var ttsChunks = rpc.params.ttsChunks
                this.filePlaylist = []
                for (var i = 0; i < ttsChunks.length; i++) {
                    if (ttsChunks[i].type.includes('FILE') || ttsChunks[i].type.includes('TEXT'))
                        this.filePlaylist.push(ttsChunks[i])
                }
                this.speakID = rpc.id;
                this.listener.send(RpcFactory.TTSStartedNotification());

                if (this.filePlaylist.length > 0) {
                    if (this.filePlaylist[0].type === "FILE") {
                        this.playAudio(rpc);
                    } else if (this.filePlaylist[0].type === "TEXT") {
                        this.speak(rpc);
                    }
                }
                this.timers[rpc.id] = setInterval(this.onResetTimeout, 9000, rpc.params.appID, "TTS.Speak");
                return undefined;
            case "StopSpeaking":
                if (this.currentlyPlaying) {
                    this.stopSpeak(rpc.id);
                    return null;
                }
                this.speakID = null;
                const infoString = "No active TTS";
                return { rpc: RpcFactory.ErrorResponse(rpc, 6, infoString) }
            default:
                return false;
        }
    }
}

let controller = new TTSController()
export default controller
