FROM node:argon
MAINTAINER christoph@armstrongconsulting.net

RUN npm install node-inspector -g

EXPOSE 8080

CMD [ "node-inspector", "--save-live-edit", "--web-host pinakarri-app"]
