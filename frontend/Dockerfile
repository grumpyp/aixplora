FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install python -y

COPY package.json ./
# todo: copy only the .ebj first then the rest later?
COPY . .

# can probably skip these lines if we install in docker-compose command
# RUN npm install
# RUN npm install ts-node@10.9.1 --global

EXPOSE 1212

CMD [ "npm", "start" ]
