import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/movies",
    pathMatch: "full"
  },
  {
    path: "movies",
    loadChildren: "./movie/movie.module#MovieModule",
  },
  {
    path: "**",
    redirectTo: "movies",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
