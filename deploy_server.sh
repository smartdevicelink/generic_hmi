#!/bin/bash

# Copyright (c) 2020 Ford Motor Company,
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# * Redistributions of source code must retain the above copyright notice, this
#   list of conditions and the following disclaimer.
#
# * Redistributions in binary form must reproduce the above copyright notice,
#   this list of conditions and the following disclaimer in the documentation
#   and/or other materials provided with the distribution.
#
# * Neither the name of Ford Motor Company nor the names of its
#   contributors may be used to endorse or promote products derived from
#   this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

TARGET_SCRIPT="start_server.py"
TARGET_DIR="./python_websocket/src"
SOURCE_DIR="./tools"

SwitchSubmoduleVersion(){
    version=$1
    if [ -z "$version" ]; then
        echo "Version number required"
        return
    fi

    cwd=$(pwd)
    cd ${TARGET_DIR}
    if [[ -z $(git branch --list "v$version") ]]; then # Version branch does not exist
        git checkout tags/$version -b v$version > /dev/null
        echo "Using websockets version $version"
    elif [[ "$(git rev-parse --abbrev-ref HEAD)" != "v$version" ]]; then # Not on version branch
        git checkout v$version
    fi
    cd $cwd
}

InitSubmodules() {
    git submodule init
    git submodule update
}

StartServer() {
    cp ${SOURCE_DIR}/${TARGET_SCRIPT} ${TARGET_DIR}
    python3 ${TARGET_DIR}/${TARGET_SCRIPT} --host 127.0.0.1 --ws-port 8081
    rm ${TARGET_DIR}/${TARGET_SCRIPT}
}

if ! find $TARGET_DIR -mindepth 1 | read; then
    echo "Fetching HMI dependencies..."
    InitSubmodules
fi

python_version=$(python3 -V | awk '{print $2}')
if [[ $? == 0 && "$python_version" < "3.6.0" ]]; then
    SwitchSubmoduleVersion "7.0"
fi

echo "Starting HMI Backend service..."
StartServer
echo "HMI Backend service was stopped"

