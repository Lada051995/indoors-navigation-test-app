import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(router:Router) {
    router.navigate(['/map']);
  }
  title = 'indoors-navigation-test-app';
}
