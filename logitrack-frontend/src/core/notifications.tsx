import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface NotificationContextType {
    notifySuccess: (msg: string) => void;
    notifyError: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error'>('success');

    const notifySuccess = (msg: string) => {
        setMessage(msg);
        setType('success');
        setTimeout(() => setMessage(null), 4000);
    };

    const notifyError = (msg: string) => {
        setMessage(msg);
        setType('error');
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
            {message && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        color: '#fff',
                        backgroundColor: type === 'success' ? '#2e7d32' : '#d32f2f',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                        zIndex: 9999,
                    }}
                >
                    {message}
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe ser usado dentro de NotificationProvider');
    }
    return context;
};