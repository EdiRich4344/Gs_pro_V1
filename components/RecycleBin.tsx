import React from 'react';
import { Resident } from '../types';
import { ArrowLeftIcon, ArrowUturnLeftIcon, TrashIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface RecycleBinProps {
    residents: Resident[];
    onRestore: (residentId: number) => void;
    onBack: () => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({ residents, onRestore, onBack }) => {
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recycle Bin</h1>
                </div>
            </header>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="space-y-4 animate-stagger-in">
                    {residents.length > 0 ? (
                        residents.map((resident, index) => (
                            <div 
                                key={resident.id} 
                                className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm"
                                style={{'--stagger-index': index} as React.CSSProperties}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg text-gray-700 dark:text-gray-300">{resident.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{resident.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            triggerHapticFeedback();
                                            onRestore(resident.id);
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors ripple"
                                    >
                                        <ArrowUturnLeftIcon className="w-4 h-4" />
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <TrashIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Recycle Bin is empty</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Deleted residents will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecycleBin;
