import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const Quiz = lazy(() => import("@/pages/Quiz"));
const Results = lazy(() => import("@/pages/Results"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Optimize provider initialization to reduce TBT
const OptimizedTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => setMounted(true), { timeout: 2000 });
    } else {
      setTimeout(() => setMounted(true), 0);
    }
  }, []);
  
  if (!mounted) return <>{children}</>;
  return <TooltipProvider>{children}</TooltipProvider>;
};

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/results" component={Results} />
          <Route path="/404" component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </main>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <OptimizedTooltipProvider>
          <Toaster />
          <Router />
        </OptimizedTooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
