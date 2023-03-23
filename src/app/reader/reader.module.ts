import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderWrapperComponent } from './features/reader-wrapper.component';
import { SidenavListComponent } from './ui/sidenav-list/sidenav-list.component';
import { BookControlsComponent } from './ui/book-controls/book-controls.component';

@NgModule({
  declarations: [ReaderWrapperComponent, SidenavListComponent, BookControlsComponent],
  imports: [CommonModule],
})
export class ReaderModule {}
