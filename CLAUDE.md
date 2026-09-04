# ScholarTex MCP — Project Guidelines for Claude Code

> Architectural conventions, mathematical proof guidelines, and development notes for Claude Code when maintaining or extending **ScholarTex MCP**.

---

## 🧭 Project Mission & Overview

**ScholarTex MCP** is an academic mathematical proof, derivation, and LaTeX publishing Model Context Protocol (MCP) server. Built for undergraduate AI & Machine Learning coursework (Walchand College of Engineering) and research paper authoring.

It provides Claude Code with tools to:
1. Generate rigorous, step-by-step algebraic derivations with explicit justifications and viva exam traps (`derive_step_by_step`).
2. Verify matrix and tensor dimension compatibility across multi-term expressions and emit LaTeX dimension tables (`verify_matrix_dimensions`).
3. Synthesize publication-grade TikZ diagrams for Neural Networks, Transformer blocks, Autograd DAGs, and coordinate transforms (`generate_tikz_diagram`).
4. Format complete Overleaf-ready LaTeX documents in Article, IEEE, Beamer, and Cheat Sheet layouts (`format_latex_document`).
5. Render clean Unicode blackboard math summaries for plain-text terminals (`render_math_chalkboard`).

---

## 🏗️ Architecture & File Structure

```
scholar-tex-mcp/
├── CLAUDE.md             # Project guidelines and memory for Claude Code
├── .claude/              # Claude Code project settings and memory
│   ├── settings.json     # Permitted tools and environment settings
│   └── project_context.md# High-level architecture memory & mathematical notes
├── src/
│   ├── index.ts          # McpServer initialization & tool handlers (Stdio transport)
│   ├── derivations.ts    # Canonical derivations knowledge base & proof templates
│   ├── dimensions.ts     # Tensor shape parsing, matrix multiplication rules & LaTeX table
│   ├── tikz.ts           # Publication-ready TikZ diagram generators
│   ├── latex_docs.ts     # Overleaf-ready document formatting templates
│   └── chalkboard.ts     # Unicode blackboard text formatter
├── dist/                 # Compiled JavaScript output
├── package.json          # Dependencies & build scripts
├── tsconfig.json         # NodeNext TypeScript configuration
└── README.md             # Public documentation & tool catalog
```

---

## 📐 Mathematical Rigor & Conventions

1. **Step-by-Step Justifications**: Every single equation transformation must have an explicit mathematical reason (e.g. Spectral Theorem, quotient rule of logarithms, outer product property, KKT conditions).
2. **Standard Notation**:
   - Vectors: lowercase bold or italic with explicit dimensions (e.g., $x \in \mathbb{R}^n$).
   - Matrices: uppercase (e.g., $W \in \mathbb{R}^{m \times n}$).
   - Jacobians: Numerator layout by default (gradient of scalar w.r.t matrix matches matrix shape).
3. **Compilation Guarantee**: All generated LaTeX and TikZ code must compile under standard TeX Live / Overleaf without requiring obscure non-standard packages.
