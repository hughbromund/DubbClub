const path = require("path");

var dashboardService = require(path.resolve(__dirname, "../services/DashboardService"));

exports.getDashboard = async function (req, res, next) {
    try {
        let result = await dashboardService.finalDashboard(req.userId);
        return res.status(200).json(result)
    } catch(e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
  }