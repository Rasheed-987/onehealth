/* Cookie consent.
 *
 * Loaded by every page, like nav.js. The bar itself is markup — a
 * `<!-- component: cookie-consent -->` block sitting at the TOP LEVEL of each
 * page, for the same stacking-context reason the nav overlay does — and this
 * file holds only the state: what was chosen, and whether the bar is up.
 *
 * The choice is stored under one key as a versioned record. Bumping VERSION
 * (because the policy or the category list changed) invalidates every stored
 * choice and re-prompts, which is what the regulator expects — consent is to a
 * specific set of purposes, not to the idea of cookies.
 *
 * Nothing here loads an analytics script. That is deliberate: the store is the
 * gate, and whatever tag you add later reads `$store.consent.analytics` before
 * it injects anything. Wiring a tag to fire regardless of this flag would make
 * the bar decorative.
 */
document.addEventListener('alpine:init', () => {
  Alpine.store('consent', {
    /* Bump when the categories or the policy change — see the note above. */
    VERSION: 1,
    KEY: 'onehealth.consent',

    /* `visible` drives the bar, `panel` the preferences drawer inside it.
       Both start closed: the stored choice is read in init(), and a returning
       visitor who has already chosen must never see the bar flash. */
    visible: false,
    panel: false,

    /* Necessary cookies are not represented here — they are not optional, so
       there is no state for them to be in. */
    analytics: false,
    marketing: false,

    init() {
      const stored = this.read();

      if (stored) {
        this.analytics = !!stored.analytics;
        this.marketing = !!stored.marketing;
        return;
      }

      this.visible = true;
      /* The bar covers the floating lab pill in the bottom-right corner. The
         class lets input.css stand the pill down while a choice is pending —
         see the rule next to `.js-lab-pill`. */
      document.body.classList.add('consent-open');
    },

    /* Storage is wrapped because Safari's private mode throws on write, and
       some corporate policies disable it outright. A visitor whose browser
       refuses to store the choice sees the bar again next time, which is the
       correct failure: no record means no consent. */
    read() {
      try {
        const raw = window.localStorage.getItem(this.KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && parsed.version === this.VERSION ? parsed : null;
      } catch (e) {
        return null;
      }
    },

    write() {
      try {
        window.localStorage.setItem(this.KEY, JSON.stringify({
          version: this.VERSION,
          analytics: this.analytics,
          marketing: this.marketing,
          date: new Date().toISOString(),
        }));
      } catch (e) {
        /* Ignored on purpose — see read(). */
      }
    },

    close() {
      this.visible = false;
      this.panel = false;
      document.body.classList.remove('consent-open');
    },

    acceptAll() {
      this.analytics = true;
      this.marketing = true;
      this.write();
      this.close();
    },

    /* "Decline" and a Save with nothing ticked are the same outcome: only the
       cookies the site cannot run without. */
    declineAll() {
      this.analytics = false;
      this.marketing = false;
      this.write();
      this.close();
    },

    save() {
      this.write();
      this.close();
    },

    togglePanel() {
      this.panel = !this.panel;
    },

    /* For a "Cookie preferences" control to reopen the bar after the fact —
       the footer link on every page currently points at a cookies.html that
       does not exist, and can be pointed here instead. */
    reopen() {
      this.visible = true;
      this.panel = true;
      document.body.classList.add('consent-open');
    },
  });
});
