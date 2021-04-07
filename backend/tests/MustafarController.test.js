const path = require("path");
var mustafarController = require(path.resolve(__dirname, '../controllers/MustafarController'));
var mustafarService = require('../services/MustafarService');
var nbaService = require('../services/NbaService');
jest.mock('../services/NbaService')
jest.mock('../services/MustafarService')


// this mocks the res object
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
};

// these mock the req object
const mockRequestBasic = () => {
    return {
        params: {}
    };
};

describe("updateDbWithPredictions", () => {
    test("expected path", async () => {
        const req = mockRequestBasic()
        const res = mockResponse()

        const resp = [
            { "gameId": "8608",
        "date": "2021-03-02T03:30:00.000Z", "arena": "TD Garden",
        "home": {
        "teamId": "2",
        "teamName": "Boston Celtics",
        "teamImage": "https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png",
        "wins": "13",
        "losses": "13",
        "conferenceName": "east",
        "place": "4"
        }}
        ]

        const predict = [{"pred_winner": 1, "confidence": 0.5}]
        
        nbaService.getBasicGameInfo.mockResolvedValue(resp);
        mustafarService.getMustafarPredictions.mockResolvedValue(predict);
        await mustafarController.updateDbWithPredictions(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({"message": "Successfully Updated Games."})
    })
/*
    test("code is undefined", async () => {
        const req = mockRequestBasic(null)
        const res = mockResponse()

        const resp = {data: 'yeet'};
        stockService.getStockIntraday.mockResolvedValue(resp);
        await stockController.getStockIntraday(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'code is undefined'})
    })

    test("stock is not found", async () => {
        const req = mockRequestBasic('cscd')
        const res = mockResponse()

        stockService.getStockIntraday.mockImplementation(() => {
            throw new Error();
          });
        await stockController.getStockIntraday(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ status: 400, message: 'cscd could not be found'})
    })
    */
})
