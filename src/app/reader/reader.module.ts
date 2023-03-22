import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderWrapperComponent } from './features/reader-wrapper.component';
import { SidenavListComponent } from './ui/sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [ReaderWrapperComponent, SidenavListComponent],
  imports: [CommonModule],
})
export class ReaderModule {}
