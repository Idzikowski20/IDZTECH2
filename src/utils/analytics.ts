
// Google Analytics measurement ID
const GA_MEASUREMENT_ID = 'G-6Z3B7DMZQV'; // Google Analytics ID from the screenshot

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    try {
      // Remove any existing GA scripts to prevent duplicates
      const existingScripts = document.querySelectorAll(`script[src*="googletagmanager.com/gtag"]`);
      existingScripts.forEach(script => script.remove());

      // Add Google Analytics script to the page
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false // We'll track page views manually
      });

      // Add to window object
      window.gtag = gtag;
      
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title
      });
      console.log('Page view tracked:', url);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
};

// Track events
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      console.log('Event tracked:', { action, category, label, value });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
};

// Get real-time analytics data
// In a real implementation, this would fetch data from the Google Analytics API
// For now, we'll simulate this with placeholder data
export const getAnalyticsData = async () => {
  try {
    // This would be an actual API call in production
    // For now, we'll return realistic simulated data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    
    // Generate data for the last 5 months
    const monthlyData = [];
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
      monthlyData.push({
        name: monthNames[monthIndex],
        visits: Math.floor(Math.random() * 150) + 50 // Random value between 50-200
      });
    }
    
    return {
      totalVisits: 0, // This will be calculated from blog post views
      uniqueVisitors: 0, // This will be calculated from blog post views
      blogViews: 0, // This will be calculated from blog post views
      averageSessionTime: '0:00', // This will be calculated from blog post views
      monthlyStats: monthlyData
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      blogViews: 0,
      averageSessionTime: '0:00',
      monthlyStats: []
    };
  }
};
