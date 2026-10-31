// GSAP + ScrollTrigger, loaded only on pages that have a [data-scroll] element.
// Use for scroll-linked work Motion can't do simply: scrub, pin, timelines tied to scroll.
// Add an effect: write a function below and add it to scrollEffects, then use data-scroll="<name>".
type Gsap = typeof import('gsap').gsap;

const scrollEffects: Record<string, (gsap: Gsap, element: HTMLElement) => void> = {
  parallax(gsap, element) {
    gsap.to(element, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  },
};

let revertCurrent: (() => void) | null = null;
// Bumped on every navigation so a slow GSAP import never attaches to a page that is already gone.
let generation = 0;

export async function setupScrollEffects(): Promise<void> {
  const myGeneration = ++generation;
  const elements = document.querySelectorAll<HTMLElement>('[data-scroll]');
  if (elements.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let gsap: Gsap;
  try {
    const [gsapModule, scrollTriggerModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap = gsapModule.gsap;
    gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
  } catch (error) {
    console.error('[scroll] Could not load GSAP; scroll effects are off for this page.', error);
    return;
  }

  if (myGeneration !== generation) return;

  const context = gsap.context(() => {
    elements.forEach((element) => {
      const name = element.dataset.scroll ?? '';
      const effect = scrollEffects[name];
      if (effect) {
        effect(gsap, element);
      } else {
        console.warn(`[scroll] Unknown data-scroll effect "${name}".`, element);
      }
    });
  });
  revertCurrent = () => context.revert();
}

export function teardownScrollEffects(): void {
  generation++;
  revertCurrent?.();
  revertCurrent = null;
}
