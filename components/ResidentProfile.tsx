import React from 'react';
import { Resident, Cot, Room } from '../types';
import { MailIcon, PhoneIcon, BedIcon, RupeeIcon, LogoutIcon, ClipboardCheckIcon, DoorOpenIcon, ChatBubbleIcon, DownloadIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentProfileProps {
    resident: Resident;
    cot: Cot | null;
    room: Room | null;
    onLogout: () => void;
    onNavigateToRules: () => void;
    onOpenFeedback: () => void;
    onAddRequest: (requestType: 'Room Change' | 'Vacate') => void;
    setDownloadModalOpen: (isOpen: boolean) => void;
}

const DetailCard: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({title, children, className}) => (
    <div className={`bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 ${className}`}>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">{title}</h2>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{icon: React.FC<{className?: string}>, label: string, value: string}> = ({icon: Icon, label, value}) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 mr-4 mt-1 text-gray-400 flex-shrink-0" /> 
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{value}</p>
        </div>
    </div>
);

const ServiceRow: React.FC<{icon: React.FC<{className?: string}>, label: string, onClick: () => void}> = ({icon: Icon, label, onClick}) => (
    <button onClick={() => {
        triggerHapticFeedback();
        onClick();
    }} className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-left ripple">
        <Icon className="w-6 h-6 mr-4 text-violet-500 dark:text-violet-400 flex-shrink-0" />
        <span className="font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>
);


const ResidentProfile: React.FC<ResidentProfileProps> = ({ resident, cot, room, onLogout, onNavigateToRules, onOpenFeedback, onAddRequest, setDownloadModalOpen }) => {
    
    return (
        <div className="animate-page-in p-4 space-y-6">
            <div className="text-center pt-4">
                <div 
                    className="mx-auto w-24 h-24 mb-4 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-violet-500/30"
                >
                   {resident.name.charAt(0)}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{resident.name}</h1>
                <p className="text-base text-gray-500 dark:text-gray-400">{resident.type}</p>
            </div>

            <DetailCard title="Personal & Accommodation">
                <InfoRow icon={MailIcon} label="Email Address" value={resident.email} />
                <InfoRow icon={PhoneIcon} label="Phone Number" value={resident.phone} />
                <InfoRow icon={BedIcon} label="Room & Cot" value={room && cot ? `${room.name}, ${cot.name}` : 'Not Assigned'} />
                <InfoRow icon={RupeeIcon} label="Monthly Rent" value={`₹${resident.rent.toLocaleString('en-IN')}`} />
            </DetailCard>

            <DetailCard title="Hostel Services">
                <ServiceRow icon={ClipboardCheckIcon} label="Hostel Rules & Policies" onClick={onNavigateToRules} />
                <ServiceRow icon={ChatBubbleIcon} label="Submit Feedback / Complaint" onClick={onOpenFeedback} />
                <ServiceRow icon={BedIcon} label="Request Room Change" onClick={() => onAddRequest('Room Change')} />
                <ServiceRow icon={DoorOpenIcon} label="Request to Vacate" onClick={() => onAddRequest('Vacate')} />
                <ServiceRow icon={DownloadIcon} label="Download Reports" onClick={() => setDownloadModalOpen(true)} />
            </DetailCard>
            
            <div className="pt-4">
                <button 
                    onClick={() => {
                        triggerHapticFeedback();
                        onLogout();
                    }}
                    className="w-full flex items-center justify-center bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl font-semibold text-lg hover:bg-red-500/20 transition-colors ripple">
                    <LogoutIcon className="w-6 h-6 mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ResidentProfile;