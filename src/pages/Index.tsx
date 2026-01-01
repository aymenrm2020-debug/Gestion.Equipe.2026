import { MadeWithDyad } from "@/components/made-with-dyad";
import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/integrations/supabase/auth";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const { session, user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess("Déconnexion réussie !");
    } catch (error: any) {
      showError(`Erreur de déconnexion: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Should be redirected to login by SessionContextProvider
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Bienvenue sur votre Tableau de Bord, {user?.email}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          C'est ici que vous gérerez votre équipe logistique.
        </p>
        <Button onClick={handleSignOut} className="mt-4">
          Déconnexion
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;