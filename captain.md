Getting Started with captain
Welcome to Captain! Choose the path that matches your use case:

Choose Your Starting Point
Option 1: SDK Integration
For developers using OpenAI SDKs or Vercel AI SDK

Captain is a drop-in replacement for OpenAI - just change the base URL and start using unlimited context:

OpenAI SDK compatible - Use existing OpenAI code
Multiple languages - Python, JavaScript, TypeScript support
Unlimited context - Process millions of tokens in a single request
No code changes - Drop-in replacement
Real-time streaming - Familiar streaming interface
Start here if you: - Currently use the OpenAI SDK (Python, JavaScript/TypeScript) or Vercel AI SDK - Want the easiest migration path - Prefer the familiar SDK interface - Need unlimited context with minimal code changes

Get Started with SDK →

Option 2: HTTP API Integration
For developers making direct HTTP requests

Use Captain's REST API directly with any HTTP client (requests, fetch, curl, etc.):

Simple HTTP API - Standard POST requests
Unlimited context - Process any amount of text
No database required - Instant processing without setup
Language agnostic - Use any programming language
Start here if you: - Prefer direct HTTP API calls over SDKs - Use languages without official SDK support - Want full control over requests - Don't use the OpenAI SDK

Get Started with HTTP API →

Option 3: Data Lake Integration
For developers with AWS S3 or Google Cloud Storage

Index entire cloud storage buckets and query across thousands of files:

Connect AWS S3 or GCS - Index entire buckets automatically
Persistent databases - Query across thousands of files
File tracking - Know which files contain what information
Automatic updates - Re-index buckets as files change
Start here if you: - Have documents in AWS S3 or Google Cloud Storage - Need to query across multiple files - Want a searchable knowledge base - Require persistent indexed data

Get Started with Data Lake Integration →

Prerequisites
Get Your API Credentials
You'll need: - API Key from Captain API Studio (format: cap_dev_..., cap_prod_...) - Organization ID (UUID format, also available in the Studio)

Store your API key securely, such as in an environment variable:

macOS / Linux

export CAPTAIN_API_KEY="cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export CAPTAIN_ORG_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
Windows

set CAPTAIN_API_KEY=cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set CAPTAIN_ORG_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Getting Started with SDK
Captain provides OpenAI SDK compatibility. Choose your integration:

Python SDK →
JavaScript/TypeScript SDK →
Vercel AI SDK →
Python SDK
Perfect for developers already using the OpenAI Python SDK - Captain is a drop-in replacement.

Installation
pip install openai
Quick Start: Your First Request
Important: Provide context via extra_body and use system messages for instructions:

from openai import OpenAI

client = OpenAI(
    base_url="https://api.runcaptain.com/v1",
    api_key="cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    default_headers={
        "X-Organization-ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
)

# Your context can be any size - no token limits!
context = """
Product Catalog:
- Widget A: $10, In stock: 50
- Widget B: $15, In stock: 30
- Widget C: $20, Out of stock
"""

response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[
        {"role": "system", "content": "You are a helpful product assistant."},
        {"role": "user", "content": "Which widgets are in stock and under $20?"}
    ],
    extra_body={
        "captain": {
            "context": context
        }
    }
)

print(response.choices[0].message.content)
System Prompts: Custom Roles or Captain's Default
Captain gives you full control over the AI's persona and behavior through system prompts:

Option 1: Define Your Own Role - Use system messages to make the AI assume specific roles or behaviors:

response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[
        {"role": "system", "content": "You are Luigi, a helpful assistant specialized in telling me the facts"},
        {"role": "user", "content": "Who invented the light bulb?"}
    ],
    extra_body={
        "captain": {
            "context": "Thomas Edison patented the light bulb in 1879..."
        }
    }
)
# AI responds as Luigi with your custom instructions
Option 2: Use Captain's Default - Omit the system message to use Captain's built-in persona:

response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[
        {"role": "user", "content": "Who invented the light bulb?"}
    ],
    extra_body={
        "captain": {
            "context": "Thomas Edison patented the light bulb in 1879..."
        }
    }
)
# AI responds with Captain's default helpful, informative persona
Key Points:

System messages = AI instructions (define role, tone, behavior)
User messages = Your actual questions or requests
extra_body.captain.context = Large documents/data to analyze
System prompts are completely optional - Captain has intelligent defaults
Streaming Responses
Get responses in real-time as they're generated:

response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a short poem about coding"}
    ],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
Processing Large Text Documents
Captain handles unlimited context automatically - no size limits:

# Load any size document - Captain automatically handles large contexts
with open('large_document.txt', 'r') as f:
    document_text = f.read()

response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[
        {"role": "system", "content": "You are a research analysis assistant."},
        {"role": "user", "content": "Summarize the key findings"}
    ],
    extra_body={
        "captain": {
            "context": document_text
        }
    }
)

print(response.choices[0].message.content)
Note: For processing PDFs, images, or other file formats, use Data Lake Integration which supports 30+ file types including PDF, DOCX, images, and more.

JavaScript/TypeScript SDK
Perfect for developers using Node.js, Deno, or Bun - Captain is a drop-in replacement for OpenAI.

Installation
Install the OpenAI SDK using npm or your preferred package manager:

npm install openai
Quick Start: Your First Request
Important: Provide context via experimental_providerOptions.openai.extra_body.captain.context. Create a file called example.mjs with the following code:

import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://api.runcaptain.com/v1",
    apiKey: "cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    defaultHeaders: {
        "X-Organization-ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
});

// Your context can be any size - no token limits!
const context = `
Product Catalog:
- Widget A: $10, In stock: 50
- Widget B: $15, In stock: 30
- Widget C: $20, Out of stock
`;

const response = await client.chat.completions.create({
    model: "captain-voyager-latest",
    messages: [
        { role: "system", content: "You are a helpful product assistant." },
        { role: "user", content: "Which widgets are in stock and under $20?" }
    ],
    extra_body: {
        captain: {
            context: context
        }
    }
});

console.log(response.choices[0].message.content);
Execute the code with node example.mjs (or the equivalent command for Deno or Bun).

Streaming Responses
Get responses in real-time as they're generated:

const context = "You are a helpful assistant.";

const response = await client.chat.completions.create({
    model: "captain-voyager-latest",
    messages: [
        { role: "system", content: "You are a helpful product assistant." },
        { role: "user", content: "Write a short poem about coding" }
    ],
    stream: true
});

