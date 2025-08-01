import React, { useState, useEffect } from 'react';
import { Clock, Search, X, TrendingUp, Trash2 } from 'lucide-react';
import searchHistoryService from '../services/searchHistory';

const SearchHistory = ({ onSearchSelect, isVisible, onClose }) => {
  const [history, setHistory] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);

  useEffect(() => {
    if (isVisible) {
      loadSearchHistory();
    }
  }, [isVisible]);

  const loadSearchHistory = () => {
    const formattedHistory = searchHistoryService.getFormattedHistory();
    const recent = searchHistoryService.getRecentSearches(5);
    const popular = searchHistoryService.getPopularSearches(5);

    setHistory(formattedHistory);
    setRecentSearches(recent);
    setPopularSearches(popular);
  };

  const handleSearchSelect = (searchTerm) => {
    onSearchSelect(searchTerm);
    onClose();
  };

  const handleRemoveSearch = (searchTerm, event) => {
    event.stopPropagation();
    searchHistoryService.removeFromHistory(searchTerm);
    loadSearchHistory();
  };

  const handleClearHistory = () => {
    searchHistoryService.clearHistory();
    loadSearchHistory();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Clear all history"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No search history yet</p>
            <p className="text-sm text-gray-400">Your searches will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock size={16} className="text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-700">Recent</h4>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item, index) => (
                    <div
                      key={`recent-${index}`}
                      onClick={() => handleSearchSelect(item.term)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <Search size={14} className="text-gray-400" />
                        <span className="text-gray-700">{item.term}</span>
                        {item.isRecent && (
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                            Recent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">{item.timeAgo}</span>
                        <button
                          onClick={(e) => handleRemoveSearch(item.term, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && popularSearches.some(item => item.count > 1) && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp size={16} className="text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-700">Popular</h4>
                </div>
                <div className="space-y-1">
                  {popularSearches
                    .filter(item => item.count > 1)
                    .map((item, index) => (
                      <div
                        key={`popular-${index}`}
                        onClick={() => handleSearchSelect(item.term)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <TrendingUp size={14} className="text-green-500" />
                          <span className="text-gray-700">{item.term}</span>
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {item.count}x
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveSearch(item.term, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* All History */}
            {history.length > 5 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">All Searches</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {history.slice(5).map((item, index) => (
                    <div
                      key={`all-${index}`}
                      onClick={() => handleSearchSelect(item.term)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <Search size={14} className="text-gray-400" />
                        <span className="text-gray-700">{item.term}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">{item.timeAgo}</span>
                        <button
                          onClick={(e) => handleRemoveSearch(item.term, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
