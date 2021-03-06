import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StepSectionWrapper } from './step-section-wrapper.component';
import { StepSection } from '../shared/step-section.model';

describe('StepSectionWrapperComponent', () => {
  let component: StepSectionWrapper;
  let fixture: ComponentFixture<StepSectionWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepSectionWrapper ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepSectionWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new section when requested', () => {
    const createSectionBtn = fixture.debugElement.query(By.css('#createItemBtn'));
    const sections = [new StepSection()];

    // Applying a know value for the sections attribute.
    component.sections = sections;
    fixture.detectChanges();

    createSectionBtn.triggerEventHandler('click', null); // Clicking on the button.
    fixture.detectChanges();

    expect(component.sections.length).toEqual(2);
  });
});
