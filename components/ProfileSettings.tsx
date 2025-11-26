
import React, { useState } from 'react';
import { UserProfile, Gender } from '../types';
import { Save, User, Mail, Calendar, Heart, Camera, Check } from 'lucide-react';

interface ProfileSettingsProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [birthday, setBirthday] = useState(user.birthday || '');
    const [gender, setGender] = useState<Gender>(user.gender || 'Prefer not to say');
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({
            ...user,
            name,
            bio,
            birthday,
            gender
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Profile Settings</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar Section */}
                    <div className="relative -mt-12 mb-6 flex justify-between items-end">
                        <div className="relative">
                            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100" />
                            <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white dark:border-slate-800 text-white cursor-pointer hover:bg-blue-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Member Since</div>
                            <div className="text-sm font-medium text-slate-800 dark:text-white">{user.joinedDate || new Date().getFullYear()}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <User className="w-4 h-4 mr-2" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <Mail className="w-4 h-4 mr-2" /> Email (Read-only)
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> Birthday
                                </label>
                                <input
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Gender
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as Gender)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Heart className="w-4 h-4 mr-2" /> Learning Preferences / Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about your coding goals..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end">
                            {saved && (
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium mr-4 flex items-center animate-fade-in">
                                    <Check className="w-4 h-4 mr-1" /> Saved Successfully
                                </span>
                            )}
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center"
                            >
                                <Save className="w-5 h-5 mr-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
