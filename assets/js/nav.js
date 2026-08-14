/* Header navigation + site search.
 *
 * Loaded by every page. The two panels (menu, search) are markup that lives at
 * the TOP LEVEL of each page — deliberately outside the hero — because
 * `.hero-pinned` is `position: sticky` from lg up, which makes it a stacking
 * context: a panel nested inside it can never paint above the sections that
 * follow, no matter its z-index. A global Alpine store is what lets the header
 * buttons (which do sit inside the hero) drive panels that don't.
 *
 * Opening one panel closes the other — the header only has room for one active
 * state, and the Figma frames show exactly one open at a time.
 */
document.addEventListener('alpine:init', () => {
  /* The search index is page COPY, not page titles: the Figma results list
     shows sentence fragments labelled with the site area they came from, and
     the same page can appear more than once. Regenerate it from the headings
     and lead paragraphs of each page whenever the copy changes. */
  const CONTENT = [
    { text: 'The operational backbone of UAE healthcare', url: 'index.html', section: 'Homepage' },
    { text: 'Calculator estimates the equipment, infrastructure, and consumables, with a 5-year cost forecast', url: 'index.html', section: 'Homepage' },
    { text: 'Designed around continuity', url: 'index.html', section: 'Homepage' },
    { text: 'Healthcare depends on thousands of interconnected systems working together every day.', url: 'index.html', section: 'Homepage' },
    { text: 'The largest integrated healthcare networkin the United Arab Emirates.', url: 'index.html', section: 'Homepage' },
    { text: 'What OneHealth delivers across the business', url: 'index.html', section: 'Homepage' },
    { text: 'Engineering the systems healthcare depends on', url: 'about.html', section: 'Who we are' },
    { text: 'Manufacturers represented', url: 'about.html', section: 'Who we are' },
    { text: 'A single partner across the lifecycle', url: 'about.html', section: 'Who we are' },
    { text: 'Most of the work begins after delivery.', url: 'about.html', section: 'Who we are' },
    { text: '... and today the divisions work across all seven emirates.', url: 'about.html', section: 'Who we are' },
    { text: 'Medical consumables,made to standard', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Five families cover the consumables a healthcare facility gets through.', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Nitrile gloves, Type IIR masks, isolation gowns, PE aprons, caps and shoe covers.', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Sterile non woven swabs, antiseptic wipes, surface protection and sterilisation accessories.', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Wash basins, kidney dishes, examination table rolls, petroleum jelly and baby wipes.', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Sterile gauze and dressings, foam and hydrocolloid dressings, PE tape and plasters.', url: 'medtrust.html', section: 'Who we are' },
    { text: 'Diagnostics & genomics for the country\'s laboratories', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'Globally recognised brands', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'One Health stays close to the laboratories it equips, long after installation.', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'Complete laboratory design and setup, including equipment planning and commissioning.', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'Local specialists and service engineers who train your team and keep the equipment serviced.', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'A local team for assay validation and workflow tuning, on call when a method needs work.', url: 'ivd-life-sciences.html', section: 'Our divisions' },
    { text: 'The products and projects behind a working facility', url: 'medical-products.html', section: 'Our divisions' },
    { text: 'A premium outpatient clinic on Saadiyat Island, equipped and commissioned as a turnkey project.', url: 'medical-products.html', section: 'Our divisions' },
    { text: 'SSMC Pura Longevity Clinic', url: 'medical-products.html', section: 'Our divisions' },
    { text: 'SEHA mobile clinics and screening buses', url: 'medical-products.html', section: 'Our divisions' },
    { text: 'Our engineers install and commission the equipment, then train the team before handover.', url: 'medical-products.html', section: 'Our divisions' },
    { text: 'One team for a hospital\'s building and equipment', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'Facilities, maintenance and sterile services', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'Continuous readiness for JCI and the UAE health regulators, checked and evidenced year round.', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'Energy and utilities managed down per bed, with ESG reporting the regulator can check.', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'Facilities planning at the design and commissioning stage, where cost and risk are cheapest to remove.', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'IoT asset tracking and building management systems that show how a facility is performing in real time.', url: 'facilities-and-technical-services.html', section: 'Our divisions' },
    { text: 'The supply chain that keeps healthcare stocked', url: 'supplychain.html', section: 'Our divisions' },
    { text: 'Every division depends on this operation, and so do the providers we deliver to.', url: 'supplychain.html', section: 'Our divisions' },
    { text: 'Tell us what you need stored or moved and it reaches the supply chain team', url: 'supplychain.html', section: 'Our divisions' },
    { text: 'Bringing global healthcare technology to the UAE', url: 'business-development.html', section: 'Our divisions' },
    { text: 'Our partners are internationally recognised names in healthcare and life sciences, represented across the UAE.', url: 'business-development.html', section: 'Our divisions' },
    { text: 'Recent work across the UAE', url: 'business-development.html', section: 'Our divisions' },
    { text: 'Hyperbaric oxygen therapy chamber installed and commissioned at Sheikh Shakhbout Medical City.', url: 'business-development.html', section: 'Our divisions' },
    { text: 'A premium outpatient clinic on Saadiyat Island, delivered as a turnkey project.', url: 'business-development.html', section: 'Our divisions' },
    { text: 'Announcements, partnerships, and resources from across the network.', url: 'news.html', section: 'Insights & media' },
    { text: 'Backing an EHS team at the ISBT transfusion congress', url: 'news.html', section: 'Insights & media' },
    { text: 'One Health sponsored a delegation from Emirates Health Services at the ISBT congress in Kuala Lumpur.', url: 'news.html', section: 'Insights & media' },
    { text: 'World Blood Donor Day with EHS in Dubai', url: 'news.html', section: 'Insights & media' },
    { text: 'Emirates Health Services marked World Blood Donor Day in Dubai, with One Health supporting the campaign.', url: 'news.html', section: 'Insights & media' },
    { text: 'One Health and FUJIFILM at the Urology Care Consortium', url: 'news.html', section: 'Insights & media' },
    { text: 'Tell us what you need and your enquiry reaches the people who handle it.', url: 'contact.html', section: 'Contact' },
    { text: 'Vision Tower, Business Bay', url: 'contact.html', section: 'Contact' },
    { text: 'What the partnership covers', url: 'article.html', section: 'Insights & media' },
    { text: 'The agreement adds to the portfolio of manufacturers One Health represents in the UAE.', url: 'article.html', section: 'Insights & media' },
    { text: 'Careers at One Health', url: 'careers.html', section: 'Careers' },
    { text: 'Contact One Health', url: 'contact.html', section: 'Contact' },
  ];

  const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  Alpine.store('nav', {
    menu: false,
    search: false,
    query: '',

    toggleMenu() {
      this.menu = !this.menu;
      this.search = false;
      this.sync();
    },
    toggleSearch() {
      this.search = !this.search;
      this.menu = false;
      this.sync();
    },
    close() {
      this.menu = this.search = false;
      this.sync();
    },
    /* Search is a full-screen view at every width and the menu is one below lg,
       so letting the page behind keep its scroll position is what stops the
       panel reading as part of the page underneath. */
    sync() {
      document.body.style.overflow = this.menu || this.search ? 'hidden' : '';
    },

    clear() {
      this.query = '';
    },

    get results() {
      const q = this.query.trim().toLowerCase();
      if (!q) return [];
      return CONTENT.filter((c) => c.text.toLowerCase().includes(q));
    },

    get resultsLabel() {
      const n = this.results.length;
      return `${n} ${n === 1 ? 'result' : 'results'} for “${this.query.trim()}”`;
    },

    /* Wraps every occurrence of the query in the title with the design's
       highlight. Both halves are escaped before any markup is added, so the
       result is safe to hand to x-html. */
    highlight(text) {
      const q = this.query.trim();
      const safe = escapeHtml(text);
      if (!q) return safe;
      const pattern = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return safe.replace(
        new RegExp(pattern, 'gi'),
        (m) => `<mark class="bg-brand/20 text-black">${m}</mark>`
      );
    },
  });
});
