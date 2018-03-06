#!/bin/sh

if [ ${APP_ENV} = production ]; then
	npm install -g http-server
	npm run build
	cd build
	hs -p 3000
else
	npm run start
fi