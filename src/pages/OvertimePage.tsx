import React from 'react';

const OvertimePage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Heures Supplémentaires</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Suivi et gestion des heures supplémentaires.
      </p>

      {/* Placeholder for Overtime Calculation */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Calcul des Heures Supplémentaires</h2>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          Affichage du calcul automatique des heures supplémentaires
        </div>
      </div>

      {/* Placeholder for Overtime History/Graphs */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Historique et Graphiques</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Tableaux et graphiques détaillés des heures supplémentaires
        </div>
      </div>
    </div>
  );
};

export default OvertimePage;