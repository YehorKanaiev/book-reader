import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeObservableDirective } from './resize-observable.directive';

@NgModule({
  declarations: [ResizeObservableDirective],
  exports: [ResizeObservableDirective],
  imports: [CommonModule],
})
export class SharedModule {}
