<script lang="ts">
  import { onMount } from 'svelte';
  import { YAMLParser, TimelineFilter, FieldDiscoveryEngine } from '@fichron/core';
  import { Button, Card, TimelineItem, FilterPanel } from '@fichron/ui';
  import type { SagaTimeline, TimelineEntry, FilterCriteria, FieldDiscovery } from '@fichron/types';

  let timelines: SagaTimeline[] = $state([]);
  let allEntries: TimelineEntry[] = $state([]);
  let filteredEntries: TimelineEntry[] = $state([]);
  let discovery: FieldDiscovery | null = $state(null);
  let activeFilters: FilterCriteria[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let showFilters = $state(true);

  onMount(async () => {
    try {
      // Load the Infinity Saga as an example
      const saga = await YAMLParser.fetchAndParse<SagaTimeline>('/data/mcu/01-infinity_saga.yaml');
      timelines = [saga];
      allEntries = saga.primary_timeline || [];
      filteredEntries = allEntries;

      // Discover fields for filtering
      discovery = FieldDiscoveryEngine.discover(allEntries);

      loading = false;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load timeline data';
      loading = false;
    }
  });

  function handleFilterChange(filters: FilterCriteria[]) {
    activeFilters = filters;
    if (filters.length === 0) {
      filteredEntries = allEntries;
    } else {
      filteredEntries = TimelineFilter.filter(allEntries, filters);
    }
  }

  function toggleFilters() {
    showFilters = !showFilters;
  }
</script>

<div class="app-container">
  <header>
    <h1>Fichron</h1>
    <p class="subtitle">Explore Fictional Universe Timelines</p>
  </header>

  {#if loading}
    <div class="loading">Loading timeline data...</div>
  {:else if error}
    <div class="error">
      <Card>
        <h3>Error</h3>
        <p>{error}</p>
      </Card>
    </div>
  {:else}
    <div class="controls">
      <Button onclick={toggleFilters}>
        {showFilters ? 'Hide' : 'Show'} Filters
      </Button>
      <div class="stats">
        Showing {filteredEntries.length} of {allEntries.length} entries
      </div>
    </div>

    <div class="content-grid" class:with-filters={showFilters}>
      {#if showFilters && discovery}
        <aside class="sidebar">
          <FilterPanel
            {discovery}
            bind:activeFilters
            onfilterchange={handleFilterChange}
          />
        </aside>
      {/if}

      <main class="timeline-list">
        {#if filteredEntries.length === 0}
          <Card>
            <p>No entries match your filters.</p>
          </Card>
        {:else}
          {#each filteredEntries as entry (entry.title)}
            <TimelineItem {entry} />
          {/each}
        {/if}
      </main>
    </div>
  {/if}
</div>

<style>
  .app-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 0.5rem 0 0 0;
    font-size: 1.125rem;
    color: #6b7280;
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .stats {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .content-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  .content-grid.with-filters {
    grid-template-columns: 300px 1fr;
  }

  .sidebar {
    position: sticky;
    top: 1rem;
    height: fit-content;
  }

  .timeline-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 1024px) {
    .content-grid.with-filters {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .controls {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (prefers-color-scheme: dark) {
    .subtitle {
      color: #9ca3af;
    }

    .stats {
      color: #9ca3af;
    }
  }
</style>
