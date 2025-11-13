<script lang="ts">
  interface Props {
    padding?: 'sm' | 'md' | 'lg';
    hover?: boolean;
    children?: any;
  }

  let {
    padding = 'md',
    hover = false,
    children
  }: Props = $props();
</script>

<div class="card card-{padding}" class:hover>
  {@render children?.()}
</div>

<style>
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.2s;
  }

  .card.hover:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    cursor: pointer;
  }

  .card-sm {
    padding: 0.75rem;
  }

  .card-md {
    padding: 1.25rem;
  }

  .card-lg {
    padding: 1.5rem;
  }

  @media (prefers-color-scheme: dark) {
    .card {
      background-color: #1f2937;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    }
  }
</style>
