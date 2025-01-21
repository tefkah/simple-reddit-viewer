import { type RouteConfig, index } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  {
    path: '/r/*',
    file: 'routes/redditPage.tsx',
  },
] satisfies RouteConfig;
