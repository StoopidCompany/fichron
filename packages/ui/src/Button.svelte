<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: any;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    onclick,
    children
  }: Props = $props();
</script>

<button
  {type}
  {disabled}
  class="btn btn-{variant} btn-{size}"
  onclick={onclick}
>
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variants */
  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }

  .btn-outline {
    background-color: transparent;
    color: #3b82f6;
    border: 1px solid #3b82f6;
  }

  .btn-outline:hover:not(:disabled) {
    background-color: #eff6ff;
  }

  /* Sizes */
  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
</style>
