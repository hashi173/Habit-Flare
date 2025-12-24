import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Moon, Sun, Trash2, Shield, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetData: () => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, updateSettings, onResetData }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    onResetData();
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };
  
  return (
    <div className="pb-24 px-6 pt-8 max-w-md mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      {/* Privacy Badge */}
      <div className="flex items-start gap-3 bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl mb-8 border border-brand-100 dark:border-brand-800">
        <div className="bg-brand-100 dark:bg-brand-800 p-2 rounded-lg text-brand-600 dark:text-brand-300">
            <Shield size={24} />
        </div>
        <div>
            <h3 className="font-bold text-brand-800 dark:text-brand-300 text-sm mb-1">Privacy First</h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed">
                HabitFlare works entirely offline. Your habits and streaks are stored securely on this device and are never shared with the cloud.
            </p>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
         <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Appearance</h2>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                    {settings.darkMode ? <Moon size={20}/> : <Sun size={20}/>}
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-lg">Dark Mode</span>
                    <span className="text-xs text-gray-400">Easy on the eyes</span>
                </div>
            </div>
            <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-brand-500' : 'bg-gray-300'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : ''}`} />
            </button>
         </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-red-50 dark:border-red-900/30">
         <div className="flex items-center gap-2 mb-4">
             <AlertTriangle size={16} className="text-red-500" />
             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Data Management</h2>
         </div>
         
         <p className="text-sm text-gray-500 mb-4">
             Want to start fresh? This will permanently delete all your habits, streaks, and history from this device.
         </p>

         <button 
            onClick={handleResetClick}
            className="w-full flex items-center justify-center gap-2 text-white font-bold p-4 bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/30 active:scale-95"
         >
            <Trash2 size={20} />
            Reset Application Data
         </button>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-400 text-xs font-medium">HabitFlare v1.0.0</p>
        <p className="text-gray-300 text-[10px] mt-1">Built for consistency</p>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all border border-gray-100 dark:border-slate-800">
             <div className="flex justify-center mb-6">
                 <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 animate-pulse-fast">
                    <Trash2 size={40} />
                 </div>
             </div>
             
             <h3 className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white">Delete Everything?</h3>
             <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
               This will permanently erase all your habits, current streaks, and calendar history. 
               <br/><br/>
               <span className="font-bold text-red-500">This action cannot be undone.</span>
             </p>
             
             <div className="space-y-3">
               <button 
                 onClick={confirmReset}
                 className="w-full py-4 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                 <Trash2 size={20} />
                 Yes, Wipe My Data
               </button>
               <button 
                 onClick={cancelReset}
                 className="w-full py-4 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
               >
                 Cancel
               </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;