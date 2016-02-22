FROM node:argon
MAINTAINER christoph@armstrongconsulting.net

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY src/package.json /usr/src/app/
RUN npm install

COPY src /usr/src/app
EXPOSE 8080

CMD [ "npm", "start", "mongodb://db:27017/pinakarri" ]
