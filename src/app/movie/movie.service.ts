import { MovieBasic } from './models/movie.basic.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { tap, map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: "root" })

export class MovieService {

  // TODO: CHANGE PATH to DINAMICALLY
  private path = "https://api.themoviedb.org/3/search/multi?api_key=" + environment.API_KEY + "&language=en-US&query=Kill%20Bill&page=1&include_adult=false";
  // MovieList
  private _movies = new BehaviorSubject<MovieBasic[]>([]);
  
  get movies() {
    return this._movies.asObservable();
  }

  constructor(
    private http: HttpClient,
  ) {
    this.search();
  }

  search() {
    return this.http.get<any>(this.path)
      .pipe(
        map(
          movies => movies.results
        ),
        map(
          movieList => {
            const moviesContainer = [];
            movieList.map(y => {
              moviesContainer.push(
                new MovieBasic(
                  y.poster_path,
                  y.title,
                  y.release_date,
                  y.genre_ids
                )
              );
            });
            return moviesContainer;
          }
        ),
        tap(movies => {
          return this._movies.next(movies);
        })
      ).subscribe();
  }
}