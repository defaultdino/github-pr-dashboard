import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, LayoutGrid, LayoutList, Filter } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/context/configContext";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onSettings: () => void;
  isRefreshing: boolean;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  allRepositories: string[];
  onFilterChange: () => void;
}

export const DashboardHeader = ({
  onRefresh,
  onSettings,
  isRefreshing,
  viewMode,
  onViewModeChange,
  allRepositories,
  onFilterChange
}: DashboardHeaderProps) => {
  const { config, setConfig } = useConfig();
  const [excludedRepos, setExcludedRepos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const excluded = config.excludedRepos || [];
    setExcludedRepos(new Set(excluded));
  }, [config.excludedRepos]);

  const toggleRepo = (repo: string) => {
    const newExcluded = new Set(excludedRepos);
    if (newExcluded.has(repo)) {
      newExcluded.delete(repo);
    } else {
      newExcluded.add(repo);
    }
    setExcludedRepos(newExcluded);
    setConfig({ excludedRepos: [...newExcluded] });
    onFilterChange();
  };

  const clearAll = () => {
    setExcludedRepos(new Set());
    setConfig({ excludedRepos: [] });
    onFilterChange();
  };

  const excludeAll = () => {
    setExcludedRepos(new Set(allRepositories));
    setConfig({ excludedRepos: allRepositories });
    onFilterChange();
  };

  const filteredRepos = allRepositories.filter(repo =>
    repo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">PR Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {config.org ? "Monitor pull requests across " + config.org : "Monitor pull requests across your organization"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {allRepositories.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    {excludedRepos.size > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {excludedRepos.size}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Exclude Repositories</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAll}
                          className="h-7 text-xs"
                        >
                          Clear
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={excludeAll}
                          className="h-7 text-xs"
                        >
                          All
                        </Button>
                      </div>
                    </div>

                    <Input
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8"
                    />

                    <ScrollArea className="h-64">
                      <div className="space-y-2 pr-3">
                        {filteredRepos.map((repo) => (
                          <div key={repo} className="flex items-center space-x-2">
                            <Checkbox
                              id={`filter-${repo}`}
                              checked={excludedRepos.has(repo)}
                              onCheckedChange={() => toggleRepo(repo)}
                            />
                            <label
                              htmlFor={`filter-${repo}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                              {repo}
                            </label>
                          </div>
                        ))}
                        {filteredRepos.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No repositories found
                          </p>
                        )}
                      </div>
                    </ScrollArea>

                    <p className="text-xs text-muted-foreground">
                      {excludedRepos.size} of {allRepositories.length} excluded
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="flex items-center gap-1 border border-border rounded-md p-1">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('list')}
                className="h-7 w-7"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className="h-7 w-7"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
