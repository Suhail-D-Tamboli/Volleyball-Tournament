import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Form states
  const [teamForm, setTeamForm] = useState({ name: '', logo: null, logoPreview: null });
  const [playerForm, setPlayerForm] = useState({ teamId: '', name: '', number: '', role: '' });
  const [matchForm, setMatchForm] = useState({ teamA: '', teamB: '', date: '', time: '', venue: '' });
  const [resultForm, setResultForm] = useState({ matchId: '', winner: '', teamAScore: '', teamBScore: '' });

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAdmin(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        fetch('http://localhost:5000/api/teams'),
        fetch('http://localhost:5000/api/matches')
      ]);

      if (!teamsRes.ok || !matchesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const teamsData = await teamsRes.json();
      const matchesData = await matchesRes.json();

      setTeams(teamsData);
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: adminCode })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsAdmin(true);
        localStorage.setItem('adminAuthenticated', 'true');
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminAuthenticated');
    setAdminCode('');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamForm({
        ...teamForm,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    
    // First, upload the logo to get a URL
    if (!teamForm.logo) {
      alert('Please select a logo');
      return;
    }
    
    try {
      // For now, we'll use a placeholder URL
      // In a real application, you would upload the file to a service like Cloudinary
      const logoURL = teamForm.logoPreview || 'https://via.placeholder.com/150';
      
      const response = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: teamForm.name,
          logoURL: logoURL
        })
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([...teams, newTeam]);
        setTeamForm({ name: '', logo: null, logoPreview: null });
        alert('Team added successfully');
        fetchData(); // Refresh data to show the new team
      } else {
        alert('Error adding team');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Error adding team');
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${playerForm.teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playerForm.name,
          number: parseInt(playerForm.number),
          role: playerForm.role
        })
      });

      if (response.ok) {
        alert('Player added successfully');
        setPlayerForm({ teamId: '', name: '', number: '', role: '' });
        fetchData(); // Refresh data
      } else {
        alert('Error adding player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player');
    }
  };

  const handleScheduleMatch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(matchForm)
      });

      if (response.ok) {
        // Instead of manually updating the state, refresh all data to ensure consistency
        await fetchData();
        setMatchForm({ teamA: '', teamB: '', date: '', time: '', venue: '' });
        alert('Match scheduled successfully');
      } else {
        const errorData = await response.json();
        alert(`Error scheduling match: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error scheduling match:', error);
      alert('Error scheduling match');
    }
  };

  const handleUpdateResult = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/matches/${resultForm.matchId}/result`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          winner: resultForm.winner || null,
          teamAScore: parseInt(resultForm.teamAScore),
          teamBScore: parseInt(resultForm.teamBScore)
        })
      });

      if (response.ok) {
        // Instead of manually updating the state, refresh all data to ensure consistency
        await fetchData();
        setResultForm({ matchId: '', winner: '', teamAScore: '', teamBScore: '' });
        alert('Match result updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Error updating match result: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating match result:', error);
      alert('Error updating match result');
    }
  };

  const handleResetTournament = async () => {
    if (window.confirm('Are you sure you want to reset the entire tournament? This cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/reset', {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Tournament reset successfully');
          fetchData(); // Refresh data
        } else {
          alert('Error resetting tournament');
        }
      } catch (error) {
        console.error('Error resetting tournament:', error);
        alert('Error resetting tournament');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Panel</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your admin code to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">Admin Code</label>
              <div className="mt-1">
                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-blue-100">Manage your volleyball tournament</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Teams
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Matches
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Results
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-400 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Teams</p>
                    <p className="text-2xl font-bold">{teams.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-400 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Matches</p>
                    <p className="text-2xl font-bold">{matches.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-400 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ongoing Matches</p>
                    <p className="text-2xl font-bold">
                      {matches.filter(match => match.status === 'ongoing').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('teams')}
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Team</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('matches')}
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300"
                >
                  <div className="bg-green-100 rounded-full p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Schedule Match</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('results')}
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300"
                >
                  <div className="bg-purple-100 rounded-full p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Update Results</span>
                </button>
                
                <button
                  onClick={handleResetTournament}
                  className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300"
                >
                  <div className="bg-red-100 rounded-full p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Reset Tournament</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            {/* Add Team Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Team</h3>
              <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">Team Logo</label>
                  <input
                    type="file"
                    id="teamLogo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {teamForm.logoPreview && (
                    <div className="mt-2">
                      <img src={teamForm.logoPreview} alt="Logo preview" className="w-16 h-16 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Add Team
                  </button>
                </div>
              </form>
            </div>

            {/* Add Player Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Player to Team</h3>
              <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="playerTeam" className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
                  <select
                    id="playerTeam"
                    value={playerForm.teamId}
                    onChange={(e) => setPlayerForm({ ...playerForm, teamId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">Player Name</label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerForm.name}
                    onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                  <input
                    type="number"
                    id="playerNumber"
                    value={playerForm.number}
                    onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="playerRole" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    id="playerRole"
                    value={playerForm.role}
                    onChange={(e) => setPlayerForm({ ...playerForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Add Player
                  </button>
                </div>
              </form>
            </div>

            {/* Teams List with Squad */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Teams & Squad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                  <div key={team._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                      <div className="flex items-center">
                        <img 
                          src={team.logoURL || 'https://via.placeholder.com/50'} 
                          alt={team.name} 
                          className="w-12 h-12 rounded-full border-2 border-white mr-3 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50/3B82F6/FFFFFF?text=' + team.name.charAt(0);
                          }}
                        />
                        <h4 className="text-lg font-bold text-white">{team.name}</h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Points: <span className="font-bold text-blue-600">{team.points}</span></span>
                        <span>Players: <span className="font-bold">{team.players.length}</span></span>
                      </div>
                      
                      {team.players.length > 0 ? (
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Squad:</h5>
                          <ul className="space-y-2">
                            {team.players.slice(0, 5).map((player, index) => (
                              <li key={index} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                                <span className="font-medium">{player.name}</span>
                                <span className="text-gray-600">#{player.number} ({player.role})</span>
                              </li>
                            ))}
                            {team.players.length > 5 && (
                              <li className="text-xs text-gray-500 text-center pt-1">
                                +{team.players.length - 5} more players
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No players added yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Schedule Match Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule New Match</h3>
              <form onSubmit={handleScheduleMatch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="teamA" className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                  <select
                    id="teamA"
                    value={matchForm.teamA}
                    onChange={(e) => setMatchForm({ ...matchForm, teamA: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Team A</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="teamB" className="block text-sm font-medium text-gray-700 mb-1">Team B</label>
                  <select
                    id="teamB"
                    value={matchForm.teamB}
                    onChange={(e) => setMatchForm({ ...matchForm, teamB: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Team B</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matchDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    id="matchDate"
                    value={matchForm.date}
                    onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="matchTime" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    id="matchTime"
                    value={matchForm.time}
                    onChange={(e) => setMatchForm({ ...matchForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="matchVenue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input
                    type="text"
                    id="matchVenue"
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Schedule Match
                  </button>
                </div>
              </form>
            </div>

            {/* Matches List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Scheduled Matches</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map(match => (
                      <tr key={match._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={match.teamA?.logoURL || `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${match.teamA?.name?.charAt(0) || 'A'}`} 
                                alt={match.teamA?.name || 'Team A'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${match.teamA?.name?.charAt(0) || 'A'}`;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{match.teamA?.name || 'Team A'}</div>
                            </div>
                            <div className="mx-2 text-sm font-medium text-gray-500">vs</div>
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={match.teamB?.logoURL || `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${match.teamB?.name?.charAt(0) || 'B'}`} 
                                alt={match.teamB?.name || 'Team B'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/40/3B82F6/FFFFFF?text=${match.teamB?.name?.charAt(0) || 'B'}`;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{match.teamB?.name || 'Team B'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(match.date).toLocaleDateString()} at {match.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{match.venue}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            match.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            match.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Update Result Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Update Match Result</h3>
              <form onSubmit={handleUpdateResult} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="resultMatch" className="block text-sm font-medium text-gray-700 mb-1">Select Match</label>
                  <select
                    id="resultMatch"
                    value={resultForm.matchId}
                    onChange={(e) => setResultForm({ ...resultForm, matchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a match</option>
                    {matches
                      .filter(match => match.status === 'upcoming')
                      .map(match => (
                        <option key={match._id} value={match._id}>
                          {match.teamA?.name} vs {match.teamB?.name} - {new Date(match.date).toLocaleDateString()}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matchWinner" className="block text-sm font-medium text-gray-700 mb-1">Winner (optional for draw)</label>
                  <select
                    id="matchWinner"
                    value={resultForm.winner}
                    onChange={(e) => setResultForm({ ...resultForm, winner: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Draw (no winner)</option>
                    {resultForm.matchId && (
                      <>
                        <option value={matches.find(m => m._id === resultForm.matchId)?.teamA?._id}>
                          {matches.find(m => m._id === resultForm.matchId)?.teamA?.name}
                        </option>
                        <option value={matches.find(m => m._id === resultForm.matchId)?.teamB?._id}>
                          {matches.find(m => m._id === resultForm.matchId)?.teamB?.name}
                        </option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="teamAScore" className="block text-sm font-medium text-gray-700 mb-1">
                    {resultForm.matchId ? matches.find(m => m._id === resultForm.matchId)?.teamA?.name + ' Score' : 'Team A Score'}
                  </label>
                  <input
                    type="number"
                    id="teamAScore"
                    value={resultForm.teamAScore}
                    onChange={(e) => setResultForm({ ...resultForm, teamAScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teamBScore" className="block text-sm font-medium text-gray-700 mb-1">
                    {resultForm.matchId ? matches.find(m => m._id === resultForm.matchId)?.teamB?.name + ' Score' : 'Team B Score'}
                  </label>
                  <input
                    type="number"
                    id="teamBScore"
                    value={resultForm.teamBScore}
                    onChange={(e) => setResultForm({ ...resultForm, teamBScore: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
                  >
                    Update Result
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;