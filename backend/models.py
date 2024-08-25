from pydantic import BaseModel
from typing import List


class RequestModel(BaseModel):
    api: str
    model: str
    token: str

class SummarizationModel(BaseModel):
    request: RequestModel
    objective: str
#     instructions: List[str]
    text: str
