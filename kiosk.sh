#!/bin/bash
#Start sdl in fullscreen
sudo -u pi epiphany-browser -a -i --profile ~/.config index.html --display=:0 &
sleep 6s;
xte "key F11" -x:0
