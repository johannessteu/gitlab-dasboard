import { MergeRequestInterface } from '../Interfaces';

import projectServices from '../helper/projectServices';
import { useEffect, useState } from 'react';

interface ApprovalInterface {
  approvals: number;
  approvals_left: number;
  approvals_required: number;
}

const useApproval = (mergeRequests: MergeRequestInterface): ApprovalInterface => {
  const [approval, setApproval] = useState<ApprovalInterface>({ approvals: 0, approvals_left: 0, approvals_required: 0 });

  const refetchStatus = () => {
    async function fetchApprovals() {
      const result: any = await projectServices.MergeRequests.approvals(mergeRequests.project_id, { mergerequestId: mergeRequests.iid });
      setApproval({
        approvals: result.approvers.length,
        approvals_left: result.approvals_left,
        approvals_required: result.approvals_required
      });
    }
    fetchApprovals();
  };

  // load merge requests on inital load
  useEffect(() => {
    refetchStatus();
  }, ['initial']);

  return approval;
};

export default useApproval;