for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
    }
}
Processing Large Text Documents
Captain handles unlimited context automatically - no size limits:

import { readFileSync } from 'fs';

// Load any size document - Captain automatically handles S3 upload for large contexts
const documentText = readFileSync('large_document.txt', 'utf-8');


const response = await client.chat.completions.create({
    model: "captain-voyager-latest",
    messages: [
        { role: "system", content: "You are a research analysis assistant." },
        { role: "user", content: "Summarize the key findings" }
    ],
    extra_body: {
        captain: {
            context: documentText
        }
    }
});







console.log(response.choices[0].message.content);
Note: For processing PDFs, images, or other file formats, use Data Lake Integration which supports 30+ file types including PDF, DOCX, images, and more.

Vercel AI SDK
Perfect for developers using Vercel's AI SDK - Captain works seamlessly with the OpenAI provider.

Installation
npm install @ai-sdk/openai ai
For tool calling, also install zod:

npm install zod
Quick Start: Your First Request
Important: Vercel AI SDK requires context to be passed via a custom header X-Captain-Context that must be base64-encoded (HTTP headers cannot contain newlines).

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const context = `
Product Catalog:
- Widget A: $10, In stock: 50
- Widget B: $15, In stock: 30
- Widget C: $20, Out of stock
`;

// Base64 encode the context for header transmission (headers can't contain newlines)
const contextBase64 = Buffer.from(context).toString('base64');

const captain = createOpenAI({
  apiKey: process.env.CAPTAIN_API_KEY,
  baseURL: 'https://api.runcaptain.com/v1',
  headers: {
    'X-Organization-ID': process.env.CAPTAIN_ORG_ID,
    'X-Captain-Context': contextBase64,  // Base64 encoded context
  },
});

const { textStream } = await streamText({
  model: captain('captain-voyager-latest'),
  messages: [
    { role: 'user', content: 'Which widgets are in stock and under $20?' }
  ],
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
Why base64 encoding? HTTP headers cannot contain newlines or special characters, so context must be base64-encoded before being sent in the X-Captain-Context header.

Alternative: For production use, we recommend the OpenAI SDK with extra_body parameter - it's more reliable and doesn't require base64 encoding.

Non-Streaming Responses
For non-streaming responses, use generateText():

import { generateText } from 'ai';

const context = `Product Catalog...`;
const contextBase64 = Buffer.from(context).toString('base64');

const captain = createOpenAI({
  apiKey: process.env.CAPTAIN_API_KEY,
  baseURL: 'https://api.runcaptain.com/v1',
  headers: {
    'X-Organization-ID': process.env.CAPTAIN_ORG_ID,
    'X-Captain-Context': contextBase64,
  },
});

const { text } = await generateText({
  model: captain('captain-voyager-latest'),
  messages: [
    { role: 'user', content: 'Which widgets are in stock?' }
  ],
});

console.log(text);
Tool Calling
Define tools with Vercel AI SDK's zod schema format:

import { generateText } from 'ai';
import { z } from 'zod';

const tools = {
  get_inventory: {
    description: 'Get current inventory levels',
    parameters: z.object({
      product_id: z.string().describe('Product identifier'),
    }),
    execute: async ({ product_id }) => {
      // Your API call here
      return { product_id, stock: 45 };
    },
  },
};

const context = `Product Catalog: SKU-001, SKU-002`;
const contextBase64 = Buffer.from(context).toString('base64');

const captain = createOpenAI({
  apiKey: process.env.CAPTAIN_API_KEY,
  baseURL: 'https://api.runcaptain.com/v1',
  headers: {
    'X-Organization-ID': process.env.CAPTAIN_ORG_ID,
    'X-Captain-Context': contextBase64,
  },
});

const { text } = await generateText({
  model: captain('captain-voyager-latest'),
  messages: [
    { role: 'user', content: 'What is inventory for SKU-001?' }
  ],
  tools,
  maxSteps: 5,
});

console.log(text);
Processing Large Contexts
⚠️ Important: HTTP headers have size limits (~4-8KB). For contexts larger than ~4KB after base64 encoding:

Option 1: Use the OpenAI JavaScript SDK with extra_body (recommended)

Option 2: Use the /v1/chat/completions/upload endpoint with FormData:

import { readFileSync } from 'fs';

const largeDocument = readFileSync('large-file.txt', 'utf-8');

// Prepare FormData
const formData = new FormData();
const blob = new Blob([largeDocument], { type: 'text/plain' });
formData.append('file', blob, 'context.txt');
formData.append('messages', JSON.stringify([
  { role: 'user', content: 'Summarize the key findings' }
]));
formData.append('model', 'captain-voyager-latest');
formData.append('stream', 'true');

// Upload large context
const response = await fetch('https://api.runcaptain.com/v1/chat/completions/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.CAPTAIN_API_KEY}`,
    'X-Organization-ID': process.env.CAPTAIN_ORG_ID,
  },
  body: formData
});

// Parse SSE stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content;
        if (content) process.stdout.write(content);
      } catch (e) {}
    }
  }
}
For complete documentation, see Vercel AI SDK Guide.

Next Steps: SDK
Full SDK Documentation - Complete reference for Python, JavaScript, and Vercel AI SDK
Learn about all supported parameters
Explore advanced streaming options
Understand unlimited context processing
Getting Started with HTTP API
Perfect for developers making HTTP requests with any language or framework. The HTTP API provides direct access to Captain's infinite context processing without requiring SDKs.

Authentication
All HTTP API requests require authentication via headers:

Authorization: Bearer YOUR_API_KEY
X-Organization-ID: YOUR_ORG_UUID
Quick Start: Your First Request
Use the /v1/responses endpoint to process text and ask questions:

import requests

# Setup credentials
API_KEY = "cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
ORG_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
BASE_URL = "https://api.runcaptain.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Organization-ID": ORG_ID
}

# Make a request
response = requests.post(
    f"{BASE_URL}/v1/responses",
    headers=headers,
    data={
        'input': 'The capital of France is Paris. It is known for the Eiffel Tower.',
        'query': 'What is the capital of France?'
    }
)

result = response.json()
print(result['response'])
Key Parameters: - input: Your context/document text (required) - query: The question to ask about the context (required) - stream: Set to 'true' for real-time streaming (optional)

HTTP API in Different Languages
Python (requests):

import requests

