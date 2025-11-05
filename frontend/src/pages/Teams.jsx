import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams data
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teams');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tournament Teams</h1>
      
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map(team => (
            <div key={team._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
              {/* Team Header with Logo */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-center">
                  <img 
                    src={team.logoURL || 'https://via.placeholder.com/80/3B82F6/FFFFFF?text=T'} 
                    alt={team.name} 
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg mr-4 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80/3B82F6/FFFFFF?text=' + team.name.charAt(0);
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-blue-100 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Points: <span className="font-bold ml-1">{team.points}</span>
                      </span>
                      <span className="text-blue-100 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Players: <span className="font-bold ml-1">{team.players.length}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Team Stats */}
              <div className="p-4 bg-gray-50 grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-gray-800">{team.matchesPlayed}</div>
                  <div className="text-xs text-gray-600">Played</div>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-green-600">{team.wins}</div>
                  <div className="text-xs text-gray-600">Wins</div>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-yellow-600">{team.draws}</div>
                  <div className="text-xs text-gray-600">Draws</div>
                </div>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-red-600">{team.losses}</div>
                  <div className="text-xs text-gray-600">Losses</div>
                </div>
              </div>
              
              {/* Squad Section */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Squad
                </h3>
                
                {team.players.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {team.players.map((player, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors duration-300 border border-blue-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">#{player.number}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{player.name}</div>
                            <div className="text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">{player.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>No players added to this team yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No teams available</h3>
          <p className="text-gray-500">Teams will appear here once added by the admin.</p>
        </div>
      )}
    </div>
  );
};

export default Teams;