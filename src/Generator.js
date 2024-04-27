import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

const regions = ['Poland', 'USA', 'Georgia']; // Add more regions if needed

const generateRandomUserData = (region, errorCount, seed = 10) => {
  // Implement logic to generate random user data based on the selected region and error count
    // You can use libraries like faker.js to generate realistic data
    const data = [];
    faker.seed(seed);
  const errorProbability = errorCount / 10; // Calculate error probability

  for (let i = 0; i < 20; i++) {
    const isError = Math.random() < errorProbability;

    // Generate random user data
    const user = {
      identifier: Math.random().toString(36).substr(2, 9), // Random identifier
      name: faker.person.fullName() , // Hard-coded name for now
      address: faker.location.streetAddress(true) , // Hard-coded address for now
      phone: faker.phone.number() , // Hard-coded phone for now
    };

    // Apply error if needed
    if (isError) {
      // Apply errors to different fields
      const errorFields = ['identifier', 'name', 'address', 'phone'];
      const fieldWithError = errorFields[Math.floor(Math.random() * errorFields.length)];
      user[fieldWithError] = 'ERROR';
    }

    data.push(user);
  }

  return data;
};

const Generator = () => {
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState('');

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Generate initial random user data when the component mounts
    generateData();
  }, [selectedRegion, errorCount, seed]);

  const generateData = () => {
    const newData = generateRandomUserData(selectedRegion, errorCount);
    setUserData(newData);
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
  };

  const handleRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000); // Generate random seed
    setSeed(randomSeed.toString());
  };

  const handleSliderChange = (e) => {
    setErrorCount(parseInt(e.target.value));
  };

  return (
    <div>
      <div>
        <label>Select Region: </label>
        <select value={selectedRegion} onChange={handleRegionChange}>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Error Count: </label>
        <input type="range" min="0" max="10" value={errorCount} onChange={handleSliderChange} />
        <input type="number" min="0" max="1000" value={errorCount} onChange={handleSliderChange} />
      </div>
      <div>
        <label>Seed: </label>
        <input type="text" value={seed} onChange={handleSeedChange} />
        <button onClick={handleRandomSeed}>Random</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Random Identifier</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.identifier}</td>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Generator;