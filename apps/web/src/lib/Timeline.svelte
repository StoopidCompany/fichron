<script lang="ts">
  import { YAMLParser, TimelineFilter, FieldDiscoveryEngine } from '@fichron/core';
  import { Button, Card } from '@fichron/ui';
  import type { TimelineEntry, FilterCriteria, SortOptions, FieldDiscovery } from '@fichron/types';

  let fileInput: HTMLInputElement | undefined;
  let yamlContent = $state('');
  let entries: TimelineEntry[] = $state([]);
  let filteredEntries: TimelineEntry[] = $state([]);
  let discovery: FieldDiscovery | null = $state(null);
  let sortField = $state<string>('');
  let sortOrder = $state<'asc' | 'desc'>('asc');
  let error = $state('');
  let loading = $state(false);
  let fileName = $state('');

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    fileName = file.name;
    loading = true;
    error = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        yamlContent = e.target?.result as string;
        parseYAML(yamlContent);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to read file';
        loading = false;
      }
    };
    reader.onerror = () => {
      error = 'Failed to read file';
      loading = false;
    };
    reader.readAsText(file);
  }

  function parseYAML(content: string) {
    try {
      const parsed = YAMLParser.parse<any>(content);

      // Extract entries from common YAML structures
      let extractedEntries: TimelineEntry[] = [];

      if (parsed.primary_timeline && Array.isArray(parsed.primary_timeline)) {
        extractedEntries = parsed.primary_timeline;
      } else if (parsed.entries && Array.isArray(parsed.entries)) {
        extractedEntries = parsed.entries;
      } else if (Array.isArray(parsed)) {
        extractedEntries = parsed;
      } else {
        // Single object, wrap in array
        extractedEntries = [parsed];
      }

      entries = extractedEntries;
      filteredEntries = extractedEntries;

      // Discover fields
      discovery = FieldDiscoveryEngine.discover(extractedEntries);

      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to parse YAML';
      loading = false;
    }
  }

  function handleSort(field: string) {
    if (sortField === field) {
      // Toggle order
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortOrder = 'asc';
    }

    const sortOptions: SortOptions = { field, order: sortOrder };
    filteredEntries = TimelineFilter.sort(filteredEntries, sortOptions);
  }

  function getAllFields(): string[] {
    if (!discovery) return [];
    return Array.from(discovery.fields.keys());
  }

  function getFieldValue(entry: TimelineEntry, field: string): string {
    const value = entry[field];
    if (value === undefined || value === null) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  function resetTable() {
    entries = [];
    filteredEntries = [];
    discovery = null;
    yamlContent = '';
    fileName = '';
    error = '';
    sortField = '';
    sortOrder = 'asc';
  }

  function triggerFileInput() {
    fileInput?.click();
  }
</script>

<div class="timeline-viewer">
  <div class="header">
    <h2>YAML Timeline Viewer</h2>
    <p class="description">Upload a YAML file to view and interact with your timeline data</p>
  </div>

  {#if entries.length === 0}
    <div class="upload-area">
      <Card>
        <div class="upload-content">
          <div class="upload-icon">📁</div>
          <h3>Upload YAML File</h3>
          <p>Drag and drop a YAML file here, or click to browse</p>
          <input
            bind:this={fileInput}
            type="file"
            accept=".yaml,.yml"
            onchange={handleFileSelect}
            style="display: none"
          />
          <Button size="lg" onclick={triggerFileInput}>
            Choose File
          </Button>
          {#if error}
            <p class="error-message">{error}</p>
          {/if}
        </div>
      </Card>
    </div>
  {:else}
    <div class="table-controls">
      <div class="info">
        <strong>{fileName}</strong> - {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
      </div>
      <Button variant="outline" onclick={resetTable}>
        Upload New File
      </Button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            {#each getAllFields() as field}
              <th onclick={() => handleSort(field)} class="sortable">
                <div class="th-content">
                  <span>{field}</span>
                  {#if sortField === field}
                    <span class="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  {/if}
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each filteredEntries as entry, i}
            <tr>
              {#each getAllFields() as field}
                <td>
                  <div class="cell-content">
                    {getFieldValue(entry, field)}
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if discovery}
      <div class="stats">
        <Card>
          <h4>Discovered Fields</h4>
          <div class="field-stats">
            {#each Array.from(discovery.fields.entries()) as [fieldName, fieldData]}
              <div class="field-stat">
                <strong>{fieldName}</strong>
                <span class="field-type">{fieldData.type}</span>
                <span class="field-count">{fieldData.count} entries</span>
              </div>
            {/each}
          </div>
        </Card>
      </div>
    {/if}
  {/if}
</div>

<style>
  .timeline-viewer {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .header {
    text-align: center;
  }

  .header h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }

  .description {
    margin: 0.5rem 0 0 0;
    color: #6b7280;
  }

  /* Upload Area */
  .upload-area {
    max-width: 600px;
    margin: 0 auto;
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    text-align: center;
  }

  .upload-icon {
    font-size: 4rem;
  }

  .upload-content h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  .upload-content p {
    margin: 0;
    color: #6b7280;
  }

  .error-message {
    color: #dc2626;
    font-size: 0.875rem;
  }

  /* Table Controls */
  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .info {
    color: #374151;
  }

  /* Table */
  .table-container {
    overflow-x: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .data-table thead {
    background-color: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  .data-table th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
    user-select: none;
  }

  .data-table th.sortable {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .data-table th.sortable:hover {
    background-color: #f3f4f6;
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-indicator {
    font-size: 1rem;
    color: #3b82f6;
  }

  .data-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table tbody tr:hover {
    background-color: #f9fafb;
  }

  .data-table tbody tr:last-child td {
    border-bottom: none;
  }

  .cell-content {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Stats */
  .stats {
    margin-top: 1rem;
  }

  .stats h4 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .field-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.75rem;
  }

  .field-stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
  }

  .field-stat strong {
    color: #111827;
    font-size: 0.875rem;
  }

  .field-type {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
  }

  .field-count {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    .header h2 {
      color: #f9fafb;
    }

    .description {
      color: #9ca3af;
    }

    .upload-content h3 {
      color: #f9fafb;
    }

    .info {
      color: #d1d5db;
    }

    .table-container {
      background-color: #1f2937;
    }

    .data-table thead {
      background-color: #111827;
      border-bottom-color: #374151;
    }

    .data-table th {
      color: #d1d5db;
    }

    .data-table th.sortable:hover {
      background-color: #1f2937;
    }

    .data-table td {
      color: #d1d5db;
      border-bottom-color: #374151;
    }

    .data-table tbody tr:hover {
      background-color: #111827;
    }

    .stats h4 {
      color: #f9fafb;
    }

    .field-stat {
      background-color: #1f2937;
    }

    .field-stat strong {
      color: #f9fafb;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header h2 {
      font-size: 1.5rem;
    }

    .table-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .cell-content {
      max-width: 150px;
    }
  }
</style>
