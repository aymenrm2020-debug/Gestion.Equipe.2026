import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon, Home, CalendarDays, Clock, Briefcase, Hourglass, Users, BarChart3, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MadeWithDyad } from './made-with-dyad';
import { signOut } from '@/integrations/supabase/auth';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/use-user-role'; // Import useUserRole

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, isMobile }) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent hover:text-accent-foreground group"
  >
    <Icon className="h-4 w-4 group-hover:animate-wiggle" />
    {!isMobile && label}
  </Link>
);

const SidebarNav: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const navigate = useNavigate();
  const { role, isLoading: isLoadingRole } = useUserRole(); // Get user role

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess("Déconnexion réussie !");
      navigate('/login');
    } catch (error: any) {
      showError(`Erreur de déconnexion: ${error.message}`);
    }
  };

  if (isLoadingRole) {
    return <div className="px-4 py-2 text-muted-foreground">Chargement du menu...</div>;
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <NavLink to="/" icon={Home} label="Tableau de Bord" isMobile={isMobile} />
      <NavLink to="/calendar" icon={CalendarDays} label="Calendrier" isMobile={isMobile} />
      <NavLink to="/attendance" icon={Clock} label="Pointage" isMobile={isMobile} />
      <NavLink to="/leave-requests" icon={Briefcase} label="Absences & Congés" isMobile={isMobile} />
      <NavLink to="/overtime" icon={Hourglass} label="Heures Supplémentaires" isMobile={isMobile} />
      
      {(role === 'admin' || role === 'manager') && (
        <>
          <NavLink to="/team-management" icon={Users} label="Gestion d'Équipe" isMobile={isMobile} />
          <NavLink to="/reports" icon={BarChart3} label="Rapports & Analyses" isMobile={isMobile} />
        </>
      )}
      
      <NavLink to="/profile-settings" icon={Settings} label="Paramètres du Profil" isMobile={isMobile} />
      <Button onClick={handleSignOut} className="mt-4 w-full button-hover-effect">
        Déconnexion
      </Button>
    </nav>
  );
};

const Layout: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
              <span className="">LogiTeam</span>
            </Link>
          </div>
          <div className="flex-1 py-2">
            <SidebarNav />
          </div>
          <MadeWithDyad />
        </div>
      </div>

      {/* Mobile Header and Sidebar */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-sidebar px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden button-hover-effect"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground"
                >
                  <span className="sr-only">LogiTeam</span>
                </Link>
                <SidebarNav isMobile={true} />
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <span className="">LogiTeam</span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <Outlet /> {/* This is where the routed components will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default Layout;