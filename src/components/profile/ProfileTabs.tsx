// src/components/profile/ProfileTabs.tsx
import React from 'react';

export type TabType = 'personal' | 'games' | 'stats';

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'personal'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Información Personal
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'games'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('games')}
        >
          Mis Juegos
        </button>
        <button
          className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
            activeTab === 'stats'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Estadísticas
        </button>
      </nav>
    </div>
  );
};

export default ProfileTabs;