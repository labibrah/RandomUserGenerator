import React, { useState, useEffect } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";


const regions = [ 'USA', 'India', 'Serbia']; // Add more regions if needed

const applyRandomError = (str) => {
    const errorType = Math.floor(Math.random() * 3); // Randomly choose an error type (0, 1, or 2)
    switch (errorType) {
        case 0:
            return deleteCharacter(str);
        case 1:
            return addRandomCharacter(str);
        case 2:
            return swapNearCharacters(str);
        default:
            return str;
    }
};

const deleteCharacter = (str) => {
    const index = Math.floor(Math.random() * str.length); // Choose a random index to delete
    return str.slice(0, index) + str.slice(index + 1); // Remove character at the chosen index
};

const addRandomCharacter = (str) => {
    const index = Math.floor(Math.random() * str.length); // Choose a random index to add a character
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Define alphabet
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)]; // Choose a random character from the alphabet
    return str.slice(0, index) + randomChar + str.slice(index); // Insert the random character at the chosen index
};

const swapNearCharacters = (str) => {
    const index = Math.floor(Math.random() * (str.length - 1)); // Choose a random index (excluding the last character)
    return str.slice(0, index) + str[index + 1] + str[index] + str.slice(index + 2); // Swap characters at the chosen index and the next one
};
    
const times = (n, fn) => {
    if (n < 0) throw new Error("The first argument cannot be negative.");
    return (arg) => {
        for (let i = Math.floor(n); i--;) arg = fn(arg);
        return Math.random() < n % 1 ? fn(arg) : arg;
    };
};
    
const generateRandomUserData = async (region, errorCount=0, seed, page = 1) => {
    try {
        let code;
        switch (region) {
            case 'India':
                code = 'in';
                break;
            case 'USA':
                code = 'us';
                break;
            case 'Serbia':
                code = 'rs';
                break;
        }
        console.log(code);
      const response = await fetch(`https://randomuser.me/api/?seed=${seed + page}&results=20&nat=${code}&inc=name,location,phone`);
        const data = await response.json();
        console.log(data);
        const users = data.results.map(result => {
        const identifier = Math.random().toString(36).substr(2, 9);
        const name = `${result.name.title} ${result.name.first} ${result.name.last}`;
        const address = `${result.location.street.number} ${result.location.street.name}, ${result.location.city}, ${result.location.state}, ${result.location.country}, ${result.location.postcode}`;
            const phone = result.phone;
            
            let modifiedName = name;
            let modifiedAddress = address;
            let modifiedPhone = phone;

            // Introduce errors based on the specified error count
            if (errorCount > 0) {
                const applyError = times(errorCount, applyRandomError);
                modifiedName = applyError(modifiedName);
                modifiedAddress = applyError(modifiedAddress);
                modifiedPhone = applyError(modifiedPhone);
            }

            return { identifier, name: modifiedName, address: modifiedAddress, phone: modifiedPhone };
      });
      return users;
    } catch (error) {
      throw new Error('Error fetching user data:', error);
    }
  };
const Generator = () => {
// const storedCountry = sessionStorage.getItem('selectedCountry');
// const initialCountry = storedCountry ? storedCountry : regions[0];
    
// const storedSeed = sessionStorage.getItem('selectedSeed');
const initialSeed = Math.floor(Math.random() * 1000000).toString();
    
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [errorCount, setErrorCount] = useState(0);
 const [selectedSeed, setSeed] = useState(initialSeed);
  const [page, setPage] = useState(1);
    

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [hasMore, setHasMore] = useState(true); 

//   useEffect(() => {
//     // Generate initial random user data when the component mounts
//     generateData();
//   }, [selectedRegion]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateData(); // Call generateData after a delay when seed value changes
    }, 1000); // Adjust delay time as needed
  
    // Cleanup function to clear the timeout if the seed value changes again before the timeout finishes
    return () => clearTimeout(timeoutId);
  }, [selectedRegion, errorCount, selectedSeed]);
    
  const generateData = async () => {
      
      try {
        const newData = await generateRandomUserData(selectedRegion, errorCount, selectedSeed, 1);
        setUserData(newData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
  };

    const handleRegionChange = (e) => {
        // window.location.reload(false);
        console.log(localStorage);
      setSelectedRegion(e.target.value);
  };

  const handleSeedChange = (e) => {
      setSeed(e.target.value);
    //   debugger;
    //   setTimeout(() => {
    //     generateData(selectedSeed);
    //   }, 2000);
  };

    const handleRandomSeed = () => {
        const randomSeed = Math.floor(Math.random() * 1000000);
        setSeed(randomSeed.toString());
        // Call generateData after a delay
        // setTimeout(() => {
        //   generateData(selectedSeed);
        // }, 2000); // Adjust delay time as needed
  };

  const handleSliderChange = (e) => {
      let value = parseInt(e.target.value);
      value = Math.max(0, Math.min(1000, value));
      setErrorCount(value);

      console.log(value);
  };
    

  const fetchMoreData = async() => {
    // a fake async api call like which sends
      // 20 more records in 1.5 secs
      let code;
      switch (selectedRegion) {
          case 'India':
              code = 'in';
              break;
          case 'USA':
              code = 'us';
              break;
          case 'Serbia':
              code = 'rs';
              break;
      }
      setPage((prevPage) => prevPage + 1);
    const response = await fetch(`https://randomuser.me/api/?seed=${selectedSeed + page}&results=10&nat=${code}&inc=name,location,phone`);
        const data = await response.json();
        console.log(data);
        const users = data.results.map(result => {
        const identifier = Math.random().toString(36).substr(2, 9);
        const name = `${result.name.title} ${result.name.first} ${result.name.last}`;
        const address = `${result.location.street.number} ${result.location.street.name}, ${result.location.city}, ${result.location.state}, ${result.location.country}, ${result.location.postcode}`;
        const phone = result.phone;
            return { identifier, name, address, phone };
        });
        setUserData((prevUserData) => [...prevUserData, ...users]);
      
  };

    return (
        <InfiniteScroll
        dataLength={userData.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        >
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
        <input type="text" value={selectedSeed} onChange={handleSeedChange} />
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
       
      </InfiniteScroll>
  
  );
};

export default Generator;