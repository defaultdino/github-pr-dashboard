import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { configService } from "../services/config";

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfigDialog = ({ open, onOpenChange }: ConfigDialogProps) => {
  const [organization, setOrganization] = useState(
    configService.getOrg()
  );
  const [token, setToken] = useState(
    configService.getToken()
  );

  const handleSave = () => {
    if (!organization || !token) {
      toast.error("Please fill in all fields");
      return;
    }

    configService.setOrg(organization)
    configService.setToken(token)
    toast.success("Configuration saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>GitHub Configuration</DialogTitle>
          <DialogDescription>
            Configure your GitHub organization and personal access token
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name</Label>
            <Input
              id="organization"
              placeholder="your-org-name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">GitHub Personal Access Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Token needs repo and read:org permissions
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
