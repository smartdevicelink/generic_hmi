import sdlController from './SDLController';

class VehicleModemController {
    constructor() {
      this.PTUBackendUrl = null
      this.PTUClient = null
      this.PTUEventListenersMap = {}
    }

    connectPTUManager(ptuBackendUrl) {
      if(ptuBackendUrl){
        this.PTUBackendUrl = ptuBackendUrl
      }

      return new Promise((resolve, reject) => {
        if(!this.PTUBackendUrl){
          console.error('PTU Backend URL not specified. Cannot connect')
          reject()
          return;
        }

        var that = this;
        this.PTUClient = new WebSocket(this.PTUBackendUrl)
        this.PTUClient.onopen = function(evt) {
          that.onPTUServiceOpen(evt)
          resolve()
        }
        this.PTUClient.onerror = function(evt) {
          console.error('PTU: Failed to connect to PTU Backend service')
          //Return to regular PT flow
          reject()
        }
        this.PTUClient.onclose = this.onPTUServiceClose.bind(this)
        this.PTUClient.onmessage = this.onPTUServiceMessageReceived.bind(this)

      });

    }

    onPTUServiceOpen (evt) {
      console.log('Connected to PTU Backend Service')
    }

    onPTUServiceClose (evt) {
      console.log('Disconnected from PTU Backend Service')
      this.PTUClient.close()
      this.PTUClient = null
    }

    onPTUServiceMessageReceived(evt) {
      console.log('Received message from PTU Backend Service')
      let event = JSON.parse(evt.data)
      let event_name = event.method;
      if(event.success != undefined && event_name in this.PTUEventListenersMap){
        let params = event.params
        this.PTUEventListenersMap[event_name](event.success, params)
      }
    }

    sendToPTUService(json_msg){
      let msg = JSON.stringify(json_msg)
      console.log('Sending message to PTU Backend Service: ', msg)
      this.PTUClient.send(msg)
    }

    subscribeToPTUServiceEvent(event_name, callback){
      this.PTUEventListenersMap[event_name] = callback;
    }

    unsubscribeFromPTUServiceEvent(event_name){
      if(event_name in this.PTUEventListenersMap){
        delete this.PTUEventListenersMap[event_name]
      }
    }

    /**
     * @description Downloads PTS content through the backend
     * @param {String} file_name
     * @returns promise for downloading the PTS content
     */
    downloadPTSFromFile(file_name, timeout){
      var that = this;

      return new Promise((resolve, reject) => {
        let pts_receive_timer = setTimeout(() => {
          console.error('PTU: Timeout for downloading PTS expired')
          that.unsubscribeFromPTUServiceEvent('GetPTSFileContent')
          reject();
        }, timeout);

        let pts_received_callback = function(success, params){
          clearTimeout(pts_receive_timer)
          that.unsubscribeFromPTUServiceEvent('GetPTSFileContent')
          if(!success){
            console.error('PTU: Downloading PTS was not successful')
            reject();
            return;
          }

          resolve(params['content'])
        }

        let request = {
          method: 'GetPTSFileContent',
          params: {
            fileName: file_name
          }
        };

        that.subscribeToPTUServiceEvent('GetPTSFileContent', pts_received_callback)
        that.sendToPTUService(request)
      });
    }

    /**
     * @description Sends PTS to specified endpoint URL
     * @param {String} url
     * @param {String} pts_data
     * @returns promise for sending PTS to endpoint
     */
    sendPTSToEndpoint(url, pts_data){
      return new Promise((resolve, reject) => {
        console.log('PTU: Requesting PTU from endpoint: ' + url)

        var xhr = new XMLHttpRequest()
        xhr.onload = () => {
          // Received PTU response from endpoint
          const ptu_content = JSON.stringify(JSON.parse(xhr.response).data[0])
          resolve(ptu_content);
        };
        xhr.onerror = (err) => {
          console.error('PTU: Request to endpoint has failed', err)
          reject();
        }
        xhr.open('POST', url)
        xhr.send(pts_data)
      });
    }

    /**
     * @description Saves PTU content to specified file
     * @param {String}
     * @param {String}
     * @returns promise for saving PTU content
     */
    savePTUToFile(file_name, ptu_data, timeout){
      var that = this;
      return new Promise((resolve, reject) => {
        let ptu_save_timer = setTimeout(() => {
          console.error('PTU: Timeout for saving PTU expired')
          that.unsubscribeFromPTUServiceEvent('SavePTUToFile')
          reject();
        }, timeout);

        let ptu_saved_callback = (success, params) => {
          clearTimeout(ptu_save_timer);
          that.unsubscribeFromPTUServiceEvent('SavePTUToFile')
          
          if(!success){
            console.error('PTU: PTU save was not successful')
            reject();
            return;
          }

          resolve();
        };

        let request = {
          method: 'SavePTUToFile',
          params: {
            fileName: file_name,
            content: ptu_data
          }
        };        

        that.subscribeToPTUServiceEvent('SavePTUToFile', ptu_saved_callback);
        that.sendToPTUService(request)
      })
    }

    /**
    * @description Generates new file path for updated PT
    * @returns generated file path
    */
    generatePTUFilePath(){
      let path = document.location.pathname;
      let index = path.lastIndexOf('/');
      if (index >= 0) {
        path = path.slice(0, index);
      }

      let current_date = new Date();
      let timestamp = `${current_date.getFullYear()}${current_date.getMonth()+1}${current_date.getDate()}_` +
      `${current_date.getHours()}${current_date.getMinutes()}${current_date.getSeconds()}`

      return `${path}/PTU_${timestamp}.json`
    }

    requestPTUFromEndpoint(pts_file_name, urls){
      var that = this;
      return new Promise((resolve, reject) => {
        let ptu_failed_callback = function(){
          that.PTUClient.close()
          
          //Return to regular PT flow
          reject()
        };

        that.downloadPTSFromFile(pts_file_name, 10000).then((pts_content) => {
          that.sendPTSToEndpoint(urls[0]['url'], pts_content).then((ptu_content) => {
            let ptu_file_name = that.generatePTUFilePath()
            that.savePTUToFile(ptu_file_name, ptu_content, 10000).then(() => {
              sdlController.onReceivedPolicyUpdate(ptu_file_name)
              resolve()
            })
          }, ptu_failed_callback)
        }, ptu_failed_callback)
      });
    }

}

let controller = new VehicleModemController()
export default controller
