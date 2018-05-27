import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { HomeComponent } from './public/home/home.component';

let routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: PublicComponent, children: [
    // public routes components
    { path: "home", component: HomeComponent }
  ]},
  
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class RoutingModule { }
