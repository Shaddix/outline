#!/bin/bash

VERSION="v0.10"
BASE_IMAGE="shaddix/outline_base:${VERSION}"
docker build -t $BASE_IMAGE -f Dockerfile.base .
docker build -t "shaddix/outline:${VERSION}" --build-arg BASE_IMAGE=${BASE_IMAGE} .
docker push "shaddix/outline:${VERSION}"