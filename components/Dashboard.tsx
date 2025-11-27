// ============ DASHBOARD COMPONENT ============
import React, { useState } from 'react';
import { Stats, Resident, Payment, View, Feedback } from '../types';
import { SparklesIcon, CommandIcon, ResidentsIcon, RoomsIcon, PaymentsIcon, UserPlusIcon, ChatBubbleIcon, ArchiveBoxIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface DashboardProps {
    stats: Stats;
    residents: Resident[];
    payments: Payment[];
    feedback: Feedback[];
    navigateTo: (view: View) => void;
    onAddResidentClick: () => void;
    currentDate: Date;
    onMonthChange: (direction: 'next' | 'prev') => void;
    onAskAI: (prompt: string) => void;
}

// Smooth white card component
const WhiteCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg transition-all duration-300 ${className}`}>
        {children}
    </div>
);

// Gradient hero card
const GradientCard: React.FC<{ children: React.ReactNode, gradient: string, className?: string }> = ({ 
    children, 
    gradient,
    className = '' 
}) => (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10">
            {children}
        </div>
    </div>
);

// Quick action button
const QuickActionButton: React.FC<{
    icon: React.FC<{ className?: string }>;
    label: string;
    onClick: () => void;
    gradient: string;
}> = ({ icon: Icon, label, onClick, gradient }) => (
    <button
        onClick={() => {
            triggerHapticFeedback();
            onClick();
        }}
        className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95 ripple"
    >
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
    </button>
);

// Mini stat card
const MiniStatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.FC<{ className?: string }>;
    gradient: string;
}> = ({ title, value, icon: Icon, gradient }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, payments, feedback, navigateTo, onAddResidentClick, currentDate, onMonthChange, onAskAI }) => {
    const [prompt, setPrompt] = useState('');
    const overduePayments = payments.filter(p => p.status === 'Overdue');
    const newFeedback = feedback.filter(f => f.status === 'New');
    const currentMonthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const handleAskAISubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerHapticFeedback();
        onAskAI(prompt);
        setPrompt('');
    };

    const { incomeThisMonth, incomeLastMonth } = stats;
    const hasLastMonthIncome = incomeLastMonth > 0;
    const hasThisMonthIncome = incomeThisMonth > 0;
    const percentageChange = hasLastMonthIncome ? ((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100 : (hasThisMonthIncome ? Infinity : 0);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
            {/* Elegant Header */}
            <header className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Good Shepherd</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hostel Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 p-1 rounded-full">
                        <button 
                            onClick={() => onMonthChange('prev')} 
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 w-32 text-center">{currentMonthLabel}</span>
                        <button 
                            onClick={() => onMonthChange('next')} 
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Hero Income Card */}
                <GradientCard gradient="from-violet-600 via-purple-600 to-indigo-600">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-white/80 text-sm font-medium mb-1">Income for {currentDate.toLocaleDateString('en-US', { month: 'long' })}</p>
                            <h2 className="text-5xl font-black text-white tracking-tight">
                                ₹{stats.incomeThisMonth.toLocaleString('en-IN')}
                            </h2>
                        </div>
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/50" />
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/50" />
                            <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">+{stats.totalResidents - 2 > 0 ? stats.totalResidents - 2 : 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm mt-2">
                        {percentageChange >= 0 ? (
                            <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                        ) : (
                            <svg className="w-4 h-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        )}
                        <span className={`font-bold ${percentageChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {percentageChange === Infinity ? 'New Income' : `${Math.abs(percentageChange).toFixed(0)}%`}
                        </span>
                        <span>vs last month</span>
                    </div>
                </GradientCard>
            </header>

            {/* Main Content - with proper bottom padding for navbar */}
            <div className="flex-1 overflow-auto px-6 pb-32 space-y-4">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <MiniStatCard
                        title="Residents"
                        value={stats.totalResidents}
                        icon={ResidentsIcon}
                        gradient="from-cyan-400 to-blue-500"
                    />
                    <MiniStatCard
                        title="Occupancy"
                        value={`${stats.occupiedCots}/${stats.totalCots}`}
                        icon={RoomsIcon}
                        gradient="from-amber-400 to-orange-500"
                    />
                    <MiniStatCard
                        title="Paid"
                        value={payments.filter(p => p.status === 'Paid').length}
                        icon={PaymentsIcon}
                        gradient="from-emerald-400 to-green-500"
                    />
                </div>

                {/* Quick Actions */}
                <WhiteCard>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-2">
                        <QuickActionButton
                            icon={UserPlusIcon}
                            label="Add New"
                            onClick={onAddResidentClick}
                            gradient="from-cyan-500 to-blue-600"
                        />
                         <QuickActionButton
                            icon={RoomsIcon}
                            label="Rooms"
                            onClick={() => navigateTo('rooms')}
                            gradient="from-amber-500 to-orange-600"
                        />
                        <QuickActionButton
                            icon={ChatBubbleIcon}
                            label="Feedback"
                            onClick={() => navigateTo('feedback')}
                            gradient="from-rose-500 to-pink-600"
                        />
                         <QuickActionButton
                            icon={ArchiveBoxIcon}
                            label="History"
                            onClick={() => navigateTo('vacated-residents')}
                            gradient="from-slate-500 to-gray-600"
                        />
                    </div>
                </WhiteCard>

                {/* AI Assistant */}
                <WhiteCard>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <CommandIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h3>
                    </div>
                    <form onSubmit={handleAskAISubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div
                            className="relative w-full cursor-text"
                            onClick={() => onAskAI('')}
                        >
                            <input 
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask anything about your hostel..." 
                                className="relative w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-3 px-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-0 transition-all font-medium outline-none"
                            />
                        </div>
                    </form>
                </WhiteCard>

                {/* Recent Activity */}
                <WhiteCard>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        <button 
                            onClick={() => {
                                triggerHapticFeedback();
                                navigateTo('payments');
                            }}
                            className="text-sm text-violet-600 dark:text-violet-400 font-semibold"
                        >
                            See all →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {payments.slice(0, 3).map((payment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                        payment.status === 'Paid' 
                                            ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                                            : 'bg-gradient-to-br from-red-400 to-orange-500'
                                    }`}>
                                        <PaymentsIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${
                                        payment.status === 'Paid' ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        ₹{payment.amount.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{payment.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </WhiteCard>

                {/* Finance Overview */}
                <WhiteCard>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Finance Overview</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Paid</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                {payments.filter(p => p.status === 'Paid').length}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Pending</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                {payments.filter(p => p.status !== 'Paid').length}
                            </p>
                        </div>
                    </div>
                </WhiteCard>

                {/* Overdue Alert */}
                {overduePayments.length > 0 && (
                    <GradientCard gradient="from-red-500 to-orange-600">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <PaymentsIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold">{overduePayments.length} Overdue Payments</p>
                                <p className="text-white/80 text-sm">Action required</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 mb-3">
                            Due: ₹{overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}
                        </p>
                        <button
                            onClick={() => {
                                triggerHapticFeedback();
                                navigateTo('payments');
                            }}
                            className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-semibold transition-all"
                        >
                            View Details →
                        </button>
                    </GradientCard>
                )}

                {/* Feedback */}
                {newFeedback.length > 0 && (
                    <WhiteCard>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Feedback</h3>
                                <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold rounded-full">
                                    {newFeedback.length} new
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {newFeedback.slice(0, 2).map(item => (
                                <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">"{item.message}"</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">— {item.residentName}</p>
                                </div>
                            ))}
                        </div>
                    </WhiteCard>
                )}
            </div>
        </div>
    );
};

export default Dashboard;