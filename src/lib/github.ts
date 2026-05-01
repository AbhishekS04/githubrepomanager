import { Octokit } from 'octokit';
import { saveAs } from 'file-saver';
import { useAuthStore } from '../store/authStore';

let octokit: Octokit | null = null;

export const initGitHub = (token: string) => {
  octokit = new Octokit({ auth: token });
};

export const getOctokit = () => {
  if (!octokit) throw new Error('Octokit not initialized');
  return octokit;
};

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  archived: boolean;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  size: number;
  description: string | null;
  default_branch: string;
  owner: {
    login: string;
  };
}

export const fetchAllRepos = async (): Promise<Repo[]> => {
  const client = getOctokit();
  const repos: Repo[] = [];
  let page = 1;
  const per_page = 100;

  while (true) {
    const response = await client.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      affiliation: 'owner,collaborator,organization_member',
      per_page,
      page,
      sort: 'updated',
    });

    if (response.data.length === 0) break;
    repos.push(...(response.data as any));
    if (response.data.length < per_page) break;
    page++;
  }

  return repos;
};

export const updateRepoVisibility = async (owner: string, repo: string, isPrivate: boolean) => {
  const client = getOctokit();
  await client.rest.repos.update({
    owner,
    repo,
    private: isPrivate,
  });
};

export const updateRepoArchived = async (owner: string, repo: string, archived: boolean) => {
  const client = getOctokit();
  await client.rest.repos.update({
    owner,
    repo,
    archived,
  });
};

export const deleteRepo = async (owner: string, repo: string) => {
  const client = getOctokit();
  await client.rest.repos.delete({
    owner,
    repo,
  });
};

export const downloadRepoZip = async (owner: string, repo: string, defaultBranch: string = 'main') => {
  const token = useAuthStore.getState().token;
  if (!token) return;

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner, repo, token, branch: defaultBranch }),
    });

    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const blob = await response.blob();
    saveAs(blob, `${repo}-${defaultBranch}.zip`);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
