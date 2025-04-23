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
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guard/admin.guard';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '',
    children: [
      { path: '', component: HomepageComponent }, // loads when /home
      { path: 'error', component: ErrorPageComponent },
      // { path: 'products/bumper-discount', component: ProductExplorerComponent },
      // { path: 'products/all', component: ProductExplorerComponent },
      { path: 'category/:category', component: ProductExplorerComponent },
      { path: 'category/:category/:searchQuery', component: ProductExplorerComponent },
      { path: 'book-online-consultation', component: OnlineConsultationComponent },
      { path: 'buying-guide', component: BuyingGuideComponent },
      { path: 'know-more-about-us', component: KnowMoreAboutUsComponent },
      { path: 'feedback', component: FeedbackFormComponent },
      { path: 'payment-success', component: PaymentProcessComponent },
      { path: 'account', component: AccountPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'user-orders', component: MyOrdersComponent },
      { path: 'order-details/:orderId', component: OrderDetailsComponent },
      {
        path: 'track-order/:orderId',
        component: TrackOrderComponent
      },
      { path: 'admin', component: AdminDashboardComponent }
      // { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] }


    ]
  },
  // { path: '**', redirectTo: 'home/error' } // fallback for invalid routes
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
