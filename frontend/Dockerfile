FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
# can merge the below two commands
RUN apt-get update && apt-get install -y build-essential python

# install electron dependencies
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libgbm-dev \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .
RUN chown -R node /usr/src/app

USER node
RUN npm install

# Electron needs root for sand boxing
# see https://github.com/electron/electron/issues/17972
USER root
RUN chown root /usr/src/app/node_modules/electron/dist/chrome-sandbox
RUN chmod 4755 /usr/src/app/node_modules/electron/dist/chrome-sandbox

EXPOSE 1212

USER node
# install packages if node_modules folder is not available
CMD \[ -d "node_modules" \] && npm run start || npm install && npm run start
