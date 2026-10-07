import { Page, PageHeader, Panel } from "@/components/common/Page";
import { ResumeDropzone } from "@/components/resume/ResumeDropzone";

const TIPS = [
  "Use your latest resume — interviews can reference your experience.",
  "Text-based PDFs work best. Scanned images may not be read correctly.",
  "Uploading again replaces what we use for future interviews.",
];

export default function ResumePage() {
  return (
    <Page>
      <PageHeader eyebrow="Individual" title="Resume" description="Upload your resume so practice interviews can be tailored to your background." />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Panel title="Upload resume" description="Processing happens on our servers after upload." testId="resume-upload-panel">
            <ResumeDropzone />
          </Panel>
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-lg border p-5">
            <p className="eyebrow mb-4">Good to know</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {TIPS.map((t) => <li key={t} className="border-l-2 pl-3">{t}</li>)}
            </ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
