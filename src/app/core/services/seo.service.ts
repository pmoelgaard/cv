import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_URL = 'https://cv.pemo.me';
const SITE_TITLE = 'Peter A. Moelgaard — Curriculum Vitae (1997–2026)';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/og-default.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleSvc = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  setCvMeta(opts?: {
    title?: string;
    description?: string;
    path?: string;
  }): void {
    const title = opts?.title || SITE_TITLE;
    const description =
      opts?.description ||
      'Executive Curriculum Vitae of Peter Andreas Moelgaard — Principal Architect, CTO, Founder & Board Advisor across Copenhagen & Bangkok (1997–2026).';
    const path = opts?.path || '/';
    const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

    this.titleSvc.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'profile' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: 'Peter A. Moelgaard — Curriculum Vitae' });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:secure_url', content: DEFAULT_OG_IMAGE });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'Peter Andreas Moelgaard Curriculum Vitae — Bauhaus geometric emblem',
    });

    this.meta.updateTag({ property: 'profile:first_name', content: 'Peter Andreas' });
    this.meta.updateTag({ property: 'profile:last_name', content: 'Moelgaard' });
    this.meta.updateTag({ property: 'profile:username', content: 'pmoelgaard' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_OG_IMAGE });
    this.meta.updateTag({ name: 'twitter:image:alt', content: title });

    this.updateCanonical(canonicalUrl);
    this.updateJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: 'Peter A. Moelgaard — Curriculum Vitae',
          description,
          inLanguage: 'en',
        },
        {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'Peter Andreas Moelgaard',
          alternateName: ['Peter A. Moelgaard', 'PEMO'],
          birthDate: '1974-11-22',
          jobTitle: 'Principal Architect, CTO & Board Advisor',
          url: `${SITE_URL}/`,
          image: `${SITE_URL}/images/portrait.png`,
          email: 'mailto:hello@pemo.me',
          telephone: '+4540202858',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Gasværksvej 8A, 2.',
            postalCode: '1656',
            addressLocality: 'København V',
            addressCountry: 'DK',
          },
          workLocation: [
            { '@type': 'Place', name: 'Copenhagen, Denmark' },
            { '@type': 'Place', name: 'Bangkok, Thailand' },
          ],
          alumniOf: [
            { '@type': 'CollegeOrUniversity', name: 'Aalborg University' },
            { '@type': 'EducationalOrganization', name: 'Lyngby Business Academy' },
          ],
          knowsLanguage: ['Danish', 'English', 'German'],
          sameAs: [
            'https://forwardthinking.pemo.me/',
            'https://contact.pemo.me/',
            'https://go.pemo.me/linkedin',
          ],
        },
        {
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/#profilepage`,
          url: `${SITE_URL}/`,
          name: title,
          mainEntity: { '@id': `${SITE_URL}/#person` },
          isPartOf: { '@id': `${SITE_URL}/#website` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'PEMO', item: 'https://contact.pemo.me/' },
            { '@type': 'ListItem', position: 2, name: 'Curriculum Vitae', item: `${SITE_URL}/` },
          ],
        },
      ],
    });
  }

  private updateCanonical(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateJsonLd(data: Record<string, unknown>): void {
    const id = 'cv-jsonld-schema';
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
