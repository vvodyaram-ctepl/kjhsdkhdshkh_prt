import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../login/components/main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'operations', loadChildren: () => import('../management/management.module').then(m => m.ManagementModule)
      },
      {
        path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'clinics', loadChildren: () => import('../clinics/clinics.module').then(m => m.ClinicsModule)
      },
      {
        path: 'clinical-notification', loadChildren: () => import('../clinical-notification/clinical-notification.module').then(m => m.ClinicalNotificationModule)
      },
      {
        path: 'push-notification', loadChildren: () => import('../push-notification/push-notification.module').then(m => m.PushNotificationModule)
      },
      {
        path: 'clinical-user', loadChildren: () => import('../clinical-users/clinical-users.module').then(m => m.ClinicalUsersModule)
      },
      {
        path: 'assets', loadChildren: () => import('../assets/assets.module').then(m => m.AssetsModule)
      },
      {
        path: 'patients', loadChildren: () => import('../patient/patient.module').then(m => m.PatientModule)
      },
      {
        path: 'observations', loadChildren: () => import('../observation-media/observation-media.module').then(m => m.ObservationMediaModule)
      },
      {
        path: 'petparent', loadChildren: () => import('../pet-parent/pet-parent.module').then(m => m.PetParentModule)
      },
      {
        path: 'plans', loadChildren: () => import('../plans/plans.module').then(m => m.PlansModule)
      },
      {
        path: 'imagescore', loadChildren: () => import('../image-scoring/image-scoring.module').then(m => m.ImageScoringModule)
      },
      {
        path: 'mobile-app', loadChildren: () => import('../mobile-app/mobile-app.module').then(m => m.MobileAppModule)
      },
      {
        path: 'roles', loadChildren: () => import('../roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'support', loadChildren: () => import('../support/support.module').then(m => m.SupportModule)
      },
      {
        path: 'support-material', loadChildren: () => import('../support-material/support-material.module').then(m => m.SupportMaterialModule)
      },
      {
        path: 'audit', loadChildren: () => import('../audit-log/audit-log.module').then(m => m.AuditLogModule)
      },
      {
        path: 'point-tracking', loadChildren: () => import('../point-tracking/point-tracking.module').then(m => m.PointTrackingModule)
      },
      {
        path: 'shipment', loadChildren: () => import('../shipment/shipment.module').then(m => m.ShipmentModule)
      },
      {
        path: 'changePassword', loadChildren: () => import('../change-password/change-password.module').then(m => m.ChangePasswordModule)
      },
      {
        path: 'questionnaire', loadChildren: () => import('../questionnaire/questionnaire.module').then(m => m.QuestionnaireModule)
      },
      {
        path: 'responses', loadChildren: () => import('../questionnaire-response/questionnaire-response.module').then(m => m.QuestionnaireResponseModule)
      },
      {
        path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'media', loadChildren: () => import('../media-download/media-download.module').then(m => m.MediaDownloadModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
