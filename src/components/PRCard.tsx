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
}

export const PRCard = ({ title, author, repository, createdAt, url, isStale }: PRCardProps) => {
  const age = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card className="p-3 hover:shadow-lg transition-shadow duration-200 border-l-4"
          style={{ borderLeftColor: isStale ? 'hsl(var(--warning))' : 'hsl(var(--success))' }}>
      <div className="flex items-center gap-3">
        <GitPullRequest className="w-4 h-4 text-primary flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block mb-1"
          >
            {title}
          </a>

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
