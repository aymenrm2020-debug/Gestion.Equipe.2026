import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useOvertime } from '@/hooks/use-overtime';
import { useSession } from '@/components/SessionContextProvider';

const OvertimePage = () => {
  const { user } = useSession();
  const {
    userOvertimeRequests,
    pendingOvertimeRequests,
    isLoadingUserOvertimeRequests,
    isLoadingPendingOvertimeRequests,
    createOvertime,
    isCreatingOvertime,
    approveOvertime,
    isApprovingOvertime,
  } = useOvertime();

  const [overtimeDate, setOvertimeDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !overtimeDate || !hours) {
      // Add toast error here
      return;
    }

    createOvertime({
      user_id: user.id,
      date: format(overtimeDate, 'yyyy-MM-dd'),
      hours: parseFloat(hours),
      notes,
    });

    // Reset form
    setOvertimeDate(undefined);
    setHours('');
    setNotes('');
  };

  const handleApprove = (overtimeId: string) => {
    if (user?.id) {
      approveOvertime({ overtimeId, approvedByUserId: user.id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Heures Supplémentaires</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Suivi et gestion des heures supplémentaires.
      </p>

      {/* Request Form */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Nouvelle Demande d'Heures Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="overtimeDate">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !overtimeDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {overtimeDate ? format(overtimeDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={overtimeDate}
                    onSelect={setOvertimeDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hours">Nombre d'heures</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                placeholder="Ex: 8.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des détails sur les heures supplémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" className="md:col-span-2" disabled={isCreatingOvertime}>
              {isCreatingOvertime ? 'Soumission en cours...' : 'Soumettre la Demande'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Overtime Requests (for managers/approvers) */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Demandes en Attente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPendingOvertimeRequests ? (
            <p className="text-muted-foreground">Chargement des demandes en attente...</p>
          ) : pendingOvertimeRequests && pendingOvertimeRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heures</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOvertimeRequests.map((request: any) => ( // TODO: Type this properly
                    <TableRow key={request.id}>
                      <TableCell>{request.profiles?.first_name} {request.profiles?.last_name}</TableCell>
                      <TableCell>{format(new Date(request.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell>{request.hours}h</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.notes || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={isApprovingOvertime}
                        >
                          Approuver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune demande en attente.</p>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Historique de Mes Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUserOvertimeRequests ? (
            <p className="text-muted-foreground">Chargement de l'historique des demandes...</p>
          ) : userOvertimeRequests && userOvertimeRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heures</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Approuvé par</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOvertimeRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{format(new Date(request.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell>{request.hours}h</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.notes || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.approved_by_user_id ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.approved_by_user_id ? 'Approuvé' : 'En attente'}
                        </span>
                      </TableCell>
                      <TableCell>{request.approved_by_user_id || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune demande d'heures supplémentaires trouvée.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OvertimePage;