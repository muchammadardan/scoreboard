/**
 * Main Application - Entry point and application initialization
 * Coordinates all managers and handles application lifecycle
 */
class ScoreboardApp {
  constructor() {
    this.version = "1.0.0";
    this.isInitialized = false;
    this.managers = {};

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log(`🏆 Scoreboard App v${this.version} - Initializing...`);

      // Check browser compatibility
      if (!this.checkBrowserCompatibility()) {
        this.showCompatibilityError();
        return;
      }

      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          this.initializeApp()
        );
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error("Failed to initialize application:", error);
      this.showInitializationError(error);
    }
  }

  /**
   * Initialize application components
   */
  initializeApp() {
    try {
      // Verify all managers are available
      this.verifyManagers();

      // Store manager references
      this.managers = {
        storage: window.storageManager,
        game: window.gameManager,
        player: window.playerManager,
        ui: window.uiController,
        analytics: window.analyticsManager,
      };

      // Set up global error handling
      this.setupErrorHandling();

      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();

      // Set up auto-save
      this.setupAutoSave();

      // Initialize analytics and update visitor counter
      this.initializeAnalytics();

      // Mark as initialized
      this.isInitialized = true;

      console.log("✅ Scoreboard App initialized successfully");

      // Show welcome message if first time user
      this.checkFirstTimeUser();
    } catch (error) {
      console.error("Failed to initialize app components:", error);
      this.showInitializationError(error);
    }
  }

  /**
   * Check browser compatibility
   */
  checkBrowserCompatibility() {
    const requiredFeatures = [
      "localStorage" in window,
      "JSON" in window,
      "addEventListener" in document,
      "querySelector" in document,
      "classList" in document.createElement("div"),
    ];

    return requiredFeatures.every((feature) => feature);
  }

  /**
   * Verify all managers are loaded
   */
  verifyManagers() {
    const requiredManagers = [
      "storageManager",
      "gameManager",
      "playerManager",
      "uiController",
      "analyticsManager",
    ];

    const missingManagers = requiredManagers.filter(
      (manager) => !window[manager]
    );

    if (missingManagers.length > 0) {
      throw new Error(`Missing managers: ${missingManagers.join(", ")}`);
    }
  }

  /**
   * Set up global error handling
   */
  setupErrorHandling() {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      this.handleError(event.error, "Global Error");
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.handleError(event.reason, "Promise Rejection");
    });
  }

  /**
   * Set up keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      // Only handle shortcuts when not typing in input fields
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const currentView = this.managers.ui.getCurrentView();

      switch (event.key) {
        case "n":
        case "N":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (currentView === "game") {
              this.managers.ui.onNewGame();
            }
          }
          break;

        case "r":
        case "R":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (currentView === "game") {
              this.managers.ui.onResetScores();
            }
          }
          break;

        case "h":
        case "H":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.managers.ui.onToggleHistory();
          }
          break;

        case "Escape":
          // Close modal if open
          const modal = document.getElementById("winnerModal");
          if (modal && modal.style.display !== "none") {
            this.managers.ui.hideWinnerModal();
          }
          break;
      }
    });
  }

  /**
   * Set up auto-save functionality
   */
  setupAutoSave() {
    // Auto-save every 30 seconds if game is active
    setInterval(() => {
      if (this.isInitialized) {
        const gameState = this.managers.game.getCurrentGameState();
        if (gameState.isGameActive) {
          this.managers.game.saveGameState();
        }
      }
    }, 30000);

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      if (this.isInitialized) {
        const gameState = this.managers.game.getCurrentGameState();
        if (gameState.isGameActive) {
          this.managers.game.saveGameState();
        }
      }
    });
  }

  /**
   * Initialize analytics and update visitor counter display
   */
  initializeAnalytics() {
    try {
      // Initialize analytics manager
      this.managers.analytics.init();

      // Update visitor counter display
      this.updateVisitorCounter();

      // Set up periodic updates for visitor counter
      setInterval(() => {
        this.updateVisitorCounter();
      }, 60000); // Update every minute

      console.log("✅ Analytics initialized successfully");
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
      // Analytics is not critical, so don't fail the entire app
    }
  }

  /**
   * Update visitor counter display
   */
  updateVisitorCounter() {
    try {
      const stats = this.managers.analytics.getVisitorStats();

      // Update total visits
      const totalElement = document.getElementById("totalVisits");
      if (totalElement) {
        totalElement.textContent = stats.totalVisits.toLocaleString();
      }

      // Update today's visits
      const todayElement = document.getElementById("todayVisits");
      if (todayElement) {
        todayElement.textContent = stats.todayVisits.toLocaleString();
      }

      // Update online status with realistic count
      const onlineStatusElement = document.getElementById("onlineStatus");
      if (onlineStatusElement) {
        const statusText = onlineStatusElement.querySelector(".status-text");
        if (statusText) {
          statusText.textContent = `${stats.onlineUsers} Online`;
        }
      }
    } catch (error) {
      console.error("Failed to update visitor counter:", error);
    }
  }

  /**
   * Check if this is a first-time user
   */
  checkFirstTimeUser() {
    const history = this.managers.storage.getGameHistory();
    const settings = this.managers.storage.getSettings();

    if (history.length === 0 && !settings.hasSeenWelcome) {
      this.showWelcomeMessage();

      // Mark as seen
      settings.hasSeenWelcome = true;
      this.managers.storage.saveSettings(settings);
    }
  }

  /**
   * Show welcome message for first-time users
   */
  showWelcomeMessage() {
    setTimeout(() => {
      this.managers.ui.showMessage(
        "Welcome to Scoreboard App! Add players and start your first game.",
        "info"
      );
    }, 1000);
  }

  /**
   * Handle application errors
   */
  handleError(error, context = "Application") {
    console.error(`${context} Error:`, error);

    // Show user-friendly error message
    const errorMessage = this.getUserFriendlyErrorMessage(error);
    this.managers.ui?.showMessage(errorMessage, "error");

    // Log error details for debugging
    this.logError(error, context);
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyErrorMessage(error) {
    if (error.message?.includes("localStorage")) {
      return "Storage error: Please check if your browser allows local storage.";
    }

    if (error.message?.includes("Invalid")) {
      return "Invalid input: Please check your entries and try again.";
    }

    return "Something went wrong. Please refresh the page and try again.";
  }

  /**
   * Log error for debugging
   */
  logError(error, context) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context: context,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.log("Error Log:", errorLog);

    // In a production app, you might send this to an error tracking service
  }

  /**
   * Show compatibility error
   */
  showCompatibilityError() {
    document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: Arial, sans-serif;
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 15px;
                    max-width: 500px;
                ">
                    <h1>⚠️ Browser Not Supported</h1>
                    <p>This application requires a modern browser with support for:</p>
                    <ul style="text-align: left; margin: 20px 0;">
                        <li>Local Storage</li>
                        <li>Modern JavaScript (ES6+)</li>
                        <li>CSS3</li>
                    </ul>
                    <p>Please update your browser or try a different one.</p>
                    <p><strong>Recommended browsers:</strong><br>
                    Chrome 60+, Firefox 55+, Safari 12+, Edge 79+</p>
                </div>
            </div>
        `;
  }

  /**
   * Show initialization error
   */
  showInitializationError(error) {
    const errorContainer = document.createElement("div");
    errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;

    errorContainer.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #e53e3e; margin-bottom: 20px;">⚠️ Initialization Error</h2>
                <p style="color: #4a5568; margin-bottom: 20px;">
                    The application failed to initialize properly.
                </p>
                <details style="text-align: left; margin: 20px 0;">
                    <summary style="cursor: pointer; color: #667eea;">Technical Details</summary>
                    <pre style="
                        background: #f7fafc;
                        padding: 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        overflow: auto;
                        margin-top: 10px;
                    ">${error.message}</pre>
                </details>
                <button onclick="window.location.reload()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                ">Reload Page</button>
            </div>
        `;

    document.body.appendChild(errorContainer);
  }

  /**
   * Get application info
   */
  getAppInfo() {
    return {
      version: this.version,
      isInitialized: this.isInitialized,
      storageInfo: this.managers.storage?.getStorageInfo(),
      gameState: this.managers.game?.getCurrentGameState(),
      playerCount: this.managers.player?.getPlayerCount(),
    };
  }

  /**
   * Export application data
   */
  exportData() {
    if (!this.isInitialized) {
      throw new Error("Application not initialized");
    }

    return {
      appVersion: this.version,
      exportedAt: new Date().toISOString(),
      ...this.managers.storage.exportData(),
    };
  }

  /**
   * Import application data
   */
  importData(data) {
    if (!this.isInitialized) {
      throw new Error("Application not initialized");
    }

    const success = this.managers.storage.importData(data);
    if (success) {
      this.managers.ui.refreshUI();
      this.managers.ui.showMessage("Data imported successfully", "success");
    } else {
      this.managers.ui.showMessage("Failed to import data", "error");
    }

    return success;
  }

  /**
   * Reset application to initial state
   */
  resetApp() {
    if (!this.isInitialized) {
      return false;
    }

    if (
      confirm(
        "Are you sure you want to reset the entire application? This will clear all data and cannot be undone."
      )
    ) {
      this.managers.storage.clearAllData();
      this.managers.game.newGame();
      this.managers.player.clearAllPlayers();
      this.managers.ui.switchToSetupView();
      this.managers.ui.showMessage("Application reset successfully", "success");
      return true;
    }

    return false;
  }
}

// Initialize the application
window.scoreboardApp = new ScoreboardApp();

// Expose useful functions to global scope for debugging
window.debugApp = {
  getAppInfo: () => window.scoreboardApp.getAppInfo(),
  exportData: () => window.scoreboardApp.exportData(),
  importData: (data) => window.scoreboardApp.importData(data),
  resetApp: () => window.scoreboardApp.resetApp(),
};

console.log(
  "🏆 Scoreboard App loaded. Use window.debugApp for debugging functions."
);
