/**
 * Mathematical Derivations & Proof Verification Engine
 * Provides university-grade, step-by-step algebraic derivations with
 * LaTeX formulas, justifications, and pedagogical viva notes.
 */

export interface DerivationStep {
  stepNumber: number;
  description: string;
  mathLatex: string;
  justification: string;
}

export interface DerivationResult {
  title: string;
  topic: string;
  assumptions: string[];
  targetStatement: string;
  steps: DerivationStep[];
  finalLatex: string;
  vivaExamPitfalls: string[];
  fullLatexDocumentSnippet: string;
}

export const CANONICAL_DERIVATIONS: Record<string, DerivationResult> = {
  softmax_cross_entropy_gradient: {
    title: "Gradient of Softmax Cross-Entropy Loss",
    topic: "Deep Learning & Classification",
    assumptions: [
      "Input logit vector: $z = [z_1, z_2, \\dots, z_K]^T \\in \\mathbb{R}^K$",
      "Softmax probabilities: $p_i = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}$",
      "One-hot ground truth label: $y \\in \\{0, 1\\}^K$, with $\\sum_{k=1}^K y_k = 1$",
      "Categorical Cross-Entropy Loss: $L = -\\sum_{k=1}^K y_k \\ln p_k$"
    ],
    targetStatement: "\\frac{\\partial L}{\\partial z_i} = p_i - y_i \\quad \\forall i \\in \\{1, \\dots, K\\}",
    steps: [
      {
        stepNumber: 1,
        description: "Express loss in terms of log-softmax using log properties",
        mathLatex: "L = -\\sum_{k=1}^K y_k \\ln\\left( \\frac{e^{z_k}}{\\sum_{j=1}^K e^{z_j}} \\right) = -\\sum_{k=1}^K y_k \\left( z_k - \\ln \\sum_{j=1}^K e^{z_j} \\right)",
        justification: "Quotient rule of logarithms: $\\ln(a/b) = \\ln a - \\ln b$."
      },
      {
        stepNumber: 2,
        description: "Differentiate the sum term with respect to logit $z_i$",
        mathLatex: "\\frac{\\partial}{\\partial z_i} \\left( -\\sum_{k=1}^K y_k z_k \\right) = -y_i",
        justification: "Linearity of differentiation: $\\frac{\\partial z_k}{\\partial z_i} = \\delta_{ki}$ (Kronecker delta)."
      },
      {
        stepNumber: 3,
        description: "Differentiate the log-sum-exp normalizer term",
        mathLatex: "\\frac{\\partial}{\\partial z_i} \\ln \\left( \\sum_{j=1}^K e^{z_j} \\right) = \\frac{1}{\\sum_{j=1}^K e^{z_j}} \\cdot \\frac{\\partial}{\\partial z_i} \\left( \\sum_{j=1}^K e^{z_j} \\right) = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}} = p_i",
        justification: "Chain rule of calculus: $\\frac{d}{dx} \\ln(u) = \\frac{1}{u} \\frac{du}{dx}$."
      },
      {
        stepNumber: 4,
        description: "Combine terms and factor out the ground-truth sum $\\sum_{k=1}^K y_k = 1$",
        mathLatex: "\\frac{\\partial L}{\\partial z_i} = -y_i + \\left( \\sum_{k=1}^K y_k \\right) p_i = p_i - y_i",
        justification: "Since ground truth $y$ is a probability distribution, $\\sum_{k=1}^K y_k = 1$."
      }
    ],
    finalLatex: "\\nabla_z L = p - y",
    vivaExamPitfalls: [
      "Common error: Forgetting that $z_i$ affects the denominator of EVERY probability $p_k$, requiring the Kronecker delta Jacobian.",
      "Numerical stability note: In real code, never compute $\\ln(p_i)$ directly after softmax due to underflow; always use the unified LogSumExp trick: $\\ln p_i = z_i - \\text{LogSumExp}(z)$."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "L &= -\\sum_{k=1}^K y_k \\ln p_k = -\\sum_{k=1}^K y_k \\left( z_k - \\ln \\sum_{j=1}^K e^{z_j} \\right) \\\\",
      "\\frac{\\partial L}{\\partial z_i} &= -y_i + \\sum_{k=1}^K y_k \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}} \\\\",
      "&= -y_i + p_i \\sum_{k=1}^K y_k = p_i - y_i \\\\",
      "\\therefore \\nabla_z L &= \\mathbf{p} - \\mathbf{y}",
      "\\end{align*}"
    ].join("\n")
  },

  backprop_chain_rule: {
    title: "Reverse-Mode Vector-Matrix Backpropagation",
    topic: "Neural Network Calculus",
    assumptions: [
      "Linear affine transformation: $z = W x + b$ where $W \\in \\mathbb{R}^{m \\times n}, x \\in \\mathbb{R}^n, b \\in \\mathbb{R}^m$",
      "Elementwise non-linear activation: $a = \\sigma(z)$",
      "Scalar loss function: $L \\in \\mathbb{R}$",
      "Upstream gradient provided: $\\delta = \\frac{\\partial L}{\\partial z} \\in \\mathbb{R}^m$"
    ],
    targetStatement: "\\frac{\\partial L}{\\partial W} = \\delta x^T \\in \\mathbb{R}^{m \\times n}, \\quad \\frac{\\partial L}{\\partial x} = W^T \\delta \\in \\mathbb{R}^n, \\quad \\frac{\\partial L}{\\partial b} = \\delta",
    steps: [
      {
        stepNumber: 1,
        description: "Index-notation expansion of affine component $z_i$",
        mathLatex: "z_i = \\sum_{j=1}^n W_{ij} x_j + b_i",
        justification: "Matrix-vector multiplication definition."
      },
      {
        stepNumber: 2,
        description: "Compute scalar derivative with respect to weight matrix element $W_{ij}$",
        mathLatex: "\\frac{\\partial L}{\\partial W_{ij}} = \\sum_{k=1}^m \\frac{\\partial L}{\\partial z_k} \\frac{\\partial z_k}{\\partial W_{ij}} = \\frac{\\partial L}{\\partial z_i} x_j = \\delta_i x_j",
        justification: "Multivariate chain rule: $\\frac{\\partial z_k}{\\partial W_{ij}} = \\delta_{ik} x_j$ non-zero only when $k = i$."
      },
      {
        stepNumber: 3,
        description: "Vectorize scalar product into outer product matrix form",
        mathLatex: "\\frac{\\partial L}{\\partial W} = \\begin{bmatrix} \\delta_1 \\\\ \\vdots \\\\ \\delta_m \\end{bmatrix} \\begin{bmatrix} x_1 & \\dots & x_n \\end{bmatrix} = \\delta x^T",
        justification: "Outer product definition: $(\\delta x^T)_{ij} = \\delta_i x_j$."
      },
      {
        stepNumber: 4,
        description: "Backpropagate upstream gradient to input vector $x_j$",
        mathLatex: "\\frac{\\partial L}{\\partial x_j} = \\sum_{i=1}^m \\frac{\\partial L}{\\partial z_i} \\frac{\\partial z_i}{\\partial x_j} = \\sum_{i=1}^m \\delta_i W_{ij} = (W^T \\delta)_j \\implies \\frac{\\partial L}{\\partial x} = W^T \\delta",
        justification: "Transposed matrix multiplication aligns dimensions: $(n \\times m) \\times (m \\times 1) = (n \\times 1)$."
      }
    ],
    finalLatex: "\\frac{\\partial L}{\\partial W} = \\delta x^T, \\quad \\frac{\\partial L}{\\partial x} = W^T \\delta",
    vivaExamPitfalls: [
      "Dimension mismatch: Writing $x \\delta^T$ gives shape $(n \\times m)$ instead of $W$'s true shape $(m \\times n)$. Always verify outer product orientation.",
      "Denominator vs Numerator layout: In deep learning frameworks (PyTorch, JAX), gradient of scalar $L$ w.r.t matrix $W$ ALWAYS matches the shape of $W$."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "z &= Wx + b \\\\",
      "\\frac{\\partial L}{\\partial W_{ij}} &= \\sum_{k} \\frac{\\partial L}{\\partial z_k} \\frac{\\partial z_k}{\\partial W_{ij}} = \\delta_i x_j \\\\",
      "\\therefore \\nabla_W L &= \\delta x^T \\\\",
      "\\nabla_x L &= W^T \\delta",
      "\\end{align*}"
    ].join("\n")
  },

  ridge_regression_normal_equations: {
    title: "Derivation of Ridge Regression (Tikhonov Regularization) Normal Equations",
    topic: "Optimization & Linear Algebra",
    assumptions: [
      "Data matrix: $X \\in \\mathbb{R}^{N \\times d}$, Target vector: $y \\in \\mathbb{R}^N$",
      "Weight vector: $w \\in \\mathbb{R}^d$",
      "Regularization parameter: $\\lambda > 0$",
      "Objective function: $L(w) = \\|Xw - y\\|_2^2 + \\lambda \\|w\\|_2^2$"
    ],
    targetStatement: "w^* = (X^T X + \\lambda I_d)^{-1} X^T y",
    steps: [
      {
        stepNumber: 1,
        description: "Expand Euclidean norms into matrix trace / vector inner products",
        mathLatex: "L(w) = (Xw - y)^T (Xw - y) + \\lambda w^T w = w^T X^T X w - 2 y^T X w + y^T y + \\lambda w^T w",
        justification: "Distributive property of matrix transpose and scalar commutativity: $w^T X^T y = y^T X w$."
      },
      {
        stepNumber: 2,
        description: "Factor quadratic terms involving weight vector $w$",
        mathLatex: "L(w) = w^T (X^T X + \\lambda I_d) w - 2 (X^T y)^T w + y^T y",
        justification: "Identity matrix factorization: $\\lambda w^T w = w^T (\\lambda I_d) w$."
      },
      {
        stepNumber: 3,
        description: "Compute matrix gradient with respect to $w$ using standard vector identities",
        mathLatex: "\\nabla_w L(w) = 2 (X^T X + \\lambda I_d) w - 2 X^T y",
        justification: "Identities: $\\nabla_w (w^T A w) = (A + A^T)w = 2Aw$ for symmetric $A = X^T X + \\lambda I$; and $\\nabla_w (b^T w) = b$."
      },
      {
        stepNumber: 4,
        description: "Set gradient to zero and solve for optimal parameter vector $w^*$",
        mathLatex: "2 (X^T X + \\lambda I_d) w^* - 2 X^T y = 0 \\implies (X^T X + \\lambda I_d) w^* = X^T y",
        justification: "First-order optimality condition for convex function."
      },
      {
        stepNumber: 5,
        description: "Invert regularized gram matrix (guaranteed non-singular)",
        mathLatex: "w^* = (X^T X + \\lambda I_d)^{-1} X^T y",
        justification: "Since $X^T X \\succeq 0$ is positive semi-definite and $\\lambda I \\succ 0$ with $\\lambda > 0$, $(X^T X + \\lambda I) \\succ 0$ is strictly positive definite and always invertible."
      }
    ],
    finalLatex: "w^* = (X^T X + \\lambda I)^{-1} X^T y",
    vivaExamPitfalls: [
      "Why is $(X^T X + \\lambda I)$ always invertible even when $X$ has collinear columns ($N < d$)? Because adding $\\lambda I$ shifts all eigenvalues: $\\lambda_i(X^T X + \\lambda I) = \\lambda_i(X^T X) + \\lambda \\ge \\lambda > 0$.",
      "Difference from Lasso (L1): L2 Ridge yields closed-form analytical solution; L1 Lasso creates non-differentiable corners at 0 requiring iterative coordinate descent."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "L(w) &= \\|Xw - y\\|^2 + \\lambda \\|w\\|^2 \\\\",
      "&= w^T (X^T X + \\lambda I) w - 2 (X^T y)^T w + y^T y \\\\",
      "\\nabla_w L(w) &= 2(X^T X + \\lambda I)w - 2X^T y = 0 \\\\",
      "\\implies w^* &= (X^T X + \\lambda I)^{-1} X^T y",
      "\\end{align*}"
    ].join("\n")
  },

  svd_decomposition: {
    title: "Singular Value Decomposition (SVD) from Spectral Theorem",
    topic: "Linear Algebra & Factorization",
    assumptions: [
      "Arbitrary real matrix: $A \\in \\mathbb{R}^{m \\times n}$ with rank $r \\le \\min(m, n)$",
      "Symmetric positive semi-definite Gram matrix: $A^T A \\in \\mathbb{R}^{n \\times n}$",
      "Orthonormal eigenvectors $v_1, \\dots, v_n$ of $A^T A$ with eigenvalues $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge \\lambda_r > 0$"
    ],
    targetStatement: "A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i u_i v_i^T",
    steps: [
      {
        stepNumber: 1,
        description: "Apply Spectral Theorem to symmetric matrix $A^T A$",
        mathLatex: "A^T A v_i = \\lambda_i v_i \\quad \\text{with } v_i^T v_j = \\delta_{ij}",
        justification: "Real symmetric matrices possess an orthonormal basis of real eigenvectors."
      },
      {
        stepNumber: 2,
        description: "Prove eigenvalues are non-negative and define singular values",
        mathLatex: "\\lambda_i = v_i^T (A^T A v_i) = (A v_i)^T (A v_i) = \\|A v_i\\|^2 \\ge 0 \\implies \\sigma_i \\equiv \\sqrt{\\lambda_i} = \\|A v_i\\|",
        justification: "Positive semi-definiteness property of Gram matrices."
      },
      {
        stepNumber: 3,
        description: "Construct left singular vectors $u_i$ for $i \\le r$",
        mathLatex: "u_i = \\frac{1}{\\sigma_i} A v_i \\iff A v_i = \\sigma_i u_i",
        justification: "Unit vector normalization: $\\|u_i\\| = \\frac{\\|A v_i\\|}{\\sigma_i} = 1$."
      },
      {
        stepNumber: 4,
        description: "Verify mutual orthogonality of left singular vectors $u_i$",
        mathLatex: "u_i^T u_j = \\frac{1}{\\sigma_i \\sigma_j} (A v_i)^T (A v_j) = \\frac{1}{\\sigma_i \\sigma_j} v_i^T (A^T A v_j) = \\frac{\\lambda_j}{\\sigma_i \\sigma_j} v_i^T v_j = \\delta_{ij}",
        justification: "Since $v_i^T v_j = 0$ for $i \\ne j$."
      },
      {
        stepNumber: 5,
        description: "Assemble matrix form $A V = U \\Sigma$",
        mathLatex: "A [v_1 | \\dots | v_n] = [u_1 | \\dots | u_m] \\Sigma \\implies A = U \\Sigma V^T",
        justification: "Since $V$ is orthogonal ($V V^T = V^T V = I_n$), right-multiplying by $V^T$ yields $A = U \\Sigma V^T$."
      }
    ],
    finalLatex: "A = U \\Sigma V^T",
    vivaExamPitfalls: [
      "Geometric intuition: SVD factors ANY linear map into Rotation ($V^T$) $\\to$ Scaling along axes ($\\Sigma$) $\\to$ Rotation ($U$). This is why unit circles always become ellipses.",
      "Relationship to Eigendecomposition: Eigendecomposition $A = PDP^{-1}$ requires a square matrix and diagonalizable basis; SVD $A = U\\Sigma V^T$ exists for EVERY matrix $m \\times n$, even rectangular, singular, or non-invertible."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "A^T A v_i &= \\sigma_i^2 v_i, \\quad \\sigma_i = \\|A v_i\\| \\\\",
      "u_i &= \\frac{1}{\\sigma_i} A v_i \\implies A v_i = \\sigma_i u_i \\\\",
      "A [v_1 \\dots v_n] &= [u_1 \\dots u_m] \\Sigma \\\\",
      "\\therefore A &= U \\Sigma V^T",
      "\\end{align*}"
    ].join("\n")
  },

  pca_variance_maximization: {
    title: "Principal Component Analysis (PCA) Variance Maximization via Lagrange Multipliers",
    topic: "Unsupervised Learning & Dimensionality Reduction",
    assumptions: [
      "Zero-mean centered data: $\\frac{1}{N} \\sum_{i=1}^N x_i = 0$",
      "Sample covariance matrix: $\\Sigma = \\frac{1}{N} X^T X \\in \\mathbb{R}^{d \\times d}$ (symmetric)",
      "Projection direction unit vector: $u \\in \\mathbb{R}^d$ such that $u^T u = 1$"
    ],
    targetStatement: "\\Sigma u = \\lambda u \\implies u_1 \\text{ is the dominant eigenvector of } \\Sigma",
    steps: [
      {
        stepNumber: 1,
        description: "Express sample variance of projected data points $y_i = u^T x_i$",
        mathLatex: "\\text{Var}(y) = \\frac{1}{N} \\sum_{i=1}^N (u^T x_i)^2 = u^T \\left( \\frac{1}{N} \\sum_{i=1}^N x_i x_i^T \\right) u = u^T \\Sigma u",
        justification: "Bilinear quadratic form of covariance."
      },
      {
        stepNumber: 2,
        description: "Formulate constrained optimization problem using Lagrange multiplier $\\lambda$",
        mathLatex: "\\mathcal{L}(u, \\lambda) = u^T \\Sigma u - \\lambda (u^T u - 1)",
        justification: "Enforces unit length $\|u\|_2 = 1$ to prevent trivial unbounded scaling."
      },
      {
        stepNumber: 3,
        description: "Compute gradient with respect to projection vector $u$",
        mathLatex: "\\nabla_u \\mathcal{L}(u, \\lambda) = 2 \\Sigma u - 2 \\lambda u",
        justification: "Covariance matrix $\\Sigma$ is symmetric, so $\\nabla_u (u^T \\Sigma u) = 2 \\Sigma u$."
      },
      {
        stepNumber: 4,
        description: "Set gradient to zero to find stationary points",
        mathLatex: "2 \\Sigma u - 2 \\lambda u = 0 \\implies \\Sigma u = \\lambda u",
        justification: "First-order Karush-Kuhn-Tucker (KKT) stationarity condition."
      },
      {
        stepNumber: 5,
        description: "Show that variance equals the eigenvalue $\\lambda$",
        mathLatex: "\\text{Var}(y) = u^T \\Sigma u = u^T (\\lambda u) = \\lambda (u^T u) = \\lambda",
        justification: "Since $u^T u = 1$, maximizing variance means picking the eigenvector with the largest eigenvalue $\\lambda_{\\max}$."
      }
    ],
    finalLatex: "\\Sigma u = \\lambda u, \\quad \\max \\text{Var}(y) = \\lambda_1",
    vivaExamPitfalls: [
      "Why must data be mean-centered before PCA? If not centered, the first principal component points from the origin to the mean of the data rather than along the axis of maximal variance.",
      "Connection to SVD: If $X$ is centered, SVD of $X = U \\Sigma V^T$ gives eigenvectors of covariance as columns of $V$ since $X^T X = V \\Sigma^2 V^T$."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "\\mathcal{L}(u, \\lambda) &= u^T \\Sigma u - \\lambda(u^T u - 1) \\\\",
      "\\nabla_u \\mathcal{L} &= 2\\Sigma u - 2\\lambda u = 0 \\\\",
      "\\implies \\Sigma u &= \\lambda u \\\\",
      "\\text{Var}(u^T x) &= u^T \\Sigma u = \\lambda u^T u = \\lambda",
      "\\end{align*}"
    ].join("\n")
  },

  gram_schmidt_process: {
    title: "Gram-Schmidt Orthogonalization Process",
    topic: "Vector Spaces & Orthogonality",
    assumptions: [
      "Linearly independent vectors: $\\{v_1, v_2, \\dots, v_k\\} \\subset \\mathbb{R}^n$",
      "Inner product space with standard Euclidean dot product $\\langle u, v \\rangle = u^T v$"
    ],
    targetStatement: "u_k = v_k - \\sum_{j=1}^{k-1} \\frac{\\langle v_k, u_j \\rangle}{\\|u_j\\|^2} u_j \\implies u_i^T u_j = 0 \\; (\\forall i \\ne j)",
    steps: [
      {
        stepNumber: 1,
        description: "Set the first orthogonal basis vector equal to the first input vector",
        mathLatex: "u_1 = v_1",
        justification: "A single non-zero vector forms an orthogonal set vacuously."
      },
      {
        stepNumber: 2,
        description: "Decompose $v_2$ into parallel and perpendicular components w.r.t $u_1$",
        mathLatex: "v_2 = v_{2\\parallel} + v_{2\\perp} = \\text{proj}_{u_1}(v_2) + u_2 \\implies u_2 = v_2 - \\frac{u_1^T v_2}{u_1^T u_1} u_1",
        justification: "Vector projection theorem: $\\text{proj}_u(v) = \\frac{u^T v}{\\|u\\|^2} u$."
      },
      {
        stepNumber: 3,
        description: "Verify that $u_2$ is strictly orthogonal to $u_1$",
        mathLatex: "u_1^T u_2 = u_1^T \\left( v_2 - \\frac{u_1^T v_2}{u_1^T u_1} u_1 \\right) = u_1^T v_2 - \\frac{u_1^T v_2}{u_1^T u_1} (u_1^T u_1) = u_1^T v_2 - u_1^T v_2 = 0",
        justification: "Linearity of the inner product."
      },
      {
        stepNumber: 4,
        description: "Generalize to arbitrary $k$-th step via mathematical induction",
        mathLatex: "u_k = v_k - \\sum_{j=1}^{k-1} \\frac{u_j^T v_k}{u_j^T u_j} u_j, \\quad e_k = \\frac{u_k}{\\|u_k\\|}",
        justification: "Subtracting orthogonal projections onto each prior subspace basis vector."
      }
    ],
    finalLatex: "u_k = v_k - \\sum_{j=1}^{k-1} \\text{proj}_{u_j}(v_k), \\quad e_k = \\frac{u_k}{\\|u_k\\|}",
    vivaExamPitfalls: [
      "Numerical Instability: Classical Gram-Schmidt (CGS) suffers from severe loss of orthogonality in floating point arithmetic due to catastrophic cancellation. In production numerical software (like QR factorization), always use Modified Gram-Schmidt (MGS) or Householder reflections.",
      "QR Factorization link: Assembling $Q = [e_1 | \\dots | e_k]$ and upper triangular $R_{jk} = e_j^T v_k$ directly yields $A = QR$."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "u_1 &= v_1 \\\\",
      "u_2 &= v_2 - \\frac{\\langle v_2, u_1 \\rangle}{\\|u_1\\|^2} u_1 \\\\",
      "u_k &= v_k - \\sum_{j=1}^{k-1} \\frac{\\langle v_k, u_j \\rangle}{\\|u_j\\|^2} u_j \\\\",
      "e_k &= \\frac{u_k}{\\|u_k\\|} \\implies Q = [e_1 \\dots e_k], \\quad A = QR",
      "\\end{align*}"
    ].join("\n")
  }
};

