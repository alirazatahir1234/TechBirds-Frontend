// Search History Management Service
class SearchHistoryService {
  constructor() {
    this.storageKey = 'techbirds_search_history';
    this.maxHistoryItems = 10; // Maximum number of search terms to store
  }

  // Get search history from localStorage
  getHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Add a search term to history
  addToHistory(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return; // Don't save very short searches
    }

    const normalizedTerm = searchTerm.trim().toLowerCase();
    let history = this.getHistory();

    // Remove if already exists (to move to top)
    history = history.filter(item => item.term.toLowerCase() !== normalizedTerm);

    // Add to beginning of array
    history.unshift({
      term: searchTerm.trim(),
      timestamp: new Date().toISOString(),
      count: 1
    });

    // Limit history size
    if (history.length > this.maxHistoryItems) {
      history = history.slice(0, this.maxHistoryItems);
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  // Update search term count (if searching same term again)
  updateSearchCount(searchTerm) {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    let history = this.getHistory();

    const existingIndex = history.findIndex(item => 
      item.term.toLowerCase() === normalizedTerm
    );

    if (existingIndex !== -1) {
      // Update count and move to top
      const existingItem = history[existingIndex];
      existingItem.count += 1;
      existingItem.timestamp = new Date().toISOString();
      
      // Remove from current position and add to top
      history.splice(existingIndex, 1);
      history.unshift(existingItem);

      try {
        localStorage.setItem(this.storageKey, JSON.stringify(history));
      } catch (error) {
        console.error('Error updating search history:', error);
      }
    } else {
      // Add as new search
      this.addToHistory(searchTerm);
    }
  }

  // Remove a specific search term
  removeFromHistory(searchTerm) {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    let history = this.getHistory();
    
    history = history.filter(item => 
      item.term.toLowerCase() !== normalizedTerm
    );

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  }

  // Clear all search history
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  // Get recent searches (last 5)
  getRecentSearches(limit = 5) {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  // Get popular searches (most searched terms)
  getPopularSearches(limit = 5) {
    const history = this.getHistory();
    return history
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get formatted history for display
  getFormattedHistory() {
    const history = this.getHistory();
    return history.map(item => ({
      ...item,
      timeAgo: this.formatTimeAgo(item.timestamp),
      isRecent: this.isRecent(item.timestamp)
    }));
  }

  // Format timestamp to "time ago" string
  formatTimeAgo(timestamp) {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return searchTime.toLocaleDateString();
  }

  // Check if search was made recently (within last hour)
  isRecent(timestamp) {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));
    return diffInMinutes < 60;
  }
}

// Create singleton instance
const searchHistoryService = new SearchHistoryService();

export default searchHistoryService;
