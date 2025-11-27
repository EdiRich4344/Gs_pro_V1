import React, { useMemo } from 'react';
import { Payment } from '../types';
import { CreditCardIcon, CheckCircleIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentPaymentsProps {
    payments: Payment[];
    onPayNow: (payment: Payment) => void;
}

const StatCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 ${className}`}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const ResidentPayments: React.FC<ResidentPaymentsProps> = ({ payments, onPayNow }) => {

    const stats = useMemo(() => {
        const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
        const totalDue = payments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);
        return { totalPaid, totalDue };
    }, [payments]);

    const getStatusBadge = (status: 'Paid' | 'Due' | 'Overdue') => {
        switch (status) {
            case 'Paid': return 'bg-light-tertiary-container text-light-on-tertiary-container dark:bg-dark-tertiary-container dark:text-dark-on-tertiary-container';
            case 'Due': return 'bg-light-secondary-container text-light-on-secondary-container dark:bg-dark-secondary-container dark:text-dark-on-secondary-container';
            case 'Overdue': return 'bg-light-error-container text-light-on-error-container dark:bg-dark-error-container dark:text-dark-on-error-container';
        }
    };
    
    const groupedPayments = useMemo(() => {
        // Fix: Explicitly cast the initial value of the reduce function to Record<string, Payment[]>
        // to prevent TypeScript from inferring it as `unknown` or `{}`, which causes a downstream
        // error when trying to call `.map()` on it.
        return payments.reduce((groups, payment) => {
            const date = new Date(payment.date);
            const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(payment);
            return groups;
        }, {} as Record<string, Payment[]>);
    }, [payments]);

    return (
        <div className="animate-page-in h-full flex flex-col">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Payments</h1>
            </header>
            
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Total Paid" value={`₹${stats.totalPaid.toLocaleString('en-IN')}`} className="text-green-500" />
                    <StatCard title="Outstanding" value={`₹${stats.totalDue.toLocaleString('en-IN')}`} className={stats.totalDue > 0 ? 'text-red-500' : 'text-green-500'} />
                </div>
                
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
                                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{payment.description}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(payment.date).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex justify-between items-end">
                                                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">₹{payment.amount.toLocaleString('en-IN')}</p>
                                                {payment.status !== 'Paid' && (
                                                    <button onClick={() => {
                                                        triggerHapticFeedback();
                                                        onPayNow(payment);
                                                    }} className="text-white font-semibold text-sm px-4 py-2 bg-violet-600 rounded-lg ripple shadow-md">
                                                        Pay Now
                                                    </button>
                                                )}
                                                {payment.status === 'Paid' && (
                                                    <div className="flex items-center text-green-600 dark:text-green-400">
                                                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                                                        <span className="font-semibold text-sm">Paid</span>
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
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <CreditCardIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <p className="mt-3 font-medium">No payment history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResidentPayments;