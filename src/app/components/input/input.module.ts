import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InputDirective } from 'directives/input.directive'
import { LabelComponent, FieldComponent, FieldInputComponent } from './input.component'


@NgModule({
  declarations: [
    InputDirective,
    LabelComponent,
    FieldComponent,
    FieldInputComponent,
    
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    InputDirective,
    LabelComponent,
    FieldComponent,
    FieldInputComponent,
  ]
})
export class InputModule { }
