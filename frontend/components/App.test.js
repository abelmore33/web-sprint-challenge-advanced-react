// Write your tests here
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AppFunctional from "./AppFunctional";

it(`renders without crashing`, () => {
  render(<AppFunctional />);
});

it(`renders  coordinates and moved text `, () => {
  render(<AppFunctional />);
  const coordinatesText = screen.queryByText(/coordinates/i);
  const movedText = screen.queryByText(/moved/i);

  expect(coordinatesText).toBeInTheDocument();
  expect(movedText).toBeInTheDocument();
});

it(`renders  coordinates and moved text `, () => {
  render(<AppFunctional />);
  const coordinatesText = screen.queryByText(/coordinates/i);
  const movedText = screen.queryByText(/moved/i);

  expect(coordinatesText).toBeInTheDocument();
  expect(movedText).toBeInTheDocument();
});
