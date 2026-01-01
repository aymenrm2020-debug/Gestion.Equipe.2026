import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { MadeWithDyad } from '@/components/made-with-dyad';

function Login() {
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (session && !loading) {
      navigate('/'); // Redirect to dashboard if already logged in
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Chargement de la session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-card text-card-foreground p-8 rounded-lg shadow-lg border border-border card-hover-effect">
        <h1 className="text-3xl font-bold text-center mb-6">
          Connexion
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Use light theme by default, can be dynamic later
          redirectTo={window.location.origin + '/'} // Redirect to home after auth
        />
      </div>
      <MadeWithDyad />
    </div>
  );
}

export default Login;