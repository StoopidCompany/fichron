<script lang="ts">
  import type { TimelineEntry } from '@fichron/types';
  import Card from './Card.svelte';

  interface Props {
    entry: TimelineEntry;
    onclick?: (entry: TimelineEntry) => void;
  }

  let { entry, onclick }: Props = $props();

  function handleClick() {
    onclick?.(entry);
  }
</script>

<Card hover={!!onclick} padding="md">
  <div class="timeline-item" onclick={handleClick} role={onclick ? 'button' : undefined} tabindex={onclick ? 0 : undefined}>
    <h3 class="title">{entry.title}</h3>

    {#if entry.type}
      <span class="badge badge-{entry.type}">{entry.type}</span>
    {/if}

    {#if entry.fichron_start || entry.fichron_end}
      <div class="date-range">
        {#if entry.fichron_start}
          <span class="date">{entry.fichron_start}</span>
        {/if}
        {#if entry.fichron_start && entry.fichron_end}
          <span class="separator">→</span>
        {/if}
        {#if entry.fichron_end && entry.fichron_end !== entry.fichron_start}
          <span class="date">{entry.fichron_end}</span>
        {/if}
      </div>
    {/if}

    <!-- Display custom fields -->
    {#if Object.keys(entry).length > 0}
      <div class="custom-fields">
        {#each Object.entries(entry) as [key, value]}
          {#if !['title', 'type', 'fichron_start', 'fichron_end'].includes(key) && typeof value === 'boolean' && value}
            <span class="tag">{key.replace(/_/g, ' ')}</span>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</Card>

<style>
  .timeline-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    width: fit-content;
  }

  .badge-movie {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .badge-show {
    background-color: #dcfce7;
    color: #166534;
  }

  .badge-one-shot {
    background-color: #fef3c7;
    color: #92400e;
  }

  .badge-web-series {
    background-color: #fce7f3;
    color: #9f1239;
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .separator {
    color: #9ca3af;
  }

  .custom-fields {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 0.25rem;
  }

  .tag {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    background-color: #f3f4f6;
    color: #374151;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    text-transform: capitalize;
  }

  @media (prefers-color-scheme: dark) {
    .title {
      color: #f9fafb;
    }

    .date-range {
      color: #9ca3af;
    }

    .tag {
      background-color: #374151;
      color: #d1d5db;
    }

    .badge-movie {
      background-color: #1e3a8a;
      color: #bfdbfe;
    }

    .badge-show {
      background-color: #14532d;
      color: #bbf7d0;
    }

    .badge-one-shot {
      background-color: #78350f;
      color: #fde68a;
    }

    .badge-web-series {
      background-color: #831843;
      color: #fbcfe8;
    }
  }
</style>
