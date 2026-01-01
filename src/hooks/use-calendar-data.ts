import { useQuery } from '@tanstack/react-query';
import { getCalendarAttendances, getCalendarLeaveRequests, getCalendarHolidays, CalendarAttendance, CalendarLeaveRequest, Holiday } from '@/integrations/supabase/calendar';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { useSession } from '@/components/SessionContextProvider';

interface CalendarEvent {
  date: Date;
  type: 'attendance' | 'leave' | 'holiday';
  status?: 'present' | 'absent' | 'late' | 'approved';
  name?: string; // For holidays
  employeeName?: string; // For attendance/leave
}

export const useCalendarData = (month: Date) => {
  const { user } = useSession();
  const startDate = startOfMonth(month);
  const endDate = endOfMonth(month);

  const { data: attendances, isLoading: isLoadingAttendances } = useQuery<CalendarAttendance[]>({
    queryKey: ['calendarAttendances', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => getCalendarAttendances(startDate, endDate),
    enabled: !!user?.id,
  });

  const { data: leaveRequests, isLoading: isLoadingLeaveRequests } = useQuery<CalendarLeaveRequest[]>({
    queryKey: ['calendarLeaveRequests', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => getCalendarLeaveRequests(startDate, endDate),
    enabled: !!user?.id,
  });

  const { data: holidays, isLoading: isLoadingHolidays } = useQuery<Holiday[]>({
    queryKey: ['calendarHolidays', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
    queryFn: () => getCalendarHolidays(startDate, endDate),
    enabled: !!user?.id,
  });

  const isLoading = isLoadingAttendances || isLoadingLeaveRequests || isLoadingHolidays;

  const calendarEvents: CalendarEvent[] = [];

  if (attendances) {
    attendances.forEach(att => {
      calendarEvents.push({
        date: new Date(att.date),
        type: 'attendance',
        status: att.status,
        // Accéder au premier élément du tableau profiles
        employeeName: `${att.profiles?.[0]?.first_name || ''} ${att.profiles?.[0]?.last_name || ''}`.trim(),
      });
    });
  }

  if (leaveRequests) {
    leaveRequests.forEach(lr => {
      const start = new Date(lr.start_date);
      const end = lr.end_date ? new Date(lr.end_date) : start;
      eachDayOfInterval({ start, end }).forEach(day => {
        calendarEvents.push({
          date: day,
          type: 'leave',
          status: 'approved',
          // Accéder au premier élément du tableau profiles
          employeeName: `${lr.profiles?.[0]?.first_name || ''} ${lr.profiles?.[0]?.last_name || ''}`.trim(),
        });
      });
    });
  }

  if (holidays) {
    holidays.forEach(hol => {
      calendarEvents.push({
        date: new Date(hol.date),
        type: 'holiday',
        name: hol.name,
      });
    });
  }

  return {
    calendarEvents,
    isLoading,
  };
};