/**
 * Game Manager - Handles game logic, scoring, and winner detection
 * Manages game state, rules, and game flow
 */
class GameManager {
  constructor() {
    this.gameTypes = {
      Badminton: { defaultScore: 21, minWinBy: 2 },
      "Ping Pong": { defaultScore: 11, minWinBy: 2 },
      Volleyball: { defaultScore: 25, minWinBy: 2 },
    };

    this.currentGame = {
      gameType: null,
      gameMode: "individual", // 'individual' or 'team'
      targetScore: 21,
      players: [],
      scores: [],
      isGameActive: false,
      startTime: null,
      gameId: null,
    };

    this.gameHistory = [];
    this.currentAdvancedSettings = null;

    // Delay initialization until storageManager is available
    this.initializeWhenReady();
  }

  /**
   * Initialize when storage manager is ready
   */
  initializeWhenReady() {
    if (window.storageManager) {
      this.loadGameState();
      this.initializeAdvancedFeatures();
    } else {
      // Wait for storageManager to be available
      setTimeout(() => this.initializeWhenReady(), 10);
    }
  }

  /**
   * Initialize a new game
   * @param {string} gameType - Type of game (Badminton, Ping Pong, Volleyball)
   * @param {number} targetScore - Target score to win
   * @param {Array|Object} playersData - Array of player names (individual) or teams object (team mode)
   * @param {string} gameMode - 'individual' or 'team'
   * @returns {boolean} Success status
   */
  initializeGame(gameType, targetScore, playersData, gameMode = "individual") {
    if (!gameType || !targetScore || !playersData) {
      console.error("Invalid game parameters");
      return false;
    }

    let players, scores;

    if (gameMode === "team") {
      // Team mode: playersData should be { teamA: {...}, teamB: {...} }
      if (
        !playersData.teamA ||
        !playersData.teamB ||
        playersData.teamA.players.length === 0 ||
        playersData.teamB.players.length === 0
      ) {
        console.error("Invalid team data");
        return false;
      }

      players = [playersData.teamA, playersData.teamB];
      scores = [0, 0]; // Two scores for two teams
    } else {
      // Individual mode: playersData should be array of player names
      if (!Array.isArray(playersData) || playersData.length < 2) {
        console.error("Invalid players data for individual mode");
        return false;
      }

      players = [...playersData];
      scores = new Array(playersData.length).fill(0);
    }

    this.currentGame = {
      gameType: gameType,
      gameMode: gameMode,
      targetScore: parseInt(targetScore),
      players: players,
      scores: scores,
      isGameActive: true,
      startTime: new Date().toISOString(),
      gameId: this.generateGameId(),
    };

    this.saveGameState();
    return true;
  }

  /**
   * Update player/team score
   * @param {number} playerIndex - Index of the player/team
   * @param {number} change - Score change (+1 or -1)
   * @returns {Object} Update result with winner info if game ends
   */
  updateScore(playerIndex, change) {
    if (!this.currentGame.isGameActive) {
      return { success: false, message: "Game is not active" };
    }

    if (playerIndex < 0 || playerIndex >= this.currentGame.players.length) {
      return { success: false, message: "Invalid player/team index" };
    }

    const newScore = this.currentGame.scores[playerIndex] + change;

    // Prevent negative scores
    if (newScore < 0) {
      return { success: false, message: "Score cannot be negative" };
    }

    this.currentGame.scores[playerIndex] = newScore;

    // Check for winner
    const winnerResult = this.checkForWinner();

    this.saveGameState();

    return {
      success: true,
      scores: [...this.currentGame.scores],
      winner: winnerResult.winner,
      gameComplete: winnerResult.gameComplete,
      gameStats: winnerResult.gameComplete ? this.getGameStats() : null,
    };
  }

