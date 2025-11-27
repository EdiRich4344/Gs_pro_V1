import React from 'react';
import { ArrowLeftIcon } from './icons';

interface HostelRulesProps {
    onBack: () => void;
}

const rulesData = [
    {
        category: 'General Conduct & Discipline',
        points: [
            'Residents are expected to maintain a peaceful and harmonious environment.',
            'Quiet hours are from 10:00 PM to 6:00 AM. Please be considerate of others during this time.',
            'Consumption of alcohol, tobacco, and illegal substances is strictly prohibited on the premises.',
            'Any form of ragging, intimidation, or harassment will result in immediate expulsion.',
        ],
    },
    {
        category: 'Room & Common Area Maintenance',
        points: [
            'Keep your room, bathroom, and common areas clean and tidy.',
            'Do not paste posters or use nails on the walls. Use the provided notice boards.',
            'Switch off lights, fans, and other electrical appliances when not in use.',
            'Report any maintenance issues (e.g., plumbing, electrical) to the warden immediately.',
        ],
    },
    {
        category: 'Visitors & Guests',
        points: [
            'Visitors are only allowed in the designated visiting area.',
            'Visiting hours are from 4:00 PM to 7:00 PM. All visitors must sign in at the reception.',
            'Male visitors are not permitted beyond the reception area.',
            'Overnight guests are strictly not allowed.',
        ],
    },
    {
        category: 'Timings & Leave',
        points: [
            'The main gate closes at 9:30 PM. All residents must return to the hostel by this time.',
            'For late entry or overnight leave, prior written permission from the warden is mandatory.',
            'Residents must sign the register when leaving and entering the hostel premises.',
        ],
    },
     {
        category: 'Safety & Security',
        points: [
            'Residents are responsible for the safety of their personal belongings.',
            'Do not share your room keys or personal information with outsiders.',
            'In case of an emergency, contact the warden or security personnel immediately.',
        ],
    },
];

const HostelRules: React.FC<HostelRulesProps> = ({ onBack }) => {
    return (
        <div className="animate-page-in h-full flex flex-col">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex items-center">
                <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hostel Rules</h1>
                </div>
            </header>

            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                {rulesData.map((section, index) => (
                    <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-gray-700/50">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">{section.category}</h2>
                        <ul className="space-y-2 pl-5">
                            {section.points.map((point, pIndex) => (
                                <li key={pIndex} className="text-sm text-gray-700 dark:text-gray-300 list-disc">{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HostelRules;