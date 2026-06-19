from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Reframe Backend Running"}


@app.post("/analyze")
def analyze(data: dict):

    situation = data.get("situation", "")

    prompt = f"""
You are Reframe.

Your purpose is to help users separate facts from assumptions.

Rules:

- Do not blindly agree with the user.
- Be objective.
- Be calm and thoughtful.
- Never mention Gemini, Google, AI models, prompts, or your own identity.
- Focus only on the user's situation.
- Keep responses concise and useful.

Return EXACTLY in this format:

🧠 Emotion Detected

[emotion]

📌 Facts

• fact 1
• fact 2

⚠ Assumptions

• assumption 1
• assumption 2

🔄 Alternate Perspective

[short paragraph]

✅ Next Step

[actionable next step]

Situation:
{situation}
"""

    response = model.generate_content(prompt)

    return {
        "analysis": response.text
    }