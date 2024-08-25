import os
import asyncio
import json
from typing import AsyncGenerator, Literal, Union, List

# from g4f.client import Client
# from g4f.Provider import Blackbox
from openai import OpenAI, DefaultHttpxClient
import httpx

from sse_starlette.sse import EventSourceResponse

from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import RequestModel, SummarizationModel


proxy_url = "http://uqPrmX:xXHA01@168.181.55.106:8000"

# os.environ.setdefault("G4F_PROXY", proxy_url)
# client = Client()

app = FastAPI()

http_client = DefaultHttpxClient(
    proxies=proxy_url,
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

# def comma_separated_to_list(comma_separated_str: str) -> List[str]:
#     return [item.strip() for item in comma_separated_str.split(",")]


def get_query_params(
    api: str = Query(..., description="API parameter"),
    model: str = Query(..., description="Model parameter"),
    token: str = Query(..., description="Token parameter"),
    objective: str = Query(..., description="Objective parameter"),
    text: str = Query(..., description="Text parameter"),
    instructions: List[str] = Query(..., description="Comma-separated list of instructions"),
) -> SummarizationModel:
#     instructions_list = comma_separated_to_list(instructions)
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
        client = OpenAI(
            api_key=data.request.token,
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

        for chunk in response:
#             content = chunk.choices[0].delta.content
            content = chunk
            if content:
                yield StreamChunk(reason='CHUNK', content=content)
            else:
                yield StreamChunk(reason='END', content="")

    async def serialize_response() -> AsyncGenerator[dict, None]:
        async for chunk in response_generator():
            yield json.dumps(dict(chunk))

    return EventSourceResponse(content=serialize_response(), media_type='application/x-ndjson')
