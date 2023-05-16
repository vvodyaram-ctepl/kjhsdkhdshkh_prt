import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileAppFeedbackComponent } from './components/mobile-app-feedback/mobile-app-feedback.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { TimerComponent } from './components/timer/timer.component';

const routes: Routes = [
  {path:'feedback',component:MobileAppFeedbackComponent},
  {path:'onboarding',component:OnboardingComponent},
  {path:'timer',component:TimerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileAppRoutingModule { }
