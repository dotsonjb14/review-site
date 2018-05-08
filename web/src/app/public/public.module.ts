import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { PostsViewComponent } from './posts-view/posts-view.component';
import { PostViewComponent } from './post-view/post-view.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [HomepageComponent],
  declarations: [PostsViewComponent, PostViewComponent, HomepageComponent]
})
export class PublicModule { }
