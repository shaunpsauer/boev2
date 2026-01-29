import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculators | BOE Tools',
  description: 'Construction calculators and productivity tools',
};

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
