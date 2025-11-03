Firecrawl MCP Server

Copy page

Use Firecrawl’s API through the Model Context Protocol

A Model Context Protocol (MCP) server implementation that integrates Firecrawl for web scraping capabilities. Our MCP server is open-source and available on GitHub.
​
Features
Web scraping, crawling, and discovery
Search and content extraction
Deep research and batch scraping
Cloud and self-hosted support
Streamable HTTP support
​
Installation
You can either use our remote hosted URL or run the server locally. Get your API key from https://firecrawl.dev/app/api-keys
​
Remote hosted URL

Copy

Ask AI
https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp
​
Running with npx

Copy

Ask AI
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
​
Manual Installation

Copy

Ask AI
npm install -g firecrawl-mcp
​
Running on Cursor
Add Firecrawl MCP server to Cursor
​
Manual Installation
Configuring Cursor 🖥️ Note: Requires Cursor version 0.45.6+ For the most up-to-date configuration instructions, please refer to the official Cursor documentation on configuring MCP servers: Cursor MCP Server Configuration Guide
To configure Firecrawl MCP in Cursor v0.48.6
Open Cursor Settings
Go to Features > MCP Servers
Click ”+ Add new global MCP server”
Enter the following code:

Copy

Ask AI
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
To configure Firecrawl MCP in Cursor v0.45.6
Open Cursor Settings
Go to Features > MCP Servers
Click ”+ Add New MCP Server”
Enter the following:
Name: “firecrawl-mcp” (or your preferred name)
Type: “command”
Command: env FIRECRAWL_API_KEY=your-api-key npx -y firecrawl-mcp
If you are using Windows and are running into issues, try cmd /c "set FIRECRAWL_API_KEY=your-api-key && npx -y firecrawl-mcp"
Replace your-api-key with your Firecrawl API key. If you don’t have one yet, you can create an account and get it from https://www.firecrawl.dev/app/api-keys
After adding, refresh the MCP server list to see the new tools. The Composer Agent will automatically use Firecrawl MCP when appropriate, but you can explicitly request it by describing your web scraping needs. Access the Composer via Command+L (Mac), select “Agent” next to the submit button, and enter your query.
​
Running on Windsurf
Add this to your ./codeium/windsurf/model_config.json:

Copy

Ask AI
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
​
Running with Streamable HTTP Mode
To run the server using streamable HTTP transport locally instead of the default stdio transport:

Copy

Ask AI
env HTTP_STREAMABLE_SERVER=true FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
Use the url: http://localhost:3000/v2/mcp or https://mcp.firecrawl.dev/{FIRECRAWL_API_KEY}/v2/mcp
​
Installing via Smithery (Legacy)
To install Firecrawl for Claude Desktop automatically via Smithery:

Copy

Ask AI
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
​
Running on VS Code
For one-click installation, click one of the install buttons below…
Install with NPX in VS CodeInstall with NPX in VS Code Insiders
For manual installation, add the following JSON block to your User Settings (JSON) file in VS Code. You can do this by pressing Ctrl + Shift + P and typing Preferences: Open User Settings (JSON).

Copy

Ask AI
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apiKey",
        "description": "Firecrawl API Key",
        "password": true
      }
    ],
    "servers": {
      "firecrawl": {
        "command": "npx",
        "args": ["-y", "firecrawl-mcp"],
        "env": {
          "FIRECRAWL_API_KEY": "${input:apiKey}"
        }
      }
    }
  }
}
Optionally, you can add it to a file called .vscode/mcp.json in your workspace. This will allow you to share the configuration with others:

Copy

