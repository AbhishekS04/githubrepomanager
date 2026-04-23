const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'dummy_client_id';

export const loginWithGitHub = () => {
  const redirectUri = window.location.origin + '/oauth/callback';
  const scope = 'repo delete_repo user';
  const state = Math.random().toString(36).substring(7);
  
  sessionStorage.setItem('oauth_state', state);

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.append('client_id', GITHUB_CLIENT_ID);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('scope', scope);
  url.searchParams.append('state', state);

  window.location.href = url.toString();
};
