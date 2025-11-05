"""
Live Code Experiment Agent - MCP Server
=======================================

Exposes the Live Code Experiment Agent platform as MCP tools for integration
with other AI systems and tools like Claude Desktop.

Tools provided:
1. optimize_code - Captain-powered code optimization with variants
2. generate_from_docs - Documentation URL to code generation  
3. analyze_github_repo - GitHub repository analysis with optimization recommendations

All tools leverage Captain's unlimited context processing and our full AI stack.
"""

import asyncio
import json
import sys
from typing import Any, Dict, List
import logging

# Import MCP types
from mcp import types
from mcp.server import Server
from mcp.server.stdio import stdio_server

# Import our services
from services.captain_service import CaptainService
from services.morph_service import MorphService
from services.metorial_service import MetorialService
from services.e2b_service import E2BService
from services.firecrawl_service import FirecrawlService
from services.github_service import GitHubService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("live-code-experiment-mcp")

class LiveCodeExperimentMCP:
    """MCP Server for Live Code Experiment Agent"""
    
    def __init__(self):
        # Initialize all our services
        self.captain_service = CaptainService()
        self.morph_service = MorphService()
        self.metorial_service = MetorialService()
        self.e2b_service = E2BService()
        self.firecrawl_service = FirecrawlService()
        self.github_service = GitHubService()
        
        logger.info("🚀 Live Code Experiment Agent MCP Server initialized")
        logger.info("🧠 Captain + ⚡ Morph + 🔍 Metorial + 🚀 E2B + 🌐 Firecrawl")

# Create the MCP server
app = Server("live-code-experiment-agent")
experiment_agent = LiveCodeExperimentMCP()

