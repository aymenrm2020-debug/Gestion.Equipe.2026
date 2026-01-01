import React from 'react';

const CalendarPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendrier</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Visualisez les présences, absences et congés de l'équipe.
      </p>

      {/* Placeholder for Calendar Legend */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Légende des couleurs</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span className="text-gray-700 dark:text-gray-300">Présent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
            <span className="text-gray-700 dark:text-gray-300">En retard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span className="text-gray-700 dark:text-gray-300">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700 dark:text-gray-300">En congé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
            <span className="text-gray-700 dark:text-gray-300">Week-end</span>
          </div>
        </div>
      </div>

      {/* Placeholder for Employee View Calendar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Vue par employé (7 jours)</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Grille du calendrier par employé ici
        </div>
      </div>

      {/* Placeholder for Full Monthly Calendar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Calendrier Mensuel Complet</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Calendrier mensuel traditionnel ici
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;