import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/hooks/use-game-state";
import NotFound from "@/pages/not-found";
import StartScreen from "@/pages/StartScreen";
import CharacterCreator from "@/pages/CharacterCreator";
import MapScreen from "@/pages/MapScreen";
import StudioScreen from "@/pages/StudioScreen";
import PerformanceScreen from "@/pages/PerformanceScreen";
import ReviewScreen from "@/pages/ReviewScreen";
import SocialScreen from "@/pages/SocialScreen";
import LeaderboardScreen from "@/pages/LeaderboardScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={StartScreen} />
      <Route path="/creator" component={CharacterCreator} />
      <Route path="/map" component={MapScreen} />
      <Route path="/studio/:cityId" component={StudioScreen} />
      <Route path="/performance/:cityId" component={PerformanceScreen} />
      <Route path="/review/:cityId" component={ReviewScreen} />
      <Route path="/social" component={SocialScreen} />
      <Route path="/leaderboard" component={LeaderboardScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
