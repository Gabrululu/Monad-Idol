import { track } from '@vercel/analytics';

// Analytics event tracking utilities

export const trackEvent = (eventName, properties = {}) => {
  try {
    track(eventName, properties);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Wallet events
export const trackWalletConnect = (address) => {
  trackEvent('wallet_connected', {
    address: address.substring(0, 10) + '...', // Privacy-friendly
  });
};

export const trackWalletDisconnect = () => {
  trackEvent('wallet_disconnected');
};

// Project events
export const trackProjectSubmit = (projectName) => {
  trackEvent('project_submitted', {
    project_name: projectName,
  });
};

export const trackProjectView = (projectId) => {
  trackEvent('project_viewed', {
    project_id: projectId,
  });
};

// Staking events
export const trackStake = (projectId, amount) => {
  trackEvent('stake_placed', {
    project_id: projectId,
    amount: parseFloat(amount).toFixed(2),
  });
};

// Search and filter events
export const trackSearch = (searchTerm) => {
  if (searchTerm.length >= 3) {
    trackEvent('search_performed', {
      term_length: searchTerm.length,
    });
  }
};

export const trackFilterChange = (filterType, filterValue) => {
  trackEvent('filter_changed', {
    filter_type: filterType,
    filter_value: filterValue,
  });
};

export const trackSortChange = (sortBy) => {
  trackEvent('sort_changed', {
    sort_by: sortBy,
  });
};

// Page events
export const trackPageView = (pageName) => {
  trackEvent('page_viewed', {
    page: pageName,
  });
};

export default {
  trackWalletConnect,
  trackWalletDisconnect,
  trackProjectSubmit,
  trackProjectView,
  trackStake,
  trackSearch,
  trackFilterChange,
  trackSortChange,
  trackPageView,
};
