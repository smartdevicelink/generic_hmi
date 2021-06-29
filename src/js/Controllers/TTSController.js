import RpcFactory from './RpcFactory'
import store from '../store'
import {
    onSpeak
} from '../actions'
import EventEmitter from "reactjs-eventemitter";

const RESPONSE_CORRELATION_MS = 1000;
const ALERT_CORRELATION_MS = 100;
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.onSpeakTimeout = this.onSpeakTimeout.bind(this)
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
        this.timers = {}
    }
    addListener(listener) {
        this.listener = listener
    }

    playAudio(rpc) {
        if(this.filePlaylist.length === 0) {
            this.audioPlayer.onended = null;
            if (rpc.params.speakType !== "ALERT") {
                this.listener.send(RpcFactory.TTSSpeakResponse(rpc))
            }

            if(!this.audioPlayer.paused) {
                this.audioPlayer.pause();
                this.audioPlayer.src = "";
                return;
            }            
        }

        var path = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        this.audioPlayer.onerror = (event) => {
            console.log(event);
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }    
            }
            if (rpc.params.speakType !== "ALERT") {
                this.listener.send(RpcFactory.TTSSpeakResponse(rpc))
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
            }
        }

        this.audioPlayer.src = path;
        this.audioPlayer.play();
    }

    speak(rpc) {
        if(this.filePlaylist.length === 0) {
            if (rpc.params.speakType !== "ALERT") {
                this.listener.send(RpcFactory.TTSSpeakResponse(rpc))
            }
            return;
        }

        var text = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        var speechPlayer = new SpeechSynthesisUtterance();

        speechPlayer.onend = () => {
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio(rpc);
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak(rpc);
                }    
            }
        }

        speechPlayer.onerror = (event) => {
            console.log("Text to speech error. Make sure your browser supports SpeechSynthesisUtterance");
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio(rpc);
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak(rpc);
                }    
            }
            if (rpc.params.speakType !== "ALERT") {
                this.listener.send(RpcFactory.TTSSpeakResponse(rpc))
            }
        }

        speechPlayer.text = text;
        speechPlayer.volume = 1;
        speechPlayer.rate = 1;
        speechPlayer.pitch = 0;
        window.speechSynthesis.speak(speechPlayer)

    }

    onSpeakTimeout(msgID) {
        delete this.timers[msgID]

        this.listener.send(RpcFactory.TTSSpeakResponse({ id: msgID, method: 'TTS.Speak' }))
        EventEmitter.emit('TTSTimeout');
    }

    resetSpeakTimeout(isAlertReseted = false) {
        let activeApp = store.getState().activeApp;
        let resPeriod = store.getState().ui[activeApp].resetTimeout.resetTimeoutValue;
        let messageId = store.getState().ui[activeApp].speak.msgID;

        clearTimeout(this.timers[messageId]);
        const finalResetPeriod = resPeriod - RESPONSE_CORRELATION_MS - (isAlertReseted ? ALERT_CORRELATION_MS : 0);
        this.timers[messageId] = setTimeout(this.onSpeakTimeout, finalResetPeriod, messageId);

        this.listener.send(RpcFactory.OnResetTimeout(messageId,'TTS.Speak',resPeriod));
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
                store.dispatch(onSpeak(
                    rpc.id,
                    rpc.params.appID,                    
                    rpc.params.playTone,
                    rpc.params.speakType,
                    rpc.params.ttsChunks
                ))

                var ttsChunks = rpc.params.ttsChunks
                this.filePlaylist = []
                for (var i=0; i<ttsChunks.length; i++) {
                        this.filePlaylist.push(ttsChunks[i])
                }

                if(this.filePlaylist.length > 0) {
                    if(this.filePlaylist[0].type === "FILE") {
                        this.playAudio(rpc);
                    } else if (this.filePlaylist[0].type === "TEXT"){
                        this.speak(rpc);
                    }
                }

                if (rpc.params.speakType == "ALERT") {
                    clearTimeout(this.timers[rpc.id]);
                    this.timers[rpc.id] = setTimeout(this.onSpeakTimeout, 5000 - RESPONSE_CORRELATION_MS - ALERT_CORRELATION_MS, rpc.id)
                }
                
                return undefined;
            default:
                return false;
        }
    }
}

let controller = new TTSController ()
export default controller