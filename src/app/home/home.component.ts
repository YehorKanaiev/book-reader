import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { samples } from '@reader/home/samples';
import { AppRoutingPaths } from '@reader/app-routing-paths.enum';
import { ReaderRoutingPaths } from '@reader/reader/reader-routing-paths.enum';

@Component({
  selector: 'rd-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('fileUpload') fileUpload?: ElementRef<HTMLInputElement>;

  readonly requiredFileType = '.epub';
  readonly samples = samples;
  readonly readerPath = [AppRoutingPaths.Reader, ReaderRoutingPaths.Epub];

  constructor(private readonly router: Router) {}

  onFileSelected(): void {
    if (!this.fileUpload) {
      return;
    }

    const file: File | null = this.fileUpload.nativeElement.files ? this.fileUpload.nativeElement.files[0] : null;

    if (file && window.FileReader) {
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
    this.router.navigate(this.readerPath, { queryParams: { src: encodeURIComponent(sample) } });
  }
}
