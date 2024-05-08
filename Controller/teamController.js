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
        if(teamName.length!==2){
            return res.status(400).json({ message: 'Team name must be of 2 name' });
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
                const playerPoints = calculatePlayerPoints(player, matchResults);
                totalPoints += playerPoints;
            }
            const captain = team.players.find(player => player.name === team.captain);
            const viceCaptain = team.players.find(player => player.name === team.viceCaptain);
            if (captain) {
                totalPoints += captain.points * 2;
            }
            if (viceCaptain) {
                totalPoints += viceCaptain.points * 1.5;
            }
            await Team.findByIdAndUpdate(team._id, { points: totalPoints });
        }
        return res.status(200).json({ message: "Match results processed successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error processing match results", error });
    }
});
function calculatePlayerPoints(player, matchResults) {
    let points = 0;
    matchResults.forEach(result => {
        if (result.player === player.name) {
            if (result.type === 'run') {
                points += 1;
            } else if (result.type === 'boundary') {
                points += 1;
            } else if (result.type === 'six') {
                points += 2;
            }
        }
    });
    if (isNaN(points) || !isFinite(points)) {
        points = 0; 
    }
    return points;
}

const viewResults = async (req, res) => {
    try {
        const teams = await Team.find();

        teams.forEach(team => {
            team.totalPoints = team.players.reduce((total, player) => total + player.points, 0);
        });
        teams.sort((a, b) => b.totalPoints - a.totalPoints);
        const maxPoints = teams.length > 0 ? teams[0].totalPoints : 0;
        const winningTeams = teams.filter(team => team.totalPoints === maxPoints);
        return res.status(200).json({ message: "Team results retrieved successfully", winningTeams });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error viewing team results", error });
    }
  };
module.exports = { addTeam,processResult,viewResults };
