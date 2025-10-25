import React from 'react';
import { PreventorIcon } from './icons/PreventorIcon';
import { BackofficeIcon } from './icons/BackofficeIcon';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'preventor' | 'backoffice') => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-text-primary p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Sistema de Gestión de Visitas</h1>
        <p className="text-lg text-text-secondary">Aseguradora de Riesgos del Trabajo</p>
      </header>
      <main className="w-full max-w-4xl">
        <p className="text-center text-xl mb-8">Por favor, seleccione su rol para continuar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard
            title="Preventor"
            description="Consultar agenda, acceder a información de clientes y cargar reportes de visitas."
            icon={<PreventorIcon className="h-16 w-16 text-primary" />}
            onClick={() => onSelectRole('preventor')}
          />
          <RoleCard
            title="Backoffice"
            description="Programar visitas, gestionar cuentas de clientes y procesar informes de preventores."
            icon={<BackofficeIcon className="h-16 w-16 text-primary" />}
            onClick={() => onSelectRole('backoffice')}
          />
        </div>
      </main>
      <footer className="mt-16 text-text-secondary">
        © {new Date().getFullYear()} ART Solutions Inc. Todos los derechos reservados.
      </footer>
    </div>
  );
};

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-surface shadow-md rounded-lg p-8 text-left flex flex-col items-center text-center transform hover:scale-105 hover:bg-background transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
    >
      <div className="mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary">{description}</p>
    </button>
  );
};

export default RoleSelectionScreen;