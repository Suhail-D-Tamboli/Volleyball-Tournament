import React from 'react';

const TeamCard = ({ team }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-200">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <img 
            src={team.logoURL || 'https://via.placeholder.com/60/3B82F6/FFFFFF?text=T'} 
            alt={team.name} 
            className="w-16 h-16 rounded-full mr-4 border-3 border-blue-500 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/60/3B82F6/FFFFFF?text=' + team.name.charAt(0);
            }}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
            <p className="text-gray-600 text-sm">Points: <span className="font-bold text-blue-600">{team.points}</span></p>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-3">
          <div className="text-center">
            <p className="font-bold text-gray-800">{team.matchesPlayed}</p>
            <p>Played</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-green-600">{team.wins}</p>
            <p>Wins</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-yellow-600">{team.draws}</p>
            <p>Draws</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-red-600">{team.losses}</p>
            <p>Losses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;