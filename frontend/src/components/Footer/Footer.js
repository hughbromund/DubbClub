import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./Footer.module.css";

export default class Footer extends Component {
  render() {
    return (
      <div className={classes.Footer}>
        <div className={classes.inner}>
          <div>
            <b>
              Designed and Built with{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              by the Dubb Club Team
            </b>
          </div>
          <div>
            Nathan Ashta{" "}
            <a target="_blank" href="https://github.com/nathanashta">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            , Hugh Bromund{" "}
            <a target="_blank" href="https://github.com/hughbromund">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            , Daniel Joseph{" "}
            <a target="_blank" href="https://github.com/dadeej">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            , Aditya Naik{" "}
            <a target="_blank" href="https://github.com/adityan9900">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
            , and Peyton Williams{" "}
            <a target="_blank" href="https://github.com/peytondwilliams">
              <FontAwesomeIcon icon={["fab", "github"]} />
            </a>
          </div>
          <div>
            <b>Project Created for CS 407 - Hosted on Google Cloud</b>
          </div>
          <div>
            <b>Frontend Version:</b>{" "}
            {process.env.REACT_APP_VERSION
              ? process.env.REACT_APP_VERSION
              : "Local"}
          </div>
        </div>
      </div>
    );
  }
}
