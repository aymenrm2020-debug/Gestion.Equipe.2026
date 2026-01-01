import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Clock, TrendingUp } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data"; // Import the new hook

const Dashboard = () => {
  const { session, user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const {
    totalEmployees,
    isLoadingEmployees,
    todayAttendance,
    isLoadingAttendance,
    monthlyOvertime,
    isLoadingOvertime,
    isLoading: dashboardDataLoading,
  } = useDashboardData();

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate('/login');
    }
  }, [session, sessionLoading, navigate]);

  if (sessionLoading || dashboardDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Should be redirected to login by SessionContextProvider
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">
        Bienvenue, {user?.email}!
      </h1>
      <p className="text-lg text-muted-foreground">
        Vue d'overview de votre équipe logistique.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingEmployees ? '...' : totalEmployees ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents Aujourd'hui</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAttendance ? '...' : todayAttendance ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              0 en retard
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Supplémentaires (Mois)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingOvertime ? '...' : `${monthlyOvertime?.toFixed(1) ?? 0}h`}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendances Mensuelles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stable</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">
              Performance générale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for charts and alerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 card-hover-effect">
          <CardHeader>
            <CardTitle>Statistiques de Présence Mensuelles</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Chart placeholder */}
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Graphique des tendances ici
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 card-hover-effect">
          <CardHeader>
            <CardTitle>Alertes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Alerts list placeholder */}
            <ul className="space-y-2 text-muted-foreground">
              <li>Aucune alerte pour le moment.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;