# Live Code Experiment Agent - MCP Server

🧠 **Captain-powered** code optimization, documentation generation, and GitHub repository analysis available as MCP tools.

## Overview

This MCP server exposes the Live Code Experiment Agent platform as three powerful tools that leverage Captain's unlimited context processing and our full AI stack.

## 🏆 Captain API Integration

Our MCP server is built around **Captain's unique capabilities**:
- **Unlimited Context Processing** - No token limits on code analysis
- **Tool Calling** - Structured optimization data extraction
- **Mathematical Precision** - Algorithmic complexity analysis
- **Cross-file Analysis** - Complete codebase understanding

## Tools Provided

### 1. `optimize_code` 🧠
**Captain-powered code optimization with performance analysis**

Analyzes code using Captain's unlimited context and generates optimized variants using our full AI stack (Captain → Morph → E2B).

**Parameters:**
- `code` (required): Code to optimize
- `language`: Programming language (default: python)
- `target`: Optimization target (default: performance)
- `variants`: Number of variants to generate (1-10, default: 5)

**Example:**
```json
{
  "code": "def fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)",
  "language": "python",
  "target": "performance",
  "variants": 3
}
```

### 2. `generate_from_docs` 🌐
**Documentation URL to code generation with unlimited context**

Scrapes documentation using Firecrawl and generates comprehensive code implementations using Captain's understanding.

**Parameters:**
- `documentation_urls` (required): Array of documentation URLs
- `requirements` (required): What to implement
- `target_language`: Target language (default: JavaScript)
- `implementation_style`: Style preference (simple/production/advanced)

**Example:**
```json
{
  "documentation_urls": ["https://docs.runcaptain.com/infinite-responses/"],
  "requirements": "Create a streaming client for infinite AI responses",
  "target_language": "JavaScript",
  "implementation_style": "production"
}
```

### 3. `analyze_github_repo` 📊
**Comprehensive GitHub repository analysis**

Analyzes entire GitHub repositories using Captain's unlimited context for optimization opportunities and architectural insights.

**Parameters:**
- `github_url` (required): GitHub repository URL
- `analysis_depth`: Analysis depth (quick/comprehensive/deep)
- `focus_areas`: Areas to focus on (default: ["performance", "algorithms", "complexity"])

**Example:**
```json
{
  "github_url": "https://github.com/facebook/react",
  "analysis_depth": "comprehensive",
  "focus_areas": ["performance", "algorithms", "security"]
}
```

## Installation & Setup

### 1. Install MCP Dependencies
```bash
pip install -r mcp_requirements.txt
```

### 2. Set Environment Variables
```bash
export CAPTAIN_API_KEY="your-captain-api-key"
export CAPTAIN_ORG_ID="your-captain-org-id"
export MORPH_API_KEY="your-morph-api-key"
export METORIAL_API_KEY="your-metorial-api-key"
export E2B_API_KEY="your-e2b-api-key"
# ... other environment variables
```

### 3. Add to Claude Desktop Configuration

Add this to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "live-code-experiment-agent": {
      "command": "python",
      "args": ["/path/to/yc-agent-jam/mcp_server.py"],
      "env": {
        "CAPTAIN_API_KEY": "your-captain-api-key",
        "CAPTAIN_ORG_ID": "your-captain-org-id"
      }
    }
  }
}
```

### 4. Test the MCP Server

```bash
# Test the server directly
python mcp_server.py

# Or use MCP inspector
npx @modelcontextprotocol/inspector python mcp_server.py
```

## Usage Examples

### Code Optimization
```
Use the optimize_code tool to optimize this Python code:
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
```
Target: performance, generate 3 variants
```

### Documentation to Code
```
Use generate_from_docs to create a streaming API client from:
- URL: https://docs.runcaptain.com/infinite-responses/
- Requirements: Create a TypeScript client with error handling and retry logic
- Style: production
```

### GitHub Analysis
```
Use analyze_github_repo to analyze:
- Repository: https://github.com/microsoft/vscode
- Depth: comprehensive
- Focus: performance and algorithms
```

## AI Stack Integration

Our MCP server leverages the complete Live Code Experiment Agent stack:

```
Captain (unlimited context analysis)
    ↓
Morph (code generation)
    ↓  
E2B (real execution testing)
    ↓
Metorial + Exa (research augmentation)
    ↓
Firecrawl (documentation scraping)
```

## Benefits for MCP Users

### 🧠 **Captain's Unique Advantages**
- **No Token Limits**: Analyze entire codebases, not just snippets
- **Mathematical Precision**: Big O complexity analysis with proof
- **Tool Calling**: Structured, actionable optimization data
- **Cross-file Insights**: Architectural pattern detection

### ⚡ **Production-Ready Results**
- Real performance testing with E2B sandboxes
- Research-augmented optimizations via Metorial
- Complete documentation understanding
- Ready-to-use code implementations

### 🔧 **Enterprise Integration**
- Works with Claude Desktop out of the box
- Can be integrated into any MCP-compatible tool
- Preserves all original platform functionality
- Scalable and reliable architecture

## Technical Architecture

```
MCP Client (Claude Desktop, etc.)
    ↓ (JSON-RPC)
MCP Server (Live Code Experiment Agent)
    ↓
Service Layer (Captain, Morph, E2B, etc.)
    ↓  
AI APIs & Execution Environments
```

The MCP server acts as a bridge, exposing our Captain-powered optimization platform to any MCP-compatible client while maintaining the full functionality of the original web platform.

## Development

The MCP server is designed to run alongside the existing web platform without conflicts:

- **Port Separation**: Web app (8000), MCP server (stdio)
- **Shared Services**: Both use the same underlying AI services
- **Environment Isolation**: Separate configuration files
- **Concurrent Operation**: Can run both simultaneously

## Support

This MCP server showcases Captain's unlimited context processing capabilities and demonstrates best practices for integrating advanced AI capabilities into MCP tools.

For issues or questions, refer to the main Live Code Experiment Agent documentation.

---

**🏆 Built for YC Agent Jam 2024 - Best Use of Captain API**