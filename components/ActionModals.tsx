import React, { useState, useEffect, useRef } from 'react';
import { Payment, Resident, Room, Cot } from '../types';
import { generatePaymentReminder } from '../services/geminiService';
import { generatePaymentStatementPDF, generateWelcomeLetterPDF, generateVacateLetterPDF, generateInvoicePDF } from '../services/pdfService';
import { CloseIcon, SpinnerIcon, BellIcon, DownloadIcon, FileTextIcon, CheckCircleIcon } from './icons';

// Base Modal Component
interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-backdrop-in">
        <div className="bg-light-surface dark:bg-dark-surface rounded-3xl shadow-2xl w-11/12 max-w-md m-4 animate-slide-up-in">
            <header className="flex items-center justify-between p-4 border-b border-light-outline/30 dark:border-dark-outline/30">
                <h2 className="text-lg font-bold text-light-on-surface dark:text-dark-on-surface">{title}</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-light-surface-variant/50 dark:hover:bg-dark-surface-variant/50">
                    <CloseIcon className="w-5 h-5 text-light-on-surface-variant dark:text-dark-on-surface-variant" />
                </button>
            </header>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

// Consistent, theme-aware input class for all modals
const modalInputClass = "w-full p-3 border-2 border-light-outline/50 dark:border-dark-outline/50 rounded-xl bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 text-light-on-surface-variant dark:text-dark-on-surface-variant placeholder:text-light-on-surface-variant/60 dark:placeholder:text-dark-on-surface-variant/60 focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 transition-colors";


