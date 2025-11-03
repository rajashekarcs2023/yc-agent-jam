# Live Code Experiment MCP Server

A custom Model Context Protocol (MCP) server designed for the Live Code Experiment Agent platform. This server provides specialized tools for code optimization, performance analysis, and algorithmic pattern recognition.

## YC Agent Jam 2024

This MCP server was built as part of our YC Agent Jam 2024 submission, showcasing advanced MCP capabilities and integration with our Live Code Experiment Agent.

## Features

### 🔬 Advanced Code Analysis
- **Complexity Analysis**: Automatic Big O time/space complexity detection
- **Optimization Opportunities**: Identifies performance bottlenecks and improvement areas
- **Pattern Recognition**: Detects applicable algorithmic patterns (DP, caching, two-pointers, etc.)

### 📊 Performance Benchmarking
- **Multi-Variant Testing**: Compare multiple optimized code variants
- **Realistic Simulation**: Performance estimation based on algorithmic complexity
- **Improvement Metrics**: Quantitative analysis of optimization benefits

### 🧪 Test Case Generation
- **Comprehensive Coverage**: Edge cases, performance, correctness, error handling
- **Language-Specific**: Tailored test strategies for different programming languages
- **Framework Recommendations**: Suggests appropriate testing frameworks

### 📈 Optimization Reporting
- **Visual Charts**: ASCII-based performance visualizations
- **Prioritized Recommendations**: Impact vs effort analysis
- **Production Guidance**: Deployment and monitoring recommendations

## Available Tools

1. **`analyze_code_complexity`** - Deep analysis of algorithmic complexity and optimization opportunities
2. **`benchmark_performance`** - Performance comparison between code variants
3. **`detect_optimization_patterns`** - Pattern applicability assessment
4. **`generate_test_cases`** - Comprehensive test case generation
5. **`create_optimization_report`** - Executive summary with visualizations

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### As a Standalone MCP Server
```bash
npm run start
```

### Integration with MCP Clients
Add to your MCP client configuration:
```json
{
  "mcpServers": {
    "live-code-experiment": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "./mcp-server"
    }
  }
}
```

### With Live Code Experiment Platform
Our main platform automatically integrates with this MCP server to provide enhanced code analysis capabilities.

## Example Usage

### Code Complexity Analysis
```json
{
  "tool": "analyze_code_complexity",
  "arguments": {
    "code": "function bubbleSort(arr) { for(let i = 0; i < arr.length; i++) { for(let j = 0; j < arr.length - 1; j++) { if(arr[j] > arr[j+1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]]; } } } return arr; }",
    "language": "javascript",
    "optimization_target": "performance",
    "include_patterns": true,
    "include_complexity": true
  }
}
```

### Performance Benchmarking
```json
{
  "tool": "benchmark_performance", 
  "arguments": {
    "original_code": "function sort(arr) { return arr.sort(); }",
    "optimized_variants": [
      {
        "name": "Quick Sort",
        "code": "function quickSort(arr) { /* optimized implementation */ }",
        "description": "Divide and conquer sorting algorithm"
      }
    ],
    "language": "javascript",
    "test_iterations": 1000
  }
}
```

## Technical Architecture

- **Protocol**: Model Context Protocol (MCP) 0.5.0
- **Transport**: StdIO-based communication
- **Language**: TypeScript/Node.js
- **Error Handling**: Comprehensive error management with proper MCP error codes
- **Capabilities**: Tool calling with structured JSON schemas

## Integration Points

This MCP server integrates seamlessly with:

- **Captain API**: Unlimited context processing for large codebases
- **Morph API**: Fast Apply code generation based on analysis results
- **Metorial API**: Research augmentation via Exa search
- **E2B Sandboxes**: Real code execution and performance testing

## Contributing

This project is part of our YC Agent Jam 2024 submission. For questions or collaboration opportunities, please reach out to the team.

## License

MIT License - Built for YC Agent Jam 2024