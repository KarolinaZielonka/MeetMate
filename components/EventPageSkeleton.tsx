import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EventPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <Skeleton className="h-10 w-3/4 mb-2 shimmer" />
            <Skeleton className="h-6 w-1/2 shimmer" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full shimmer" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
