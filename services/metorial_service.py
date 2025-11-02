"""
Metorial Service - Research optimization techniques using Exa search
Uses Metorial MCP integration with Exa for finding optimization patterns
"""

import os
import asyncio
from typing import Dict, List, Any
from metorial import Metorial

class MetorialService:
    def __init__(self):
        self.metorial = Metorial(api_key=os.getenv("METORIAL_API_KEY"))
        self.exa_deployment_id = os.getenv("EXA_DEPLOYMENT_ID")
        
    async def research_optimizations(
        self, 
        language: str, 
        target: str, 
        patterns: List[str]
    ) -> Dict[str, Any]:
        """Research optimization techniques using Exa search via Metorial"""
        try:
            if not self.exa_deployment_id:
                print("Warning: EXA_DEPLOYMENT_ID not set, using fallback research")
                return self._fallback_research(language, target, patterns)
            
            # Create search queries for optimization techniques
            search_queries = self._create_search_queries(language, target, patterns)
            
            research_results = []
            
            for query in search_queries[:3]:  # Limit to 3 searches for speed
                try:
                    # Use Metorial to call Exa search
                    # Note: This is a simplified implementation
                    # In production, we'd use proper MCP client integration
                    
                    search_result = await self._search_with_exa(query)
                    research_results.append(search_result)
                    
                except Exception as e:
                    print(f"Exa search failed for query '{query}': {e}")
                    continue
            
            # Compile research findings
            compiled_research = self._compile_research(research_results, language, target)
            
            return compiled_research
            
        except Exception as e:
            print(f"Metorial research error: {e}")
            return self._fallback_research(language, target, patterns)
    
    def _create_search_queries(self, language: str, target: str, patterns: List[str]) -> List[str]:
        """Create search queries for finding optimization techniques"""
        base_queries = [
            f"{language} {target.lower()} optimization techniques",
            f"fast {language} algorithms {target.lower()}",
            f"{language} performance improvement best practices"
        ]
        
        # Add pattern-specific queries
        for pattern in patterns[:2]:  # Limit pattern queries
            base_queries.append(f"{language} {pattern} optimization examples")
        
        return base_queries
    
    async def _search_with_exa(self, query: str) -> Dict[str, Any]:
        """Search using Exa via Metorial (simplified implementation)"""
        # This is a placeholder for the actual Metorial+Exa integration
        # In the real implementation, we would:
        # 1. Create an MCP client
        # 2. Connect to Metorial's Exa deployment
        # 3. Execute the search
        # 4. Parse results
        
        # For now, simulate search results
        await asyncio.sleep(0.1)  # Simulate API call
        
        return {
            "query": query,
            "results": [
                {
                    "title": f"Optimization technique for {query}",
                    "url": f"https://example.com/optimization-{hash(query) % 1000}",
                    "summary": f"Advanced {query} optimization strategies and implementation patterns",
                    "relevance_score": 0.85
                }
            ],
            "techniques_found": [
                "Algorithmic optimization",
                "Data structure improvements", 
                "Memory access patterns"
            ]
        }
    
    def _compile_research(self, research_results: List[Dict], language: str, target: str) -> Dict[str, Any]:
        """Compile research results into actionable insights"""
        all_techniques = []
        all_patterns = []
        sources = []
        
        for result in research_results:
            all_techniques.extend(result.get("techniques_found", []))
            sources.extend(result.get("results", []))
        
        # Remove duplicates and compile
        unique_techniques = list(set(all_techniques))
        
        return {
            "language": language,
            "target": target,
            "optimization_techniques": unique_techniques[:10],  # Top 10
            "research_sources": sources[:5],  # Top 5 sources
            "patterns_discovered": self._extract_patterns_from_research(research_results),
            "confidence_score": 0.8,  # Simulated confidence
            "search_queries_used": [r.get("query") for r in research_results]
        }
    
    def _extract_patterns_from_research(self, research_results: List[Dict]) -> List[str]:
        """Extract optimization patterns from research"""
        common_patterns = [
            "Loop unrolling",
            "Vectorization", 
            "Caching strategies",
            "Memory pooling",
            "Branch prediction optimization",
            "Parallel processing",
            "Lazy evaluation",
            "Memoization",
            "Data structure selection",
            "Algorithm complexity reduction"
        ]
        
        # For demo, return a subset based on research
        return common_patterns[:6]
    
    def _fallback_research(self, language: str, target: str, patterns: List[str]) -> Dict[str, Any]:
        """Fallback research when Metorial/Exa is unavailable"""
        print(f"Using fallback research for {language} {target} optimization")
        
        # Hardcoded optimization knowledge base
        optimization_db = {
            "javascript": {
                "performance": [
                    "Use efficient array methods (map, filter vs for loops)",
                    "Implement object pooling for frequent allocations",
                    "Use Web Workers for CPU-intensive tasks",
                    "Optimize DOM manipulation with batch updates",
                    "Use requestAnimationFrame for smooth animations"
                ],
                "memory": [
                    "Implement proper garbage collection patterns",
                    "Use WeakMap and WeakSet for cache management", 
                    "Avoid memory leaks in closures",
                    "Use typed arrays for numerical data"
                ]
            },
            "python": {
                "performance": [
                    "Use list comprehensions instead of loops",
                    "Implement generators for memory efficiency",
                    "Use NumPy for numerical computations",
                    "Cache expensive function calls with functools.lru_cache",
                    "Use collections.deque for queue operations"
                ],
                "memory": [
                    "Use __slots__ to reduce memory overhead",
                    "Implement context managers for resource management",
                    "Use generators instead of lists when possible",
                    "Profile memory usage with memory_profiler"
                ]
            }
        }
        
        lang_key = language.lower()
        target_key = target.lower().replace(" ", "").replace("usage", "")
        
        techniques = optimization_db.get(lang_key, {}).get(target_key, [
            "General algorithmic optimization",
            "Data structure improvements", 
            "Memory access pattern optimization",
            "Loop optimization techniques"
        ])
        
        return {
            "language": language,
            "target": target,
            "optimization_techniques": techniques,
            "patterns_discovered": patterns + ["Caching", "Vectorization", "Parallelization"],
            "confidence_score": 0.6,  # Lower confidence for fallback
            "source": "fallback_knowledge_base",
            "search_queries_used": [f"{language} {target} optimization"]
        }