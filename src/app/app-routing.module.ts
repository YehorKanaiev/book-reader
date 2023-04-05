import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderComponent } from '@reader/reader/features/reader.component';
import { Book } from '@reader/reader/services/book';
import { EpubBookService } from '@reader/reader/services/epub-book.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'book/epub',
  },
  {
    path: 'book',
    children: [
      {
        path: 'epub',
        component: ReaderComponent,
        providers: [
          {
            provide: Book,
            useClass: EpubBookService,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
