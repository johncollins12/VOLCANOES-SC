import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/cms/Breadcrumb';
import { getMatchReportForEdit } from '@/lib/data';
import { MatchReportForm } from './MatchReportForm';
import { PublishToggle } from './PublishToggle';

interface EditMatchReportPageProps {
  params: Promise<{ fixtureId: string }>;
}

export default async function EditMatchReportPage({ params }: EditMatchReportPageProps) {
  const { fixtureId } = await params;
  const report = await getMatchReportForEdit(fixtureId);

  if (!report) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Fixtures & Results', href: '/admin/fixtures' },
          { label: 'Match Report' },
        ]}
      />
      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Match Report</h1>
          <p className="text-sm text-muted">{report.fixtureLabel}</p>
        </div>
        <PublishToggle fixtureId={fixtureId} isPublished={!!report.publishedAt} />
      </div>
      <MatchReportForm report={report} />
    </div>
  );
}
