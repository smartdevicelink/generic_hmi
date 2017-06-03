import sdlController from './SDLController';
import bcController from './BCController';

class ExternalPoliciesController {
    constructor() {
        this.packClient = null
        this.unpackClient = null
        this.packUrl = null
        this.unpackUrl = null
        this.sysReqParams = {}

    }
    connectPolicyManager(packUrl, unpackUrl) {
        console.log("connect policy manager")
        if(packUrl) {
            this.packUrl = packUrl
        }
        if(unpackUrl){
            this.unpackUrl = unpackUrl
        }
                
        this.packClient = new WebSocket(this.packUrl)
        this.packClient.onopen = this.onopen.bind(this)
        this.packClient.onclose = this.onclose.bind(this)
        this.packClient.onmessage = this.onPackMessage.bind(this)


        this.unpackClient = new WebSocket(this.unpackUrl)
        this.unpackClient.onopen = this.onopen.bind(this)
        this.unpackClient.onclose = this.onclose.bind(this)
        this.unpackClient.onmessage = this.onUnpackMessage.bind(this)
    }
    disconnectPolicyManager() {
        if (this.retry) {
            clearInterval(this.retry);
        }
        if (this.packClient) {
            if(this.packClient.readyState === this.packClient.OPEN) {
                this.packClient.onclose = function () {
                    this.packClient.close()
                }
            }
        }
        if (this.unpackClient) {
            if(this.unpackClient.readyState === this.unpackClient.OPEN) {
                this.unpackClient.onclose = function () {
                    this.unpackClient.close()
                }
            }
        }
    }
    onopen (evt) {
        console.log("on open")
        console.log(this.packClient)
        console.log(this.unpackClient)
        if (this.retry && this.packClient == 1 && this.unpackClient == 1) {
            clearInterval(this.retry)
        }

    }
    onclose (evt) {
        console.log("on close")
        if (!this.retry) {
            this.retry = setInterval(this.connectPolicyManager.bind(this), 4000)
        }
    }
    onPackMessage(evt) {
        console.log("onPackMessage")
        bcController.onSystemRequest(this.sysReqParams.policyUpdateFile, this.sysReqParams.urls)
        this.sysReqParams = {}
    }
    onUnpackMessage(evt) {
        console.log("onUnpackMessage " + evt)
        sdlController.onReceivedPolicyUpdate(evt.data)
    }
    pack(params) {
        console.log("pack")
        console.log(params)
        this.sysReqParams = params
        this.packClient.send(this.sysReqParams.policyUpdateFile);
    }
}

let controller = new ExternalPoliciesController()
export default controller