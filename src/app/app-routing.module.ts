import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductExplorerComponent } from './components/product-explorer/product-explorer.component';

const routes: Routes = [
  { path: '', component: LayoutComponent },
  { path: 'home', component: LayoutComponent },
  { path: 'buyProduct', component: ProductDetailsComponent },
  {
    path: 'category/:category',
    component: ProductExplorerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
