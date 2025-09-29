import React, { useMemo } from 'react';
import { Visit, VisitStatus } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarTodayIcon } from './icons/CalendarTodayIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PreventorDashboardProps {
    visits: Visit[];
    onNavigate: (screen: string, filters: any) => void;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-lg shadow-md p-6 flex items-center text-left transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
            <div className={`p-3 rounded-full mr-4 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm font-medium text-gray-500">{title}</p>
            </div>
        </button>
    );
};


const PreventorDashboard: React.FC<PreventorDashboardProps> = ({ visits, onNavigate }) => {

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayString = new Date().toISOString().split('T')[0];

        const pendingVisits = visits.filter(v => v.status === VisitStatus.Pendiente).length;

        const visitsForToday = visits.filter(v =>
            (v.status === VisitStatus.Programada || v.status === VisitStatus.Reprogramada) && v.scheduledDate === todayString
        ).length;

        const overdueVisits = visits.filter(v => {
            if (![VisitStatus.Pendiente, VisitStatus.Programada, VisitStatus.Reprogramada].includes(v.status)) return false;
            const deadline = new Date(v.deadlineDate);
            deadline.setHours(0, 0, 0, 0);
            return deadline < today;
        }).length;

        const completedThisMonth = visits.filter(v => {
            if (v.status !== VisitStatus.Realizada || !v.visitDate) return false;
            const visitDate = new Date(v.visitDate);
            return visitDate.getFullYear() === today.getFullYear() && visitDate.getMonth() === today.getMonth();
        }).length;

        return {
            pendingVisits,
            visitsForToday,
            overdueVisits,
            completedThisMonth
        };

    }, [visits]);
    
    const todayString = new Date().toISOString().split('T')[0];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Panel de Control</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Pendientes de Programación"
                    value={stats.pendingVisits}
                    icon={<ClockIcon className="h-7 w-7 text-yellow-600" />}
                    color="bg-yellow-100"
                    onClick={() => onNavigate('Mis Visitas', { status: VisitStatus.Pendiente })}
                />
                <StatCard 
                    title="Visitas Programadas para Hoy"
                    value={stats.visitsForToday}
                    icon={<CalendarTodayIcon className="h-7 w-7 text-blue-600" />}
                    color="bg-blue-100"
                    onClick={() => onNavigate('Mis Visitas', { scheduledDate: todayString })}
                />
                <StatCard 
                    title="Visitas Vencidas"
                    value={stats.overdueVisits}
                    icon={<ExclamationTriangleIcon className="h-7 w-7 text-red-600" />}
                    color="bg-red-100"
                    onClick={() => onNavigate('Mis Visitas', { showOverdueOnly: true })}
                />
                 <StatCard 
                    title="Realizadas este Mes"
                    value={stats.completedThisMonth}
                    icon={<CheckCircleIcon className="h-7 w-7 text-green-600" />}
                    color="bg-green-100"
                    onClick={() => onNavigate('Mis Visitas', { status: VisitStatus.Realizada })}
                />
            </div>
            
            {/* Can add more sections here later, like upcoming visits list */}
            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Próximos Pasos</h2>
                <p className="text-gray-600">
                    Aquí se podría mostrar una lista de las próximas visitas programadas o un resumen de las tareas más urgentes.
                </p>
            </div>
        </div>
    );
};

export default PreventorDashboard;