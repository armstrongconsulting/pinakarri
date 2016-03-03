FROM node:argon
MAINTAINER christoph@armstrongconsulting.net

VOLUME /usr/src/app

WORKDIR /usr/src/app

COPY src/package.json /usr/src/app/
RUN npm install

RUN npm install nodemon -g
RUN npm install node-inspector -g

COPY src /usr/src/app

RUN chmod +x /usr/src/app/start.sh

EXPOSE 8080

CMD [ "./start.sh", "mongodb://db:27017/pinakarri" ]
