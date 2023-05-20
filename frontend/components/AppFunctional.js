import React, { useState } from "react";
import axios from "axios";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().required("Ouch: email is required"),
});

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(4);
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

    return `(${x},${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
    setX(2);
    setY(2);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === "left") {
      if (x <= 1) {
        setMessage("You can't go left");
        return index;
      }
      setX(x - 1);
      setIndex(index - 1);
      setSteps(steps + 1);
      setMessage("");
    }

    if (direction === "right") {
      if (x >= 3) {
        setMessage("You can't go right");
        return index;
      }
      setIndex(index + 1);
      setSteps(steps + 1);
      setX(x + 1);
      setMessage("");
    }

    if (direction === "up") {
      if (y <= 1) {
        setMessage("You can't go up");
        return index;
      }
      setIndex(index - 3);
      setSteps(steps + 1);
      setY(y - 1);
      setMessage("");
    }

    if (direction === "down") {
      if (y >= 3) {
        setMessage("You can't go down");
        return index;
      }
      setIndex(index + 3);
      setSteps(steps + 1);
      setY(y + 1);
      setMessage("");
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    getNextIndex(evt.target.id);
  }

  function onChange(evt) {
    evt.preventDefault();
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const result = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    };
    axios
      .post("http://localhost:9000/api/result", result)
      .then((res) => {
        console.log(res);
        const emailSplit = email.split("@");
        setMessage(
          emailSplit[0] + " " + `win # ${Math.floor(Math.random() * 301)}`
        );
        setEmail("");
      })
      .catch((err) => {
        debugger;
        console.log(err);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXY()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">
          {message}
          {schema.email}
        </h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="type email"
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
