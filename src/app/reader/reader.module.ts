import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderComponent } from './features/reader.component';
import { SidenavListComponent } from './ui/sidenav-list/sidenav-list.component';
import { BookControlsComponent } from './ui/book-controls/book-controls.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@reader/shared/shared.module';

@NgModule({
  declarations: [ReaderComponent, SidenavListComponent, BookControlsComponent],
  imports: [CommonModule, MatSidenavModule, MatIconModule, MatButtonModule, SharedModule],
})
export class ReaderModule {}
