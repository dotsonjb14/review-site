import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { PublicComponent } from './public.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImportantComponent } from './important/important.component';
import { ArticleComponent } from './article/article.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    LoginComponent
  ],
  declarations: [LoginComponent, PublicComponent, HomeComponent, ImportantComponent, ArticleComponent, SearchComponent]
})
export class PublicModule { }
