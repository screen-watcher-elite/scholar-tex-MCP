/**
 * TikZ Diagram Generator for Academic Publications & Reports
 * Produces clean, compilable, publication-grade TikZ code for
 * Neural Networks, Transformers, Autograd DAGs, Coordinate Transforms, and Loss Surfaces.
 */

export interface TikzOptions {
  standalone?: boolean;
  colorTheme?: "academic" | "modern_dark" | "grayscale";
  layers?: number[]; // e.g. [3, 5, 2] for MLP
  title?: string;
  labels?: string[];
}

export function generateNeuralNetworkTikz(layers: number[] = [3, 4, 2], standalone: boolean = false): string {
  const code: string[] = [];
  if (standalone) {
    code.push("\\documentclass[tikz,border=10pt]{standalone}");
    code.push("\\usepackage{tikz}");
    code.push("\\usetikzlibrary{positioning,arrows.meta}");
    code.push("\\begin{document}");
  }

  code.push("\\begin{tikzpicture}[");
  code.push("  neuron/.style={circle, draw=blue!80!black, fill=blue!15, thick, minimum size=0.85cm, inner sep=0pt},");
  code.push("  hidden/.style={circle, draw=purple!80!black, fill=purple!15, thick, minimum size=0.85cm, inner sep=0pt},");
  code.push("  output/.style={circle, draw=teal!80!black, fill=teal!15, thick, minimum size=0.85cm, inner sep=0pt},");
  code.push("  synapse/.style={->, >=stealth, draw=black!40, line width=0.6pt}");
  code.push("]");

  // Draw Neurons
  layers.forEach((count, lIdx) => {
    const xPos = lIdx * 2.8;
    const style = lIdx === 0 ? "neuron" : lIdx === layers.length - 1 ? "output" : "hidden";
    const layerLabel = lIdx === 0 ? "Input" : lIdx === layers.length - 1 ? "Output" : `Hidden ${lIdx}`;

    code.push(`  % --- Layer ${lIdx}: ${layerLabel} ---`);
    for (let i = 0; i < count; i++) {
      const yPos = (count - 1) * 0.7 - i * 1.4;
      const nodeLabel = lIdx === 0 ? `$x_{${i + 1}}$` : lIdx === layers.length - 1 ? `$\\hat{y}_{${i + 1}}$` : `$h_{${i + 1}}^{(${lIdx})}$`;
      code.push(`  \\node[${style}] (N_${lIdx}_${i}) at (${xPos.toFixed(1)}, ${yPos.toFixed(1)}) {${nodeLabel}};`);
    }
  });

  // Draw Synapses
  code.push("  % --- Synaptic Interconnections ---");
  for (let l = 0; l < layers.length - 1; l++) {
    for (let i = 0; i < layers[l]; i++) {
      for (let j = 0; j < layers[l + 1]; j++) {
        code.push(`  \\draw[synapse] (N_${l}_${i}) -- (N_${l + 1}_${j});`);
      }
    }
  }

  code.push("\\end{tikzpicture}");

  if (standalone) {
    code.push("\\end{document}");
  }

  return code.join("\n");
}

