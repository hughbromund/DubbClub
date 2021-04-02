// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect

describe("Team List", () => {
    describe("GET /api/nba/getTeamsFromDb", () => {
        // Test to get all students record
        it("get teams from Db", (done) => {
             chai.request(app)
                 .get('/api/nba/getTeamsFromDb')
                 .end((err, res) => {
                     res.should.have.status(200);
                     teamList = res.body
                     for (var i = 0; i < teamList.length; i++) {
                         var team = teamList[i]
                         expect(team).to.have.property('teamId')
                         expect(team).to.have.property('teamName')
                         expect(team).to.have.property('elo')
                         expect(team).to.have.property('lastGameID')
                         expect(team).to.have.property('conference')
                         expect(team).to.have.property('standing')
                         expect(team).to.have.property('gamesBehind')
                         expect(team).to.have.property('lastTenLosses')
                         expect(team).to.have.property('lastTenWins')
                         expect(team).to.have.property('losses')
                         expect(team).to.have.property('winStreak')
                         expect(team).to.have.property('wins')
                         expect(team).to.have.property('teamImage')

                         expect(team.teamId).to.be.a('number');
                         expect(team.teamName).to.be.a('string');
                         expect(team.elo).to.be.a('number');
                         expect(team.lastGameID).to.be.a('number');
                         expect(team.conference).to.be.a('string');
                         expect(team.standing).to.be.a('number');
                         expect(team.gamesBehind).to.be.a('number');
                         expect(team.lastTenLosses).to.be.a('number');
                         expect(team.lastTenWins).to.be.a('number');
                         expect(team.losses).to.be.a('number');
                         expect(team.winStreak).to.be.a('number');
                         expect(team.wins).to.be.a('number');
                         expect(team.teamImage).to.be.a('string');
                     }
                     done();
                  });
         });
    });
});


describe("High Vote Count Games", () => {
    describe("GET /api/nba/getHighVoteGames", () => {
        // Test to get all students record
        it("get high vote count games from the Db", (done) => {
             chai.request(app)
                 .get('/api/nba/getHighVoteGames')
                 .end((err, res) => {
                     res.should.have.status(200);
                     gameList = res.body

                     var count = 0
                     for (var i = 0; i < gameList.length; i++) {
                         var game = gameList[i]

                         expect(game).to.have.property(game.voteCount);
                         expect(game).to.have.property(game.votedTeam);
                         expect(game).to.have.property(game.id);
                         expect(game).to.have.property(game.arena);
                         expect(game).to.have.property(game.home);
                         expect(game).to.have.property(game.away);
                         expect(game).to.have.property(game.predictedWinner);
                         expect(game).to.have.property(game.confidence);
                         expect(game).to.have.property(game.homeVoters);
                         expect(game).to.have.property(game.awayVoters);
                         expect(game).to.have.property(game.status);
                         expect(game).to.have.property(game.livePredictions);
                         expect(game).to.have.property(game.playedGameStats);
                         expect(game).to.have.property(game.homeScore);
                         expect(game).to.have.property(game.awayScore);
                         expect(game).to.have.property(game.period);
                         expect(game).to.have.property(game.clock);

                         expect(game.voteCount).to.be.a('number');
                         expect(game.votedTeam).to.be.a('string');
                         expect(game.id).to.be.a('number');
                         expect(game.arena).to.be.a('string');
                         expect(game.home).to.be.an('Array');
                         expect(game.away).to.be.an('Array');
                         expect(game.predictedWinner).to.be.a('number');
                         expect(game.confidence).to.be.a('number');
                         expect(game.homeVoters).to.be.an('Array');
                         expect(game.awayVoters).to.be.an('Array');
                         expect(game.status).to.be.a('string');
                         expect(game.livePredictions).to.be.an('Array');
                         expect(game.awayVoters).to.be.an('Object');
                         expect(game.homeScore).to.be.a('number');
                         expect(game.awayScore).to.be.a('number');
                         expect(game.period).to.be.a('number');
                         expect(game.clock).to.be.a('string');
                         
                         expect(game.voteCount).to.be.gte(count);

                         count = game.voteCount;
                     }
                     done();
                  });
         });
    });
});


describe("High Prediction Difference Games", () => {
    describe("GET /api/nba/getHighPredictDiffGames", () => {
        // Test to get all students record
        it("get high prediction difference games from the Db", (done) => {
             chai.request(app)
                 .get('/api/nba/getHighPredictDiffGames')
                 .end((err, res) => {
                     res.should.have.status(200);
                     gameList = res.body

                     var diff = 1
                     for (var i = 0; i < gameList.length; i++) {
                         var game = gameList[i]

      
                         expect(game).to.have.property(game.votedTeam);
                         expect(game).to.have.property(game.predictedWinnerVote);
                         expect(game).to.have.property(game.confidenceVote);
                         expect(game).to.have.property(game.confidenceDifference);
                         expect(game).to.have.property(game.id);
                         expect(game).to.have.property(game.arena);
                         expect(game).to.have.property(game.home);
                         expect(game).to.have.property(game.away);
                         expect(game).to.have.property(game.predictedWinner);
                         expect(game).to.have.property(game.confidence);
                         expect(game).to.have.property(game.homeVoters);
                         expect(game).to.have.property(game.awayVoters);
                         expect(game).to.have.property(game.status);
                         expect(game).to.have.property(game.livePredictions);
                         expect(game).to.have.property(game.playedGameStats);
                         expect(game).to.have.property(game.homeScore);
                         expect(game).to.have.property(game.awayScore);
                         expect(game).to.have.property(game.period);
                         expect(game).to.have.property(game.clock);

                         expect(game.votedTeam).to.be.a('string');
                         expect(game.predictedWinnerVote).to.be.a('string');
                         expect(game.confidenceVote).to.be.a('number');
                         expect(game.confidenceDifference).to.be.a('number');
                         expect(game.id).to.be.a('number');
                         expect(game.arena).to.be.a('string');
                         expect(game.home).to.be.an('Array');
                         expect(game.away).to.be.an('Array');
                         expect(game.predictedWinner).to.be.a('number');
                         expect(game.confidence).to.be.a('number');
                         expect(game.homeVoters).to.be.an('Array');
                         expect(game.awayVoters).to.be.an('Array');
                         expect(game.status).to.be.a('string');
                         expect(game.livePredictions).to.be.an('Array');
                         expect(game.awayVoters).to.be.an('Object');
                         expect(game.homeScore).to.be.a('number');
                         expect(game.awayScore).to.be.a('number');
                         expect(game.period).to.be.a('number');
                         expect(game.clock).to.be.a('string');
                         
                         expect(game.confidenceDifference).to.be.lte(diff);

                         diff = game.confidenceDifference;
                     }
                     done();
                  });
         });
    });
});


