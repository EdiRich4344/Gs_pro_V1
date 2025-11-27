export const triggerHapticFeedback = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        // A short, subtle vibration for tap feedback.
        navigator.vibrate(5);
    }
};
