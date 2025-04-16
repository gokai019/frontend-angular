import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'frontend';
}