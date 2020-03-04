export default class SimpleRPCClient{
  constructor(){
    this.backendUrl = null
    this.eventListenersMap = {}
    this.socket = null
    this.sendQueue = []
  }

  connect(url){
    if (url) {
      this.backendUrl = url;
    }

    return new Promise((resolve, reject) => {
      if(!this.backendUrl){
        reject();
        return
      }

      this.socket = new WebSocket(this.backendUrl)
      this.socket.onopen = (evt) => {
        resolve();
      }
      this.socket.onerror = (evt) => {
        console.log('Failed to connect to Simple RPC Client')
        reject();
      }
      this.socket.onclose = (evt) => {
        console.log("Closed Simple RPC Client connection")
      }
      this.socket.onmessage = (evt) => {
        let event = JSON.parse(evt.data)
        let event_name = event.method;
        if(event.success != undefined && event_name in this.eventListenersMap){
          let params = event.params ? event.params : {}
          this.eventListenersMap[event_name](event.success, params)
        }
      }
    });
  }

  disconnect(){
    if (this.socket){
      this.socket.close()
      this.socket = null
    }
  }

  sendJSONMessage(json_msg){
    let msg = JSON.stringify(json_msg)
    this.sendQueue.push(msg)
    this.triggerSend()
  }

  triggerSend(){
    var that = this;
    setTimeout(() => {that.onSend()}, 100)
  }

  onSend(){
    let msg = this.sendQueue.pop()
    if (this.isConnected()){
      this.socket.send(msg)
    }

    if (this.sendQueue.length > 0){
      this.triggerSend()
    }
  }

  subscribeToEvent(event_name, callback){
    this.eventListenersMap[event_name] = callback;
  }

  unsubscribeFromEvent(event_name){
    delete this.eventListenersMap[event_name]
  }

  isConnected(){
    return (this.socket && this.socket.readyState == WebSocket.OPEN);
  }

}