// Add Payment Modal
interface AddPaymentModalProps {
    onClose: () => void;
    onSave: (paymentData: Omit<Payment, 'id' | 'status'>) => Promise<void>;
    residents: Resident[];
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ onClose, onSave, residents }) => {
    const [residentId, setResidentId] = useState<number | ''>('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!residentId) return;
        setIsLoading(true);
        await onSave({
            residentId: Number(residentId),
            amount: Number(amount),
            date,
            description,
        });
        setIsLoading(false);
    };

    const handleResidentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setResidentId(selectedId);
        const resident = residents.find(r => r.id === selectedId);
        if(resident) {
            setAmount(resident.rent.toString());
            setDescription(`Monthly Rent - ${new Date(date).toLocaleString('default', { month: 'long' })}`);
        }
    }

    return (
        <Modal onClose={onClose} title="Add New Payment">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Resident</label>
                    <select value={residentId} onChange={handleResidentChange} required className={modalInputClass}>
                        <option value="" disabled>Select a resident</option>
                        {residents.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className={modalInputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Amount (₹)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className={modalInputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Due Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={modalInputClass} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold disabled:opacity-50 flex items-center">
                        {isLoading && <SpinnerIcon className="w-4 h-4 mr-2" />}
                        Save Payment
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// Payment Reminder Modal
interface PaymentReminderModalProps {
    payment: Payment;
    resident: Resident;
    onClose: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({ payment, resident, onClose, showToast }) => {
    const [reminder, setReminder] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReminder = async () => {
            try {
                const message = await generatePaymentReminder(resident.name, payment.amount, payment.date);
                setReminder(message);
            } catch (error) {
                setReminder(`Dear ${resident.name}, this is a reminder that your payment of ₹${payment.amount.toLocaleString('en-IN')} was due on ${new Date(payment.date).toLocaleDateString()}. Please make the payment at your earliest convenience. Thank you, Good Shepherd Hostel Management.`);
                showToast("AI reminder failed. Showing default.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReminder();
    }, [resident.name, payment.amount, payment.date, showToast]);

    const handleSend = () => {
        showToast(`Reminder sent to ${resident.name}!`, 'success');
        onClose();
    };

    return (
        <Modal onClose={onClose} title={`Reminder for ${resident.name}`}>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <SpinnerIcon className="w-8 h-8 text-light-primary dark:text-dark-primary" />
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Generated reminder message:</p>
                    <textarea value={reminder} onChange={e => setReminder(e.target.value)} rows={6} className={`${modalInputClass} text-sm`} />
                    <div className="flex justify-end gap-3 pt-2">
                         <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                        <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold flex items-center">
                            <BellIcon className="w-4 h-4 mr-2" />
                            Send Reminder
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

// Download Options Modal
interface DownloadOptionsModalProps {
    onClose: () => void;
    resident: Resident;
    payments: Payment[];
    room: Room | null;
    cot: Cot | null;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    customLogo: string | null;
}

export const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({ onClose, resident, payments, room, cot, showToast, customLogo }) => {
    
    const handleDownload = (type: 'statement' | 'welcome' | 'vacate' | 'invoice') => {
        try {
            switch(type) {
                case 'statement':
                    generatePaymentStatementPDF(resident, payments, room, cot, customLogo);
                    break;
                case 'welcome':
                    generateWelcomeLetterPDF(resident, room, cot, customLogo);
                    break;
                case 'vacate':
                    if (resident.status !== 'Vacated') {
                        showToast('Only vacated residents can have a vacation certificate.', 'info');
                        return;
                    }
                    generateVacateLetterPDF(resident, customLogo);
                    break;
                case 'invoice':
                    const lastPayment = payments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                    if(!lastPayment) {
                         showToast('No payments found to generate an invoice.', 'info');
                         return;
                    }
                    generateInvoicePDF(resident, lastPayment, customLogo);
                    break;
            }
        } catch(e: any) {
            showToast(`Failed to generate PDF: ${e.message}`, 'error');
        } finally {
            onClose();
        }
    };
    
    return (
        <Modal onClose={onClose} title="Download Reports">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => handleDownload('statement')} className="flex flex-col items-center justify-center p-4 bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 rounded-2xl hover:bg-light-surface-variant dark:hover:bg-dark-surface-variant transition-colors">
                    <FileTextIcon className="w-8 h-8 mb-2 text-light-primary dark:text-dark-primary" />
                    <span className="font-semibold text-sm">Payment Statement</span>
                </button>
                 <button onClick={() => handleDownload('invoice')} className="flex flex-col items-center justify-center p-4 bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 rounded-2xl hover:bg-light-surface-variant dark:hover:bg-dark-surface-variant transition-colors">
                    <DownloadIcon className="w-8 h-8 mb-2 text-blue-500" />
                    <span className="font-semibold text-sm">Latest Invoice</span>
                </button>
                <button onClick={() => handleDownload('welcome')} className="flex flex-col items-center justify-center p-4 bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 rounded-2xl hover:bg-light-surface-variant dark:hover:bg-dark-surface-variant transition-colors">
                    <FileTextIcon className="w-8 h-8 mb-2 text-green-500" />
                    <span className="font-semibold text-sm">Welcome Letter</span>
                </button>
                 <button onClick={() => handleDownload('vacate')} disabled={resident.status !== 'Vacated'} className="flex flex-col items-center justify-center p-4 bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 rounded-2xl hover:bg-light-surface-variant dark:hover:bg-dark-surface-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <CheckCircleIcon className="w-8 h-8 mb-2 text-red-500" />
                    <span className="font-semibold text-sm">Vacation Certificate</span>
                </button>
            </div>
        </Modal>
    );
};

// Feedback Modal
interface FeedbackModalProps {
    onClose: () => void;
    onSubmit: (message: string) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit(message);
        setIsLoading(false);
    };

    return (
        <Modal onClose={onClose} title="Submit Feedback">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or complaints here..."
                    rows={6}
                    required
                    className={modalInputClass}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                    <button type="submit" disabled={isLoading || !message} className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold disabled:opacity-50 flex items-center">
                         {isLoading && <SpinnerIcon className="w-4 h-4 mr-2" />}
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Add Room Modal
interface AddRoomModalProps {
    onClose: () => void;
    onSave: (roomName: string) => Promise<void>;
}
export const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose, onSave }) => {
    const [roomName, setRoomName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;
        setIsLoading(true);
        await onSave(roomName.trim());
        setIsLoading(false);
    };

    return (
        <Modal onClose={onClose} title="Add New Room">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Room Name</label>
                    <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g., Room 101" required className={modalInputClass} />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                    <button type="submit" disabled={isLoading || !roomName.trim()} className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold disabled:opacity-50 flex items-center">
                        {isLoading && <SpinnerIcon className="w-4 h-4 mr-2" />}
                        Add Room
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Add Cot Modal
interface AddCotModalProps {
    onClose: () => void;
    onSave: (cotName: string, roomId: number) => Promise<void>;
    rooms: Room[];
    defaultRoomId?: number | null;
}
export const AddCotModal: React.FC<AddCotModalProps> = ({ onClose, onSave, rooms, defaultRoomId }) => {
    const [cotName, setCotName] = useState('');
    const [roomId, setRoomId] = useState<number | ''>(defaultRoomId || '');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cotName.trim() || !roomId) return;
        setIsLoading(true);
        await onSave(cotName.trim(), Number(roomId));
        setIsLoading(false);
    };

    return (
        <Modal onClose={onClose} title="Add New Cot">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Select Room</label>
                    <select value={roomId} onChange={e => setRoomId(Number(e.target.value))} required className={modalInputClass}>
                        <option value="" disabled>Select a room</option>
                        {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant mb-1">Cot Name</label>
                    <input type="text" value={cotName} onChange={e => setCotName(e.target.value)} placeholder="e.g., Cot A" required className={modalInputClass} />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                    <button type="submit" disabled={isLoading || !cotName.trim() || !roomId} className="px-4 py-2 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-semibold disabled:opacity-50 flex items-center">
                        {isLoading && <SpinnerIcon className="w-4 h-4 mr-2" />}
                        Add Cot
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// Confirmation Modal for Deletions
interface ConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isLoading?: boolean;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, title, message, confirmText = 'Confirm', isLoading }) => (
    <Modal onClose={onClose} title={title}>
        <div className="space-y-4">
            <p className="text-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">{message}</p>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-light-secondary-container dark:bg-dark-secondary-container text-light-on-secondary-container dark:text-dark-on-secondary-container font-semibold">Cancel</button>
                <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 rounded-xl bg-light-error dark:bg-dark-error text-white font-semibold flex items-center">
                    {isLoading && <SpinnerIcon className="w-4 h-4 mr-2" />}
                    {confirmText}
                </button>
            </div>
        </div>
    </Modal>
);