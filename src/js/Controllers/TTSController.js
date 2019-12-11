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
        function base64ToArrayBuffer(base64) {
            var binary_string =  window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array( len );
            for (var i = 0; i < len; i++)        {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        if(this.filePlaylist.length == 0) {
            return;
        }
        var text = this.filePlaylist[0].text;
        this.filePlaylist.shift();

        var xhr = new XMLHttpRequest();
        var url = "https://texttospeech.googleapis.com/v1/text:synthesize?fields=audioContent&key=AIzaSyD8D2sSNTMcIzf5yFkh9cr72XXchaMziJo";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                var buf = base64ToArrayBuffer(json.audioContent);
                var context = new window.AudioContext();
                context.decodeAudioData(buf, function(buffer) {
                    var source = context.createBufferSource(); // creates a sound source
                    source.buffer = buffer;
                    source.connect(context.destination);       // connect the source to the context'
                    source.onended = function() {
                        context.close();
                        if(this.filePlaylist[0]) {
                            if(this.filePlaylist[0].type === "FILE") {
                                this.playAudio();
                            } else if (this.filePlaylist[0].type === "TEXT"){
                                this.speak();
                            }    
                        }
                    };
                    source.start(0);
                });
            }
        }
        var data = JSON.stringify({
          "input": {
            "text":text
          },
          "audioConfig": {
            "audioEncoding":"MP3"
          },
          "voice": {
            "languageCode":"en-US"
          }
        });
        xhr.send(data);
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