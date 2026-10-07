import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppEntry, OrgLayout, PersonalLayout } from "@/components/layout/ContextLayouts";
import { RequirePermission } from "@/components/layout/RequirePermission";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import PersonalOverview from "@/pages/app/PersonalOverview";
import OrgOverview from "@/pages/app/OrgOverview";
import InterviewsPage from "@/pages/app/InterviewsPage";
import CreateInterviewPage from "@/pages/app/CreateInterviewPage";
import WorkspacesPage from "@/pages/app/WorkspacesPage";
import ResumePage from "@/pages/app/ResumePage";
import TeamPage from "@/pages/app/TeamPage";
import InvitationsPage from "@/pages/app/InvitationsPage";
import { OrgInterviewRoom, PersonalInterviewRoom } from "@/pages/app/InterviewRoom";

const gate = (action, el) => <RequirePermission action={action}>{el}</RequirePermission>;

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="candor.theme">
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<AppEntry />} />
            <Route path="/app/personal" element={<PersonalLayout />}>
              <Route index element={<PersonalOverview />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="interviews/new" element={<CreateInterviewPage />} />
              <Route path="interviews/:slug/room" element={<PersonalInterviewRoom />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="workspaces" element={<WorkspacesPage />} />
              <Route path="invitations" element={<InvitationsPage />} />
            </Route>
            <Route path="/app/org/:orgId" element={<OrgLayout />}>
              <Route index element={<OrgOverview />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="interviews/new" element={gate("createInterview", <CreateInterviewPage />)} />
              <Route path="room/:interviewLink" element={gate("openInterviewRoom", <OrgInterviewRoom />)} />
              <Route path="workspaces" element={gate("viewWorkspaces", <WorkspacesPage />)} />
              <Route path="team" element={gate("manageRoles", <TeamPage />)} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
