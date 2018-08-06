FROM node:8.11.3-jessie

# Create app directory
#WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package.json /app

#RUN apt-get update
#RUN apt-get install -y build-essential libssl-dev
#RUN npm install node-gyp
#RUN npm install web3
#RUN chmod -R 777 node_modu


#RUN git config --global url."https://github.com/".insteadOf git@github.com; 
# RUN   git config --global url."https://github.com/".insteadOf git://github.com; 
# RUN   git config --global http.sslVerify false; 


    
RUN mkdir /opt/api
COPY . /opt/api
WORKDIR /opt/api

RUN apt-get dist-upgrade
RUN apt-get update
RUN npm config set always-auth true;
RUN apt-get install -y build-essential libssl-dev
RUN apt-get install libstdc++6
RUN npm install node-gyp
run npm install web3 
# If you are building your code for production
# RUN npm install --only=production


EXPOSE 6000
CMD [ "index.js" ]
ENTRYPOINT ["node"]
