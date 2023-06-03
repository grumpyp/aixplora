FROM node:18

WORKDIR /usr/src/app

# dones't work
# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install python -y

COPY package.json ./

# doesn't work
# RUN apk add g++ make py3-pip python3

# RUN apk add --no-cache make gcc g++ python && \
#   npm install --production --silent && \
#   apk del make gcc g++ python

# RUN apk add --no-cache --virtual .gyp python make g++ \
#     && npm install frontend \
#     && apk del .gyp

# RUN npm install node-sass

RUN cat package.json

RUN npm install
# RUN npm install frontend

COPY . .

CMD [ "cd", "frontend", "&&", "npm", "start" ]