export function generateTransformerBlockTikz(standalone: boolean = false): string {
  const code: string[] = [];
  if (standalone) {
    code.push("\\documentclass[tikz,border=10pt]{standalone}");
    code.push("\\usepackage{tikz}");
    code.push("\\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}");
    code.push("\\begin{document}");
  }

  code.push("\\begin{tikzpicture}[");
  code.push("  block/.style={rectangle, draw=indigo!80!black, fill=indigo!10, rounded corners=4pt, minimum width=4cm, minimum height=0.9cm, font=\\bfseries\\small, align=center},");
  code.push("  norm/.style={rectangle, draw=amber!80!black, fill=amber!15, rounded corners=3pt, minimum width=3.8cm, minimum height=0.6cm, font=\\footnotesize, align=center},");
  code.push("  residual/.style={->, >=stealth, draw=black!60, rounded corners=6pt, line width=0.8pt},");
  code.push("  flow/.style={->, >=stealth, draw=black!85, line width=1.1pt}");
  code.push("]");

  code.push("  % Nodes");
  code.push("  \\node (input) at (0, 0) {Input Embeddings $X \\in \\mathbb{R}^{B \\times T \\times d}$};");
  code.push("  \\node[norm, above=0.7cm of input] (ln1) {Layer Normalization};");
  code.push("  \\node[block, above=0.7cm of ln1] (mha) {Multi-Head Attention (MHA)\\\\ \\footnotesize $\\text{Softmax}(QK^T/\\sqrt{d_k})V$};");
  code.push("  \\node[circle, draw=black!70, fill=white, inner sep=1pt, above=0.6cm of mha] (add1) {$+$};");
  code.push("  \\node[norm, above=0.6cm of add1] (ln2) {Layer Normalization};");
  code.push("  \\node[block, above=0.7cm of ln2] (ffn) {Position-Wise Feed-Forward (FFN)\\\\ \\footnotesize $\\text{GELU}(W_1 x + b_1)W_2 + b_2$};");
  code.push("  \\node[circle, draw=black!70, fill=white, inner sep=1pt, above=0.6cm of ffn] (add2) {$+$};");
  code.push("  \\node[above=0.7cm of add2] (output) {Block Output $Y \\in \\mathbb{R}^{B \\times T \\times d}$};");

  code.push("  % Main flow connections");
  code.push("  \\draw[flow] (input) -- (ln1);");
  code.push("  \\draw[flow] (ln1) -- (mha);");
  code.push("  \\draw[flow] (mha) -- (add1);");
  code.push("  \\draw[flow] (add1) -- (ln2);");
  code.push("  \\draw[flow] (ln2) -- (ffn);");
  code.push("  \\draw[flow] (ffn) -- (add2);");
  code.push("  \\draw[flow] (add2) -- (output);");

  code.push("  % Residual skip connections");
  code.push("  \\draw[residual] ($(input.north)+(0,0.2)$) -- ++(-2.6,0) |- (add1);");
  code.push("  \\draw[residual] ($(add1.north)+(0,0.2)$) -- ++(-2.6,0) |- (add2);");

  code.push("\\end{tikzpicture}");

  if (standalone) {
    code.push("\\end{document}");
  }

  return code.join("\n");
}

export function generateAutogradDagTikz(standalone: boolean = false): string {
  const code: string[] = [];
  if (standalone) {
    code.push("\\documentclass[tikz,border=10pt]{standalone}");
    code.push("\\usepackage{tikz}");
    code.push("\\usetikzlibrary{positioning,shapes.geometric,arrows.meta}");
    code.push("\\begin{document}");
  }

  code.push("\\begin{tikzpicture}[");
  code.push("  leaf/.style={circle, draw=teal!80!black, fill=teal!15, thick, minimum size=0.9cm, font=\\small},");
  code.push("  op/.style={rectangle, draw=purple!80!black, fill=purple!15, rounded corners=3pt, thick, minimum size=0.85cm, font=\\bfseries},");
  code.push("  loss/.style={rectangle, draw=rose!80!black, fill=red!15, rounded corners=4pt, thick, minimum size=0.95cm, font=\\bfseries},");
  code.push("  fwd/.style={->, >=stealth, draw=cyan!80!black, line width=1.2pt},");
  code.push("  bwd/.style={->, >=stealth, dashed, draw=amber!90!black, line width=1.2pt}");
  code.push("]");

  code.push("  % Nodes");
  code.push("  \\node[leaf] (x) at (0, 1.5) {$x$};");
  code.push("  \\node[leaf] (w) at (0, -0.5) {$w$};");
  code.push("  \\node[op] (mul) at (2.2, 0.5) {$\\times$};");
  code.push("  \\node[leaf] (b) at (2.2, -1.5) {$b$};");
  code.push("  \\node[op] (add) at (4.4, -0.5) {$+$};");
  code.push("  \\node[op] (act) at (6.4, -0.5) {$\\sigma$};");
  code.push("  \\node[loss] (loss) at (8.6, -0.5) {$\\mathcal{L}$};");

  code.push("  % Forward Arrows (Cyan)");
  code.push("  \\draw[fwd] (x) -- node[above, font=\\footnotesize, text=cyan!80!black] {$x$} (mul);");
  code.push("  \\draw[fwd] (w) -- node[below, font=\\footnotesize, text=cyan!80!black] {$w$} (mul);");
  code.push("  \\draw[fwd] (mul) -- node[above, font=\\footnotesize, text=cyan!80!black] {$z_1$} (add);");
  code.push("  \\draw[fwd] (b) -- node[below, font=\\footnotesize, text=cyan!80!black] {$b$} (add);");
  code.push("  \\draw[fwd] (add) -- node[above, font=\\footnotesize, text=cyan!80!black] {$z$} (act);");
  code.push("  \\draw[fwd] (act) -- node[above, font=\\footnotesize, text=cyan!80!black] {$a$} (loss);");

  code.push("  % Backward Gradient Arrows (Amber, Curved)");
  code.push("  \\draw[bwd] (loss) to[bend left=25] node[below, font=\\footnotesize, text=amber!90!black] {$\\frac{\\partial \\mathcal{L}}{\\partial a}$} (act);");
  code.push("  \\draw[bwd] (act) to[bend left=25] node[below, font=\\footnotesize, text=amber!90!black] {$\\frac{\\partial \\mathcal{L}}{\\partial z}$} (add);");
  code.push("  \\draw[bwd] (add) to[bend left=25] node[below, font=\\footnotesize, text=amber!90!black] {$\\frac{\\partial \\mathcal{L}}{\\partial z_1}$} (mul);");
  code.push("  \\draw[bwd] (mul) to[bend left=25] node[above left, font=\\footnotesize, text=amber!90!black] {$\\frac{\\partial \\mathcal{L}}{\\partial w}$} (w);");

  code.push("  % Legend");
  code.push("  \\node[draw, rounded corners, fill=gray!5, font=\\footnotesize, below=1.2cm of add] {");
  code.push("    \\textcolor{cyan!80!black}{\\textbf{--- Forward Evaluation}} \\quad");
  code.push("    \\textcolor{amber!90!black}{\\textbf{- - - Reverse Chain Rule (Gradients)}}");
  code.push("  };");

  code.push("\\end{tikzpicture}");

  if (standalone) {
    code.push("\\end{document}");
  }

  return code.join("\n");
}

