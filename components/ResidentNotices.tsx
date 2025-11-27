import React from 'react';
import { Notice } from '../types';
import { BellIcon } from './icons';

interface ResidentNoticesProps {
    notices: Notice[];
}

const ResidentNotices: React.FC<ResidentNoticesProps> = ({ notices }) => {
    const sortedNotices = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="animate-page-in h-full flex flex-col">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notice Board</h1>
            </header>

            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {sortedNotices.length > 0 ? (
                    sortedNotices.map(notice => (
                        <div key={notice.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-gray-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">{notice.title}</h2>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap pl-2">
                                    {new Date(notice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {notice.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                        <BellIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        <p className="mt-4 font-semibold">No Notices Yet</p>
                        <p className="mt-1 text-sm">Check back later for updates from the admin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResidentNotices;