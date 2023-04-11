import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeObservableDirective } from './resize-observable.directive';
import { DragAndDropDirective } from '@reader/shared/dnd.directive';

@NgModule({
  declarations: [ResizeObservableDirective, DragAndDropDirective],
  exports: [ResizeObservableDirective, DragAndDropDirective],
  imports: [CommonModule],
})
export class SharedModule {}
