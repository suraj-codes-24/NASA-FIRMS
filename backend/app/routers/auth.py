from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Mock login endpoint for hackathon demo.
    Accepts any credentials and returns a dummy JWT-like token.
    """
    return LoginResponse(
        token="mock-jwt-token-abc123xyz",
        user={
            "id": "agent_alpha",
            "name": "Alpha Agent",
            "role": "admin"
        }
    )
