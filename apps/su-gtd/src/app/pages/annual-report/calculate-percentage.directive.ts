import { Directive, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[calculatePercentage]',
})
export class CalculatePercentageDirective implements OnInit {
  @Input() formGroup: FormGroup; // accept form group as input
  @Input() formControlName1: string;
  @Input() formControlName2: string;

  ngOnInit() {
    // Subscribe to value changes of value1 and value2 form controls
    this.formGroup.get(this.formControlName1).valueChanges.subscribe(() => {
      this.updatePercentage();
    });

    this.formGroup.get(this.formControlName2).valueChanges.subscribe(() => {
      this.updatePercentage();
    });
  }

  updatePercentage() {
    const value1 = this.formGroup.get(this.formControlName1).value;
    const value2 = this.formGroup.get(this.formControlName2).value;
    const percentage = Math.floor((value1 / value2) * 100 || 0); // calculate percentage and handle divide by zero
    this.formGroup.get('percentage').setValue(percentage);
  }
}
