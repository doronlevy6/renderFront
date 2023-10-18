//src\components\WelcomePage.js:

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import io from "socket.io-client";

function WelcomePage({ showOnlyTeams }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [enlistedPlayers, setEnlistedPlayers] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL

  const fetchData = async () => {
    try {
      const enlistResponse = await axios.get(`${apiUrl}/enlist`);
      if (enlistResponse.data.success) {
        setEnlistedPlayers(enlistResponse.data.usernames);
      }

      const teamsResponse = await axios.get(`${apiUrl}/get-teams`);

      if (teamsResponse.data.success) {
        setTeams(teamsResponse.data.teams);
      }
    } catch (error) {
      console.error("x", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchData();

    }
  }, [isAuthenticated, navigate, user]);

  const enlistForGame = async () => {
    try {
      const usernames = [user.username];
      const response = await axios.post(`${apiUrl}/enlist-users`, {
        usernames: usernames,
      });
      if (response.data.success) {
        alert("You have been enlisted for the next game!");
        fetchData(); // Refresh enlisted players after enlisting
      }
    } catch (error) {
      console.error(error);
      alert("Failed to enlist for the next game.");
    }
  };
  useEffect(() => {
    const socket = io(`${apiUrl}`);

    socket.on("teamsUpdated", () => {
      fetchData();
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <div className="welcome-page">
      {!showOnlyTeams && (
        <>
          <button onClick={enlistForGame}>Enlist for Next Game</button>

          <div className="welcome-section">
            <h2>Enlisted Players</h2>
            <div className="usernames-list">
              {enlistedPlayers.map((username, index) => (
                <div key={index} className="team-averages">
                  {username}
                </div>
              ))}
            </div>
            <div className="team-averages">
              Players: {enlistedPlayers.length}
            </div>
          </div>
        </>
      )}
      <div className="welcome-section">
        <h2>Teams and Averages</h2>
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map((team, index) => {
            const averages = {
              skill_level: 0,
              scoring_ability: 0,
              defensive_skills: 0,
              speed_and_agility: 0,
              shooting_range: 0,
              rebound_skills: 0,
            };
            team.forEach((player) => {
              for (const attr in averages) {
                averages[attr] += Number(player[attr]);
              }
            });
            for (const attr in averages) {
              averages[attr] /= team.length;
            }
            const totalAverages = Object.values(averages).reduce((sum, average) => sum + average, 0); // Sum of all averages


            return (
              <div key={index} className="team-averages">
                <div>
                  <h3>Team {index + 1}</h3>
                  {Array.isArray(team) ? (
                    team.map((player, i) => <p key={i}>{player.username}</p>)
                  ) : (
                    <p>No players in this team.</p>
                  )}
                </div>
                <div>
                  <h3>Averages:</h3>
                  <p>Playmaker: {averages.skill_level.toFixed(2)}</p>
                  <p>Scoring Ability: {averages.scoring_ability.toFixed(2)}</p>
                  <p>Defensive Skills: {averages.defensive_skills.toFixed(2)}</p>
                  <p>Speed and Agility: {averages.speed_and_agility.toFixed(2)}</p>
                  <p>3 pt Shooting: {averages.shooting_range.toFixed(2)}</p>
                  <p>Rebound Skills: {averages.rebound_skills.toFixed(2)}</p>
                  <p>Total Averages Sum: {totalAverages.toFixed(2)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No teams created.</p>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
