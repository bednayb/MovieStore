import { MovieExpanded } from './models/movie.expanded.model';
import { Genre } from './models/genre.model';
import { MovieBasic } from './models/movie.basic.model';
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { tap, map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: "root" })

export class MovieService {



  // MovieList
  private _movies = new BehaviorSubject<MovieBasic[]>([]);

  get movies() {
    return this._movies.asObservable();
  }

  // Movie
  private _movie = new BehaviorSubject<MovieExpanded>(null);
  get movie() {
    return this._movie.asObservable();
  }

  // Genre
  private genrePath = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + environment.API_KEY + "&language=en-US"
  private genreList: Genre[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.getGenreList();
    // this.searchMovieList();
  }

  getGenreList() {
    return this.http.get<any>(this.genrePath).pipe(
      tap(genreList => {
        this.genreList = genreList.genres;
      }
      )
    ).subscribe();
  }

  searchMovieList(filter: string) {
    const urlEncodedFilterText = encodeURI(filter);
    const moviePath = "https://api.themoviedb.org/3/search/multi?api_key=" + environment.API_KEY + "&language=en-US&query=" + urlEncodedFilterText + "&page=1&include_adult=false";

    return this.http.get<any>(moviePath)
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
                  movie.id,
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

  searchMovie(id: number) {
    const path = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + environment.API_KEY + "&language=en-US";

    return this.http.get<any>(path).pipe(
      map(
        movie => {

          const genres: string[] = [];
          movie.genres.forEach(element => {
            genres.push(element.name);
          });

          // extract countries from production_companies
          const countries: string[] = [];
          movie.production_countries.forEach(element => {
            if (element.name && !countries.includes(element.name)) {
              countries.push(element.name);
            }
          });

          // extract language
          const languages: string[] = [];
          movie.spoken_languages.forEach(element => {
            if (element.name && !countries.includes(element.name)) {
              languages.push(element.name);
            }
          });

          return new MovieExpanded(
            movie.poster_path,
            movie.title,
            languages,
            movie.tagline,
            movie.overview, // it's description
            genres,
            movie.release_date,
            movie.imdb_id,
            movie.runtime,
            countries
          );
        }
      ),
      tap(movie => {
        return this._movie.next(movie);
      })
    ).subscribe();
  }
}
