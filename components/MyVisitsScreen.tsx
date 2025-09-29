import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CLIENTS } from '../constants';
import { Visit, VisitStatus } from '../types';
import { FilterIcon } from './icons/FilterIcon';
import { XIcon } from './icons/XIcon';
import VisitActions from './VisitActions';
import { CalendarPlusIcon } from './icons/CalendarPlusIcon';
import ScheduleDrawer from './ScheduleDrawer';

const statusColors: { [key in VisitStatus]: string } = {
  [VisitStatus.Pendiente]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [VisitStatus.Programada]: 'bg-purple-100 text-purple-800 border-purple-300',
  [VisitStatus.Realizada]: 'bg-green-100 text-green-800 border-green-300',
  [VisitStatus.Fallida]: 'bg-red-100 text-red-800 border-red-300',
  [VisitStatus.Reprogramada]: 'bg-blue-100 text-blue-800 border-blue-300',
};

const filterLabels: { [key: string]: string } = {
  clientName: 'Cliente',
  contract: 'Contrato',
  establishment: 'Establecimiento',
  visitDate: 'Fecha Visita',
  deadlineDate: 'Fecha Límite',
  scheduledDate: 'Fecha Programada',
  status: 'Estado',
  showUpcomingOnly: 'Próximos a vencer',
  showOverdueOnly: 'Vencidas',
};

const getDeadlineStatus = (dateStr: string, status: VisitStatus): 'overdue' | 'upcoming' | 'normal' => {
    if (!dateStr || ![VisitStatus.Pendiente, VisitStatus.Programada, VisitStatus.Reprogramada].includes(status)) return 'normal';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);
  
    if (deadline < today) {
      return 'overdue';
    }
  
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(0, 0, 0, 0);
  
    if (deadline >= today && deadline <= sevenDaysFromNow) {
      return 'upcoming';
    }
  
    return 'normal';
};

const isSchedulable = (status: VisitStatus) => {
    return [VisitStatus.Pendiente, VisitStatus.Programada, VisitStatus.Reprogramada].includes(status);
};

const StatusBadge: React.FC<{ status: VisitStatus }> = ({ status }) => {
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap ${statusColors[status]}`}>
      {status}
    </span>
  );
};

interface MyVisitsScreenProps {
  visits: Visit[];
  onViewVisit: (visitId: string) => void;
  onScheduleVisits: (visitIds: string[], date: string) => void;
  initialFilters?: any;
}

const MyVisitsScreen: React.FC<MyVisitsScreenProps> = ({ visits, onViewVisit, onScheduleVisits, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    clientName: '',
    contract: '',
    establishment: '',
    visitDate: '',
    deadlineDate: '',
    scheduledDate: '',
    status: '',
    showUpcomingOnly: false,
    showOverdueOnly: false,
    ...initialFilters,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedVisitIds, setSelectedVisitIds] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visitsToSchedule, setVisitsToSchedule] = useState<string[]>([]);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({
      clientName: '',
      contract: '',
      establishment: '',
      visitDate: '',
      deadlineDate: '',
      scheduledDate: '',
      status: '',
      showUpcomingOnly: false,
      showOverdueOnly: false,
    });
  };

  const handleRemoveFilter = (filterKey: keyof typeof filters) => {
    const filterValue = filters[filterKey];
    if (typeof filterValue === 'boolean') {
        setFilters(prev => ({ ...prev, [filterKey]: false }));
    } else {
        setFilters(prev => ({ ...prev, [filterKey]: '' }));
    }
  };

  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(([, value]) => {
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== '';
    });
  }, [filters]);

  const activeFilterCount = activeFilters.length;

  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
      const clientMatch = filters.clientName ? visit.clientName === filters.clientName : true;
      const contractMatch = visit.contract.toLowerCase().includes(filters.contract.toLowerCase());
      const establishmentMatch = visit.establishment.toLowerCase().includes(filters.establishment.toLowerCase());
      const statusMatch = filters.status ? visit.status === filters.status : true;
      const visitDateMatch = filters.visitDate ? visit.visitDate === filters.visitDate : true;
      const deadlineDateMatch = filters.deadlineDate ? visit.deadlineDate === filters.deadlineDate : true;
      const scheduledDateMatch = filters.scheduledDate ? visit.scheduledDate === filters.scheduledDate : true;
      
      const deadlineStatus = getDeadlineStatus(visit.deadlineDate, visit.status);
      const upcomingMatch = filters.showUpcomingOnly ? deadlineStatus === 'upcoming' : true;
      const overdueMatch = filters.showOverdueOnly ? deadlineStatus === 'overdue' : true;
      
      return clientMatch && contractMatch && establishmentMatch && statusMatch && visitDateMatch && deadlineDateMatch && upcomingMatch && scheduledDateMatch && overdueMatch;
    });
  }, [filters, visits]);
  
  const schedulableVisitsInFilter = useMemo(() => 
    filteredVisits.filter(v => isSchedulable(v.status)), 
    [filteredVisits]
  );

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
        const isIndeterminate = selectedVisitIds.size > 0 && selectedVisitIds.size < schedulableVisitsInFilter.length;
        selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedVisitIds, schedulableVisitsInFilter.length]);


  const handleSelectVisit = (visitId: string) => {
    setSelectedVisitIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(visitId)) {
        newSet.delete(visitId);
      } else {
        newSet.add(visitId);
      }
      return newSet;
    });
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const schedulableIds = schedulableVisitsInFilter.map(v => v.id);
      setSelectedVisitIds(new Set(schedulableIds));
    } else {
      setSelectedVisitIds(new Set());
    }
  };
  
  const handleOpenScheduler = (visitIds: string[]) => {
    if (visitIds.length > 0) {
      setVisitsToSchedule(visitIds);
      setIsDrawerOpen(true);
    }
  };

  const handleScheduleSubmit = (date: string) => {
    onScheduleVisits(visitsToSchedule, date);
    setIsDrawerOpen(false);
    setVisitsToSchedule([]);
    setSelectedVisitIds(new Set()); // Clear selection after scheduling
  };
  
  const areAllSelected = schedulableVisitsInFilter.length > 0 && selectedVisitIds.size === schedulableVisitsInFilter.length;

  const baseInputClasses = "p-2 border border-gray-300 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary";

  const FilterControls = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <select name="clientName" value={filters.clientName} onChange={handleFilterChange} className={`${baseInputClasses} text-primary`}>
        <option value="">Todos los Clientes</option>
        {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="text" name="contract" placeholder="Contrato" value={filters.contract} onChange={handleFilterChange} className={`${baseInputClasses} text-primary`} />
      <input type="text" name="establishment" placeholder="Establecimiento" value={filters.establishment} onChange={handleFilterChange} className={`${baseInputClasses} text-primary`} />
      <select name="status" value={filters.status} onChange={handleFilterChange} className={`${baseInputClasses} text-primary`}>
        <option value="">Todos los Estados</option>
        {Object.values(VisitStatus).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div>
        <label htmlFor="visitDate" className="block text-sm font-medium text-gray-500 mb-1">
          Fecha Visita
        </label>
        <input
          type="date"
          id="visitDate"
          name="visitDate"
          value={filters.visitDate}
          onChange={handleFilterChange}
          className={`${baseInputClasses} ${!filters.visitDate ? 'text-gray-400' : 'text-primary'}`}
        />
      </div>
      <div>
        <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-500 mb-1">
          Fecha Límite
        </label>
        <input
          type="date"
          id="deadlineDate"
          name="deadlineDate"
          value={filters.deadlineDate}
          onChange={handleFilterChange}
          className={`${baseInputClasses} ${!filters.deadlineDate ? 'text-gray-400' : 'text-primary'}`}
        />
      </div>
       <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-500 mb-1">
          Fecha Programada
        </label>
        <input
          type="date"
          id="scheduledDate"
          name="scheduledDate"
          value={filters.scheduledDate}
          onChange={handleFilterChange}
          className={`${baseInputClasses} ${!filters.scheduledDate ? 'text-gray-400' : 'text-primary'}`}
        />
      </div>
      <div className="sm:col-span-2 flex flex-col pt-2 space-y-2">
        <div className="flex items-center">
            <input
              type="checkbox"
              id="showUpcomingOnly"
              name="showUpcomingOnly"
              checked={filters.showUpcomingOnly}
              onChange={handleFilterChange}
              className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary"
            />
            <label htmlFor="showUpcomingOnly" className="ml-2 block text-sm font-medium text-gray-800">
              Mostrar sólo próximos a vencer (7 días)
            </label>
        </div>
        <div className="flex items-center">
            <input
              type="checkbox"
              id="showOverdueOnly"
              name="showOverdueOnly"
              checked={filters.showOverdueOnly}
              onChange={handleFilterChange}
              className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary"
            />
            <label htmlFor="showOverdueOnly" className="ml-2 block text-sm font-medium text-gray-800">
              Mostrar sólo vencidas
            </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Mis Visitas</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleOpenScheduler(Array.from(selectedVisitIds))}
            disabled={selectedVisitIds.size === 0}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-secondary text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
            <CalendarPlusIcon className="h-5 w-5 mr-2" />
            Programar Visitas ({selectedVisitIds.size})
          </button>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-primary rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            <FilterIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mb-6 -mt-2">
          <div className="flex items-center flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <span 
                key={key} 
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
              >
                {typeof value === 'boolean' && value === true ? (
                  filterLabels[key]
                ) : (
                  <>
                    <strong className="mr-1">{filterLabels[key]}:</strong> {value}
                  </>
                )}
                <button
                  onClick={() => handleRemoveFilter(key as keyof typeof filters)}
                  className="ml-1.5 flex-shrink-0 text-gray-500 hover:text-gray-800 focus:outline-none"
                  aria-label={`Remover filtro ${filterLabels[key]}`}
                >
                  <span className="sr-only">Remover</span>
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-secondary hover:underline ml-2"
            >
              Limpiar todo
            </button>
          </div>
        </div>
      )}
      
      {/* Filter Modal for Mobile & Desktop */}
      {isFilterModalOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-end md:items-center md:justify-center" 
            onClick={() => setIsFilterModalOpen(false)}
            role="dialog"
            aria-modal="true"
        >
          <div 
            className="w-full bg-white rounded-t-2xl shadow-xl p-6 animate-slide-up md:rounded-2xl md:max-w-2xl md:animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-semibold text-primary">Filtros</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <XIcon className="h-6 w-6 text-gray-600" />
              </button>
            </header>
            <div className="space-y-4">
                <FilterControls />
            </div>
            <footer className="flex justify-end mt-6 pt-4 border-t space-x-2">
                <button onClick={clearFilters} className="px-5 py-2 text-primary rounded-md hover:bg-gray-200 transition-colors">Limpiar</button>
                <button onClick={() => setIsFilterModalOpen(false)} className="px-5 py-2 bg-secondary text-white rounded-md hover:bg-blue-700 transition-colors">Aplicar</button>
            </footer>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 w-12 text-center">
                <input 
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    onChange={handleSelectAll}
                    checked={areAllSelected}
                    disabled={schedulableVisitsInFilter.length === 0}
                    className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary disabled:bg-gray-100"
                    aria-label="Seleccionar todas las visitas programables"
                />
              </th>
              <th className="p-4 font-semibold text-primary">Establecimiento</th>
              <th className="p-4 font-semibold text-primary">Estado</th>
              <th className="p-4 font-semibold text-primary">Fecha Visita</th>
              <th className="p-4 font-semibold text-primary">Fecha Programada</th>
              <th className="p-4 font-semibold text-primary">Fecha Límite</th>
              <th className="p-4 font-semibold text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit, index) => {
                const deadlineStatus = getDeadlineStatus(visit.deadlineDate, visit.status);
                const deadlineClasses = {
                    overdue: 'text-red-600 font-bold',
                    upcoming: 'text-orange-500 font-bold',
                    normal: 'text-gray-600',
                }[deadlineStatus];
                const canBeSelected = isSchedulable(visit.status);

                return (
                    <tr key={visit.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-secondary/10`}>
                        <td className="p-4 text-center">
                            <input 
                                type="checkbox"
                                checked={selectedVisitIds.has(visit.id)}
                                onChange={() => handleSelectVisit(visit.id)}
                                disabled={!canBeSelected}
                                className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-secondary disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label={`Seleccionar visita ${visit.id}`}
                            />
                        </td>
                        <td className="p-4">
                            <div className="font-semibold text-primary">{visit.establishment}</div>
                            <div className="text-sm text-gray-500">{visit.address}</div>
                            <div className="text-xs text-gray-400 font-mono mt-1">ID: {visit.id} / Contrato: {visit.contract}</div>
                        </td>
                        <td className="p-4"><StatusBadge status={visit.status} /></td>
                        <td className="p-4 text-gray-600">
                            {visit.visitDate ? visit.visitDate : <span className="text-gray-400 italic">N/A</span>}
                        </td>
                        <td className="p-4 text-gray-600">
                            {visit.scheduledDate ? visit.scheduledDate : <span className="text-gray-400 italic">Sin fecha</span>}
                        </td>
                        <td className="p-4">
                            <span className={deadlineClasses}>{visit.deadlineDate}</span>
                        </td>
                        <td className="p-4"><VisitActions visit={visit} onViewVisit={onViewVisit} onScheduleVisit={(id) => handleOpenScheduler([id])} /></td>
                    </tr>
                )
            })
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  No se encontraron visitas con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredVisits.length > 0 ? (
          filteredVisits.map(visit => {
            const deadlineStatus = getDeadlineStatus(visit.deadlineDate, visit.status);
            const deadlineClasses = {
                overdue: 'text-red-600 font-bold',
                upcoming: 'text-orange-500 font-bold',
                normal: 'text-gray-600',
            }[deadlineStatus];
            const canBeSelected = isSchedulable(visit.status);

            return (
                <div key={visit.id} className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: statusColors[visit.status].split(' ')[2].replace('border-', '#') }}>
                    <header className="flex justify-between items-start mb-3">
                        <div className="flex-1 flex items-start">
                            <input 
                                type="checkbox"
                                checked={selectedVisitIds.has(visit.id)}
                                onChange={() => handleSelectVisit(visit.id)}
                                disabled={!canBeSelected}
                                className="h-5 w-5 mt-1 text-secondary border-gray-300 rounded focus:ring-secondary disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label={`Seleccionar visita ${visit.id}`}
                            />
                            <div className="ml-3">
                                <p className="font-bold text-primary leading-tight">{visit.establishment}</p>
                                <p className="text-sm text-gray-500">{visit.clientName}</p>
                            </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <StatusBadge status={visit.status} />
                        </div>
                    </header>
                    <div className="text-sm text-gray-700 space-y-2 pl-8">
                        <p>
                            <strong className="font-medium text-gray-800">Dirección:</strong> {visit.address}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p>
                                <strong className="font-medium text-gray-800 block">Visita:</strong> {visit.visitDate ? visit.visitDate : <span className="text-gray-400 italic">N/A</span>}
                            </p>
                             <p>
                                <strong className="font-medium text-gray-800 block">Límite:</strong>
                                <span className={deadlineClasses}> {visit.deadlineDate}</span>
                            </p>
                            <p>
                                <strong className="font-medium text-gray-800 block">Programada:</strong> {visit.scheduledDate ? visit.scheduledDate : <span className="text-gray-400 italic">Sin fecha</span>}
                            </p>
                           
                        </div>
                    </div>
                    <footer className="flex justify-between items-center pt-2 mt-2 border-t pl-8">
                        <span className="text-xs font-mono text-gray-400">ID: {visit.id}</span>
                        <VisitActions visit={visit} onViewVisit={onViewVisit} onScheduleVisit={(id) => handleOpenScheduler([id])} />
                    </footer>
                </div>
              )
          })
        ) : (
          <div className="text-center p-8 text-gray-500 bg-white rounded-lg shadow-md">
            No se encontraron visitas con los filtros aplicados.
          </div>
        )}
      </div>

      <ScheduleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSchedule={handleScheduleSubmit}
        visitCount={visitsToSchedule.length}
      />
    </div>
  );
};

export default MyVisitsScreen;