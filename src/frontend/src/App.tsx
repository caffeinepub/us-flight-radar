import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import FlightRadarDashboard from './pages/FlightRadarDashboard';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import LoginButton from './components/LoginButton';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">US Flight Radar</h1>
            <p className="text-muted-foreground">Track aircraft across the United States</p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  // Show profile setup if user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupDialog />}
      <FlightRadarDashboard />
    </>
  );
}
