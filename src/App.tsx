import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { EcoverseContentProvider } from "@/context/EcoverseContentContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import Events from "./pages/Events";
import News from "./pages/News";
import Memberships from "./pages/Memberships";
import Mentorship from "./pages/Mentorship";
import Messages from "./pages/Messages";
import Pricing from "./pages/Pricing";
import Account from "./pages/Account";
import Social from "./pages/Social";
import Assistant from "./pages/Assistant";
import CareerTips from "./pages/CareerTips";
import TipsWall from "./pages/TipsWall";
import TipsWallRedirect from "./pages/TipsWallRedirect";
import ShareHeroPhoto from "./pages/ShareHeroPhoto";
import AdminHeroPhotos from "./pages/AdminHeroPhotos";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
    <ProfileProvider>
    <EcoverseContentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/signup" element={<Auth mode="signup" />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<Home />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<News />} />
              <Route path="/memberships" element={<Memberships />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/career-tips" element={<CareerTips />} />
              <Route path="/tips" element={<TipsWallRedirect />} />
              <Route path="/tips/:wallKey" element={<TipsWall />} />
              <Route path="/share-photo" element={<ShareHeroPhoto />} />
              <Route path="/admin/hero-photos" element={<AdminHeroPhotos />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/account" element={<Account />} />
              <Route path="/community" element={<Social />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
      </TooltipProvider>
    </EcoverseContentProvider>
    </ProfileProvider>
    </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
