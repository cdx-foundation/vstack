/**
 * Domain Types
 * Define the shared data models used across stores and components.
 */

export interface Item {
  id: number;
  label: string;
  value: number;
}

export interface Category {
  id: string;
  label: string;
  items: Item[];
}