export function generateCoordinateTransformTikz(matrix: [number, number, number, number] = [1.5, 0.5, 0.5, 1.2], standalone: boolean = false): string {
  const [a, b, c, d] = matrix;
  const det = (a * d - b * c).toFixed(2);

  const code: string[] = [];
  if (standalone) {
    code.push("\\documentclass[tikz,border=10pt]{standalone}");
    code.push("\\usepackage{tikz,amsmath}");
    code.push("\\usetikzlibrary{arrows.meta}");
    code.push("\\begin{document}");
  }

  code.push("\\begin{tikzpicture}[scale=1.5, >=stealth]");
  code.push("  % Coordinate Axes");
  code.push("  \\draw[->, color=gray!60] (-1.5, 0) -- (3.5, 0) node[right] {$x$};");
  code.push("  \\draw[->, color=gray!60] (0, -1.5) -- (0, 3.5) node[above] {$y$};");

  code.push("  % Original Unit Square (dashed)");
  code.push("  \\draw[dashed, color=gray!70, thick] (0, 0) -- (1, 0) -- (1, 1) -- (0, 1) -- cycle;");

  code.push(`  % Transformed Parallelogram Area: det = ${det}`);
  code.push(`  \\fill[fill=amber!20, draw=amber!80!black, thick] (0, 0) -- (${a}, ${c}) -- (${(a + b).toFixed(2)}, ${(c + d).toFixed(2)}) -- (${b}, ${d}) -- cycle;`);

  code.push(`  % Transformed Basis Vectors`);
  code.push(`  \\draw[->, line width=1.4pt, color=rose!80!black] (0, 0) -- (${a}, ${c}) node[below right] {$A\\hat{i} = [${a}, ${c}]^T$};`);
  code.push(`  \\draw[->, line width=1.4pt, color=teal!80!black] (0, 0) -- (${b}, ${d}) node[above left] {$A\\hat{j} = [${b}, ${d}]^T$};`);

  code.push("  % Annotations");
  code.push(`  \\node[draw, rounded corners, fill=white, font=\\small] at (1.5, 2.8) {$\\det(A) = ${det}$};`);
  code.push("\\end{tikzpicture}");

  if (standalone) {
    code.push("\\end{document}");
  }

  return code.join("\n");
}
