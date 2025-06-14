import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ThemeService } from '../../services/theme.service';

enum ThemeMatIcon {
  Dark = 'dark_mode',
  Light = 'light_mode',
  System = 'settings_suggest',
}

interface ThemeData {
  icon: string;
  label: String;
  toggle(): void;
  isActive: Signal<boolean>;
}

@Component({
  selector: 'fa-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'fa-theme-switcher',
  },
})
export class ThemeSwitcherComponent {
  readonly _themeService = inject(ThemeService);

  readonly themeControl = new FormControl();

  readonly _themeDataList = this.buildThemeDataList();

  readonly currentThemeData = computed(() => {
    const curr = this._themeService.currentTheme();
    return this._themeDataList.find(
      (t) =>
        t.label.toLowerCase() === curr ||
        (curr == null && t.label === 'System'),
    )!;
  });

  _delegateClickEvent(event: Event) {
    event.stopPropagation();
  }

  private buildThemeDataList(): ThemeData[] {
    const entries = Object.entries(ThemeMatIcon);
    return entries.map(([label, icon]) => ({
      label,
      icon,
      toggle: () => {
        return (this._themeService as any)[`set${label}Theme`]();
      },
      isActive: computed(() => {
        const curr = this._themeService.currentTheme();
        if (curr == null) return label === 'System';
        return curr === label.toLowerCase();
      }),
    }));
  }
}
