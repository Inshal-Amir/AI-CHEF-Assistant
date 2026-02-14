# PantryVision (v2) 🥘🤖

**Turn your leftovers into a feast using AI.**

PantryVision is a modern, AI-powered web application that helps users reduce food waste. By snapping a photo of their fridge or pantry, the app identifies ingredients, asks tailored preference questions, and generates a custom recipe using **OpenAI's GPT-4o-mini**.

## 🚀 Tech Stack

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React.
* **Backend:** Python, FastAPI, Uvicorn.
* **AI:** OpenAI API (GPT-4o-mini Vision & Text).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Python](https://www.python.org/) (v3.9 or higher)
* An [OpenAI API Key](https://platform.openai.com/)

---

## 📂 Project Structure

```text
├── backend/             # FastAPI Server
│   ├── main.py          # Application logic & Endpoints
│   ├── requirements.txt # Python dependencies
│   └── .env             # API Keys (You create this)
│
├── frontend/            # Next.js Client
│   ├── app/             # Page logic & components
│   ├── public/          # Static assets (images, 3D models)
│   └── package.json     # JS dependencies

```

---

## 🐍 Backend Setup (FastAPI)

1. **Navigate to the backend directory:**
```bash
cd backend

```


2. **Create a virtual environment:**
* **Windows:**
```bash
python -m venv venv

```


* **Mac/Linux:**
```bash
python3 -m venv venv

```




3. **Activate the virtual environment:**
* **Windows:**
```bash
.\venv\Scripts\activate

```


* **Mac/Linux:**
```bash
source venv/bin/activate

```




4. **Install dependencies:**
```bash
pip install -r requirements.txt

```


5. **Configure Environment Variables:**
* Create a new file inside the `backend` folder named `.env`.
* Open it and paste your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here

```




6. **Run the Server:**
Start the FastAPI backend with hot-reloading enabled:
```bash
python -m uvicorn main:app --reload

```


* *The backend should now be running at `http://localhost:8000*`



---

## ⚛️ Frontend Setup (Next.js)

1. **Open a new terminal and navigate to the frontend directory:**
```bash
cd frontend

```


2. **Install dependencies:**
```bash
npm install

```


*(Note: If you haven't installed the specific UI libraries yet, run: `npm install framer-motion lucide-react react-webcam`)*
3. **Add your 3D Model (Important!):**
* Ensure you have downloaded your `.glb` model (e.g., `chef-robot.glb`).
* Place it inside the `frontend/public/` folder.


4. **Run the Development Server:**
```bash
npm run dev

```


5. **Open the App:**
* Visit [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.



---

## 🎮 How to Use

1. **Launch:** Ensure both Backend (port 8000) and Frontend (port 3000) terminals are running.
2. **Capture:** Click **"Analyze My Fridge"** and upload a photo or use your webcam.
3. **Interact:** The AI will identify ingredients and ask you 2 playful questions (e.g., "Spicy or Mild?").
4. **Cook:** Submit your answers, and watch the AI generate a full recipe with a shopping list for missing items.

---

## ⚠️ Troubleshooting

* **CORS Error:** If the frontend says "Fetch failed," ensure the backend is running and the `origins` list in `main.py` includes `http://localhost:3000`.
* **OpenAI 429 Error:** This means you ran out of credits or are sending requests too fast. Check your OpenAI billing dashboard.
* **"Module not found":** Make sure you activated the virtual environment (`venv`) before running the python command.

```

```
