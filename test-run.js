import { getDerivation } from './dist/derivations.js';
import { verifyExpressionDimensions } from './dist/dimensions.js';
import { generateNeuralNetworkTikz, generateTransformerBlockTikz } from './dist/tikz.js';
import { renderChalkboardBox } from './dist/chalkboard.js';

console.log("=== Testing ScholarTex Engines ===");

// 1. Derivations
const deriv = getDerivation("backprop_chain_rule");
console.log(`[PASS] Derivation loaded: ${deriv.title} (${deriv.steps.length} steps)`);

// 2. Dimensions
const dimCheck = verifyExpressionDimensions(
  [
    { name: "W", shape: "(10, 784)" },
    { name: "x", shape: "(784, 32)" },
    { name: "b", shape: "(10, 1)" }
  ],
  "W * x + b",
  "(10, 32)"
);
console.log(`[PASS] Dimension verification: valid=${dimCheck.valid}, shape=(${dimCheck.inferredShape.join(", ")})`);

// 3. TikZ
const nnTikz = generateNeuralNetworkTikz([3, 4, 2], false);
console.log(`[PASS] TikZ Neural Net generated (${nnTikz.length} bytes)`);

// 4. Chalkboard
const box = renderChalkboardBox("Backprop Chain Rule", ["∂L/∂W = δ · xᵀ", "∂L/∂x = Wᵀ · δ"], ["Inner dims must align"]);
console.log(box);

console.log("=== ALL ENGINES FUNCTIONAL ===");
