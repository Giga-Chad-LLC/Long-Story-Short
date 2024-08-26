import os
import asyncio
import json
from typing import AsyncGenerator, Literal, Union, List
from openai import AsyncOpenAI, DefaultAsyncHttpxClient
import httpx
from sse_starlette.sse import EventSourceResponse
from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from constants import SYSTEM_PROMPT, PROXY_URL, EXAMPLE_MESSAGES
from models import RequestModel, SummarizationModel

app = FastAPI()

http_client = DefaultAsyncHttpxClient(
    proxies=PROXY_URL,
    transport=httpx.HTTPTransport(local_address="0.0.0.0")
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StreamChunk(BaseModel):
    reason: Union[Literal['CHUNK'], Literal['END']]
    content: str

def get_query_params(
    api: str = Query(..., description="API parameter"),
    model: str = Query(..., description="Model parameter"),
    token: str = Query(..., description="Token parameter"),
    objective: str = Query(..., description="Objective parameter"),
    text: str = Query(..., description="Text parameter"),
    instructions: List[str] = Query(..., description="instructions"),
) -> SummarizationModel:
    print("instructions", instructions)

    return SummarizationModel(
        request=RequestModel(api=api, model=model, token=token),
        objective=objective,
        text=text,
        instructions=instructions,
    )


@app.get("/summarize", response_class=EventSourceResponse, responses={
    200: {
        "description": "Successful Response",
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "reason": {"type": "string", "enum": ["CHUNK", "END"]},
                        "content": {"type": "string"}
                    }
                }
            }
        }
    },
})
async def summarize(data: SummarizationModel = Depends(get_query_params)):
    async def response_generator() -> AsyncGenerator[StreamChunk, None]:
        nonlocal data

        # TODO: try catch the implementation
        client = AsyncOpenAI(
            api_key=data.request.token,
            http_client=http_client,
        )

        stream = await client.chat.completions.create(
            model=data.request.model,
            stream=True,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "system",
                    "content": data.objective,
                }
            ] + EXAMPLE_MESSAGES + [{
                "role": "user",
                "content": data.text
            }]
        )
        async for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield StreamChunk(reason='CHUNK', content=content)
            else:
                yield StreamChunk(reason='END', content="")

    async def serialize_response() -> AsyncGenerator[dict, None]:
        async for chunk in response_generator():
            yield json.dumps(dict(chunk))

    return EventSourceResponse(content=serialize_response(), media_type='application/x-ndjson')