  /**
   * Check if there's a winner
   * @returns {Object} Winner information
   */
  checkForWinner() {
    if (!this.currentGame.isGameActive) {
      return { winner: null, gameComplete: false };
    }

    const { targetScore } = this.currentGame;

    // Use advanced settings if available, otherwise use game type defaults
    const advancedSettings = this.currentAdvancedSettings;
    const gameTypeConfig = this.gameTypes[this.currentGame.gameType] || {
      minWinBy: 2,
    };

    const minWinBy = advancedSettings?.minWinBy || gameTypeConfig.minWinBy;
    const maxScore = advancedSettings?.maxScore || 100;
    const enableDeuce = advancedSettings?.enableDeuce || false;

    for (let i = 0; i < this.currentGame.scores.length; i++) {
      const currentScore = this.currentGame.scores[i];
      const otherScores = this.currentGame.scores.filter(
        (_, index) => index !== i
      );
      const maxOtherScore = Math.max(...otherScores);

      // Check for maximum score limit (sudden death)
      if (maxScore && currentScore >= maxScore) {
        this.currentGame.isGameActive = false;
        const gameResult = this.completeGame(i);

        let winnerName;
        if (this.currentGame.gameMode === "team") {
          winnerName = this.currentGame.players[i].name;
        } else {
          winnerName = this.currentGame.players[i];
        }

        return {
          winner: {
            playerIndex: i,
            playerName: winnerName,
            finalScore: currentScore,
          },
          gameComplete: true,
          gameResult: gameResult,
        };
      }

      // Standard win condition: reach target score with minimum margin
      if (
        currentScore >= targetScore &&
        currentScore - maxOtherScore >= minWinBy
      ) {
        // Handle deuce rule
        if (
          enableDeuce &&
          currentScore >= targetScore &&
          maxOtherScore >= targetScore
        ) {
          // In deuce, need to win by exactly the minimum margin
          if (currentScore - maxOtherScore === minWinBy) {
            this.currentGame.isGameActive = false;
            const gameResult = this.completeGame(i);

            let winnerName;
            if (this.currentGame.gameMode === "team") {
              winnerName = this.currentGame.players[i].name;
            } else {
              winnerName = this.currentGame.players[i];
            }

            return {
              winner: {
                playerIndex: i,
                playerName: winnerName,
                finalScore: currentScore,
              },
              gameComplete: true,
              gameResult: gameResult,
            };
          }
        } else {
          // Normal win condition
          this.currentGame.isGameActive = false;
          const gameResult = this.completeGame(i);

          let winnerName;
          if (this.currentGame.gameMode === "team") {
            winnerName = this.currentGame.players[i].name;
          } else {
            winnerName = this.currentGame.players[i];
          }

          return {
            winner: {
              playerIndex: i,
              playerName: winnerName,
              finalScore: currentScore,
            },
            gameComplete: true,
            gameResult: gameResult,
          };
        }
      }
    }

    return { winner: null, gameComplete: false };
  }

  /**
   * Complete the current game and save to history
   * @param {number} winnerIndex - Index of the winning player
   * @returns {Object} Completed game result
   */
  completeGame(winnerIndex) {
    const endTime = new Date().toISOString();
    const duration = this.calculateGameDuration(
      this.currentGame.startTime,
      endTime
    );

    // Get winner name based on game mode
    let winnerName;
    if (this.currentGame.gameMode === "team") {
      winnerName = this.currentGame.players[winnerIndex].name;
    } else {
      winnerName = this.currentGame.players[winnerIndex];
    }

    const gameResult = {
      gameType: this.currentGame.gameType,
      gameMode: this.currentGame.gameMode,
      targetScore: this.currentGame.targetScore,
      players: [...this.currentGame.players],
      finalScores: [...this.currentGame.scores],
      winner: {
        index: winnerIndex,
        name: winnerName,
        score: this.currentGame.scores[winnerIndex],
      },
      duration: duration,
      startTime: this.currentGame.startTime,
      endTime: endTime,
      totalPoints: this.currentGame.scores.reduce(
        (sum, score) => sum + score,
        0
      ),
    };

    // Save to history using storage manager
    let savedGame = gameResult;
    if (window.storageManager) {
      savedGame = window.storageManager.saveGameToHistory(gameResult);
    }

    return savedGame;
  }

  /**
   * Reset current game scores
   */
  resetScores() {
    if (this.currentGame.players.length > 0) {
      if (this.currentGame.gameMode === "team") {
        this.currentGame.scores = [0, 0]; // Two teams
      } else {
        this.currentGame.scores = new Array(
          this.currentGame.players.length
        ).fill(0);
      }
      this.currentGame.isGameActive = true;
      this.currentGame.startTime = new Date().toISOString();
      this.saveGameState();
    }
  }

