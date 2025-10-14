interface Config {
  token: string;
  org: string;
  excludedRepos: string[];
}

const KEYS = {
  TOKEN: 'github_token',
  ORG: 'github_org',
  EXCLUDED_REPOS: 'excluded_repos',
} as const;

export const configService = {
  getToken(): string | null {
    return localStorage.getItem(KEYS.TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(KEYS.TOKEN, token);
  },

  getOrg(): string | null {
    return localStorage.getItem(KEYS.ORG);
  },

  setOrg(org: string): void {
    localStorage.setItem(KEYS.ORG, org);
  },

  getExcludedRepos(): string[] {
    const excluded = localStorage.getItem(KEYS.EXCLUDED_REPOS);
    return excluded ? JSON.parse(excluded) : [];
  },

  setExcludedRepos(repos: string[]): void {
    localStorage.setItem(KEYS.EXCLUDED_REPOS, JSON.stringify(repos));
  },

  getConfig(): Partial<Config> {
    return {
      token: this.getToken() || undefined,
      org: this.getOrg() || undefined,
      excludedRepos: this.getExcludedRepos(),
    };
  },

  hasValidConfig(): boolean {
    return !!this.getToken() && !!this.getOrg();
  },

  clear(): void {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  },
};
