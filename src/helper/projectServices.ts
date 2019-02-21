import { ProjectsBundle } from 'gitlab';

const services = new ProjectsBundle({
  url: window.GITLAB_URL,
  token: window.GITLAB_TOKEN
});

export default services;
