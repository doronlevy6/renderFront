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
  const apiUrl = process.env.REACT_APP_API_URL


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      const fetchRankings = async () => {
        try {
          // Fetch all usernames
          const usernamesResponse = await axios.get(
            `${apiUrl}/usernames`
          );
          // Fetch all rankings given by the logged-in user
          const rankingsResponse = await axios.get(
            `${apiUrl}/rankings/${user.username}`
          );

          if (usernamesResponse.data.success && rankingsResponse.data.success) {
            // Convert the rankings into an object for easy access
            const rankingsByUser = {};
            rankingsResponse.data.rankings.forEach((ranking) => {
              rankingsByUser[ranking.rated_username] = ranking;
            });

            // Prepare the initial grading data, considering all the usernames
            const initialGrading = usernamesResponse.data.usernames
              .filter(username => {
                // Only "doron" can see players starting with "joker"
                if (username.startsWith("joker") && user.username !== "doron") return false;

                // If the current user is "doron" or "moshe", they can rank themselves
                if ((username === "doron" || username === "Moshe") && user.username === username) return true;

                // Other users cannot rank themselves
                if (username === user.username) return false;

                return true;
              })
              .map((username) => {
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
                    skillLevel: "",
                    scoringAbility: "",
                    defensiveSkills: "",
                    speedAndAgility: "",
                    shootingRange: "",
                    reboundSkills: "",
                  };
                }
              });



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


      const response = await axios.post(`${apiUrl}/rankings`, {
        rater_username: user.username,
        rankings: grading,
      });
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
            <h2> {user.username}  🏀 your grades are shown here 🏀</h2>
            <p>Enter a number between 1 and 10 or use the arrow keys.

              Only players with a valid grade will be submitted</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Playmaker </th>
                  <th>Scoring Ability</th>
                  <th>Defensive Skills</th>
                  <th>Speed and Agility</th>
                  <th>3 pt Shooting </th>
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
                        value={player.skillLevel || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "skillLevel")}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.scoringAbility || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "scoringAbility")}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.defensiveSkills || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "defensiveSkills")}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.speedAndAgility || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "speedAndAgility")}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.shootingRange || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "shootingRange")}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={player.reboundSkills || ""}
                        placeholder="🙄"
                        onChange={handleInputChange(player.username, "reboundSkills")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-4">
        <Col xs lg="12">
          <Button
            className="grade-button"
            variant="primary"
            onClick={submitGrading}
          >
            Submit
          </Button>
          <div className="mt-3">
            <p><strong>רכז (playmaker):</strong> ניהול משחק-שחקן שטוב ביצירת הזדמנויות קליעה לעצמו או לחבריו לקבוצה, לרוב באמצעות כדרור או מסירה.</p>
            <p><strong>יכולת קליעה (scoring ability):</strong> היכולת לקלוע סל באופן כללי מכל עמדות על המגרש, באמצעות מגוון של תנועות התקפיות.</p>
            <p><strong>מיומנויות הגנה (defensive skills):</strong> היכולת למנוע מהיריב לקלוע, באמצעות טכניקות כגון חסימת זריקות, חטיפה של הכדור, ועמידה טובה במקום.</p>
            <p><strong>מהירות וזריזות (speed and agility):</strong> היכולת לנוע מהר ולשנות כיוון בקלות, דבר המסייע גם במצבים ההתקפיים וגם במצבים ההגנתיים.</p>
            <p><strong>קליעה לשלוש (3 pt shooting):</strong> היכולת לקלוע מעבר לקשת השלוש.</p>
            <p><strong>ריבאונד (rebound skills):</strong> היכולת לקחת ריבאונד בהתקפה ובהגנה.</p>
          </div>


        </Col>
      </Row>
    </Container>
  );
}

export default GradePage;

// need to see that we get the grade that the login user gave
