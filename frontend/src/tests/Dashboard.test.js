import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";

// Mock FavoritesContext
jest.mock("../context/FavoritesContext", () => ({
  useFavorites: () => ({
    toggleFavorite: jest.fn(),
    isFavorited: () => false,
  }),
}));

// Suppress duplicate key warning in test output (optional)
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (
      msg &&
      typeof msg === "string" &&
      msg.includes("Encountered two children with the same key")
    ) {
      return;
    }
    console.error(msg);
  });
});

afterEach(() => {
  console.error.mockRestore();
});

// Sample data with guaranteed unique IDs
const mockGroups = [
  {
    id: "mock-event-999",
    name: "Mock Event",
    fromDate: "2025-04-10",
    toDate: "2025-04-11",
    type: "event",
    img: "",
  },
  {
    id: "mock-task-888",
    name: "Mock Task",
    fromDate: null,
    toDate: null,
    type: "task",
    img: "",
  },
];

describe("Dashboard Component", () => {
  it("renders only event-type cards under 'My Events'", () => {
    render(
      <BrowserRouter>
        <Dashboard customGroups={mockGroups} setCustomGroups={jest.fn()} />
      </BrowserRouter>
    );

    // ✅ Should find the event
    expect(screen.getByText("Mock Event")).toBeInTheDocument();

    // ❌ Should NOT find the task
    expect(screen.queryByText("Mock Task")).not.toBeInTheDocument();
  });
});
