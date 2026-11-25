import { TestBed } from '@angular/core/testing';
import { DossierComponent } from './dossier.component';

describe('DossierComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierComponent],
    }).compileComponents();
  });

  it('should render Peter Andreas Moelgaard and all 11 career roles by default', async () => {
    const fixture = TestBed.createComponent(DossierComponent);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Peter Andreas Moelgaard');
    expect(fixture.componentInstance.filteredRoles().length).toBe(11);
  });

  it('should filter roles when selecting an era', () => {
    const fixture = TestBed.createComponent(DossierComponent);
    fixture.componentInstance.selectEra('2014-2020');
    expect(fixture.componentInstance.filteredRoles().every((r) => r.era === '2014-2020')).toBe(true);
    expect(fixture.componentInstance.filteredRoles().length).toBe(4);
  });
});
