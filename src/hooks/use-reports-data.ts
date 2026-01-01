import { useQuery } from '@tanstack/react-query';
import { getMonthlyAttendanceRecords, getMonthlyLeaveRecords, AttendanceReportRecord, LeaveReportRecord } from '@/integrations/supabase/reports';
import { useSession } from '@/components/SessionContextProvider';
import { eachDayOfInterval, format, isWithinInterval, parseISO } from 'date-fns';

interface ProcessedAttendance {
  employeeName: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalDays: number;
}

interface ProcessedLeave {
  employeeName: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  endDate: string | null;
  durationDays: number;
}

export const useReportsData = (year: number, month: number) => {
  const { user } = useSession();

  const { data: attendanceRecords, isLoading: isLoadingAttendanceRecords } = useQuery<AttendanceReportRecord[]>({
    queryKey: ['monthlyAttendanceRecords', year, month],
    queryFn: () => getMonthlyAttendanceRecords(year, month),
    enabled: !!user?.id,
  });

  const { data: leaveRecords, isLoading: isLoadingLeaveRecords } = useQuery<LeaveReportRecord[]>({
    queryKey: ['monthlyLeaveRecords', year, month],
    queryFn: () => getMonthlyLeaveRecords(year, month),
    enabled: !!user?.id,
  });

  const isLoading = isLoadingAttendanceRecords || isLoadingLeaveRecords;

  const processedAttendanceReport: ProcessedAttendance[] = [];
  const processedLeaveReport: ProcessedLeave[] = [];

  if (attendanceRecords) {
    const attendanceSummary: { [key: string]: { present: number; absent: number; late: number; total: number; name: string } } = {};

    attendanceRecords.forEach(record => {
      // Accéder au premier élément du tableau profiles
      const employeeName = `${record.profiles?.[0]?.first_name || ''} ${record.profiles?.[0]?.last_name || ''}`.trim();
      const employeeId = record.user_id;

      if (!attendanceSummary[employeeId]) {
        attendanceSummary[employeeId] = { present: 0, absent: 0, late: 0, total: 0, name: employeeName };
      }

      attendanceSummary[employeeId].total++;
      if (record.status === 'present') {
        attendanceSummary[employeeId].present++;
      } else if (record.status === 'absent') {
        attendanceSummary[employeeId].absent++;
      } else if (record.status === 'late') {
        attendanceSummary[employeeId].late++;
      }
    });

    for (const id in attendanceSummary) {
      processedAttendanceReport.push({
        employeeName: attendanceSummary[id].name,
        presentDays: attendanceSummary[id].present,
        absentDays: attendanceSummary[id].absent,
        lateDays: attendanceSummary[id].late,
        totalDays: attendanceSummary[id].total,
      });
    }
  }

  if (leaveRecords) {
    leaveRecords.forEach(record => {
      // Accéder au premier élément du tableau profiles
      const employeeName = `${record.profiles?.[0]?.first_name || ''} ${record.profiles?.[0]?.last_name || ''}`.trim();
      const startDate = parseISO(record.start_date);
      const endDate = record.end_date ? parseISO(record.end_date) : startDate;
      const durationDays = eachDayOfInterval({ start: startDate, end: endDate }).length;

      processedLeaveReport.push({
        employeeName,
        type: record.type,
        status: record.status,
        startDate: format(startDate, 'dd/MM/yyyy'),
        endDate: record.end_date ? format(endDate, 'dd/MM/yyyy') : null,
        durationDays,
      });
    });
  }

  return {
    processedAttendanceReport,
    processedLeaveReport,
    isLoading,
  };
};