import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

import { GET_LIVE_GAME_PREDS } from "../../constants/Constants";

import classes from "./PredictionGraph.module.css";

var initData = [
  // {
  //   id: "Q1",
  //   data: [
  //     { x: 10, y: 20 },
  //     { x: 5, y: 15 },
  //   ],
  // },
];
var initLength = 2880;

const HOME_VALUE = "Home";
const AWAY_VALUE = "Away";

const theme = {
  textColor: "#ffffff",
  fontSize: 12,
};

export default class PredictionGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initData,
      length: initLength,
      periods: [],
      homeHex: this.props.homeHex,
      awayHex: this.props.awayHex,
      homeTeamName: this.props.homeTeam,
      awayTeamName: this.props.awayTeam,
      gameID: this.props.gameID,
      timeoutID: null,
    };

    this.getColor = this.getColor.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    // console.log(this.state.timeoutID);
    if (this.state.timeoutID !== null) {
      clearTimeout(this.state.timeoutID);
    }
  }
  async fetchData() {
    var res = await fetch(GET_LIVE_GAME_PREDS + "/" + this.state.gameID);

    var body = await res.json();

    var periodLengths = body.data.periodLengths;
    periodLengths[0] = 0;

    // console.log(periodLengths);

    var predictions = body.data.predictions;

    // console.log(predictions);
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

    tempData.push({
      id: HOME_VALUE,
      data: homeData,
    });

    tempData.push({
      id: AWAY_VALUE,
      data: awayData,
    });

    var tempLength = 0;
    var periods = [];
    Object.keys(periodLengths).forEach(function (key, index) {
      /**
       * Keys are sequential and we don't want the total length to be longer than the quarters that were played
       * If period 4 is the last period we have data for, we only want the total time to go to period 4.
       * Since predictions are in order of time, we can look at the last prediction and see which period it happened in
       */

      tempLength = tempLength + periodLengths[key];
      periods.push(tempLength);
    });

    // console.log(tempLength);
    // console.log(periods);

    var timeoutID = null;
    if (this.props.liveRefresh) {
      timeoutID = setTimeout(async () => {
        await this.fetchData();
      }, this.props.refreshRate);
    }

    this.setState({
      data: tempData,
      length: tempLength,
      periods: periods,
      timeoutID,
    });
  }

  async componentDidMount() {
    this.fetchData();
  }

  getColor(object) {
    // console.log(object);

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
          gridXValues={this.state.periods}
          theme={theme}
          axisBottom={{
            legend: "Game Time",
            legendOffset: 36,
            legendPosition: "middle",
            format: function (value) {
              var minutes = Math.floor(value / 60);
              var seconds = value - minutes * 60;
              return minutes + ":" + seconds;
            },
          }}
          axisLeft={{
            legend: "Win Percentage",
            legendOffset: -50,
            legendPosition: "middle",
            format: function (value) {
              return value + "%";
            },
          }}
          gridYValues={[0, 50, 100]}
          margin={{ top: 10, right: 10, bottom: 50, left: 70 }}
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
