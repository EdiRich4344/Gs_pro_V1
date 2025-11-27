import React, { useState, useMemo } from 'react';
import { Resident, Payment, Cot, Room, Feedback, ResidentView, Notice } from '../types';
import { DownloadIcon, PhoneIcon, ChatBubbleIcon, CreditCardIcon, BellIcon, ArrowLeftIcon, RupeeIcon, BedIcon, CheckCircleIcon } from './icons';
import { DownloadOptionsModal } from './ActionModals';
import ResidentBottomNavbar from './ResidentBottomNavbar';
import ResidentProfile from './ResidentProfile';
import ResidentFeedback from './ResidentFeedback';
import ResidentPayment from './ResidentPayment';
import PaymentSuccess from './PaymentSuccess';
import ResidentNotices from './ResidentNotices';
import HostelRules from './HostelRules';
import ResidentPayments from './ResidentPayments';
import { triggerHapticFeedback } from '../utils/nativeFeedback';


// Local UI Components
const WhiteCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg transition-all duration-300 ${className}`}>
        {children}
    </div>
);

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

const QuickActionButton: React.FC<{
    icon: React.FC<{ className?: string }>;
    label: string;
    onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={() => {
            triggerHapticFeedback();
            onClick();
        }}
        className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95 ripple"
    >
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</span>
    </button>
);

const StatCard: React.FC<{
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


interface ResidentDashboardHomeProps {
    resident: Resident;
    payments: Payment[];
    cot: Cot | null;
    room: Room | null;
    notices: Notice[];
    setCurrentView: (view: ResidentView) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ResidentDashboardHome: React.FC<ResidentDashboardHomeProps> = ({ resident, payments, cot, room, notices, setCurrentView, showToast }) => {
    const outstandingPayment = useMemo(() => payments.find(p => p.status === 'Due' || p.status === 'Overdue'), [payments]);

    return (
        <div className="animate-page-in flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 pb-24">
            <header className="px-6 pt-6 pb-4">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome, {resident.name.split(' ')[0]}!</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your personal hostel dashboard.</p>
                    </div>
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg">
                        {resident.name.charAt(0)}
                    </div>
                </div>
            </header>
            
            <div className="flex-1 overflow-auto px-6 space-y-4">
                {outstandingPayment ? (
                    <GradientCard gradient="from-violet-600 via-purple-600 to-indigo-600">
                        <p className="text-white/80 text-sm font-medium mb-1">{outstandingPayment.description}</p>
                        <h2 className="text-5xl font-black text-white tracking-tight">
                            ₹{outstandingPayment.amount.toLocaleString('en-IN')}
                        </h2>
                        <p className={`mt-2 px-3 py-1 text-xs font-bold rounded-full inline-block ${outstandingPayment.status === 'Overdue' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                            {outstandingPayment.status} - Due on {new Date(outstandingPayment.date).toLocaleDateString()}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <button onClick={() => { triggerHapticFeedback(); setCurrentView('payments'); }} className="flex-1 bg-white text-violet-600 font-bold py-3 px-4 rounded-full text-lg shadow-lg flex items-center justify-center ripple transform active:scale-95 transition-transform">
                                <CreditCardIcon className="w-6 h-6 mr-2" /> Manage Payments
                            </button>
                        </div>
                    </GradientCard>
                ) : (
                    <GradientCard gradient="from-emerald-500 to-green-600">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <CheckCircleIcon className="w-10 h-10 text-white"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">All Cleared!</h2>
                                <p className="text-white/80">You have no outstanding payments.</p>
                            </div>
                        </div>
                    </GradientCard>
                )}

                <WhiteCard>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Notices</h3>
                        <button 
                            onClick={() => {
                                triggerHapticFeedback();
                                setCurrentView('notices');
                            }}
                            className="text-sm text-violet-600 dark:text-violet-400 font-semibold"
                        >
                            See all →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {notices.slice(0, 2).map((notice) => (
                            <div key={notice.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{notice.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </WhiteCard>

                <div className="grid grid-cols-2 gap-3">
                    <StatCard
                        title="Monthly Rent"
                        value={`₹${resident.rent.toLocaleString('en-IN')}`}
                        icon={RupeeIcon}
                        gradient="from-cyan-400 to-blue-500"
                    />
                    <StatCard
                        title="My Room"
                        value={room && cot ? `${room.name.split(' ')[1]}-${cot.name.split(' ')[1]}` : 'N/A'}
                        icon={BedIcon}
                        gradient="from-amber-400 to-orange-500"
                    />
                </div>
            </div>
        </div>
    );
};


interface ResidentDashboardProps {
    resident: Resident;
    payments: Payment[];
    cot: Cot | null;
    room: Room | null;
    feedback: Feedback[];
    notices: Notice[];
    currentView: ResidentView;
    setCurrentView: (view: ResidentView) => void;
    onLogout: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    customLogo: string | null;
    onConfirmPayment: (paymentId: number) => Promise<void>;
    onAddFeedback: (feedbackData: Omit<Feedback, 'id'>) => Promise<void>;
}

const ResidentDashboard: React.FC<ResidentDashboardProps> = (props) => {
    const { resident, payments, cot, room, feedback, notices, currentView, setCurrentView, onLogout, showToast, customLogo, onConfirmPayment, onAddFeedback } = props;
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const [paymentToProcess, setPaymentToProcess] = useState<Payment | null>(null);

    const handlePayNow = (payment: Payment) => {
        setPaymentToProcess(payment);
        setCurrentView('payment-flow');
    };

    const handleConfirmPayment = async () => {
        if (!paymentToProcess) return;
        await onConfirmPayment(paymentToProcess.id);
        setCurrentView('payment-success');
    };
    
    const handlePaymentDone = () => {
        setPaymentToProcess(null);
        setCurrentView('dashboard');
    }

    const handleAddRequest = async (requestType: 'Room Change' | 'Vacate') => {
        const message = `This is an automated request for a ${requestType}. Please contact the resident for further details.`;
        await onAddFeedback({
            residentId: resident.id,
            residentName: resident.name,
            message,
            date: new Date().toISOString(),
            status: 'New',
            category: 'Request'
        });
        showToast(`Your ${requestType} request has been submitted successfully.`, 'success');
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <ResidentDashboardHome 
                            resident={resident} 
                            payments={payments} 
                            cot={cot}
                            room={room}
                            notices={notices}
                            setCurrentView={setCurrentView}
                            showToast={showToast}
                        />;
            case 'profile':
                return <ResidentProfile 
                    resident={resident} 
                    cot={cot} 
                    room={room} 
                    onLogout={onLogout} 
                    onNavigateToRules={() => setCurrentView('rules')}
                    onOpenFeedback={() => setCurrentView('feedback')}
                    onAddRequest={handleAddRequest}
                    setDownloadModalOpen={setDownloadModalOpen}
                />;
            case 'feedback':
                 return <ResidentFeedback 
                            resident={resident} 
                            feedback={feedback}
                            onAddFeedback={onAddFeedback}
                            showToast={showToast}
                            onBack={() => setCurrentView('profile')}
                        />;
            case 'payments':
                return <ResidentPayments payments={payments} onPayNow={handlePayNow} />;
            case 'payment-flow':
                if (!paymentToProcess) {
                    setCurrentView('dashboard');
                    return null;
                }
                return <ResidentPayment payment={paymentToProcess} onBack={() => setCurrentView('payments')} onConfirmPayment={handleConfirmPayment} />;
            case 'payment-success':
                 if (!paymentToProcess) {
                    setCurrentView('dashboard');
                    return null;
                }
                return <PaymentSuccess payment={paymentToProcess} onDone={handlePaymentDone} />;
            case 'notices':
                return <ResidentNotices notices={notices} />;
            case 'rules':
                return <HostelRules onBack={() => setCurrentView('profile')} />;
            default:
                return null;
        }
    };
    
    const isFullScreenView = ['payment-flow', 'payment-success', 'rules', 'feedback'].includes(currentView);

    return (
        <div className="flex flex-col h-full">
             <main className={`flex-grow overflow-y-auto ${!isFullScreenView ? 'pb-24' : ''}`}>
                {renderView()}
            </main>
            
            {!isFullScreenView && <ResidentBottomNavbar currentView={currentView} setCurrentView={setCurrentView} />}

            {isDownloadModalOpen && (
                <DownloadOptionsModal
                    onClose={() => setDownloadModalOpen(false)}
                    resident={resident}
                    payments={payments}
                    room={room}
                    cot={cot}
                    showToast={showToast}
                    customLogo={customLogo}
                />
            )}
        </div>
    );
};

export default ResidentDashboard;