import { useState, useEffect } from 'react';
import { MergeRequestInterface } from '../Interfaces';

import projectServices from '../helper/projectServices';

type PipelineStatus = 'success' | 'running' | 'failed' | 'none';

interface PipelineInterface {
  id: number;
  ref: string;
  sha1: string;
  status: PipelineStatus;
  web_url: string;
}

interface RawPipelineResponse {}

const usePipelineStatus = (mergeRequest: MergeRequestInterface, timeout: number = 10000): PipelineInterface | null => {
  const [pipeline, setPipeline] = useState<PipelineInterface | null>(null);
  const [failCount, setFailCoint] = useState(0);

  const refreshStatus = () => {
    async function fetchPipeline() {
      const pipelines: PipelineInterface[] = await projectServices.Pipelines.all(mergeRequest.project_id, { perPage: 1, maxPages: 1, ref: mergeRequest.source_branch });

      if (pipelines.length > 0) {
        const lastPipeline = pipelines[0];
        setPipeline(lastPipeline);

        if (lastPipeline.status === 'failed') {
          setFailCoint(failCount + 1);
        }
      } else {
        setPipeline(null);
        // if there is no pipeline it's cool to raise the count so fetching will be stopped at some point
        setFailCoint(failCount + 1);
      }
    }

    if (pipeline === null || pipeline.status !== 'success') {
      fetchPipeline();
    }
  };

  useEffect(() => {
    refreshStatus();
  }, ['initial']);

  useEffect(() => {
    const interval = setInterval(() => {
      if (failCount < 4) {
        refreshStatus();
      }
    }, timeout);

    return () => {
      clearInterval(interval);
    };
  });

  return pipeline;
};

export default usePipelineStatus;
