import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: '', loadChildren: () => import('./unauth/unauth.module').then(m => m.UnauthModule) },
  {
    path: 'user', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }

];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes,
    { useHash: true }
  )],
  exports: [RouterModule]
})

export class AppRoutingModule { }
