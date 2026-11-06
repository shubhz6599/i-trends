import { Routes } from '@angular/router';
import { AdminGuard } from './guard/admin.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/homepage/homepage.component').then(m => m.HomepageComponent)
      },
      {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent)
      },
      {
        path: 'error',
        loadComponent: () => import('./components/error-page/error-page.component').then(m => m.ErrorPageComponent)
      },
      {
        path: 'contact-lenses',
        loadComponent: () => import('./components/lens-details/lens-details.component').then(m => m.LensDetailsComponent)
      },
      {
        path: 'category/:category',
        loadComponent: () => import('./components/product-explorer/product-explorer.component').then(m => m.ProductExplorerComponent)
      },
      {
        path: 'category/:category/:searchQuery',
        loadComponent: () => import('./components/product-explorer/product-explorer.component').then(m => m.ProductExplorerComponent)
      },
      {
        path: 'book-online-consultation',
        loadComponent: () => import('./components/online-consultation/online-consultation.component').then(m => m.OnlineConsultationComponent)
      },
      {
        path: 'buying-guide',
        loadComponent: () => import('./components/buying-guide/buying-guide.component').then(m => m.BuyingGuideComponent)
      },
      {
        path: 'know-more-about-us',
        loadComponent: () => import('./components/know-more-about-us/know-more-about-us.component').then(m => m.KnowMoreAboutUsComponent)
      },
      {
        path: 'feedback',
        loadComponent: () => import('./components/feedback-form/feedback-form.component').then(m => m.FeedbackFormComponent)
      },
      {
        path: 'payment-success',
        loadComponent: () => import('./components/payment-process/payment-process.component').then(m => m.PaymentProcessComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./components/account-page/account-page.component').then(m => m.AccountPageComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart-page/cart-page.component').then(m => m.CartPageComponent)
      },
      {
        path: 'user-orders',
        loadComponent: () => import('./components/my-orders/my-orders.component').then(m => m.MyOrdersComponent)
      },
      {
        path: 'order-details/:orderId',
        loadComponent: () => import('./components/order-details/order-details.component').then(m => m.OrderDetailsComponent)
      },
      {
        path: 'track-order/:orderId',
        loadComponent: () => import('./components/track-order/track-order.component').then(m => m.TrackOrderComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [AdminGuard]
      },
      { path: '**', redirectTo: 'error' }
    ]
  }
];
