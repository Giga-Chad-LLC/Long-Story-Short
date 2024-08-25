import os
import asyncio
import json
from dotenv import load_dotenv
from typing import AsyncGenerator, Literal, Union, List

# from g4f.client import Client
# from g4f.Provider import Blackbox
from openai import OpenAI, DefaultHttpxClient, AuthenticationError
import httpx

from sse_starlette.sse import EventSourceResponse

from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import RequestModel, SummarizationModel, TokenModel, EncryptedTokenResponse
from encryption import encrypt_token, decrypt_token


load_dotenv()

# proxy_url = os.getenv("PROXY_URL")
# os.environ.setdefault("G4F_PROXY", proxy_url)
# client = Client()

app = FastAPI()

http_client = DefaultHttpxClient(
    proxies=os.getenv("PROXY_URL"),
    transport=httpx.HTTPTransport(local_address="0.0.0.0")
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/encrypt-token", response_model=EncryptedTokenResponse)
def hash_token(data: TokenModel):
    try:
        encryption_key = os.getenv("ENCRYPTION_KEY")
        return encrypt_token(data.token, encryption_key)
    except ValueError as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


class StreamChunk(BaseModel):
    reason: Union[Literal['CHUNK'], Literal['END']]
    content: str


def get_query_params(
    api: str = Query(..., description="API parameter"),
    model: str = Query(..., description="Model parameter"),
    iv: str = Query(..., description="IV parameter"),
    encrypted_token: str = Query(..., description="Encrypted Token parameter"),
    objective: str = Query(..., description="Objective parameter"),
    text: str = Query(..., description="Text parameter"),
    instructions: List[str] = Query(..., description="Comma-separated list of instructions"),
) -> SummarizationModel:
    return SummarizationModel(
        request=RequestModel(api=api, model=model),
        iv=iv,
        encrypted_token=encrypted_token,
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

        # NOTE: token from the user comes encrypted
        encryption_key = os.getenv("ENCRYPTION_KEY")
        decrypted_token = decrypt_token(data.iv, data.encrypted_token, encryption_key)

        client = OpenAI(
            api_key=decrypted_token,
            http_client=http_client,
        )

        stream = client.chat.completions.create(
            model=data.request.model,
            stream=True,
            messages=[
                {
                    "role": "system",
                    "content": "You must summarize the following text"
                },
                {
                    "role": "system",
                    "content": data.objective,
                }
            ] + [{
                "role": "user",
                "content": data.text
            }]
        )

        # response = client.chat.completions.create(
        #     model=data.request.model,
        #     provider=Blackbox,
        #     messages=[
        #         {"role": "system",
        #          "content": "Ты должен выделять основной контент из сообщения пользователя и излагать его в понятной форме с удобным навигационным оглавлением. Основной формат ответа - markdown"},
        #         {"role": "user", "content": query}],
        #     stream=True
        # )

        response = """
# Sample Markdown

## Subheading

This is a paragraph in **bold** and _italic_.

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

1. Ordered Item 1
2. Ordered Item 2

### Code Block

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('World'));
```

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |"""

        for chunk in stream:
            content = chunk.choices[0].delta.content
            # content = chunk
            if content:
                yield StreamChunk(reason='CHUNK', content=content)
            else:
                yield StreamChunk(reason='END', content="")



    async def serialize_response() -> AsyncGenerator[dict, None]:
        async for chunk in response_generator():
            yield json.dumps(dict(chunk))

    return EventSourceResponse(content=serialize_response(), media_type='application/x-ndjson')
