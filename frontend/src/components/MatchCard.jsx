import React from 'react';

const MatchCard = ({ match }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
  };

  // Function to generate a placeholder image with team name initial
  const getPlaceholderImage = (teamName, defaultText = 'T') => {
    const text = teamName ? teamName.charAt(0).toUpperCase() : defaultText;
    return `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${text}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        {/* Match header with status */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            match.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
            match.status === 'completed' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(match.date)} at {formatTime(match.time)}
          </span>
        </div>

        {/* Team A */}
        <div className="flex items-center justify-between mb-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <img 
              src={match.teamA?.logoURL || getPlaceholderImage(match.teamA?.name, 'A')} 
              alt={match.teamA?.name || 'Team A'} 
              className="w-10 h-10 rounded-full mr-3 border-2 border-gray-300 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getPlaceholderImage(match.teamA?.name, 'A');
              }}
            />
            <span className="font-bold">{match.teamA?.name || 'Team A'}</span>
          </div>
          {match.status === 'completed' && (
            <span className="font-bold text-xl">{match.teamAScore}</span>
          )}
        </div>

        {/* VS indicator */}
        <div className="text-center text-gray-500 text-sm my-2 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <span className="relative bg-white px-2 text-gray-500">VS</span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between mt-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <img 
              src={match.teamB?.logoURL || getPlaceholderImage(match.teamB?.name, 'B')} 
              alt={match.teamB?.name || 'Team B'} 
              className="w-10 h-10 rounded-full mr-3 border-2 border-gray-300 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getPlaceholderImage(match.teamB?.name, 'B');
              }}
            />
            <span className="font-bold">{match.teamB?.name || 'Team B'}</span>
          </div>
          {match.status === 'completed' && (
            <span className="font-bold text-xl">{match.teamBScore}</span>
          )}
        </div>

        {/* Venue */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{match.venue || 'Venue TBD'}</span>
          </div>
        </div>

        {/* Winner indicator for completed matches */}
        {match.status === 'completed' && match.winner && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Winner: {match.winner?.name || 'Draw'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;