e2b-mcp-serverOfficial
by e2b-dev
Code Execution
Developer Tools
Shell Access
JavaScript
Apache 2.0
339
Need Help?
View Source Code
Report Issue
E2B MCP Server (Python)
A Model Context Protocol server for running code in a secure sandbox by E2B.

Development
Install dependencies:

uv install

Installation
To use with Claude Desktop, add the server config:

On MacOS: ~/Library/Application Support/Claude/claude_desktop_config.json On Windows: %APPDATA%/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "e2b-mcp-server": {
      "command": "uvx",
      "args": ["e2b-mcp-server"],
      "env": { "E2B_API_KEY": "${e2bApiKey}" }
    }
  }
}