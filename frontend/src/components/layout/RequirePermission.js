import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/common/Page";
import { EmptyState } from "@/components/common/States";
import { useAppContext } from "@/hooks/useAppContext";

// UI gate only — the backend still authorizes the underlying requests.
export function RequirePermission({ action, children }) {
  const { can, basePath, role } = useAppContext();
  if (can(action)) return children;
  return (
    <Page>
      <EmptyState
        testId="access-restricted"
        icon={Lock}
        title="This area isn't available for your role"
        description={`Your ${role ?? ""} role in this organization doesn't include access to this page. Ask an admin if you need it.`}
        action={<Button asChild variant="outline" size="sm"><Link to={basePath}>Back to overview</Link></Button>}
      />
    </Page>
  );
}
