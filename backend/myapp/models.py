from pydantic import BaseModel
from typing import Optional

class UserLogin(BaseModel):
    login: str
    password: str

class TokenData(BaseModel):
    sub: Optional[str] = None