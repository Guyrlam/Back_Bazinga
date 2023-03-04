#database
docker run \
    --name mongodb \
    -p 27000:27017 \
    -d \
    mongo:6
#backend
docker volume create --name nodemodules

docker build -t backend-bazinga ./backend

docker run \
    --name backend-bazinga \
    --link mongodb \
    -e URL_MONGO=mongodb \
    -e PORT=4000 \
    -p 4000:4000 \
    -v `pwd`/backend:/src \
    -v nodemodules:/src/node_modules \
    backend-bazinga npm run dev

docker rm backend-bazinga
docker volume rm nodemodules
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

docker-compose up --build
docker-compose down