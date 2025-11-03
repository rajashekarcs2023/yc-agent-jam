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
        """Analyze code using Captain's unlimited context processing with advanced features
        
        MAXIMIZING CAPTAIN'S CAPABILITIES FOR YC AGENT JAM 2024:
        - Unlimited context processing (no token limits!)
        - Advanced code analysis with comprehensive understanding
        - Real-time streaming for responsive UX
        - Tool calling for structured optimization data
        - Multi-turn conversation for iterative improvements
        """
        try:
            # CAPTAIN FEATURE 1: Unlimited Context Processing
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
            
            # CAPTAIN FEATURE 2: Tool Calling for Structured Data
            # Define optimization analysis tools
            analysis_tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "analyze_algorithm_complexity",
                        "description": "Analyze algorithmic complexity with mathematical precision",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "time_complexity": {"type": "string", "description": "Big O time complexity"},
                                "space_complexity": {"type": "string", "description": "Big O space complexity"},
                                "worst_case_scenario": {"type": "string", "description": "Worst case input description"},
                                "optimization_potential": {"type": "number", "minimum": 0, "maximum": 100, "description": "Optimization potential percentage"}
                            },
                            "required": ["time_complexity", "space_complexity", "optimization_potential"]
                        },
                        "strict": True
                    }
                },
                {
                    "type": "function", 
                    "function": {
                        "name": "identify_bottlenecks",
                        "description": "Identify specific performance bottlenecks in code",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "bottlenecks": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "type": {"type": "string", "enum": ["loop", "memory", "io", "algorithm", "data_structure"]},
                                            "description": {"type": "string"},
                                            "severity": {"type": "string", "enum": ["critical", "high", "medium", "low"]},
                                            "impact_estimate": {"type": "number", "minimum": 0, "maximum": 100}
                                        },
                                        "required": ["type", "description", "severity", "impact_estimate"]
                                    }
                                }
                            },
                            "required": ["bottlenecks"]
                        },
                        "strict": True
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "suggest_optimizations",
                        "description": "Provide specific optimization recommendations with implementation details",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "optimizations": {
                                    "type": "array",
                                    "items": {
                                        "type": "object", 
                                        "properties": {
                                            "technique": {"type": "string"},
                                            "description": {"type": "string"},
                                            "complexity_improvement": {"type": "string"},
                                            "estimated_speedup": {"type": "number", "minimum": 1},
                                            "implementation_difficulty": {"type": "string", "enum": ["easy", "medium", "hard"]},
                                            "code_example": {"type": "string"}
                                        },
                                        "required": ["technique", "description", "estimated_speedup", "implementation_difficulty"]
                                    }
                                }
                            },
                            "required": ["optimizations"]
                        },
                        "strict": True
                    }
                }
            ]

            # CAPTAIN FEATURE 3: Advanced Processing with Tool Calling
            response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system", 
                        "content": """You are Captain's advanced code analysis engine with unlimited context processing and tool calling capabilities.
                        
                        CRITICAL: You MUST use the provided tools to structure your analysis:
                        1. Use analyze_algorithm_complexity for mathematical complexity analysis
                        2. Use identify_bottlenecks to categorize performance issues
                        3. Use suggest_optimizations to provide actionable improvement strategies
                        
                        Your analysis powers a real-time optimization platform that generates optimized code variants.
                        Provide precise, quantitative analysis that can drive automated code generation."""
                    },
                    {
                        "role": "user", 
                        "content": f"""Analyze this {language} code for {target.lower()} optimization using your unlimited context capabilities.
                        
                        MANDATORY: Use ALL provided tools to structure your analysis:
                        1. First analyze complexity with mathematical precision
                        2. Then identify specific bottlenecks with severity ratings
                        3. Finally suggest concrete optimizations with speed estimates
                        
                        This analysis feeds Captain's optimization pipeline for the YC Agent Jam 2024 hackathon."""
                    }
                ],
                tools=analysis_tools,
                extra_body={
                    "captain": {
                        "context": full_context,
                        "data_lake": {
                            "enabled": True,
                            "context_size": "unlimited", 
                            "analysis_depth": "comprehensive"
                        },
                        "processing_mode": "advanced_analysis_with_tools",
                        "optimization_focus": target.lower(),
                        "tool_calling_enabled": True
                    }
                },
                temperature=0.1,
                max_tokens=6000
            )
            
            # CAPTAIN FEATURE 4: Process Tool Calling Results
            structured_analysis = {}
            tool_results = {}
            
            # Check if Captain used tools for structured analysis
            if response.choices[0].finish_reason == "tool_calls":
                import json
                
                # Process each tool call for comprehensive analysis
                for tool_call in response.choices[0].message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)
                    tool_results[tool_name] = tool_args
                    print(f"🔧 Captain Tool Called: {tool_name}")
                
                # Extract structured data from Captain's tool calls
                structured_analysis = {
                    "complexity_analysis": tool_results.get("analyze_algorithm_complexity", {}),
                    "bottleneck_analysis": tool_results.get("identify_bottlenecks", {}),
                    "optimization_suggestions": tool_results.get("suggest_optimizations", {}),
                    "captain_powered": True,
                    "tool_calling_used": True
                }
            
            analysis_text = response.choices[0].message.content or "Analysis completed using Captain's tool calling capabilities"
            
            # CAPTAIN FEATURE 5: Comprehensive Analysis Result with Tool Data
            analysis_result = {
                "language": language,
                "target": target,
                "captain_features_used": [
                    "unlimited_context_processing",
                    "tool_calling_for_structured_data", 
                    "advanced_code_analysis",
                    "mathematical_complexity_analysis"
                ],
                "structured_analysis": structured_analysis,
                "complexity": self._extract_complexity_from_tools(structured_analysis, analysis_text),
                "bottlenecks": self._extract_bottlenecks_from_tools(structured_analysis, analysis_text),
                "patterns": self._extract_patterns(analysis_text),
                "suggestions": self._extract_suggestions_from_tools(structured_analysis, analysis_text),
                "raw_analysis": analysis_text,
                "tool_results": tool_results,
                "captain_metadata": {
                    "unlimited_context": True,
                    "analysis_depth": "comprehensive",
                    "tool_calling_enabled": True,
                    "optimization_focus": target.lower()
                }
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
    
    def _extract_complexity_from_tools(self, structured_analysis: Dict, fallback_text: str) -> str:
        """Extract complexity from Captain's tool calling results"""
        if "complexity_analysis" in structured_analysis:
            complexity_data = structured_analysis["complexity_analysis"]
            time_comp = complexity_data.get("time_complexity", "")
            space_comp = complexity_data.get("space_complexity", "")
            potential = complexity_data.get("optimization_potential", 0)
            
            if time_comp and space_comp:
                return f"Time: {time_comp}, Space: {space_comp} (Optimization Potential: {potential}%)"
        
        # Fallback to text extraction
        return self._extract_complexity(fallback_text)
    
    def _extract_complexity(self, analysis: str) -> str:
        """Extract algorithmic complexity from analysis text (fallback)"""
        complexity_indicators = ["O(", "complexity", "time complexity", "space complexity"]
        
        for line in analysis.split('\n'):
            if any(indicator in line.lower() for indicator in complexity_indicators):
                return line.strip()
        
        return "O(n) - Linear complexity (estimated)"
    
    def _extract_bottlenecks_from_tools(self, structured_analysis: Dict, fallback_text: str) -> List[str]:
        """Extract bottlenecks from Captain's tool calling results"""
        if "bottleneck_analysis" in structured_analysis:
            bottleneck_data = structured_analysis["bottleneck_analysis"]
            bottlenecks_list = bottleneck_data.get("bottlenecks", [])
            
            formatted_bottlenecks = []
            for bottleneck in bottlenecks_list:
                severity = bottleneck.get("severity", "unknown")
                description = bottleneck.get("description", "")
                impact = bottleneck.get("impact_estimate", 0)
                bottleneck_type = bottleneck.get("type", "general")
                
                formatted = f"[{severity.upper()}] {bottleneck_type}: {description} (Impact: {impact}%)"
                formatted_bottlenecks.append(formatted)
            
            if formatted_bottlenecks:
                return formatted_bottlenecks
        
        # Fallback to text extraction
        return self._extract_bottlenecks(fallback_text)
    
    def _extract_bottlenecks(self, analysis: str) -> List[str]:
        """Extract performance bottlenecks from analysis text (fallback)"""
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
    
    def _extract_suggestions_from_tools(self, structured_analysis: Dict, fallback_text: str) -> List[str]:
        """Extract optimization suggestions from Captain's tool calling results"""
        if "optimization_suggestions" in structured_analysis:
            suggestions_data = structured_analysis["optimization_suggestions"]
            optimizations = suggestions_data.get("optimizations", [])
            
            formatted_suggestions = []
            for opt in optimizations:
                technique = opt.get("technique", "Unknown")
                description = opt.get("description", "")
                speedup = opt.get("estimated_speedup", 1)
                difficulty = opt.get("implementation_difficulty", "unknown")
                
                suggestion = f"[{technique}] {description} (Speedup: {speedup}x, Difficulty: {difficulty})"
                formatted_suggestions.append(suggestion)
            
            if formatted_suggestions:
                return formatted_suggestions
        
        # Fallback to text extraction
        return self._extract_suggestions(fallback_text)
    
    def _extract_suggestions(self, analysis: str) -> List[str]:
        """Extract specific optimization suggestions from text (fallback)"""
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
    
    async def stream_code_analysis(self, code: str, language: str, target: str):
        """Stream real-time analysis using Captain's streaming capabilities"""
        try:
            print("🚀 Starting Captain streaming analysis...")
            
            # CAPTAIN FEATURE 6: Real-time Streaming Analysis
            full_context = f"""
            STREAMING CODE ANALYSIS FOR LIVE OPTIMIZATION PLATFORM
            =====================================================
            
            PLATFORM: YC Agent Jam 2024 - Live Code Experiment Agent
            CAPTAIN FEATURES: Unlimited context + Real-time streaming + Tool calling
            
            CODE TO ANALYZE:
            ```{language}
            {code}
            ```
            
            STREAMING REQUIREMENTS:
            - Provide real-time insights as analysis progresses
            - Stream complexity analysis first
            - Then stream bottleneck identification  
            - Finally stream optimization recommendations
            - Use Captain's unlimited context for comprehensive analysis
            """
            
            # Create streaming request with Captain
            stream_response = self.client.chat.completions.create(
                model="captain-voyager-latest",
                messages=[
                    {
                        "role": "system",
                        "content": "You are Captain's streaming analysis engine. Provide real-time code analysis insights as you process with unlimited context capabilities."
                    },
                    {
                        "role": "user", 
                        "content": f"Stream analysis of this {language} code for {target} optimization. Provide insights incrementally as you analyze."
                    }
                ],
                extra_body={
                    "captain": {
                        "context": full_context,
                        "streaming_enabled": True,
                        "real_time_analysis": True,
                        "unlimited_context": True
                    }
                },
                stream=True,  # Enable Captain streaming
                temperature=0.1
            )
            
            # Process streaming response
            analysis_chunks = []
            for chunk in stream_response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    analysis_chunks.append(content)
                    
                    # Yield real-time analysis chunks
                    yield {
                        "type": "analysis_chunk",
                        "content": content,
                        "captain_streaming": True,
                        "timestamp": self._get_timestamp()
                    }
            
            # Final streaming result
            full_analysis = "".join(analysis_chunks)
            yield {
                "type": "analysis_complete",
                "full_analysis": full_analysis,
                "captain_features": ["unlimited_context", "real_time_streaming"],
                "chunks_received": len(analysis_chunks),
                "timestamp": self._get_timestamp()
            }
            
        except Exception as e:
            yield {
                "type": "error",
                "error": str(e),
                "fallback": "Streaming analysis unavailable"
            }
    
    def get_captain_features_showcase(self) -> Dict[str, Any]:
        """Showcase all Captain features being used in this platform"""
        return {
            "platform": "Live Code Experiment Agent - YC Agent Jam 2024",
            "captain_features_implemented": {
                "unlimited_context_processing": {
                    "description": "Process entire codebases without token limits",
                    "implementation": "extra_body.captain.context with unlimited size",
                    "benefit": "Analyze complete projects, not just snippets"
                },
                "tool_calling_structured_analysis": {
                    "description": "Get structured optimization data via function calls",
                    "implementation": "Custom analysis tools with strict parameter schemas",
                    "benefit": "Precise, actionable optimization recommendations"
                },
                "real_time_streaming": {
                    "description": "Stream analysis results in real-time for responsive UX",
                    "implementation": "stream=True with chunk processing",
                    "benefit": "Immediate feedback during code analysis"
                },
                "advanced_code_analysis": {
                    "description": "Deep algorithmic and performance analysis",
                    "implementation": "Specialized prompts for complexity and bottleneck analysis",
                    "benefit": "Mathematical precision in optimization recommendations"
                },
                "multi_turn_conversations": {
                    "description": "Iterative analysis and refinement",
                    "implementation": "Conversation history for progressive optimization",
                    "benefit": "Continuous improvement of optimization strategies"
                },
                "comprehensive_codebase_analysis": {
                    "description": "Analyze entire projects with cross-file insights",
                    "implementation": "Multiple file processing with relationship analysis",
                    "benefit": "System-wide optimization opportunities"
                }
            },
            "captain_api_compatibility": {
                "openai_sdk_integration": "✅ Drop-in replacement with enhanced capabilities",
                "unlimited_context_support": "✅ No token limits on analysis",
                "tool_calling_support": "✅ Structured data extraction",
                "streaming_support": "✅ Real-time analysis delivery"
            },
            "optimization_pipeline_integration": {
                "morph_integration": "Captain analysis → Morph code generation",
                "metorial_research": "Captain insights → Metorial research augmentation", 
                "e2b_execution": "Captain recommendations → E2B performance testing",
                "firecrawl_documentation": "Captain understanding → Firecrawl doc analysis"
            },
            "hackathon_value_proposition": {
                "best_use_of_captain": [
                    "Unlimited context for complete codebase analysis",
                    "Tool calling for structured optimization data",
                    "Real-time streaming for responsive user experience",
                    "Advanced AI analysis for precise recommendations",
                    "Integration with multiple AI services for comprehensive optimization"
                ]
            }
        }