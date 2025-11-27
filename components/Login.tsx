import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Resident } from '../types';
import { SparklesIcon, LockIcon, EyeIcon, EyeOffIcon, SpinnerIcon } from './icons';

interface LoginProps {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    onResidentLoginSuccess: (resident: Resident) => void;
}

const Login: React.FC<LoginProps> = ({ showToast, onResidentLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState<'admin' | 'resident'>('admin');
    const [isLoading, setIsLoading] = useState(false);
    
    // Admin state
    const [email, setEmail] = useState('edwinofzl@gmail.com');
    const [password, setPassword] = useState('123456');
    const [showPassword, setShowPassword] = useState(false);
    
    // Resident state
    const [residentEmail, setResidentEmail] = useState('priya.sharma@example.com');
    const [residentPhone, setResidentPhone] = useState('9876543210');
    const [isShaking, setIsShaking] = useState(false);


    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Fix: Corrected call to signInWithPassword, which is the standard Supabase v2 API for email/password login.
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showToast(error.message, 'error');
            triggerErrorShake();
        } else {
            showToast('Admin login successful!', 'success');
        }
        setIsLoading(false);
    };
    
    const triggerErrorShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600); // Matches animation duration
    };

    const handleResidentLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        const emailInput = residentEmail.trim();
        const phoneInput = residentPhone.trim();
    
        if (!emailInput || !phoneInput) {
            showToast("Email and phone number are required.", 'error');
            triggerErrorShake();
            setIsLoading(false);
            return;
        }
    
        try {
            // Direct query to residents table to authenticate
            const { data: residents, error } = await supabase
                .from('residents')
                .select('*')
                .eq('email', emailInput)
                .eq('phone', phoneInput);

            if (error) {
                throw error;
            }

            if (!residents || residents.length === 0) {
                 showToast('Invalid email or phone number.', 'error');
                 triggerErrorShake();
                 setIsLoading(false);
                 return;
            }

            if (residents.length > 1) {
                 showToast('Duplicate account found. Please contact administration.', 'error');
                 triggerErrorShake();
                 setIsLoading(false);
                 return;
            }

            const resident = residents[0] as Resident;

            if (resident.status === 'Active') {
                showToast(`Welcome back, ${resident.name}!`, 'success');
                onResidentLoginSuccess(resident);
            } else {
                showToast('Your account has been deactivated. Please contact administration.', 'error');
                triggerErrorShake();
            }

        } catch (err: any) {
            console.error("Resident login failed:", err);
            showToast(err.message || "An unexpected error occurred during login.", 'error');
            triggerErrorShake();
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClass = "w-full p-3 pl-4 pr-10 border-2 border-light-outline/50 dark:border-dark-outline/50 rounded-xl bg-light-surface-variant/30 dark:bg-dark-surface-variant/30 text-light-on-surface-variant dark:text-dark-on-surface-variant placeholder:text-light-on-surface-variant/60 dark:placeholder:text-dark-on-surface-variant/60 focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 transition-colors";
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 font-sans p-4">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Good Shepherd</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hostel Management</p>
                    </div>
                </div>

                <div className="bg-light-surface dark:bg-dark-surface p-2 rounded-2xl flex mb-6 shadow-sm">
                    <button onClick={() => setActiveTab('admin')} className={`w-1/2 p-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'admin' ? 'bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary' : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'}`}>
                        Admin Login
                    </button>
                    <button onClick={() => setActiveTab('resident')} className={`w-1/2 p-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'resident' ? 'bg-light-primary/10 dark:bg-dark-primary/20 text-light-primary dark:text-dark-primary' : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'}`}>
                        Resident Login
                    </button>
                </div>

                {activeTab === 'admin' ? (
                    <form onSubmit={handleAdminLogin} className={`space-y-4 animate-fade-in ${isShaking && activeTab === 'admin' ? 'animate-shake' : ''}`}>
                        <div>
                            <label className="sr-only">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className={inputClass} />
                        </div>
                        <div className="relative">
                            <label className="sr-only">Password</label>
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className={inputClass} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-light-on-surface-variant dark:text-dark-on-surface-variant">
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center p-4 bg-violet-600 text-white rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 ripple disabled:opacity-50">
                            {isLoading ? <SpinnerIcon className="w-6 h-6"/> : <><LockIcon className="w-5 h-5 mr-2" /> Sign In</>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResidentLogin} className={`space-y-4 animate-fade-in ${isShaking && activeTab === 'resident' ? 'animate-shake' : ''}`}>
                        <div>
                            <label className="sr-only">Email Address</label>
                            <input type="email" value={residentEmail} onChange={e => setResidentEmail(e.target.value)} placeholder="Email Address" required className={inputClass} />
                        </div>
                        <div>
                            <label className="sr-only">Phone Number</label>
                            <input type="tel" value={residentPhone} onChange={e => setResidentPhone(e.target.value)} placeholder="Phone Number" required className={inputClass} />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center p-4 bg-violet-600 text-white rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 ripple disabled:opacity-50">
                             {isLoading ? <SpinnerIcon className="w-6 h-6"/> : 'Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;