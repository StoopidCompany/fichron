import type { TimelineEntry, FilterCriteria, SortOptions } from '@fichron/types';

export class TimelineFilter {
  /**
   * Filter timeline entries based on criteria
   */
  static filter(entries: TimelineEntry[], criteria: FilterCriteria[]): TimelineEntry[] {
    return entries.filter(entry => {
      return criteria.every(criterion => this.matchesCriterion(entry, criterion));
    });
  }

  /**
   * Check if an entry matches a single filter criterion
   */
  private static matchesCriterion(entry: TimelineEntry, criterion: FilterCriteria): boolean {
    const { field, value, operator = 'equals' } = criterion;
    const entryValue = entry[field];

    switch (operator) {
      case 'equals':
        return entryValue === value;

      case 'contains':
        if (typeof entryValue === 'string' && typeof value === 'string') {
          return entryValue.toLowerCase().includes(value.toLowerCase());
        }
        if (Array.isArray(entryValue)) {
          return entryValue.includes(value);
        }
        return false;

      case 'exists':
        return entryValue !== undefined && entryValue !== null;

      case 'range':
        // For date ranges, compare strings lexicographically
        if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
          const { min, max } = value as { min: string; max: string };
          return (
            (entryValue as string) >= min &&
            (entryValue as string) <= max
          );
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Sort timeline entries
   */
  static sort(entries: TimelineEntry[], options: SortOptions): TimelineEntry[] {
    const { field, order } = options;

    return [...entries].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return order === 'asc' ? 1 : -1;
      if (bValue === undefined) return order === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Filter entries by character/team reference
   */
  static filterByReference(entries: TimelineEntry[], refPath: string): TimelineEntry[] {
    return entries.filter(entry => {
      // Check if any field contains the reference
      return Object.values(entry).some(value => {
        if (typeof value === 'string') {
          return value.includes(refPath);
        }
        if (typeof value === 'object' && value !== null) {
          return this.containsReference(value, refPath);
        }
        return false;
      });
    });
  }

  /**
   * Recursively check if an object contains a reference
   */
  private static containsReference(obj: unknown, refPath: string): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    return Object.values(obj).some(value => {
      if (typeof value === 'string' && value.includes(refPath)) {
        return true;
      }
      if (typeof value === 'object' && value !== null) {
        return this.containsReference(value, refPath);
      }
      return false;
    });
  }
}
