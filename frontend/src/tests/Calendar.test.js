import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarPage from "../pages/CalendarPage";
import { BrowserRouter } from "react-router-dom";

describe("CalendarPage Component", () => {
  const mockGroups = [
    {
      id: "1",
      name: "Test Event",
      type: "event",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: null,
      completed: false,
    },
    {
      id: "2",
      name: "Test Task",
      type: "task",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: null,
      completed: false,
    },
  ];

  let customGroups;
  let setCustomGroups;

  beforeEach(() => {
    customGroups = [...mockGroups];
    setCustomGroups = jest.fn((updateFn) => {
      customGroups = updateFn(customGroups);
    });

    render(
      <BrowserRouter>
        <CalendarPage customGroups={customGroups} setCustomGroups={setCustomGroups} />
      </BrowserRouter>
    );
  });

  it("renders calendar and sidebar correctly", () => {
    // Using role and heading level to disambiguate from sidebar label
    expect(screen.getByRole("heading", { name: "Calendar", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
  });

  it("displays current month and year", () => {
    const today = new Date();
    const expectedMonth = today.toLocaleString("default", { month: "long", year: "numeric" });
    expect(screen.getByRole("heading", { level: 2, name: expectedMonth })).toBeInTheDocument();
  });

  it("opens modal when a day is clicked", () => {
    const today = new Date().getDate();
    const todayCell = screen.getAllByText(today.toString()).find((cell) =>
      cell.closest(".calendar-cell")
    );
    fireEvent.click(todayCell);
    expect(screen.getByText(/add event\/task/i)).toBeInTheDocument();
  });

  it("toggles sidebar when collapse button is clicked", () => {
    const collapseBtn = screen.getByTestId("collapse-btn");
    fireEvent.click(collapseBtn);
    expect(collapseBtn.textContent).toBe("→");
  });

  it("renders customGroups in correct calendar cells", () => {
    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
});
