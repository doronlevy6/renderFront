//src\components\ManagementPage.js:

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "./WelcomePage.css";

function ManagementPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [usernames, setUsernames] = useState([]);
  const [enlistedUsernames, setEnlistedUsernames] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [unselectedUsernames, setUnselectedUsernames] = useState([]);

  // New state variable for checkbox
  const [isTierMethod, setIsTierMethod] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL

  const handleCheckboxChange = (e, username) => {
    if (e.target.checked) {


      // Remove from unselectedUsernames if it's there
      if (unselectedUsernames.includes(username)) {
        setUnselectedUsernames(prev => prev.filter(u => u !== username));
      }
      // Add to selected usernames
      if (!selectedUsernames.includes(username) && !enlistedUsernames.includes(username)) {
        setSelectedUsernames([...selectedUsernames, username]);
      }
    } else {
      // Remove from selectedUsernames if it's there
      if (selectedUsernames.includes(username)) {
        setSelectedUsernames(prev => prev.filter(u => u !== username));
      }
      // Add to unselectedUsernames if it was already enlisted
      if (enlistedUsernames.includes(username) && !unselectedUsernames.includes(username)) {
        setUnselectedUsernames([...unselectedUsernames, username]);
      }
    }
  };


  const handleEnlistUsers = async () => {
    try {
      // Enlist usernames from selectedUsernames
      if (selectedUsernames.length > 0 || (unselectedUsernames.length > 0)) {
        if (selectedUsernames.length > 0) {
          await axios.post(`${apiUrl}/enlist-users`, {
            usernames: selectedUsernames,
            isTierMethod, // Include the method selection in payload
          });
        }

        // Unenlist usernames from unselectedUsernames
        if (unselectedUsernames.length > 0) {
          await axios.post(`${apiUrl}/delete-enlist`, {
            usernames: unselectedUsernames,
            isTierMethod,
          });
        }
      } else {
        await axios.post(`${apiUrl}/delete-enlist`, {
          isTierMethod,
        });
      }

      alert("Users updated successfully!");

      // Update local state to reflect the changes
      setEnlistedUsernames(prevState => [
        ...prevState.filter(username => !unselectedUsernames.includes(username)),
        ...selectedUsernames
      ]);
      setSelectedUsernames([]);
      setUnselectedUsernames([]);

    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    if (!isAuthenticated || user.username !== "doron") {
      alert("Access Denied!");
      // Redirect or do something to handle unauthorized access.
      return;
    }

    const fetchData = async () => {
      try {
        const usernamesResponse = await axios.get(
          `${apiUrl}/usernames`
        );
        if (usernamesResponse.data.success) {
          setUsernames(usernamesResponse.data.usernames);
        }
        const enlistedResponse = await axios.get(`${apiUrl}/enlist`);
        if (enlistedResponse.data.success) {
          setEnlistedUsernames(enlistedResponse.data.usernames);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const currentPlayingCount = enlistedUsernames.length
    - unselectedUsernames.length
    + selectedUsernames.length;

  return (
    <div className="welcome-page">
      <div className="welcome-section">
        <label>
          <input
            type="checkbox"
            checked={isTierMethod}
            onChange={(e) => setIsTierMethod(e.target.checked)}
          />
          Use Tier Method
        </label>
        <div>
          <h3>Playing now: {currentPlayingCount}</h3>
        </div>
        <button onClick={handleEnlistUsers}>Update Players</button>
        <div className="usernames-list">
          {usernames.map((username) => (
            <div key={username} className="team-averages">
              <input
                type="checkbox"
                checked={(selectedUsernames.includes(username) || enlistedUsernames.includes(username)) && !unselectedUsernames.includes(username)}
                onChange={(e) => handleCheckboxChange(e, username)}
              />
              {username}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}

export default ManagementPage;