context = """
Sales Data Q1 2024:
- January: $50,000
- February: $65,000
- March: $72,000
"""

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Organization-ID": ORG_ID
}

response = requests.post(
    f"{BASE_URL}/v1/responses",
    headers=headers,
    data={
        'input': context,
        'query': 'What was the total revenue for Q1?'
    }
)

result = response.json()
print(result['response'])
JavaScript (fetch):

const API_KEY = 'cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const ORG_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const BASE_URL = 'https://api.runcaptain.com';

const context = `
Sales Data Q1 2024:
- January: $50,000
- February: $65,000
- March: $72,000
`;

const response = await fetch(`${BASE_URL}/v1/responses`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'X-Organization-ID': ORG_ID,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'input': context,
    'query': 'What was the total revenue for Q1?'
  })
});

const result = await response.json();
console.log(result.response);
cURL:

curl -X POST https://api.runcaptain.com/v1/responses \
  -H "Authorization: Bearer cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-Organization-ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" \
  -d "input=Sales Data Q1 2024: January: \$50,000, February: \$65,000, March: \$72,000" \
  -d "query=What was the total revenue for Q1?"
Streaming Responses
Get responses in real-time as they're generated using Server-Sent Events (SSE):

Python:

response = requests.post(
    f"{BASE_URL}/v1/responses",
    headers=headers,
    data={
        'input': 'You are a helpful assistant.',
        'query': 'Write a short poem about coding',
        'stream': 'true'
    },
    stream=True  # Important: Enable streaming in requests
)

for line in response.iter_lines():
    if line:
        line_text = line.decode('utf-8')
        if line_text.startswith('data: '):
            data = line_text[6:]  # Remove 'data: ' prefix
            print(data, end='', flush=True)
JavaScript:

const response = await fetch(`${BASE_URL}/v1/responses`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'X-Organization-ID': ORG_ID,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'input': 'You are a helpful assistant.',
    'query': 'Write a short poem about coding',
    'stream': 'true'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      process.stdout.write(data);
    }
  }
}
cURL:

curl -N -X POST https://api.runcaptain.com/v1/responses \
  -H "Authorization: Bearer cap_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-Organization-ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" \
  -d "input=You are a helpful assistant." \
  -d "query=Write a short poem about coding" \
  -d "stream=true"
Processing Large Text Documents
Captain handles unlimited context - send text files of any size:

# Read any size text document
with open('large_report.txt', 'r') as f:
    document_text = f.read()

response = requests.post(
    f"{BASE_URL}/v1/responses",
    headers=headers,
    data={
        'input': document_text,
        'query': 'Summarize the key findings'
    }
)

result = response.json()
print(result['response'])
Note: For processing PDFs, images, or other file formats, use Data Lake Integration which supports 30+ file types.

HTTP Response Formats
Non-Streaming Response:

{
  "status": "success",
  "response": "The total revenue for Q1 2024 was $187,000.",
  "request_id": "resp_1729876543_a1b2c3d4"
}
Streaming Response (SSE):

data: {"type": "chunk", "data": "The total"}

data: {"type": "chunk", "data": " revenue for"}

data: {"type": "chunk", "data": " Q1 2024 was $187,000."}

event: complete
data: {"status": "success", "request_id": "resp_1729876543_a1b2c3d4"}
Error Response:

{
  "status": "error",
  "message": "Input text is required",
  "error_code": "MISSING_INPUT"
}
Next Steps: HTTP API
Full HTTP API Documentation - Complete reference including /v1/responses endpoint
Learn about all available parameters
Explore error handling
Understand rate limits
Getting Started with Data Lake Integration
Perfect for indexing cloud storage buckets and querying across multiple files.

Step 1: Create a Database
Databases are containers for your indexed files. Each database is scoped to your organization and environment.

import requests

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Organization-ID": ORG_ID
}

response = requests.post(
    f"{BASE_URL}/v1/create-database",
    headers=headers,
    data={
        'database_name': 'my_documents'
    }
)

print(response.json())
# {"status": "success", "database_name": "my_documents", "database_id": "db_..."}
Step 2: Index Your Cloud Storage
Choose your cloud storage provider:

Option A: Index AWS S3 Bucket
from urllib.parse import quote

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Organization-ID": ORG_ID
}

response = requests.post(
    f"{BASE_URL}/v1/index-s3",
    headers=headers,
    data={
        'database_name': 'my_documents',
        'bucket_name': 'my-s3-bucket',
        'aws_access_key_id': 'AKIAIOSFODNN7EXAMPLE',
        'aws_secret_access_key': quote('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', safe=''),
        'bucket_region': 'us-east-1'
    }
)

job_id = response.json()['job_id']
print(f"Indexing started! Job ID: {job_id}")
Need AWS credentials? See the Cloud Credentials Guide for step-by-step instructions.

Option B: Index Google Cloud Storage Bucket
import requests

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "X-Organization-ID": ORG_ID
}

# Load your service account JSON
with open('service-account-key.json', 'r') as f:
    service_account_json = f.read()

response = requests.post(
    f"{BASE_URL}/v1/index-gcs",
    headers=headers,
    data={
        'database_name': 'my_documents',
        'bucket_name': 'my-gcs-bucket',
        'service_account_json': service_account_json
    }
)

job_id = response.json()['job_id']
print(f"Indexing started! Job ID: {job_id}")
Need GCS credentials? See the Cloud Credentials Guide for step-by-step instructions.

Step 3: Monitor Indexing Progress
import time

while True:
    response = requests.get(
        f"{BASE_URL}/v1/indexing-status/{job_id}",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )

    result = response.json()
    if result.get('completed'):
        print("✓ Indexing complete!")
        break

    print(f"Status: {result.get('status')} - {result.get('active_file_processing_workers')} workers active")
    time.sleep(5)
Step 4: Query Your Indexed Data
import uuid

response = requests.post(
    f"{BASE_URL}/v1/query",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "X-Organization-ID": ORG_ID,
        "Idempotency-Key": str(uuid.uuid4())
    },
    data={
        'query': 'What are the revenue projections for Q4?',
        'database_name': 'my_documents',
        'include_files': 'true'  # Returns which files were used
    }
)

result = response.json()
print("Answer:", result['response'])
print("\nRelevant Files:")
for file in result.get('relevant_files', []):
    print(f"  - {file['file_name']} (relevancy: {file['relevancy_score']})")
