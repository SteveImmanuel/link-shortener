FROM node:latest

RUN mkdir -p /server-main

COPY . /server-main

WORKDIR /server-main
RUN npm install

EXPOSE 8080/tcp