#!/usr/bin/env node
/**
 * ScholarTex MCP Server
 *
 * An academic mathematical proof, derivation, and LaTeX publishing engine.
 * Designed for undergraduate AI & Machine Learning coursework, research papers,
 * viva defense preparation, and publication-ready TikZ diagram synthesis.
 *
 * Tools:
 *   - derive_step_by_step: Complete algebraic proofs with justifications and viva traps
 *   - verify_matrix_dimensions: Rigorous tensor shape verification & dimensional analysis table
 *   - generate_tikz_diagram: Publication-grade TikZ diagrams (MLP, Transformer, Autograd, 2D/3D Transforms)
 *   - format_latex_document: Complete compilable Overleaf-ready LaTeX documents (Article, IEEE, Beamer, Cheat Sheet)
 *   - render_math_chalkboard: Terminal-friendly Unicode blackboard formatting
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getDerivation, CANONICAL_DERIVATIONS } from "./derivations.js";
import { verifyExpressionDimensions } from "./dimensions.js";
import {
  generateNeuralNetworkTikz,
  generateTransformerBlockTikz,
  generateAutogradDagTikz,
  generateCoordinateTransformTikz
} from "./tikz.js";
import { generateLatexDocument } from "./latex_docs.js";
import { renderChalkboardBox, formatUnicodeMath } from "./chalkboard.js";

const server = new McpServer({
  name: "scholar-tex-mcp",
  version: "1.0.0"
});

// ── Tool 1: Step-by-Step Mathematical Derivations ───────────────────────────

server.tool(
  "derive_step_by_step",
  "Generate a university-grade, step-by-step mathematical derivation with algebraic justifications, LaTeX align block, and common viva exam pitfalls.",
  {
    topic: z.string().describe("Topic or equation name (e.g., 'backprop_chain_rule', 'softmax_cross_entropy_gradient', 'svd_decomposition', 'pca_variance_maximization', 'ridge_regression_normal_equations', 'gram_schmidt_process')"),
    verbosity: z.enum(["concise", "pedagogical_detailed"]).default("pedagogical_detailed").describe("Level of explanation detail"),
    includeLatexSnippet: z.boolean().default(true).describe("Whether to include ready-to-copy LaTeX align* block")
  },
  async ({ topic, verbosity, includeLatexSnippet }) => {
    const deriv = getDerivation(topic);

    let output = `## 📐 ${deriv.title}\n`;
    output += `**Field / Curriculum**: ${deriv.topic}\n\n`;

    output += `### 📌 Assumptions & Notation\n`;
    deriv.assumptions.forEach(a => { output += `- ${a}\n`; });

    output += `\n### 🎯 Target Statement\n$$${deriv.targetStatement}$$\n\n`;

    output += `### 📝 Step-by-Step Algebraic Derivation\n`;
    deriv.steps.forEach(s => {
      output += `**Step ${s.stepNumber}: ${s.description}**\n`;
      output += `$$${s.mathLatex}$$\n`;
      if (verbosity === "pedagogical_detailed") {
        output += `*Justification*: ${s.justification}\n\n`;
      }
    });

    output += `### 🎓 University Viva Exam Pitfalls & Traps\n`;
    deriv.vivaExamPitfalls.forEach(p => { output += `- ⚠️ ${p}\n`; });

    if (includeLatexSnippet) {
      output += `\n### 📋 LaTeX Source (Ready for Overleaf)\n\`\`\`latex\n${deriv.fullLatexDocumentSnippet}\n\`\`\`\n`;
    }

    return {
      content: [{ type: "text" as const, text: output }]
    };
  }
);

// ── Tool 2: Matrix & Tensor Dimension Verification ───────────────────────────

server.tool(
  "verify_matrix_dimensions",
  "Sanity-check tensor/matrix dimensions across multi-term expressions (e.g. W·x + b), verify inner dimension compatibility, detect broadcasting, and generate a LaTeX dimensional analysis table.",
  {
    variables: z.array(z.object({
      name: z.string().describe("Variable or symbol name (e.g. 'W', 'x', 'b')"),
      shape: z.string().describe("Shape string, e.g. '(d_out, d_in)', '(128, 768)', '(B, T, d)'")
    })).describe("List of tensors and declared dimensions"),
    expression: z.string().describe("Target expression to evaluate (e.g. 'W * x + b', 'Q * K^T / sqrt(d_k)')"),
    intendedOutputShape: z.string().optional().describe("Expected output shape to check against")
  },
  async ({ variables, expression, intendedOutputShape }) => {
    const res = verifyExpressionDimensions(variables, expression, intendedOutputShape);

    let output = `## 🔍 Matrix Dimension Verification Report\n`;
    output += `**Expression**: \`${res.expression}\`\n`;
    output += `**Verification Status**: ${res.valid ? "✅ VALID COMPATIBILITY" : "❌ DIMENSION MISMATCH"}\n`;
    output += `**Inferred Output Shape**: \`(${res.inferredShape.join(", ")})\`\n\n`;

    output += `### 🪜 Step-by-Step Analysis\n`;
    res.derivationSteps.forEach(s => { output += `- ${s}\n`; });

    if (res.warnings.length > 0) {
      output += `\n### ⚠️ Warnings & Incompatibilities\n`;
      res.warnings.forEach(w => { output += `- ${w}\n`; });
    }

    output += `\n### 📋 LaTeX Dimensional Analysis Table\n\`\`\`latex\n${res.latexTable}\n\`\`\`\n`;

    return {
      content: [{ type: "text" as const, text: output }]
    };
  }
);

// ── Tool 3: TikZ Diagram Generator ───────────────────────────────────────────

server.tool(
  "generate_tikz_diagram",
  "Synthesize publication-grade, compilable TikZ diagrams for Neural Network MLPs, Transformer blocks, Autograd DAGs, and 2D/3D Coordinate Transformations.",
  {
    diagramType: z.enum([
      "neural_network",
      "transformer_block",
      "computational_graph",
      "coordinate_transformation"
    ]).describe("Type of academic diagram to generate"),
    standalone: z.boolean().default(true).describe("Whether to include \\documentclass{standalone} header"),
    layerSizes: z.array(z.number()).optional().describe("Neuron counts per layer (only for neural_network, e.g. [3, 5, 2])"),
    matrix: z.array(z.number()).length(4).optional().describe("2x2 matrix entries [a, b, c, d] for coordinate_transformation")
  },
  async ({ diagramType, standalone, layerSizes, matrix }) => {
    let tikzCode = "";

    switch (diagramType) {
      case "neural_network":
        tikzCode = generateNeuralNetworkTikz(layerSizes || [3, 4, 2], standalone);
        break;
      case "transformer_block":
        tikzCode = generateTransformerBlockTikz(standalone);
        break;
      case "computational_graph":
        tikzCode = generateAutogradDagTikz(standalone);
        break;
      case "coordinate_transformation":
        const m: [number, number, number, number] = (matrix && matrix.length === 4)
          ? [matrix[0]!, matrix[1]!, matrix[2]!, matrix[3]!]
          : [1.5, 0.5, 0.5, 1.2];
        tikzCode = generateCoordinateTransformTikz(m, standalone);
        break;
    }

    let output = `## 🎨 TikZ Diagram Code: \`${diagramType}\`\n`;
    output += `**Format**: ${standalone ? "Standalone Compilable Document" : "Embeddable Figure Snippet"}\n\n`;
    output += `\`\`\`latex\n${tikzCode}\n\`\`\`\n\n`;
    output += `💡 **Usage**: Paste directly into Overleaf or compile using \`pdflatex diagram.tex\`. Requires packages \`\\usepackage{tikz}\` and standard libraries.`;

    return {
      content: [{ type: "text" as const, text: output }]
    };
  }
);

// ── Tool 4: Complete LaTeX Document Formatter ─────────────────────────────────

server.tool(
  "format_latex_document",
  "Generate a complete, modern Overleaf-ready LaTeX document (Article, IEEE Conference, Beamer Presentation Slides, or Formula Cheat Sheet).",
  {
    docType: z.enum(["article", "ieee_conference", "beamer_slides", "exam_viva_report", "cheat_sheet"]).describe("Target document style"),
    title: z.string().describe("Document title"),
    authors: z.array(z.object({
      name: z.string(),
      affiliation: z.string().optional(),
      email: z.string().optional()
    })).describe("List of authors"),
    abstract: z.string().optional().describe("Abstract summary"),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string(),
      equations: z.array(z.string()).optional()
    })).describe("List of body sections"),
    keywords: z.array(z.string()).optional().describe("Academic keywords"),
    bibEntries: z.array(z.string()).optional().describe("List of citation strings")
  },
  async (params) => {
    const doc = generateLatexDocument(params);
    let output = `## 📄 LaTeX Document Template (${params.docType})\n`;
    output += `**Title**: ${params.title}\n`;
    output += `**Authors**: ${params.authors.map(a => a.name).join(", ")}\n\n`;
    output += `\`\`\`latex\n${doc}\n\`\`\`\n`;

    return {
      content: [{ type: "text" as const, text: output }]
    };
  }
);

// ── Tool 5: Unicode Chalkboard Preview ───────────────────────────────────────

server.tool(
  "render_math_chalkboard",
  "Render clean Unicode chalkboard ASCII/box formatting for terminal or markdown notes, eliminating raw broken LaTeX math syntax.",
  {
    title: z.string().describe("Chalkboard box header title"),
    equations: z.array(z.string()).describe("List of equations or LaTeX formulas to format into Unicode"),
    notes: z.array(z.string()).optional().describe("Key takeaways or bullet points")
  },
  async ({ title, equations, notes }) => {
    const box = renderChalkboardBox(title, equations, notes || []);
    return {
      content: [{ type: "text" as const, text: "```text\n" + box + "\n```" }]
    };
  }
);

// ── Server Startup ──────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[ScholarTex MCP] Server running on stdio transport");
}

main().catch((err) => {
  console.error("[ScholarTex MCP] Fatal server error:", err);
  process.exit(1);
});
