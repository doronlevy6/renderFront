//src\components\ManagementPage.js:

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "./WelcomePage.css";

function ManagementPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [usernames, setUsernames] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);

  const handleCheckboxChange = (e, username) => {
    if (e.target.checked) {
      setSelectedUsernames([...selectedUsernames, username]);
    } else {
      setSelectedUsernames(selectedUsernames.filter((u) => u !== username));
    }
  };
  const handleEnlistUsers = async () => {
    try {
      const response = await axios.post(
        "https://renderbbserver.onrender.com/enlist-users",
        {
          usernames: selectedUsernames,
        }
      );
      if (response.data.success) {
        alert("Successfully enlisted users!");
        setSelectedUsernames([]); // Clear selected usernames
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteEnlisted = async () => {
    try {
      const response = await axios.post(
        "https://renderbbserver.onrender.com/delete-enlist",
        {
          usernames: selectedUsernames,
        }
      );
      if (response.data.success) {
        alert("Successfully deleted enlisted users!");

        setSelectedUsernames([]);
      }
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
          "https://renderbbserver.onrender.com/usernames"
        );
        if (usernamesResponse.data.success) {
          setUsernames(usernamesResponse.data.usernames);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div className="welcome-page">
      <div className="welcome-section">
        <h2>Usernames</h2>
        <button onClick={handleEnlistUsers}>Enlist</button>
        <button onClick={handleDeleteEnlisted}>Delete Enlisted</button>
        <div className="usernames-list">
          {usernames.map((username) => (
            <div key={username} className="team-averages">
              <input
                type="checkbox"
                checked={selectedUsernames.includes(username)}
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
