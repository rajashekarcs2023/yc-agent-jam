"""
Captain Service - Unlimited context code analysis
Uses Captain API for processing entire codebases
"""

import os
from typing import Dict, List, Any, Optional
from openai import OpenAI

class CaptainService:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://api.runcaptain.com/v1",
            api_key=os.getenv("CAPTAIN_API_KEY"),
            default_headers={
                "X-Organization-ID": os.getenv("CAPTAIN_ORG_ID")
            }
        )
    
    async def analyze_code(self, code: str, language: str, target: str) -> Dict[str, Any]:
        """Analyze code using Captain's unlimited context processing"""
        try:
            # Use Captain's proper context format for unlimited text processing
            full_context = f"""
            CODEBASE ANALYSIS REQUEST
            =========================
            
            Language: {language}
            Optimization Target: {target}
            Code Size: {len(code)} characters
            
            ORIGINAL CODE TO ANALYZE:
            ```{language}
            {code}
            ```
            
            ANALYSIS REQUIREMENTS:
            1. Algorithmic Complexity Analysis
               - Identify time complexity (Big O notation)
               - Identify space complexity
               - Find nested loops and recursive patterns
            
            2. Performance Bottleneck Detection
               - Inefficient data structure usage
               - Redundant operations
               - Memory allocation patterns
               - I/O operations
            
            3. Optimization Pattern Identification
               - Dynamic programming opportunities
               - Caching/memoization possibilities
               - Two-pointer technique applications
               - Sliding window optimizations
               - Hash map optimization potential
            
            4. Code Quality Issues
               - Readability problems
               - Maintainability concerns
               - Anti-patterns
            
            5. Language-Specific Optimizations
               - Built-in function usage
               - Library-specific optimizations
               - Framework best practices
            
            CONTEXT: This is part of a live code optimization platform that generates multiple variants
            of algorithms. The analysis will be used to create optimized implementations.
            """
            
            response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are Captain's advanced code analysis engine. Provide comprehensive performance analysis with specific, actionable optimization recommendations."
                    },
                    {
                        "role": "user", 
                        "content": f"Perform deep analysis of this {language} code for {target.lower()} optimization. Provide specific algorithmic improvements and performance enhancement strategies."
                    }
                ],
                extra_body={
                    "captain": {
                        "context": full_context
                    }
                }
            )
            
            analysis_text = response.choices[0].message.content
            
            # Parse analysis into structured format
            analysis_result = {
                "language": language,
                "target": target,
                "complexity": self._extract_complexity(analysis_text),
                "bottlenecks": self._extract_bottlenecks(analysis_text),
                "patterns": self._extract_patterns(analysis_text),
                "suggestions": self._extract_suggestions(analysis_text),
                "raw_analysis": analysis_text
            }
            
            return analysis_result
            
        except Exception as e:
            print(f"Captain analysis error: {e}")
            return {
                "error": str(e),
                "language": language,
                "target": target,
                "patterns": [],
                "suggestions": []
            }
    
    def _extract_complexity(self, analysis: str) -> str:
        """Extract algorithmic complexity from analysis"""
        complexity_indicators = ["O(", "complexity", "time complexity", "space complexity"]
        
        for line in analysis.split('\n'):
            if any(indicator in line.lower() for indicator in complexity_indicators):
                return line.strip()
        
        return "O(n) - Linear complexity (estimated)"
    
    def _extract_bottlenecks(self, analysis: str) -> List[str]:
        """Extract performance bottlenecks from analysis"""
        bottleneck_keywords = [
            "bottleneck", "slow", "inefficient", "redundant", 
            "unnecessary", "costly", "expensive", "loop", "nested"
        ]
        
        bottlenecks = []
        for line in analysis.split('\n'):
            if any(keyword in line.lower() for keyword in bottleneck_keywords):
                bottlenecks.append(line.strip())
        
        return bottlenecks[:5]  # Top 5 bottlenecks
    
    def _extract_patterns(self, analysis: str) -> List[str]:
        """Extract optimization patterns from analysis"""
        pattern_keywords = [
            "caching", "memoization", "dynamic programming", "greedy",
            "divide and conquer", "two pointers", "sliding window",
            "hash map", "binary search", "sorting", "indexing"
        ]
        
        patterns = []
        for keyword in pattern_keywords:
            if keyword in analysis.lower():
                patterns.append(keyword.title())
        
        return list(set(patterns))  # Remove duplicates
    
    def _extract_suggestions(self, analysis: str) -> List[str]:
        """Extract specific optimization suggestions"""
        suggestion_indicators = [
            "suggest", "recommend", "improve", "optimize", "replace",
            "use instead", "consider", "better approach"
        ]
        
        suggestions = []
        for line in analysis.split('\n'):
            if any(indicator in line.lower() for indicator in suggestion_indicators):
                suggestions.append(line.strip())
        
        return suggestions[:10]  # Top 10 suggestions