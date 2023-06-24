FROM node:18

WORKDIR /usr/src/app

# Install necessary build dependencies
RUN apt-get update && apt-get install -y build-essential

# install electron dependencies
RUN apt-get update && apt-get install \
    git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libgbm-dev \
    -yq --no-install-suggests --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 1212

CMD [ "bash" ]
