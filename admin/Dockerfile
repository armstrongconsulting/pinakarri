FROM node:argon
MAINTAINER christoph@armstrongconsulting.net

RUN npm install mongo-express -g

EXPOSE 8081

CMD mongo-express -u user -p password -d database
