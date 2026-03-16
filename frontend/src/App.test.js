import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders portfolio navigation", () => {
  render(<App />);
  expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /projects/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /contact/i })).toBeInTheDocument();
});

test("renders key sections", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /skills/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /experience & education/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /contact/i })).toBeInTheDocument();
});
