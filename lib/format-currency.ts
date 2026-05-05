export function formatCurrency(price: string | null | undefined): string {
  if (!price) {
    return "Sob consulta"
  }

  // Remove qualquer formatação existente e extrai apenas os números
  const cleanPrice = String(price)
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")

  // Tenta converter para número
  const numericPrice = Number.parseFloat(cleanPrice)

  // Se não conseguir converter, retorna o preço original
  if (isNaN(numericPrice)) {
    return String(price)
  }

  // Formata como moeda brasileira com 2 casas decimais
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export function formatCurrencyFromNumber(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return "Sob consulta"
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}
