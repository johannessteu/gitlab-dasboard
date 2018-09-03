This project is a small (hacky) react js app. It can be used to as a simple gitlab dashboard to track open merge requests. It is build with https://github.com/jdalrymple/node-gitlab

## Start the dashboard

This project is shipped as a docker container. To start just run:

`docker run -p 8088:80 -e GITLAB_URL="https://your_gitlab_url" -e GITLAB_TOKEN="your_access_token" quay.io/johannessteu/gitlab-dashboard`