Ask AI
{
  "inputs": [
    {
      "type": "promptString",
      "id": "apiKey",
      "description": "Firecrawl API Key",
      "password": true
    }
  ],
  "servers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${input:apiKey}"
      }
    }
  }
}
Note: Some users have reported issues when adding the MCP server to VS Code due to how it validates JSON with an outdated schema format (microsoft/vscode#155379). This affects several MCP tools, including Firecrawl.
Workaround: Disable JSON validation in VS Code to allow the MCP server to load properly.
See reference: directus/directus#25906 (comment).
The MCP server still works fine when invoked via other extensions, but the issue occurs specifically when registering it directly in the MCP server list. We plan to add guidance once VS Code updates their schema validation.
​
Running on Claude Desktop
Add this to the Claude config file:

Copy

Ask AI
{
  "mcpServers": {
    "firecrawl": {
      "url": "https://mcp.firecrawl.dev/v2/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
​
Running on Claude Code
Add the Firecrawl MCP server using the Claude Code CLI:

Copy

Ask AI
claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-api-key -- npx -y firecrawl-mcp
​
Running on n8n
To connect the Firecrawl MCP server in n8n:
Get your Firecrawl API key from https://firecrawl.dev/app/api-keys
In your n8n workflow, add an AI Agent node
In the AI Agent configuration, add a new Tool
Select MCP Client Tool as the tool type
Enter the MCP server Endpoint (replace {YOUR_FIRECRAWL_API_KEY} with your actual API key):

Copy

Ask AI
https://mcp.firecrawl.dev/{YOUR_FIRECRAWL_API_KEY}/v2/mcp
Set Server Transport to HTTP Streamable
Set Authentication to None
For Tools to include, you can select All, Selected, or All Except - this will expose the Firecrawl tools (scrape, crawl, map, search, extract, etc.)
For self-hosted deployments, run the MCP server with npx and enable HTTP transport mode:

Copy

Ask AI
env HTTP_STREAMABLE_SERVER=true \
    FIRECRAWL_API_KEY=fc-YOUR_API_KEY \
    FIRECRAWL_API_URL=YOUR_FIRECRAWL_INSTANCE \
    npx -y firecrawl-mcp
This will start the server on http://localhost:3000/v2/mcp which you can use in your n8n workflow as Endpoint. The HTTP_STREAMABLE_SERVER=true environment variable is required since n8n needs HTTP transport.
​
Configuration
​
Environment Variables
​
Required for Cloud API
FIRECRAWL_API_KEY: Your Firecrawl API key
Required when using cloud API (default)
Optional when using self-hosted instance with FIRECRAWL_API_URL
FIRECRAWL_API_URL (Optional): Custom API endpoint for self-hosted instances
Example: https://firecrawl.your-domain.com
If not provided, the cloud API will be used (requires API key)
​
Optional Configuration
Retry Configuration
FIRECRAWL_RETRY_MAX_ATTEMPTS: Maximum number of retry attempts (default: 3)
FIRECRAWL_RETRY_INITIAL_DELAY: Initial delay in milliseconds before first retry (default: 1000)
FIRECRAWL_RETRY_MAX_DELAY: Maximum delay in milliseconds between retries (default: 10000)
FIRECRAWL_RETRY_BACKOFF_FACTOR: Exponential backoff multiplier (default: 2)
Credit Usage Monitoring
FIRECRAWL_CREDIT_WARNING_THRESHOLD: Credit usage warning threshold (default: 1000)
FIRECRAWL_CREDIT_CRITICAL_THRESHOLD: Credit usage critical threshold (default: 100)
​
Configuration Examples
For cloud API usage with custom retry and credit monitoring:

Copy

Ask AI
# Required for cloud API
export FIRECRAWL_API_KEY=your-api-key

# Optional retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5        # Increase max retry attempts
export FIRECRAWL_RETRY_INITIAL_DELAY=2000    # Start with 2s delay
export FIRECRAWL_RETRY_MAX_DELAY=30000       # Maximum 30s delay
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3      # More aggressive backoff

# Optional credit monitoring
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000    # Warning at 2000 credits
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500    # Critical at 500 credits
For self-hosted instance:

Copy

Ask AI
# Required for self-hosted
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# Optional authentication for self-hosted
export FIRECRAWL_API_KEY=your-api-key  # If your instance requires auth

# Custom retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500     # Start with faster retries
​
Custom configuration with Claude Desktop
Add this to your claude_desktop_config.json:

Copy

Ask AI
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY_HERE",

        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",

        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500"
      }
    }
  }
}
​
System Configuration
The server includes several configurable parameters that can be set via environment variables. Here are the default values if not configured:

Copy

Ask AI
const CONFIG = {
  retry: {
    maxAttempts: 3, // Number of retry attempts for rate-limited requests
    initialDelay: 1000, // Initial delay before first retry (in milliseconds)
    maxDelay: 10000, // Maximum delay between retries (in milliseconds)
    backoffFactor: 2, // Multiplier for exponential backoff
  },
  credit: {
    warningThreshold: 1000, // Warn when credit usage reaches this level
    criticalThreshold: 100, // Critical alert when credit usage reaches this level
  },
};
These configurations control:
Retry Behavior
Automatically retries failed requests due to rate limits
Uses exponential backoff to avoid overwhelming the API
Example: With default settings, retries will be attempted at:
1st retry: 1 second delay
2nd retry: 2 seconds delay
3rd retry: 4 seconds delay (capped at maxDelay)
Credit Usage Monitoring
Tracks API credit consumption for cloud API usage
Provides warnings at specified thresholds
Helps prevent unexpected service interruption
Example: With default settings:
Warning at 1000 credits remaining
Critical alert at 100 credits remaining
​
Rate Limiting and Batch Processing
The server utilizes Firecrawl’s built-in rate limiting and batch processing capabilities:
Automatic rate limit handling with exponential backoff
Efficient parallel processing for batch operations
Smart request queuing and throttling
Automatic retries for transient errors
​
Available Tools
​
1. Scrape Tool (firecrawl_scrape)
Scrape content from a single URL with advanced options.

