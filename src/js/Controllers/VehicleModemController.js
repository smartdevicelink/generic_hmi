import sdlController from './SDLController';
import SimpleRPCClient from '../SimpleRPCClient'

class VehicleModemController {
    constructor() {
      this.PTUClient = null
    }

    connectPTUManager(ptuBackendUrl) {
      this.PTUClient = new SimpleRPCClient(ptuBackendUrl)
      return this.PTUClient.connect()
    }

    downloadPTSFromFile(file_name, timeout){
      var that = this;

      return new Promise((resolve, reject) => {
        let pts_receive_timer = setTimeout(() => {
          console.error('PTU: Timeout for downloading PTS expired')
          that.PTUClient.unsubscribeFromEvent('GetPTSFileContent')
          reject();
        }, timeout);

        let pts_received_callback = function(success, params){
          clearTimeout(pts_receive_timer)
          that.PTUClient.unsubscribeFromEvent('GetPTSFileContent')
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

        that.PTUClient.subscribeToEvent('GetPTSFileContent', pts_received_callback)
        that.PTUClient.sendJSONMessage(request)
      });
    }

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

    savePTUToFile(file_name, ptu_data, timeout){
      var that = this;
      return new Promise((resolve, reject) => {
        let ptu_save_timer = setTimeout(() => {
          console.error('PTU: Timeout for saving PTU expired')
          that.PTUClient.unsubscribeFromEvent('SavePTUToFile')
          reject();
        }, timeout);

        let ptu_saved_callback = (success, params) => {
          clearTimeout(ptu_save_timer);
          that.PTUClient.unsubscribeFromEvent('SavePTUToFile')
          
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

        that.PTUClient.subscribeToEvent('SavePTUToFile', ptu_saved_callback);
        that.PTUClient.sendJSONMessage(request)
      })
    }

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

    requestPTUFromEndpoint(pts_file_name, url){
      var that = this;
      return new Promise((resolve, reject) => {
        let ptu_failed_callback = function(){
          that.PTUClient.disconnect()
          
          //Return to regular PT flow
          reject()
        };

        that.downloadPTSFromFile(pts_file_name, 10000).then((pts_content) => {
          that.sendPTSToEndpoint(url, pts_content).then((ptu_content) => {
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
