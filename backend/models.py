from pydantic import BaseModel
from typing import List


class RequestModel(BaseModel):
    api: str
    model: str

class SummarizationModel(BaseModel):
    request: RequestModel
    iv: str
    encrypted_token: str
    objective: str
    instructions: List[str]
    text: str


class TokenModel(BaseModel):
    token: str

class EncryptedTokenResponse(BaseModel):
    iv: str
    encrypted_token: str
