import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useReportsData } from '@/hooks/use-reports-data';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReportsPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));

  const { processedAttendanceReport, processedLeaveReport, isLoading } = useReportsData(
    parseInt(selectedYear),
    parseInt(selectedMonth)
  );

  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i)); // Current year +/- 2
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: format(new Date(currentYear, i, 1), 'MMMM', { locale: fr }),
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Rapports & Analyses</h1>
      <p className="text-lg text-muted-foreground">
        Générez des rapports détaillés et des analyses.
      </p>

      {/* Filters */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Filtres de Rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="select-month">Mois</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="select-month" className="button-hover-effect">
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="select-year">Année</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="select-year" className="button-hover-effect">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Attendance Report */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Rapport de Présence Mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement du rapport de présence...
            </div>
          ) : processedAttendanceReport.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Jours Présents</TableHead>
                    <TableHead>Jours Absents</TableHead>
                    <TableHead>Jours en Retard</TableHead>
                    <TableHead>Total Jours Pointés</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedAttendanceReport.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.presentDays}</TableCell>
                      <TableCell>{record.absentDays}</TableCell>
                      <TableCell>{record.lateDays}</TableCell>
                      <TableCell>{record.totalDays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée de présence pour ce mois.</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Leave Report */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Rapport de Congés Mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement du rapport de congés...
            </div>
          ) : processedLeaveReport.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de Début</TableHead>
                    <TableHead>Date de Fin</TableHead>
                    <TableHead>Durée (jours)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedLeaveReport.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.startDate}</TableCell>
                      <TableCell>{record.endDate || '-'}</TableCell>
                      <TableCell>{record.durationDays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée de congés pour ce mois.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;