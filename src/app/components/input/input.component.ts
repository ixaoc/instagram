import {
  Component,
  ContentChild,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';

import { InputDirective } from 'directives/input.directive';

@Component({
  selector: 'label',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host
      display: block
      font-size: .875rem
      line-height: 1.25rem
      font-weight: 600
      text-transform: uppercase
      letter-spacing: .05em
      color: rgb(17 24 39)
      margin-bottom: .75rem
    `,
  ],
})
export class LabelComponent {}

@Component({
  selector: 'field-input',
  template: `<ng-content></ng-content>`,
  styles: [
    `:host
      display: block
      width: 100%
      height: 3rem

      font-size: .875rem
      line-height: 1.25rem

      border-width: 1px
      border-radius: 0.5rem

      background-color: rgb(255 255 255)
      border-color: rgb(229 231 235)

      padding: 0.5rem 1rem

      transition-property: box-shadow
      transition-timing-function: cubic-bezier(.4,0,.2,1)
      transition-duration: .2s


      & ::ng-deep input
        width: 100%
        height: 100%
        font-family: inherit
        font-size: .875rem
        line-height: 1.25rem
        padding: 0
        border: 0
        outline: none

      &.is-focus
        border-color: rgb(17 24 39)
        outline: 2px solid transparent
        outline-offset: 2px

        box-shadow: 0 0 0 0 rgb(17 24 39), 0 0 0 1px rgb(17 24 39), 0 0 #0000

      &.is-error
        border-color: red
        box-shadow: none
  `,
  ],
})
export class FieldInputComponent {
  @Input() inputRef!: InputDirective;
  @Input() error: string | undefined = undefined;

  @ContentChild(InputDirective) input!: InputDirective;

  @HostBinding('class.is-focus')
  get focus() {
    return this.input?.focus ?? this.inputRef?.focus;
  }

  @HostBinding('class.is-error')
  get invalid() {
    return this.error;
    //     const item = this.input || this.inputRef;
    //
    //     return (
    //       item?.element.nativeElement.classList.contains('ng-invalid') &&
    //       !item?.element.nativeElement.classList.contains('ng-untouched')
    //     );
  }
}

@Component({
  selector: 'field',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
})
export class FieldComponent {
  @Input() label: string = '';
  @Input() hint: string | undefined = undefined;
  @Input() error: string | undefined = undefined;

  @ContentChild(LabelComponent) labelComponent!: LabelComponent;
  @ContentChild(FieldInputComponent) inputComponent!: FieldInputComponent;
  @ContentChild(InputDirective) input!: InputDirective;

  @HostBinding('class.is-flex')
  get isFlex() {
    const type = this.input?.type;
    return type === 'radio' || type === 'checkbox';
  }
}
