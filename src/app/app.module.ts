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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
