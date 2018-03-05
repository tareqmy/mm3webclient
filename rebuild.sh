source .env

docker rm -f ${CLIENT_APP}

sh image.sh

docker-compose up -d