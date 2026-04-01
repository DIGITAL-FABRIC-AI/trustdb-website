import type { MetricStatus, FeatureStatus } from '../types';

export function scoreColor(score: number | null): string {
  if (score === null) return 'text-gray-500';
  if (score >= 9) return 'text-emerald-400';
  if (score >= 7) return 'text-blue-400';
  if (score >= 5) return 'text-yellow-400';
  if (score >= 3) return 'text-orange-400';
  return 'text-red-400';
}

export function scoreBg(score: number | null): string {
  if (score === null) return 'bg-gray-500/10';
  if (score >= 9) return 'bg-emerald-400/10';
  if (score >= 7) return 'bg-blue-400/10';
  if (score >= 5) return 'bg-yellow-400/10';
  if (score >= 3) return 'bg-orange-400/10';
  return 'bg-red-400/10';
}

export function scoreRing(score: number | null): string {
  if (score === null) return 'stroke-gray-600';
  if (score >= 9) return 'stroke-emerald-400';
  if (score >= 7) return 'stroke-blue-400';
  if (score >= 5) return 'stroke-yellow-400';
  if (score >= 3) return 'stroke-orange-400';
  return 'stroke-red-400';
}

export function scoreTrack(): string {
  return 'stroke-gray-800';
}

export function statusLabel(status: MetricStatus): string {
  const labels: Record<MetricStatus, string> = {
    'excellent': 'Excellent',
    'strong': 'Strong',
    'adequate': 'Adequate',
    'needs-work': 'Needs Work',
    'critical': 'Critical',
    'not-measured': 'Not Measured',
  };
  return labels[status];
}

export function statusColor(status: MetricStatus): string {
  const colors: Record<MetricStatus, string> = {
    'excellent': 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
    'strong': 'bg-blue-400/15 text-blue-400 border-blue-400/30',
    'adequate': 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
    'needs-work': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
    'critical': 'bg-red-400/15 text-red-400 border-red-400/30',
    'not-measured': 'bg-gray-400/15 text-gray-400 border-gray-400/30',
  };
  return colors[status];
}

export function pillarSlugToColor(slug: string): string {
  const colors: Record<string, string> = {
    performance: 'bg-blue-500/20 text-blue-300',
    reliability: 'bg-emerald-500/20 text-emerald-300',
    scalability: 'bg-purple-500/20 text-purple-300',
    security: 'bg-red-500/20 text-red-300',
    efficiency: 'bg-amber-500/20 text-amber-300',
    connectivity: 'bg-cyan-500/20 text-cyan-300',
  };
  return colors[slug] || 'bg-gray-500/20 text-gray-300';
}

export function formatScore(score: number | null): string {
  if (score === null) return '--';
  return score.toFixed(1);
}

export function featureStatusStyle(status: FeatureStatus): string {
  const styles: Record<FeatureStatus, string> = {
    'implemented': 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
    'partial': 'bg-blue-400/15 text-blue-400 border-blue-400/30',
    'designed': 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30',
    'planned': 'bg-gray-400/15 text-gray-400 border-gray-400/30',
  };
  return styles[status];
}

export function featureStatusLabel(status: FeatureStatus): string {
  const labels: Record<FeatureStatus, string> = {
    'implemented': 'Implemented',
    'partial': 'Partial',
    'designed': 'Designed',
    'planned': 'Planned',
  };
  return labels[status];
}
