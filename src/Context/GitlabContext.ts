import React from 'react';

import { ProjectInterface } from '../Interfaces';
import { Dictionary } from 'lodash';

interface GitlabContextInterface {
  projects: Dictionary<ProjectInterface>;
}

const GitlabContext = React.createContext<GitlabContextInterface>({ projects: {} });

export default GitlabContext;
