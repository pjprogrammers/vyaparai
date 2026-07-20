import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "₹") {
  return `${currency}${amount.toLocaleString("en-IN")}`
}

export function todayISO() {
  return new Date().toISOString().split("T")[0]
}

