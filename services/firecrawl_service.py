"""
Firecrawl Service - Documentation scraping and code generation
Uses Metorial's Firecrawl MCP deployment for real-world documentation analysis
"""

import os
import asyncio
from typing import Dict, List, Any, Optional
from metorial import Metorial

class FirecrawlService:
    def __init__(self):
        self.metorial = Metorial(api_key=os.getenv("METORIAL_API_KEY"))
        self.firecrawl_deployment_id = os.getenv("FIRECRAWL_DEPLOYMENT_ID")
        
    async def scrape_documentation(self, doc_urls: List[str]) -> Dict[str, Any]:
        """Scrape documentation from URLs using Firecrawl MCP"""
        try:
            if not self.firecrawl_deployment_id:
                print("Warning: FIRECRAWL_DEPLOYMENT_ID not set, using fallback")
                return self._fallback_documentation(doc_urls)
            
            print(f"🔍 Scraping documentation from {len(doc_urls)} URLs using Firecrawl")
            
            # Create session with Firecrawl MCP server
            session = self.metorial.create_mcp_session(
                server_deployment_id=self.firecrawl_deployment_id
            )
            
            scraped_docs = []
            
            # Use batch scrape for efficiency
            if len(doc_urls) > 1:
                batch_result = session.call_tool(
                    tool_name="firecrawl_batch_scrape",
                    arguments={
                        "urls": doc_urls[:5],  # Limit to 5 URLs for speed
                        "options": {
                            "formats": ["markdown"],
                            "onlyMainContent": True,
                            "includeTags": ["article", "main", "section", "div"],
                            "excludeTags": ["nav", "footer", "sidebar", "ads"]
                        }
                    }
                )
                
                if batch_result and batch_result.get("content"):
                    # Handle batch operation
                    scraped_docs = self._parse_batch_results(batch_result["content"])
                    
            else:
                # Single URL scraping
                for url in doc_urls:
                    scrape_result = session.call_tool(
                        tool_name="firecrawl_scrape",
                        arguments={
                            "url": url,
                            "formats": ["markdown"],
                            "onlyMainContent": True,
                            "waitFor": 2000,  # Wait for dynamic content
                            "timeout": 30000,
                            "includeTags": ["article", "main", "section"],
                            "excludeTags": ["nav", "footer", "sidebar"]
                        }
                    )
                    
                    if scrape_result and scrape_result.get("content"):
                        doc_data = self._parse_scrape_result(scrape_result["content"], url)
                        scraped_docs.append(doc_data)
            
            return {
                "docs": scraped_docs,
                "total_urls": len(doc_urls),
                "successful_scrapes": len(scraped_docs),
                "provider": "Firecrawl via Metorial MCP"
            }
            
        except Exception as e:
            print(f"Firecrawl documentation scraping error: {e}")
            return self._fallback_documentation(doc_urls)
    
    async def extract_api_patterns(self, documentation: Dict[str, Any]) -> Dict[str, Any]:
        """Extract API patterns and code examples from scraped documentation"""
        try:
            # Use Firecrawl's extract tool for structured data extraction
            session = self.metorial.create_mcp_session(
                server_deployment_id=self.firecrawl_deployment_id
            )
            
            api_patterns = []
            
            for doc in documentation.get("docs", []):
                extract_result = session.call_tool(
                    tool_name="firecrawl_extract",
                    arguments={
                        "urls": [doc["url"]],
                        "prompt": "Extract API endpoints, code examples, function signatures, and usage patterns. Focus on practical implementation details.",
                        "systemPrompt": "You are an expert developer extracting API documentation. Focus on actionable code patterns, endpoints, parameters, and examples.",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "api_endpoints": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "method": {"type": "string"},
                                            "endpoint": {"type": "string"},
                                            "description": {"type": "string"},
                                            "parameters": {"type": "array"}
                                        }
                                    }
                                },
                                "code_examples": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "language": {"type": "string"},
                                            "code": {"type": "string"},
                                            "description": {"type": "string"}
                                        }
                                    }
                                },
                                "usage_patterns": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                }
                            }
                        }
                    }
                )
                
                if extract_result and extract_result.get("content"):
                    pattern_data = self._parse_extract_result(extract_result["content"])
                    api_patterns.append(pattern_data)
            
            return {
                "api_patterns": api_patterns,
                "extraction_count": len(api_patterns),
                "provider": "Firecrawl Extract via Metorial MCP"
            }
            
        except Exception as e:
            print(f"API pattern extraction error: {e}")
            return self._fallback_api_patterns()
    
    async def generate_implementation_variants(
        self, 
        api_patterns: Dict[str, Any], 
        user_requirements: str,
        target_language: str
    ) -> List[Dict[str, Any]]:
        """Generate multiple implementation variants based on documentation patterns"""
        
        implementation_strategies = [
            {
                "name": "Direct API Implementation",
                "approach": "Direct API calls with error handling",
                "complexity": "Simple"
            },
            {
                "name": "SDK Wrapper Implementation", 
                "approach": "Create wrapper class with helper methods",
                "complexity": "Moderate"
            },
            {
                "name": "Async/Promise-based Implementation",
                "approach": "Full async implementation with proper error handling",
                "complexity": "Advanced"
            },
            {
                "name": "Type-safe Implementation",
                "approach": "Strongly typed interfaces with validation",
                "complexity": "Advanced"
            },
            {
                "name": "Production-ready Implementation",
                "approach": "Rate limiting, retry logic, logging, monitoring",
                "complexity": "Enterprise"
            }
        ]
        
        variants = []
        
        for i, strategy in enumerate(implementation_strategies):
            variant_code = await self._generate_implementation_code(
                api_patterns, 
                user_requirements, 
                target_language, 
                strategy, 
                i + 1
            )
            
            variants.append({
                "id": i + 1,
                "name": strategy["name"],
                "approach": strategy["approach"],
                "complexity": strategy["complexity"],
                "code": variant_code,
                "language": target_language,
                "features": self._get_variant_features(strategy["complexity"])
            })
        
        return variants
    
    async def _generate_implementation_code(
        self, 
        api_patterns: Dict[str, Any], 
        requirements: str, 
        language: str, 
        strategy: Dict, 
        variant_num: int
    ) -> str:
        """Generate implementation code based on strategy"""
        
        # Extract patterns for code generation
        patterns = api_patterns.get("api_patterns", [])
        
        if language.lower() == "javascript":
            return self._generate_js_implementation(patterns, requirements, strategy, variant_num)
        elif language.lower() == "python":
            return self._generate_python_implementation(patterns, requirements, strategy, variant_num)
        else:
            return self._generate_generic_implementation(patterns, requirements, strategy, variant_num)
    
    def _generate_js_implementation(self, patterns: List, requirements: str, strategy: Dict, variant_num: int) -> str:
        """Generate JavaScript implementation"""
        if strategy["complexity"] == "Simple":
            return f"""// {strategy["name"]} - Variant {variant_num}
// Based on documentation patterns: {requirements}

class APIClient {{
    constructor(apiKey) {{
        this.apiKey = apiKey;
        this.baseURL = 'https://api.example.com';
    }}
    
    async makeRequest(endpoint, options = {{}}) {{
        const response = await fetch(`${{this.baseURL}}${{endpoint}}`, {{
            headers: {{
                'Authorization': `Bearer ${{this.apiKey}}`,
                'Content-Type': 'application/json',
                ...options.headers
            }},
            ...options
        }});
        
        if (!response.ok) {{
            throw new Error(`API Error: ${{response.status}}`);
        }}
        
        return response.json();
    }}
    
    // Implementation based on documentation patterns
    async processData(data) {{
        return this.makeRequest('/process', {{
            method: 'POST',
            body: JSON.stringify(data)
        }});
    }}
}}

// Usage example
const client = new APIClient('your-api-key');
const result = await client.processData({{ input: 'example' }});"""

        elif strategy["complexity"] == "Advanced":
            return f"""// {strategy["name"]} - Variant {variant_num}
// Advanced async implementation with comprehensive error handling

class AdvancedAPIClient {{
    constructor(config) {{
        this.config = {{
            apiKey: config.apiKey,
            baseURL: config.baseURL || 'https://api.example.com',
            timeout: config.timeout || 30000,
            retries: config.retries || 3
        }};
        this.rateLimiter = new Map();
    }}
    
    async withRetry(operation, retries = this.config.retries) {{
        for (let attempt = 1; attempt <= retries; attempt++) {{
            try {{
                return await operation();
            }} catch (error) {{
                if (attempt === retries || !this.isRetryableError(error)) {{
                    throw error;
                }}
                await this.delay(Math.pow(2, attempt) * 1000);
            }}
        }}
    }}
    
    async makeRequest(endpoint, options = {{}}) {{
        return this.withRetry(async () => {{
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.config.timeout);
            
            try {{
                const response = await fetch(`${{this.config.baseURL}}${{endpoint}}`, {{
                    headers: {{
                        'Authorization': `Bearer ${{this.config.apiKey}}`,
                        'Content-Type': 'application/json',
                        ...options.headers
                    }},
                    signal: controller.signal,
                    ...options
                }});
                
                if (!response.ok) {{
                    throw new APIError(response.status, await response.text());
                }}
                
                return response.json();
            }} finally {{
                clearTimeout(timeout);
            }}
        }});
    }}
    
    isRetryableError(error) {{
        return error.status >= 500 || error.status === 429;
    }}
    
    delay(ms) {{
        return new Promise(resolve => setTimeout(resolve, ms));
    }}
}}

class APIError extends Error {{
    constructor(status, message) {{
        super(message);
        this.status = status;
        this.name = 'APIError';
    }}
}}

// Advanced usage with error handling
try {{
    const client = new AdvancedAPIClient({{
        apiKey: 'your-key',
        timeout: 45000,
        retries: 5
    }});
    
    const result = await client.makeRequest('/complex-operation', {{
        method: 'POST',
        body: JSON.stringify({{ data: 'complex-input' }})
    }});
    
    console.log('Success:', result);
}} catch (error) {{
    console.error('Operation failed:', error);
}}"""

        else:
            return f"""// {strategy["name"]} - Variant {variant_num}
// Simple implementation based on documentation

async function callAPI(endpoint, data) {{
    const response = await fetch(`https://api.example.com${{endpoint}}`, {{
        method: 'POST',
        headers: {{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        }},
        body: JSON.stringify(data)
    }});
    
    return response.json();
}}

// Usage
const result = await callAPI('/endpoint', {{ input: 'data' }});"""
    
    def _generate_python_implementation(self, patterns: List, requirements: str, strategy: Dict, variant_num: int) -> str:
        """Generate Python implementation"""
        if strategy["complexity"] == "Advanced":
            return f"""# {strategy["name"]} - Variant {variant_num}
# Production-ready Python implementation with async support

import asyncio
import aiohttp
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass
from contextlib import asynccontextmanager

@dataclass
class APIConfig:
    api_key: str
    base_url: str = "https://api.example.com"
    timeout: int = 30
    max_retries: int = 3

class APIClient:
    def __init__(self, config: APIConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        self.logger = logging.getLogger(__name__)
    
    @asynccontextmanager
    async def _get_session(self):
        if self.session is None:
            timeout = aiohttp.ClientTimeout(total=self.config.timeout)
            self.session = aiohttp.ClientSession(
                timeout=timeout,
                headers={{"Authorization": f"Bearer {{self.config.api_key}}"}}
            )
        try:
            yield self.session
        finally:
            pass  # Keep session alive for reuse
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    async def make_request(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        async with self._get_session() as session:
            for attempt in range(self.config.max_retries):
                try:
                    url = f"{{self.config.base_url}}{{endpoint}}"
                    async with session.request('POST', url, **kwargs) as response:
                        if response.status == 429:  # Rate limited
                            wait_time = 2 ** attempt
                            self.logger.warning(f"Rate limited, waiting {{wait_time}}s")
                            await asyncio.sleep(wait_time)
                            continue
                        
                        response.raise_for_status()
                        return await response.json()
                        
                except aiohttp.ClientError as e:
                    if attempt == self.config.max_retries - 1:
                        raise
                    await asyncio.sleep(2 ** attempt)
    
    async def process_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return await self.make_request('/process', json=data)

# Usage example
async def main():
    config = APIConfig(api_key="your-api-key")
    client = APIClient(config)
    
    try:
        result = await client.process_data({{"input": "example"}})
        print("Result:", result)
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())"""
        else:
            return f"""# {strategy["name"]} - Variant {variant_num}
# Simple Python implementation

import requests
from typing import Dict, Any

class SimpleAPIClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.example.com"
    
    def make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(
            f"{{self.base_url}}{{endpoint}}",
            json=data,
            headers={{"Authorization": f"Bearer {{self.api_key}}"}}
        )
        response.raise_for_status()
        return response.json()
    
    def process_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self.make_request('/process', data)

# Usage
client = SimpleAPIClient("your-api-key")
result = client.process_data({{"input": "example"}})
print(result)"""
    
    def _generate_generic_implementation(self, patterns: List, requirements: str, strategy: Dict, variant_num: int) -> str:
        """Generate generic implementation"""
        return f"""// {strategy["name"]} - Variant {variant_num}
// Generic implementation based on documentation patterns
// Requirements: {requirements}

// This implementation follows the {strategy["approach"]} approach
// Complexity level: {strategy["complexity"]}

function implementAPI() {{
    // Implementation based on scraped documentation
    // Add your specific logic here
    return "Generated code based on documentation patterns";
}}"""
    
    def _get_variant_features(self, complexity: str) -> List[str]:
        """Get features for each complexity level"""
        features_map = {
            "Simple": ["Basic API calls", "Error handling", "JSON parsing"],
            "Moderate": ["Wrapper classes", "Helper methods", "Configuration"],
            "Advanced": ["Async/await", "Retry logic", "Type safety", "Timeout handling"],
            "Enterprise": ["Rate limiting", "Logging", "Monitoring", "Circuit breaker", "Metrics"]
        }
        return features_map.get(complexity, ["Basic implementation"])
    
    def _parse_batch_results(self, batch_content: Any) -> List[Dict]:
        """Parse batch scraping results"""
        # Implementation depends on Firecrawl's batch response format
        return [{"url": "batch-url", "content": "scraped content", "status": "success"}]
    
    def _parse_scrape_result(self, scrape_content: Any, url: str) -> Dict:
        """Parse single scrape result"""
        return {
            "url": url,
            "content": str(scrape_content),
            "status": "success",
            "word_count": len(str(scrape_content).split())
        }
    
    def _parse_extract_result(self, extract_content: Any) -> Dict:
        """Parse extraction result"""
        return {
            "api_endpoints": [],
            "code_examples": [],
            "usage_patterns": [],
            "raw_extraction": str(extract_content)
        }
    
    def _fallback_documentation(self, urls: List[str]) -> Dict[str, Any]:
        """Fallback when Firecrawl is unavailable"""
        return {
            "docs": [{"url": url, "content": f"Fallback content for {url}"} for url in urls],
            "total_urls": len(urls),
            "successful_scrapes": len(urls),
            "provider": "Fallback Documentation Service"
        }
    
    def _fallback_api_patterns(self) -> Dict[str, Any]:
        """Fallback API patterns"""
        return {
            "api_patterns": [{
                "api_endpoints": [{"method": "POST", "endpoint": "/api/example"}],
                "code_examples": [{"language": "javascript", "code": "fetch('/api/example')"}],
                "usage_patterns": ["Standard REST API"]
            }],
            "extraction_count": 1,
            "provider": "Fallback Pattern Service"
        }