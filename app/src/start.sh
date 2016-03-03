#!/bin/bash

if [ -z ${DEBUG+x} ]; then
  node server.js "$@"
else
  node-inspector --save-live-edit --web-port 8888 &
  nodemon -L --debug server.js "$@"
fi
