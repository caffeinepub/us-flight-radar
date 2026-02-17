import { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGetApiUrl, useSetApiUrl } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface DataProviderSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DataProviderSettingsDialog({ open, onOpenChange }: DataProviderSettingsDialogProps) {
  const { data: currentUrl, isLoading } = useGetApiUrl();
  const setApiUrl = useSetApiUrl();
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (currentUrl) {
      setUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleSave = async () => {
    try {
      await setApiUrl.mutateAsync(url);
      toast.success('API URL updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update API URL');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-radar-grid bg-radar-panel sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-radar-foreground">
            <Settings className="h-5 w-5" />
            Data Provider Settings
          </DialogTitle>
          <DialogDescription className="text-radar-muted">
            Configure the aircraft data source endpoint. Default: OpenSky Network API.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-url" className="text-radar-foreground">
              API Endpoint URL
            </Label>
            <Input
              id="api-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://opensky-network.org/api/states/all"
              disabled={isLoading}
              className="border-radar-grid bg-radar-dark text-radar-foreground"
            />
            <p className="text-xs text-radar-muted">
              The endpoint should return aircraft position data in OpenSky Network format.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-radar-grid">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={setApiUrl.isPending} className="bg-radar-primary hover:bg-radar-primary/80">
            <Save className="mr-2 h-4 w-4" />
            {setApiUrl.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
