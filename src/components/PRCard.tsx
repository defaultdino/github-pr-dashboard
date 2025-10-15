import { Card } from "@/components/ui/card";
import { GitPullRequest, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PRCardProps {
  title: string;
  author: string;
  repository: string;
  createdAt: Date;
  url: string;
  isStale: boolean;
  isDraft: boolean;
}

export const PRCard = ({ title, author, repository, createdAt, url, isStale, isDraft }: PRCardProps) => {
  const age = formatDistanceToNow(createdAt, { addSuffix: true });

  const cardClasses = isDraft
    ? "p-3 hover:shadow-lg transition-shadow duration-200 border-2 border-dashed border-muted-foreground"
    : "p-3 hover:shadow-lg transition-shadow duration-200 border-2";

  const borderColor = isDraft ? undefined : isStale ? 'hsl(var(--warning) / 0.6)' : 'hsl(var(--success) / 0.6)';

  return (
    <Card
      className={cardClasses}
      style={{ borderColor }}
    >
      <div className="flex items-center gap-3">
        <GitPullRequest className="w-4 h-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block">
              {title}
            </a>
            {isDraft && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium flex-shrink-0">
                Draft
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{author}</span>
            </div>
            <span>•</span>
            <span className="font-mono truncate max-w-[150px]">{repository}</span>
            <span>•</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{age}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
