import { ProjectsBundle } from 'gitlab/dist/es5';

export default new ProjectsBundle({
  url: window.GITLAB_URL,
  token: window.GITLAB_TOKEN
});
