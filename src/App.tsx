import React, { useState, useEffect, useContext } from 'react';
import projectServices from './helper/projectServices';
import keyby from 'lodash.keyby';
import GitlabContext from './Context/GitlabContext';
import useOpenMergeRequests from './hooks/useOpenMergeRequests';
import { ThemeProvider } from './Theme/styled-components';
import theme from './Theme';
import { ApplicationWrapper, LoadingScreen } from './Ui';
import MergeRequest from './Components/MergeRequest';

import { ProjectInterface } from './Interfaces';
import { Dictionary } from 'lodash';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Dictionary<ProjectInterface>>({});
  const [mergeRequests] = useOpenMergeRequests({ timeout: 10000 });

  useEffect(() => {
    async function fetchProjects() {
      const projects: ProjectInterface[] = await projectServices.Projects.all({ perPage: 50, maxPages: 2, withMergeRequestsEnabled: true, orderBy: 'last_activity_at' });
      const sortedProjects = keyby(projects, function(o) {
        return o.id;
      });

      setProjects(sortedProjects);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <GitlabContext.Provider value={{ projects }}>
      <ThemeProvider theme={theme}>
        <ApplicationWrapper>
          {mergeRequests.map(mr => {
            return <MergeRequest key={mr.iid.toString() + '-' + mr.updated_at.toString()} {...mr} />;
          })}
        </ApplicationWrapper>
      </ThemeProvider>
    </GitlabContext.Provider>
  );
};

export default App;
