FROM node:0.10

RUN mkdir -p /usr/src/app

ADD . /usr/src/app

RUN cd /usr/src/app && npm install

ENV SHELL /bin/bash

ENTRYPOINT ["node", "/usr/src/app/index.js"]

CMD []
