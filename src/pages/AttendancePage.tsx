import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAttendance } from '@/hooks/use-attendance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AttendancePage = () => {
  const {
    todayAttendance,
    attendanceHistory,
    isLoadingTodayAttendance,
    isLoadingAttendanceHistory,
    isCheckingIn,
    isCheckingOut,
    handleCheckIn,
    handleCheckOut,
  } = useAttendance();

  const isCheckedIn = todayAttendance && todayAttendance.check_in && !todayAttendance.check_out;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Système de Pointage</h1>
      <p className="text-lg text-muted-foreground">
        Enregistrez et gérez vos heures d'entrée et de sortie.
      </p>

      {/* Manual Punching */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Pointage Manuel</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {isLoadingTodayAttendance ? (
            <p className="text-muted-foreground">Chargement de l'état du pointage...</p>
          ) : (
            <>
              {isCheckedIn ? (
                <p className="text-lg text-green-600 dark:text-green-400">
                  Vous êtes actuellement pointé(e) depuis {format(new Date(todayAttendance.check_in!), 'HH:mm', { locale: fr })}.
                </p>
              ) : todayAttendance?.check_out ? (
                <p className="text-lg text-blue-600 dark:text-blue-400">
                  Vous avez terminé votre journée à {format(new Date(todayAttendance.check_out!), 'HH:mm', { locale: fr })}.
                </p>
              ) : (
                <p className="text-lg text-muted-foreground">
                  Vous n'êtes pas encore pointé(e) aujourd'hui.
                </p>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn || isCheckingIn || isCheckingOut}
                  className="px-6 py-3 text-lg button-hover-effect"
                >
                  {isCheckingIn ? 'Pointage en cours...' : 'Pointer l\'entrée'}
                </Button>
                <Button
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn || isCheckingIn || isCheckingOut}
                  variant="secondary"
                  className="px-6 py-3 text-lg button-hover-effect"
                >
                  {isCheckingOut ? 'Pointage en cours...' : 'Pointer la sortie'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Historique des Pointages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAttendanceHistory ? (
            <p className="text-muted-foreground">Chargement de l'historique...</p>
          ) : attendanceHistory && attendanceHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure d'entrée</TableHead>
                    <TableHead>Heure de sortie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell>{record.check_in ? format(new Date(record.check_in), 'HH:mm', { locale: fr }) : '-'}</TableCell>
                      <TableCell>{record.check_out ? format(new Date(record.check_out), 'HH:mm', { locale: fr }) : '-'}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun historique de pointage trouvé.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;