const path = require("path");

var searchService = require(path.resolve(__dirname, "../services/SearchService"));

exports.autoCompleteStub = async function (req, res, next) {
    try {
        let result = await searchService.autocompleteStub();
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}