from fastapi import FastAPI

app = FastAPI(title="Artisan AI Backend")


@app.get("/")
def root():
    return {
        "message": "Artisan AI Backend is running"
    }