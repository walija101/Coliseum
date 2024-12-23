// src/components/MatchList.js
import React, { useEffect, useState } from 'react';
import { getMatches } from '../api/apiService';

const MatchList = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const data = await getMatches();
      setMatches(data);
    };
    fetchMatches();
  }, []);

  return (
    <div>
      <h2>My Matches</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id}>{match.user1?.firstName} - {match.user2?.firstName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
