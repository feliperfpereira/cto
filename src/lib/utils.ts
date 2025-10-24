import classNames from "classnames";

export function cn(...inputs: Parameters<typeof classNames>) {
  return classNames(...inputs);
}

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
    ...options,
  }).format(value);
};

export const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
