import React from 'react';

const ReportsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rapports & Analyses</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Générez des rapports détaillés et des analyses.
      </p>

      {/* Placeholder for Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Filtres Avancés</h2>
        <div className="h-32 flex items-center justify-center text-muted-foreground">
          Options de filtrage pour les rapports
        </div>
      </div>

      {/* Placeholder for Report Display */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Rapports Détaillés</h2>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Affichage des rapports avec options d'export (PDF, Excel)
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;