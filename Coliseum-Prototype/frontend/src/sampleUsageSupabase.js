import React, { useEffect } from 'react';
import supabase from './supabaseClient';

function App() {
  useEffect(() => {
    // Fetch data from Supabase
    const fetchData = async () => {
      let { data, error } = await supabase
        .from('your_table_name')
        .select('*');
        
      if (error) console.error('Error fetching data:', error);
      else console.log('Data:', data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Supabase Environment Variables in React</h1>
    </div>
  );
}

export default App;
