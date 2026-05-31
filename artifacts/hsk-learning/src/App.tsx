import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FloatingBackground } from "@/components/floating-background";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import LearnPage from "@/pages/learn";
import LearnLevelPage from "@/pages/learn-level";
import LessonPage from "@/pages/lesson";
import CheckpointPage from "@/pages/checkpoint";
import ProgressPage from "@/pages/progress";
import RoadmapPage from "@/pages/roadmap";
import LeaderboardPage from "@/pages/leaderboard";
import SettingsPage from "@/pages/settings";
import SettingsActivityPage from "@/pages/settings-activity";
import SettingsAppearancePage from "@/pages/settings-appearance";
import SettingsProfilePage from "@/pages/settings-profile";
import SettingsHelpPage from "@/pages/settings-help";
import SettingsFeedbackPage from "@/pages/settings-feedback";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/learn/:level" component={LearnLevelPage} />
      <Route path="/lesson/:id" component={LessonPage} />
      <Route path="/checkpoint/:level" component={CheckpointPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/settings/activity" component={SettingsActivityPage} />
      <Route path="/settings/appearance" component={SettingsAppearancePage} />
      <Route path="/settings/profile" component={SettingsProfilePage} />
      <Route path="/settings/help" component={SettingsHelpPage} />
      <Route path="/settings/feedback" component={SettingsFeedbackPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FloatingBackground />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
