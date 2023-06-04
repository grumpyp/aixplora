echo "installing packages..."
npm install

echo "setting permissions..."
chown -R node /usr/src/app
chown root /usr/src/app/node_modules/electron/dist/chrome-sandbox
chmod 4755 /usr/src/app/node_modules/electron/dist/chrome-sandbox

echo "starting app..."
ls -ltrs
su - node -c "cd /usr/src/app/ && npm start"