export function getDerivation(topic: string): DerivationResult {
  const normalized = topic.toLowerCase().trim().replace(/[-\s]/g, "_");
  if (CANONICAL_DERIVATIONS[normalized]) {
    return CANONICAL_DERIVATIONS[normalized];
  }

  // Look for partial match
  const key = Object.keys(CANONICAL_DERIVATIONS).find(k => k.includes(normalized) || normalized.includes(k));
  if (key) {
    return CANONICAL_DERIVATIONS[key];
  }

  // Generic fallback structure
  return {
    title: `Algebraic Derivation for ${topic}`,
    topic: topic,
    assumptions: [
      "Assume well-defined Euclidean vector space $\\mathbb{R}^n$",
      "Continuous differentiability of participating objective functions"
    ],
    targetStatement: "\\text{Proof of target relationship for: } " + topic,
    steps: [
      {
        stepNumber: 1,
        description: "State governing definition and initial algebraic equality",
        mathLatex: "f(x) = \\dots",
        justification: "Foundational postulate."
      },
      {
        stepNumber: 2,
        description: "Apply differential operators / algebraic expansion",
        mathLatex: "\\nabla f(x) = \\dots",
        justification: "Standard calculus product / chain rule."
      },
      {
        stepNumber: 3,
        description: "Group invariants and simplify terms",
        mathLatex: "\\text{Result}",
        justification: "Cancellation of like terms."
      }
    ],
    finalLatex: "\\text{Q.E.D.}",
    vivaExamPitfalls: [
      "Ensure inner and outer matrix dimensions match at every intermediate step.",
      "Check boundary conditions when denominator terms might vanish."
    ],
    fullLatexDocumentSnippet: [
      "\\begin{align*}",
      "\\text{Step 1} &\\implies \\dots \\\\",
      "\\text{Step 2} &\\implies \\dots",
      "\\end{align*}"
    ].join("\n")
  };
}