Copy

Ask AI
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
​
2. Batch Scrape Tool (firecrawl_batch_scrape)
Scrape multiple URLs efficiently with built-in rate limiting and parallel processing.

Copy

Ask AI
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
Response includes operation ID for status checking:

Copy

Ask AI
{
  "content": [
    {
      "type": "text",
      "text": "Batch operation queued with ID: batch_1. Use firecrawl_check_batch_status to check progress."
    }
  ],
  "isError": false
}
​
3. Check Batch Status (firecrawl_check_batch_status)
Check the status of a batch operation.

Copy

Ask AI
{
  "name": "firecrawl_check_batch_status",
  "arguments": {
    "id": "batch_1"
  }
}
​
4. Map Tool (firecrawl_map)
Map a website to discover all indexed URLs on the site.

Copy

Ask AI
{
  "name": "firecrawl_map",
  "arguments": {
    "url": "https://example.com",
    "search": "blog",
    "sitemap": "include",
    "includeSubdomains": false,
    "limit": 100,
    "ignoreQueryParameters": true
  }
}
​
Map Tool Options:
url: The base URL of the website to map
search: Optional search term to filter URLs
sitemap: Control sitemap usage - “include”, “skip”, or “only”
includeSubdomains: Whether to include subdomains in the mapping
limit: Maximum number of URLs to return
ignoreQueryParameters: Whether to ignore query parameters when mapping
Best for: Discovering URLs on a website before deciding what to scrape; finding specific sections of a website. Returns: Array of URLs found on the site.
​
5. Search Tool (firecrawl_search)
Search the web and optionally extract content from search results.

Copy

Ask AI
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "your search query",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
​
6. Crawl Tool (firecrawl_crawl)
Start an asynchronous crawl with advanced options.

Copy

Ask AI
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
​
7. Check Crawl Status (firecrawl_check_crawl_status)
Check the status of a crawl job.

Copy

Ask AI
{
  "name": "firecrawl_check_crawl_status",
  "arguments": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
Returns: Status and progress of the crawl job, including results if available.
​
8. Extract Tool (firecrawl_extract)
Extract structured information from web pages using LLM capabilities. Supports both cloud AI and self-hosted LLM extraction.

Copy

Ask AI
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "Extract product information including name, price, and description",
    "systemPrompt": "You are a helpful assistant that extracts product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
Example response:

Copy

Ask AI
{
  "content": [
    {
      "type": "text",
      "text": {
        "name": "Example Product",
        "price": 99.99,
        "description": "This is an example product description"
      }
    }
  ],
  "isError": false
}
​
Extract Tool Options:
urls: Array of URLs to extract information from
prompt: Custom prompt for the LLM extraction
systemPrompt: System prompt to guide the LLM
schema: JSON schema for structured data extraction
allowExternalLinks: Allow extraction from external links
enableWebSearch: Enable web search for additional context
includeSubdomains: Include subdomains in extraction
When using a self-hosted instance, the extraction will use your configured LLM. For cloud API, it uses Firecrawl’s managed LLM service.
​
Logging System
The server includes comprehensive logging:
Operation status and progress
Performance metrics
Credit usage monitoring
Rate limit tracking
Error conditions
Example log messages:

Copy

Ask AI
[INFO] Firecrawl MCP Server initialized successfully
[INFO] Starting scrape for URL: https://example.com
[INFO] Batch operation queued with ID: batch_1
[WARNING] Credit usage has reached warning threshold
[ERROR] Rate limit exceeded, retrying in 2s...
​
Error Handling
The server provides robust error handling:
Automatic retries for transient errors
Rate limit handling with backoff
Detailed error messages
Credit usage warnings
Network resilience
Example error response:

Copy

Ask AI
{
  "content": [
    {
      "type": "text",
      "text": "Error: Rate limit exceeded. Retrying in 2 seconds..."
    }
  ],
  "isError": true
}
​
Development

Copy

Ask AI
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
​
Contributing
Fork the repository
Create your feature branch
Run tests: npm test
Submit a pull request
​
Thanks to contributors
Thanks to @vrknetha, @cawstudios for the initial implementation!
Thanks to MCP.so and Klavis AI for hosting and @gstarwd, @xiangkaiz and @zihaolin96 for integrating our server.
​
