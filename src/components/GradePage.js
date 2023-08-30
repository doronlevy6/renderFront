//src\components\GradePage.js:

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Table, Row, Col, Form } from "react-bootstrap";
import "./GradePage.css";

function GradePage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [grading, setGrading] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetchRankings = async () => {
        try {
          // Fetch all usernames
          const usernamesResponse = await axios.get(
            "https://renderbbserver.onrender.com/usernames"
          );
          // Fetch all rankings given by the logged-in user
          const rankingsResponse = await axios.get(
            `https://renderbbserver.onrender.com/rankings/${user.username}`
          );

          if (usernamesResponse.data.success && rankingsResponse.data.success) {
            // Convert the rankings into an object for easy access
            const rankingsByUser = {};
            rankingsResponse.data.rankings.forEach((ranking) => {
              rankingsByUser[ranking.rated_username] = ranking;
            });

            // Prepare the initial grading data, considering all the usernames
            const initialGrading = usernamesResponse.data.usernames.map(
              (username) => {
                const ranking = rankingsByUser[username];
                if (ranking) {
                  return {
                    username: ranking.rated_username,
                    skillLevel: ranking.skill_level,
                    scoringAbility: ranking.scoring_ability,
                    defensiveSkills: ranking.defensive_skills,
                    speedAndAgility: ranking.speed_and_agility,
                    shootingRange: ranking.shooting_range,
                    reboundSkills: ranking.rebound_skills,
                  };
                } else {
                  return {
                    username: username,
                    skillLevel: "3",
                    scoringAbility: "3",
                    defensiveSkills: "3",
                    speedAndAgility: "3",
                    shootingRange: "3",
                    reboundSkills: "3",
                  };
                }
              }
            );

            setGrading(initialGrading);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchRankings();
    }
  }, [isAuthenticated, navigate, user]);

  const submitGrading = async () => {
    try {
      const response = await axios.post(
        "https://renderbbserver.onrender.com/rankings",
        {
          rater_username: user.username,
          rankings: grading,
        }
      );
      if (response.data.success) {
        alert("Successfully submitted grading!");
      } else {
        alert("Failed to submit grading.");
      }
    } catch (error) {
      alert("Failed to submit grading.");
    }
  };

  const handleInputChange = (playerUsername, category) => (event) => {
    setGrading((prevGrading) =>
      prevGrading.map((gradingPlayer) =>
        gradingPlayer.username === playerUsername
          ? {
              ...gradingPlayer,
              [category]: Number(event.target.value),
            }
          : gradingPlayer
      )
    );
  };

  return (
    <Container className="grade-page mt-3">
      <Row className="justify-content-md-center">
        <Col xs lg="12">
          <div className="grade-form">
            <h2>{user.username}: your grades are shown here 🏀</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Skill Level</th>
                  <th>Scoring Ability</th>
                  <th>Defensive Skills</th>
                  <th>Speed and Agility</th>
                  <th>Shooting Range</th>
                  <th>Rebound Skills</th>
                </tr>
              </thead>
              <tbody>
                {grading.map((player, index) => (
                  <tr key={index}>
                    <td>{player.username}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.skillLevel}
                        onChange={handleInputChange(
                          player.username,
                          "skillLevel"
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.scoringAbility}
                        onChange={handleInputChange(
                          player.username,
                          "scoringAbility"
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.defensiveSkills}
                        onChange={handleInputChange(
                          player.username,
                          "defensiveSkills"
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.speedAndAgility}
                        onChange={handleInputChange(
                          player.username,
                          "speedAndAgility"
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.shootingRange}
                        onChange={handleInputChange(
                          player.username,
                          "shootingRange"
                        )}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.reboundSkills}
                        onChange={handleInputChange(
                          player.username,
                          "reboundSkills"
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              className="grade-button"
              variant="primary"
              onClick={submitGrading}
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default GradePage;

// need to see that we get the grade that the login user gave
