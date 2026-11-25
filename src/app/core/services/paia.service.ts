import { Injectable, signal } from '@angular/core';
import {
  CAREER_ROLES,
  CV_PROFILE,
  EDUCATION_ITEMS,
  PUBLICATIONS,
  SPECIALTIES,
  TECH_TIMELINE_GROUPS,
} from '../data/cv.data';
import { CareerRole } from '../models/cv.models';

export interface PaiaAction {
  label: string;
  url: string;
  external: boolean;
}

export interface PaiaMessage {
  id: number;
  sender: 'paia' | 'user';
  text: string;
  roles?: CareerRole[];
  actions?: PaiaAction[];
}

@Injectable({ providedIn: 'root' })
export class PaiaService {
  readonly typing = signal<boolean>(false);
  readonly messages = signal<PaiaMessage[]>([
    {
      id: 1,
      sender: 'paia',
      text: "Hello — I'm PAIA, Peter's AI Assistant. I have Peter's full 1997–2026 CV indexed: 11 career roles, +500 API systems, MSc CS, and 30+ technologies. Ask me about his CTO/founder work, SatCom & FinTech experience, tech stack, or how to reach him.",
    },
  ]);

  ask(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.messages.update((list) => [...list, { id: Date.now(), sender: 'user', text: trimmed }]);
    this.typing.set(true);

    setTimeout(() => {
      const reply = this.generateReply(trimmed);
      this.messages.update((list) => [...list, reply]);
      this.typing.set(false);
    }, 180);
  }

  searchRoles(query: string, limit = 3): CareerRole[] {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.replace(/[^a-z0-9.#+]/g, ''))
      .filter(
        (t) =>
          t.length >= 2 &&
          !['what', 'has', 'peter', 'about', 'the', 'and', 'for', 'how', 'did', 'his', 'with', 'does', 'work'].includes(t),
      );

    if (terms.length === 0) return [];

    return CAREER_ROLES.map((role) => {
      const hay = `${role.title} ${role.company} ${role.location} ${role.timespan} ${role.description.join(' ')} ${role.tech.join(' ')}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (role.company.toLowerCase().includes(term) || role.title.toLowerCase().includes(term)) score += 3;
        if (role.tech.some((t) => t.toLowerCase().includes(term))) score += 2;
        if (hay.includes(term)) score += 1;
      }
      return { role, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.role);
  }

  private generateReply(query: string): PaiaMessage {
    const q = query.toLowerCase();
    const id = Date.now() + 1;

    if (
      q.includes('reach') ||
      q.includes('contact') ||
      q.includes('whatsapp') ||
      q.includes('telegram') ||
      q.includes('signal') ||
      q.includes('email') ||
      q.includes('hire') ||
      q.includes('phone')
    ) {
      return {
        id,
        sender: 'paia',
        text: `Peter operates between Copenhagen (${CV_PROFILE.phone}) and Bangkok. You can email ${CV_PROFILE.email} or open his Contact Hub for 9 direct messaging channels and vCard.`,
        actions: [
          { label: 'Open Contact Hub', url: CV_PROFILE.contactHubUrl, external: true },
          { label: 'Email hello@pemo.me', url: `mailto:${CV_PROFILE.email}`, external: true },
          { label: 'LinkedIn', url: CV_PROFILE.linkedinUrl, external: true },
        ],
      };
    }

    if (q.includes('blog') || q.includes('essay') || q.includes('forward thinking') || q.includes('writing') || q.includes('book') || q.includes('publish')) {
      const pub = PUBLICATIONS[0];
      return {
        id,
        sender: 'paia',
        text: `Peter authored "${pub.title}" (${pub.publisher}, ${pub.year}) and published 640 engineering & architecture essays on Forward Thinking (2007–2021).`,
        actions: [
          { label: 'Visit Forward Thinking', url: CV_PROFILE.forwardThinkingUrl, external: true },
          { label: pub.title, url: pub.url, external: true },
        ],
      };
    }

    if (q.includes('education') || q.includes('degree') || q.includes('msc') || q.includes('bsc') || q.includes('university') || q.includes('cert') || q.includes('language')) {
      const topEdu = EDUCATION_ITEMS.slice(0, 4)
        .map((e) => `${e.year} ${e.title} (${e.institution})`)
        .join(' · ');
      return {
        id,
        sender: 'paia',
        text: `Education & Certifications: ${topEdu}. Languages: ${CV_PROFILE.languages.join(', ')}.`,
        actions: [
          { label: 'Download 2022 PDF', url: CV_PROFILE.legacyPdfUrl, external: true },
        ],
      };
    }

    if (q.includes('cto') || q.includes('leader') || q.includes('advis') || q.includes('board') || q.includes('founder') || q.includes('startup')) {
      const leadershipRoles = CAREER_ROLES.filter(
        (r) =>
          r.title.toLowerCase().includes('cto') ||
          r.title.toLowerCase().includes('founder') ||
          r.title.toLowerCase().includes('advisor') ||
          r.title.toLowerCase().includes('lead'),
      ).slice(0, 3);
      return {
        id,
        sender: 'paia',
        text: 'Peter has served as CTO, Co-Founder, Lead Engineer, and Board Advisor across Denmark, Malaysia, Singapore, and Thailand — including exits (WeDoCode), SatCom at ST Electronics, and FinTech/Aviation ventures.',
        roles: leadershipRoles,
        actions: [
          { label: 'Open Contact Hub', url: CV_PROFILE.contactHubUrl, external: true },
        ],
      };
    }

    const matchedRoles = this.searchRoles(query, 3);
    if (matchedRoles.length > 0) {
      return {
        id,
        sender: 'paia',
        text: `Found ${matchedRoles.length} career milestone${matchedRoles.length > 1 ? 's' : ''} matching "${query}":`,
        roles: matchedRoles,
        actions: [
          { label: 'Forward Thinking', url: CV_PROFILE.forwardThinkingUrl, external: true },
          { label: 'Contact Hub', url: CV_PROFILE.contactHubUrl, external: true },
        ],
      };
    }

    const techMatch = TECH_TIMELINE_GROUPS.flatMap((g) => g.items).find((item) =>
      item.name.toLowerCase().includes(q),
    );
    if (techMatch) {
      return {
        id,
        sender: 'paia',
        text: `Peter has used ${techMatch.name} (${techMatch.startYear}–${techMatch.endYear}, status: ${techMatch.status}). ${SPECIALTIES[0].detail}`,
        actions: [
          { label: 'Forward Thinking', url: CV_PROFILE.forwardThinkingUrl, external: true },
        ],
      };
    }

    return {
      id,
      sender: 'paia',
      text: 'Peter brings 29 years (1997–2026) of full-stack software architecture, +500 API systems, CTO/founder leadership, and board advisory across Copenhagen & Bangkok. Try asking about "Angular", "CTO", "SatCom", "education", or "contact".',
      actions: [
        { label: 'Contact Hub', url: CV_PROFILE.contactHubUrl, external: true },
        { label: 'Forward Thinking', url: CV_PROFILE.forwardThinkingUrl, external: true },
      ],
    };
  }
}
