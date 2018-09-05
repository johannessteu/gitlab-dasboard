import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactInterval from 'react-interval';

import GitlabContext from './../Context/Gitlab';
import { Avatar } from './index';
import { Card } from './../Ui';

import projectServices from './../helper/projectServices';

const Header = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.anthrazit};
  margin-left: 20px;
  font-size: 20px;
  line-height: 1.5;
  flex-shrink: 1;
`;

const Project = styled.p`
  padding: 20px 20px 0 20px;
  box-shadow: inset -17px 59px 39px -69px rgba(0, 0, 0, 0.25);
`;

const Icons = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: end;

  span {
    margin-right: 5px;
  }
`;

const IconSet = styled.div`
  border: 1px solid ${props => props.theme.colors.grey}
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
  
  svg {
    color: ${props => props.theme.colors.anthrazit}
  }
  `;

const Section = styled.div`
  border-top: 1px solid ${props => props.theme.colors.grey};
  padding: 20px;
`;

const SplittedSeciton = styled(Section)`
  display: flex;
  justify-content: space-between;
`;

const Pipeline = styled.div`
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.grey};
`;

const Assignee = styled.div`
  text-align: right;
  font-size: 14px;
  flex: 3;
`;

const Actions = styled.a`
  padding: 20px;
  text-align: center;
  color: white;
  display: block;
  background: ${props => (props.success ? props.theme.colors.success : props.theme.colors.error)};
`;

const Status = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
  position: relative;
  top: 3px;
  background: ${props => (props.success ? props.theme.colors.success : props.running ? props.theme.colors.yellow : props.theme.colors.error)};
`;

class MergeRequest extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastPipelineFailCount: 0,
      approvals_left: 0,
      lastPipeline: {}
    };
  }

  componentDidMount() {
    this.fecthApprovals();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updated_at !== this.props.updated_at) {
      this.fetchPipeline();
      this.fecthApprovals();
    }
  }

  async fetchPipeline() {
    const { project_id, source_branch } = this.props;

    const pipeline = await projectServices.Pipelines.all(project_id, { perPage: 1, maxPages: 1, ref: source_branch });
    const lastPipeline = pipeline[0];

    if (lastPipeline && lastPipeline.status === 'failed') {
      this.setState({ lastPipelineFailCount: this.state.lastPipelineFailCount + 1 });
    }

    this.setState({ lastPipeline: pipeline[0] });
  }

  async fecthApprovals() {
    const { project_id, iid } = this.props;

    const { approvals_left } = await projectServices.MergeRequests.approvals(project_id, { mergerequestId: iid });

    this.setState({ approvals_left });
  }

  render() {
    const { title, upvotes, updated_at, user_notes_count, downvotes, merge_status, source_branch, target_branch, project_id, author_avatar_url, assignee_avatar_url, web_url } = this.props;

    const { lastPipeline, lastPipelineFailCount, approvals_left } = this.state;
    const readyToMerge = merge_status === 'can_be_merged' && lastPipeline && lastPipeline.status === 'success';
    const date = new Date(updated_at);

    return (
      <GitlabContext.Consumer>
        {({ projects }) => {
          const project = projects[project_id];

          let showProjectInfos = true;
          if (typeof project === 'undefined') {
            showProjectInfos = false;
          }

          const checkForNewPipeline = lastPipeline && lastPipeline.status !== 'success' && lastPipelineFailCount <= 3;

          return (
            <Card>
              <Header>
                <Avatar url={author_avatar_url} />
                <Title>{title}</Title>
              </Header>
              {showProjectInfos && <Project>{project.name_with_namespace}</Project>}
              <Icons>
                <IconSet>
                  {approvals_left > 0 ? (
                    <Fragment>
                      <span role="img" aria-label="approvals">
                        🚫
                      </span>{' '}
                      {approvals_left}
                    </Fragment>
                  ) : (
                    <span role="img" aria-label="approvals">
                      ✅
                    </span>
                  )}
                </IconSet>
                <IconSet>
                  <span role="img" aria-label="upvotes">
                    👍
                  </span>{' '}
                  {upvotes}
                </IconSet>
                <IconSet>
                  <span role="img" aria-label="downvotes">
                    👎
                  </span>
                  {downvotes}
                </IconSet>
                <IconSet>
                  <span role="img" aria-label="user_notes">
                    💬
                  </span>
                  {user_notes_count}
                </IconSet>
                {assignee_avatar_url && (
                  <Assignee>
                    <Avatar height="38" width="38" url={assignee_avatar_url} />
                  </Assignee>
                )}
              </Icons>

              <Section>
                <FontAwesomeIcon icon="code-branch" /> {source_branch} <FontAwesomeIcon icon="angle-right" /> {target_branch}
              </Section>

              <SplittedSeciton>
                <div>
                  <FontAwesomeIcon icon="calendar" /> {date.toLocaleDateString()}
                </div>
                <div>
                  <FontAwesomeIcon icon="clock" /> {date.toLocaleTimeString()}
                </div>
              </SplittedSeciton>

              <ReactInterval timeout={10000} enabled={approvals_left > 0} callback={() => this.fecthApprovals()} />
              <ReactInterval timeout={10000} enabled={checkForNewPipeline} callback={() => this.fetchPipeline()} />

              {lastPipeline && (
                <Pipeline>
                  <Status success={readyToMerge} running={lastPipeline && lastPipeline.status === 'running'} />
                  Pipeline #{lastPipeline.id}
                </Pipeline>
              )}

              <Actions href={web_url} success={readyToMerge}>
                {readyToMerge ? <FontAwesomeIcon icon={approvals_left > 0 ? 'user-lock' : 'check'} transform="grow-8" /> : <FontAwesomeIcon icon="times" transform="grow-6" />}
              </Actions>
            </Card>
          );
        }}
      </GitlabContext.Consumer>
    );
  }
}

MergeRequest.propTypes = {
  iid: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,

  downvotes: PropTypes.number.isRequired,
  upvotes: PropTypes.number.isRequired,

  user_notes_count: PropTypes.number.isRequired,
  updated_at: PropTypes.string.isRequired,

  project_id: PropTypes.number.isRequired,
  source_branch: PropTypes.string.isRequired,
  target_branch: PropTypes.string.isRequired,

  web_url: PropTypes.string.isRequired,
  merge_status: PropTypes.string.isRequired,
  author_avatar_url: PropTypes.string.isRequired,
  assignee_avatar_url: PropTypes.string
};

MergeRequest.defaultProps = {
  assignee_avatar_url: null
};

export default MergeRequest;
