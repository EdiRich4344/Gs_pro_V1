import React, { useState } from 'react';
import { Resident } from '../types';
import { ArrowLeftIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface VacatedResidentsProps {
    residents: Resident[];
    onViewResident: (residentId: number) => void;
    onBack: () => void;
}

const VacatedResidents: React.FC<VacatedResidentsProps> = ({ residents, onViewResident, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const vacatedResidents = residents
        .filter(resident => resident.status === 'Vacated')
        .filter(resident => 
            resident.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vacated Residents</h1>
                </div>
            </header>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:text-white transition-all"
                    />
                </div>
            
                <div className="space-y-4 animate-stagger-in">
                    {vacatedResidents.map((resident, index) => (
                        <div 
                            key={resident.id} 
                            className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm cursor-pointer transition-transform active:scale-[0.98] ripple"
                            onClick={() => {
                                triggerHapticFeedback();
                                onViewResident(resident.id);
                            }}
                            style={{'--stagger-index': index} as React.CSSProperties}
                        >
                            <div className="flex justify-between items-center opacity-70">
                                <div>
                                    <p className="font-bold text-lg text-gray-700 dark:text-gray-300">{resident.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{resident.email}</p>
                                </div>
                                <span className="mt-1 inline-block px-2 py-0.5 text-xs rounded-full font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    Vacated
                                </span>
                            </div>
                        </div>
                    ))}
                     {vacatedResidents.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No vacated residents found.</p>}
                </div>
            </div>
        </div>
    );
};

export default VacatedResidents;