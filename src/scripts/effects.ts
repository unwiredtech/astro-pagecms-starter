// Starts and stops page effects around Astro view transitions.
// astro:page-load fires on first load and after every client-side navigation.
import { setupReveals, teardownReveals } from './reveal';
import { setupScrollEffects, teardownScrollEffects } from './scroll';

declare global {
  interface Window {
    __effectsLoaded?: boolean;
  }
}

// Read by the fallback timer in Base.astro.
window.__effectsLoaded = true;

document.addEventListener('astro:page-load', () => {
  setupReveals();
  void setupScrollEffects();
});

document.addEventListener('astro:before-swap', () => {
  teardownReveals();
  teardownScrollEffects();
});
