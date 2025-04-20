import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductExplorerComponent } from './components/product-explorer/product-explorer.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { PaymentProcessComponent } from './components/payment-process/payment-process.component';
import { OnlineConsultationComponent } from './components/online-consultation/online-consultation.component';
import { BuyingGuideComponent } from './components/buying-guide/buying-guide.component';
import { KnowMoreAboutUsComponent } from './components/know-more-about-us/know-more-about-us.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { OfflinePageComponent } from './components/offline-page/offline-page.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { HttpClientModule } from '@angular/common/http';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { AuthComponent } from './components/auth/auth.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    BottomNavbarComponent,
    LayoutComponent,
    ProductExplorerComponent,
    ErrorPageComponent,
    PaymentProcessComponent,
    OnlineConsultationComponent,
    BuyingGuideComponent,
    KnowMoreAboutUsComponent,
    FeedbackFormComponent,
    OfflinePageComponent,
    AccountPageComponent,
    CartPageComponent,
    AuthComponent,
    MyOrdersComponent,
    TrackOrderComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
