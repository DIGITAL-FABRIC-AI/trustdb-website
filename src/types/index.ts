export type MetricStatus = 'excellent' | 'strong' | 'adequate' | 'needs-work' | 'critical' | 'not-measured';

export interface Metric {
  name: string;
  score: number | null;
  status: MetricStatus;
  summary: string;
  lastUpdated: string;
}

export interface Pillar {
  name: string;
  subtitle: string;
  icon: string;
  overallScore: number | null;
  metrics: Record<string, Metric>;
}

export interface ScoresData {
  lastUpdated: string;
  pillars: Record<string, Pillar>;
}

export interface ComparisonBaseline {
  system: string;
  value: string;
  source?: string;
}

export interface Benchmark {
  name: string;
  value: string;
  target: string;
  met: boolean | null;
  comparisons?: ComparisonBaseline[];
}

export interface EvidenceLink {
  label: string;
  path: string;
}

export interface HistoryEntry {
  date: string;
  value: string;
  note: string;
}

export interface DeepDiveSection {
  metric: string;
  metricName: string;
  score: number | null;
  status: MetricStatus;
  benchmarks: Benchmark[];
  narrative: string;
  evidence: EvidenceLink[];
  history: HistoryEntry[];
}

export interface DeepDiveData {
  pillar: string;
  pillarName: string;
  subtitle: string;
  overallScore: number | null;
  sections: DeepDiveSection[];
}

export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  description: string;
  pillarsAffected: string[];
  tags: string[];
}

export type RoadmapStatus = 'idea' | 'planned' | 'in-progress' | 'complete';
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RoadmapItem {
  title: string;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  description: string;
  pillarsAffected: string[];
}

export interface RoadmapCategory {
  name: string;
  items: RoadmapItem[];
}

export interface RoadmapData {
  categories: RoadmapCategory[];
}

// Features

export type FeatureStatus = 'implemented' | 'partial' | 'designed' | 'planned';

export interface FeatureSummary {
  slug: string;
  name: string;
  tagline: string;
  status: FeatureStatus;
}

export interface FeatureCategory {
  name: string;
  description: string;
  features: FeatureSummary[];
}

export interface FeaturesData {
  categories: FeatureCategory[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface CompetitorApproach {
  system: string;
  approach: string;
  limitation: string;
}

export interface FeatureDetail {
  slug: string;
  name: string;
  category: string;
  status: FeatureStatus;
  overview: string;
  howItWorks: HowItWorksStep[];
  benchmarks: Benchmark[];
  comparisons: {
    narrative: string;
    competitors: CompetitorApproach[];
  };
  evidence: EvidenceLink[];
  relatedFeatures: string[];
  pillarsAffected: string[];
}
