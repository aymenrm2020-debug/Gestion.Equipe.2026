import React from 'react';

const AttendancePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Système de Pointage</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Enregistrez et gérez les heures d'entrée et de sortie.
      </p>

      {/* Placeholder for Manual Punching */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Pointage Manuel</h2>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          Formulaire de pointage manuel ici
        </div>
      </div>

      {/* Placeholder for Attendance History/Modification */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Historique et Modification</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Tableau de l'historique des pointages avec options de modification
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;