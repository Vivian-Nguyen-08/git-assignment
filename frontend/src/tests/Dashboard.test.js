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

// Sample data
const mockGroups = [
  {
    id: "1",
    name: "Mock Event",
    fromDate: "2025-04-10",
    toDate: "2025-04-11",
    type: "event",
    img: "",
  },
  {
    id: "2",
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

    // ✅ Event is shown
    expect(screen.getByText("Mock Event")).toBeInTheDocument();

    // ❌ Task should not be rendered
    expect(screen.queryByText("Mock Task")).not.toBeInTheDocument();
  });
});
