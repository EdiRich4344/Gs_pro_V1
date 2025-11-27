import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationIcon, CloseIcon, InformationCircleIcon } from './icons';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
    const [progress, setProgress] = useState(100);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Progress bar animation
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
        }, 16); // ~60fps

        // Auto-close timer
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    };

    const typeStyles = {
        success: {
            bg: 'from-emerald-500 to-teal-600',
            text: 'text-white',
            icon: CheckCircleIcon,
            iconBg: 'bg-white/20',
            progressBar: 'bg-white/30',
            shadow: 'shadow-emerald-500/25',
            glow: 'shadow-emerald-500/50',
        },
        error: {
            bg: 'from-red-500 to-rose-600',
            text: 'text-white',
            icon: ExclamationIcon,
            iconBg: 'bg-white/20',
            progressBar: 'bg-white/30',
            shadow: 'shadow-red-500/25',
            glow: 'shadow-red-500/50',
        },
        info: {
            bg: 'from-blue-500 to-indigo-600',
            text: 'text-white',
            icon: InformationCircleIcon,
            iconBg: 'bg-white/20',
            progressBar: 'bg-white/30',
            shadow: 'shadow-blue-500/25',
            glow: 'shadow-blue-500/50',
        },
    };

    const styles = typeStyles[type];
    const Icon = styles.icon;

    return (
        <div 
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md
                ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
            `}
        >
            {/* Main Toast Container */}
            <div 
                className={`
                    relative overflow-hidden rounded-2xl 
                    bg-gradient-to-r ${styles.bg}
                    shadow-2xl ${styles.shadow}
                    hover:${styles.glow}
                    backdrop-blur-xl
                    border border-white/20
                    transition-shadow duration-300
                `}
            >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-fast" />
                </div>

                {/* Content */}
                <div className="relative flex items-center p-4 gap-4">
                    {/* Icon with animated background */}
                    <div className={`
                        relative flex-shrink-0 w-10 h-10 
                        rounded-xl ${styles.iconBg}
                        flex items-center justify-center
                        ${type === 'success' ? 'animate-scale-bounce' : ''}
                        ${type === 'error' ? 'animate-shake-rotate' : ''}
                    `}>
                        <Icon className={`w-6 h-6 ${styles.text}`} />
                        
                        {/* Pulse ring for success */}
                        {type === 'success' && (
                            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping-slow" />
                        )}
                    </div>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm ${styles.text} leading-snug`}>
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={handleClose}
                        className={`
                            flex-shrink-0 w-8 h-8 
                            rounded-full 
                            bg-white/10 hover:bg-white/20
                            flex items-center justify-center
                            transition-all duration-200
                            hover:scale-110
                            active:scale-95
                            ${styles.text}
                            ripple
                        `}
                        aria-label="Close"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.progressBar}`}>
                    <div 
                        className="h-full bg-white/60 transition-all duration-75 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes toast-in-2025 {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -100%) scale(0.9);
                    }
                    50% {
                        transform: translate(-50%, 10%) scale(1.02);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, 0) scale(1);
                    }
                }

                @keyframes toast-out {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -100%) scale(0.95);
                    }
                }

                @keyframes scale-bounce {
                    0%, 100% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(0.95);
                    }
                    75% {
                        transform: scale(1.05);
                    }
                }

                @keyframes shake-rotate {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-5deg);
                    }
                    75% {
                        transform: rotate(5deg);
                    }
                }

                @keyframes shimmer-fast {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }

                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                .animate-toast-in {
                    animation: toast-in-2025 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .animate-toast-out {
                    animation: toast-out 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
                }

                .animate-scale-bounce {
                    animation: scale-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .animate-shake-rotate {
                    animation: shake-rotate 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
                }

                .animate-shimmer-fast {
                    animation: shimmer-fast 2s infinite;
                }

                .animate-ping-slow {
                    animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

// Toast Container Component (manages multiple toasts)
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>;
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="relative">
                {toasts.map((toast, index) => (
                    <div 
                        key={toast.id}
                        style={{
                            transform: `translateY(${index * 80}px)`,
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        className="pointer-events-auto"
                    >
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => onRemove(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Hook to manage toasts
export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return { toasts, showToast, removeToast };
};

export default Toast;