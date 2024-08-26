import os
import json
from dotenv import load_dotenv
load_dotenv()


with open('guide.json', 'r', encoding='utf-8') as f:
  EXAMPLE_MESSAGES = json.load(f)

with open('guide_short.json', 'r', encoding='utf-8') as f:
  EXAMPLE_SHORT_MESSAGES = json.load(f)

PROXY_URL = os.getenv('PROXY_URL')
SYSTEM_PROMPT = """
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

SYSTEM_PROMPT_SHORT = """
### Ultra-Concise Text Summarization:

Your task is to produce an extremely brief summary of the following text. The summary should be **10-20 words long**, capturing only the **most critical point**.

### Additional Instructions:
- Avoid any unnecessary details.
- Use short, impactful phrases.
- **Do NOT exceed 20 words.**
"""
