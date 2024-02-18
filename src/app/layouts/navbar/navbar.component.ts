import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  showSearchbar = false;

  showLanguages = false;
  showMobileMenu = false;

  navItems = [
    {
      title: 'EUR-USD',
      link: 'usd',
    },
    {
      title: 'EUR-GBP',
      link: 'gbp',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
