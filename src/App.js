import React, { PureComponent } from 'react';
import keyby from 'lodash.keyby';
import pick from 'lodash.pick';
import { ThemeProvider } from 'styled-components';
import ReactInterval from 'react-interval';

import 'reset-css/reset.css';

import GitlabContext from './Context/Gitlab';
import { ApplicationWrapper, LoadingScreen } from './Ui';
import theme from './Theme';

import { MergeRequest } from './Components';
import projectServices from './helper/projectServices';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      projects: [],
      mergeRequests: []
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  async fetchProjects() {
    let projects = await projectServices.Projects.all({ perPage: 50, maxPages: 2, withMergeRequestsEnabled: true, orderBy: 'last_activity_at' });
    const sortedProjects = keyby(projects, function(o) {
      return o.id;
    });
    this.setState({ projects: sortedProjects });
    this.fetchOpenMergeRequests();

    this.setState({ loading: false });
  }

  async fetchOpenMergeRequests() {
    let mergeRequests = await await projectServices.MergeRequests.all({ state: 'opened', scope: 'all', orderBy: 'updated_at', maxPages: 1, perPage: 30 });

    const filtered = mergeRequests.filter(request => {
      return request.merge_status === 'can_be_merged' && request.work_in_progress === false;
    });

    const parsedMergeRequests = filtered.map(mr =>
      Object.assign(
        {},
        pick(mr, ['iid', 'title', 'upvotes', 'avatar_url', 'updated_at', 'downvotes', 'merge_status', 'source_branch', 'target_branch', 'project_id', 'web_url', 'user_notes_count']),
        { assignee_avatar_url: mr.assignee ? mr.assignee.avatar_url : null },
        { author_avatar_url: mr.author.avatar_url }
      )
    );

    this.setState({ mergeRequests: parsedMergeRequests.slice(0, 9) });
  }

  render() {
    const { loading, projects, mergeRequests } = this.state;

    if (loading) {
      return (
        <ThemeProvider theme={theme}>
          <LoadingScreen />
        </ThemeProvider>
      );
    }

    return (
      <GitlabContext.Provider value={{ projects }} projectServices={projectServices}>
        <ThemeProvider theme={theme}>
          <ApplicationWrapper>
            <ReactInterval timeout={5000} enabled callback={() => this.fetchOpenMergeRequests()} />
            {mergeRequests.map(mergeRequest => {
              return <MergeRequest key={mergeRequest.iid} {...mergeRequest} />;
            })}
          </ApplicationWrapper>
        </ThemeProvider>
      </GitlabContext.Provider>
    );
  }
}

export default App;
