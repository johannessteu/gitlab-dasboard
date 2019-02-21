import React, { useState, useEffect } from 'react';
import pick from 'lodash.pick';
import projectServices from '../helper/projectServices';

import { MergeRequestInterface } from '../Interfaces';

interface useOpenMergeRequestsProps {
  timeout: number;
}

const useOpenMergeRequests = ({ timeout = 5000 }: useOpenMergeRequestsProps) => {
  const [mergeRequests, setMergeRequests] = useState<MergeRequestInterface[]>([]);

  const refreshMergeRequests = () => {
    async function fetchMergeRequests() {
      const mergeRequests: MergeRequestInterface[] = await projectServices.MergeRequests.all({ state: 'opened', scope: 'all', orderBy: 'updated_at', maxPages: 1, perPage: 10 });

      const filtered = mergeRequests.filter(mr => {
        return mr.merge_status === 'can_be_merged' && mr.work_in_progress === false;
      });

      const parsed = filtered.map(mr => {
        return Object.assign({ ...mr }, { updated_at: new Date(mr.updated_at), created_at: new Date(mr.created_at) });
      });

      setMergeRequests(parsed);
    }

    fetchMergeRequests();
  };

  // load merge requests on inital load
  useEffect(() => {
    refreshMergeRequests();
  }, ['initial']);

  // set up an interval to refetch the merge requests
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMergeRequests();
    }, timeout);

    return () => {
      clearInterval(interval);
    };
  });

  return [mergeRequests];
};

export default useOpenMergeRequests;
