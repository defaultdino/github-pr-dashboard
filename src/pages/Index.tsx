import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PRSection, PR } from "@/components/PRSection";
import { ConfigDialog } from "@/components/ConfigDialog";
import { toast } from "sonner";
import { GitHubService } from "@/services/github";

const Index = () => {
  const [activePRs, setActivePRs] = useState<PR[]>([]);
  const [stalePRs, setStalePRs] = useState<PR[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const hasConfig = localStorage.getItem("github_org") && localStorage.getItem("github_token");
    if (!hasConfig) {
      setShowConfig(true);
    } else {
      loadPRs();
    }
  }, []);

  const loadPRs = async () => {
    const token = localStorage.getItem("github_token");
    const org = localStorage.getItem("github_org");

    if (!token || !org) {
      toast.error("Please configure GitHub credentials");
      setShowConfig(true);
      return;
    }

    try {
      const service = new GitHubService(token, org);
      const githubPRs = await service.getAllPullRequests();

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const prs: PR[] = githubPRs.map(pr => {
        const repoName = pr.repository_url.split('/').pop() || 'unknown';
        const createdAt = new Date(pr.created_at);

        return {
          id: pr.id,
          title: pr.title,
          author: pr.user.login,
          repository: repoName,
          createdAt,
          url: pr.html_url,
          isStale: createdAt <= sevenDaysAgo,
        };
      });

      const active = prs.filter(pr => !pr.isStale);
      const stale = prs.filter(pr => pr.isStale);

      setActivePRs(active);
      setStalePRs(stale);
    } catch (error) {
      toast.error("Failed to fetch PRs. Check your token and organization.");
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await loadPRs();
      toast.success("PRs refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh PRs");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onRefresh={handleRefresh}
        onSettings={() => setShowConfig(true)}
        isRefreshing={isRefreshing}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <PRSection
          title="Active PRs"
          prs={activePRs}
          emptyMessage="No active pull requests found"
          isStale={false}
          viewMode={viewMode}
        />

        <PRSection
          title="Stale PRs"
          prs={stalePRs}
          emptyMessage="No stale pull requests - great job!"
          isStale={true}
          viewMode={viewMode}
        />
      </main>

      <ConfigDialog open={showConfig} onOpenChange={setShowConfig} />
    </div>
  );
};

export default Index;
