import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[rdResizeObservable]',
})
export class ResizeObservableDirective implements OnDestroy {
  @Input() debounceTime = 100;
  @Output() dimensions = new EventEmitter<Dimensions>();

  resizeObserver?: ResizeObserver;
  private readonly resize$ = new Subject<ResizeObserverEntry>();
  private readonly destroy$ = new Subject<void>();

  constructor(private el: ElementRef) {
    this.initResizeObserver();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private initResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.resize$.next(entry);
      }
    });
    this.resizeObserver.observe(this.el.nativeElement);
    this.resize$
      .asObservable()
      .pipe(
        debounceTime(this.debounceTime),
        tap(event => this.emitDimensionsChanges(event)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  emitDimensionsChanges(event: ResizeObserverEntry): void {
    let dimensions: Dimensions;

    if (event.contentBoxSize) {
      const contentBoxSize = event.contentBoxSize[0];
      dimensions = {
        width: contentBoxSize.inlineSize,
        height: contentBoxSize.blockSize,
      };
    } else {
      const content = event.contentRect;
      dimensions = {
        width: content.width,
        height: content.height,
      };
    }

    this.dimensions.emit(dimensions);
  }
}

export type Dimensions = {
  width: number;
  height: number;
};
