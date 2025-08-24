export function formatINR(value?: number | null) {
  const n = typeof value === 'number' ? value : 0
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)
  } catch (e) {
    // fallback simple formatting
    return `₹${n.toFixed(2)}`
  }
}

export default formatINR