Step 5: Query with Streaming (Optional)
Get real-time responses as they're generated:

response = requests.post(
    f"{BASE_URL}/v1/query",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "X-Organization-ID": ORG_ID
    },
    data={
        'query': 'Summarize all security incidents mentioned',
        'database_name': 'my_documents',
        'stream': 'true'
    },
    stream=True  # Important: enable streaming
)

# Process streamed response
for line in response.iter_lines():
    if line:
        line_text = line.decode('utf-8')
        if line_text.startswith('data: '):
            print(line_text[6:], end='', flush=True)
Next Steps: Data Lake Integration
Full Data Lake Integration Documentation - Complete reference
Learn about database management
Explore file-level operations
Understand re-indexing behavior
Monitor indexing jobs
Important Concepts
Environment Scoping
API keys are scoped to environments: - Development (cap_dev_*) - For testing and development - Staging (cap_stage_*) - For pre-production testing - Production (cap_prod_*) - For production use

Databases created with a development key can only be accessed with development keys from the same organization.

Supported File Types
Captain supports 30+ file types including:

Documents: PDF, DOCX, TXT, MD, RTF, ODT Spreadsheets: XLSX, XLS, CSV Presentations: PPTX, PPT Images: JPG, PNG (with OCR) Code: PY, JS, TS, HTML, CSS, PHP, JAVA Data: JSON, XML

See the complete file type list in the Data Lake Integration docs.

Rate Limits
Tier	Requests/Min (Captain API)	Requests/Min (Query)	Indexing Jobs/Hour
Standard	10	10	10
Premium	60	60	Unlimited
Contact support@runcaptain.com to upgrade.

Comparison: SDK vs HTTP API vs Data Lake
Feature	SDK (Python/JS)	HTTP API	Data Lake Integration
Setup Required	None	None	Create database + index files
Interface	OpenAI SDK	HTTP API	HTTP API
Languages	Python, JavaScript/TypeScript	Any language	Any language
Input Method	Messages array	Query + Input params	Index cloud storage
Persistence	No	No	Yes (persistent database)
Query Across Files	Single request	Single request	Thousands of files
Use Case	Drop-in OpenAI replacement	Custom integrations	Knowledge base
OpenAI Compatible	✓ Compatible	✗ Different interface	✗ Different interface
Streaming	✓ Real-time	✓ Real-time	✓ Real-time
Max Input Size	Unlimited	Unlimited	Unlimited (per file)
File Tracking	No	No	Yes (which files contain what)
Re-query Same Data	Re-send required	Re-send required	Instant (already indexed)
Using the Demo Client
We provide a comprehensive demo client that showcases all Captain features:

# Download the demo client
wget https://raw.githubusercontent.com/runcaptain/demo/main/captain_demo.py

# Run the interactive demo
python captain_demo.py
The demo client includes examples for: - Creating databases - Indexing S3 and GCS buckets - Querying indexed data - Processing large context with Captain API - Streaming responses

Next Steps
For SDK Users:
Read the Full SDK Documentation
Explore streaming and advanced features
Learn about context handling options
Migrate your existing OpenAI code (Python or JavaScript)
For HTTP API Users:
Read the Full HTTP API Documentation
Explore all available endpoints
Learn about error handling and rate limits
Implement in your preferred language
For Data Lake Users:
Read the Data Lake Integration Documentation
Get your Cloud Storage Credentials
Index your first bucket
Start querying your data
Additional Resources:
Complete API Reference
Cloud Credentials Guide
Demo Client Guide
Getting Help
Need assistance? We're here to help!

Email: support@runcaptain.com
Phone: +1 (260) CAP-TAIN
Documentation: docs.runcaptain.com
Status Page: status.runcaptain.comAPI Reference
Base URL: https://api.runcaptain.com

Authentication
All API requests require authentication using your API key and organization ID.

Authorization: Bearer YOUR_API_KEY
X-Organization-ID: YOUR_ORG_UUID
Most endpoints also require api_key and organization_id in the request body.

Captain API (Chat Completions with Infinite Context)
For OpenAI-compatible chat completions with infinite context support, see the Infinite Responses API Documentation.

Context Passing Methods
Captain supports multiple ways to pass context with your requests:

OpenAI SDK (⭐ Recommended): Use extra_body parameter

extra_body: {
  captain: {
    context: "your context here"
  }
}
Vercel AI SDK: Use base64-encoded custom header

headers: {
  'X-Captain-Context': Buffer.from(context).toString('base64')
}
Direct HTTP: Use captain parameter in request body

{
  "captain": {
    "context": "your context here"
  }
}
For complete examples and detailed documentation, see: - JavaScript/TypeScript SDK Guide - Infinite Responses API

Data Lake Integration APIs
The following endpoints are for managing databases and querying indexed cloud storage.

Environment Scoping
Important: API keys are scoped to specific environments, and can only access data in that environment.

Development keys (prefix: cap_dev_*) can only access development databases and data
Staging keys (prefix: cap_stage_*) can only access staging databases and data
Production keys (prefix: cap_prod_*) can only access production databases and data
When you create a database with a development key, it becomes a development database. When you query, list files, or delete files, you can only interact with databases and data in the same environment as your API key.

Example: If you create a database called contracts_2024 using a development key (cap_dev_*), you cannot access it using a production key (cap_prod_*), even if both keys belong to the same organization. You would need to create a separate contracts_2024 database using the production key.

This environment isolation ensures that development, staging, and production data remain completely separate.

Create Database
Creates a new database for indexing files.

Endpoint
POST /v1/create-database
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Unique name for your database. Must be unique within your account.
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests

response = requests.post(
    "https://api.runcaptain.com/v1/create-database",
    data={
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'database_name': 'my_documents'
    }
)

print(response.json())
Response
Success (200 OK)

{
  "database_name": "my_documents",
  "database_id": "db_abc123",
  "status": "success",
  "message": "Database created successfully"
}
Error (400 Bad Request)

{
  "status": "error",
  "message": "Database name already exists"
}
Notes
Database names are scoped to your organization and environment
Two different organizations can use the same database name, and the same organization can create databases with the same name in different environments (dev, staging, prod)
Only one database with a given name can exist per organization per environment
Special characters and spaces should be avoided in database names
The database will be created in the environment matching your API key (development keys create development databases, production keys create production databases, etc.)
Delete Database
Deletes a database. This cannot be undone.

Endpoint
POST /v1/delete-database
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Name of the database to delete
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests

