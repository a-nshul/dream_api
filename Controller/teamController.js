const Team = require('../Model/TeamModel');
const asyncHandler = require('express-async-handler');
const matchResults = require('../data/match.json');
const addTeam = asyncHandler(async (req, res) => {
    try {
        const { teamName, captain, viceCaptain } = req.body;
        let players = req.body.players;
        if (!teamName || !players || !captain || !viceCaptain) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (players.length !== 9) {
            return res.status(400).json({ message: 'Team must have 9 players' });
        }
        const uniquePlayers = new Set(players);
        if (uniquePlayers.size !== players.length) {
            return res.status(400).json({ message: 'You cannot use the same player multiple times' });
        }
        players = [...uniquePlayers];
        if (players.length !== 9) {
            return res.status(400).json({ message: 'Team must have 9 unique players' });
        }
        const newTeam = await Team.create({
            teamName,
            players,
            captain,
            viceCaptain
        });
        return res.status(201).json({ message: "Team added successfully", newTeam });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error adding team", error });
    }
});
const processResult = asyncHandler(async (req, res) => {
    try {
        const teams = await Team.find();
        for (const team of teams) {
            let totalPoints = 0;
            for (const player of team.players) {
                const playerName = player.name;
                const playerStats = matchResults[playerName];
                if (playerStats) {
                    let playerPoints = 0;
                    // Calculate batting points
                    playerPoints += playerStats.runs * 1;
                    playerPoints += playerStats.fours * 1;
                    playerPoints += playerStats.sixes * 2;
                    if (playerStats.runs >= 30) {
                        playerPoints += 4;
                    }
                    if (playerStats.runs >= 50) {
                        playerPoints += 8;
                    }
                    if (playerStats.runs >= 100) {
                        playerPoints += 16;
                    }
                    if (playerStats.dismissal === 'duck' && (player.role === 'Batter' || player.role === 'WK' || player.role === 'AR')) {
                        playerPoints -= 2;
                    }
                    // Calculate bowling points
                    playerPoints += playerStats.wickets * 25;
                    playerPoints += playerStats.lbws * 8;
                    if (playerStats.wickets >= 3) {
                        playerPoints += 4;
                    }
                    if (playerStats.wickets >= 4) {
                        playerPoints += 8;
                    }
                    if (playerStats.wickets >= 5) {
                        playerPoints += 16;
                    }
                    playerPoints += playerStats.maidens * 12;
                    // Calculate fielding points
                    playerPoints += playerStats.catches * 8;
                    if (playerStats.catches >= 3) {
                        playerPoints += 4;
                    }
                    playerPoints += playerStats.stumpings * 12;
                    playerPoints += playerStats.runOuts * 6;

                    // Multiply points for captain and vice-captain
                    if (playerName === team.captain) {
                        playerPoints *= 2;
                    } else if (playerName === team.viceCaptain) {
                        playerPoints *= 1.5;
                    }
                    // Add player points to total points for the team
                    totalPoints += playerPoints;
                }
            }
            // Update team with total points
            team.points = totalPoints;
            await team.save();
        }
        return res.status(200).json({ message: "Match results processed successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error processing match results", error });
    }
});
const viewResults = async (req, res) => {
    try {
      const teams = await Team.find().sort({ points: -1 });
      if (teams.length === 0) {
        return res.status(404).json({ message: 'No teams found' });
      }
      const maxPoints = teams[0].points;
      const winningTeams = teams.filter(team => team.points === maxPoints);
      return res.status(200).json({ winningTeams });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error viewing team results", error });
    }
  };
module.exports = { addTeam,processResult,viewResults };
