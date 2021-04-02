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
