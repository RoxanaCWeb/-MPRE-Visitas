import React, { useState } from 'react';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import MyVisitsScreen from './components/MyVisitsScreen';
import Sidebar, { MenuItem } from './components/layout/Sidebar';
import VisitDetailScreen from './components/VisitDetailScreen';
import { MOCK_VISITS } from './constants';
import { Visit, VisitStatus } from './types';
import Toast from './components/Toast';
import PreventorDashboard from './components/PreventorDashboard';


// Import icons
import { HomeIcon } from './components/icons/HomeIcon';
import { BuildingIcon } from './components/icons/BuildingIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { MenuIcon } from './components/icons/MenuIcon';

type Role = 'none' | 'preventor' | 'backoffice';
type VisitFilters = {
    clientName?: string;
    contract?: string;
    establishment?: string;
    visitDate?: string;
    deadlineDate?: string;
    scheduledDate?: string;
    status?: string;
    showUpcomingOnly?: boolean;
    showOverdueOnly?: boolean;
};
type View = {
  screen: string;
  visitId?: string;
  filters?: VisitFilters;
}
type ToastState = {
    message: string;
    type: 'success';
} | null;

const preventorMenuItems: MenuItem[] = [
  { label: 'Inicio', icon: <HomeIcon className="h-6 w-6" /> },
  { label: 'Establecimientos', icon: <BuildingIcon className="h-6 w-6" /> },
  { label: 'Mis Visitas', icon: <CalendarIcon className="h-6 w-6" /> },
];

const backofficeMenuItems: MenuItem[] = [
  { label: 'Inicio', icon: <HomeIcon className="h-6 w-6" /> },
  { label: 'Establecimientos', icon: <BuildingIcon className="h-6 w-6" /> },
  { label: 'Visitas', icon: <CalendarIcon className="h-6 w-6" /> },
  { label: 'Proveedores', icon: <BriefcaseIcon className="h-6 w-6" /> },
  { label: 'Usuarios', icon: <UsersIcon className="h-6 w-6" /> },
];


const App: React.FC = () => {
  const [role, setRole] = useState<Role>('none');
  const [view, setView] = useState<View>({ screen: 'Inicio' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
        setToast(null);
    }, 3000); // Hide after 3 seconds
  };

  const handleSelectRole = (selectedRole: 'preventor' | 'backoffice') => {
    setRole(selectedRole);
    setView({ screen: 'Inicio' });
  };

  const handleGoBack = () => {
    setRole('none');
    setIsMobileSidebarOpen(false);
  };

  const handleMenuItemSelect = (label: string) => {
    setView({ screen: label });
    setIsMobileSidebarOpen(false);
  };

  const handleNavigateWithFilters = (screen: string, filters: VisitFilters) => {
    setView({ screen, filters });
  };
  
  const handleViewVisit = (visitId: string) => {
    setView({ screen: 'visitDetail', visitId });
  };

  const handleBackToList = () => {
    setView({ screen: 'Mis Visitas' });
  };
  
  const handleUpdateScheduledDate = (visitIds: string[], scheduledDate: string) => {
    setVisits(prevVisits => 
      prevVisits.map(v => {
        if (visitIds.includes(v.id)) {
          let newStatus = v.status;
          // Only change status if it's a schedulable type
          if (v.status === VisitStatus.Pendiente) {
            newStatus = VisitStatus.Programada;
          } else if (v.status === VisitStatus.Programada || v.status === VisitStatus.Reprogramada) {
            newStatus = VisitStatus.Reprogramada;
          }
          return { ...v, scheduledDate: scheduledDate, status: newStatus };
        }
        return v;
      })
    );
    showToast(`Se ${visitIds.length > 1 ? 'programaron' : 'programó'} ${visitIds.length} visita${visitIds.length > 1 ? 's' : ''} con éxito.`);
  };

  const handleSaveVisitReport = (reportData: Partial<Visit> & { id: string }) => {
    setVisits(prevVisits =>
      prevVisits.map(v => {
        if (v.id === reportData.id) {
          const newVisit = { ...v, ...reportData, status: VisitStatus.Realizada };
          // Implicit scheduling logic
          if (!newVisit.scheduledDate && newVisit.visitDate) {
            newVisit.scheduledDate = newVisit.visitDate;
          }
          return newVisit;
        }
        return v;
      })
    );
    handleBackToList(); // Go back after saving
    showToast('Acta de visita guardada con éxito.');
  };


  const renderContent = () => {
    const PlaceholderScreen = ({ title }: { title: string }) => (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-lg text-gray-700">Esta sección está en desarrollo.</p>
      </div>
    );
    
    if (role === 'preventor') {
      if (view.screen === 'visitDetail' && view.visitId) {
        const visit = visits.find(v => v.id === view.visitId);
        if (visit) {
          const isReadOnly = visit.status === VisitStatus.Realizada;
          return <VisitDetailScreen visit={visit} onBack={handleBackToList} onSave={handleSaveVisitReport} isReadOnly={isReadOnly} />;
        }
      }

      switch (view.screen) {
        case 'Inicio':
          return <PreventorDashboard visits={visits} onNavigate={handleNavigateWithFilters} />;
        case 'Establecimientos':
          return <PlaceholderScreen title="Establecimientos" />;
        case 'Mis Visitas':
          return <MyVisitsScreen visits={visits} onViewVisit={handleViewVisit} onScheduleVisits={handleUpdateScheduledDate} initialFilters={view.filters} />;
        default:
          return <PlaceholderScreen title="Página no encontrada" />;
      }
    }
    
    if (role === 'backoffice') {
      return <PlaceholderScreen title={view.screen} />;
    }

    return null;
  };
  
  if (role === 'none') {
    return <RoleSelectionScreen onSelectRole={handleSelectRole} />;
  }

  const menuItems = role === 'preventor' ? preventorMenuItems : backofficeMenuItems;

  return (
    <>
      <Toast 
          message={toast?.message}
          type={toast?.type}
          onClose={() => setToast(null)}
      />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar 
          menuItems={menuItems} 
          onRoleChange={handleGoBack} 
          activeItemLabel={view.screen === 'visitDetail' ? 'Mis Visitas' : view.screen}
          onMenuItemSelect={handleMenuItemSelect}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="md:hidden bg-white shadow-sm z-10 flex items-center p-4 flex-shrink-0 gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 rounded-md text-primary hover:bg-gray-200"
              aria-label="Abrir menú"
            >
              <span className="sr-only">Abrir menú</span>
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-xl text-primary">ART System</h1>
          </header>

          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;