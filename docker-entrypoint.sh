#!/bin/sh
set -e

if [ "$1" = 'gitlab-dashboard' ]; then
    sed 's/__GITLAB_URL__/$GITLAB_URL/g' /usr/share/nginx/html/index.html
    sed 's/__GITLAB_TOKENL__/$PERSONAL_ACCESS_TOKEN/g' /usr/share/nginx/html/index.html

    exec "nginx -g daemon off"
fi