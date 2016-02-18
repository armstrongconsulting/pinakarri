FROM node:argon
MAINTAINER christoph@armstrongconsulting.net

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY node/package.json /usr/src/app/
RUN npm install

RUN npm install -g nodemon

COPY node /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]


