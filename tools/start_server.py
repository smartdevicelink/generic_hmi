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
import os
import requests
from zipfile import ZipFile
import subprocess
import uuid
import time

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
      print('\033[1;2mClient %s connected\033[0m' % str(_websocket.remote_address))
      rpc_service = self.service_class(_websocket, _path)
  
      async for message in _websocket:
        await rpc_service.on_receive(message)
  
  class SampleRPCService():
    def __init__(self, _websocket, _path):
      print('\033[1;2mCreated RPC service\033[0m')
      self.websocket = _websocket
      self.path = _path
    
    async def on_receive(self, _msg):
      print('\033[1;2mMessage received: %s\033[0m' % _msg)

class RPCService(WSServer.SampleRPCService):
  def __init__(self, _websocket, _path):
    super().__init__(_websocket, _path)
    self.webengine_manager = WebEngineManager()
    self.rpc_mapping = {
      "GetPTSFileContent": self.handle_get_pts_file_content,
      "SavePTUToFile": self.handle_save_ptu_to_file,
      "InstallApp": self.webengine_manager.handle_install_app,
      "GetInstalledApps": self.webengine_manager.handle_get_installed_apps,
      "UninstallApp": self.webengine_manager.handle_uninstall_app,
    }

  async def send(self, _msg):
    print('\033[1;2m***Sending message: %s\033[0m' % _msg)
    await self.websocket.send(_msg)
  
  async def send_error(self, _error_msg):
    err = self.gen_error_msg(_error_msg)
    print(json.dumps(err))
    await self.send(json.dumps(err))

  async def on_receive(self, _msg):
    print('\033[1;2m***Message received: %s\033[0m' % _msg)
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
    response_message['method'] = request_message['method']

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

    # Validate file path
    def isFileNameValid(_file_name):
      path = os.path.abspath(os.path.normpath(_file_name))      
      if os.path.commonpath([path, os.getcwd()]) != os.getcwd(): # Trying to save outside the working directory
        return False
      return True
    
    if not isFileNameValid(file_name):
      return self.gen_error_msg('Invalid file name: %s. Cannot save PTU' % file_name)
    
    try:
      json_file = open(file_name, 'w')
      json.dump(content, json_file)
    except:
      return self.gen_error_msg('Failed to save PTU file %s' % file_name)

    return {
      "success": True
    }

  @staticmethod
  def gen_error_msg(_error_msg):
    return {'success': False, 'info': _error_msg}

class WebEngineManager():
  next_available_port = 4000
  webengine_apps = {}
  def __init__(self):
    self.storage_folder = os.path.join(os.getcwd(), 'webengine')
    if not os.path.isdir(self.storage_folder):
      print('\033[1mCreating apps storage folder\033[0m')
      os.mkdir(self.storage_folder)
    
    self.apps = {}

  def handle_install_app(self, _method_name, _params):
    if 'policyAppID' not in _params:
      return RPCService.gen_error_msg('Missing manadatory param \'policyAppID\'')
    if 'packageUrl' not in _params:
      return RPCService.gen_error_msg('Missing manadatory param \'packageUrl\'')
    
    resp = self.install_app(_params['policyAppID'], _params['packageUrl'])
    return resp

  def install_app(self, _app_id, _package_url):
    # Create app directory
    print('\033[1mCreating folder for app %s\033[0m' % _app_id)
    app_storage_folder = os.path.join(self.storage_folder, _app_id)
    if os.path.isdir(app_storage_folder):
      print('\033[1;31mFolder already exists. returning\033[0m')
      return RPCService.gen_error_msg('App with id %s is already installed' % _app_id)
    os.mkdir(app_storage_folder)

    # Download app zip
    print('\033[1mDownloading zip\033[0m')
    r = requests.get(_package_url)
    if r.status_code != 200:
      return RPCService.gen_error_msg('Failed to download app from %s. Response result code %s' % (_package_url, r.status_code) )

    app_zip_path = os.path.join(app_storage_folder, 'app.zip')
    with open(app_zip_path, 'wb') as fptr:
      fptr.write(r.content)

    # Unzip app.zip file
    print('\033[1mUnzipping file\033[0m')
    try:
      zip_ref = ZipFile(app_zip_path, 'r')
      zip_ref.extractall(path=app_storage_folder)
      os.remove(app_zip_path)
    except:
      return RPCService.gen_error_msg('Failed to unzip app')

    # Start file server
    print('\033[1mStarting File Server\033[0m')

    fs = self.start_app_file_server(app_storage_folder)
    WebEngineManager.webengine_apps[_app_id] = {
      "policyAppID": _app_id,
      "fileServerProcess": fs['process'],
      "fileServerURL": fs['url']
    }

    return {
      'success': True,
      'params': {
        'appUrl': fs['url']
      }
    }

  def start_app_file_server(self, _app_storage_folder):
    port = WebEngineManager.next_available_port
    secret_key = str(uuid.uuid4())
    print('\033[2mPort is %s, secret key is %s\033[0m' % (port, secret_key))

    process = subprocess.Popen(['python3', '../../tools/file_server.py', str(port), secret_key], cwd=_app_storage_folder)
    time.sleep(1)

    WebEngineManager.next_available_port += 1
    return {'process': process, 'url': 'http://localhost:%s/%s/' % (port, secret_key)}

  def handle_get_installed_apps(self, _method_name, _params):
    resp = self.get_installed_apps()
    return resp

  def get_installed_apps(self):
    apps_info = []
    app_dirs = [d for d in os.listdir(self.storage_folder) if os.path.isdir(os.path.join(self.storage_folder, d))]
    for app_id in app_dirs:
      if app_id not in WebEngineManager.webengine_apps:
        print('\033[1mStarting file server for app %s\033[0m' % app_id)
        app_storage_folder = os.path.join(self.storage_folder, app_id)
        fs = self.start_app_file_server(app_storage_folder)
        WebEngineManager.webengine_apps[app_id] = {
          "policyAppID": app_id,
          "fileServerProcess": fs['process'],
          "fileServerURL": fs['url']
        }
      apps_info.append({"policyAppID": app_id, "appUrl": WebEngineManager.webengine_apps[app_id]['fileServerURL']})
    
    return {
      "success": True,
      "params":{
        "apps": apps_info
      }
    }

  def handle_uninstall_app(self, _method_name, _params):
    if 'policyAppID' not in _params:
      return RPCService.gen_error_msg('Missing manadatory param \'policyAppID\'')

    resp = self.uninstall_app(_params['policyAppID'])
    return resp

  def uninstall_app(self, _app_id):
    app_storage_folder = os.path.join(self.storage_folder, _app_id)
    if not os.path.isdir(app_storage_folder):
      print('\033[1;31mApp %s is not installed\033[0m' % _app_id)
      return RPCService.gen_error_msg('App \'%s\' is not installed' % _app_id)

    if _app_id in WebEngineManager.webengine_apps:
      WebEngineManager.webengine_apps[_app_id]['fileServerProcess'].terminate()
      removed_app = WebEngineManager.webengine_apps.pop(_app_id)
      print('\033[1mRemoving webengine app %s\033[0m' % str(removed_app))

    print('\033[1mRemoving app storage folder\033[0m')
    subprocess.call(['rm', '-rf', app_storage_folder])

    return {
      "success": True,
      "params":{
        "policyAppID": _app_id
      }
    }
    
def main():
  backend_server = WSServer('localhost', 8081, RPCService)

  print('Starting server')
  backend_server.start_server()
  print('Stopping server')

if __name__ == '__main__':
  main()