  /**
   * Start a new game (clear everything)
   */
  newGame() {
    this.currentGame = {
      gameType: null,
      gameMode: "individual",
      targetScore: 21,
      players: [],
      scores: [],
      isGameActive: false,
      startTime: null,
      gameId: null,
    };

    if (window.storageManager) {
      window.storageManager.clearCurrentGame();
    }
  }

  /**
   * Get current game state
   * @returns {Object} Current game state
   */
  getCurrentGameState() {
    return { ...this.currentGame };
  }

  /**
   * Get game statistics
   * @returns {Object} Game statistics
   */
  getGameStats() {
    if (!this.currentGame.startTime) return null;

    const duration = this.calculateGameDuration(
      this.currentGame.startTime,
      new Date().toISOString()
    );
    const totalPoints = this.currentGame.scores.reduce(
      (sum, score) => sum + score,
      0
    );
    const averageScore = totalPoints / this.currentGame.players.length;

    return {
      duration: duration,
      totalPoints: totalPoints,
      averageScore: Math.round(averageScore * 100) / 100,
      leadingPlayer: this.getLeadingPlayer(),
    };
  }

  /**
   * Get the currently leading player/team
   * @returns {Object|null} Leading player/team info
   */
  getLeadingPlayer() {
    if (this.currentGame.scores.length === 0) return null;

    const maxScore = Math.max(...this.currentGame.scores);
    const leadingIndex = this.currentGame.scores.indexOf(maxScore);

    // Get name based on game mode
    let name;
    if (this.currentGame.gameMode === "team") {
      name = this.currentGame.players[leadingIndex].name;
    } else {
      name = this.currentGame.players[leadingIndex];
    }

    return {
      index: leadingIndex,
      name: name,
      score: maxScore,
    };
  }

  /**
   * Calculate game duration
   * @param {string} startTime - Start time ISO string
   * @param {string} endTime - End time ISO string
   * @returns {string} Formatted duration string
   */
  calculateGameDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Get default score for game type
   * @param {string} gameType - Game type
   * @returns {number} Default target score
   */
  getDefaultScore(gameType) {
    return this.gameTypes[gameType]?.defaultScore || 21;
  }

  /**
   * Get game type configuration
   * @param {string} gameType - Game type
   * @returns {Object} Game type configuration
   */
  getGameTypeConfig(gameType) {
    return this.gameTypes[gameType] || this.gameTypes["Badminton"];
  }

