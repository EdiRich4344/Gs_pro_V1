import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ArrowLeftIcon, PaperAirplaneIcon, BotSparklesIcon, UserCircleIcon } from './icons';
import { triggerHapticFeedback } from '../utils/nativeFeedback';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface ChatbotProps {
    onBack: () => void;
    initialPrompt?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ onBack, initialPrompt }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;
        
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: messageText }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: newMessages.map(msg => ({ role: msg.role, parts: msg.parts })),
            });
            
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text }] };
            setMessages([...newMessages, modelMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialPrompt) {
            sendMessage(initialPrompt);
        }
    }, [initialPrompt]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(userInput);
        setUserInput('');
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-10 p-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-full hover:scale-105 transition-transform">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                        <BotSparklesIcon className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini</p>
                    </div>
                </div>
            </header>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {messages.map((msg, idx) => (
                    msg.role === 'user' ? (
                        <UserMessage key={idx} text={msg.parts[0].text} />
                    ) : (
                        <BotMessage key={idx} text={msg.parts[0].text} />
                    )
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <footer className="sticky bottom-0 p-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-3xl bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 outline-none transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !userInput.trim()}
                        className="w-14 h-14 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-3xl flex items-center justify-center shadow-lg transform active:scale-95 transition-all"
                        onClick={() => triggerHapticFeedback()}
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

// User message
const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end animate-slide-in-right">
        <div className="max-w-xs md:max-w-md px-5 py-3 rounded-3xl rounded-br-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
            <p className="text-sm leading-relaxed">{text}</p>
        </div>
    </div>
);

// Bot message
const BotMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-start gap-3 animate-slide-in-left">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
            <BotSparklesIcon className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="max-w-xs md:max-w-md px-5 py-3 rounded-3xl rounded-bl-lg bg-white/80 dark:bg-gray-800/80 shadow-inner">
            <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-200">{text}</p>
        </div>
    </div>
);

// Loading indicator
const LoadingIndicator = () => (
    <div className="flex justify-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-md flex-shrink-0">
            <BotSparklesIcon className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="max-w-xs px-5 py-3 rounded-3xl rounded-bl-lg bg-white/80 dark:bg-gray-800/80 flex items-center space-x-2 shadow-inner">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-300" />
        </div>
    </div>
);

export default Chatbot;
