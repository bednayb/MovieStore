import { Genre } from './models/genre.model';
import { MovieBasic } from './models/movie.basic.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { tap, map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: "root" })

export class MovieService {

  // TODO: CHANGE PATH to DINAMICALLY
  private moviePath = "https://api.themoviedb.org/3/search/multi?api_key=" + environment.API_KEY + "&language=en-US&query=Kill%20Bill&page=1&include_adult=false";

  // MovieList
  private _movies = new BehaviorSubject<MovieBasic[]>([]);

  get movies() {
    return this._movies.asObservable();
  }

  // Genre
  private genrePath = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + environment.API_KEY + "&language=en-US"
  private genreList: Genre[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.getGenreList();
    this.search();
  }

  getGenreList() {
    return this.http.get<any>(this.genrePath).pipe(
      tap(genreList => {
        this.genreList = genreList.genres;
      }
      )
    ).subscribe();
  }

  search() {
    return this.http.get<any>(this.moviePath)
      .pipe(
        map(
          movies => movies.results
        ),
        map(
          movieList => {
            const moviesContainer = [];
            movieList.map(movie => {
              const temporaryGenreList = [];
              movie.genre_ids.forEach(id => {
                this.genreList.forEach((genre) => {
                  if (genre.id === id) {
                    temporaryGenreList.push(genre.name);
                    return;
                  }
                });
              });

              moviesContainer.push(
                new MovieBasic(
                  movie.poster_path,
                  movie.title,
                  movie.release_date,
                  temporaryGenreList
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
