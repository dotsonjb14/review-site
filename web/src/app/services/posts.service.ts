import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, filter, scan } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  public getPosts() {
    return this.httpClient.get("http://localhost:3000/posts")
      .pipe(map(x => x))
  }
}
