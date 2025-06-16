import asyncpg
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
import httpx
from datetime import datetime

from jose import jwt, JWTError

from .database import init_db, get_db
from .auth import create_tokens, pwd_context
from .models import UserLogin
from .dependencies import get_db_connection, get_current_active_user
from .config import settings

app = FastAPI()


@app.on_event("startup")
async def startup():
    await init_db(app)


@app.post("/register/")
async def register(user: UserLogin, db=Depends(get_db_connection)):
    try:
        hashed_password = pwd_context.hash(user.password)
        await db.execute(
            "INSERT INTO users(login, password, title, text, tags) VALUES($1, $2, $3, $4, $5)",
            user.login, hashed_password, None, None, []
        )

        await process_user_data(user.login)
        return {"status": "success", "message": "User registered"}
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Login already exists")


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db_connection)):
    user = await db.fetchrow("SELECT * FROM users WHERE login = $1", form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect credentials")

    return create_tokens({"sub": form_data.username})


@app.post("/refresh")
async def refresh(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return create_tokens({"sub": payload["sub"]})
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def process_user_data(login: str):
    processed_data = {
        "login": login,
        "processed_at": datetime.now().isoformat(),
        "status": "new_user"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                settings.OTHER_MICROSERVICE_URL,
                json=processed_data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
        except httpx.RequestError as e:
            print(f"Error sending data to microservice: {e}")


@app.get("/protected/")
async def protected_route(current_user=Depends(get_current_active_user)):
    return {"message": "This is a protected route", "user": current_user.sub}