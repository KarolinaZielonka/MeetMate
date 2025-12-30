import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ShareSectionProps {
  shareUrl: string;
  labelText: string;
  copyButtonText: string;
  copiedText: string;
}

export function ShareSection({ shareUrl, labelText, copyButtonText, copiedText }: ShareSectionProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        toast.success(copiedText);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // Fallback for older browsers or insecure contexts (HTTP)
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand('copy');
          setCopySuccess(true);
          toast.success(copiedText);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
          toast.error('Failed to copy link');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div>
      <Label className="text-sm font-semibold text-foreground mb-3 block">
        {labelText}
      </Label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 px-4 py-3 bg-muted border-2 border-border rounded-lg font-mono text-sm overflow-x-auto transition-smooth hover:border-primary/50">
          {shareUrl}
        </div>
        <Button
          onClick={handleCopyLink}
          className={`${copySuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-primary hover:opacity-90'} shadow-md transition-smooth hover-lift min-w-[120px]`}
        >
          {copySuccess ? (
            <>
              <svg className="w-4 h-4 mr-2 bounce-subtle" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {copiedText}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2 transition-smooth group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copyButtonText}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
