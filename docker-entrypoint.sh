#!/bin/sh
set -e

sed -i 's@__GITLAB_URL__@'"$GITLAB_URL"'@g' /usr/share/nginx/html/index.html
sed -i 's@__GITLAB_TOKEN__@'"$GITLAB_TOKEN"'@g' /usr/share/nginx/html/index.html

echo "daemon off;" >> /etc/nginx/nginx.conf

exec "$@"