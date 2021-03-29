import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

import { GET_LIVE_GAME_PREDS } from "../../constants/Constants";

import classes from "./PredictionGraph.module.css";

var initData = [
  {
    id: "Q1",
    data: [
      { x: 10, y: 20 },
      { x: 5, y: 15 },
    ],
  },
];
var initLength = 10000;

const HOME_VALUE = "Home";
const AWAY_VALUE = "Away";

export default class PredictionGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initData,
      length: initLength,
      homeHex: this.props.homeHex,
      awayHex: this.props.awayHex,
      homeTeamName: this.props.homeTeam,
      awayTeamName: this.props.awayTeam,
      gameID: this.props.gameID,
    };

    this.getColor = this.getColor.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    var res = await fetch(GET_LIVE_GAME_PREDS + "/" + this.state.gameID);

    var body = await res.json();

    var periodLengths = body.data.periodLengths;
    periodLengths[0] = 0;

    var predictions = body.data.predictions;

    var tempData = [];
    var homeData = [];
    var awayData = [];

    predictions.forEach((prediction) => {
      var runningTime = 0;

      for (var i = 0; i < prediction.period; i++) {
        runningTime = periodLengths[i] + runningTime;
      }

      homeData.push({
        x: prediction.timeElapsed + runningTime,
        y: prediction.homeConfidence * 100,
        period: prediction.period,
      });
      awayData.push({
        x: prediction.timeElapsed + runningTime,
        y: prediction.awayConfidence * 100,
        period: prediction.period,
      });
    });
    console.log(homeData);

    tempData.push({
      id: HOME_VALUE,
      data: homeData,
    });

    tempData.push({
      id: AWAY_VALUE,
      data: awayData,
    });

    var tempLength = 0;
    Object.keys(periodLengths).forEach(function (key, index) {
      tempLength = tempLength + periodLengths[key];
    });

    console.log(tempLength);

    this.setState({ data: tempData, length: tempLength });
  }

  async componentDidMount() {
    this.fetchData();
  }

  getColor(object) {
    console.log(object);

    if (object.id === HOME_VALUE) {
      return this.state.homeHex;
    }
    if (object.id === AWAY_VALUE) {
      return this.state.awayHex;
    }
    return "#ffffff";
  }

  render() {
    return (
      <div className={classes.PredictionGraph}>
        <ResponsiveLine
          data={this.state.data}
          colors={this.getColor}
          xScale={{ type: "linear", min: 0, max: this.state.length }}
          yScale={{ type: "linear", min: 0, max: 100 }}
          yFormat=" >-.2f"
          lineWidth={5}
          pointSize={12}
          pointLabelYOffset={-12}
          useMesh={true}
          gridXValues={4}
          gridYValues={4}
          margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
          tooltip={(point) => {
            var team = this.state.homeTeamName;
            if (point.point.serieId === AWAY_VALUE) {
              team = this.state.awayTeamName;
            }

            return (
              <div
                key={point.point.id}
                className={classes.tooltip}
                style={{ boxShadow: "-10px 0px " + point.point.serieColor }}
              >
                <strong>{team}</strong>
                <br />
                {point.point.data.yFormatted}% Win Confidence
                <br />
                Quarter {point.point.data.period}
              </div>
            );
          }}
        />
      </div>
    );
  }
}
