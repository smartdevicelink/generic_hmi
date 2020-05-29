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
import sys
import socketserver
from http.server import SimpleHTTPRequestHandler
import threading

class Flags():
  """Used to define global properties"""
  FILE_SERVER_HOST = '127.0.0.1'
  FILE_SERVER_PORT = 4000
  FILE_SERVER_REMOTE_HOST = '127.0.0.1'
  FILE_SERVER_REMOTE_PORT = 4000

class WebengineFileServer():
  """Used to handle routing file server requests for webengine apps.
  
  Routes are added/removed via the add_app_mapping/remove_app_mapping functions
  """
  def __init__(self, _host, _port, _remote_host=None, _remote_port=None):
    self.HOST = _host
    self.PORT = _port
    self.REMOTE_HOST = _remote_host if _remote_host is not None else _host
    self.REMOTE_PORT = _remote_port if _remote_port is not None else _port

    self.tcp_server = None
    self.app_dir_mapping = {}

  def start(self):
    socketserver.TCPServer.allow_reuse_address = True
    try:
      self.tcp_server = socketserver.TCPServer((self.HOST, self.PORT), self.getRequestHandler(self.app_dir_mapping))
      self.tcp_server.serve_forever()
      self.stop()
    except KeyboardInterrupt:
      pass
    except Exception as e:
      print('Failed to open file server at port %s' % self.PORT)
      print(e)
      self.tcp_server = None

  def stop(self, sig=None, frame=None):
    if self.tcp_server is not None:
      self.tcp_server.shutdown()
      self.tcp_server.server_close()

  def add_app_mapping(self, _secret_key, _app_dir):
      self.app_dir_mapping[_secret_key] = _app_dir

  def remove_app_mapping(self, _secret_key):
      self.app_dir_mapping.pop(_secret_key)

  @staticmethod
  def getRequestHandler(app_dir_mapping):
    class Handler(SimpleHTTPRequestHandler):
      def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
        
      def do_GET(self):
        path_parts = self.path.split('/')
        key = path_parts[1]
        file_path = '/'.join(path_parts[2:])  

        # Check if the secret key is valid 
        if key not in app_dir_mapping:
          super().send_error(403, "Using invalid key %s" % key)
          return

        # Get path relative to current working directory
        app_dir_path = app_dir_mapping[key].lstrip(os.path.commonpath([app_dir_mapping[key], os.getcwd()]))

        # Check if requested path is a directory
        if os.path.isdir(os.path.join(os.getcwd(), app_dir_path, file_path)):
          super().send_error(403, "Cannot list directories")
          return

        self.path = '/%s/%s' % (app_dir_path, file_path)
        super().do_GET()

    return Handler

class WSServer():
  """Used to create a Websocket Connection with the HMI.
  
  Has a SampleRPCService class to handle incoming and outgoing messages.
  """
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
  """Used to handle receiving RPC requests and send RPC responses.
  
  An implementation of the SampleRPCService class. RPC requests are handled in the `handle_*` functions.
  """
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
  """Used to specifically handle WebEngine RPCs.

  All the `handle_*` functions parse the RPC requests and the non `handle_*` functions implement 
  the actual webengine operations(downloading the app zip, creating directories, etc.).
  """
  def __init__(self):
    self.storage_folder = os.path.join(os.getcwd(), 'webengine')
    if not os.path.isdir(self.storage_folder):
      print('\033[1mCreating apps storage folder\033[0m')
      os.mkdir(self.storage_folder)

    self.webengine_apps = {}

    self.file_server = WebengineFileServer(Flags.FILE_SERVER_HOST, Flags.FILE_SERVER_PORT, Flags.FILE_SERVER_REMOTE_HOST, Flags.FILE_SERVER_REMOTE_PORT)
    thd = threading.Thread(target=self.file_server.start)
    thd.start()
    signal.signal(signal.SIGINT, self.file_server.stop)

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
    print('\033[1mAdding app to File Server\033[0m')
    file_server_info = self.add_app_to_file_server(app_storage_folder)
    self.webengine_apps[_app_id] = {
      "policyAppID": _app_id,
      "appURL": file_server_info['url'],
      "appKey": file_server_info['key']
    }

    return {
      "success": True,
      "params": {
        "appUrl": file_server_info['url']
      }
    }

  def add_app_to_file_server(self, _app_storage_folder):
    secret_key = str(uuid.uuid4())
    print('\033[2mSecret key is %s\033[0m' % (secret_key))
    self.file_server.add_app_mapping(secret_key, _app_storage_folder)
    return {
      "key": secret_key, 
      "url": 'http://%s:%s/%s/' % (self.file_server.REMOTE_HOST, self.file_server.REMOTE_PORT, secret_key)
    }

  def handle_get_installed_apps(self, _method_name, _params):
    resp = self.get_installed_apps()
    return resp

  def get_installed_apps(self):
    apps_info = []
    app_dirs = [d for d in os.listdir(self.storage_folder) if os.path.isdir(os.path.join(self.storage_folder, d))]
    for app_id in app_dirs:
      if app_id not in self.webengine_apps:
        print('\033[1mAdding app %s to file server\033[0m' % app_id)
        app_storage_folder = os.path.join(self.storage_folder, app_id)
        file_server_info = self.add_app_to_file_server(app_storage_folder)
        self.webengine_apps[app_id] = {
          "policyAppID": app_id,
          "appURL": file_server_info['url'],
          "appKey": file_server_info['key']
        }
      apps_info.append({
        "policyAppID": app_id, 
        "appUrl": self.webengine_apps[app_id]['appURL']
      })
    
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

    if _app_id in self.webengine_apps:
      self.file_server.remove_app_mapping(self.webengine_apps[_app_id]['appKey'])
      removed_app = self.webengine_apps.pop(_app_id)
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

  if len(sys.argv) < 3:
    print('\033[31;01mMissing required arguments: hostname and port\033[0m')
    sys.exit(1)

  host = str(sys.argv[1])
  port = int(sys.argv[2])

  Flags.FILE_SERVER_HOST = host
  Flags.FILE_SERVER_PORT = int(sys.argv[3]) if (len(sys.argv) > 3 and int(sys.argv[3]) != 0) else 4000
  Flags.FILE_SERVER_REMOTE_HOST = str(sys.argv[4]) if len(sys.argv) > 4 else host
  Flags.FILE_SERVER_REMOTE_PORT = int(sys.argv[5]) if (len(sys.argv) > 5 and int(sys.argv[5]) != 0) else Flags.FILE_SERVER_PORT

  backend_server = WSServer(host, port, RPCService)

  print('Starting server')
  backend_server.start_server()
  print('Stopping server')


if __name__ == '__main__':
  main()
