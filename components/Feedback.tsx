import React, { useState } from 'react';
import { Feedback } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, ChatBubbleIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface FeedbackPageProps {
    feedback: Feedback[];
    onUpdateFeedbackStatus: (feedbackId: number, status: 'New' | 'Viewed') => Promise<void>;
    onBack: () => void;
}

type Filter = 'All' | 'New' | 'Viewed';

const FeedbackPage: React.FC<FeedbackPageProps> = ({ feedback, onUpdateFeedbackStatus, onBack }) => {
    const [filter, setFilter] = useState<Filter>('All');

    const handleMarkAsViewed = (id: number) => {
        triggerHapticFeedback();
        onUpdateFeedbackStatus(id, 'Viewed');
    };

    const filteredFeedback = feedback.filter(f => {
        if (filter === 'All') return true;
        return f.status === filter;
    });

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex items-center">
                <button onClick={() => {
                    triggerHapticFeedback();
                    onBack();
                }} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Feedback & Complaints</h1>
                </div>
            </header>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {(['All', 'New', 'Viewed'] as Filter[]).map(f => (
                        <button key={f} onClick={() => {
                            triggerHapticFeedback();
                            setFilter(f);
                        }} className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${filter === f ? 'bg-violet-600 text-white' : 'bg-white/60 dark:bg-gray-800/60'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {filteredFeedback.length > 0 ? (
                    <div className="space-y-4 animate-stagger-in">
                        {filteredFeedback.map((item, index) => (
                            <div key={item.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50" style={{'--stagger-index': index} as React.CSSProperties}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{item.residentName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleString()}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    {item.message}
                                </p>
                                {item.status === 'New' && (
                                    <div className="flex justify-end">
                                        <button onClick={() => handleMarkAsViewed(item.id)} className="flex items-center text-sm font-semibold text-green-600 dark:text-green-400 px-3 py-1.5 bg-green-500/10 rounded-lg ripple">
                                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                                            Mark as Viewed
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 pt-16">
                        <ChatBubbleIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 font-semibold">No Feedback Here</p>
                        <p className="mt-1 text-sm">When residents submit feedback, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
