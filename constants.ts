import { Visit, VisitStatus } from './types';

export const CLIENTS = [
  'Constructora del Sur S.A.',
  'Gastronomía Porteña SRL',
  'Logística Total S.A.',
];

// Helper function to get future date strings in YYYY-MM-DD format
const getFutureDate = (days: number): string => {
  const future = new Date();
  future.setDate(future.getDate() + days);
  const year = future.getFullYear();
  const month = String(future.getMonth() + 1).padStart(2, '0');
  const day = String(future.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get past date strings in YYYY-MM-DD format
const getPastDate = (days: number): string => {
    const past = new Date();
    past.setDate(past.getDate() - days);
    const year = past.getFullYear();
    const month = String(past.getMonth() + 1).padStart(2, '0');
    const day = String(past.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const MOCK_VISITS: Visit[] = [
  {
    id: 'V-001',
    clientName: 'Constructora del Sur S.A.',
    contract: 'C-SUR-2023',
    establishment: 'Obra "Torres del Parque"',
    address: 'Av. Libertador 5400, Buenos Aires',
    status: VisitStatus.Pendiente,
    visitDate: null,
    deadlineDate: getPastDate(15), // Overdue
    scheduledDate: null,
    visitType: 'Asesoramiento Inicial',
    preventor: 'Juan Pérez',
    observations: null,
  },
  {
    id: 'V-002',
    clientName: 'Gastronomía Porteña SRL',
    contract: 'C-GP-2024-A',
    establishment: 'Restaurante "El Sabor"',
    address: 'Thames 1885, Buenos Aires',
    status: VisitStatus.Realizada,
    visitDate: '2024-07-20',
    deadlineDate: '2024-07-25',
    scheduledDate: '2024-07-19',
    visitType: 'Auditoría de Protocolos',
    preventor: 'Maria Garcia',
    observations: 'Se verificó cumplimiento de normativas vigentes.',
  },
  {
    id: 'V-003',
    clientName: 'Logística Total S.A.',
    contract: 'C-LT-GLOBAL-01',
    establishment: 'Depósito Central',
    address: 'Colectora Este 32500, Tigre',
    status: VisitStatus.Fallida,
    visitDate: '2024-07-22',
    deadlineDate: '2024-07-30',
    scheduledDate: '2024-07-21',
    visitType: 'Medición de Ruido',
    preventor: 'Carlos Rodriguez',
    observations: 'El responsable no se encontraba en el establecimiento.',
  },
  {
    id: 'V-004',
    clientName: 'Logística Total S.A.',
    contract: 'C-LT-ZARATE-02',
    establishment: 'Depósito Zárate',
    address: 'Ruta 9 Km 78, Zárate',
    status: VisitStatus.Reprogramada,
    visitDate: null, // A reprogrammed visit shouldn't have a completion date
    deadlineDate: '2024-08-30',
    scheduledDate: '2024-08-25',
    visitType: 'Capacitación de Personal',
    preventor: 'Juan Pérez',
    observations: 'Reprogramada a pedido del cliente.',
  },
  {
    id: 'V-005',
    clientName: 'Constructora del Sur S.A.',
    contract: 'C-SUR-2023',
    establishment: 'Oficinas Centrales',
    address: 'Corrientes 1234, Buenos Aires',
    status: VisitStatus.Pendiente,
    visitDate: null,
    deadlineDate: getPastDate(2), // Overdue
    scheduledDate: null, // Most pending visits are unscheduled
    visitType: 'Inspección General',
    preventor: 'Ana Martinez',
    observations: null,
  },
  {
    id: 'V-006',
    clientName: 'Gastronomía Porteña SRL',
    contract: 'C-GP-2024-A',
    establishment: 'Sucursal Palermo',
    address: 'Scalabrini Ortiz 2300, Buenos Aires',
    status: VisitStatus.Realizada,
    visitDate: '2024-07-18',
    deadlineDate: '2024-07-22',
    scheduledDate: '2024-07-15',
    visitType: 'Control de Matafuegos',
    preventor: 'Maria Garcia',
    observations: 'Todos los equipos en regla.',
  },
  {
    id: 'V-007',
    clientName: 'Logística Total S.A.',
    contract: 'C-LT-GLOBAL-01',
    establishment: 'Centro de Distribución Norte',
    address: 'Panamericana Ramal Pilar Km 45, Pilar',
    status: VisitStatus.Pendiente,
    visitDate: null,
    deadlineDate: '2024-08-25',
    scheduledDate: null, // Most pending visits are unscheduled
    visitType: 'Asesoramiento de EPP',
    preventor: 'Carlos Rodriguez',
    observations: null,
  },
  {
    id: 'V-008',
    clientName: 'Gastronomía Porteña SRL',
    contract: 'C-GP-2024-B',
    establishment: 'Cocina de Producción',
    address: 'Warnes 850, Buenos Aires',
    status: VisitStatus.Pendiente,
    visitDate: null,
    deadlineDate: '2024-09-12',
    scheduledDate: null, // Most pending visits are unscheduled
    visitType: 'Medición de Contaminantes',
    preventor: 'Laura Sanchez',
    observations: null,
  },
  {
    id: 'V-009',
    clientName: 'Constructora del Sur S.A.',
    contract: 'C-SUR-2025',
    establishment: 'Nueva Obra "Costanera"',
    address: 'Av. Costanera 123, Buenos Aires',
    status: VisitStatus.Programada,
    visitDate: null,
    deadlineDate: getFutureDate(3), // Upcoming
    scheduledDate: getFutureDate(2), // Keep one scheduled for demonstration
    visitType: 'Evaluación de Riesgos',
    preventor: 'Ana Martinez',
    observations: null,
  },
  {
    id: 'V-010',
    clientName: 'Logística Total S.A.',
    contract: 'C-LT-GLOBAL-01',
    establishment: 'Almacén Frigorífico',
    address: 'Ruta 2 Km 50, La Plata',
    status: VisitStatus.Pendiente,
    visitDate: null,
    deadlineDate: getFutureDate(6), // Upcoming
    scheduledDate: null,
    visitType: 'Control de EPP',
    preventor: 'Juan Pérez',
    observations: null,
  },
];