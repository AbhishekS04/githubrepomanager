import { Octokit } from 'octokit';
import { saveAs } from 'file-saver';

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
      affiliation: 'owner',
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
  const client = getOctokit();
  try {
    const response = await client.rest.repos.downloadZipballArchive({
      owner,
      repo,
      ref: defaultBranch,
    });
    
    // Octokit returns an ArrayBuffer for this endpoint
    const blob = new Blob([response.data as unknown as BlobPart], { type: 'application/zip' });
    saveAs(blob, `${repo}-${defaultBranch}.zip`);
  } catch (error) {
    console.error(`Failed to download ${repo}`, error);
    throw error;
  }
};
