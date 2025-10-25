import { Injectable, signal } from '@angular/core';

export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        accent: string;
        border: string;
        success: string;
        warning: string;
        error: string;
    };
    gradients: {
        background: string;
        header: string;
        card: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'smart-home-theme';

    readonly availableThemes: Theme[] = [
        {
            id: 'blue',
            name: '🌊 Ocean Blue',
            colors: {
                primary: '#3b82f6',
                secondary: '#1e40af',
                background: '#0f172a',
                surface: 'rgba(59, 130, 246, 0.1)',
                text: '#ffffff',
                textSecondary: '#94a3b8',
                accent: '#06b6d4',
                border: 'rgba(59, 130, 246, 0.2)',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            },
            gradients: {
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                header: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                card: 'linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(30, 64, 175, 0.1))'
            }
        },
        {
            id: 'dark',
            name: '🌙 Dark Night',
            colors: {
                primary: '#6366f1',
                secondary: '#4338ca',
                background: '#0a0a0a',
                surface: 'rgba(99, 102, 241, 0.1)',
                text: '#ffffff',
                textSecondary: '#a1a1aa',
                accent: '#8b5cf6',
                border: 'rgba(99, 102, 241, 0.2)',
                success: '#22c55e',
                warning: '#eab308',
                error: '#dc2626'
            },
            gradients: {
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                header: 'linear-gradient(90deg, #4338ca 0%, #6366f1 100%)',
                card: 'linear-gradient(145deg, rgba(99, 102, 241, 0.15), rgba(67, 56, 202, 0.1))'
            }
        },
        {
            id: 'purple',
            name: '🔮 Royal Purple',
            colors: {
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                background: '#1a0b2e',
                surface: 'rgba(139, 92, 246, 0.1)',
                text: '#ffffff',
                textSecondary: '#c4b5fd',
                accent: '#a855f7',
                border: 'rgba(139, 92, 246, 0.2)',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171'
            },
            gradients: {
                background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 100%)',
                header: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)',
                card: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))'
            }
        },
        {
            id: 'green',
            name: '🌿 Nature Green',
            colors: {
                primary: '#10b981',
                secondary: '#059669',
                background: '#0c1f17',
                surface: 'rgba(16, 185, 129, 0.1)',
                text: '#ffffff',
                textSecondary: '#86efac',
                accent: '#34d399',
                border: 'rgba(16, 185, 129, 0.2)',
                success: '#22c55e',
                warning: '#f59e0b',
                error: '#ef4444'
            },
            gradients: {
                background: 'linear-gradient(135deg, #0c1f17 0%, #1e3a2e 100%)',
                header: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                card: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
            }
        },
        {
            id: 'orange',
            name: '🔥 Sunset Orange',
            colors: {
                primary: '#f97316',
                secondary: '#ea580c',
                background: '#1c1917',
                surface: 'rgba(249, 115, 22, 0.1)',
                text: '#ffffff',
                textSecondary: '#fdba74',
                accent: '#fb923c',
                border: 'rgba(249, 115, 22, 0.2)',
                success: '#65a30d',
                warning: '#eab308',
                error: '#dc2626'
            },
            gradients: {
                background: 'linear-gradient(135deg, #1c1917 0%, #431407 100%)',
                header: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
                card: 'linear-gradient(145deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.1))'
            }
        }
    ];

    readonly currentTheme = signal<Theme>(this.availableThemes[0]);

    constructor() {
        this.loadSavedTheme();
    }

    private loadSavedTheme(): void {
        const savedThemeId = localStorage.getItem(this.STORAGE_KEY);
        if (savedThemeId) {
            const theme = this.availableThemes.find(t => t.id === savedThemeId);
            if (theme) {
                this.setTheme(theme);
            }
        }
    }

    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);
        localStorage.setItem(this.STORAGE_KEY, theme.id);
        this.applyThemeToDocument(theme);
    }

    private applyThemeToDocument(theme: Theme): void {
        const root = document.documentElement;

        // Apply CSS custom properties
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });

        Object.entries(theme.gradients).forEach(([key, value]) => {
            root.style.setProperty(`--theme-gradient-${key}`, value);
        });
    }

    getThemeById(id: string): Theme | undefined {
        return this.availableThemes.find(theme => theme.id === id);
    }
}