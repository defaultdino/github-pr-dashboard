import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  onRefresh: () => void;
  onSettings: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader = ({ onRefresh, onSettings, isRefreshing }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">PR Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor pull requests across your organization</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
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
