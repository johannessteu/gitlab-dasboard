export interface ProjectInterface {
  id: number;
  name_with_namespace: string;
}

export interface AuthorInterface {
  id: number;
  avatar_url: string;
  name: string;
  state: 'active' | 'inactive';
  username: string;
  web_url: string;
}

export interface MergeRequestInterface {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  merge_status: 'can_be_merged' | 'cannot_be_merged';
  work_in_progress: boolean;
  created_at: Date;
  updated_at: Date;
  web_url: string;
  state: 'opened' | 'closed';
  author: AuthorInterface;
  assignee: AuthorInterface;
  upvotes: number;
  downvotes: number;
  source_branch: string;
  target_branch: string;
  user_notes_count: number;
}
