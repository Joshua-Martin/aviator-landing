export interface SubLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  subLinks?: SubLink[];
}

export interface NavBarProps {
  items: NavItem[];
}
