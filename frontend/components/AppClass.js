import React from "react";
import axios from "axios";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Ouch: email must be a valid email")
    .required("Ouch: email is required"),
});

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      x: 2,
      y: 2,
    };
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return `(${this.state.x},${this.state.y})`;
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      x: 2,
      y: 2,
    });
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction === "left") {
      if (this.state.x < 2) {
        this.setState({
          message: "You can't go left",
        });
        return this.state.index;
      }
      this.setState({
        index: this.state.index - 1,
        steps: this.state.steps + 1,
        x: this.state.x - 1,
      });
    }

    if (direction === "right") {
      if (this.state.x > 2) {
        this.setState({
          message: "You can't go right",
        });
        return this.state.index;
      }
      this.setState({
        index: this.state.index + 1,
        steps: this.state.steps + 1,
        x: this.state.x + 1,
      });
    }

    if (direction === "up") {
      if (this.state.y < 2) {
        this.setState({
          message: "You can't go up",
        });
        return this.state.index;
      }
      this.setState({
        index: this.state.index - 3,
        steps: this.state.steps + 1,
        y: this.state.y - 1,
      });
    }

    if (direction === "down") {
      if (this.state.y > 2) {
        this.setState({
          message: "You can't go down",
        });
        return this.state.index;
      }
      this.setState({
        index: this.state.index + 3,
        steps: this.state.steps + 1,
        y: this.state.y + 1,
      });
    }
  };

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    this.getNextIndex(evt.target.id);
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    evt.preventDefault();
    this.setState({
      email: evt.target.value,
    });
  };

  winNumber() {
    if (this.state.x === 2 && this.state.y === 2) {
      return "#73";
    } else if (
      this.state.message === "You can't go down" &&
      this.state.x === 2 &&
      this.state.y === 3
    ) {
      return "#43";
    } else if (this.state.x === 2 && this.state.y === 1) {
      return "#31";
    } else if (this.state.x === 1 && this.state.y === 2) {
      return "#29";
    } else if (this.state.x === 3 && this.state.y === 1) {
      return "#49";
    }
  }

  setErrors = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() =>
        this.setState({
          emai: "",
        })
      )
      .catch((err) => this.setState({ message: err.errors[0] }));
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const result = {
      x: this.state.x,
      y: this.state.y,
      steps: this.state.steps,
      email: this.state.email,
    };
    axios
      .post("http://localhost:9000/api/result", result)
      .then((res) => {
        console.log(res);
        this.setErrors("email", this.state.email);

        const emailSplit = this.state.email.split("@");
        this.setState({
          message: `${emailSplit[0]} win ${this.winNumber()} `,
        });
        this.setState({
          email: "",
        });
      })
      .catch((err) => {
        this.setState({ message: err.response.data.message });
      });
  };

  render() {
    const { className } = this.props;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getXY()}</h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">
            LEFT
          </button>
          <button onClick={this.move} id="up">
            UP
          </button>
          <button onClick={this.move} id="right">
            RIGHT
          </button>
          <button onClick={this.move} id="down">
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            value={this.state.email}
            id="email"
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
