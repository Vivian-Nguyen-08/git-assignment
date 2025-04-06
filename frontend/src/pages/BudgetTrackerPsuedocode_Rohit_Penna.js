//Psuedocode fo Budget Tracker
//Some of it has been coded in the BudgetTracker.js file (expect database operations)
// This incliudes most of the methods I aim to implement

// === Imports ===
// Import necessary hooks from React
// Import routing tools for navigation and state passing
// Import CSS styles and assets like icons and logos


// === Component: BudgetTracker ===

// Define the component function

  // === useState ===
  // expenses: stores recent expense items
  // history: stores full financial record
  // These are updated either on load or via user actions (Add Expense, Receipt, etc.)

  // === useNavigate & useLocation ===
  // useNavigate allows us to programmatically change pages (e.g., to full history view)
  // useLocation grabs passed-in event name from EventPage
  // If no name was passed, fallback to "Budget Tracker"

  // === useEffect ===
  // When component loads, populate dummy data for:
    // expenses: 5 of the most recent expenses
    // history: 12 items showing food expenses (shows up to 12, but holds all registered expenses)
  // Later, replace this with a fetch call to backend, which stores all the expenses in an array based on date and then pulls them

  // === Return block ===
  // Renders the entire budget tracker layout


  // === Sidebar Section ===
  // Renders on the left
  // Shows user profile and navigation icons
  // Each <Link> navigates to a different page
  // Active page is highlighted or styled differently


  // === Main Content Section ===

    // === Top Navigation Bar ===
    // Displays the Planora logo and top nav links
    // Includes My Account dropdown (non-functional placeholder here)

    // === Title ===
    // Shows "[Event Name] Budget Tracker"
    // Fallback to "Budget Tracker" if none passed


    // === Grid Layout ===
    // 3-column layout: Expenses, Budget Charts, and History Panel

      // === Expenses Box ===
      // Table format showing recent expenses
      // Columns: Subject, Admin, Date, Payment
      // Map over expenses array to populate rows
      // Optionally add logic to show empty message if array is empty

      // === Budget Breakdown ===
      // Placeholder sections for:
        // Pie Chart: shows % breakdown per category
        // Bar Chart: shows amount by category or date
        // Amount Left: hardcoded for now, but should be dynamically calculated

      // === Side Panel (History Section) ===

        // === History Header Row ===
        // Title and arrow button ➤
        // Clicking the arrow navigates to /full-history route

        // === History Box ===
        // Scrollable container with fixed height
        // Header with Date, Description, Category, Spent
        // Each row is one record from history array
        // Checkbox can be used later for "mark as reviewed" or selection actions
        // Arrow next to header can be used to view all other expenses/transactions

        // === Action Buttons Section ===
        // Add Expense → opens modal for input (to be implemented)
        // Input Receipt → launches file upload and parsing (future feature)
        // Add Category → opens dropdown or modal to define a new budget category
        // Create Report → generates CSV or downloadable summary

// === Export Component ===
// Make BudgetTracker available to other files in the app
