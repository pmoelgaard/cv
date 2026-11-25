import { TestBed } from '@angular/core/testing';
import { PaiaService } from './paia.service';

describe('PaiaService', () => {
  let service: PaiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaiaService);
  });

  it('should search roles by technology or company', () => {
    const satcom = service.searchRoles('SatCom');
    expect(satcom.length).toBeGreaterThan(0);
    expect(satcom[0].company).toContain('Singapore Technologies');

    const hyperledger = service.searchRoles('HyperLedger');
    expect(hyperledger.length).toBeGreaterThan(0);
    expect(hyperledger[0].company).toBe('THIRD CIRCLE');
  });

  it('should answer contact queries with Contact Hub action', async () => {
    service.ask('How do I contact Peter?');
    await new Promise((r) => setTimeout(r, 250));
    const last = service.messages().at(-1);
    expect(last?.sender).toBe('paia');
    expect(last?.actions?.some((a) => a.url === 'https://contact.pemo.me')).toBe(true);
  });
});
