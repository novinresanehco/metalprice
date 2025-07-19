
import React from 'react';

export interface MetalDefinition {
  key: string;
  name: string;
  unit: string;
  icon: (props: { className?: string }) => React.ReactNode;
  source: string;
}

export interface MetalPrice extends MetalDefinition {
  price: number;
  change: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface Analysis {
    title: string;
    content: string;
}

export type View = 'dashboard' | 'analysis' | 'widget';
