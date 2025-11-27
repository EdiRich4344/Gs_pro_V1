import React from 'react';
import { Room, Cot, Resident } from '../types';
import { BedIcon, PlusIcon, TrashIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface RoomsProps {
    rooms: Room[];
    cots: Cot[];
    residents: Resident[];
    onViewResident: (residentId: number) => void;
    onAddRoom: () => void;
    onAddCot: (roomId: number) => void;
    onAssignResident: (cotId: number) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    onDeleteRoom: (roomId: number) => void;
    onDeleteCot: (cotId: number) => void;
}

const Rooms: React.FC<RoomsProps> = ({ rooms, cots, residents, onViewResident, onAddRoom, onAddCot, onAssignResident, showToast, onDeleteRoom, onDeleteCot }) => {

    const getResidentForCot = (cotId: number): Resident | undefined => {
        const cot = cots.find(c => c.id === cotId);
        return residents.find(r => r.id === cot?.residentId);
    };

    const getOccupancy = (roomId: number) => {
        const roomCots = cots.filter(c => c.roomId === roomId);
        const occupiedCount = roomCots.filter(c => c.residentId !== null).length;
        return {
            total: roomCots.length,
            occupied: occupiedCount,
        };
    };

    const handleDeleteRoomClick = (e: React.MouseEvent, roomId: number) => {
        e.stopPropagation();
        triggerHapticFeedback();
        onDeleteRoom(roomId);
    };

    const handleDeleteCotClick = (e: React.MouseEvent, cotId: number) => {
        e.stopPropagation();
        triggerHapticFeedback();
        onDeleteCot(cotId);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rooms & Occupancy</h1>
                 <button
                    onClick={() => {
                        triggerHapticFeedback();
                        onAddRoom();
                    }}
                    className="bg-violet-600 text-white w-12 h-12 rounded-2xl font-semibold flex items-center justify-center shadow-lg transform active:scale-95 transition-transform duration-150"
                >
                    <PlusIcon className="w-7 h-7" />
                </button>
            </header>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger-in">
                    {rooms.map((room, index) => {
                        const roomCots = cots.filter(c => c.roomId === room.id).sort((a,b) => a.name.localeCompare(b.name));
                        const occupancy = getOccupancy(room.id);
                        const occupancyPercentage = occupancy.total > 0 ? (occupancy.occupied / occupancy.total) * 100 : 0;

                        return (
                            <div 
                                key={room.id} 
                                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-4 border border-gray-200 dark:border-gray-700/50 shadow-md"
                                style={{'--stagger-index': index} as React.CSSProperties}
                            >
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{room.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{occupancy.occupied} / {occupancy.total}</span>
                                            <button onClick={(e) => handleDeleteRoomClick(e, room.id)} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                        <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{width: `${occupancyPercentage}%`}}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {roomCots.map(cot => {
                                        const resident = getResidentForCot(cot.id);
                                        const isOccupied = !!resident;
                                        return (
                                            <div 
                                                key={cot.id} 
                                                onClick={() => {
                                                    triggerHapticFeedback();
                                                    if(resident) {
                                                        onViewResident(resident.id);
                                                    } else {
                                                        onAssignResident(cot.id);
                                                    }
                                                }}
                                                className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer group ${isOccupied ? 'bg-violet-100 dark:bg-violet-900/40 hover:bg-violet-200 dark:hover:bg-violet-900/60 ripple' : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 ripple'}`}
                                            >
                                                <div className="flex items-center space-x-3 overflow-hidden">
                                                    <BedIcon className={`w-6 h-6 flex-shrink-0 ${isOccupied ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{cot.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{resident?.name || 'Vacant'}</p>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => handleDeleteCotClick(e, cot.id)} className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 transition-opacity">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button 
                                        onClick={() => {
                                            triggerHapticFeedback();
                                            onAddCot(room.id);
                                        }}
                                        className="p-3 rounded-2xl flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ripple"
                                    >
                                        <PlusIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Add Cot</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Rooms;