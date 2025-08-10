// utils/breadcrumbs.js

export const createBreadcrumbs = (path) => {
  const commonBreadcrumbs = {
    home: { text: 'Home', href: '/' },
    mechanics: { text: 'Classical Mechanics', href: '/mechanics/foundations' },
    measurement: { text: '📏 Measurement', href: '/mechanics/measurements' },
  };

  const breadcrumbConfigs = {
    'mechanics/measurements/conceptual': [
      commonBreadcrumbs.home,
      commonBreadcrumbs.mechanics,
      commonBreadcrumbs.measurement,
      { text: '🤔 Conceptual Questions', current: true }
    ],
    'mechanics/measurements/numerical': [
      commonBreadcrumbs.home,
      commonBreadcrumbs.mechanics,
      commonBreadcrumbs.measurement,
      { text: '🔢 Numerical Problems', current: true }
    ],
    'mechanics/measurements/mcq': [
      commonBreadcrumbs.home,
      commonBreadcrumbs.mechanics,
      commonBreadcrumbs.measurement,
      { text: '✅ Multiple Choice Questions', current: true }
    ],
  };

  return breadcrumbConfigs[path] || [];
};
