from g4f.client import Client
from g4f.Provider import Blackbox
import json
from typing import AsyncGenerator, Literal, Union
from sse_starlette.sse import EventSourceResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
from pydantic import BaseModel

os.environ.setdefault("G4F_PROXY", "http://uqPrmX:xXHA01@168.181.55.106:8000")
app = FastAPI()
client = Client()

app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_methods = ["*"],
  allow_headers = ["*"]
)

class StreamChunk(BaseModel):
    reason: Union[Literal['CHUNK'], Literal['END']]
    content: str


class QueryModel(BaseModel):
    query: str


@app.get("/get_answer", response_class=EventSourceResponse, responses={
    200: {
        "description": "Successful Response",
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "reason": {"type": "string", "enum": ["TITLE", "ANSWER"]},
                        "content": {"type": "string"}
                    }
                }
            }
        }
    },
})
async def get_answer(query: str):
    async def response_generator() -> AsyncGenerator[StreamChunk, None]:
        nonlocal query
#         response = client.chat.completions.create(
#             model="gpt-4o",
#             provider=Blackbox,
#             messages=[
#                 {"role": "system",
#                  "content": "Ты должен выделять основной контент из сообщения пользователя и излагать его в понятной форме с удобным навигационным оглавлением. Основной формат ответа - markdown"},
#                 {"role": "user", "content": query}],
#             stream=True
#         )

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

        for chunk in response.split(' '):
#             content = chunk.choices[0].delta.content
            content = chunk
            await asyncio.sleep(0.002)
            if content:
                yield StreamChunk(reason='CHUNK', content=content)
            else:
                yield StreamChunk(reason='END', content="")

    async def serialize_response() -> AsyncGenerator[dict, None]:
        async for chunk in response_generator():
            yield json.dumps(dict(chunk))

    return EventSourceResponse(content=serialize_response(), media_type='application/x-ndjson')
