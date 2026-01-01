import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLeaveRequests } from '@/hooks/use-leave-requests';
import { useSession } from '@/components/SessionContextProvider';

const LeaveRequestsPage = () => {
  const { user } = useSession();
  const {
    userLeaveRequests,
    pendingLeaveRequests,
    isLoadingUserLeaveRequests,
    isLoadingPendingLeaveRequests,
    createLeaveRequest,
    isCreatingLeaveRequest,
    updateLeaveRequestStatus,
    isUpdatingLeaveRequestStatus,
  } = useLeaveRequests();

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !leaveType || !startDate) {
      // Add toast error here
      return;
    }

    createLeaveRequest({
      user_id: user.id,
      type: leaveType,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      reason,
    });

    // Reset form
    setLeaveType('');
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
  };

  const handleApprove = (requestId: string) => {
    if (user?.id) {
      updateLeaveRequestStatus({ requestId, status: 'approved', approvedByUserId: user.id });
    }
  };

  const handleReject = (requestId: string) => {
    if (user?.id) {
      updateLeaveRequestStatus({ requestId, status: 'rejected', approvedByUserId: user.id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Absences & Congés</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Gérez les demandes d'absence, de congés et d'autorisations.
      </p>

      {/* Request Form */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Nouvelle Demande</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="leaveType">Type de Congé</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacances</SelectItem>
                  <SelectItem value="sick_leave">Arrêt Maladie</SelectItem>
                  <SelectItem value="personal_leave">Congé Personnel</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate">Date de Début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">Date de Fin (optionnel)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={fr}
                    fromDate={startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="reason">Raison</Label>
              <Textarea
                id="reason"
                placeholder="Décrivez la raison de votre absence/congé..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button type="submit" className="md:col-span-2" disabled={isCreatingLeaveRequest}>
              {isCreatingLeaveRequest ? 'Soumission en cours...' : 'Soumettre la Demande'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Requests (for managers/approvers) */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Demandes en Attente</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPendingLeaveRequests ? (
            <p className="text-muted-foreground">Chargement des demandes en attente...</p>
          ) : pendingLeaveRequests && pendingLeaveRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Demandé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLeaveRequests.map((request: any) => ( // TODO: Type this properly
                    <TableRow key={request.id}>
                      <TableCell>{request.profiles?.first_name} {request.profiles?.last_name}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })}
                        {request.end_date && ` - ${format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}`}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason || '-'}</TableCell>
                      <TableCell>{format(new Date(request.requested_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            disabled={isUpdatingLeaveRequestStatus}
                          >
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            disabled={isUpdatingLeaveRequestStatus}
                          >
                            Rejeter
                          </Button>
                        </div>
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
          {isLoadingUserLeaveRequests ? (
            <p className="text-muted-foreground">Chargement de l'historique des demandes...</p>
          ) : userLeaveRequests && userLeaveRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Demandé le</TableHead>
                    <TableHead>Approuvé par</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {format(new Date(request.start_date), 'dd/MM/yyyy', { locale: fr })}
                        {request.end_date && ` - ${format(new Date(request.end_date), 'dd/MM/yyyy', { locale: fr })}`}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(request.requested_at!), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                      <TableCell>{request.approved_by_user_id || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune demande de congé trouvée.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestsPage;