# 🚀 TraceX AI

### AI-Powered Digital Media Piracy Detection System

---

## 🧠 Overview

**TraceX AI** is an advanced AI-driven platform that detects unauthorized usage of digital sports media across the internet.

It works like a **Google Search Engine for videos**, allowing users to upload media and instantly discover pirated copies, track content propagation, and receive actionable legal insights.

---

## 🎯 Problem Statement

Sports organizations generate massive volumes of high-value media content that quickly spreads across multiple platforms.

However, there is **no centralized system** to:

* Track content usage
* Detect piracy
* Protect intellectual property

This leads to:

* Revenue loss 💸
* Brand misuse ⚠️
* Lack of visibility 🌍

---

## 💡 Solution

Our system uses **AI-based media fingerprinting and similarity detection** to:

* 🔍 Identify duplicated or modified media
* 🌐 Scan across platforms (simulated / API-based)
* ⚡ Detect piracy in near real-time
* ⚖️ Provide legal action recommendations

---

## 🏗️ System Architecture

```
User Upload → Frame Extraction → Embedding (CLIP)
        ↓
Internet Scan (Dataset / APIs)
        ↓
Embedding Comparison (FAISS)
        ↓
Piracy Detection Engine
        ↓
Results + Legal Suggestions
```

---

## ⚙️ Tech Stack

### 🧠 AI / ML

* CLIP (HuggingFace) – Image & video embeddings
* FAISS – Similarity search
* OpenCV – Video frame extraction

### 🌐 Backend

* FastAPI (Python)

### 🎨 Frontend

* React / Next.js
* Tailwind CSS

### 🗄️ Database

* MongoDB (optional / extendable)

---

## 🔥 Key Features

* 🎥 **Video-Based Search Engine**
  Upload videos to detect similar content across platforms

* 🧠 **AI Fingerprinting**
  Identifies content even after edits or transformations

* ⚡ **Real-Time Detection**
  Fast similarity matching using vector search

* 📊 **Google-like Results Interface**
  Displays matches with:

  * Similarity score
  * Source links
  * Platform info

* ⚖️ **Legal Suggestion Engine**
  Provides actionable steps:

  * DMCA takedown
  * Platform reporting
  * Monitoring

---

## 📸 Demo Workflow

1. Upload a video
2. System extracts frames
3. AI generates embeddings
4. Scans internet (simulated dataset/APIs)
5. Displays:

   * Pirated matches
   * Similarity scores
   * Legal actions

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mouryaveer/TraceX-AI

```

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

👉 Runs at:
http://127.0.0.1:8000

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

👉 Runs at:
http://localhost:3000

---

## 🔌 API Endpoint

### POST `/search/`

Upload a video and get piracy detection results.

**Request:**

* Multipart form-data (video file)

**Response:**

```json
{
  "query_video": "video.mp4",
  "results": [
    {
      "similarity": 0.92,
      "status": "High Piracy",
      "platform": "YouTube",
      "url": "https://...",
      "advice": "File DMCA takedown..."
    }
  ]
}
```

---

## 🧪 Sample Data

For demo purposes, the system uses a **simulated dataset** to represent internet content.
This can be extended with:

* YouTube API
* Social media APIs
* Web scraping pipelines

---

## ⚡ Future Enhancements

* 🌍 Real-time web crawling
* 📡 Live stream monitoring
* 🧾 Automated legal report generation
* 🔗 Blockchain-based ownership tracking
* 🧠 Advanced models (DINOv2, multimodal AI)

---

## 🏆 Why This Project Stands Out

* Combines **AI + Search Engine + Cybersecurity**
* Highly **scalable and real-world applicable**
* Strong **demo potential**
* Built for **Google AI Hackathon-level impact**

---

## 👥 Team

**Team Kirk**

* S. Mourya Veer
* Thota Himesh
* Y. Sai Prakash
* Y. Gnan Vikas Reddy

---

## 📜 License

This project is for educational and hackathon purposes.

---

## 🙌 Acknowledgements

* HuggingFace 🤗
* OpenAI CLIP
* FAISS (Meta AI)
* OpenCV
* FastAPI

---

## 🚀 Final Note

> “We built a Google-like AI system that gives organizations control over their digital media across the internet.”

---
