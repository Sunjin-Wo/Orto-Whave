import React, { useEffect, useState } from 'react';
import NotificationService from '../services/NotificationService';

const NotificationBell: React.FC = () => {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            NotificationService.connect(userId);
        }

        return () => {
            NotificationService.disconnect();
        };
    }, []);

    return (
        <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
                <svg 
                    className={`w-6 h-6 ${hasUnread ? 'text-red-500' : 'text-gray-600'}`}
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {hasUnread && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell; 