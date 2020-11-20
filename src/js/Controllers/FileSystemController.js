import SimpleRPCClient from '../SimpleRPCClient'

class FileSystemController extends SimpleRPCClient {
    connect(url) {
      return super.connect(url);
    }

    onDisconnect(func){
      this.socket.onclose = func;
    }

    downloadPTSFromFile(file_name, timeout){
      var that = this;

      return new Promise((resolve, reject) => {
        let pts_receive_timer = setTimeout(() => {
          console.error('PTU: Timeout for downloading PTS expired')
          that.unsubscribeFromEvent('GetPTSFileContent')
          reject();
        }, timeout);

        let pts_received_callback = function(success, params){
          clearTimeout(pts_receive_timer)
          that.unsubscribeFromEvent('GetPTSFileContent')
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

        that.subscribeToEvent('GetPTSFileContent', pts_received_callback)
        that.sendJSONMessage(request)
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
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(pts_data)
      });
    }

    savePTUToFile(file_name, ptu_data, timeout){
      var that = this;
      return new Promise((resolve, reject) => {
        return resolve();

        let ptu_save_timer = setTimeout(() => {
          console.error('PTU: Timeout for saving PTU expired')
          that.unsubscribeFromEvent('SavePTUToFile')
          reject();
        }, timeout);

        let ptu_saved_callback = (success, params) => {
          clearTimeout(ptu_save_timer);
          that.unsubscribeFromEvent('SavePTUToFile')
          
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

        that.subscribeToEvent('SavePTUToFile', ptu_saved_callback);
        that.sendJSONMessage(request)
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
          that.disconnect()
          
          //Return to regular PT flow
          reject()
        };

        that.downloadPTSFromFile(pts_file_name, 10000).then((pts_content) => {
          that.sendPTSToEndpoint(url, pts_content).then((ptu_content) => {
            let ptu_file_name = that.generatePTUFilePath()
            console.log("whats this?");
            console.log(ptu_file_name);

            that.savePTUToFile(ptu_file_name, ptu_content, 10000).then(() => {
              resolve(ptu_file_name)
            })
          }, ptu_failed_callback)
        }, ptu_failed_callback)
      });
    }

    parseWebEngineAppManifest(app_url){
      return new Promise((resolve, reject) => {

        fetch(app_url + 'manifest.js')
        .then(x => x.text())
        .then((manifestJS) => {
          let jsonStart = manifestJS.indexOf('{');
          let jsonEnd = manifestJS.lastIndexOf('}') + 1;

          try {
            let manifest = JSON.parse(manifestJS.substring(jsonStart, jsonEnd));
            resolve(manifest);
          } catch (e) {
            console.error('Failed to parse manifest as JSON: ', e);
            reject();
          }

        }).catch((e) => {
          console.error('Failed to get the contents of the manifest JS File', e);
          reject();
        });
      
      });
    }
}

let controller = new FileSystemController()
export default controller
