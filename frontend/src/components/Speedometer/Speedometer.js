import React, { Component } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import classes from "./Speedometer.module.css";
import { NBA, EPL } from "../../constants/Constants";

const rgbHex = require("rgb-hex");
const hexRgb = require("hex-rgb");

/**
 * This maps the value of a number from one range to a new one.
 *
 * Used to map confidence values from range 50-100 to range 0-100 for graphing
 * */
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export default class Speedometer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      league: this.props.league ?? NBA,
      forceRender: false,
      predictionConfidence: props.predictionConfidence,
    };

    this.hexAlphaConverter = this.hexAlphaConverter.bind(this);
    this.hexMedianValue = this.hexMedianValue.bind(this);
  }
  hexAlphaConverter(hexValue, alphaValue) {
    var rgbValue = hexRgb(hexValue);
    rgbValue.alpha = alphaValue;

    return (
      "#" + rgbHex(rgbValue.red, rgbValue.green, rgbValue.blue, rgbValue.alpha)
    );
  }

  hexMedianValue(hex1, hex2) {
    var rgb1 = hexRgb(hex1);
    var rgb2 = hexRgb(hex2);

    return (
      "#" +
      rgbHex(
        (rgb1.red + rgb2.red) / 2,
        (rgb1.green + rgb2.green) / 2,
        (rgb1.blue + rgb2.blue) / 2
      )
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      if (
        this.props.homeHex !== prevProps.homeHex ||
        this.props.awayHex !== prevProps.awayHex ||
        this.props.predictionConfidence !== prevProps.predictionConfidence
      ) {
        this.setState({
          predictionConfidence: this.props.predictionConfidence,
          forceRender: true,
        });
      } else {
        this.setState({ forceRender: false });
      }
    }

    // console.log(this.props);
  }

  render() {
    return (
      <div className={classes.speedometer}>
        <ReactSpeedometer
          forceRender={this.state.forceRender}
          value={
            this.props.league === EPL
              ? this.state.predictionConfidence
              : this.props.predictedWinner === "away"
              ? this.state.predictionConfidence.map(50, 100, 0, 100) * -1
              : this.state.predictionConfidence.map(50, 100, 0, 100)
          }
          minValue={this.props.league === EPL ? 0 : -100}
          maxValue={100}
          segments={7}
          needleColor={"white"}
          ringWidth={20}
          needleTransitionDuration={0}
          currentValueText={
            Math.abs(this.props.predictionConfidence) + "% Confidence"
          }
          fluidWidth={this.props.fluidWidth}
          width={this.props.width}
          height={this.props.height}
          segmentColors={[
            this.hexAlphaConverter(this.props.awayHex, 1),
            this.hexAlphaConverter(this.props.awayHex, 0.6),
            this.hexAlphaConverter(this.props.awayHex, 0.4),
            this.hexAlphaConverter(
              this.hexMedianValue(this.props.homeHex, this.props.awayHex),
              0.2
            ),
            this.hexAlphaConverter(this.props.homeHex, 0.4),
            this.hexAlphaConverter(this.props.homeHex, 0.6),
            this.hexAlphaConverter(this.props.homeHex, 1),
          ]}
          customSegmentLabels={
            this.props.league !== EPL
              ? [
                  {
                    text: "100%",
                    position: "OUTSIDE",
                  },
                  {
                    text: "",
                    position: "OUTSIDE",
                  },
                  {
                    text: "",
                    position: "OUTSIDE",
                  },
                  {
                    text: "50%",
                    position: "OUTSIDE",
                  },
                  {
                    text: "",
                    position: "OUTSIDE",
                  },
                  {
                    text: "",
                    position: "OUTSIDE",
                  },
                  {
                    text: "100%",
                    position: "OUTSIDE",
                  },
                ]
              : undefined
          }
        />
      </div>
    );
  }
}
