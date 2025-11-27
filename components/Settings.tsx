import React, { useState, useRef } from 'react';
import { View } from '../types';
import { supabase } from '../services/supabaseClient';
import { 
    PaintBrushIcon, 
    LogoutIcon, 
    UserCircleIcon, 
    DoorOpenIcon, 
    TrashIcon, 
    InformationCircleIcon, 
    SpinnerIcon,
    BellIcon,
    LockIcon,
    ChartPieIcon,
    DownloadIcon
} from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface SettingsProps {
    onLogout: () => void;
    navigateTo: (view: View) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    customLogo: string | null;
    onLogoChange: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, navigateTo, showToast, customLogo, onLogoChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        localStorage.getItem('notifications-enabled') === 'true'
    );

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'error');
            return;
        }

        setIsUploading(true);
        triggerHapticFeedback();
        
        try {
            const { error } = await supabase.storage
                .from('public_assets')
                .upload('logo.png', file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) throw error;
            
            showToast('Logo updated successfully!', 'success');
            onLogoChange();
        } catch (error: any) {
            showToast(`Error uploading logo: ${error.message}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleThemeToggle = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
        triggerHapticFeedback();
        showToast(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`, 'success');
    };

    const handleNotificationToggle = () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
        localStorage.setItem('notifications-enabled', String(newValue));
        triggerHapticFeedback();
        showToast(`Notifications ${newValue ? 'enabled' : 'disabled'}`, 'success');
    };

    const handleExportData = () => {
        triggerHapticFeedback();
        showToast('Data export started...', 'info');
        // Add export logic here
    };
    
    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-light-background via-light-surface to-light-background dark:from-dark-background dark:via-dark-surface dark:to-dark-background">
            {/* Enhanced Header with Gradient */}
            <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 animate-pulse-glow">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-32">
                <div className="p-6 space-y-4 animate-stagger-in">
                    {/* Appearance Section */}
                    <SettingsCard 
                        title="Appearance" 
                        icon={PaintBrushIcon}
                        iconGradient="from-pink-500 to-rose-500"
                        style={{ '--stagger-index': 0 } as React.CSSProperties}
                    >
                        {/* Logo Upload */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative group">
                                        {customLogo ? (
                                            <img 
                                                src={customLogo} 
                                                alt="Hostel Logo" 
                                                className="w-16 h-16 rounded-2xl object-contain bg-white dark:bg-gray-800 shadow-lg ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all" 
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center border-2 border-dashed border-violet-300 dark:border-violet-700 group-hover:border-violet-500 transition-all">
                                                <PaintBrushIcon className="w-8 h-8 text-violet-400 dark:text-violet-500"/>
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">Hostel Logo</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Used in PDF reports</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG or JPG, max 5MB</p>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoUpload} 
                                    accept="image/png, image/jpeg" 
                                    className="hidden" 
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    disabled={isUploading} 
                                    className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ripple"
                                >
                                    {isUploading ? (
                                        <>
                                            <SpinnerIcon className="w-4 h-4" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <DownloadIcon className="w-4 h-4" />
                                            <span>Upload</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <SettingsToggle
                            icon={PaintBrushIcon}
                            label="Dark Mode"
                            description="Switch between light and dark themes"
                            enabled={isDarkMode}
                            onToggle={handleThemeToggle}
                        />
                    </SettingsCard>

                    {/* Preferences Section */}
                    <SettingsCard 
                        title="Preferences" 
                        icon={BellIcon}
                        iconGradient="from-blue-500 to-cyan-500"
                        style={{ '--stagger-index': 1 } as React.CSSProperties}
                    >
                        <SettingsToggle
                            icon={BellIcon}
                            label="Notifications"
                            description="Receive updates about payments and bookings"
                            enabled={notificationsEnabled}
                            onToggle={handleNotificationToggle}
                        />
                    </SettingsCard>

                    {/* Account Section */}
                    <SettingsCard 
                        title="Account" 
                        icon={UserCircleIcon}
                        iconGradient="from-purple-500 to-indigo-500"
                        style={{ '--stagger-index': 2 } as React.CSSProperties}
                    >
                        <SettingsRow 
                            icon={LockIcon} 
                            label="Privacy & Security" 
                            description="Manage your data and security settings"
                            onClick={() => showToast('Coming soon!', 'info')} 
                        />
                        <SettingsRow 
                            icon={LogoutIcon} 
                            label="Logout" 
                            description="Sign out of your account"
                            onClick={onLogout} 
                            isDestructive 
                        />
                    </SettingsCard>
                    
                    {/* Data Management Section */}
                    <SettingsCard 
                        title="Data Management" 
                        icon={ChartPieIcon}
                        iconGradient="from-emerald-500 to-teal-500"
                        style={{ '--stagger-index': 3 } as React.CSSProperties}
                    >
                        <SettingsRow 
                            icon={DoorOpenIcon} 
                            label="Vacated Residents" 
                            description="View residents who have checked out"
                            onClick={() => navigateTo('vacated-residents')} 
                        />
                        <SettingsRow 
                            icon={TrashIcon} 
                            label="Recycle Bin" 
                            description="Restore or permanently delete items"
                            onClick={() => navigateTo('recycle-bin')} 
                        />
                        <SettingsRow 
                            icon={DownloadIcon} 
                            label="Export Data" 
                            description="Download your data in CSV format"
                            onClick={handleExportData} 
                        />
                    </SettingsCard>

                    {/* About Section */}
                    <SettingsCard 
                        title="About" 
                        icon={InformationCircleIcon}
                        iconGradient="from-amber-500 to-orange-500"
                        style={{ '--stagger-index': 4 } as React.CSSProperties}
                    >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Version</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 px-3 py-1 rounded-lg bg-white dark:bg-gray-800 shadow-sm">1.0.0</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                A modern, intuitive hostel management solution designed to streamline daily operations with beautiful design and powerful features.
                            </p>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                                    © {new Date().getFullYear()} Good Shepherd. All Rights Reserved.
                                </p>
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};

// Enhanced Settings Card Component
const SettingsCard: React.FC<{
    title: string;
    icon: React.FC<{className?: string}>;
    iconGradient?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}> = ({ title, icon: Icon, iconGradient = "from-violet-500 to-purple-600", children, style }) => (
    <div 
        className="glass rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/30"
        style={style}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

// Enhanced Settings Row Component
const SettingsRow: React.FC<{
    icon: React.FC<{className?: string}>;
    label: string;
    description?: string;
    onClick: () => void;
    isDestructive?: boolean;
}> = ({ icon: Icon, label, description, onClick, isDestructive = false }) => (
    <button 
        onClick={() => {
            triggerHapticFeedback();
            onClick();
        }} 
        className={`flex items-center w-full p-4 rounded-2xl transition-all text-left ripple group ${
            isDestructive 
                ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100'
        }`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
            isDestructive 
                ? 'bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/40' 
                : 'bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/40'
        }`}>
            <Icon className={`w-5 h-5 ${isDestructive ? '' : 'text-violet-600 dark:text-violet-400'}`} />
        </div>
        <div className="flex-1 ml-4">
            <div className="font-bold">{label}</div>
            {description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
            )}
        </div>
        <svg 
            className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                isDestructive ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </button>
);

// New Toggle Component
const SettingsToggle: React.FC<{
    icon: React.FC<{className?: string}>;
    label: string;
    description?: string;
    enabled: boolean;
    onToggle: () => void;
}> = ({ icon: Icon, label, description, enabled, onToggle }) => (
    <button 
        onClick={() => {
            triggerHapticFeedback();
            onToggle();
        }}
        className="flex items-center w-full p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all text-left ripple group"
    >
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/40 transition-all">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 ml-4">
            <div className="font-bold text-gray-900 dark:text-gray-100">{label}</div>
            {description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
            )}
        </div>
        <div 
            className={`relative w-14 h-8 rounded-full transition-all duration-300 flex-shrink-0 ${
                enabled 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25' 
                    : 'bg-gray-300 dark:bg-gray-700'
            }`}
        >
            <div 
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${
                    enabled ? 'left-7' : 'left-1'
                }`}
            />
        </div>
    </button>
);

export default Settings;