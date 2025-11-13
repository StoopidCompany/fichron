<script lang="ts">
  import type { FilterCriteria, FieldDiscovery } from '@fichron/types';
  import Button from './Button.svelte';

  interface Props {
    discovery: FieldDiscovery;
    activeFilters?: FilterCriteria[];
    onfilterchange?: (filters: FilterCriteria[]) => void;
  }

  let {
    discovery,
    activeFilters = $bindable([]),
    onfilterchange
  }: Props = $props();

  function addFilter(field: string, value: unknown) {
    const newFilters = [...activeFilters, { field, value, operator: 'equals' as const }];
    activeFilters = newFilters;
    onfilterchange?.(newFilters);
  }

  function removeFilter(index: number) {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    activeFilters = newFilters;
    onfilterchange?.(newFilters);
  }

  function clearFilters() {
    activeFilters = [];
    onfilterchange?.([]);
  }
</script>

<div class="filter-panel">
  <div class="header">
    <h3>Filters</h3>
    {#if activeFilters.length > 0}
      <Button variant="outline" size="sm" onclick={clearFilters}>
        Clear All
      </Button>
    {/if}
  </div>

  <!-- Active Filters -->
  {#if activeFilters.length > 0}
    <div class="active-filters">
      <h4>Active Filters</h4>
      <div class="filter-chips">
        {#each activeFilters as filter, i}
          <div class="chip">
            <span>{filter.field}: {String(filter.value)}</span>
            <button class="remove" onclick={() => removeFilter(i)} aria-label="Remove filter">×</button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Available Filters -->
  <div class="available-filters">
    <h4>Available Filters</h4>

    {#if discovery.customBooleans.length > 0}
      <div class="filter-group">
        <h5>Tags</h5>
        {#each discovery.customBooleans as field}
          <button
            class="filter-option"
            onclick={() => addFilter(field, true)}
            disabled={activeFilters.some(f => f.field === field)}
          >
            {field.replace(/_/g, ' ')}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Common fields -->
    {#each Array.from(discovery.fields.entries()) as [fieldName, fieldData]}
      {#if ['type', 'title'].includes(fieldName) && fieldData.values.size > 0}
        <div class="filter-group">
          <h5>{fieldName}</h5>
          {#each Array.from(fieldData.values) as value}
            <button
              class="filter-option"
              onclick={() => addFilter(fieldName, value)}
              disabled={activeFilters.some(f => f.field === fieldName && f.value === value)}
            >
              {String(value)}
            </button>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .filter-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    max-height: 80vh;
    overflow-y: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .active-filters,
  .available-filters {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }

  h5 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: capitalize;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 9999px;
    font-size: 0.875rem;
  }

  .chip .remove {
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .chip .remove:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-option {
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.2s;
    text-transform: capitalize;
  }

  .filter-option:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #3b82f6;
  }

  .filter-option:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    .filter-panel {
      background-color: #1f2937;
    }

    .header h3 {
      color: #f9fafb;
    }

    h4 {
      color: #d1d5db;
    }

    h5 {
      color: #9ca3af;
    }

    .filter-option {
      background-color: #374151;
      border-color: #4b5563;
      color: #d1d5db;
    }

    .filter-option:hover:not(:disabled) {
      background-color: #4b5563;
      border-color: #3b82f6;
    }
  }

  @media (max-width: 768px) {
    .filter-panel {
      max-height: 60vh;
    }
  }
</style>
