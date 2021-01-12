import RpcFactory from './RpcFactory'
import FileSystemController from './FileSystemController'
import store from '../store';
import { setVideoStreamUrl, setVideoStreamingApp } from '../actions'

class NavController {
    constructor () {
        this.addListener = this.addListener.bind(this)
    }
    addListener(listener) {
        this.listener = listener
    }
    handleRPC(rpc) {
        let methodName = rpc.method.split(".")[1]
        var message = "";
        switch (methodName) {
            case "IsReady":
                return {"rpc": RpcFactory.IsReadyResponse(rpc, true)}
            case "OnVideoDataStreaming":
                if (rpc.params.available) {
                    FileSystemController.subscribeToEvent('StartVideoStream', (success, params) => {
                        if (!success || !params.endpoint) {
                            console.error('Error encountered while starting stream');
                            return;
                        }

                        store.dispatch(setVideoStreamUrl(params.endpoint));
                        var video = document.getElementById('navi_stream');
                        video.play();
                    });

                    FileSystemController.sendJSONMessage({
                        method: 'StartVideoStream',
                        params: {
                            url: this.videoStreamUrl
                        }
                    });
                } else {
                    var video = document.getElementById('navi_stream');
                    video.pause();
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
                message = "This system does not support audio streaming."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
            case "SetVideoConfig":
                return { "rpc": RpcFactory.SetVideoConfigSuccess(rpc.id) };
            default:
                message = "This RPC is not supported."
                return {"rpc": RpcFactory.UnsupportedResourceResponse(rpc, message)};
        }
    }
}

let controller = new NavController()
export default controller