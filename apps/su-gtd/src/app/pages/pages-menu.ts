import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Profile',
    icon: 'person-outline',
    link: '/pages/profile',
  },
  {
    title: 'Features',
    group: true,
  },
  {
    title: 'Annual Report',
    icon: 'file-text-outline',
    link: '/pages/annual-report',
  },
  {
    title: 'Statistics',
    icon: 'pie-chart-outline',
    link: '/pages/statistics',
  },
  {
    title: 'Log Out',
    icon: 'log-out-outline',
  },
];