response = requests.post(
    "https://api.runcaptain.com/v1/delete-database",
    data={
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'database_name': 'my_documents'
    }
)

print(response.json())
Response
Success (200 OK)

{
  "status": "success",
  "message": "Database deleted successfully",
  "database_name": "my_documents"
}
Error (404 Not Found)

{
  "status": "error",
  "message": "Database not found"
}
Error (401 Unauthorized)

{
  "status": "error",
  "message": "Invalid API key"
}
Notes
This action cannot be undone
All indexed files in the database are deleted as well
You may create a new database with the same name after deletion
Only databases in the same environment as your API key can be deleted (development keys can only delete development databases, etc.)
List Databases
Retrieves all databases associated with your account.

Endpoint
POST /v1/list-databases
Parameters
Parameter	Type	Required	Description
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests

headers = {
    "Authorization": "Bearer cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd",
    "Content-Type": "application/x-www-form-urlencoded"
}

response = requests.post(
    "https://api.runcaptain.com/v1/list-databases",
    headers=headers,
    data={
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2'
    }
)

print(response.json())
Response
Success (200 OK)

[
  {
    "database_id": "db_abc123",
    "database_name": "contracts_2024",
    "environment": "production",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "request_count": 1250
  },
  {
    "database_id": "db_def456",
    "database_name": "research_docs",
    "environment": "production",
    "is_active": true,
    "created_at": "2024-02-01T14:20:00Z",
    "request_count": 487
  }
]
Empty Response (200 OK)

[]
Response Fields
Field	Type	Description
database_id	string	Unique identifier for the database
database_name	string	Name of the database
environment	string	Environment scope of the database
is_active	boolean	Whether the database is active
created_at	string	ISO 8601 timestamp of creation
request_count	integer	Number of queries made to this database
Notes
This list is limited to 1,000 databases. If you need a higher count, please contact us at support@runcaptain.com or call us at +1 (260) CAP-TAIN
Only databases in the same environment as your API key are returned (development keys only see development databases, etc.)
List Files
Retrieves all indexed files in a specific database, with pagination support.

Endpoint
POST /v1/list-files
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Name of the database to list files from
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
limit	integer	No	Maximum number of files to return (default: 100)
offset	integer	No	Offset for pagination (default: 0)
Request Example
import requests

response = requests.post(
    "https://api.runcaptain.com/v1/list-files",
    data={
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'database_name': 'contracts_2024',
        'limit': 50,
        'offset': 0
    }
)

print(response.json())
Response
Success (200 OK)

