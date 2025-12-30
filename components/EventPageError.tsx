import { useRouter } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventPageErrorProps {
  error: string;
  notFoundMessage: string;
  isNotFound: boolean;
  goHomeText: string;
  oopsText: string;
}

export function EventPageError({
  error,
  notFoundMessage,
  isNotFound,
  goHomeText,
  oopsText,
}: EventPageErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto fade-in">
        <Card className="shadow-lg border-none">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6 bounce-subtle">
              <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {isNotFound ? notFoundMessage : oopsText}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {error || notFoundMessage}
            </p>
            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 hover-lift"
            >
              {goHomeText}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
