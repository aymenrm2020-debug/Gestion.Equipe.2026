import React from 'react';

const TeamManagementPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion d'Équipe</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Gérez les profils des employés et les équipes.
      </p>

      {/* Placeholder for Employee Profiles */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Profils des Employés</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Liste des employés avec options de modification/suppression
        </div>
      </div>

      {/* Placeholder for Team Management */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Gestion des Équipes</h2>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          Création, modification et suppression d'équipes
        </div>
      </div>
    </div>
  );
};

export default TeamManagementPage;