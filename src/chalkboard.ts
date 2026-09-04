/**
 * Unicode Chalkboard Rendering Engine
 * Converts LaTeX formulas or mathematical constructs into clean,
 * terminal-friendly and markdown-safe Unicode blackboard representations.
 */

export function renderChalkboardBox(title: string, equations: string[], notes: string[] = []): string {
  const width = 64;
  const border = "═".repeat(width - 2);
  const thinBorder = "─".repeat(width - 2);

  const lines: string[] = [];
  lines.push(`╔${border}╗`);
  lines.push(`║ 📐 ${padRight(title, width - 6)} ║`);
  lines.push(`╠${border}╣`);

  equations.forEach(eq => {
    const cleanEq = formatUnicodeMath(eq);
    lines.push(`║   ${padRight(cleanEq, width - 6)} ║`);
  });

  if (notes.length > 0) {
    lines.push(`╟${thinBorder}╢`);
    notes.forEach(note => {
      lines.push(`║ • ${padRight(note, width - 6)} ║`);
    });
  }

  lines.push(`╚${border}╝`);
  return lines.join("\n");
}

export function formatUnicodeMath(latex: string): string {
  return latex
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\mathbb\{C\}/g, "ℂ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\Sigma/g, "Σ")
    .replace(/\\delta/g, "δ")
    .replace(/\\nabla/g, "∇")
    .replace(/\\partial/g, "∂")
    .replace(/\\theta/g, "θ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\mu/g, "μ")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\approx/g, "≈")
    .replace(/\\neq/g, "≠")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\infty/g, "∞")
    .replace(/\\in/g, "∈")
    .replace(/\\forall/g, "∀")
    .replace(/\\sum/g, "∑")
    .replace(/\\prod/g, "∏")
    .replace(/\\sqrt/g, "√")
    .replace(/\\quad/g, "  ")
    .replace(/\\qquad/g, "    ")
    .replace(/\\dots/g, "...")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\mathbf\{([^}]+)\}/g, "$1")
    .replace(/\\bm\{([^}]+)\}/g, "$1")
    .replace(/_1/g, "₁")
    .replace(/_2/g, "₂")
    .replace(/_i/g, "ᵢ")
    .replace(/_j/g, "ⱼ")
    .replace(/_k/g, "ₖ")
    .replace(/_n/g, "ₙ")
    .replace(/\^2/g, "²")
    .replace(/\^T/g, "ᵀ")
    .replace(/\^\{-1\}/g, "⁻¹")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\\\/g, "")
    .replace(/[{}]/g, "")
    .trim();
}

function padRight(str: string, length: number): string {
  if (str.length >= length) return str.slice(0, length);
  return str + " ".repeat(length - str.length);
}
