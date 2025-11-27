import React, { useState } from 'react';
import { Resident, Cot, Room } from '../types';
import { PlusIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentsProps {
    residents: Resident[];
    cots: Cot[];
    rooms: Room[];
    onAddResident: () => void;
    onViewResident: (residentId: number) => void;
}

const Residents: React.FC<ResidentsProps> = ({ residents, cots, rooms, onAddResident, onViewResident }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const calculateAge = (dob: string): number => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredResidents = residents
        .filter(resident => resident.status === 'Active')
        .filter(resident => {
            if (!searchTerm) return true;
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const residentCot = cots.find(c => c.id === resident.cotId);
            const residentRoom = residentCot ? rooms.find(r => r.id === residentCot.roomId) : null;
            const roomName = residentRoom ? residentRoom.name : '';

            return (
                resident.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                resident.email.toLowerCase().includes(lowerCaseSearchTerm) ||
                resident.id.toString().includes(lowerCaseSearchTerm) ||
                resident.phone.includes(lowerCaseSearchTerm) ||
                roomName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (id: number): string => {
        const colors = [
            'bg-gradient-to-br from-violet-500 to-purple-600',
            'bg-gradient-to-br from-blue-500 to-cyan-600',
            'bg-gradient-to-br from-pink-500 to-rose-600',
            'bg-gradient-to-br from-orange-500 to-amber-600',
            'bg-gradient-to-br from-green-500 to-emerald-600',
            'bg-gradient-to-br from-indigo-500 to-blue-600',
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            {/* Header */}
            <header className="sticky top-0 z-10 px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Residents</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {filteredResidents.length} active {filteredResidents.length === 1 ? 'resident' : 'residents'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            triggerHapticFeedback();
                            onAddResident();
                        }}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white w-12 h-12 rounded-2xl font-semibold flex items-center justify-center shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transform active:scale-95 transition-all duration-200"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, ID, phone, room..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:text-white transition-all placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </header>
            
            {/* Residents List */}
            <div className="flex-1 px-4 pt-6 pb-32 overflow-y-auto">
                {filteredResidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No residents found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
                    </div>
                ) : (
                    <div className="space-y-3 animate-stagger-in">
                        {filteredResidents.map((resident, index) => {
                            const residentCot = cots.find(c => c.id === resident.cotId);
                            const residentRoom = residentCot ? rooms.find(r => r.id === residentCot.roomId) : null;

                            return (
                                <div 
                                    key={resident.id} 
                                    className="group bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                                    onClick={() => {
                                        triggerHapticFeedback();
                                        onViewResident(resident.id);
                                    }}
                                    style={{'--stagger-index': index} as React.CSSProperties}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${getAvatarColor(resident.id)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                            {getInitials(resident.name)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate">
                                                    {resident.name}
                                                </p>
                                                <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${
                                                    resident.type === 'Student' 
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                }`}>
                                                    {resident.type}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{calculateAge(resident.dateOfBirth)} yrs</span>
                                                </div>
                                                
                                                {residentRoom && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        <span className="truncate">{residentRoom.name}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">ID: {resident.id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow Icon */}
                                        <div className="flex-shrink-0 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Residents;