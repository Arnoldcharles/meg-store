import { LucideIcon, Apple, Beef, Milk, Soup, CupSoda, ShoppingBasket } from "lucide-react";

export type Category = {
  name: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  { name: "Fruits & Vegetables", icon: Apple },
  { name: "Meat & Seafood", icon: Beef },
  { name: "Dairy & Eggs", icon: Milk },
  { name: "Pantry Staples", icon: Soup },
  { name: "Beverages", icon: CupSoda },
  { name: "Others", icon: ShoppingBasket },
];
