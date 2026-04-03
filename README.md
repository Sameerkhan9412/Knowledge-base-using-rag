# 📄 PDF RAG App (Chat with Your PDFs)

An AI-powered full-stack application that allows users to upload PDFs and interact with them using natural language.
The app uses **Retrieval-Augmented Generation (RAG)** to provide accurate answers from document content.

---

## 🚀 Features

* Authentication using Clerk
* Upload multiple PDFs
* Chat with your documents
* Chat history (persistent)
* Fast retrieval using vector database
* Background processing with queues
* LLM-powered answers (Grok / LLM APIs)

---

## Architecture

```text
Frontend (Next.js + Clerk)
        ↓
Backend API (Node.js + Express)
        ↓
PDF Upload → Storage (Local / Cloud)
        ↓
Queue (BullMQ + Redis)
        ↓
Worker (PDF Processing)
        ↓
Chunking → Embedding
        ↓
Vector DB (Qdrant)
        ↓
User Query → Embedding
        ↓
Retrieve relevant chunks
        ↓
LLM (Grok / API)
        ↓
Final Answer → UI
```

---

##  Flow

### Upload Flow

1. User uploads PDF
2. File stored in server
3. Job pushed to queue (BullMQ)
4. Worker processes PDF:

   * Extract text
   * Chunk text
   * Generate embeddings
   * Store in Qdrant

---

### Chat Flow

1. User asks question
2. Query converted to embedding
3. Qdrant retrieves relevant chunks
4. Context + query sent to LLM
5. LLM generates answer
6. Answer returned to UI

---

## Tech Stack

### 🔹 Frontend

* Next.js (App Router)
* React.js
* Tailwind CSS
* Clerk (Authentication)

### 🔹 Backend

* Node.js
* Express.js

### 🔹 AI / RAG

* Embeddings (Grok )
* LLM (Grok API)

### 🔹 Database

* MongoDB (Chat + Users)
* Qdrant (Vector DB)

### 🔹 Queue & Processing

* BullMQ
* Redis

---

## Setup Instructions

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/pdf-rag-app.git
cd pdf-rag-app
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

#### Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri

QDRANT_URL=https://your-qdrant-url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=pdf_chunks

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

GROQ_API_KEY=your_groq_key
```

#### Run Backend

```bash
node server.js
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
```

#### Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

#### Run Frontend

```bash
npm run dev
```

---

### 4️⃣ Run Redis

```bash
redis-server
```

---

## Screenshots

* Dashboard UI
* Chat UI
* PDF Upload

---

## Authentication

* Implemented using Clerk
* Protected routes using middleware
* User-specific chat and documents

---

## 📌 Future Improvements

* Streaming responses (like ChatGPT)
* PDF highlighting
* Cloud storage (S3 / Cloudinary)
* Multi-language support
* OCR for scanned PDFs

---

## Author

Sameer
MCA Student @ Aligarh Muslim University
Full Stack Developer | MERN | AI Enthusiast