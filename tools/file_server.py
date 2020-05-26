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

from http.server import SimpleHTTPRequestHandler
import socketserver
import os
import sys

class FileServer():
  def __init__(self, _host, _port, _secret_key):
    self.HOST = _host
    self.PORT = _port
    self.SECRET_KEY = _secret_key
    self.tcp_server = None

  def start(self):
    socketserver.TCPServer.allow_reuse_address = True
    try:
      self.tcp_server = socketserver.TCPServer((self.HOST, self.PORT), self.getRequestHandler(self.SECRET_KEY))
      self.tcp_server.serve_forever()
      self.stop()
    except KeyboardInterrupt:
      pass
    except Exception as e:
      print('Failed to open file server at port %s' % self.PORT)
      print(e)
      self.tcp_server = None

  def stop(self):
    if self.tcp_server is not None:
      self.tcp_server.server_close()


  @staticmethod
  def getRequestHandler(_secret_key):
    class Handler(SimpleHTTPRequestHandler):
      def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
        
      def do_GET(self):
        path_parts = self.path.split('/')
        key = path_parts[1]
        file_path = '/'.join(path_parts[2:])  
        print('key is %s, path is %s' % (key, file_path))
        if key != _secret_key:
          super().send_error(403, "Using invalid key %s" % key)
          return
        if os.path.isdir(file_path):
          super().send_error(403, "Cannot list directories")
          return

        self.path = '/%s' % file_path
        super().do_GET()

    return Handler

if __name__ == '__main__':
  host = str(sys.argv[1])
  port = int(sys.argv[2])
  secret_key = str(sys.argv[3])

  fs = FileServer(host, port, secret_key)
  fs.start()
