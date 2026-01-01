import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay, isWeekend, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCalendarData } from '@/hooks/use-calendar-data';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
  const [month, setMonth] = useState<Date>(new Date());
  const { calendarEvents, isLoading } = useCalendarData(month);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
  };

  const renderDay = (day: Date) => {
    const dayEvents = calendarEvents.filter(event => isSameDay(event.date, day));
    const isCurrentMonth = day.getMonth() === month.getMonth();
    const isToday = isSameDay(day, new Date());

    const dayClasses = [
      "relative p-1 text-center",
      isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
      isToday ? "bg-primary text-primary-foreground rounded-md" : "",
      isWeekend(day) ? "bg-secondary dark:bg-secondary" : "", // Use secondary for weekend background
    ].join(" ");

    return (
      <div className={dayClasses}>
        <span className="text-sm font-medium">{format(day, 'd')}</span>
        <div className="mt-1 flex flex-col items-center gap-0.5">
          {dayEvents.map((event, index) => {
            let colorClass = '';
            let tooltipContent = '';

            if (event.type === 'attendance') {
              if (event.status === 'present') {
                colorClass = 'bg-green-500';
                tooltipContent = `${event.employeeName} : Présent`;
              } else if (event.status === 'late') {
                colorClass = 'bg-orange-500';
                tooltipContent = `${event.employeeName} : En retard`;
              } else if (event.status === 'absent') {
                colorClass = 'bg-red-500';
                tooltipContent = `${event.employeeName} : Absent`;
              }
            } else if (event.type === 'leave') {
              colorClass = 'bg-blue-500';
              tooltipContent = `${event.employeeName} : En congé`;
            } else if (event.type === 'holiday') {
              colorClass = 'bg-purple-500';
              tooltipContent = `Jour férié : ${event.name}`;
            }

            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <span className={`h-2 w-2 rounded-full ${colorClass} cursor-pointer transition-transform duration-200 hover:scale-125`} />
                </PopoverTrigger>
                <PopoverContent className="text-sm p-2 bg-card text-card-foreground border border-border rounded-md shadow-lg">
                  {tooltipContent}
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Calendrier</h1>
      <p className="text-lg text-muted-foreground">
        Visualisez les présences, absences, congés et jours fériés de l'équipe.
      </p>

      {/* Calendar Legend */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Légende des couleurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              <span className="text-muted-foreground">Présent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
              <span className="text-muted-foreground">En retard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              <span className="text-muted-foreground">En congé (Approuvé)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
              <span className="text-muted-foreground">Jour Férié</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
              <span className="text-muted-foreground">Week-end</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Monthly Calendar */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Calendrier Mensuel Complet</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Chargement du calendrier...
            </div>
          ) : (
            <Calendar
              mode="single"
              month={month}
              onMonthChange={handleMonthChange}
              selected={new Date()} // Highlight today's date
              className="rounded-md border bg-background"
              components={{
                DayContent: ({ date }) => renderDay(date),
                Caption: ({ displayMonth }) => (
                  <div className="flex justify-between items-center p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMonthChange(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))}
                      className="button-hover-effect"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold">
                      {format(displayMonth, 'MMMM yyyy', { locale: fr })}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMonthChange(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))}
                      className="button-hover-effect"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              }}
              locale={fr}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;