
import React from 'react';
import { StudyGroup } from '../types';
import { Users, Search, MessageCircle, Hash, Plus } from 'lucide-react';

const MOCK_GROUPS: StudyGroup[] = [
    { id: '1', name: 'Python Beginners 2024', members: 1240, description: 'A safe place for absolute beginners to ask questions.', tags: ['Beginner', 'General'], isJoined: true },
    { id: '2', name: 'Data Science Squad', members: 850, description: 'Focusing on Pandas, NumPy and Matplotlib.', tags: ['Data Science', 'Intermediate'] },
    { id: '3', name: 'Web Dev with Django', members: 420, description: 'Building web apps together.', tags: ['Web', 'Django'] },
    { id: '4', name: 'Daily Coding Challenge', members: 3200, description: 'One problem a day keeps the bugs away.', tags: ['Practice', 'Algorithms'] },
    { id: '5', name: 'Asian Timezone Study', members: 150, description: 'Evening study sessions for GMT+8.', tags: ['Social', 'Voice Chat'] },
];

const Community: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Community Groups</h2>
                    <p className="text-slate-500 dark:text-slate-400">Join a squad and learn together!</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-md flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Create Group
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search for topics, languages, or groups..." 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
            </div>

            {/* My Groups Section */}
            <div className="mb-8">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" /> Your Groups
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_GROUPS.filter(g => g.isJoined).map(group => (
                        <div key={group.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{group.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{group.members} Members • <span className="text-green-600 dark:text-green-400">12 Online</span></p>
                            </div>
                            <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700">
                                Open Chat
                            </button>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Explore Section */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Explore Groups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_GROUPS.filter(g => !g.isJoined).map(group => (
                    <div key={group.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                             <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                <Hash className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                             </div>
                             <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                                {group.members} members
                             </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{group.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex-1">
                            {group.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {group.tags.map(tag => (
                                <span key={tag} className="text-xs bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                            Join Group
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