@app.list_tools()
async def list_tools() -> List[types.Tool]:
    """List all available tools"""
    return [
        types.Tool(
            name="optimize_code",
            description="🧠 Captain-powered code optimization with performance analysis and variant generation. Uses unlimited context processing to analyze and optimize code with mathematical precision.",
            inputSchema={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "The code to optimize (any language supported)"
                    },
                    "language": {
                        "type": "string", 
                        "description": "Programming language (e.g., python, javascript, java, cpp)",
                        "default": "python"
                    },
                    "target": {
                        "type": "string",
                        "description": "Optimization target (performance, memory, readability, security)",
                        "default": "performance"
                    },
                    "variants": {
                        "type": "integer",
                        "description": "Number of optimized variants to generate (1-10)",
                        "default": 5,
                        "minimum": 1,
                        "maximum": 10
                    }
                },
                "required": ["code"]
            }
        ),
        types.Tool(
            name="generate_from_docs",
            description="🌐 Generate code implementations from documentation URLs using Captain's unlimited context analysis. Scrapes documentation and creates comprehensive code examples in your target language.",
            inputSchema={
                "type": "object",
                "properties": {
                    "documentation_urls": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "URLs of documentation to analyze and generate code from"
                    },
                    "requirements": {
                        "type": "string",
                        "description": "What you want to implement based on the documentation"
                    },
                    "target_language": {
                        "type": "string",
                        "description": "Target programming language for generated code",
                        "default": "JavaScript"
                    },
                    "implementation_style": {
                        "type": "string",
                        "description": "Implementation style preference",
                        "enum": ["simple", "production", "advanced"],
                        "default": "production"
                    }
                },
                "required": ["documentation_urls", "requirements"]
            }
        ),
        types.Tool(
            name="analyze_github_repo",
            description="📊 Comprehensive GitHub repository analysis with Captain's unlimited context processing. Analyzes entire codebases for optimization opportunities, algorithmic patterns, and generates optimization recommendations.",
            inputSchema={
                "type": "object",
                "properties": {
                    "github_url": {
                        "type": "string",
                        "description": "GitHub repository URL to analyze"
                    },
                    "analysis_depth": {
                        "type": "string",
                        "description": "Depth of analysis to perform",
                        "enum": ["quick", "comprehensive", "deep"],
                        "default": "comprehensive"
                    },
                    "focus_areas": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Areas to focus analysis on",
                        "default": ["performance", "algorithms", "complexity"]
                    }
                },
                "required": ["github_url"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle tool calls"""
    
    try:
        if name == "optimize_code":
            return await handle_optimize_code(arguments)
        elif name == "generate_from_docs":
            return await handle_generate_from_docs(arguments)
        elif name == "analyze_github_repo":
            return await handle_analyze_github_repo(arguments)
        else:
            return [types.TextContent(
                type="text",
                text=f"❌ Unknown tool: {name}"
            )]
    
    except Exception as e:
        logger.error(f"❌ Error in tool {name}: {str(e)}")
        return [types.TextContent(
            type="text", 
            text=f"❌ Error executing {name}: {str(e)}"
        )]

async def handle_optimize_code(arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle code optimization requests"""
    code = arguments.get("code", "")
    language = arguments.get("language", "python")
    target = arguments.get("target", "performance")
    variants_count = arguments.get("variants", 5)
    
    if not code.strip():
        return [types.TextContent(
            type="text",
            text="❌ Error: Code cannot be empty"
        )]
    
    logger.info(f"🧠 Optimizing {language} code with Captain (target: {target}, variants: {variants_count})")
    
    try:
        # Step 1: Analyze with Captain
        analysis = await experiment_agent.captain_service.analyze_code(code, language, target)
        
        # Step 2: Research with Metorial  
        research = await experiment_agent.metorial_service.research_optimizations(
            language, target, analysis.get("patterns", [])
        )
        
        # Step 3: Generate variants with Morph
        variants = []
        for i in range(min(variants_count, 10)):
            variant = await experiment_agent.morph_service.generate_variant(
                code, analysis, research, i + 1
            )
            variant["id"] = i + 1
            variants.append(variant)
        
        # Step 4: Test with E2B (sample)
        if variants:
            execution_result = await experiment_agent.e2b_service.execute_code(
                variants[0]["code"], language
            )
            variants[0]["performance"] = execution_result
        
        # Format results
        result_text = f"""🚀 **Captain-Powered Code Optimization Complete**

**Original Code Analysis:**
- Language: {language}
- Target: {target}
- Complexity: {analysis.get('complexity', 'Unknown')}
- Captain Features Used: {analysis.get('captain_features_used', ['unlimited_context_processing'])}

**Optimization Results:**
- Generated {len(variants)} optimized variants
- Best improvement: {variants[0].get('performance', {}).get('improvement_percent', 'Unknown')}%

**Optimized Variants:**

"""
        
        for i, variant in enumerate(variants):
            result_text += f"""
### Variant {i + 1}: {variant.get('name', f'Optimization {i + 1}')}
**Description:** {variant.get('description', 'Optimized implementation')}
**Performance:** {variant.get('performance', {}).get('improvement_percent', 'N/A')}% improvement

```{language}
{variant.get('code', '// Code generation failed')}
```

---
"""
        
        result_text += f"""
**Powered by:** 🧠 Captain (unlimited context) + ⚡ Morph + 🔍 Metorial + 🚀 E2B

*This optimization used Captain's unlimited context processing to analyze your code comprehensively and generate mathematically precise improvements.*
"""
        
        return [types.TextContent(type="text", text=result_text)]
        
    except Exception as e:
        return [types.TextContent(
            type="text",
            text=f"❌ Optimization failed: {str(e)}"
        )]

async def handle_generate_from_docs(arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle documentation to code generation"""
    doc_urls = arguments.get("documentation_urls", [])
    requirements = arguments.get("requirements", "")
    target_language = arguments.get("target_language", "JavaScript")
    implementation_style = arguments.get("implementation_style", "production")
    
    if not doc_urls:
        return [types.TextContent(
            type="text",
            text="❌ Error: At least one documentation URL is required"
        )]
    
    if not requirements.strip():
        return [types.TextContent(
            type="text", 
            text="❌ Error: Requirements description is required"
        )]
    
    logger.info(f"🌐 Generating {target_language} code from {len(doc_urls)} documentation URLs")
    
    try:
        # Step 1: Scrape documentation with Firecrawl
        documentation = await experiment_agent.firecrawl_service.scrape_documentation(doc_urls)
        
        # Step 2: Extract API patterns
        api_patterns = await experiment_agent.firecrawl_service.extract_api_patterns(documentation)
        
        # Step 3: Generate implementations
        implementations = await experiment_agent.firecrawl_service.generate_implementation_variants(
            api_patterns, requirements, target_language
        )
        
        # Format results
        result_text = f"""🌐 **Documentation to Code Generation Complete**

**Analysis Summary:**
- Documentation URLs: {len(doc_urls)}
- Target Language: {target_language}
- Implementation Style: {implementation_style}
- Requirements: {requirements}

**Documentation Processed:**
"""
        
        for doc in documentation.get("docs", []):
            result_text += f"- {doc.get('url', 'Unknown URL')}\n"
        
        result_text += f"""
**Generated Implementations:**

"""
        
        for i, impl in enumerate(implementations[:5]):  # Limit to 5 for readability
            result_text += f"""
### Implementation {i + 1}: {impl.get('name', f'Implementation {i + 1}')}
**Approach:** {impl.get('approach', 'Standard implementation')}
**Complexity:** {impl.get('complexity', 'Unknown')}
**Description:** {impl.get('description', 'Code implementation')}

```{target_language.lower()}
{impl.get('code', '// Code generation failed')}
```

---
"""
        
        result_text += f"""
**Powered by:** 🧠 Captain (unlimited context) + 🌐 Firecrawl + ⚡ Morph

*This generation used Captain's unlimited context to understand complete documentation and generate comprehensive implementations.*
"""
        
        return [types.TextContent(type="text", text=result_text)]
        
    except Exception as e:
        return [types.TextContent(
            type="text",
            text=f"❌ Documentation generation failed: {str(e)}"
        )]

async def handle_analyze_github_repo(arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle GitHub repository analysis"""
    github_url = arguments.get("github_url", "")
    analysis_depth = arguments.get("analysis_depth", "comprehensive")
    focus_areas = arguments.get("focus_areas", ["performance", "algorithms", "complexity"])
    
    if not github_url.strip():
        return [types.TextContent(
            type="text",
            text="❌ Error: GitHub URL is required"
        )]
    
    logger.info(f"📊 Analyzing GitHub repository: {github_url}")
    
    try:
        # Analyze repository
        analysis = await experiment_agent.github_service.analyze_repository(github_url)
        
        if analysis.get("error"):
            return [types.TextContent(
                type="text",
                text=f"❌ Repository analysis failed: {analysis['error']}"
            )]
        
        # Format results
        repo_info = analysis.get("repository", {})
        analysis_results = analysis.get("analysis_results", {})
        optimization_report = analysis.get("optimization_report", {})
        
        result_text = f"""📊 **Captain-Powered GitHub Repository Analysis**

**Repository:** {repo_info.get('full_name', 'Unknown')}
**Analysis Depth:** {analysis_depth}
**Focus Areas:** {', '.join(focus_areas)}

**Analysis Summary:**
- Files Analyzed: {analysis.get('files_analyzed', 0)}
- Languages Detected: {', '.join(analysis_results.get('repository_overview', {}).get('languages_detected', []))}
- Algorithms Found: {len(optimization_report.get('top_algorithms', []))}
- Optimization Opportunities: {len(optimization_report.get('optimization_opportunities', []))}
- Performance Hotspots: {len(optimization_report.get('performance_hotspots', []))}

**Top Algorithms Detected:**
"""
        
        for algo in optimization_report.get("top_algorithms", [])[:5]:
            result_text += f"- {algo.get('algorithm', 'Unknown').title()}: {algo.get('optimization_potential', 'Unknown')} optimization potential\n"
        
        result_text += f"""
**Top Optimization Opportunities:**
"""
        
        for opp in optimization_report.get("optimization_opportunities", [])[:5]:
            result_text += f"- {opp.get('issue', 'Unknown')}: {opp.get('severity', 'Unknown')} severity\n"
        
        result_text += f"""
**Performance Hotspots:**
"""
        
        for hotspot in optimization_report.get("performance_hotspots", [])[:5]:
            result_text += f"- {hotspot.get('file', 'Unknown')}: Complexity {hotspot.get('complexity', 0)}/10\n"
        
        result_text += f"""
**Optimization Recommendations:**
"""
        
        for rec in optimization_report.get("recommendations", [])[:3]:
            result_text += f"""
### {rec.get('title', 'Optimization Recommendation')}
**Priority:** {rec.get('priority', 'Unknown')}
**Impact:** {rec.get('impact', 'Unknown')}
**Description:** {rec.get('description', 'No description')}
**Files Affected:** {len(rec.get('files_affected', []))}

"""
        
        estimated_improvements = optimization_report.get("estimated_improvements", {})
        result_text += f"""
**Estimated Improvements:**
- Performance: {estimated_improvements.get('performance_gain', 'Unknown')}
- Memory: {estimated_improvements.get('memory_reduction', 'Unknown')}
- Code Quality: {estimated_improvements.get('code_quality', 'Unknown')}

**Powered by:** 🧠 Captain (unlimited context) + 🔍 Metorial + ⚡ Morph

*This analysis used Captain's unlimited context processing to comprehensively analyze the entire repository simultaneously.*
"""
        
        return [types.TextContent(type="text", text=result_text)]
        
    except Exception as e:
        return [types.TextContent(
            type="text",
            text=f"❌ Repository analysis failed: {str(e)}"
        )]

async def main():
    """Main entry point for the MCP server"""
    logger.info("🚀 Starting Live Code Experiment Agent MCP Server...")
    logger.info("🏆 Captain-powered code optimization, documentation generation, and repository analysis")
    
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream, 
            app.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())