FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


run  add-apt-repository ppa:ubuntu-toolchain-r/test
run  apt-get update
run  apt-get install gcc-4.9
run  apt-get upgrade libstdc++6
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 6000
CMD [ "node", "index.js" ]
