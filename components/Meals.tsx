import React from 'react';
import { Resident } from '../types';

interface MealsProps {
    residents: Resident[];
    onUpdateMealPlan: (residentId: number, mealPlan: Resident['mealPlan']) => Promise<void>;
}

const Meals: React.FC<MealsProps> = ({ residents, onUpdateMealPlan }) => {
    const activeResidents = residents.filter(r => r.status === 'Active');

    const toggleMealPlan = (residentId: number, meal: 'breakfast' | 'lunch' | 'dinner') => {
        const resident = activeResidents.find(r => r.id === residentId);
        if (!resident) return;
        
        const updatedMealPlan = {
            ...resident.mealPlan,
            [meal]: !resident.mealPlan[meal]
        };
        onUpdateMealPlan(residentId, updatedMealPlan);
    };

    const countMeals = (meal: 'breakfast' | 'lunch' | 'dinner') => {
        return activeResidents.filter(r => r.mealPlan[meal]).length;
    };

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daily Meals</h1>
            </header>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 animate-stagger-in">
                    <div style={{'--stagger-index': 1} as React.CSSProperties} className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 text-center">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Breakfast</h3>
                        <p className="text-4xl font-black text-amber-400 mt-1">{countMeals('breakfast')}</p>
                    </div>
                    <div style={{'--stagger-index': 2} as React.CSSProperties} className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 text-center">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Lunch</h3>
                        <p className="text-4xl font-black text-orange-400 mt-1">{countMeals('lunch')}</p>
                    </div>
                    <div style={{'--stagger-index': 3} as React.CSSProperties} className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-gray-700/50 text-center">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Dinner</h3>
                        <p className="text-4xl font-black text-indigo-400 mt-1">{countMeals('dinner')}</p>
                    </div>
                </div>
            
                <div className="space-y-4 animate-stagger-in">
                    {activeResidents.map((resident, index) => (
                        <div key={resident.id} className="bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50" style={{'--stagger-index': index + 4} as React.CSSProperties}>
                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">{resident.name}</p>
                            <div className="flex justify-around items-center">
                                <label className="flex flex-col items-center space-y-2 text-sm font-medium cursor-pointer">
                                    <span className="text-amber-600 dark:text-amber-400">Breakfast</span>
                                    <input
                                        type="checkbox"
                                        checked={resident.mealPlan.breakfast}
                                        onChange={() => toggleMealPlan(resident.id, 'breakfast')}
                                        className="h-6 w-6 rounded-md text-amber-500 focus:ring-amber-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900"
                                    />
                                </label>
                                <label className="flex flex-col items-center space-y-2 text-sm font-medium cursor-pointer">
                                    <span className="text-orange-600 dark:text-orange-400">Lunch</span>
                                     <input
                                        type="checkbox"
                                        checked={resident.mealPlan.lunch}
                                        onChange={() => toggleMealPlan(resident.id, 'lunch')}
                                        className="h-6 w-6 rounded-md text-orange-500 focus:ring-orange-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900"
                                    />
                                </label>
                                <label className="flex flex-col items-center space-y-2 text-sm font-medium cursor-pointer">
                                    <span className="text-indigo-600 dark:text-indigo-400">Dinner</span>
                                    <input
                                        type="checkbox"
                                        checked={resident.mealPlan.dinner}
                                        onChange={() => toggleMealPlan(resident.id, 'dinner')}
                                        className="h-6 w-6 rounded-md text-indigo-500 focus:ring-indigo-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900"
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Meals;
