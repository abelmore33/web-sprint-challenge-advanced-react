// Write your tests here
import React from "react";
import * as rtl from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import AppFunctional from "./AppFunctional";

it(`renders without crashing`, () => {
  const wrapper = rtl.render(<AppFunctional />);
});

it(`renders  coordinates and moved text `, () => {
  const wrapper = rtl.render(<AppFunctional />);
  const coordinatesText = wrapper.queryByText(/coordinates/i);
  const movedText = wrapper.queryByText(/moved/i);

  expect(coordinatesText).toBeInTheDocument();
  expect(movedText).toBeInTheDocument();
});

it(`renders  coordinates and moved text `, () => {
  const wrapper = rtl.render(<AppFunctional />);
  const coordinatesText = wrapper.queryByText(/coordinates/i);
  const movedText = wrapper.queryByText(/moved/i);

  expect(coordinatesText).toBeInTheDocument();
  expect(movedText).toBeInTheDocument();
});

it("check if moves are counted", () => {
  rtl.render(<AppFunctional />);
  const count = screen.getByText(/0/i);
  const leftButtton = screen.getByText(/left/i);
  userEvent.click(leftButtton);
});
