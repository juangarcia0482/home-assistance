import { Routes } from '@angular/router';
import { EntityMappingComponent } from './components/entity-mapping.component';
import { ThemeSelectorComponent } from './components/theme-selector.component';
import { WelcomeComponent } from './components/welcome.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'entity-mapping', component: EntityMappingComponent },
    { path: 'themes', component: ThemeSelectorComponent },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', redirectTo: '/welcome' }
];
