# ScholarTex MCP Server 📐📝

[![MCP](https://img.shields.io/badge/MCP-Standard-blue.svg)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)

An academic mathematical proof, step-by-step derivation, and publication-grade LaTeX synthesis engine for Claude Code and Antigravity. Built specifically for undergraduate coursework in Artificial Intelligence & Machine Learning (Linear Algebra, Multivariable Calculus, Optimization, Deep Learning, and Viva Examination defense).

---

## ✨ Capabilities & Tool Catalog

### 1. `derive_step_by_step`
Computes university-grade, step-by-step algebraic derivations with explicit justifications for every single equation transition, complete with common undergraduate viva examination traps.
- **Canonical Derivations Included**:
  - `softmax_cross_entropy_gradient`: Multi-class cross entropy gradient $\nabla_z L = p - y$ with Kronecker delta Jacobian.
  - `backprop_chain_rule`: Vector-matrix reverse-mode backpropagation $\frac{\partial L}{\partial W} = \delta x^T$, $\frac{\partial L}{\partial x} = W^T \delta$.
  - `ridge_regression_normal_equations`: Tikhonov regularization $w^* = (X^T X + \lambda I)^{-1} X^T y$ and positive-definiteness proof.
  - `svd_decomposition`: Derivation of Singular Value Decomposition $A = U \Sigma V^T$ via Spectral Theorem on $A^T A$.
  - `pca_variance_maximization`: Constrained Rayleigh quotient maximization via Lagrange multipliers ($\Sigma u = \lambda u$).
  - `gram_schmidt_process`: Orthogonal projection formulas and pairwise orthogonality inductive proofs.
- **Output**: Formatted markdown with LaTeX `align*` environments ready for Overleaf.

### 2. `verify_matrix_dimensions`
Performs rigorous dimensional analysis on complex matrix equations (e.g. $W x + b$, $Q K^T / \sqrt{d_k}$, Jacobians).
- Validates inner dimension alignment for matrix multiplication.
- Detects broadcasting rules across batch axes.
- Emits a publication-ready LaTeX `table` documenting variable shapes and compatibility.

### 3. `generate_tikz_diagram`
Synthesizes clean, compilable, publication-grade TikZ diagrams:
- **`neural_network`**: Multi-layer perceptron (MLP) with custom layer sizing, shaded circular neurons, synaptic edges, and activation chips.
- **`transformer_block`**: Self-attention, multi-head attention, Add & Norm residual connections, and position-wise feed-forward networks.
- **`computational_graph`**: Reverse-mode autograd DAGs with cyan forward activations and amber backward gradient flows.
- **`coordinate_transformation`**: 2D basis vector transformation showing original unit square vs transformed parallelogram with signed determinant area.

### 4. `format_latex_document`
Generates complete, compilable Overleaf-ready `.tex` documents with modern typography (`microtype`, `booktabs`, `amsmath`, `amsthm`, `hyperref`):
- `article`: Academic project reports with theorem, lemma, and definition environments.
- `ieee_conference`: Two-column IEEE format for engineering conference papers.
- `beamer_slides`: Modern presentation slides with clean frames and math environments.
- `cheat_sheet`: 3-column compact landscape formula cheat sheets.

### 5. `render_math_chalkboard`
Produces clean Unicode chalkboard box formatting for terminals and markdown notes, avoiding broken `$` LaTeX rendering in plain text.

---

## 🚀 Quickstart & Installation

```bash
# Clone or navigate to the repository
cd scholar-tex-mcp

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Configure with Claude Code / Antigravity MCP

Add to your `mcp_config.json` (or `.agents/mcp_config.json`):

```json
{
  "mcpServers": {
    "scholar-tex": {
      "command": "node",
      "args": ["C:/(your-selected-folder)browser-vision-mcp/dist/index.js"]
    }
  }
}
```

---

## 👨‍💻 Author
**Ashutosh** ([@screen-watcher-elite](https://github.com/screen-watcher-elite))  
Walchand College of Engineering (WCE), Sangli • B.Tech AI & Machine Learning
