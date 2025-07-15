/**
 * Storage Manager - Handles all local storage operations
 * Manages game state, history, and settings persistence
 */
class StorageManager {
  constructor() {
    this.keys = {
      CURRENT_GAME: "scoreboard_current_game",
      GAME_HISTORY: "scoreboard_game_history",
      SETTINGS: "scoreboard_settings",
    };

    // Initialize storage if not exists
    this.initializeStorage();
  }

  /**
   * Initialize storage with default values if not exists
   */
  initializeStorage() {
    if (!this.getGameHistory()) {
      this.saveGameHistory([]);
    }

    if (!this.getSettings()) {
      this.saveSettings({
        defaultGameTypes: {
          Badminton: { defaultScore: 21, minWinBy: 2 },
          "Ping Pong": { defaultScore: 11, minWinBy: 2 },
          Volleyball: { defaultScore: 25, minWinBy: 2 },
        },
      });
    }
  }

  /**
   * Save current game state
   * @param {Object} gameState - Current game state object
   */
  saveCurrentGame(gameState) {
    try {
      const gameData = {
        ...gameState,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.keys.CURRENT_GAME, JSON.stringify(gameData));
      return true;
    } catch (error) {
      console.error("Error saving current game:", error);
      return false;
    }
  }

  /**
   * Load current game state
   * @returns {Object|null} Current game state or null if not found
   */
  getCurrentGame() {
    try {
      const gameData = localStorage.getItem(this.keys.CURRENT_GAME);
      return gameData ? JSON.parse(gameData) : null;
    } catch (error) {
      console.error("Error loading current game:", error);
      return null;
    }
  }

  /**
   * Clear current game state
   */
  clearCurrentGame() {
    try {
      localStorage.removeItem(this.keys.CURRENT_GAME);
      return true;
    } catch (error) {
      console.error("Error clearing current game:", error);
      return false;
    }
  }

  /**
   * Save game to history
   * @param {Object} gameResult - Completed game result
   */
  saveGameToHistory(gameResult) {
    try {
      const history = this.getGameHistory() || [];
      const gameWithId = {
        id: this.generateId(),
        ...gameResult,
        completedAt: new Date().toISOString(),
      };

      history.unshift(gameWithId); // Add to beginning of array

      // Keep only last 50 games to prevent storage bloat
      if (history.length > 50) {
        history.splice(50);
      }

      this.saveGameHistory(history);
      return gameWithId;
    } catch (error) {
      console.error("Error saving game to history:", error);
      return null;
    }
  }

  /**
   * Get game history
   * @returns {Array} Array of completed games
   */
  getGameHistory() {
    try {
      const history = localStorage.getItem(this.keys.GAME_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error loading game history:", error);
      return [];
    }
  }

  /**
   * Save game history
   * @param {Array} history - Array of game history
   */
  saveGameHistory(history) {
    try {
      localStorage.setItem(this.keys.GAME_HISTORY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error("Error saving game history:", error);
      return false;
    }
  }

  /**
   * Clear all game history
   */
  clearGameHistory() {
    try {
      this.saveGameHistory([]);
      return true;
    } catch (error) {
      console.error("Error clearing game history:", error);
      return false;
    }
  }

  /**
   * Get settings
   * @returns {Object} Settings object
   */
  getSettings() {
    try {
      const settings = localStorage.getItem(this.keys.SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  }

  /**
   * Save settings
   * @param {Object} settings - Settings object
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(this.keys.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns {Object} Storage usage stats
   */
  getStorageInfo() {
    try {
      const currentGame = localStorage.getItem(this.keys.CURRENT_GAME);
      const gameHistory = localStorage.getItem(this.keys.GAME_HISTORY);
      const settings = localStorage.getItem(this.keys.SETTINGS);

      return {
        currentGameSize: currentGame ? currentGame.length : 0,
        historySize: gameHistory ? gameHistory.length : 0,
        settingsSize: settings ? settings.length : 0,
        totalSize:
          (currentGame?.length || 0) +
          (gameHistory?.length || 0) +
          (settings?.length || 0),
        historyCount: this.getGameHistory().length,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return null;
    }
  }

  /**
   * Export all data for backup
   * @returns {Object} All stored data
   */
  exportData() {
    try {
      return {
        currentGame: this.getCurrentGame(),
        gameHistory: this.getGameHistory(),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error exporting data:", error);
      return null;
    }
  }

  /**
   * Import data from backup
   * @param {Object} data - Data to import
   * @returns {boolean} Success status
   */
  importData(data) {
    try {
      if (data.currentGame) {
        this.saveCurrentGame(data.currentGame);
      }
      if (data.gameHistory) {
        this.saveGameHistory(data.gameHistory);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.keys.CURRENT_GAME);
      localStorage.removeItem(this.keys.GAME_HISTORY);
      localStorage.removeItem(this.keys.SETTINGS);
      this.initializeStorage();
      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  }

  /**
   * Generate unique ID for games
   * @returns {string} Unique identifier
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if local storage is available
   * @returns {boolean} Storage availability
   */
  isStorageAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.error("Local storage not available:", error);
      return false;
    }
  }

  /**
   * Get formatted storage size
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size string
   */
  /**
   * Save generic data with a key
   * @param {string} key - Storage key
   * @param {*} data - Data to store
   * @returns {boolean} Success status
   */
  saveData(key, data) {
    try {
      const storageKey = `scoreboard_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get generic data by key
   * @param {string} key - Storage key
   * @returns {*} Stored data or null
   */
  getData(key) {
    try {
      const storageKey = `scoreboard_${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return null;
    }
  }

  formatStorageSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Create global instance
window.storageManager = new StorageManager();
