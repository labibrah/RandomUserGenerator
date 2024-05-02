import React, { useState, useEffect } from 'react';
import './Generator.css'; // Import CSS for styling

const Scroll = () => {
  const regions = ['USA', 'India', 'Serbia'];
  const initialSeed = Math.floor(Math.random() * 1000000).toString();

  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [errorCount, setErrorCount] = useState(0);
  const [selectedSeed, setSeed] = useState(initialSeed);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [hasMore, setHasMore] = useState(true); // State to track if there is more data to load

  useEffect(() => {
    setUserData([]); // Reset user data when region, seed, or error count changes
    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedSeed, errorCount]);

  useEffect(() => {
    if (!loading && hasMore) {
      // Check if it's not currently loading and there is more data to load
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          // User has scrolled to the bottom
          setPage(prevPage => prevPage + 1); // Increment page number
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const response = await fetch(
          `https://randomuser.me/api/?seed=${selectedSeed + page}&results=20&nat=${selectedRegion}&inc=name,location,phone`
        );
        const data = await response.json();
        if (data.results.length === 0) {
          setHasMore(false); // No more data to load
        } else {
          setUserData(prevData => [...prevData, ...data.results]); // Append new data to existing data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedSeed, errorCount, page]);

  const handleRegionChange = e => {
    setSelectedRegion(e.target.value);
  };

  const handleSeedChange = e => {
    setSeed(e.target.value);
  };

  const handleRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    setSeed(randomSeed.toString());
  };

  const handleSliderChange = e => {
    setErrorCount(parseInt(e.target.value));
  };

  return (
    <div className="container">
      <div>
        <label>Select Region: </label>
        <select value={selectedRegion} onChange={handleRegionChange}>
          {regions.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      {/* Other input fields */}
      <div className="userDataContainer">
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{`${user.name.title} ${user.name.first} ${user.name.last}`}</td>
                <td>{`${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="loading">Loading...</div>}
      </div>
    </div>
  );
};

export default Scroll;
