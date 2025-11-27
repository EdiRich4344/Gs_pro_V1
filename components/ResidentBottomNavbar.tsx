import React from 'react';
import { ResidentView } from '../types';
import { DashboardIcon, UserCircleIcon, CreditCardIcon, BellIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentBottomNavbarProps {
    currentView: ResidentView;
    setCurrentView: (view: ResidentView) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={() => {
            triggerHapticFeedback();
            onClick();
        }}
        className="flex flex-col items-center justify-center w-full h-full pt-2 pb-1 space-y-1 transition-colors duration-200 ripple"
        aria-current={isActive ? 'page' : undefined}
    >
        <div className="relative w-16 h-8 flex items-center justify-center">
             <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-light-primary dark:text-dark-primary' : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'}`} />
        </div>
        <span className={`text-xs transition-colors duration-300 ${isActive ? 'font-bold text-light-primary dark:text-dark-primary' : 'font-medium text-light-on-surface-variant dark:text-dark-on-surface-variant'}`}>{label}</span>
    </button>
);


const ResidentBottomNavbar: React.FC<ResidentBottomNavbarProps> = ({ currentView, setCurrentView }) => {
    const navItems: { view: ResidentView; label: string; icon: React.FC<{className?: string}> }[] = [
        { view: 'dashboard', label: 'Home', icon: DashboardIcon },
        { view: 'payments', label: 'Payments', icon: CreditCardIcon },
        { view: 'notices', label: 'Notices', icon: BellIcon },
        { view: 'profile', label: 'Profile', icon: UserCircleIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-lg border-t border-light-outline/20 dark:border-dark-outline/20">
            <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
                {navItems.map(({ view, label, icon }) => (
                    <NavItem
                        key={view}
                        label={label}
                        icon={icon}
                        isActive={currentView === view}
                        onClick={() => setCurrentView(view)}
                    />
                ))}
            </div>
        </nav>
    );
};

export default ResidentBottomNavbar;