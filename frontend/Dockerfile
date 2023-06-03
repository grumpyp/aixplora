FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install python -y

COPY package.json ./
# todo: copy ebj first then the rest
COPY . .

RUN npm install
RUN npm run anotherinstall

EXPOSE 1212

CMD [ "npm", "start" ]
