export enum VisitStatus {
  Pendiente = 'Pendiente',
  Programada = 'Programada',
  Realizada = 'Realizada',
  Fallida = 'Fallida',
  Reprogramada = 'Reprogramada',
}

export interface Visit {
  id: string;
  clientName: string;
  contract: string;
  establishment: string;
  address: string;
  status: VisitStatus;
  visitDate: string | null; // YYYY-MM-DD
  deadlineDate: string; // YYYY-MM-DD
  scheduledDate?: string | null; // YYYY-MM-DD
  visitType: string;
  preventor: string;
  observations: string | null;
}