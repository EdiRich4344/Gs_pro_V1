import React, { useState, useMemo } from 'react';
import { Payment, Expense } from '../types';
import BarChart from './Chart';
import PieChart from './PieChart';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface FinancialsProps {
    payments: Payment[];
    expenses: Expense[];
}

const StatCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 ${className}`}>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
);

const Financials: React.FC<FinancialsProps> = ({ payments, expenses }) => {
    const [timeFilter, setTimeFilter] = useState<'6m' | '1y'>('6m');

    const filteredData = useMemo(() => {
        const now = new Date();
        const monthsToFilter = timeFilter === '6m' ? 6 : 12;
        const startDate = new Date(now.getFullYear(), now.getMonth() - monthsToFilter + 1, 1);

        const filteredPayments = payments.filter(p => new Date(p.date) >= startDate);
        const filteredExpenses = expenses.filter(e => new Date(e.date) >= startDate);

        return { filteredPayments, filteredExpenses, monthsToFilter, startDate };
    }, [payments, expenses, timeFilter]);

    const chartData = useMemo(() => {
        const { filteredPayments, filteredExpenses, monthsToFilter, startDate } = filteredData;
        const incomeByMonth: { [key: string]: number } = {};
        const expenseByMonth: { [key: string]: number } = {};
        
        const labels = Array.from({ length: monthsToFilter }, (_, i) => {
            const date = new Date(startDate);
            date.setMonth(startDate.getMonth() + i);
            return date.toLocaleString('default', { month: 'short' });
        });

        labels.forEach(label => {
            incomeByMonth[label] = 0;
            expenseByMonth[label] = 0;
        });

        filteredPayments.forEach(p => {
            if (p.status === 'Paid') {
                const month = new Date(p.date).toLocaleString('default', { month: 'short' });
                if (incomeByMonth.hasOwnProperty(month)) {
                    incomeByMonth[month] += p.amount;
                }
            }
        });

        filteredExpenses.forEach(e => {
            const month = new Date(e.date).toLocaleString('default', { month: 'short' });
             if (expenseByMonth.hasOwnProperty(month)) {
                expenseByMonth[month] += e.amount;
            }
        });
        
        return {
            income: labels.map(label => ({ label, value: incomeByMonth[label] })),
            expenses: labels.map(label => ({ label, value: expenseByMonth[label] })),
        };
    }, [filteredData]);

    const summaryStats = useMemo(() => {
        const totalIncome = filteredData.filteredPayments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const totalExpenses = filteredData.filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, netProfit };
    }, [filteredData]);

    const paymentStatusData = useMemo(() => {
        const paid = filteredData.filteredPayments.filter(p => p.status === 'Paid').length;
        const due = filteredData.filteredPayments.filter(p => p.status === 'Due').length;
        const overdue = filteredData.filteredPayments.filter(p => p.status === 'Overdue').length;
        return [
            { label: 'Paid', value: paid, color: '#10b981' },
            { label: 'Due', value: due, color: '#f59e0b' },
            { label: 'Overdue', value: overdue, color: '#ef4444' },
        ];
    }, [filteredData.filteredPayments]);
    
    const expenseCategoryData = useMemo(() => {
        const byCategory = filteredData.filteredExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {} as Record<Expense['category'], number>);

        const colors = {
            'Food Supplies': '#3b82f6', 'Utilities': '#14b8a6', 'Maintenance': '#f97316', 
            'Staff Salary': '#8b5cf6', 'Miscellaneous': '#64748b'
        };

        return Object.entries(byCategory).map(([category, value]) => ({
            label: category,
            value,
            color: colors[category as Expense['category']] || '#ccc'
        }));
    }, [filteredData.filteredExpenses]);

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Analytics</h1>
            </header>

            <div className="flex-1 px-4 pt-4 pb-32 space-y-6 overflow-y-auto">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {(['6m', '1y'] as const).map(f => (
                        <button key={f} onClick={() => {
                            triggerHapticFeedback();
                            setTimeFilter(f);
                        }} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${timeFilter === f ? 'bg-violet-600 text-white' : 'bg-white/60 dark:bg-gray-800/60'}`}>
                            {f === '6m' ? 'Last 6 Months' : 'This Year'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Income" value={`₹${(summaryStats.totalIncome / 1000).toFixed(1)}k`} />
                    <StatCard title="Total Expenses" value={`₹${(summaryStats.totalExpenses / 1000).toFixed(1)}k`} />
                    <StatCard 
                        title="Net Profit" 
                        value={`₹${(summaryStats.netProfit / 1000).toFixed(1)}k`}
                        className={summaryStats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}
                    />
                </div>

                <div className="h-72">
                    <BarChart data={chartData.income} title="Monthly Income (₹)" />
                </div>
                 <div className="h-72">
                    <BarChart data={chartData.expenses} title="Monthly Expenses (₹)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PieChart data={paymentStatusData} title="Payment Status Breakdown" />
                    <PieChart data={expenseCategoryData} title="Expense Breakdown" />
                </div>
            </div>
        </div>
    );
};

export default Financials;