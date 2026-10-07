import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick } from "lucide-react";
import { InterviewList } from "@/components/interviews/InterviewList";
import { InterviewDetail } from "@/components/interviews/InterviewDetail";
import { interviewsApi } from "@/api/interviews";
import { qk } from "@/lib/queryKeys";
import { useAppContext } from "@/hooks/useAppContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export default function InterviewsPage() {
  const { scope, tenantId, basePath, can } = useAppContext();
  const [params, setParams] = useSearchParams();
  const selectedSlug = params.get("i");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const list = useQuery({ queryKey: qk.interviews(scope, tenantId), queryFn: () => interviewsApi(scope).list() });

  useEffect(() => {
    const first = list.data?.find((i) => i.slug);
    if (isDesktop && !selectedSlug && first) setParams({ i: first.slug }, { replace: true });
  }, [isDesktop, selectedSlug, list.data, setParams]);

  const placeholder = list.data?.find((i) => i.slug === selectedSlug);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]" data-testid="interviews-page">
      <section className={cn("w-full shrink-0 border-r lg:w-[360px] xl:w-[400px]", selectedSlug && "hidden lg:block")}>
        <InterviewList
          query={list}
          selectedSlug={selectedSlug}
          onSelect={(slug) => setParams({ i: slug })}
          createHref={can("createInterview") ? `${basePath}/interviews/new` : null}
          showCandidate={scope === "organization"}
        />
      </section>
      <section className={cn("min-w-0 flex-1 overflow-y-auto", !selectedSlug && "hidden lg:block")}>
        {selectedSlug ? (
          <InterviewDetail key={selectedSlug} slug={selectedSlug} placeholder={placeholder} onBack={() => setParams({})} />
        ) : (
          <div className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground" data-testid="interview-no-selection">
            <div className="space-y-2">
              <MousePointerClick className="mx-auto h-5 w-5" />
              <p>Select an interview to see its details.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
