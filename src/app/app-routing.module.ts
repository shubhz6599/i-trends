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

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'error', component: ErrorPageComponent },
      { path: 'home', component: HomepageComponent },
      { path: 'category/:category', component: ProductExplorerComponent },
      { path: 'book-online-consultation', component: OnlineConsultationComponent },
      { path: 'buying-guide', component: BuyingGuideComponent },
      { path: 'payment', component: PaymentProcessComponent },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