[
  {
    "file_id": "0199bc97-212f-729a-9c0b-cc23f21e0995",
    "file_name": "Acme_Corp_Contract.pdf",
    "chunk_id": "chunk_abc123",
    "chunk_index": 0,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "file_id": "0199bc97-212f-729a-9c0b-cc23f21e0995",
    "file_name": "Acme_Corp_Contract.pdf",
    "chunk_id": "chunk_def456",
    "chunk_index": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "file_id": "0199bc97-20c9-770e-95f9-3fee32ab9b14",
    "file_name": "Beta_Industries_Contract.pdf",
    "chunk_id": "chunk_ghi789",
    "chunk_index": 0,
    "created_at": "2024-01-16T14:20:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
]
Empty Response (200 OK)

[]
Response Fields
Field	Type	Description
file_id	string	Unique identifier for the file
file_name	string	Name of the file
chunk_id	string	Unique identifier for this chunk
chunk_index	integer	Index of the chunk within the file (0-based)
created_at	string	ISO 8601 timestamp when the file was indexed
updated_at	string	ISO 8601 timestamp when the file was last updated
Notes
Files are returned ordered by file name (ascending), then by chunk index
Each chunk of a file appears as a separate entry in the response
Large files may be split into multiple chunks, which is why the same file may appear multiple times with different chunk_index values
Only non-deleted files are returned
Results are scoped to your organization and the environment of your API key
Delete File
Soft delete a specific file from a database. The file is marked as deleted but the data is preserved.

Endpoint
POST /v1/delete-file
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Name of the database containing the file
file_id	string	Yes	ID of the file to delete
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests

response = requests.post(
    "https://api.runcaptain.com/v1/delete-file",
    data={
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'database_name': 'contracts_2024',
        'file_id': '0199bc97-212f-729a-9c0b-cc23f21e0995'
    }
)

print(response.json())
Response
Success (200 OK)

{
  "success": true,
  "message": "File deleted successfully"
}
Error (404 Not Found)

{
  "success": false,
  "message": "File not found or already deleted"
}
Error (401 Unauthorized)

{
  "success": false,
  "message": "Invalid API key"
}
Notes
This is a soft delete operation - the file is marked as is_deleted=true but the data is preserved
Deleted files will not appear in /list-files responses
Deleted files will not be included in query results
The file cannot be undeleted through the API (contact support if needed)
All chunks associated with the file are deleted
Results are scoped to your organization and the environment of your API key
Index S3 Bucket
Start indexing all files from an S3 bucket into your database.

Note: You'll need AWS credentials to access your S3 bucket. See the Cloud Storage Credentials Guide for step-by-step instructions on obtaining AWS Access Keys.

Endpoint
POST /v1/index-s3
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Target database name
bucket_name	string	Yes	S3 bucket name
aws_access_key_id	string	Yes	AWS access key ID
aws_secret_access_key	string	Yes	AWS secret access key (URL-encoded)
bucket_region	string	Yes	S3 bucket region (e.g., us-east-1)
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests
from urllib.parse import quote

aws_secret = "your_aws_secret_key"
aws_secret_encoded = quote(aws_secret, safe='')

response = requests.post(
    "https://api.runcaptain.com/v1/index-s3",
    data={
        'database_name': 'contracts_2024',
        'bucket_name': 'my-company-docs',
        'aws_access_key_id': 'AKIAIOSFODNN7EXAMPLE',
        'aws_secret_access_key': aws_secret_encoded,
        'bucket_region': 'us-east-1',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2'
    },
    timeout=30.0
)

print(response.json())
Response
Success (200/201)

{
  "job_id": "job_abc123xyz",
  "status": "processing",
  "message": "Indexing job started successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
Error (400 Bad Request)

{
  "status": "error",
  "message": "Unsupported file type detected",
  "details": "File 'video.mp4' is not supported"
}
Indexing Behavior
Important: This endpoint wipes all previously indexed files from the database and then indexes all files from the bucket.

Environment Scoping
Only databases in the same environment as your API key can be indexed (development keys can only index into development databases, etc.)
Indexed files are scoped to the environment of the API key used
Supported File Types
Captain uses an allow-list for supported file types:

Documents

PDF (.pdf) - Up to 512MB with automatic page chunking
Microsoft Word (.docx)
Text files (.txt)
Markdown (.md)
Spreadsheets & Data

Microsoft Excel (.xlsx, .xls) - With intelligent row-based chunking
CSV (.csv) - With header preservation across chunks
JSON (.json)
Presentations

Microsoft PowerPoint (.pptx, .ppt)
Images (with OCR and Computer Vision support)

JPEG (.jpg, .jpeg)
PNG (.png)
BMP (.bmp) (Experimental)
GIF (.gif) (Experimental)
TIFF (.tiff) (Experimental)
Code

Python (.py)
TypeScript (.ts)
JavaScript (.js)
HTML (.html)
CSS (.css)
PHP (.php)
Java (.java)
Unsupported types (.mov, .mp4, .avi, etc.) will individually fail but the rest of the files will be indexed.

Index S3 File
Index a single file from an S3 bucket into your database.

Note: You'll need AWS credentials to access your S3 bucket. See the Cloud Storage Credentials Guide for step-by-step instructions on obtaining AWS Access Keys.

Endpoint
POST /v1/index-s3-file
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Target database name
bucket_name	string	Yes	S3 bucket name
file_uri	string	Yes	S3 URI of the file (format: s3://bucket-name/path/to/file.pdf)
aws_access_key_id	string	Yes	AWS access key ID
aws_secret_access_key	string	Yes	AWS secret access key (URL-encoded)
bucket_region	string	Yes	S3 bucket region (e.g., us-east-1)
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests
from urllib.parse import quote

aws_secret = "your_aws_secret_key"
aws_secret_encoded = quote(aws_secret, safe='')

response = requests.post(
    "https://api.runcaptain.com/v1/index-s3-file",
    data={
        'database_name': 'contracts_2024',
        'bucket_name': 'my-company-docs',
        'file_uri': 's3://my-company-docs/contracts/acme_contract.pdf',
        'aws_access_key_id': 'AKIAIOSFODNN7EXAMPLE',
        'aws_secret_access_key': aws_secret_encoded,
        'bucket_region': 'us-east-1',
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2'
    },
    timeout=30.0
)

print(response.json())
Response
Success (200/201)

{
  "job_id": "job_xyz789abc",
  "status": "processing",
  "message": "Indexing job started successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
Error (400 Bad Request)

{
  "status": "error",
  "message": "Invalid S3 URI format",
  "details": "S3 URI must start with 's3://' and include bucket and file path"
}
Notes
The file_uri must be a valid S3 URI in the format s3://bucket-name/path/to/file.ext
The bucket name in the URI must match the bucket_name parameter
If the file already exists in the database, it will be replaced
Supported file types are the same as the Index S3 Bucket endpoint
Only databases in the same environment as your API key can be indexed (development keys can only index into development databases, etc.)
Index GCS Bucket
Start indexing all files from a Google Cloud Storage bucket into your database.

Note: You'll need a GCS Service Account JSON key to access your bucket. See the Cloud Storage Credentials Guide for step-by-step instructions on obtaining service account credentials.

Endpoint
POST /v1/index-gcs
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Target database name
bucket_name	string	Yes	GCS bucket name
service_account_json	string	Yes	Service Account JSON credentials (as string)
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests
import json

# Load service account JSON
with open('path/to/service-account-key.json', 'r') as f:
    service_account_json = f.read()

response = requests.post(
    "https://api.runcaptain.com/v1/index-gcs",
    data={
        'database_name': 'contracts_2024',
        'bucket_name': 'my-company-docs',
        'service_account_json': service_account_json,
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2'
    },
    timeout=30.0
)

print(response.json())
Response
Success (200/201)

{
  "job_id": "job_gcs_abc123xyz",
  "status": "processing",
  "message": "Indexing job started for GCS bucket 'my-company-docs'",
  "timestamp": "2024-01-15T10:30:00Z"
}
Error (400 Bad Request)

{
  "status": "error",
  "message": "Invalid service account JSON",
  "details": "Missing required fields: type, project_id, private_key"
}
Indexing Behavior
Important: This endpoint wipes all previously indexed files from the database and then indexes all files from the bucket.

Service Account Requirements
Your service account needs the following minimum IAM permission:

Storage Object Viewer (roles/storage.objectViewer)
This role grants: - storage.objects.list - List objects in the bucket - storage.objects.get - Read object data

Environment Scoping
Only databases in the same environment as your API key can be indexed (development keys can only index into development databases, etc.)
Indexed files are scoped to the environment of the API key used
Supported File Types
Same file types as the S3 indexing endpoints (see Index S3 Bucket for the full list).

Index GCS File
Index a single file from a Google Cloud Storage bucket into your database.

Note: You'll need a GCS Service Account JSON key to access your bucket. See the Cloud Storage Credentials Guide for step-by-step instructions on obtaining service account credentials.

Endpoint
POST /v1/index-gcs-file
Parameters
Parameter	Type	Required	Description
database_name	string	Yes	Target database name
bucket_name	string	Yes	GCS bucket name
file_uri	string	Yes	GCS URI of the file (format: gs://bucket-name/path/to/file.pdf)
service_account_json	string	Yes	Service Account JSON credentials (as string)
api_key	string	Yes	Your Captain API key
organization_id	string	Yes	Your organization UUID
Request Example
import requests
import json

# Load service account JSON
with open('path/to/service-account-key.json', 'r') as f:
    service_account_json = f.read()

response = requests.post(
    "https://api.runcaptain.com/v1/index-gcs-file",
    data={
        'database_name': 'contracts_2024',
        'bucket_name': 'my-company-docs',
        'file_uri': 'gs://my-company-docs/contracts/acme_contract.pdf',
        'service_account_json': service_account_json,
        'api_key': 'cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd',
        'organization_id': '01999eb7-8554-5c7b-6321-066454166af2'
    },
    timeout=30.0
)

print(response.json())
Response
Success (200/201)

{
  "job_id": "job_gcs_file_xyz789abc",
  "status": "processing",
  "message": "Single file indexing job started for GCS file 'contracts/acme_contract.pdf'",
  "timestamp": "2024-01-15T10:30:00Z"
}
Error (400 Bad Request)

{
  "status": "error",
  "message": "Invalid GCS URI format",
  "details": "GCS URI must start with 'gs://' and include bucket and file path"
}
Notes
The file_uri must be a valid GCS URI in the format gs://bucket-name/path/to/file.ext
The bucket name in the URI must match the bucket_name parameter
If the file already exists in the database, it will be replaced
Supported file types are the same as the Index GCS Bucket endpoint
Only databases in the same environment as your API key can be indexed (development keys can only index into development databases, etc.)
Check Indexing Status
Retrieves the status of an indexing job. Polling this endpoint is the recommended way to check the status of an indexing job.

Endpoint
GET /v1/indexing-status/{job_id}
Parameters
Path Parameters:

Parameter	Type	Required	Description
job_id	string	Yes	Job ID returned from index-all endpoint
Request Example
import requests

job_id = "job_abc123xyz"

headers = {
    "Authorization": "Bearer cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd",
    "Content-Type": "application/json"
}

response = requests.get(
    f"https://api.runcaptain.com/v1/indexing-status/{job_id}",
    headers=headers
)

print(response.json())
Response
In Progress

{
  "job_id": "job_abc123xyz",
  "status": "processing",
  "completed": false,
  "active_file_processing_workers": 8,
  "timestamp": "2024-01-15T10:35:00Z",
  "job_details": {
    "job_name": "index_contracts_2024",
    "total_files": 1000,
    "indexed_files": 342,
    "failed_files": 3
  }
}
Completed

{
  "job_id": "job_abc123xyz",
  "status": "completed",
  "completed": true,
  "active_file_processing_workers": 0,
  "timestamp": "2024-01-15T11:05:00Z",
  "job_details": {
    "job_name": "index_contracts_2024",
    "total_files": 1000,
    "indexed_files": 997,
    "failed_files": 3
  }
}
Error

{
  "job_id": "job_abc123xyz",
  "status": "error",
  "completed": true,
  "error": "AWS credentials invalid",
  "timestamp": "2024-01-15T10:32:00Z"
}
Polling Recommendations
Poll every 3 seconds (industry standard)
Check for completed: true or status: "completed", "error", or "failed"
Monitor active_file_processing_workers to gauge progress, although usually this just says 0 and then jumps to all at the end.
Calculate progress: (indexed_files + failed_files) / total_files * 100
Query Database
Query your indexed data using natural language.

Endpoint
POST /v1/query
Headers
Header	Required	Description
Authorization	Yes	Bearer token: Bearer {api_key}
Content-Type	Yes	Must be application/x-www-form-urlencoded
X-Organization-ID	Yes	Your organization UUID
Idempotency-Key	No	Unique UUID for request deduplication (recommended)
Parameters
Parameter	Type	Required	Description
query	string	Yes	Natural language query (URL-encoded)
database_name	string	Yes	Database to query
include_files	boolean	No	Include file metadata in response (default: false)
Request Example
import requests
import uuid
from urllib.parse import quote

query = "find Q3 contracts mentioning 'termination for convenience'"
idempotency_key = str(uuid.uuid7())

headers = {
    "Authorization": "Bearer cap_dev_NvXocMo6ZrqsVgAKR6ofIB8TtwbdSBfd",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Organization-ID": "01999eb7-8554-5c7b-6321-066454166af2"
    "Idempotency-Key": idempotency_key,
}

response = requests.post(
    "https://api.runcaptain.com/v1/query",
    headers=headers,
    data={
        'query': quote(query),
        'database_name': 'contracts_2024',
        'include_files': 'true'
    },
    timeout=120.0
)

print(response.json())
Response
Success (200 OK)

{
  "status": "success",
  "response": "Based on your Q3 contracts, three documents mention 'termination for convenience' clauses. The Acme Corp contract (Section 12.3) allows either party to terminate with 30 days notice. The Beta Industries agreement (Section 8.1) specifies 60 days notice for convenience termination...",
  "relevant_files": [
    {
      "file_name": "Acme_Corp_Q3_2024.pdf",
      "relevancy_score": 0.92,
      "file_type": "pdf",
      "file_id": "0199bc97-212f-729a-9c0b-cc23f21e0995"
    },
    {
      "file_name": "Beta_Industries_Contract.pdf",
      "relevancy_score": 0.87,
      "file_type": "pdf",
      "file_id": "0199bc97-20c9-770e-95f9-3fee32ab9b14"
    }
  ],
  "query": "find Q3 contracts mentioning 'termination for convenience'",
  "database_name": "contracts_2024",
  "processing_metrics": {
    "total_files_processed": 4,
    "total_tokens": 16308,
    "execution_time_ms": 1250
  }
}
Note: When include_files=false (default), the relevant_files array is omitted from the response to reduce payload size.

Response Fields
Field	Type	Description
status	string	Request status
response	string	Natural language answer to your query
relevant_files	array	Array of relevant file objects (if include_files: true)
query	string	Echo of your original query
database_name	string	Database that was queried
Relevant Files Object:

Field	Type	Description
file_name	string	Name of the file
relevancy_score	float	Relevancy score (0.0 - 1.0)
file_type	string	File extension/type (e.g., "pdf", "py", "docx")
file_id	string	Unique identifier for the file
Processing Metrics Object:

Field	Type	Description
total_files_processed	integer	Number of files analyzed
total_tokens	integer	Total tokens processed
execution_time_ms	integer	Query execution time in milliseconds
Notes
Query timeout is 120 seconds
The response field contains the answer with inline references
Idempotency-Key prevents duplicate processing of the same request (minimizing costs)
Only databases in the same environment as your API key can be queried (development keys can only query development databases, etc.)
Error Responses
All endpoints follow consistent error response formats:

400 Bad Request

{
  "status": "error",
  "message": "Invalid parameter: database_name is required"
}
401 Unauthorized

{
  "status": "error",
  "message": "Invalid or expired API key"
}
403 Forbidden

{
  "status": "error",
  "message": "API key does not belong to this organization"
}
404 Not Found

{
  "status": "error",
  "message": "Database not found"
}
500 Internal Server Error

{
  "status": "error",
  "message": "Internal server error",
  "details": "Contact support if this persists"
}
Rate Limits
Rate limits are applied per API key. Contact support for specific limits on your account.

Support
For API support, contact: support@runcaptain.com or call us at +1 (260) CAP-TAIN.

Made with Material for MkDocs
Tool Calling
Quick Start
Overview
Architecture
Examples
Python
TypeScript/JavaScript
Table of contents
What is Tool Calling?
Quick Example
Python
TypeScript (Vercel AI SDK)
How It Works
Tool Definition Format
Common Use Cases
API Call Tool
Database Query Tool
File Operation Tool
Best Practices
✅ Do This
❌ Don't Do This
Framework Support
Troubleshooting
Tool Not Being Called
Empty Tool Arguments
Tool Execution Errors
Next Steps
Get Help
Tool Calling Quick Start
Get started with Captain's tool calling in 5 minutes.

What is Tool Calling?
Tool calling (function calling) lets your AI use external functions like:

🧮 Perform calculations
🌐 Call APIs
💾 Query databases
📁 Read files
🔧 Execute custom code
Key Point: Tools execute on your side (client), not Captain's servers. You maintain full control.

Quick Example
Python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.runcaptain.com/v1",
    api_key="your_api_key",
    default_headers={"X-Organization-ID": "your_org_id"}
)

# Define your tool
tools = [{
    "type": "function",
    "function": {
        "name": "calculate",
        "description": "Perform arithmetic",
        "parameters": {
            "type": "object",
            "properties": {
                "operation": {"type": "string", "enum": ["add", "multiply"]},
                "a": {"type": "number"},
                "b": {"type": "number"}
            },
            "required": ["operation", "a", "b"]
        },
        "strict": True  # Required!
    }
}]

# Make request
response = client.chat.completions.create(
    model="captain-voyager-latest",
    messages=[{"role": "user", "content": "What is 50 times 3?"}],
    tools=tools
)

# Check if model wants to use tool
if response.choices[0].finish_reason == "tool_calls":
    import json
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)

    # Execute tool on your side
    if args["operation"] == "multiply":
        result = args["a"] * args["b"]
        print(f"Result: {result}")
TypeScript (Vercel AI SDK)
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';

const captain = createOpenAI({
  apiKey: process.env.CAPTAIN_API_KEY!,
  baseURL: 'https://api.runcaptain.com/v1',
  headers: { 'X-Organization-ID': process.env.CAPTAIN_ORG_ID! }
});

const result = await generateText({
  model: captain.chat('captain-voyager-latest'),
  messages: [
    { role: 'user', content: 'What is 50 times 3?' }
  ],
  tools: {
    calculate: {
      description: 'Perform arithmetic',
      parameters: z.object({
        operation: z.enum(['add', 'multiply']),
        a: z.number(),
        b: z.number()
      }),
      execute: async ({ operation, a, b }) => {
        // Execute on your side
        return operation === 'multiply' ? a * b : a + b;
      }
    }
  },
  maxSteps: 5  // Allow multiple tool calls
});

console.log(result.text);
How It Works
You define tools with names, descriptions, and parameters
Send request to Captain with tools
Captain returns tool call request (if needed)
You execute the tool in your environment
Continue conversation with results (optional)
graph LR
    A[Your App] -->|1. Request with tools| B[Captain API]
    B -->|2. Tool call needed| A
    A -->|3. Execute tool| C[Your Function]
    C -->|4. Return result| A
Tool Definition Format
Every tool needs:

{
    "type": "function",           # Always "function"
    "function": {
        "name": "tool_name",      # Unique name
        "description": "...",     # Clear description
        "parameters": {...},      # JSON Schema
        "strict": True            # REQUIRED!
    }
}
Common Use Cases
API Call Tool
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            },
            "required": ["city"]
        },
        "strict": True
    }
}]
Database Query Tool
tools = [{
    "type": "function",
    "function": {
        "name": "query_users",
        "description": "Query user database",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"}
            },
            "required": ["user_id"]
        },
        "strict": True
    }
}]
File Operation Tool
tools = [{
    "type": "function",
    "function": {
        "name": "read_file",
        "description": "Read file contents",
        "parameters": {
            "type": "object",
            "properties": {
                "filename": {"type": "string"}
            },
            "required": ["filename"]
        },
        "strict": True
    }
}]
Best Practices
✅ Do This
# Clear, specific descriptions
"description": "Calculate the sum of two numbers. Use for addition only."

