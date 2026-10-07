import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Page, PageHeader, Panel } from "@/components/common/Page";
import { InterviewForm } from "@/components/interviews/InterviewForm";
import { CreatedInterviewCard } from "@/components/interviews/CreatedInterviewCard";
import { interviewsApi } from "@/api/interviews";
import { qk } from "@/lib/queryKeys";
import { useAppContext } from "@/hooks/useAppContext";

const COPY = {
  organization: {
    title: "New interview",
    description: "Set up a structured interview for a candidate. Every candidate for this role is assessed against the same skills.",
    steps: ["Define the role and the skills you want assessed.", "Add the candidate's email.", "Share the interview link returned after creation."],
  },
  personal: {
    title: "New practice interview",
    description: "Prepare for a specific role. Describe the position and the skills you want to be tested on.",
    steps: ["Pick the role and company you're preparing for.", "List the skills you want to practice.", "Start the interview from its detail page."],
  },
};

export default function CreateInterviewPage() {
  const { scope, tenantId, basePath, contextName } = useAppContext();
  const queryClient = useQueryClient();
  const [created, setCreated] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const copy = COPY[scope];

  const mutation = useMutation({
    mutationFn: (values) => interviewsApi(scope).create(values),
    onSuccess: (interview) => {
      setCreated(interview);
      toast.success("Interview created");
      queryClient.invalidateQueries({ queryKey: qk.interviews(scope, tenantId) });
    },
  });

  const reset = () => {
    setCreated(null);
    mutation.reset();
    setFormKey((k) => k + 1);
  };

  return (
    <Page>
      <PageHeader eyebrow={contextName} title={copy.title} description={copy.description} />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {created ? (
            <CreatedInterviewCard interview={created} onReset={reset} detailHref={created.slug && `${basePath}/interviews?i=${encodeURIComponent(created.slug)}`} />
          ) : (
            <Panel title="Interview details" description="All fields are required.">
              <InterviewForm key={formKey} includeCandidate={scope === "organization"} onSubmit={mutation.mutate} isPending={mutation.isPending} error={mutation.error} />
            </Panel>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-lg border p-5">
            <p className="eyebrow mb-4">How it works</p>
            <ol className="space-y-4">
              {copy.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]">{i + 1}</span>
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </Page>
  );
}
