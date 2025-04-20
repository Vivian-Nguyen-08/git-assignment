Class: 3354.002
<br>Professor: Srimathi Srinivasan

<h2>Team Details:</h2>
Team #2
<br>Team Name: Planora
<br><h4>Team names:</h4>

- Vivian Nguyen
- Shreya Ramani
- Rohit Penna
- Shreya Kumari 
- Sarah Park
- Diya Mehta
- Aarya Ravishankar
- Eric Lewellen

<h4>Statement of Work: </h4>
<p> Our Project named Planora is an event planning and collaboration platform designed as a centralized hub for managing events, meetings, and related resources. 
It integrates essential features such as video calls, a shared calendar, real-time notes, file management, and chat, enabling teams to collaborate seamlessly. 
By consolidating multiple tools into a single application, the solution reduces app-switching fatigue, enhances communication, and streamlines workflow.  </p>



## Local Setup Instructions

### Required Software

Make sure the following software is installed before getting started:

- [Node.js (LTS)](https://nodejs.org/en/)
- [GitHub Desktop](https://desktop.github.com/) *(Optional)*
- [Visual Studio Code](https://code.visualstudio.com/)
- [PostgreSQL](https://www.postgresql.org/) *(Required for the database)*
- [MySQL Workbench](https://www.mysql.com/products/workbench/) *(Optional, for visual database management)*

---

### Clone the Repository

1. Open **VS Code**
2. From the top menu, select **Terminal > New Terminal**
3. Run the following commands:

```bash
git clone https://github.com/Vivian-Nguyen-08/git-assignment.git
cd git-assignment
```

---

###  Frontend Setup (React + Next.js)

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install the necessary dependencies:

```bash
npm install
npm i next-auth
npm i -D daisyui@latest
npm install recharts
```

3. Start the frontend server:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

---

###  Backend Setup (FastAPI)

1. Navigate to the backend directory:

```bash
cd ../backend
```

2. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

---

###  Notes

- Ensure both the **frontend** and **backend** are running at the same time.
- You can use **Browser DevTools** or **Postman** to test API endpoints and inspect responses.

---

## Tech Stack

- **Frontend**: React, Next.js, DaisyUI, Recharts
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **Other Tools**: MySQL Workbench (optional)

---

## 🙌 Acknowledgments

Thanks to all contributors and open-source libraries that make this project possible.
