import React, { useState, useMemo } from 'react';
import { Payment, Resident } from '../types';
import { PlusIcon, BellIcon, PaymentsIcon } from './icons';
import { AddPaymentModal, PaymentReminderModal } from './ActionModals';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface PaymentsProps {
    payments: Payment[];
    residents: Resident[];
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onAddPayment: (paymentData: Omit<Payment, 'id'>) => Promise<void>;
    onUpdatePaymentStatus: (paymentId: number, status: 'Paid' | 'Due' | 'Overdue') => Promise<void>;
}

// Summary Stat Card Component
const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className={`p-4 rounded-2xl bg-opacity-10 ${color}`}>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
    </div>
);


const Payments: React.FC<PaymentsProps> = ({ payments, residents, showToast, onAddPayment, onUpdatePaymentStatus }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
    const [filter, setFilter] = useState<'All' | 'Paid' | 'Due' | 'Overdue'>('All');


    const findResidentName = (residentId: number) => {
        return residents.find(r => r.id === residentId)?.name || 'Unknown';
    };

    const getStatusBadge = (status: 'Paid' | 'Due' | 'Overdue') => {
        switch (status) {
            case 'Paid': return 'bg-light-tertiary-container text-light-on-tertiary-container dark:bg-dark-tertiary-container dark:text-dark-on-tertiary-container';
            case 'Due': return 'bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container';
            case 'Overdue': return 'bg-light-error-container text-light-on-error-container dark:bg-dark-error-container dark:text-dark-on-error-container';
        }
    };

    const handleAddPayment = async (paymentData: Omit<Payment, 'id' | 'status'>) => {
        const newPayment: Omit<Payment, 'id'> = {
            ...paymentData,
            status: new Date(paymentData.date) < new Date() ? 'Overdue' : 'Due'
        };
        await onAddPayment(newPayment);
        setAddModalOpen(false);
    };

    const handleMarkAsPaid = async (paymentId: number) => {
        await onUpdatePaymentStatus(paymentId, 'Paid');
    };
    
    const openReminderModal = (payment: Payment) => {
        const resident = residents.find(r => r.id === payment.residentId);
        if (resident) {
            setSelectedPayment(payment);
            setSelectedResident(resident);
            setReminderModalOpen(true);
        } else {
            showToast('Could not find resident details.', 'error');
        }
    };
    
    const sortedAndFilteredPayments = useMemo(() => [...payments]
        .filter(p => filter === 'All' || p.status === filter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [payments, filter]);

    const stats = useMemo(() => {
        const collected = sortedAndFilteredPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const due = sortedAndFilteredPayments
            .filter(p => p.status === 'Due')
            .reduce((sum, p) => sum + p.amount, 0);
        const overdue = sortedAndFilteredPayments
            .filter(p => p.status === 'Overdue')
            .reduce((sum, p) => sum + p.amount, 0);
        return { collected, due, overdue };
    }, [sortedAndFilteredPayments]);
    
    const groupedPayments = useMemo(() => {
        // Fix: Explicitly cast the initial value of the reduce function to Record<string, Payment[]>
        // to prevent TypeScript from inferring it as `unknown` or `{}`, which causes a downstream
        // error when trying to call `.map()` on it.
        return sortedAndFilteredPayments.reduce((groups, payment) => {
            const date = new Date(payment.date);
            const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(payment);
            return groups;
        }, {} as Record<string, Payment[]>);
    }, [sortedAndFilteredPayments]);

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex justify-between items-center">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payments</h1>
                 </div>
                <button
                    onClick={() => {
                        triggerHapticFeedback();
                        setAddModalOpen(true);
                    }}
                    className="bg-violet-600 text-white w-12 h-12 rounded-2xl font-semibold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform"
                >
                    <PlusIcon className="w-7 h-7" />
                </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto pb-32">
                <div className="flex space-x-2 overflow-x-auto pb-2 px-4 pt-2">
                    {(['All', 'Paid', 'Due', 'Overdue'] as const).map(f => (
                        <button key={f} onClick={() => {
                            triggerHapticFeedback();
                            setFilter(f);
                        }} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${filter === f ? 'bg-violet-600 text-white' : 'bg-white/60 dark:bg-gray-800/60'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-3 gap-3 px-4">
                    <StatCard title="Collected" value={`₹${stats.collected.toLocaleString('en-IN')}`} color="bg-green-500" />
                    <StatCard title="Due" value={`₹${stats.due.toLocaleString('en-IN')}`} color="bg-amber-500" />
                    <StatCard title="Overdue" value={`₹${stats.overdue.toLocaleString('en-IN')}`} color="bg-red-500" />
                </div>
            
                <div className="px-4 pb-4">
                    {Object.keys(groupedPayments).length > 0 ? (
                        <div className="space-y-4">
                            {(Object.entries(groupedPayments) as [string, Payment[]][]).map(([monthYear, paymentsInMonth]) => (
                                <div key={monthYear}>
                                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 px-1 uppercase tracking-wider">{monthYear}</h2>
                                    <div className="space-y-3">
                                        {paymentsInMonth.map((payment) => (
                                            <div key={payment.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{findResidentName(payment.residentId)}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{payment.description}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xl font-bold text-gray-800 dark:text-gray-100">₹{payment.amount.toLocaleString('en-IN')}</p>

                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Due: {new Date(payment.date).toLocaleDateString()}</p>
                                                    </div>
                                                    {payment.status !== 'Paid' && (
                                                        <div className="flex items-center space-x-3">
                                                            <button onClick={() => {
                                                                triggerHapticFeedback();
                                                                handleMarkAsPaid(payment.id);
                                                            }} className="text-green-600 dark:text-green-400 font-semibold text-sm px-3 py-1.5 bg-green-500/10 rounded-lg ripple">Mark Paid</button>
                                                            <button onClick={() => {
                                                                triggerHapticFeedback();
                                                                openReminderModal(payment);
                                                            }} className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center px-3 py-1.5 bg-blue-500/10 rounded-lg ripple">
                                                                <BellIcon className="w-4 h-4 mr-1"/> Remind
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <PaymentsIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No payments found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filter or adding a new payment.</p>
                        </div>
                    )}
                </div>
            </div>

            {isAddModalOpen && <AddPaymentModal onClose={() => setAddModalOpen(false)} onSave={handleAddPayment} residents={residents.filter(r => r.status === 'Active')} />}
            {isReminderModalOpen && selectedPayment && selectedResident && <PaymentReminderModal payment={selectedPayment} resident={selectedResident} onClose={() => { setReminderModalOpen(false); setSelectedResident(null); }} showToast={showToast} />}
        </div>
    );
};

export default Payments;