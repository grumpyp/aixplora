FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install python -y

COPY package.json ./
# todo: copy ebj first then the rest
COPY . .
RUN cat package.json

RUN npm install
RUN ls node_modules/@mui/types
RUN npm run anotherinstall
RUN ls -a

EXPOSE 1212

CMD [ "npm", "start" ]
