import type { TimelineEntry, FieldDiscovery, DiscoveredField } from '@fichron/types';

export class FieldDiscoveryEngine {
  /**
   * Discover all fields and their types from a collection of timeline entries
   */
  static discover(entries: TimelineEntry[]): FieldDiscovery {
    const fields = new Map<string, DiscoveredField>();
    const customBooleans: Set<string> = new Set();
    const referenceFields: Set<string> = new Set();

    entries.forEach(entry => {
      this.processEntry(entry, fields, customBooleans, referenceFields);
    });

    return {
      fields,
      customBooleans: Array.from(customBooleans),
      referenceFields: Array.from(referenceFields)
    };
  }

  /**
   * Process a single entry to discover its fields
   */
  private static processEntry(
    entry: TimelineEntry,
    fields: Map<string, DiscoveredField>,
    customBooleans: Set<string>,
    referenceFields: Set<string>,
    prefix = ''
  ): void {
    Object.entries(entry).forEach(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;

      // Skip if undefined or null
      if (value === undefined || value === null) return;

      // Detect reference fields
      if (key === 'ref' || (typeof value === 'string' && value.endsWith('.yaml'))) {
        referenceFields.add(fieldName);
      }

      // Detect custom boolean fields
      if (typeof value === 'boolean') {
        customBooleans.add(fieldName);
      }

      // Get or create field entry
      let field = fields.get(fieldName);
      if (!field) {
        field = {
          name: fieldName,
          type: this.inferType(value),
          values: new Set(),
          count: 0
        };
        fields.set(fieldName, field);
      }

      // Update field data
      field.count++;

      // Add value to the set (for primitive types)
      if (this.isPrimitive(value)) {
        field.values.add(value);
      }

      // Recursively process nested objects
      if (typeof value === 'object' && !Array.isArray(value)) {
        this.processEntry(value as TimelineEntry, fields, customBooleans, referenceFields, fieldName);
      }

      // Process array elements
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            this.processEntry(item as TimelineEntry, fields, customBooleans, referenceFields, fieldName);
          } else if (this.isPrimitive(item)) {
            field!.values.add(item);
          }
        });
      }
    });
  }

  /**
   * Infer the type of a value
   */
  private static inferType(value: unknown): DiscoveredField['type'] {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'string';

    const type = typeof value;
    switch (type) {
      case 'string':
        // Try to detect if it's a date
        if (/^\d{4}(-\d{2})?(-\d{2})?$/.test(value as string)) {
          return 'date';
        }
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'object':
        return 'object';
      default:
        return 'string';
    }
  }

  /**
   * Check if a value is a primitive type
   */
  private static isPrimitive(value: unknown): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    );
  }

  /**
   * Get unique values for a specific field across all entries
   */
  static getFieldValues(entries: TimelineEntry[], fieldName: string): Set<unknown> {
    const values = new Set<unknown>();

    entries.forEach(entry => {
      const value = this.getNestedValue(entry, fieldName);
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(value);
        }
      }
    });

    return values;
  }

  /**
   * Get a nested value from an object using dot notation
   */
  private static getNestedValue(obj: unknown, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }

    return current;
  }
}
