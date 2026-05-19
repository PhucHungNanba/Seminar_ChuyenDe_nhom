from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import analyze
from routers import association_rules

app = FastAPI(title="AI Service for Smart Medicine Shop")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/ai", tags=["AI Analysis"])
app.include_router(association_rules.router, prefix="/api/ai", tags=["Association Rules"])

@app.get("/health")
def health_check():
    return {"status": "AI Service is running smoothly 🟢"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
