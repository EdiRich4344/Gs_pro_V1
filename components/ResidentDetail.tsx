import React, { useState } from 'react';
import { Resident, Payment, Cot, Room, RoomHistory } from '../types';
import { ArrowLeftIcon, EditIcon, LogoutIcon, MailIcon, PhoneIcon, BedIcon, RupeeIcon, DownloadIcon, UserCircleIcon, FileTextIcon, TrashIcon, CakeIcon } from './icons';
import { DownloadOptionsModal } from './ActionModals';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentDetailProps {
    resident: Resident;
    payments: Payment[];
    cot: Cot | null;
    room: Room | null;
    roomHistory: RoomHistory[];
    onBack: () => void;
    onEdit: (resident: Resident) => void;
    onVacate: (residentId: number) => void;
    onDelete: (residentId: number) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    customLogo: string | null;
}

const DetailCard: React.FC<{children: React.ReactNode, className?: string, style?: React.CSSProperties}> = ({children, className, style}) => (
    <div style={style} className={`bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 ${className}`}>
        {children}
    </div>
);

const ResidentDetail: React.FC<ResidentDetailProps> = ({ resident, payments, cot, room, roomHistory, onBack, onEdit, onVacate, onDelete, showToast, customLogo }) => {
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);

    const calculateAge = (dob: string | null): string => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return 'N/A';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} years old`;
    };
    
    const getStatusBadgeClass = (status: Resident['status']) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
            case 'Vacated':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
            case 'Deleted':
                return 'bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-400';
        }
    };
    
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
    const totalDue = payments.filter(p => p.status !== 'Paid').reduce((acc, p) => acc + p.amount, 0);

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => {
                        triggerHapticFeedback();
                        onBack();
                    }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{resident.name}</h1>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(resident.status)}`}>
                            {resident.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => {
                        triggerHapticFeedback();
                        setDownloadModalOpen(true);
                     }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"> <DownloadIcon className="w-5 h-5" /> </button>
                     <button onClick={() => {
                        triggerHapticFeedback();
                        onEdit(resident);
                     }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"> <EditIcon className="w-5 h-5" /> </button>
                     {resident.status === 'Active' && 
                        <>
                            <button onClick={() => {
                                triggerHapticFeedback();
                                onVacate(resident.id);
                            }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"> <LogoutIcon className="w-5 h-5" /> </button>
                            <button onClick={() => {
                                triggerHapticFeedback();
                                onDelete(resident.id);
                            }} className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"> <TrashIcon className="w-5 h-5" /> </button>
                        </>
                     }
                </div>
            </header>
            
            <div className="p-4 space-y-6 animate-stagger-in pb-32 overflow-y-auto">
                <DetailCard style={{'--stagger-index': 1} as React.CSSProperties}>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Personal Details</h2>
                    <div className="space-y-3 text-sm text-light-on-surface dark:text-dark-on-surface">
                         <div className="flex items-center"><UserCircleIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>{resident.type}</span></div>
                        <div className="flex items-center"><CakeIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>{calculateAge(resident.dateOfBirth)}</span></div>
                    </div>
                </DetailCard>

                <DetailCard style={{'--stagger-index': 2} as React.CSSProperties}>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Contact & Hostel Info</h2>
                    <div className="space-y-3 text-sm text-light-on-surface dark:text-dark-on-surface">
                        <div className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>{resident.phone}</span></div>
                        <div className="flex items-center"><MailIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span className="truncate">{resident.email}</span></div>
                        <div className="flex items-center"><BedIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>{room && cot ? `${room.name}, ${cot.name}` : 'Not Assigned'}</span></div>
                        <div className="flex items-center"><RupeeIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>Rent: ₹{resident.rent.toLocaleString('en-IN')} / month</span></div>
                        <div className="flex items-center"><RupeeIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>Security Deposit: ₹{resident.depositAmount.toLocaleString('en-IN')}</span></div>
                    </div>
                </DetailCard>

                <DetailCard style={{'--stagger-index': 3} as React.CSSProperties}>
                     <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">KYC Details</h2>
                     <div className="space-y-3 text-sm text-light-on-surface dark:text-dark-on-surface">
                        <div className="flex items-center"><UserCircleIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>Guardian: {resident.guardianName || 'N/A'}</span></div>
                        <div className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>Guardian Contact: {resident.guardianPhone || 'N/A'}</span></div>
                        <div className="flex items-center"><FileTextIcon className="w-5 h-5 mr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant" /> <span>Aadhaar: {resident.aadhaarNumber ? `**** **** ${resident.aadhaarNumber.slice(-4)}` : 'N/A'}</span></div>
                    </div>
                </DetailCard>

                <DetailCard style={{'--stagger-index': 4} as React.CSSProperties}>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Payment History</h2>
                    </div>
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <p className="text-xs text-green-800 dark:text-green-300 font-medium">Total Paid</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{totalPaid.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <p className="text-xs text-red-800 dark:text-red-300 font-medium">Total Due</p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">₹{totalDue.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {payments.length > 0 ? payments.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-500/5">
                                <div>
                                    <p className="font-semibold">{p.description}</p>
                                    <p className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold">₹{p.amount.toLocaleString('en-IN')}</p>
                                     <p className={`text-xs font-semibold ${p.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{p.status}</p>
                                </div>
                            </div>
                        )) : <p className="text-center text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant py-4">No payment history.</p>}
                    </div>
                </DetailCard>
                
                <DetailCard style={{'--stagger-index': 5} as React.CSSProperties}>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Room Assignment History</h2>
                    <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
                       {roomHistory && roomHistory.length > 0 ? roomHistory.map((history) => (
                           <div key={history.id} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-violet-500 border-4 border-white dark:border-gray-800"></div>
                                <div>
                                   <p className="font-bold text-gray-800 dark:text-gray-100">{history.roomName} - {history.cotName}</p>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">
                                       {new Date(history.startDate).toLocaleDateString()} - {history.endDate ? new Date(history.endDate).toLocaleDateString() : 'Present'}
                                   </p>
                               </div>
                           </div>
                       )) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No room history available.</p>
                       )}
                    </div>
                </DetailCard>
            </div>

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

export default ResidentDetail;