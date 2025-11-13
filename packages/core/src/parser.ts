import yaml from 'js-yaml';
import type { SagaTimeline, IndividualContent } from '@fichron/types';

export class YAMLParser {
  /**
   * Parse a YAML string into a typed object
   */
  static parse<T = unknown>(content: string): T {
    try {
      return yaml.load(content) as T;
    } catch (error) {
      throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parse YAML content as a saga/timeline file
   */
  static parseSaga(content: string): SagaTimeline {
    return this.parse<SagaTimeline>(content);
  }

  /**
   * Parse YAML content as an individual content file
   */
  static parseContent(content: string): IndividualContent {
    return this.parse<IndividualContent>(content);
  }

  /**
   * Fetch and parse a YAML file from a URL
   */
  static async fetchAndParse<T = unknown>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const content = await response.text();
    return this.parse<T>(content);
  }

  /**
   * Fetch and parse multiple YAML files
   */
  static async fetchMultiple<T = unknown>(urls: string[]): Promise<T[]> {
    const promises = urls.map(url => this.fetchAndParse<T>(url));
    return Promise.all(promises);
  }

  /**
   * Resolve a relative reference path from a base URL
   */
  static resolveReference(baseUrl: string, ref: string): string {
    try {
      return new URL(ref, baseUrl).href;
    } catch {
      // If URL construction fails, return the ref as-is
      return ref;
    }
  }
}