  /**
   * Validate game setup
   * @param {string} gameType - Game type
   * @param {number} targetScore - Target score
   * @param {Array|Object} playersData - Players array (individual) or teams object (team mode)
   * @param {string} gameMode - Game mode ('individual' or 'team')
   * @returns {Object} Validation result
   */
  validateGameSetup(
    gameType,
    targetScore,
    playersData,
    gameMode = "individual"
  ) {
    const errors = [];

    if (!gameType || !this.gameTypes[gameType]) {
      errors.push("Invalid game type");
    }

    if (!targetScore || targetScore < 1 || targetScore > 100) {
      errors.push("Target score must be between 1 and 100");
    }

    if (gameMode === "team") {
      // Team mode validation
      if (!playersData || !playersData.teamA || !playersData.teamB) {
        errors.push("Both teams are required");
      } else {
        if (playersData.teamA.players.length === 0) {
          errors.push("Team A must have at least 1 player");
        }
        if (playersData.teamB.players.length === 0) {
          errors.push("Team B must have at least 1 player");
        }
        if (playersData.teamA.players.length > 4) {
          errors.push("Team A can have maximum 4 players");
        }
        if (playersData.teamB.players.length > 4) {
          errors.push("Team B can have maximum 4 players");
        }

        // Check for duplicate player names across both teams
        const allPlayers = [
          ...playersData.teamA.players,
          ...playersData.teamB.players,
        ];
        if (new Set(allPlayers).size !== allPlayers.length) {
          errors.push("Player names must be unique across both teams");
        }
      }
    } else {
      // Individual mode validation
      if (
        !playersData ||
        !Array.isArray(playersData) ||
        playersData.length < 2
      ) {
        errors.push("At least 2 players are required");
      }

      if (playersData && playersData.length > 8) {
        errors.push("Maximum 8 players allowed");
      }

      // Check for duplicate player names
      if (playersData && new Set(playersData).size !== playersData.length) {
        errors.push("Player names must be unique");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Save current game state to storage
   */
  saveGameState() {
    if (window.storageManager) {
      window.storageManager.saveCurrentGame(this.currentGame);
    }
  }

  /**
   * Load game state from storage
   */
  loadGameState() {
    if (window.storageManager) {
      const savedGame = window.storageManager.getCurrentGame();
      if (savedGame) {
        this.currentGame = { ...savedGame };
      }
    }
  }

  /**
   * Generate unique game ID
   * @returns {string} Unique game identifier
   */
  generateGameId() {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get available game types
   * @returns {Object} Available game types with configurations
   */
  getAvailableGameTypes() {
    return { ...this.gameTypes };
  }

  /**
   * Add custom game type
   * @param {string} name - Game type name
   * @param {Object} config - Game configuration
   * @returns {boolean} Success status
   */
  addCustomGameType(name, config) {
    if (!name || !config || !config.defaultScore) {
      return false;
    }

    this.gameTypes[name] = {
      defaultScore: config.defaultScore,
      minWinBy: config.minWinBy || 2,
      isCustom: true,
    };

    // Save to settings
    if (window.storageManager) {
      const settings = window.storageManager.getSettings();
      settings.defaultGameTypes = { ...this.gameTypes };
      window.storageManager.saveSettings(settings);
    }

    return true;
  }

  /**
   * Set advanced scoring settings
   * @param {Object} settings - Advanced scoring settings
   */
  setAdvancedSettings(settings) {
    this.currentAdvancedSettings = {
      minWinBy: parseInt(settings.minWinBy) || 2,
      maxScore: settings.maxScore ? parseInt(settings.maxScore) : null,
      enableDeuce: settings.enableDeuce || false,
    };
  }

  /**
   * Get current advanced settings
   * @returns {Object} Current advanced settings
   */
  getAdvancedSettings() {
    return this.currentAdvancedSettings || {};
  }

  /**
   * Add a dynamic custom game type
   * @param {Object} gameType - Custom game type configuration
   * @returns {string} Game type key
   */
  addDynamicGameType(gameType) {
    if (!gameType.name || !gameType.defaultScore) {
      throw new Error("Game type must have a name and default score");
    }

    const gameTypeKey = gameType.name.toLowerCase().replace(/\s+/g, "_");

    this.gameTypes[gameTypeKey] = {
      name: gameType.name,
      defaultScore: parseInt(gameType.defaultScore),
      minWinBy: parseInt(gameType.minWinBy) || 2,
      isCustom: true,
    };

    // Save custom game types to storage
    this.saveCustomGameTypes();

    return gameTypeKey;
  }

  /**
   * Get all available game types including custom ones
   * @returns {Object} All game types
   */
  getAllGameTypes() {
    return { ...this.gameTypes };
  }

  /**
   * Save custom game types to storage
   */
  saveCustomGameTypes() {
    if (window.storageManager) {
      const customTypes = {};
      Object.keys(this.gameTypes).forEach((key) => {
        if (this.gameTypes[key].isCustom) {
          customTypes[key] = this.gameTypes[key];
        }
      });

      window.storageManager.saveData("customGameTypes", customTypes);
    }
  }

  /**
   * Load custom game types from storage
   */
  loadCustomGameTypes() {
    if (window.storageManager) {
      const customTypes =
        window.storageManager.getData("customGameTypes") || {};
      Object.keys(customTypes).forEach((key) => {
        this.gameTypes[key] = customTypes[key];
      });
    }
  }

  /**
   * Initialize advanced settings and custom game types
   */
  initializeAdvancedFeatures() {
    this.loadCustomGameTypes();
    this.currentAdvancedSettings = null;
  }
}

// Create global instance
window.gameManager = new GameManager();
