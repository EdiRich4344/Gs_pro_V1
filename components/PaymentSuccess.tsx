import React from 'react';
import { Payment } from '../types';
import { CheckCircleIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

interface PaymentSuccessProps {
    payment: Payment;
    onDone: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ payment, onDone }) => {
    return (
        <div className="animate-page-in flex flex-col h-full justify-between">
             <header className="sticky top-0 z-10 p-4 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center">
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payment Successful</h1>
            </header>
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <CheckCircleIcon className="w-24 h-24 text-green-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6">Thank You!</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Your payment has been processed and your account is updated.</p>

                <div className="mt-8 bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-gray-700/50 w-full max-w-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                        <span className="font-bold text-xl text-gray-800 dark:text-gray-100">₹{payment.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                        <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{`TXN${payment.id}${Date.now()}`.slice(0,12)}</span>
                    </div>
                </div>
            </div>
            
            <footer className="p-4 sticky bottom-0 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md">
                 <button 
                    onClick={() => {
                        triggerHapticFeedback();
                        onDone();
                    }}
                    className="w-full p-4 bg-violet-600 text-white rounded-2xl font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 ripple">
                    Done
                </button>
            </footer>
        </div>
    );
};

export default PaymentSuccess;
