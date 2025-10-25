import React, { useState } from 'react';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import MyVisitsScreen from './components/MyVisitsScreen';
import Sidebar, { MenuItem } from './components/layout/Sidebar';
import VisitDetailScreen from './components/VisitDetailScreen';
import { MOCK_VISITS } from './constants';
import { Visit, VisitStatus } from './types';
import ToastContainer from './components/ToastContainer';
import type { ToastProps, ToastType } from './components/Toast';
import PreventorDashboard from './components/PreventorDashboard';
import RejectionDrawer from './components/RejectionDrawer';


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
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onDismiss'>[]>([]);
  const [rejectionDrawerState, setRejectionDrawerState] = useState<{ isOpen: boolean; visitId: string | null }>({ isOpen: false, visitId: null });

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };

  const onDismissToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
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
          // Change status to Programada if it was Pendiente. Otherwise, keep it as is (it's a reschedule).
          if (v.status === VisitStatus.Pendiente) {
            newStatus = VisitStatus.Programada;
          }
          return { ...v, scheduledDate: scheduledDate, status: newStatus };
        }
        return v;
      })
    );
    showToast(`Se ${visitIds.length > 1 ? 'programaron' : 'programó'} ${visitIds.length} visita${visitIds.length > 1 ? 's' : ''} con éxito.`);
  };

  const handleOpenRejectDrawer = (visitId: string) => {
    setRejectionDrawerState({ isOpen: true, visitId: visitId });
  };

  const handleConfirmRejection = (reason: string) => {
    if (rejectionDrawerState.visitId) {
        setVisits(prevVisits =>
            prevVisits.map(v => {
                if (v.id === rejectionDrawerState.visitId) {
                    return { ...v, status: VisitStatus.Rechazada, observations: `Rechazada por el preventor: ${reason}` };
                }
                return v;
            })
        );
        showToast('La visita ha sido rechazada.');
    }
    setRejectionDrawerState({ isOpen: false, visitId: null });
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
        <h1 className="text-3xl font-bold text-text-primary mb-4">{title}</h1>
        <p className="text-lg text-text-secondary">Esta sección está en desarrollo.</p>
      </div>
    );
    
    if (role === 'preventor') {
      if (view.screen === 'visitDetail' && view.visitId) {
        const visit = visits.find(v => v.id === view.visitId);
        if (visit) {
          const isReadOnly = visit.status === VisitStatus.Realizada;
          return <VisitDetailScreen visit={visit} onBack={handleBackToList} onSave={handleSaveVisitReport} isReadOnly={isReadOnly} showToast={showToast} />;
        }
      }

      switch (view.screen) {
        case 'Inicio':
          return <PreventorDashboard visits={visits} onNavigate={handleNavigateWithFilters} />;
        case 'Establecimientos':
          return <PlaceholderScreen title="Establecimientos" />;
        case 'Mis Visitas':
          return <MyVisitsScreen visits={visits} onViewVisit={handleViewVisit} onScheduleVisits={handleUpdateScheduledDate} onRejectVisit={handleOpenRejectDrawer} initialFilters={view.filters} showToast={showToast} />;
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
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
      <RejectionDrawer
          isOpen={rejectionDrawerState.isOpen}
          onClose={() => setRejectionDrawerState({ isOpen: false, visitId: null })}
          onConfirm={handleConfirmRejection}
          showToast={showToast}
      />
      <div className="flex h-screen bg-background overflow-hidden">
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
          <header className="md:hidden bg-surface shadow-sm z-10 flex items-center p-4 flex-shrink-0 gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 rounded-md text-text-primary hover:bg-border"
              aria-label="Abrir menú"
            >
              <span className="sr-only">Abrir menú</span>
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-xl text-text-primary">ART System</h1>
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