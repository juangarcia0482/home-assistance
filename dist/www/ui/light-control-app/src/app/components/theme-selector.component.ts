import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
    selector: 'app-theme-selector',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="theme-selector">
      <div class="theme-header">
        <h3>🎨 Choose Theme</h3>
        <p>Customize your smart home interface</p>
      </div>
      
      <div class="theme-grid">
        <button
          *ngFor="let theme of themeService.availableThemes"
          (click)="selectTheme(theme)"
          class="theme-option"
          [class.active]="themeService.currentTheme().id === theme.id"
          [style.--preview-primary]="theme.colors.primary"
          [style.--preview-secondary]="theme.colors.secondary"
          [style.--preview-background]="theme.colors.background"
          [style.--preview-gradient]="theme.gradients.background"
        >
          <div class="theme-preview">
            <div class="preview-header"></div>
            <div class="preview-content">
              <div class="preview-sidebar"></div>
              <div class="preview-main">
                <div class="preview-card"></div>
                <div class="preview-card small"></div>
              </div>
            </div>
          </div>
          <div class="theme-info">
            <span class="theme-name">{{ theme.name }}</span>
            <div class="theme-colors">
              <span class="color-dot" [style.backgroundColor]="theme.colors.primary"></span>
              <span class="color-dot" [style.backgroundColor]="theme.colors.secondary"></span>
              <span class="color-dot" [style.backgroundColor]="theme.colors.accent"></span>
            </div>
          </div>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .theme-selector {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .theme-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .theme-header h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: var(--theme-text, #ffffff);
    }

    .theme-header p {
      margin: 0;
      color: var(--theme-textSecondary, #94a3b8);
      font-size: 0.9rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .theme-option {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: inherit;
    }

    .theme-option:hover {
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .theme-option.active {
      border-color: var(--theme-primary, #3b82f6);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }

    .theme-preview {
      width: 100%;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;
      background: var(--preview-gradient);
      position: relative;
    }

    .preview-header {
      height: 20px;
      background: linear-gradient(90deg, var(--preview-primary), var(--preview-secondary));
    }

    .preview-content {
      display: flex;
      height: 100px;
    }

    .preview-sidebar {
      width: 60px;
      background: rgba(0, 0, 0, 0.3);
      border-right: 1px solid var(--preview-primary);
    }

    .preview-main {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .preview-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      height: 35px;
      border-left: 3px solid var(--preview-primary);
    }

    .preview-card.small {
      height: 25px;
      width: 70%;
    }

    .theme-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .theme-name {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .theme-colors {
      display: flex;
      gap: 4px;
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `]
})
export class ThemeSelectorComponent {
    constructor(public themeService: ThemeService) { }

    selectTheme(theme: Theme): void {
        this.themeService.setTheme(theme);
    }
}