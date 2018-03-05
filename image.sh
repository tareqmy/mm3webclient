source .env

docker build -t ${CLIENT_APP}:latest .
imageid=$(docker images ${CLIENT_APP} | grep '<none>' | tail -n 1 | awk -F ' ' '{print $3}')
docker rmi $imageid