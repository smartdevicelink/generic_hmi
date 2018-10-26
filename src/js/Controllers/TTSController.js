import RpcFactory from './RpcFactory'
class TTSController {
    constructor () {
        this.addListener = this.addListener.bind(this)
        this.audioPlayer = new Audio();
        this.filePlaylist = [];
    }
    addListener(listener) {
        this.listener = listener
    }

    playAudio() {
        if(this.filePlaylist.length == 0) {
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
            console.log(event);
            if(this.filePlaylist[0]) {
                if(this.filePlaylist[0].type === "FILE") {
                    this.playAudio();
                } else if (this.filePlaylist[0].type === "TEXT"){
                    this.speak();
                }    
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

    speak() {
        if(this.filePlaylist.length == 0) {
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
            }
        }

        speechPlayer.text = text;
        speechPlayer.volume = 1;
        speechPlayer.rate = 1;
        speechPlayer.pitch = 0;
        window.speechSynthesis.speak(speechPlayer)

    }
    
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch(methodName) {
            case "IsReady":
                return {rpc: RpcFactory.IsReadyResponse(rpc, true)}
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

                if(this.filePlaylist.length > 0) {
                    if(this.filePlaylist[0].type === "FILE") {
                        this.playAudio();
                    } else if (this.filePlaylist[0].type === "TEXT"){
                        this.speak();
                    }
                }
                
                return true;
        }
    }
}

let controller = new TTSController ()
export default controller