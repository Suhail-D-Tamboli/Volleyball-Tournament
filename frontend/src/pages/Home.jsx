import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import TeamCard from '../components/TeamCard';
import MatchCard from '../components/MatchCard';
import { Link } from 'react-router-dom';

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('points');

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

    // Fetch matches data
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchTeams();
    fetchMatches();
  }, []);

  // Filter upcoming and completed matches
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const completedMatches = matches.filter(match => match.status === 'completed');

  // Sort teams by points
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });

  // Function to download points table as PDF
  const downloadPointsTableAsPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Volleyball Tournament - Points Table", 105, 20, null, null, "center");
    
    // Add table using autoTable
    doc.autoTable({
      startY: 30,
      head: [['Rank', 'Team', 'Played', 'Wins', 'Draws', 'Losses', 'Points']],
      body: sortedTeams.map((team, index) => [
        index + 1,
        team.name,
        team.matchesPlayed,
        team.wins,
        team.draws,
        team.losses,
        team.points
      ]),
      theme: 'grid',
      styles: { cellPadding: 3, fontSize: 8 },
      headStyles: { fillColor: [26, 82, 118] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Save the PDF
    doc.save("points-table.pdf");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Volleyball Poster */}
      <div className="relative rounded-xl overflow-hidden mb-10 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Volleyball Tournament Tracker</h1>
              <p className="text-xl md:text-2xl opacity-90">Manage your tournament with ease</p>
            </div>
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 md:h-32 md:w-32 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('points')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'points'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Points Table
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Scheduled Matches
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Match Results
            </button>
          </nav>
        </div>
      </div>

      {/* Points Table Tab */}
      {activeTab === 'points' && (
        <section id="points-table">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Team Standings</h2>
            <div className="flex space-x-2">
              <Link to="/teams" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View All Teams
              </Link>
              <button
                onClick={downloadPointsTableAsPDF}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-center">Played</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Draws</th>
                  <th className="py-3 px-4 text-center">Losses</th>
                  <th className="py-3 px-4 text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr key={team._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-bold">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img 
                          src={team.logoURL || `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${team.name.charAt(0)}`} 
                          alt={team.name} 
                          className="w-10 h-10 rounded-full mr-3 border-2 border-gray-300 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${team.name.charAt(0)}`;
                          }}
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{team.matchesPlayed}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-bold">{team.wins}</td>
                    <td className="py-3 px-4 text-center text-yellow-600 font-bold">{team.draws}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-bold">{team.losses}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Scheduled Matches Tab */}
      {activeTab === 'scheduled' && (
        <section id="scheduled-matches">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Scheduled Matches</h2>
            <Link to="/teams" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View All Teams
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map(match => (
                <MatchCard key={match._id} match={match} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">No upcoming matches scheduled.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Match Results Tab */}
      {activeTab === 'results' && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Match Results</h2>
            <Link to="/teams" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View All Teams
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedMatches.length > 0 ? (
              completedMatches.map(match => (
                <MatchCard key={match._id} match={match} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">No matches completed yet.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;