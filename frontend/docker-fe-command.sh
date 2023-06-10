#!/bin/bash

if [ -d "node_modules" ]; then
  echo "node_modules directory exists. Skipping npm install."
  echo "If your dependencies have changed, please remove node_modules folder and run the container"
else
  echo "node_modules directory not found. Running npm install."
  npm install

  echo "setting permissions..."
  chown -R node /usr/src/app
#  doesn't work, but leaving it here for future reference, leaving these lines also make the app load faster
#  chown root /usr/src/app/node_modules/electron/dist/chrome-sandbox
#  chmod 4755 /usr/src/app/node_modules/electron/dist/chrome-sandbox
fi


echo "starting app..."
# doesn't work, but leaving it here for future reference
#su - node -c "export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0"
su - node -c "cd /usr/src/app/ && npm start"
