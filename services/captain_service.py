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
        """Analyze code for optimization opportunities using Captain's unlimited context"""
        try:
            # Create context for Captain analysis
            analysis_context = f"""
            Code Analysis Context:
            - Language: {language}
            - Optimization Target: {target}
            - Code Length: {len(code)} characters
            
            Original Code:
            {code}
            
            Performance Analysis Requirements:
            - Identify algorithmic complexity
            - Find bottlenecks and inefficiencies
            - Suggest optimization patterns
            - Identify data structure improvements
            - Find redundant operations
            """
            
            response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert code performance analyst. Analyze the provided code and identify specific optimization opportunities."
                    },
                    {
                        "role": "user", 
                        "content": f"Analyze this {language} code for {target.lower()} optimization opportunities. Focus on algorithmic improvements and performance bottlenecks."
                    }
                ],
                extra_body={
                    "captain": {
                        "context": analysis_context
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