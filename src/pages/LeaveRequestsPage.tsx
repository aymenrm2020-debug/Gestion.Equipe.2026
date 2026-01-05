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
import { showError } from '@/utils/toast';
import { LeaveRequest } from '@/integrations/supabase/leaveRequests'; // Import LeaveRequest interface

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
    cancelLeaveRequest,
    isCancellingLeaveRequest,
  } = useLeaveRequests();

  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [durationType, setDurationType] = useState<'full_day' | 'half_day_morning' | 'half_day_afternoon' | 'hourly'>('full_day');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !leaveType || !startDate) {
      showError('Veuillez remplir tous les champs obligatoires (Type de Congé, Date de Début).');
      return;
    }

    const requestData: Omit<LeaveRequest, 'id' | 'requested_at' | 'status' | 'approved_by_user_id' | 'approved_at'> = {
      user_id: user.id,
      type: leaveType,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      duration_type: durationType,
      reason,
    };

    if (durationType === 'hourly') {
      if (!startTime || !endTime) {
        showError('Veuillez spécifier les heures de début et de fin pour un congé horaire.');
        return;
      }
      requestData.start_time = startTime;
      requestData.end_time = endTime;
    } else if (durationType === 'half_day_morning') {
      requestData.start_time = '09:00:00'; // Example morning start
      requestData.end_time = '13:00:00';   // Example morning end
    } else if (durationType === 'half_day_afternoon') {
      requestData.start_time = '14:00:00'; // Example afternoon start
      requestData.end_time = '18:00:00';   // Example afternoon end
    }

    createLeaveRequest(requestData);

    // Reset form
    setLeaveType('');
    setStartDate(undefined);
    setEndDate(undefined);
    setDurationType('full_day');
    setStartTime('');
    setEndTime('');
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

  const handleCancel = (requestId: string) => {
    cancelLeaveRequest(requestId);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Absences & Congés</h1>
      <p className="text-lg text-muted-foreground">
        Gérez les demandes d'absence, de congés et d'autorisations.
      </p>

      {/* Request Form */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nouvelle Demande</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="leaveType">Type de Congé</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType" className="button-hover-effect">
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
              <Label htmlFor="durationType">Durée</Label>
              <Select value={durationType} onValueChange={(value: 'full_day' | 'half_day_morning' | 'half_day_afternoon' | 'hourly') => setDurationType(value)}>
                <SelectTrigger id="durationType" className="button-hover-effect">
                  <SelectValue placeholder="Sélectionner la durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_day">Journée complète</SelectItem>
                  <SelectItem value="half_day_morning">Demi-journée (Matin)</SelectItem>
                  <SelectItem value="half_day_afternoon">Demi-journée (Après-midi)</SelectItem>
                  <SelectItem value="hourly">Par heure</SelectItem>
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
                      "w-full justify-start text-left font-normal button-hover-effect",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card text-card-foreground border border-border rounded-md shadow-lg">
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

            {(durationType === 'full_day' || durationType === 'half_day_morning' || durationType === 'half_day_afternoon') && (
              <div className="grid gap-2">
                <Label htmlFor="endDate">Date de Fin (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal button-hover-effect",
                        !endDate && "text-muted-foreground"
                      )}
                      disabled={!startDate || durationType !== 'full_day'} // Disable if not full_day
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card text-card-foreground border border-border rounded-md shadow-lg">
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
            )}

            {durationType === 'hourly' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Heure de Début</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Heure de Fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                  />
                </div>
              </>
            )}

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="reason">Raison</Label>
              <Textarea
                id="reason"
                placeholder="Décrivez la raison de votre absence/congé..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-border focus-visible:ring-ring focus-visible:ring-offset-background"
              />
            </div>

            <Button type="submit" className="md:col-span-2 button-hover-effect" disabled={isCreatingLeaveRequest}>
              {isCreatingLeaveRequest ? 'Soumission en cours...' : 'Soumettre la Demande'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Requests (for managers/approvers) */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Demandes en Attente</CardTitle>
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
                    <TableHead>Durée</TableHead>
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
                      <TableCell>
                        {request.duration_type === 'hourly' ? `${request.start_time?.substring(0, 5)} - ${request.end_time?.substring(0, 5)}` :
                         request.duration_type === 'half_day_morning' ? 'Demi-journée (Matin)' :
                         request.duration_type === 'half_day_afternoon' ? 'Demi-journée (Après-midi)' :
                         'Journée complète'}
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
                            className="button-hover-effect"
                          >
                            Approuver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            disabled={isUpdatingLeaveRequestStatus}
                            className="button-hover-effect"
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
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Historique de Mes Demandes</CardTitle>
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
                    <TableHead>Durée</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Demandé le</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>
                        {request.duration_type === 'hourly' ? `${request.start_time?.substring(0, 5)} - ${request.end_time?.substring(0, 5)}` :
                         request.duration_type === 'half_day_morning' ? 'Demi-journée (Matin)' :
                         request.duration_type === 'half_day_afternoon' ? 'Demi-journée (Après-midi)' :
                         'Journée complète'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.reason || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          request.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(request.requested_at!), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(request.id!)}
                            disabled={isCancellingLeaveRequest}
                            className="button-hover-effect"
                          >
                            Annuler
                          </Button>
                        )}
                      </TableCell>
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