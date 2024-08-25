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
---
__Advertisement__

You will like those projects!

---

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar


## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...
```

Syntax highlighting

``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
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
