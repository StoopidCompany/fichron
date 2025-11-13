<script lang="ts">
  import { Button, Card } from '@fichron/ui';
  import Timeline from './lib/Timeline.svelte';

  let currentView: 'landing' | 'timeline' = $state('landing');

  function startTimeline() {
    currentView = 'timeline';
  }

  function goHome() {
    currentView = 'landing';
  }
</script>

<div class="app-container">
  <header>
    <h1>Fichron</h1>
    <p class="subtitle">Filter and Explore Fictional Universe Timelines</p>
  </header>

  {#if currentView === 'landing'}
    <main class="landing">
      <section class="hero">
        <Card padding="lg">
          <div class="hero-content">
            <h2>Navigate Complex Fictional Universes</h2>
            <p class="lead">
              A flexible, client-side tool for filtering and exploring timelines through loosely-structured YAML chronologies.
            </p>
            <Button size="lg" onclick={startTimeline}>
              Try It Now
            </Button>
          </div>
        </Card>
      </section>

      <section class="features">
        <h3 class="section-title">Features</h3>
        <div class="feature-grid">
          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">🎬</div>
              <h4>Multiple Universes</h4>
              <p>Marvel, DC, Star Wars, and more. Easily add your own custom timelines.</p>
            </div>
          </Card>

          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">🔍</div>
              <h4>Smart Filtering</h4>
              <p>Filter by character, story arc, type, or any custom field. Auto-discovered from YAML.</p>
            </div>
          </Card>

          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">📅</div>
              <h4>Multiple Sort Orders</h4>
              <p>View by release date, in-universe chronology, or custom viewing orders.</p>
            </div>
          </Card>

          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">📝</div>
              <h4>Flexible YAML Schema</h4>
              <p>Loosely structured data. Only title is required. Add custom fields freely.</p>
            </div>
          </Card>

          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">💻</div>
              <h4>Client-Side Only</h4>
              <p>No backend, no login, no database. Works entirely in your browser.</p>
            </div>
          </Card>

          <Card hover={false}>
            <div class="feature">
              <div class="feature-icon">🌙</div>
              <h4>Responsive & Accessible</h4>
              <p>Mobile-first design with dark mode support and keyboard navigation.</p>
            </div>
          </Card>
        </div>
      </section>

      <section class="use-cases">
        <h3 class="section-title">Use Cases</h3>
        <Card>
          <ul class="use-case-list">
            <li>Watch only MCU content relevant to Spider-Man's storyline</li>
            <li>Filter Star Wars by specific character arcs or eras</li>
            <li>Explore DC animated universe continuity chronologically</li>
            <li>Create custom viewing orders mixing release and in-canon dates</li>
            <li>Build timelines for any fictional universe with your own YAML files</li>
          </ul>
        </Card>
      </section>

      <section class="example">
        <h3 class="section-title">Example YAML</h3>
        <Card>
          <pre><code>title: Marvel Cinematic Universe
primary_timeline:
  - title: "Iron Man"
    type: movie
    fichron_start: "2010"
    fichron_end: "2010"

  - title: "Captain America: The First Avenger"
    type: movie
    fichron_start: "1943"
    fichron_end: "1945"
    origin_story: true

  - title: "Agents of S.H.I.E.L.D."
    type: show
    fichron_start: "2013"
    fichron_end: "2020"</code></pre>
        </Card>
      </section>
    </main>
  {:else}
    <div class="nav-back">
      <Button variant="outline" onclick={goHome}>← Back to Home</Button>
    </div>
    <Timeline />
  {/if}
</div>

<style>
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    margin: 0;
    font-size: 4rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 1rem 0 0 0;
    font-size: 1.25rem;
    color: #6b7280;
  }

  /* Landing Page */
  .landing {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .hero-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .hero-content h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }

  .lead {
    margin: 0;
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    line-height: 1.7;
  }

  .section-title {
    text-align: center;
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 2rem 0;
    color: #111827;
  }

  /* Features */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .feature {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .feature-icon {
    font-size: 3rem;
  }

  .feature h4 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .feature p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  /* Use Cases */
  .use-case-list {
    margin: 0;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .use-case-list li {
    color: #374151;
    line-height: 1.6;
  }

  /* Example Code */
  pre {
    margin: 0;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    overflow-x: auto;
  }

  code {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #374151;
  }

  /* Navigation */
  .nav-back {
    margin-bottom: 2rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .hero-content h2 {
      font-size: 1.5rem;
    }

    .lead {
      font-size: 1rem;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    .subtitle {
      color: #9ca3af;
    }

    .hero-content h2,
    .section-title,
    .feature h4 {
      color: #f9fafb;
    }

    .lead,
    .feature p,
    .coming-soon {
      color: #9ca3af;
    }

    .use-case-list li {
      color: #d1d5db;
    }

    pre {
      background-color: #1f2937;
    }

    code {
      color: #d1d5db;
    }
  }
</style>
