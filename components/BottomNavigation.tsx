import React from 'react';
import { MessageCircle, User, Book, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'chat', label: 'Sanctuary', icon: MessageCircle },
    { id: 'customization', label: 'Persona', icon: User },
    { id: 'knowledge', label: 'Knowledge', icon: Book },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-slate-950/90 backdrop-blur-md border-t border-purple-500/30 z-50">
      <div className="flex justify-around items-center px-2 py-3 pb-6 md:pb-3 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                isActive
                  ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] scale-110'
                  : 'text-slate-500 hover:text-purple-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-cinzel tracking-wider uppercase ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
