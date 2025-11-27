import React, { useState } from 'react';
import { Payment } from '../types';
import { CreditCardIcon, ArrowLeftIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface ResidentPaymentProps {
    payment: Payment;
    onBack: () => void;
    onConfirmPayment: () => void;
}

const ResidentPayment: React.FC<ResidentPaymentProps> = ({ payment, onBack, onConfirmPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        triggerHapticFeedback();
        setIsProcessing(true);
        // Simulate network request
        setTimeout(() => {
            onConfirmPayment();
            setIsProcessing(false);
        }, 1500);
    };

    const inputClass = "block w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white/50 dark:bg-gray-800/50 focus:ring-violet-500 focus:border-violet-500 text-lg";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        <div className="animate-page-in flex flex-col h-full">
            <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex items-center">
                <button onClick={() => {
                    triggerHapticFeedback();
                    onBack();
                }} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                   <ArrowLeftIcon className="w-6 h-6" />
                </button>                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complete Payment</h1>
                </div>
            </header>
            <div className="flex-grow p-4">
                <div className="text-center mb-8 pt-4">
                    <p className="text-gray-500 dark:text-gray-400">{payment.description}</p>
                    <p className="text-6xl font-black text-gray-800 dark:text-gray-100">
                        ₹{payment.amount.toLocaleString('en-IN')}
                    </p>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label htmlFor="cardNumber" className={labelClass}>Card Number</label>
                        <input id="cardNumber" type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength={19} placeholder="•••• •••• •••• ••••" className={inputClass} required />
                    </div>
                    <div>
                        <label htmlFor="cardName" className={labelClass}>Name on Card</label>
                        <input id="cardName" type="text" placeholder="e.g. Priya Sharma" className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiry" className={labelClass}>Expiry</label>
                            <input id="expiry" type="text" placeholder="MM / YY" className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="cvv" className={labelClass}>CVV</label>
                            <input id="cvv" type="text" placeholder="•••" className={inputClass} required />
                        </div>
                    </div>
                </form>
            </div>

            <footer className="p-4 sticky bottom-0 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                 <button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="w-full p-4 bg-violet-600 text-white rounded-2xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 ripple flex items-center justify-center disabled:bg-violet-400 disabled:cursor-not-allowed">
                     {isProcessing ? 'Processing...' : (
                        <>
                            <CreditCardIcon className="w-6 h-6 mr-2" />
                            Pay Securely
                        </>
                     )}
                </button>
            </footer>
        </div>
    );
};

export default ResidentPayment;