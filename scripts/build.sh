#!/bin/bash
ORIGIN_DIR=`pwd`
APP_DIR=`pwd`
ENV=$1
CONFIG="prod.env"
if [ -z $ENV ]; then
    ENV='development'
fi

if [ ${ENV} == 'dev' ]; then 
    ENV='development'
fi

if [ ${ENV} == 'development' ]; then 
    BUILD_OPTS=""
    CONFIG="dev.env"
elif [ ${ENV} == 'staging' ]; then
    # We will always build for production if we're not in dev mode
    ENV="staging"
    BUILD_OPTS=""
else
    # We will always build for production if we're not in dev mode
    ENV="production"
    BUILD_OPTS="--production"
fi

echo -e "App: Building in environment: ${ENV}"
echo -e "App: Changing to ${APP_DIR}"
cd ${APP_DIR}

echo -e "App: Installing node modules"
npm install

echo -e "App: Building assets"
#echo -e "App: Copying config from ${ENV}"
#cp client/config/${CONFIG}.js client/config/config.js
echo -e "App: Build command: NODE_ENV=${ENV} npm run build ${BUILD_OPTS}"
export NODE_ENV=${ENV}
npm run build ${BUILD_OPTS} ${ENV}

echo -e "App: Done"