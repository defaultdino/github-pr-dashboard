import { PRCard } from "./PRCard";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface PR {
  id: number;
  title: string;
  author: string;
  repository: string;
  createdAt: Date;
  url: string;
  isStale: boolean;
  isDraft: boolean;
}

interface PRSectionProps {
  title: string;
  prs: PR[];
  emptyMessage: string;
  isStale?: boolean;
  viewMode: 'grid' | 'list';
}

export const PRSection = ({ title, prs, emptyMessage, isStale = false, viewMode }: PRSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayLimit = 15;
  const displayedPRs = showAll ? prs : prs.slice(0, displayLimit);
  const hasMore = prs.length > displayLimit;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
          />
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">({prs.length})</span>
        </button>
      </div>

      {!isCollapsed && (
        <>
          {prs.length === 0 ? (
            <div className="flex items-center gap-2 p-6 rounded-lg bg-muted/50 text-muted-foreground">
              <AlertCircle className="w-5 h-5" />
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
                {displayedPRs.map((pr) => (
                  <PRCard key={pr.id} {...pr} isStale={isStale} />
                ))}
              </div>

              {hasMore && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed rounded-lg"
                >
                  Show {prs.length - displayLimit} more...
                </button>
              )}

              {showAll && hasMore && (
                <button
                  onClick={() => setShowAll(false)}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed rounded-lg"
                >
                  Show less
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
