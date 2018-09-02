import { ProjectsBundle } from 'gitlab/dist/es5';

export default new ProjectsBundle({
  url: process.env.GITLAB_URL,
  token: process.env.PERSONAL_ACCESS_TOKEN
});
