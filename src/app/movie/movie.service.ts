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
              if (movie.genre_ids) {
                movie.genre_ids.forEach(id => {
                  this.genreList.forEach((genre) => {
                    if (genre.id === id) {
                      temporaryGenreList.push(genre.name);
                      return;
                    }
                  });
                });
              }
              moviesContainer.push(
                new MovieBasic(
                  movie.id,
                  movie.poster_path,
                  movie.title ? movie.title : movie.original_name,
                  movie.release_date ? movie.release_date : movie.first_air_date,
                  temporaryGenreList,
                  movie.title ? 'movie' : 'tv'
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

  searchMovie(id: number, type: string) {

    if (type !== 'tv' && type !== 'movie') {
      return 'not valid type';
    }

    const path = "https://api.themoviedb.org/3/" + type + '/' + id + "?api_key=" + environment.API_KEY + "&language=en-US";

    return this.http.get<any>(path).pipe(
      map(
        movie => {
          const genres: string[] = [];
          movie.genres.forEach(element => {
            genres.push(element.name);
          });

          // extract countries from production_companies
          const countries: string[] = [];
          if (movie.production_countries) {
            movie.production_countries.forEach(element => {
              if (element.name && !countries.includes(element.name)) {
                countries.push(element.name);
              }
            });
          }

          // extract language
          const languages: string[] = [];
          if (movie.spoken_languages) {
            movie.spoken_languages.forEach(element => {
              if (element.name && !countries.includes(element.name)) {
                languages.push(element.name);
              }
            });
          }
          // data depends on type (series or movie)
          return new MovieExpanded(
            movie.poster_path,
            movie.title ? movie.title : movie.original_name,
            languages.length !== 0 ? languages : [movie.original_language],
            movie.tagline,
            movie.overview, // it's description
            genres,
            movie.release_date ? movie.release_date : movie.first_air_date,
            movie.imdb_id ? 'https://www.imdb.com/title/' + movie.imdb_id : movie.homepage,
            movie.runtime ? movie.runtime : movie.episode_run_time ? movie.episode_run_time[0] : null,
            countries.length !== 0 ? countries : movie.origin_country
          );
        }
      ),
      tap(movie => {
        return this._movie.next(movie);
      })
    ).subscribe();
  }
}






