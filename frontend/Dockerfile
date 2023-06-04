FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
# can merge the below two commands
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install python -y

# install electron dependencies
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y libgbm-dev

#COPY package.json ./
# todo: copy only the .ebj first then the rest later?
COPY . .

#RUN chown -R node /usr/src/app
#USER node

# can probably skip this since we're installing packages in docker-compose.yml
# RUN npm install

EXPOSE 1212

#USER node

CMD [ "npm", "start" ]
