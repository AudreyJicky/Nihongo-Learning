
import React from 'react';
import { LeaderboardEntry, UserProfile } from '../types';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardProps {
    currentUser: UserProfile;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: '1', name: 'PythonMaster99', xp: 2450, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: '2', name: 'CodeNinja', xp: 2100, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: '3', name: 'DevSarah', xp: 1950, rank: 3, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Coder' },
    { id: '4', name: 'AlgoRhythm', xp: 1600, rank: 4, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot' },
    { id: '5', name: 'PySnake', xp: 1200, rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: '6', name: 'ByteMe', xp: 950, rank: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Calvin' },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
    // Inject current user into ranking for demo purposes if not present
    const userEntry: LeaderboardEntry = {
        id: 'user-current',
        name: currentUser.name,
        xp: currentUser.xp,
        rank: 99, // Placeholder rank
        avatar: currentUser.avatar
    };

    const displayList = [...MOCK_LEADERBOARD];

    const getRankIcon = (rank: number) => {
        switch(rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-slate-400 fill-slate-400" />;
            case 3: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-slate-500 dark:text-slate-400 w-6 text-center">{rank}</span>;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Global Leaderboard</h2>
                <p className="text-slate-500 dark:text-slate-400">See how you stack up against other learners!</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                     <div className="flex items-center">
                        <Trophy className="w-8 h-8 mr-3 text-yellow-300" />
                        <div>
                            <div className="font-bold text-lg">Your Current Rank</div>
                            <div className="text-purple-200 text-sm">Top 20% of learners</div>
                        </div>
                     </div>
                     <div className="text-right">
                         <div className="text-3xl font-bold">#{userEntry.rank}</div>
                         <div className="text-sm opacity-80">{userEntry.xp} XP</div>
                     </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {displayList.map((entry) => (
                        <div key={entry.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="w-12 flex justify-center mr-4">
                                {getRankIcon(entry.rank)}
                            </div>
                            <img src={entry.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-600 mr-4" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-white">{entry.name}</h4>
                                <span className="text-xs text-slate-400">Level {Math.floor(entry.xp / 100) + 1}</span>
                            </div>
                            <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                {entry.xp} XP
                            </div>
                        </div>
                    ))}
                    {/* Current user sticky at bottom if not in list */}
                    <div className="p-4 flex items-center bg-blue-50 dark:bg-blue-900/20 border-t border-slate-200 dark:border-slate-700">
                         <div className="w-12 flex justify-center mr-4">
                             <span className="font-bold text-slate-500 dark:text-slate-400 w-6 text-center">{userEntry.rank}</span>
                         </div>
                         <img src={userEntry.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-blue-200 dark:border-blue-500 mr-4" />
                         <div className="flex-1">
                             <h4 className="font-bold text-slate-800 dark:text-white flex items-center">
                                {userEntry.name} <span className="ml-2 text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-1.5 py-0.5 rounded">YOU</span>
                             </h4>
                             <span className="text-xs text-slate-400">Level {Math.floor(userEntry.xp / 100) + 1}</span>
                         </div>
                         <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                             {userEntry.xp} XP
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
