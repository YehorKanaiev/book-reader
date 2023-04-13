import { Inject, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppState } from '@state/app.state';
import { Store } from '@ngrx/store';
import { selectTheme } from '@state/theme/theme.selectors';
import { Subscription } from 'rxjs';
import { Theme } from '@reader/core/themes.enum';

@Injectable()
export class ThemeService implements OnDestroy {
  private readonly renderer: Renderer2;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly rendererFactory: RendererFactory2,
    private readonly store: Store<AppState>
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const theme$ = this.store.select(selectTheme).subscribe(theme => this.switchTheme(theme));
    this.subscriptions.push(theme$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  switchTheme(theme: Theme): void {
    this.renderer.setAttribute(this.document.body, 'class', theme);
  }
}
