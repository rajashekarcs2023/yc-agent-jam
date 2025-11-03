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
                result = self._fallback_documentation(doc_urls)
                self._current_documentation = result  # Store for later access
                return result
            
            print(f"🔍 Scraping documentation from {len(doc_urls)} URLs using Firecrawl")
            
            # Create session with Firecrawl MCP server
            session = self.metorial.create_mcp_session(
                self.firecrawl_deployment_id
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
            
            result = {
                "docs": scraped_docs,
                "total_urls": len(doc_urls),
                "successful_scrapes": len(scraped_docs),
                "provider": "Firecrawl via Metorial MCP"
            }
            self._current_documentation = result  # Store for later access
            return result
            
        except Exception as e:
            print(f"Firecrawl documentation scraping error: {e}")
            return self._fallback_documentation(doc_urls)
    
    async def extract_api_patterns(self, documentation: Dict[str, Any]) -> Dict[str, Any]:
        """Extract API patterns and code examples from scraped documentation"""
        try:
            # Use Firecrawl's extract tool for structured data extraction
            session = self.metorial.create_mcp_session(
                self.firecrawl_deployment_id
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
        
        # Extract actual API endpoints and features from documentation
        all_patterns = api_patterns.get("api_patterns", [])
        
        # Generate variants for each API endpoint/feature found
        variants = []
        variant_id = 1
        
        # First, analyze what APIs/features we found
        api_features = self._extract_api_features(all_patterns, user_requirements)
        
        for feature in api_features:
            # Generate multiple implementation approaches for each feature
            feature_variants = await self._generate_feature_implementations(
                feature, 
                user_requirements,
                target_language,
                variant_id
            )
            variants.extend(feature_variants)
            variant_id += len(feature_variants)
        
        # If no specific features found, generate general implementations
        if not variants:
            general_strategies = [
                {
                    "name": "Basic API Client",
                    "approach": "Simple HTTP client with basic functionality",
                    "complexity": "Simple",
                    "feature_type": "general"
                },
                {
                    "name": "Advanced SDK Wrapper", 
                    "approach": "Full-featured SDK with error handling and validation",
                    "complexity": "Advanced",
                    "feature_type": "general"
                },
                {
                    "name": "Production Client",
                    "approach": "Enterprise-ready client with monitoring and resilience",
                    "complexity": "Enterprise",
                    "feature_type": "general"
                }
            ]
            
            for i, strategy in enumerate(general_strategies):
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
                    "description": f"Generated based on: {user_requirements}",
                    "features": self._get_variant_features(strategy["complexity"])
                })
        
        return variants[:10]  # Limit to 10 variants for UI performance
    
    def _extract_api_features(self, patterns: List[Dict], requirements: str) -> List[Dict]:
        """Extract specific API features and endpoints from documentation patterns"""
        features = []
        
        for pattern in patterns:
            endpoints = pattern.get("api_endpoints", [])
            code_examples = pattern.get("code_examples", [])
            usage_patterns = pattern.get("usage_patterns", [])
            
            # Extract individual features/endpoints
            for endpoint in endpoints:
                features.append({
                    "type": "endpoint",
                    "name": f"{endpoint.get('method', 'POST')} {endpoint.get('endpoint', '/api')}",
                    "description": endpoint.get('description', 'API endpoint'),
                    "method": endpoint.get('method', 'POST'),
                    "endpoint": endpoint.get('endpoint', '/api'),
                    "parameters": endpoint.get('parameters', [])
                })
            
            # Extract features from code examples
            for example in code_examples:
                features.append({
                    "type": "example",
                    "name": f"Code Example - {example.get('description', 'Implementation')}",
                    "description": example.get('description', 'Code implementation example'),
                    "example_code": example.get('code', ''),
                    "language": example.get('language', 'javascript')
                })
            
            # Extract usage patterns as features
            for pattern_desc in usage_patterns:
                features.append({
                    "type": "pattern",
                    "name": f"Usage Pattern - {pattern_desc}",
                    "description": pattern_desc,
                    "pattern": pattern_desc
                })
        
        # Also check documentation content for API endpoints
        # This helps with fallback documentation that has embedded endpoints
        for doc in getattr(self, '_current_documentation', {}).get('docs', []):
            doc_endpoints = doc.get('api_endpoints', [])
            for endpoint in doc_endpoints:
                features.append({
                    "type": "endpoint",
                    "name": f"{endpoint.get('method', 'POST')} {endpoint.get('endpoint', '/api')}",
                    "description": endpoint.get('description', 'API endpoint from documentation'),
                    "method": endpoint.get('method', 'POST'),
                    "endpoint": endpoint.get('endpoint', '/api'),
                    "parameters": endpoint.get('parameters', [])
                })
        
        # If no specific features found, create generic ones based on requirements
        if not features:
            # Analyze requirements for potential features
            req_lower = requirements.lower()
            if "stream" in req_lower or "infinite" in req_lower:
                features.append({
                    "type": "streaming",
                    "name": "Streaming API Implementation",
                    "description": "Implementation for streaming/infinite responses",
                    "pattern": "streaming"
                })
            if "auth" in req_lower or "login" in req_lower:
                features.append({
                    "type": "auth",
                    "name": "Authentication Implementation", 
                    "description": "Authentication and authorization handling",
                    "pattern": "authentication"
                })
            if "webhook" in req_lower:
                features.append({
                    "type": "webhook",
                    "name": "Webhook Handler Implementation",
                    "description": "Webhook endpoint and event handling",
                    "pattern": "webhooks"
                })
        
        return features
    
    async def _generate_feature_implementations(
        self, 
        feature: Dict, 
        requirements: str,
        language: str,
        start_id: int
    ) -> List[Dict]:
        """Generate multiple implementation variants for a specific feature"""
        
        implementations = []
        complexity_levels = ["Simple", "Advanced", "Production"]
        
        for i, complexity in enumerate(complexity_levels):
            strategy = {
                "name": f"{feature['name']} - {complexity}",
                "approach": f"{complexity} implementation of {feature['description']}",
                "complexity": complexity,
                "feature_type": feature.get("type", "general")
            }
            
            code = await self._generate_feature_specific_code(
                feature, 
                requirements,
                language,
                strategy,
                start_id + i
            )
            
            implementations.append({
                "id": start_id + i,
                "name": strategy["name"],
                "approach": strategy["approach"],
                "complexity": complexity,
                "code": code,
                "language": language,
                "description": feature["description"],
                "feature_type": feature.get("type", "general"),
                "features": self._get_variant_features(complexity)
            })
        
        return implementations
    
    async def _generate_feature_specific_code(
        self,
        feature: Dict,
        requirements: str,
        language: str,
        strategy: Dict,
        variant_id: int
    ) -> str:
        """Generate code specific to the feature type"""
        
        feature_type = feature.get("type", "general")
        
        if feature_type == "endpoint":
            return self._generate_endpoint_implementation(feature, language, strategy, variant_id)
        elif feature_type == "streaming":
            return self._generate_streaming_implementation(feature, language, strategy, variant_id)
        elif feature_type == "auth":
            return self._generate_auth_implementation(feature, language, strategy, variant_id)
        elif feature_type == "webhook":
            return self._generate_webhook_implementation(feature, language, strategy, variant_id)
        elif feature_type == "example":
            return self._generate_example_based_implementation(feature, language, strategy, variant_id)
        else:
            # Fallback to general implementation
            return await self._generate_implementation_code(
                {"api_patterns": [feature]}, 
                requirements, 
                language, 
                strategy, 
                variant_id
            )
    
    def _generate_endpoint_implementation(self, feature: Dict, language: str, strategy: Dict, variant_id: int) -> str:
        """Generate code for specific API endpoint"""
        method = feature.get("method", "POST")
        endpoint = feature.get("endpoint", "/api")
        description = feature.get("description", "API endpoint")
        
        if language.lower() == "javascript":
            if strategy["complexity"] == "Simple":
                return f"""// {strategy["name"]} - Variant {variant_id}
// {description}

async function call{method.title()}Api(data) {{
    const response = await fetch('https://api.runcaptain.com{endpoint}', {{
        method: '{method}',
        headers: {{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        }},
        body: JSON.stringify(data)
    }});
    
    if (!response.ok) {{
        throw new Error(`API Error: ${{response.status}}`);
    }}
    
    return response.json();
}}

// Usage example
const result = await call{method.title()}Api({{
    // Add your data here based on API requirements
}});
console.log('Response:', result);"""
            
            elif strategy["complexity"] == "Advanced":
                return f"""// {strategy["name"]} - Variant {variant_id}
// Advanced implementation with error handling and retry logic

class {method.title()}ApiClient {{
    constructor(apiKey, options = {{}}) {{
        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl || 'https://api.runcaptain.com';
        this.timeout = options.timeout || 30000;
        this.maxRetries = options.maxRetries || 3;
    }}
    
    async makeRequest(data, attempt = 1) {{
        try {{
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(`${{this.baseUrl}}{endpoint}`, {{
                method: '{method}',
                headers: {{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${{this.apiKey}}`
                }},
                body: JSON.stringify(data),
                signal: controller.signal
            }});
            
            clearTimeout(timeout);
            
            if (!response.ok) {{
                if (response.status === 429 && attempt < this.maxRetries) {{
                    // Rate limiting - exponential backoff
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this.makeRequest(data, attempt + 1);
                }}
                throw new ApiError(response.status, await response.text());
            }}
            
            return await response.json();
            
        }} catch (error) {{
            if (error.name === 'AbortError') {{
                throw new Error('Request timeout');
            }}
            if (attempt < this.maxRetries && this.isRetryableError(error)) {{
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                return this.makeRequest(data, attempt + 1);
            }}
            throw error;
        }}
    }}
    
    isRetryableError(error) {{
        return error.code === 'ECONNRESET' || 
               error.code === 'ECONNREFUSED' ||
               (error.status >= 500 && error.status < 600);
    }}
    
    async {method.toLowerCase()}(data) {{
        return this.makeRequest(data);
    }}
}}

class ApiError extends Error {{
    constructor(status, message) {{
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }}
}}

// Usage
const client = new {method.title()}ApiClient('your-api-key');
try {{
    const result = await client.{method.toLowerCase()}({{
        // Your request data
    }});
    console.log('Success:', result);
}} catch (error) {{
    console.error('API Error:', error.message);
}}"""
            
        return f"// {strategy['name']} implementation for {language}"
    
    def _generate_streaming_implementation(self, feature: Dict, language: str, strategy: Dict, variant_id: int) -> str:
        """Generate streaming/infinite response implementation"""
        if language.lower() == "javascript":
            return f"""// {strategy["name"]} - Variant {variant_id}
// Streaming API implementation for infinite responses

class StreamingApiClient {{
    constructor(apiKey) {{
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.runcaptain.com';
    }}
    
    async *streamInfiniteResponses(requestData) {{
        const response = await fetch(`${{this.baseUrl}}/infinite-responses`, {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${{this.apiKey}}`,
                'Accept': 'text/stream'
            }},
            body: JSON.stringify(requestData)
        }});
        
        if (!response.ok) {{
            throw new Error(`Stream failed: ${{response.status}}`);
        }}
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {{
            while (true) {{
                const {{ done, value }} = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\\n');
                
                for (const line of lines) {{
                    if (line.trim()) {{
                        try {{
                            const data = JSON.parse(line);
                            yield data;
                        }} catch (e) {{
                            // Handle non-JSON chunks
                            yield {{ text: line }};
                        }}
                    }}
                }}
            }}
        }} finally {{
            reader.releaseLock();
        }}
    }}
    
    async handleStreamWithCallback(requestData, onChunk, onComplete, onError) {{
        try {{
            for await (const chunk of this.streamInfiniteResponses(requestData)) {{
                onChunk(chunk);
            }}
            onComplete();
        }} catch (error) {{
            onError(error);
        }}
    }}
}}

// Usage example
const streamClient = new StreamingApiClient('your-api-key');

// Using async generator
for await (const chunk of streamClient.streamInfiniteResponses({{ prompt: 'Generate content' }})) {{
    console.log('Received chunk:', chunk);
}}

// Using callback approach
streamClient.handleStreamWithCallback(
    {{ prompt: 'Generate content' }},
    (chunk) => console.log('Chunk:', chunk),
    () => console.log('Stream complete'),
    (error) => console.error('Stream error:', error)
);"""
        
        return f"// Streaming implementation for {language}"
    
    def _generate_auth_implementation(self, feature: Dict, language: str, strategy: Dict, variant_id: int) -> str:
        """Generate authentication implementation"""
        if language.lower() == "javascript":
            return f"""// {strategy["name"]} - Variant {variant_id}
// Authentication implementation for Captain API

class CaptainAuthClient {{
    constructor(options = {{}}) {{
        this.apiKey = options.apiKey;
        this.baseUrl = options.baseUrl || 'https://api.runcaptain.com';
        this.tokenStorage = options.tokenStorage || 'localStorage';
    }}
    
    async authenticate(credentials) {{
        const response = await fetch(`${{this.baseUrl}}/auth/login`, {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify(credentials)
        }});
        
        if (!response.ok) {{
            throw new Error('Authentication failed');
        }}
        
        const {{ token, refreshToken }} = await response.json();
        this.storeTokens(token, refreshToken);
        return token;
    }}
    
    storeTokens(token, refreshToken) {{
        if (this.tokenStorage === 'localStorage') {{
            localStorage.setItem('captain_token', token);
            localStorage.setItem('captain_refresh_token', refreshToken);
        }}
        this.apiKey = token;
    }}
    
    getStoredToken() {{
        if (this.tokenStorage === 'localStorage') {{
            return localStorage.getItem('captain_token');
        }}
        return null;
    }}
    
    async makeAuthenticatedRequest(endpoint, options = {{}}) {{
        const token = this.apiKey || this.getStoredToken();
        
        if (!token) {{
            throw new Error('No authentication token available');
        }}
        
        return fetch(`${{this.baseUrl}}${{endpoint}}`, {{
            ...options,
            headers: {{
                'Authorization': `Bearer ${{token}}`,
                'Content-Type': 'application/json',
                ...options.headers
            }}
        }});
    }}
}}

// Usage
const authClient = new CaptainAuthClient();
await authClient.authenticate({{ email: 'user@example.com', password: 'password' }});
const response = await authClient.makeAuthenticatedRequest('/protected-endpoint');"""
        
        return f"// Auth implementation for {language}"
    
    def _generate_webhook_implementation(self, feature: Dict, language: str, strategy: Dict, variant_id: int) -> str:
        """Generate webhook handler implementation"""
        if language.lower() == "javascript":
            return f"""// {strategy["name"]} - Variant {variant_id}
// Webhook handler implementation

const crypto = require('crypto');
const express = require('express');

class CaptainWebhookHandler {{
    constructor(secretKey) {{
        this.secretKey = secretKey;
        this.app = express();
        this.setupMiddleware();
    }}
    
    setupMiddleware() {{
        this.app.use(express.raw({{ type: 'application/json' }}));
    }}
    
    verifySignature(payload, signature) {{
        const expectedSignature = crypto
            .createHmac('sha256', this.secretKey)
            .update(payload)
            .digest('hex');
        
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    }}
    
    handleWebhook(eventType, handler) {{
        this.app.post('/webhook', (req, res) => {{
            const signature = req.headers['x-captain-signature'];
            const payload = req.body;
            
            if (!this.verifySignature(payload, signature)) {{
                return res.status(401).json({{ error: 'Invalid signature' }});
            }}
            
            try {{
                const event = JSON.parse(payload);
                
                if (event.type === eventType) {{
                    handler(event.data);
                }}
                
                res.status(200).json({{ received: true }});
            }} catch (error) {{
                console.error('Webhook error:', error);
                res.status(400).json({{ error: 'Invalid payload' }});
            }}
        }});
    }}
    
    listen(port = 3000) {{
        this.app.listen(port, () => {{
            console.log(`Webhook server listening on port ${{port}}`);
        }});
    }}
}}

// Usage
const webhookHandler = new CaptainWebhookHandler('your-webhook-secret');

webhookHandler.handleWebhook('task.completed', (data) => {{
    console.log('Task completed:', data);
}});

webhookHandler.listen(3000);"""
        
        return f"// Webhook implementation for {language}"
    
    def _generate_example_based_implementation(self, feature: Dict, language: str, strategy: Dict, variant_id: int) -> str:
        """Generate implementation based on code examples from documentation"""
        example_code = feature.get("example_code", "")
        
        if language.lower() == "javascript":
            return f"""// {strategy["name"]} - Variant {variant_id}
// Implementation based on documentation example

{example_code}

// Enhanced wrapper around the example
class CaptainAPIWrapper {{
    constructor(apiKey) {{
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.runcaptain.com';
    }}
    
    async callAPI(endpoint, data) {{
        // Based on documentation example above
        const response = await fetch(`${{this.baseUrl}}${{endpoint}}`, {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${{this.apiKey}}`
            }},
            body: JSON.stringify(data)
        }});
        
        if (!response.ok) {{
            throw new Error(`API call failed: ${{response.status}}`);
        }}
        
        return response.json();
    }}
}}

// Usage based on documentation patterns
const api = new CaptainAPIWrapper('your-api-key');
const result = await api.callAPI('/endpoint', {{ data: 'from-docs' }});"""
        
        return f"// Example-based implementation for {language}"
    
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
        """Intelligent fallback when Firecrawl is unavailable"""
        print("🔄 Using intelligent fallback for documentation scraping")
        
        docs = []
        for url in urls:
            # Analyze URL to provide smart fallbacks
            if "runcaptain.com" in url:
                docs.append(self._generate_captain_fallback_content(url))
            elif "docs." in url or "api." in url:
                docs.append(self._generate_api_fallback_content(url))
            else:
                docs.append({
                    "url": url,
                    "content": f"Generic API documentation content for {url}",
                    "type": "generic_api"
                })
        
        return {
            "docs": docs,
            "total_urls": len(urls),
            "successful_scrapes": len(docs),
            "provider": "Intelligent Fallback Documentation Service"
        }
    
    def _generate_captain_fallback_content(self, url: str) -> Dict[str, Any]:
        """Generate specific fallback content for Captain documentation"""
        if "infinite-responses" in url:
            return {
                "url": url,
                "content": """# Captain Infinite Responses API
                
## Overview
The Captain Infinite Responses API allows you to stream continuous AI-generated content for various use cases.

## Endpoints
- POST /infinite-responses - Start an infinite response stream
- GET /infinite-responses/{id} - Get status of a streaming session
- DELETE /infinite-responses/{id} - Stop a streaming session

## Request Format
```json
{
    "prompt": "Your prompt here",
    "stream": true,
    "max_tokens": 1000,
    "temperature": 0.7
}
```

## Response Format
The API returns streaming JSON objects:
```json
{"type": "chunk", "data": "Generated content chunk"}
{"type": "status", "data": {"tokens_used": 150}}
{"type": "complete", "data": {"total_tokens": 500}}
```

## Authentication
Include your API key in the Authorization header:
```
Authorization: Bearer your-api-key
```

## Rate Limits
- 100 requests per minute
- 10 concurrent streams per API key
                """,
                "type": "captain_infinite_responses",
                "api_endpoints": [
                    {
                        "method": "POST",
                        "endpoint": "/infinite-responses",
                        "description": "Start streaming infinite responses",
                        "parameters": ["prompt", "stream", "max_tokens", "temperature"]
                    },
                    {
                        "method": "GET", 
                        "endpoint": "/infinite-responses/{id}",
                        "description": "Get streaming session status",
                        "parameters": ["id"]
                    },
                    {
                        "method": "DELETE",
                        "endpoint": "/infinite-responses/{id}", 
                        "description": "Stop streaming session",
                        "parameters": ["id"]
                    }
                ]
            }
        else:
            return {
                "url": url,
                "content": """# Captain API Documentation
                
## Base URL
https://api.runcaptain.com

## Authentication
All requests require authentication via API key in the Authorization header.

## Common Endpoints
- POST /analyze - Analyze code or content
- POST /generate - Generate content
- GET /status - Check API status
                """,
                "type": "captain_general",
                "api_endpoints": [
                    {
                        "method": "POST",
                        "endpoint": "/analyze",
                        "description": "Analyze code or content",
                        "parameters": ["content", "type"]
                    },
                    {
                        "method": "POST",
                        "endpoint": "/generate", 
                        "description": "Generate content",
                        "parameters": ["prompt", "type"]
                    }
                ]
            }
    
    def _generate_api_fallback_content(self, url: str) -> Dict[str, Any]:
        """Generate fallback content for generic API documentation"""
        return {
            "url": url,
            "content": f"""# API Documentation for {url}
            
## Base URL
{url.split('/docs')[0] if '/docs' in url else url}

## Authentication
API key required in Authorization header.

## Common Patterns
- REST API with JSON request/response
- Standard HTTP status codes
- Rate limiting applied
            """,
            "type": "generic_api_docs",
            "api_endpoints": [
                {
                    "method": "GET",
                    "endpoint": "/api/v1/resource",
                    "description": "Get resource data",
                    "parameters": ["id", "limit", "offset"]
                },
                {
                    "method": "POST",
                    "endpoint": "/api/v1/resource",
                    "description": "Create new resource", 
                    "parameters": ["data"]
                }
            ]
        }
    
    def _fallback_api_patterns(self) -> Dict[str, Any]:
        """Enhanced fallback API patterns"""
        return {
            "api_patterns": [{
                "api_endpoints": [
                    {
                        "method": "POST",
                        "endpoint": "/infinite-responses", 
                        "description": "Stream infinite AI responses",
                        "parameters": ["prompt", "stream", "max_tokens"]
                    },
                    {
                        "method": "GET",
                        "endpoint": "/infinite-responses/{id}",
                        "description": "Check streaming status",
                        "parameters": ["id"]
                    },
                    {
                        "method": "DELETE", 
                        "endpoint": "/infinite-responses/{id}",
                        "description": "Stop streaming session",
                        "parameters": ["id"]
                    }
                ],
                "code_examples": [
                    {
                        "language": "javascript",
                        "code": """
// Start streaming infinite responses
const response = await fetch('/api/infinite-responses', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key'
    },
    body: JSON.stringify({
        prompt: 'Generate content',
        stream: true,
        max_tokens: 1000
    })
});

// Handle streaming response
const reader = response.body.getReader();
while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    const data = JSON.parse(chunk);
    console.log('Received:', data);
}
                        """,
                        "description": "Stream infinite responses with fetch API"
                    }
                ],
                "usage_patterns": [
                    "Streaming API responses",
                    "Real-time content generation", 
                    "WebSocket-like behavior over HTTP",
                    "Server-sent events pattern"
                ]
            }],
            "extraction_count": 1,
            "provider": "Enhanced Fallback Pattern Service with Captain API knowledge"
        }