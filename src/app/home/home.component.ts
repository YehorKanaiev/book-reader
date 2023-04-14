import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { samples } from '@reader/home/samples';
import { AppRoutingPaths } from '@reader/app-routing-paths.enum';
import { ReaderRoutingPaths } from '@reader/reader/reader-routing-paths.enum';
import { allowedFileTypes } from '@reader/core/allowed-file-types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'rd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('fileUpload') fileInput?: ElementRef<HTMLInputElement>;

  readonly allowedFileTypes = allowedFileTypes.map(type => type.type);
  readonly allowedTypesString = allowedFileTypes.map(type => type.type).join(', ');
  readonly allowedTypesNames = allowedFileTypes.map(type => type.name).join(', ');
  readonly samples = samples;
  readonly readerPath = [AppRoutingPaths.Reader, ReaderRoutingPaths.Epub];

  constructor(private readonly router: Router, private readonly snackbarService: MatSnackBar) {}

  onFileSelected(): void {
    if (!this.fileInput) {
      return;
    }

    const file: File | null = this.fileInput.nativeElement.files ? this.fileInput.nativeElement.files[0] : null;
    if (!file) {
      return;
    }

    if (!this.allowedFileTypes.includes(file.type)) {
      this.showSnackbar('Please open file with a correct format');

      return;
    }

    if (window.FileReader) {
      const reader = new FileReader();
      reader.onload = (e): void => {
        if (e.target?.result) {
          this.openArrayBuffer(e.target.result as ArrayBuffer);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  }

  openArrayBuffer(file: ArrayBuffer): void {
    this.router.navigate(this.readerPath, { state: { book: file } });
  }

  openSample(sample: string): void {
    const encodedSampleURL = encodeURIComponent(sample);
    this.router.navigate(this.readerPath, { queryParams: { src: encodedSampleURL } });
  }

  onFilesDropped(files: FileList): void {
    if (files.length < 1) {
      return;
    }

    const books = this.getAllowedFiles(files, this.allowedFileTypes);

    if (books.length < 1) {
      this.showSnackbar('Please open file with a correct format');

      return;
    }

    books[0].arrayBuffer().then(buffer => this.openArrayBuffer(buffer));
  }

  private getAllowedFiles(files: FileList, types: string[]): File[] {
    const allowedFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const type = files[i].type;
      if (types.includes(type)) {
        allowedFiles.push(files[i]);
      }
    }

    return allowedFiles;
  }

  private showSnackbar(message: string): void {
    this.snackbarService.open(message, undefined, { horizontalPosition: 'right', duration: 3000 });
  }
}
