import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductExplorerComponent } from './components/product-explorer/product-explorer.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { PaymentProcessComponent } from './components/payment-process/payment-process.component';
import { OnlineConsultationComponent } from './components/online-consultation/online-consultation.component';
import { BuyingGuideComponent } from './components/buying-guide/buying-guide.component';
import { KnowMoreAboutUsComponent } from './components/know-more-about-us/know-more-about-us.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'home', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomepageComponent },
      { path: 'error', component: ErrorPageComponent },
      // {
      //   path: 'products/bumper-discount',
      //   component: ProductExplorerComponent
      // },
      // {
      //   path: 'products/all',
      //   component: ProductExplorerComponent
      // },
      { path: 'category/:category', component: ProductExplorerComponent },
      { path: 'category/:category/:searchQuery', component: ProductExplorerComponent },
      { path: 'book-online-consultation', component: OnlineConsultationComponent },
      { path: 'buying-guide', component: BuyingGuideComponent },
      { path: 'know-more-about-us', component: KnowMoreAboutUsComponent },
      { path: 'feedback', component: FeedbackFormComponent },
      { path: 'payment', component: PaymentProcessComponent },
      { path: 'account', component: AccountPageComponent },
      { path: 'cart', component: CartPageComponent },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