# Strict parameter types
"parameters": {
    "type": "object",
    "properties": {
        "amount": {"type": "number"},
        "currency": {"type": "string", "enum": ["USD", "EUR"]}
    },
    "required": ["amount", "currency"]
}

# Validate inputs before execution
def execute_tool(name, args):
    if name not in ALLOWED_TOOLS:
        raise ValueError("Tool not allowed")
    return ALLOWED_TOOLS[name](**args)
❌ Don't Do This
# Vague description
"description": "Does stuff"

# Missing types
"parameters": {
    "type": "object",
    "properties": {
        "data": {}  # What type?
    }
}

# No input validation
def execute_tool(name, args):
    return eval(f"{name}(**{args})")  # Dangerous!
Framework Support
Framework	Status	Multi-Turn	Best For
OpenAI Python SDK	✅	Manual	Python apps
OpenAI Node.js SDK	✅	Manual	Node.js apps
Vercel AI SDK	✅	Auto (maxSteps)	Best DX
LangChain	✅	Via agents	Complex workflows
Recommendation: Use Vercel AI SDK for automatic multi-turn handling.

Troubleshooting
Tool Not Being Called
# Make description more explicit
"description": "ALWAYS use this tool for math. Never calculate manually."

# Strengthen system prompt
messages = [
    {
        "role": "system",
        "content": "You MUST use provided tools. Don't do calculations yourself."
    },
    {"role": "user", "content": "What is 5 + 3?"}
]
Empty Tool Arguments
# Check for missing args
args = json.loads(tool_call.function.arguments)
if not args.get("required_param"):
    # Provide default or skip
    args["required_param"] = "default"
Tool Execution Errors
# Wrap in try-catch
try:
    result = execute_tool(name, args)
except Exception as e:
    result = {"error": str(e)}
Next Steps
Full Tool Calling Guide - Complete documentation
Python Examples - More Python examples
TypeScript Examples - More TS/JS examples
Architecture Details - How it works internally
Get Help
📧 Email: support@runcaptain.com
📖 Docs: docs.runcaptain.com
🌐 Website: runcaptain.com