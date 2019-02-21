import { ProjectsBundle } from 'gitlab';

const services = new ProjectsBundle({
  // url: window.GITLAB_URL,
  url: 'https://gitlab.yeebase.com/',
  // token: window.GITLAB_TOKEN
  token: 'DXFyMk7UkuKi9sVpBvmQ'
});

export default services;
