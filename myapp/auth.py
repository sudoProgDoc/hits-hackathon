from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from .config import settings
from .models import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_tokens(data: dict):
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    access_token = jwt.encode(
        {"exp": datetime.utcnow() + access_token_expires, **data},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    refresh_token = jwt.encode(
        {"exp": datetime.utcnow() + refresh_token_expires, **data},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return TokenData(sub=username)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")