'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, LogOut, Lock } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const getInitial = (email: string | null | undefined) => {
        if (!email) return '?';
        return email.charAt(0).toUpperCase();
    };

    const getColorFromEmail = (email: string | null | undefined) => {
        if (!email) return 'bg-pink-500 dark:bg-pink-600';

        // Generate a hash from the email
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }

        // colors for avatar backgrounds
        const colors = [
            'bg-pink-500 dark:bg-pink-600',
            'bg-purple-500 dark:bg-purple-600',
            'bg-blue-500 dark:bg-blue-600',
            'bg-green-500 dark:bg-green-600',
            'bg-yellow-500 dark:bg-yellow-600',
            'bg-red-500 dark:bg-red-600',
            'bg-indigo-500 dark:bg-indigo-600',
            'bg-teal-500 dark:bg-teal-600',
            'bg-orange-500 dark:bg-orange-600',
            'bg-cyan-500 dark:bg-cyan-600',
        ];

        // Use the hash to pick a color
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    return (
        <nav className="bg-blue-600 dark:bg-gray-900 text-white p-4 shadow-lg transition-colors">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    <h1 className="text-2xl">Secure Vault</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'light' ? <Moon className="w-7 h-7 text-gray-900 hover:text-black" /> : <Sun className="w-7 h-7 text-yellow-400 hover:text-yellow-500" />}
                        </button>
                        <div className="absolute right-0 mt-2 px-3 py-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                            Dark Mode: {theme === 'light' ? 'Off' : 'On'}
                            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-300 dark:bg-gray-800 transform rotate-45"></div>
                        </div>
                    </div>
                    {session && (
                        <>
                            <div className="relative group">
                                <div className={`w-8 h-8 rounded-full ${getColorFromEmail(session.user?.email)} flex items-center justify-center text-white cursor-pointer`}>
                                    {getInitial(session.user?.email)}
                                </div>
                                <div className="absolute right-0 mt-2 px-3 py-2 bg-gray-300 dark:bg-gray-800 text-black dark:text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                    {session.user?.email}
                                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-300 dark:bg-gray-800 transform rotate-45"></div>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 dark:bg-red-600 rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}