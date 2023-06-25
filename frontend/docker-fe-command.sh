#!/bin/bash
RED='\033[0;31m'

# doing this way so that the node_modules are exposed to host for IDE completion
if [ "${install}" ]; then
	echo -e "${RED}installing packages... the first time might take some time";
	echo -e "${RED}after the initial package installation please use 'docker compose up' for faster loading";
	npm install;
  #echo "setting permissions..."
  #chown -R node /usr/src/app

  #  doesn't work, but leaving it here for future reference,
  #  leaving these lines also make the app load faster
  #  chown root /usr/src/app/node_modules/electron/dist/chrome-sandbox
  #  chmod 4755 /usr/src/app/node_modules/electron/dist/chrome-sandbox
else
  echo -e "${RED}skipping 'npm install'"
  echo -e "${RED}if you've added new packages in frontend, please run 'install=true docker compose up'"
fi

echo "starting app..."
# doesn't work, but leaving it here for future reference
#su - node -c "export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0"
#su - node -c "cd /usr/src/app/ && npm start"
npm start