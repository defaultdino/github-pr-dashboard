export interface GitHubPR {
  id: number;
  title: string;
  user: {
    login: string;
  };
  html_url: string;
  created_at: string;
  repository_url: string;
}

export interface Repository {
  name: string;
  full_name: string;
}

export class GitHubService {
  private token: string;
  private org: string;

  constructor(token: string, org: string) {
    this.token = token;
    this.org = org;
  }

  private async fetchWithAuth(url: string) {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositories(): Promise<Repository[]> {
    return this.fetchWithAuth(`https://api.github.com/orgs/${this.org}/repos?per_page=100`);
  }

  async getPullRequests(repo: string): Promise<GitHubPR[]> {
    return this.fetchWithAuth(
      `https://api.github.com/repos/${this.org}/${repo}/pulls?state=open&per_page=100`
    );
  }

  async getAllPullRequests(): Promise<GitHubPR[]> {
    const result = await this.fetchWithAuth(
      `https://api.github.com/search/issues?q=type:pr+state:open+org:${this.org}&per_page=100`
    );
    return result.items || [];
  }
}
