import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDateRange, parseDate } from '@/lib/utils/dates';
import { ShareSection } from './ShareSection';

interface EventHeaderProps {
  event: {
    name: string;
    start_date: string;
    end_date: string;
    creator_name: string | null;
    is_locked: boolean;
    calculated_date: string | null;
  };
  userRole: 'admin' | 'participant' | 'visitor';
  shareUrl: string;
  translations: {
    badgesAdmin: string;
    badgesParticipant: string;
    createdBy: string;
    lockedTitle: string;
    lockedChosenDate: string;
    shareLabel: string;
    shareCopyButton: string;
    shareCopied: string;
  };
}

export function EventHeader({ event, userRole, shareUrl, translations }: EventHeaderProps) {
  const startDate = parseDate(event.start_date);
  const endDate = parseDate(event.end_date);
  const dateRangeText = formatDateRange(startDate, endDate);

  return (
    <Card className="shadow-xl border-none fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{event.name}</h1>

              {/* Role Badge */}
              {userRole === 'admin' && (
                <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-none shadow-md hover-scale">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  {translations.badgesAdmin}
                </Badge>
              )}
              {userRole === 'participant' && (
                <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-none shadow-md hover-scale">
                  <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {translations.badgesParticipant}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-lg text-muted-foreground mb-2">
              <svg className="w-5 h-5 text-primary transition-smooth hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateRangeText}
            </div>

            {event.creator_name && (
              <p className="text-sm text-muted-foreground">
                {translations.createdBy} <span className="font-semibold">{event.creator_name}</span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Locked Event Status */}
        {event.is_locked && event.calculated_date && (
          <>
            <div className="p-5 bg-primary/10 border-2 border-primary/30 rounded-xl fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md hover-scale-icon">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-primary text-lg mb-1">{translations.lockedTitle}</p>
                  <p className="text-foreground">
                    {translations.lockedChosenDate.replace('{date}', formatDateRange(parseDate(event.calculated_date), parseDate(event.calculated_date)))}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Share Section */}
        <ShareSection
          shareUrl={shareUrl}
          labelText={translations.shareLabel}
          copyButtonText={translations.shareCopyButton}
          copiedText={translations.shareCopied}
        />
      </CardContent>
    </Card>
  );
}
