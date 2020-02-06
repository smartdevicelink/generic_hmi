#  Copyright (c) 2020, Ford Motor Company, Livio
#  All rights reserved.

#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that the following conditions are met:

#  Redistributions of source code must retain the above copyright notice, this
#  list of conditions and the following disclaimer.

#  Redistributions in binary form must reproduce the above copyright notice,
#  this list of conditions and the following
#  disclaimer in the documentation and/or other materials provided with the
#  distribution.

#  Neither the name of the the copyright holders nor the names of their
#  contributors may be used to endorse or promote products derived from this
#  software without specific prior written permission.

#  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
#  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
#  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
#  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
#  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
#  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
#  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
#  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
#  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
#  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
#  POSSIBILITY OF SUCH DAMAGE.

import asyncio
import signal
import websockets
import json

class WSServer():
  def __init__(self, _host, _port, _service_class=None):
    self.HOST = _host
    self.PORT = _port
    self.service_class = _service_class if _service_class != None else WSServer.SampleRPCService
    
  async def serve(self, _stop_func):
    async with websockets.serve(self.on_connect, self.HOST, self.PORT):
      await _stop_func      

  def start_server(self):
    loop = asyncio.get_event_loop()

    # The stop condition is set when receiving SIGTERM or SIGINT.
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    loop.add_signal_handler(signal.SIGINT, stop.set_result, None)

    # Run the server until the stop condition is met.
    loop.run_until_complete(self.serve(stop))

  async def on_connect(self, _websocket, _path):
      print('Client connected')
      rpc_service = self.service_class(_websocket, _path)
  
      async for message in _websocket:
        await rpc_service.on_receive(message)
  
  class SampleRPCService():
    def __init__(self, _websocket, _path):
      print('Created RPC service')
      self.websocket = _websocket
      self.path = _path
    
    async def on_receive(self, _msg):
      print('Message received: %s' % _msg)


class RPCService(WSServer.SampleRPCService):
  def __init__(self, _websocket, _path):
    super().__init__(_websocket, _path)
    self.rpc_mapping = {
      "GetPTSFileContent": self.handle_get_pts_file_content,
      "SavePTUToFile": self.handle_save_ptu_to_file,
    }

  async def send(self, _msg):
    # print('***Sending message: %s' % _msg)
    await self.websocket.send(_msg)
  
  async def send_error(self, _error_msg):
    err = {'success': False, 'info': _error_msg}
    print(json.dumps(err))
    await self.send(json.dumps(err))

  async def on_receive(self, _msg):
    # print('***Message received: %s' % _msg)
    request_message = None

    try:
      request_message = json.loads(_msg)
    except ValueError as err:
      await self.send_error('Invalid JSON received: %s' % err)
      return

    if 'method' not in request_message:
      await self.send_error('Received message does not contain manadatory field \'method\'')
      return

    if 'params' not in request_message:
      await self.send_error('Received message does not contain manadatory field \'params\'')
      return

    response_message = self.handle_request(request_message['method'], request_message['params'])

    if response_message != None:
      await self.send(json.dumps(response_message))

  def handle_request(self, _method_name, _params):
    # print('***Handling RPC request: {"method": %s, "params": %s}' % (_method, _params))
    if _method_name not in self.rpc_mapping:
      return self.gen_error_msg('Method handler for %s was not found! Message ignored' % _method_name)

    return self.rpc_mapping[_method_name](_method_name, _params)

  def handle_get_pts_file_content(self, _method_name, _params):
    
    if 'fileName' not in _params:
      return self.gen_error_msg('Missing mandatory param \'fileName\'')

    file_name = _params["fileName"]
    file_content = None

    with open(file_name, 'r') as json_file:
      file_content = json.load(json_file)

    return {
      "method": _method_name,
      "success": True,
      "params":{
        "content": json.dumps(file_content)
      }
    }

  def handle_save_ptu_to_file(self, _method_name, _params):
    if 'fileName' not in _params:
      return self.gen_error_msg('Missing mandatory param \'fileName\'')
    if 'content' not in _params:
      return self.gen_error_msg('Missing mandatory param \'content\'')

    file_name = _params["fileName"]
    content = json.loads(_params["content"])


    with open(file_name, 'w') as json_file:
      json.dump(content, json_file)
    
    return {
      "method": _method_name,
      "success": True
    }

  @staticmethod
  def gen_error_msg(_error_msg):
    return {'success': False, 'info': _error_msg}

def main():
  backend_server = WSServer('localhost', 8081, RPCService)

  print('Starting server')
  backend_server.start_server()
  print('Stopping server')

if __name__ == '__main__':
  main()
