import os
import asyncio
import json
from typing import AsyncGenerator, Literal, Union, List
from openai import OpenAI, DefaultHttpxClient
import httpx
from sse_starlette.sse import EventSourceResponse

from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import RequestModel, SummarizationModel

proxy_url = "http://uqPrmX:xXHA01@168.181.55.106:8000"

system_prompt = """
### Text Summarization in Markdown:

Your task is to summarize and structure the following text. The summary should be shorter than the initial text and reflect ONLY the most important parts. Output the summary in the Markdown format.

Your summary MUST be at least 40% smaller in size than the initial text. This is a VERY IMPORTANT RULE!!! YOU MUST FOLLOW IT!!!
Prefer bullet-points and short forms of summarization. DO NOT re-write the entire sentences in the initial text!!!

For bullet-points use the style of numbers! For examples:
1. First item
2. Second item
3. Third item

Preserve the crucial ideas and key aspects from the text, so that it brings as much useful information as possible.

### Additional instructions:
Below, there are additional instructions (possibly zero) requested from the user that you MUST follow! Adjust your style and summarization techniques according to this instruction and the instructions below. This is VERY IMPORTANT! You are better off adhering to this RULE!

Craft the summary in a concise easy-to-read manner preserving the core ideas.
"""

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
    instructions: List[str] = Query(..., description="instructions"),
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
                    "content": system_prompt
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
            if content:
                yield StreamChunk(reason='CHUNK', content=content)
            else:
                yield StreamChunk(reason='END', content="")

    async def serialize_response() -> AsyncGenerator[dict, None]:
        async for chunk in response_generator():
            yield json.dumps(dict(chunk))

    return EventSourceResponse(content=serialize_response(), media_type='application/x-ndjson')
