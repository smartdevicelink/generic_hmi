import RpcFactory from './RpcFactory'
import FileSystemController from './FileSystemController'
import store from '../store';
import { setVideoStreamUrl, setVideoStreamingApp } from '../actions'
import AudioPlayer from '../Utils/AudioPlayer'

class NavController {
    constructor () {
        this.addListener = this.addListener.bind(this)
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "OnAudioDataStreaming":
                if (rpc.params.available) {
                    FileSystemController.subscribeToEvent('StartAudioStream', (success, params) => {
                        if (!success || !params.endpoint) {
                            console.error('Error encountered while starting audio stream');
                            return;
                        }

                        AudioPlayer.play(params.endpoint);
                    });

                    FileSystemController.sendJSONMessage({
                        method: 'StartAudioStream',
                        params: {
                            url: this.audioStreamUrl
                        }
                    });
                } else {
                    AudioPlayer.pause();
                }
                return null
            case "OnVideoDataStreaming":
                if (rpc.params.available) {
                    FileSystemController.subscribeToEvent('StartVideoStream', (success, params) => {
                        if (!success) {
                            console.error('Error encountered while starting video stream');
                            return;
                        }

                        if (params.endpoint) {
                            store.dispatch(setVideoStreamUrl(params.endpoint));
                            var video = document.getElementById('navi_stream');
                            video.play();
                        }
                    });

                    FileSystemController.sendJSONMessage({
                        method: 'StartVideoStream',
                        params: {
                            url: this.videoStreamUrl,
                            config: this.videoConfig,
                            webm: this.webmSupport
                        }
                    });
                } else {
                    document.getElementById('navi_stream').pause();
                    store.dispatch(setVideoStreamUrl(null));
                }
                return null
            case "StartStream":
                this.videoStreamUrl = rpc.params.url;
                store.dispatch(setVideoStreamingApp(rpc.params.appID));
                return { "rpc": RpcFactory.StartStreamSuccess(rpc.id) };
            case "StopStream":
                store.dispatch(setVideoStreamUrl(null));
                return { "rpc": RpcFactory.StopStreamSuccess(rpc.id) };
            case "StartAudioStream":
                this.audioStreamUrl = rpc.params.url;
                return {"rpc": RpcFactory.StartAudioStreamSuccess(rpc.id)};
            case "SetVideoConfig":
                this.videoConfig = rpc.params.config;

                if (this.webmSupport === undefined) {
                    var video = document.getElementById('navi_stream');
                    this.webmSupport = 'probably' === video.canPlayType('video/webm; codecs="vp8"');
                }

                return { "rpc": RpcFactory.SetVideoConfigSuccess(rpc.id) };
            default:
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, "This RPC is not supported.")};
        }
    }
}

let controller = new NavController()
export default controller