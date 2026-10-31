// Motion: fade/slide in any element marked data-reveal when it scrolls into view.
import { animate, inView } from 'motion';

let stopObservers: Array<() => void> = [];

export function setupReveals(): void {
  // The inline script in Base.astro sets data-motion="on" unless the user prefers reduced motion.
  if (document.documentElement.dataset.motion !== 'on') return;

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    const stop = inView(
      element,
      () => {
        animate(element, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: 'easeOut' });
        stop(); // reveal once
      },
      { amount: 'some' }, // any pixel visible; a fraction never triggers on very tall sections,
    );
    stopObservers.push(stop);
  });
}

export function teardownReveals(): void {
  stopObservers.forEach((stop) => stop());
  stopObservers = [];
}
