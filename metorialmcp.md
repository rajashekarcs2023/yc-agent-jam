Python
example.py
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from metorial import Metorial
from anthropic import AsyncAnthropic


async def main():
  metorial = Metorial(api_key=os.getenv("METORIAL_API_KEY"))
  anthropic = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

  google_cal_deployment_id = os.getenv("GOOGLE_CALENDAR_DEPLOYMENT_ID")

  print("🔗 Creating OAuth session...")
  oauth_session = metorial.oauth.sessions.create(
    server_deployment_id=google_cal_deployment_id
  )

  print("OAuth URLs for user authentication:")
  print(f"   Google Calendar: {oauth_session.url}")

  print("\n⏳ Waiting for OAuth completion...")
  await metorial.oauth.wait_for_completion([oauth_session])

  print("✅ OAuth session completed!")
Exa
Overview
Readme
Deployments
Implementations
Test this server
Use the Metorial Explorer to test this server.

Server Summary


Neural web search

Semantic content discovery

Similarity-based research

AI content summarization

OpenAI Logo
JS & AI SDK

OpenAI Logo
JS & OpenAI

OpenAI Logo
Node.js

OpenAI Logo
Python

Install the Metorial SDK
Get started by installing the Metorial SDK in your project.


pip

pipx

conda

uv
pip install metorial
pip install metorial
Instantiate the Metorial SDK
Set up the Metorial SDK with your API key.

from metorial import Metorial

metorial = new Metorial({
  api_key='metorial_sk_AZxnc0fRWzjXfCt6MfY4jESsdS0TBFopF0f6areDs9dnBJEzvuGp6YH0znii4bnX7G6OgTddJPq0hGQhkrWQVzwyi66DZo7ZT3v1',
})
  hackernews_deployment_id = os.getenv("HACKERNEWS_DEPLOYMENT_ID")
Test this server
Use the Metorial Explorer to test this server.

Server Summary


Neural web search

Semantic content discovery

Similarity-based research

AI content summarizationInstall the Metorial SDK
Get started by installing the Metorial SDK in your project.


npm

yarn

pnpm

bun
npm install --save metorial @metorial/ai-sdk
npm install --save metorial @metorial/ai-sdk
Instantiate the Metorial SDK
Set up the Metorial SDK with your API key.

import { Metorial } from 'metorial';

const metorial = new Metorial({
  apiKey: 'metorial_sk_AZxnc0fRWzjXfCt6MfY4jESsdS0TBFopF0f6areDs9dnBJEzvuGp6YH0znii4bnX7G6OgTddJPq0hGQhkrWQVzwyi66DZo7ZT3v1',
});
import { Metorial } from 'metorial';
const metorial = new Metorial({
  apiKey: 'metorial_sk_AZxnc0fRWzjXfCt6MfY4jESsdS0TBFopF0f6areDs9dnBJEzvuGp6YH0znii4bnX7G6OgTddJPq0hGQhkrWQVzwyi66DZo7ZT3v1',
});
Deploy the Server
Create a new deployment of the server to start using it.

Before you can use this server, you need to deploy it. You can do this using the Metorial API or by clicking the button below.

