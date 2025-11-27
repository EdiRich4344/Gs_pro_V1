import React, { useState } from 'react';
import { Resident, Feedback } from '../types';
import { ChatBubbleIcon, ArrowLeftIcon, SpinnerIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentFeedbackProps {
    resident: Resident;
    feedback: Feedback[];
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onAddFeedback: (feedbackData: Omit<Feedback, 'id'>) => Promise<void>;
    onBack: () => void;
}

const ResidentFeedback: React.FC<ResidentFeedbackProps> = ({ resident, feedback, onAddFeedback, onBack }) => {
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState<'General' | 'Complaint'>('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setIsSubmitting(true);
        triggerHapticFeedback();
        
        const newFeedback: Omit<Feedback, 'id'> = {
            residentId: resident.id,
            residentName: resident.name,
            message: message.trim(),
            date: new Date().toISOString(),
            status: 'New',
            category: category,
        };
        await onAddFeedback(newFeedback);
        setMessage('');
        setIsSubmitting(false);
    };
    
    const userFeedback = feedback.filter(f => f.category === 'General' || f.category === 'Complaint');

    return (
        <div className="animate-page-in h-full flex flex-col">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex items-center">
                <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Feedback & Complaints</h1>
                </div>
            </header>
            
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-gray-700/50">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Submit New Feedback</h2>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3">
                        <button type="button" onClick={() => setCategory('General')} className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${category === 'General' ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                            General Feedback
                        </button>
                        <button type="button" onClick={() => setCategory('Complaint')} className={`py-2 px-3 text-sm font-semibold rounded-lg transition-colors ${category === 'Complaint' ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                            Complaint
                        </button>
                    </div>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={category === 'General' ? 'Share your thoughts or suggestions...' : 'Describe the issue you are facing...'}
                        rows={5}
                        required
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                    <button type="submit" disabled={isSubmitting || !message.trim()} className="w-full mt-3 p-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center ripple">
                        {isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : 'Submit'}
                    </button>
                </form>

                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 px-1">Submission History</h2>
                     {userFeedback.length > 0 ? (
                        <div className="space-y-3">
                            {userFeedback.map(item => (
                                 <div key={item.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">"{item.message}"</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.category === 'Complaint' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                                                {item.category}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'New' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <ChatBubbleIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <p className="mt-3 font-medium">No feedback submitted yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResidentFeedback;