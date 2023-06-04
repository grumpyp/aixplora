FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
# can merge the below two commands
RUN apt-get update && apt-get install -y build-essential python

# install electron dependencies
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y libgbm-dev

COPY . .

EXPOSE 1212

CMD [ "bash" ]
