import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('aboutPage');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 pb-24 bg-background">

      {/* How It Works Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                1
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-foreground mb-2">{t('steps.step1.title')}</h3>
                <p className="text-muted-foreground">
                  {t('steps.step1.description')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                2
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-foreground mb-2">{t('steps.step2.title')}</h3>
                <p className="text-muted-foreground">
                  {t('steps.step2.description')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-xl">
                3
              </div>
              <div className="flex-1 transition-smooth group-hover:translate-x-2">
                <h3 className="text-xl font-bold text-foreground mb-2">{t('steps.step3.title')}</h3>
                <p className="text-muted-foreground">
                  {t('steps.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
