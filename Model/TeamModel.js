const mongoose = require('mongoose');
const validPlayers = [
    "Ruturaj Gaikwad",
  "MS Dhoni",
  "Moeen Ali",
  "Deepak Chahar",
  "Tushar Deshpande",
  "Shivam Dube",
  "Rajvardhan Hangargekar",
  "Ravindra Jadeja",
  "Ajay Mandal",
  "Mukesh Choudhary",
  "Ajinkya Rahane",
  "Shaik Rasheed",
  "Mitchell Santner",
  "Simarjeet Singh",
  "Nishant Sindhu",
  "Prashant Solanki",
  "Maheesh Theekshana",
  "Rachin Ravindra",
  "Shardul Thakur",
  "Daryl Mitchell",
  "Sameer Rizvi",
  "Mustafizur Rahman",
  "Avanish Rao Aravelly",
  "Sanju Samson",
  "Jos Buttler",
  "Shimron Hetmyer",
  "Yashasvi Jaiswal",
  "Dhruv Jurel",
  "Riyan Parag",
  "Donovan Ferreira",
  "Kunal Rathore",
  "Ravichandran Ashwin",
  "Kuldeep Sen",
  "Navdeep Saini",
  "Sandeep Sharma",
  "Trent Boult",
  "Yuzvendra Chahal",
  "Avesh Khan",
  "Rovman Powell",
  "Shubham Dubey",
  "Tom Kohler-Cadmore",
  "Abid Mushtaq",
  "Nandre Burger",
  "Tanush Kotian",
  "Keshav Maharaj"
];

const TeamSchema = new mongoose.Schema({
    teamName: [{
       name:{ type: String,
        required: true,}
    }],
    players: [{
        name: {
            type: String,
            required: true,
            enum: validPlayers
        },
        role: {
            type: String,
            enum: ["batter", "bowler","WK","AR"]
        }
    }],
    captain: {
        type: String,
        required: true,
        enum:validPlayers

    },
    viceCaptain: {
        type: String,
        required: true,
        // enum:validPlayers
    },
    points: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
