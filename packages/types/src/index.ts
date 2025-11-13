// Core timeline types

export type ContentType = 'movie' | 'show' | 'one-shot' | 'web-series';

export interface TimelineEntry {
  title: string;
  type?: ContentType;
  fichron_start?: string;
  fichron_end?: string;
  [key: string]: unknown; // Allow custom fields
}

export interface SagaTimeline {
  title: string;
  parent?: string;
  multiverse?: boolean;
  primary_timeline: TimelineEntry[];
  [key: string]: unknown; // Allow custom fields
}

export interface FictionalTimeline {
  sacred?: boolean;
  start?: string;
  end?: string;
  flash?: {
    forward?: string[];
    backward?: string[];
  };
}

export interface ContentReference {
  ref: string;
  [key: string]: unknown; // Allow additional metadata
}

export interface IndividualContent {
  title: string;
  type?: ContentType;
  release_date?: string;
  fictional_timeline?: FictionalTimeline[];
  primary_protagonist?: string | ContentReference;
  teams?: Record<string, {
    ref: string;
    members?: ContentReference[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown; // Allow custom fields
}

// Filter types

export interface FilterCriteria {
  field: string;
  value: unknown;
  operator?: 'equals' | 'contains' | 'exists' | 'range';
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export type SortMode = 'chronological' | 'release' | 'custom';

// Discovery types - for auto-generating filters from YAML

export interface DiscoveredField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  values: Set<unknown>; // Unique values found
  count: number; // Number of entries with this field
}

export interface FieldDiscovery {
  fields: Map<string, DiscoveredField>;
  customBooleans: string[]; // Fields like 'furrys_big_week', 'sacred'
  referenceFields: string[]; // Fields containing file references
}
