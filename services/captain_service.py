"""
Captain Service - Unlimited context code analysis
Uses Captain API for processing entire codebases
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
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
        """Analyze code using Captain's unlimited context processing with advanced features"""
        try:
            # Use Captain's Data Lake for unlimited context processing
            full_context = f"""
            COMPREHENSIVE CODEBASE ANALYSIS REQUEST
            ======================================
            
            METADATA:
            - Language: {language}
            - Optimization Target: {target}
            - Code Size: {len(code)} characters
            - Analysis Timestamp: {self._get_timestamp()}
            - Platform: Live Code Experiment Agent (YC Agent Jam 2024)
            
            ORIGINAL CODE TO ANALYZE:
            ```{language}
            {code}
            ```
            
            DEEP ANALYSIS REQUIREMENTS:
            
            1. ALGORITHMIC COMPLEXITY ANALYSIS
               - Time complexity (Big O notation) with mathematical proof
               - Space complexity analysis including auxiliary space
               - Identify nested loops, recursive patterns, and their impact
               - Memory access patterns and cache efficiency
               - Worst-case, average-case, and best-case scenarios
            
            2. PERFORMANCE BOTTLENECK DETECTION
               - CPU-intensive operations and computational hotspots
               - Memory allocation/deallocation patterns
               - I/O operations and blocking calls
               - Inefficient data structure usage
               - Redundant computations and unnecessary work
               - Branch prediction issues and conditional overhead
            
            3. OPTIMIZATION PATTERN IDENTIFICATION
               - Dynamic programming opportunities with state analysis
               - Memoization potential and cache strategies
               - Two-pointer technique applications
               - Sliding window optimization possibilities
               - Hash map vs array trade-offs
               - Greedy algorithm applicability
               - Divide-and-conquer decomposition opportunities
               - Parallel processing potential
            
            4. LANGUAGE-SPECIFIC OPTIMIZATIONS
               - Built-in function efficiency vs custom implementations
               - Compiler/interpreter optimization hints
               - Memory management best practices
               - Framework-specific performance patterns
               - Platform-specific optimizations
            
            5. SECURITY & RELIABILITY ANALYSIS
               - Potential buffer overflows or memory leaks
               - Input validation and edge case handling
               - Error propagation and exception safety
               - Race conditions in concurrent scenarios
            
            6. SCALABILITY ASSESSMENT
               - How performance degrades with input size
               - Resource usage patterns under load
               - Horizontal vs vertical scaling considerations
               - Bottlenecks that emerge at scale
            
            7. REFACTORING OPPORTUNITIES
               - Code structure improvements
               - Design pattern applications
               - Modularization possibilities
               - Test-driven optimization strategies
            
            CONTEXT: This analysis powers a real-time optimization platform that generates 
            multiple algorithmic variants. The insights will drive automatic code generation 
            using Morph's Fast Apply technology and research augmentation via Metorial's 
            Exa integration. Provide actionable, specific recommendations that can be 
            programmatically applied.
            
            EXPECTED OUTPUT FORMAT:
            - Structured analysis with clear sections
            - Specific optimization recommendations with code examples
            - Quantitative improvement estimates where possible
            - Priority ranking of optimization opportunities
            """
            
            # Use Captain's advanced capabilities with tool calling
            response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system", 
                        "content": """You are Captain's advanced code analysis engine with unlimited context processing. 
                        You have access to comprehensive programming knowledge and can analyze entire codebases.
                        Provide detailed, actionable analysis with specific optimization strategies.
                        Focus on real-world performance improvements that can be measured and verified."""
                    },
                    {
                        "role": "user", 
                        "content": f"""Perform comprehensive analysis of this {language} code for {target.lower()} optimization.
                        
                        Requirements:
                        1. Use your unlimited context capabilities to provide deep analysis
                        2. Consider the entire optimization landscape, not just obvious improvements
                        3. Provide specific, actionable recommendations with implementation hints
                        4. Estimate potential performance gains for each optimization
                        5. Prioritize optimizations by impact and implementation difficulty
                        
                        This analysis will feed into an automated optimization pipeline."""
                    }
                ],
                extra_body={
                    "captain": {
                        "context": full_context,
                        "data_lake": {
                            "enabled": True,
                            "context_size": "unlimited",
                            "analysis_depth": "comprehensive"
                        },
                        "processing_mode": "advanced_analysis",
                        "optimization_focus": target.lower()
                    }
                },
                temperature=0.1,  # Lower temperature for more consistent analysis
                max_tokens=4000   # Allow for comprehensive response
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
    
    def _get_timestamp(self) -> str:
        """Get current timestamp for analysis metadata"""
        return datetime.now().isoformat()
    
    async def analyze_entire_codebase(self, codebase_files: Dict[str, str], optimization_target: str) -> Dict[str, Any]:
        """Analyze entire codebase using Captain's unlimited context"""
        try:
            # Prepare comprehensive codebase context
            codebase_context = f"""
            FULL CODEBASE ANALYSIS REQUEST
            ============================
            
            CODEBASE METADATA:
            - Total Files: {len(codebase_files)}
            - Total Lines: {sum(len(content.split('\n')) for content in codebase_files.values())}
            - Optimization Target: {optimization_target}
            - Analysis Timestamp: {self._get_timestamp()}
            
            COMPLETE CODEBASE STRUCTURE:
            """
            
            # Add all files to context
            for file_path, content in codebase_files.items():
                codebase_context += f"""
            
            FILE: {file_path}
            {'=' * (len(file_path) + 6)}
            ```
            {content}
            ```
            """
            
            codebase_context += f"""
            
            COMPREHENSIVE ANALYSIS REQUIREMENTS:
            1. Cross-file dependency analysis and optimization opportunities
            2. Architecture-level performance bottlenecks
            3. Code duplication and refactoring opportunities
            4. Security vulnerabilities across the entire codebase
            5. Scalability issues that span multiple components
            6. Integration optimization between modules
            7. Overall system performance enhancement strategies
            
            Focus on {optimization_target} optimization across the entire system.
            """
            
            response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system",
                        "content": "You are Captain's enterprise codebase analyzer with unlimited context processing. Analyze the entire codebase holistically and provide system-wide optimization recommendations."
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this complete codebase for {optimization_target} optimization. Provide comprehensive, system-wide recommendations."
                    }
                ],
                extra_body={
                    "captain": {
                        "context": codebase_context,
                        "data_lake": {
                            "enabled": True,
                            "context_size": "unlimited",
                            "analysis_depth": "enterprise"
                        },
                        "processing_mode": "codebase_analysis"
                    }
                },
                temperature=0.1,
                max_tokens=6000
            )
            
            return {
                "codebase_analysis": response.choices[0].message.content,
                "files_analyzed": len(codebase_files),
                "total_lines": sum(len(content.split('\n')) for content in codebase_files.values()),
                "optimization_target": optimization_target,
                "analysis_timestamp": self._get_timestamp()
            }
            
        except Exception as e:
            print(f"Captain codebase analysis error: {e}")
            return {
                "error": str(e),
                "files_analyzed": len(codebase_files),
                "fallback": "Codebase analysis unavailable"
            }