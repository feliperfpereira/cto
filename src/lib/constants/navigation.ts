import { type NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Launch",
    href: "/launch",
    badge: "New",
  },
  {
    label: "Command Deck",
    href: "/command",
  },
  {
    label: "Geospatial AI",
    href: "/geospatial",
    badge: "Soon",
  },
  {
    label: "Simulations",
    href: "/simulations",
    badge: "Alpha",
  },
  {
    label: "Datasets",
    href: "/datasets",
  },
];
