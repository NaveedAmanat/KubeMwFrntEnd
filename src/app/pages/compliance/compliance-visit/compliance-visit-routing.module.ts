// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { ClientComplianceComponent } from './client-compliance/client-compliance.component';
// import { ExceptionComplianceComponent } from './exception-compliance/exception-compliance.component';
// import { BranchComplianceComponent } from './branch-compliance/branch-compliance.component';
// import { AdcComplianceComponent } from './adc-compliance/adc-compliance.component';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'client'
//   }, // default route of the module
//   {
//     path: 'client',
//     component: ClientComplianceComponent,
//     data: {
//       breadcrumbs: [
//         { label: 'Client', href: '/compliance/compliance-visit/client' },
//         { label: 'Exception', href: '/compliance/compliance-visit/exception' },
//         { label: 'Branch', href: '/compliance/compliance-visit/branch' },
//         { label: 'ADC', href: '/compliance/compliance-visit/adc' }
//       ]
//     }
//   },
//   {
//     path: 'exception',
//     component: ExceptionComplianceComponent,
//     data: {
//       breadcrumbs: [
//         { label: 'Client', href: '/compliance/compliance-visit/client' },
//         { label: 'Exception', href: '/compliance/compliance-visit/exception' },
//         { label: 'Branch', href: '/compliance/compliance-visit/branch' },
//         { label: 'ADC', href: '/compliance/compliance-visit/adc' }
//       ]
//     }
//   },
//   {
//     path: 'branch',
//     component: BranchComplianceComponent,
//     data: {
//       breadcrumbs: [
//         { label: 'Client', href: '/compliance/compliance-visit/client' },
//         { label: 'Exception', href: '/compliance/compliance-visit/exception' },
//         { label: 'Branch', href: '/compliance/compliance-visit/branch' },
//         { label: 'ADC', href: '/compliance/compliance-visit/adc' }
//       ]
//     }
//   },
//   {
//     path: 'adc',
//     component: AdcComplianceComponent,
//     data: {
//       breadcrumbs: [
//         { label: 'Client', href: '/compliance/compliance-visit/client' },
//         { label: 'Exception', href: '/compliance/compliance-visit/exception' },
//         { label: 'Branch', href: '/compliance/compliance-visit/branch' },
//         { label: 'ADC', href: '/compliance/compliance-visit/adc' }
//       ]
//     }
//   }
// ];
// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class ComplianceVisitRoutingModule { }
