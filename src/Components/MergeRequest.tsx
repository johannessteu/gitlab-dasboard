import React, { Fragment, useState, useContext, useEffect } from 'react';
import styled from '../Theme/styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GitlabContext from '../Context/GitlabContext';

import usePipelineStatus from '../hooks/usePipelineStatus';
import useApproval from '../hooks/useApproval';

import { Avatar } from './index';
import { Card } from '../Ui';

import projectServices from '../helper/projectServices';

import { MergeRequestInterface } from '../Interfaces';

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
  font-weight: normal;
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

const InfoIcon = styled(FontAwesomeIcon)`
  margin: 0 10px;
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

  div {
    flex-basis: 33%;
  }
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

const Actions = styled('a')<{ success: boolean }>`
  padding: 20px;
  text-align: center;
  color: white;
  display: block;
  background: ${props => (props.success ? props.theme.colors.success : props.theme.colors.error)};
`;

const Status = styled('div')<{ success: boolean; running: boolean }>`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
  position: relative;
  top: 3px;
  background: ${props => (props.success ? props.theme.colors.success : props.running ? props.theme.colors.yellow : props.theme.colors.error)};
`;

const MergeRequest: React.FC<MergeRequestInterface> = mergeRequest => {
  const approval = useApproval(mergeRequest);
  const currentPipeline = usePipelineStatus(mergeRequest);
  const context = useContext(GitlabContext);

  const readyToMerge = mergeRequest.merge_status === 'can_be_merged' && currentPipeline !== null && currentPipeline.status === 'success';

  // fetch pipeline status
  useEffect(() => {}, []);

  const project = context.projects[mergeRequest.project_id];

  return (
    <Card>
      <Header>
        <Avatar url={mergeRequest.author.avatar_url} />
        <Title>{mergeRequest.title}</Title>
      </Header>
      {project && <Project>{project.name_with_namespace}</Project>}
      <Icons>
        <IconSet>
          {approval.approvals_left > 0 ? (
            <Fragment>
              <span role="img" aria-label="approvals">
                🚫
              </span>{' '}
              {approval.approvals_left}
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
          {mergeRequest.upvotes}
        </IconSet>
        <IconSet>
          <span role="img" aria-label="downvotes">
            👎
          </span>
          {mergeRequest.downvotes}
        </IconSet>
        <IconSet>
          <span role="img" aria-label="user_notes">
            💬
          </span>
          {mergeRequest.user_notes_count}
        </IconSet>
        {mergeRequest.assignee && (
          <Assignee>
            <Avatar height="38" width="38" url={mergeRequest.assignee.avatar_url} />
          </Assignee>
        )}
      </Icons>
      <Section>
        <InfoIcon icon="code-branch" /> {mergeRequest.source_branch} <InfoIcon icon="angle-right" /> {mergeRequest.target_branch}
      </Section>
      <SplittedSeciton>
        <div>
          <InfoIcon icon="sync" />
          Update
        </div>
        <div>
          <InfoIcon icon="calendar" /> {mergeRequest.updated_at.toLocaleDateString()}
        </div>
        <div>
          <InfoIcon icon="clock" /> {mergeRequest.updated_at.toLocaleTimeString()}
        </div>
      </SplittedSeciton>
      <SplittedSeciton>
        <div>
          <InfoIcon icon="plus-circle" />
          Erstellt
        </div>
        <div>
          <InfoIcon icon="calendar" /> {mergeRequest.created_at.toLocaleDateString()}
        </div>
        <div>
          <InfoIcon icon="clock" /> {mergeRequest.created_at.toLocaleTimeString()}
        </div>
      </SplittedSeciton>
      {currentPipeline !== null && (
        <Pipeline>
          <Status success={readyToMerge} running={currentPipeline.status === 'running'} />
          Pipeline #{currentPipeline.id}
        </Pipeline>
      )}
      <Actions href={mergeRequest.web_url} success={readyToMerge}>
        {readyToMerge ? <FontAwesomeIcon icon={approval.approvals_left > 0 ? 'user-lock' : 'check'} transform="grow-8" /> : <FontAwesomeIcon icon="times" transform="grow-6" />}
      </Actions>
    </Card>
  );
};

export default MergeRequest;
