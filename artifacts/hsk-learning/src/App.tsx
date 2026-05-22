import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import LearnLevelPage from "@/pages/learn-level";
import LessonPage from "@/pages/lesson";
import CheckpointPage from "@/pages/checkpoint";
import ProgressPage from "@/pages/progress";
import RoadmapPage from "@/pages/roadmap";
import LeaderboardPage from "@/pages/leaderboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/learn/:level" component={LearnLevelPage} />
      <Route path="/lesson/:id" component={LessonPage} />
      <Route path="/checkpoint/:level" component={CheckpointPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
