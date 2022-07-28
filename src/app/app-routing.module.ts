import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToOnBoarding = () => redirectUnauthorizedTo(["/onboarding"]);

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'pass-recovery',
    loadChildren: () => import('./pass-recovery/pass-recovery.module').then(m => m.PassRecoveryPageModule)
  },
  {
    path: 'areas-options-selected',
    loadChildren: () => import('./new-user/areas-options-selected/areas-options-selected.module').then(m => m.AreasOptionsSelectedPageModule)
  },
  {
    path: 'help-areas',
    loadChildren: () => import('./new-user/help-areas/help-areas.module').then(m => m.HelpAreasPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'lets-match',
    loadChildren: () => import('./new-user/lets-match/lets-match.module').then(m => m.LetsMatchPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'modal-area-subitems',
    loadChildren: () => import('./new-user/modal-area-subitems/modal-area-subitems.module').then(m => m.ModalAreaSubitemsPageModule)
  },
  {
    path: 'need-help',
    loadChildren: () => import('./new-user/need-help/need-help.module').then(m => m.NeedHelpPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'selected-areas/:area/:area1',
    loadChildren: () => import('./new-user/selected-areas/selected-areas.module').then(m => m.SelectedAreasPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'emotion-tracker-history/:id/:id1',
    loadChildren: () => import('./emotion-tracker-history/emotion-tracker-history.module').then(m => m.EmotionTrackerHistoryPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'exercise-completed',
    loadChildren: () => import('./exercises/exercise-completed/exercise-completed.module').then(m => m.ExerciseCompletedPageModule)
  },
  {
    path: 'exercise-one/:id',
    loadChildren: () => import('./exercises/exercise-one/exercise-one.module').then(m => m.ExerciseOnePageModule)
  },
  {
    path: 'exercise-slider/:id',
    loadChildren: () => import('./exercises/exercise-slider/exercise-slider.module').then(m => m.ExerciseSliderPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'exercise-summary',
    loadChildren: () => import('./exercises/exercise-summary/exercise-summary.module').then(m => m.ExerciseSummaryPageModule)
  },
  {
    path: 'ejercicios/principales/:id',
    loadChildren: () => import('./exercises/exercise-list/exercise-list.module').then(m => m.ExerciseListPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'notas/:id',
    loadChildren: () => import('./library/library-list/library-list.module').then(m => m.LibraryListPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'post/:id/:color/:type',
    loadChildren: () => import('./library/post/post.module').then(m => m.PostPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'exercise-detail/:id',
    loadChildren: () => import('./my-progress/exercise-detail/exercise-detail.module').then(m => m.ExerciseDetailPageModule)
  },
  {
    path: 'exercises-summary',
    loadChildren: () => import('./my-progress/exercises-summary/exercises-summary.module').then(m => m.ExercisesSummaryPageModule)
  },
  {
    path: 'long-term-goals',
    loadChildren: () => import('./my-progress/long-term-goals/long-term-goals.module').then(m => m.LongTermGoalsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'progress-list',
    loadChildren: () => import('./my-progress/progress-list/progress-list.module').then(m => m.ProgressListPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'response-detail',
    loadChildren: () => import('./my-progress/response-detail/response-detail.module').then(m => m.ResponseDetailPageModule)
  },
  {
    path: 'responses-history',
    loadChildren: () => import('./my-progress/responses-history/responses-history.module').then(m => m.ResponsesHistoryPageModule)
  },
  {
    path: 'short-term-goals',
    loadChildren: () => import('./my-progress/short-term-goals/short-term-goals.module').then(m => m.ShortTermGoalsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'accept-terms/:id/:id1/:regalo',
    loadChildren: () => import('./new-user/accept-terms/accept-terms.module').then(m => m.AcceptTermsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'add-payment/:id/:id1/:regalo',
    loadChildren: () => import('./new-user/add-payment/add-payment.module').then(m => m.AddPaymentPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'match-result',
    loadChildren: () => import('./new-user/match-result/match-result.module').then(m => m.MatchResultPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'payment-notification/:res/:id/:paquete',
    loadChildren: () => import('./new-user/payment-notification/payment-notification.module').then(m => m.PaymentNotificationPageModule)
  },
  {
    path: 'select-subscription/:id',
    loadChildren: () => import('./new-user/select-subscription/select-subscription.module').then(m => m.SelectSubscriptionPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'subscription-summary/:id/:id1',
    loadChildren: () => import('./new-user/subscription-summary/subscription-summary.module').then(m => m.SubscriptionSummaryPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'upload-dpi',
    loadChildren: () => import('./new-user/upload-dpi/upload-dpi.module').then(m => m.UploadDpiPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'goals/:m/:y',
    loadChildren: () => import('./my-progress/goals/goals.module').then(m => m.GoalsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'chat/:id/:color',
    loadChildren: () => import('./new-user/chat/chat.module').then(m => m.ChatPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'wellbeing-level',
    loadChildren: () => import('./my-progress/wellbeing-level/wellbeing-level.module').then(m => m.WellbeingLevelPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  },
  {
    path: 'questionnaire/:id',
    loadChildren: () => import('./my-progress/questionnaire/questionnaire.module').then(m => m.QuestionnairePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToOnBoarding }
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }