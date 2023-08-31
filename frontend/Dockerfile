FROM node:alpine

RUN apk update && apk add --no-cache bash

WORKDIR /home/node

ENV CI=true
ENV PORT=3000

#CMD [ "npm", "start" ]

EXPOSE 4200
EXPOSE 3000

ENV PS1="[frontend:\W]\$ "

CMD [ "bash" ]

#CMD [ "npm", "start" ]