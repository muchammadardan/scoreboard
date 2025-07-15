/**
 * Player Manager - Handles player management operations
 * Manages adding, removing, and validating players
 */
class PlayerManager {
  constructor() {
    this.players = [];
    this.teams = {
      teamA: {
        name: "Tim A",
        players: [],
      },
      teamB: {
        name: "Tim B",
        players: [],
      },
    };
    this.gameMode = "individual"; // 'individual' or 'team'
    this.maxPlayers = 8;
    this.minPlayers = 2;
    this.maxNameLength = 20;
    this.minNameLength = 1;
    this.maxTeamNameLength = 30;
  }

  /**
   * Add a new player
   * @param {string} playerName - Name of the player to add
   * @returns {Object} Result of the add operation
   */
  addPlayer(playerName) {
    const validation = this.validatePlayerName(playerName);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors[0],
        players: [...this.players],
      };
    }

    // Check if player already exists
    if (this.players.includes(playerName.trim())) {
      return {
        success: false,
        message: "Pemain sudah ada",
        players: [...this.players],
      };
    }

    // Check max players limit
    if (this.players.length >= this.maxPlayers) {
      return {
        success: false,
        message: `Maksimal ${this.maxPlayers} pemain diizinkan`,
        players: [...this.players],
      };
    }

    this.players.push(playerName.trim());

    return {
      success: true,
      message: "Pemain berhasil ditambahkan",
      players: [...this.players],
      addedPlayer: playerName.trim(),
    };
  }

  /**
   * Remove a player
   * @param {string} playerName - Name of the player to remove
   * @returns {Object} Result of the remove operation
   */
  removePlayer(playerName) {
    const playerIndex = this.players.indexOf(playerName);

    if (playerIndex === -1) {
      return {
        success: false,
        message: "Pemain tidak ditemukan",
        players: [...this.players],
      };
    }

    this.players.splice(playerIndex, 1);

    return {
      success: true,
      message: "Pemain berhasil dihapus",
      players: [...this.players],
      removedPlayer: playerName,
    };
  }

  /**
   * Remove player by index
   * @param {number} index - Index of the player to remove
   * @returns {Object} Result of the remove operation
   */
  removePlayerByIndex(index) {
    if (index < 0 || index >= this.players.length) {
      return {
        success: false,
        message: "Indeks pemain tidak valid",
        players: [...this.players],
      };
    }

    const removedPlayer = this.players[index];
    this.players.splice(index, 1);

    return {
      success: true,
      message: "Pemain berhasil dihapus",
      players: [...this.players],
      removedPlayer: removedPlayer,
    };
  }

  /**
   * Clear all players
   * @returns {Object} Result of the clear operation
   */
  clearAllPlayers() {
    const previousCount = this.players.length;
    this.players = [];

    return {
      success: true,
      message: `${previousCount} pemain telah dihapus`,
      players: [],
      clearedCount: previousCount,
    };
  }

  /**
   * Get all players
   * @returns {Array} Array of player names
   */
  getAllPlayers() {
    return [...this.players];
  }

  /**
   * Get player count
   * @returns {number} Number of players
   */
  getPlayerCount() {
    return this.players.length;
  }

  /**
   * Check if ready to start game
   * @returns {Object} Readiness status
   */
  isReadyToStart() {
    const isReady = this.players.length >= this.minPlayers;

    return {
      isReady: isReady,
      playerCount: this.players.length,
      minRequired: this.minPlayers,
      message: isReady
        ? "Siap memulai permainan"
        : `Butuh minimal ${this.minPlayers} pemain untuk memulai`,
    };
  }

  /**
   * Validate player name
   * @param {string} playerName - Player name to validate
   * @returns {Object} Validation result
   */
  validatePlayerName(playerName) {
    const errors = [];

    // Check if name is provided
    if (!playerName || typeof playerName !== "string") {
      errors.push("Nama pemain diperlukan");
      return { isValid: false, errors };
    }

    const trimmedName = playerName.trim();

    // Check minimum length
    if (trimmedName.length < this.minNameLength) {
      errors.push(`Nama pemain minimal ${this.minNameLength} karakter`);
    }

    // Check maximum length
    if (trimmedName.length > this.maxNameLength) {
      errors.push(`Nama pemain maksimal ${this.maxNameLength} karakter`);
    }

    // Check for invalid characters (basic validation)
    const invalidChars = /[<>\"'&]/;
    if (invalidChars.test(trimmedName)) {
      errors.push("Nama pemain mengandung karakter tidak valid");
    }

    // Check if name is only whitespace
    if (trimmedName.length === 0) {
      errors.push("Nama pemain tidak boleh kosong atau hanya spasi");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      trimmedName: trimmedName,
    };
  }

  /**
   * Reorder players
   * @param {number} fromIndex - Source index
   * @param {number} toIndex - Target index
   * @returns {Object} Result of the reorder operation
   */
  reorderPlayer(fromIndex, toIndex) {
    if (
      fromIndex < 0 ||
      fromIndex >= this.players.length ||
      toIndex < 0 ||
      toIndex >= this.players.length
    ) {
      return {
        success: false,
        message: "Indeks pemain tidak valid",
        players: [...this.players],
      };
    }

    const [movedPlayer] = this.players.splice(fromIndex, 1);
    this.players.splice(toIndex, 0, movedPlayer);

    return {
      success: true,
      message: "Urutan pemain berhasil diubah",
      players: [...this.players],
      movedPlayer: movedPlayer,
      fromIndex: fromIndex,
      toIndex: toIndex,
    };
  }

  /**
   * Update player name
   * @param {number} index - Index of player to update
   * @param {string} newName - New player name
   * @returns {Object} Result of the update operation
   */
  updatePlayerName(index, newName) {
    if (index < 0 || index >= this.players.length) {
      return {
        success: false,
        message: "Indeks pemain tidak valid",
        players: [...this.players],
      };
    }

    const validation = this.validatePlayerName(newName);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors[0],
        players: [...this.players],
      };
    }

    const trimmedName = newName.trim();

    // Check if new name already exists (excluding current player)
    const existingIndex = this.players.indexOf(trimmedName);
    if (existingIndex !== -1 && existingIndex !== index) {
      return {
        success: false,
        message: "Nama pemain sudah ada",
        players: [...this.players],
      };
    }

    const oldName = this.players[index];
    this.players[index] = trimmedName;

    return {
      success: true,
      message: "Nama pemain berhasil diperbarui",
      players: [...this.players],
      oldName: oldName,
      newName: trimmedName,
      index: index,
    };
  }

  /**
   * Get player statistics from game history
   * @param {string} playerName - Name of the player
   * @returns {Object} Player statistics
   */
  getPlayerStats(playerName) {
    const gameHistory = window.storageManager.getGameHistory();
    const playerGames = gameHistory.filter((game) =>
      game.players.includes(playerName)
    );

    if (playerGames.length === 0) {
      return {
        playerName: playerName,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        winRate: 0,
        totalPoints: 0,
        averagePoints: 0,
        favoriteGame: null,
      };
    }

    const gamesWon = playerGames.filter(
      (game) => game.winner.name === playerName
    ).length;

    const totalPoints = playerGames.reduce((sum, game) => {
      const playerIndex = game.players.indexOf(playerName);
      return sum + (game.finalScores[playerIndex] || 0);
    }, 0);

    // Find favorite game type
    const gameTypeCounts = {};
    playerGames.forEach((game) => {
      gameTypeCounts[game.gameType] = (gameTypeCounts[game.gameType] || 0) + 1;
    });

    const favoriteGame = Object.keys(gameTypeCounts).reduce((a, b) =>
      gameTypeCounts[a] > gameTypeCounts[b] ? a : b
    );

    return {
      playerName: playerName,
      gamesPlayed: playerGames.length,
      gamesWon: gamesWon,
      gamesLost: playerGames.length - gamesWon,
      winRate: Math.round((gamesWon / playerGames.length) * 100),
      totalPoints: totalPoints,
      averagePoints: Math.round((totalPoints / playerGames.length) * 100) / 100,
      favoriteGame: favoriteGame,
      gameTypeStats: gameTypeCounts,
    };
  }

  /**
   * Get all player statistics
   * @returns {Array} Array of player statistics
   */
  getAllPlayerStats() {
    const gameHistory = window.storageManager.getGameHistory();
    const allPlayers = new Set();

    gameHistory.forEach((game) => {
      game.players.forEach((player) => allPlayers.add(player));
    });

    return Array.from(allPlayers).map((player) => this.getPlayerStats(player));
  }

  /**
   * Set players from array
   * @param {Array} playerArray - Array of player names
   * @returns {Object} Result of the set operation
   */
  setPlayers(playerArray) {
    if (!Array.isArray(playerArray)) {
      return {
        success: false,
        message: "Array pemain tidak valid",
        players: [...this.players],
      };
    }

    // Validate all player names
    const validationResults = playerArray.map((name) =>
      this.validatePlayerName(name)
    );
    const invalidNames = validationResults.filter((result) => !result.isValid);

    if (invalidNames.length > 0) {
      return {
        success: false,
        message: `Nama pemain tidak valid: ${invalidNames
          .map((r) => r.errors[0])
          .join(", ")}`,
        players: [...this.players],
      };
    }

    // Check for duplicates
    const trimmedNames = playerArray.map((name) => name.trim());
    const uniqueNames = [...new Set(trimmedNames)];

    if (uniqueNames.length !== trimmedNames.length) {
      return {
        success: false,
        message: "Ditemukan nama pemain yang sama",
        players: [...this.players],
      };
    }

    // Check player count limits
    if (uniqueNames.length > this.maxPlayers) {
      return {
        success: false,
        message: `Terlalu banyak pemain. Maksimal ${this.maxPlayers} diizinkan`,
        players: [...this.players],
      };
    }

    this.players = uniqueNames;

    return {
      success: true,
      message: `${uniqueNames.length} pemain berhasil diatur`,
      players: [...this.players],
    };
  }

  /**
   * Get configuration limits
   * @returns {Object} Configuration limits
   */
  getConfig() {
    return {
      maxPlayers: this.maxPlayers,
      minPlayers: this.minPlayers,
      maxNameLength: this.maxNameLength,
      minNameLength: this.minNameLength,
    };
  }

  /**
   * Set game mode
   * @param {string} mode - 'individual' or 'team'
   * @returns {Object} Result of the operation
   */
  setGameMode(mode) {
    if (mode !== "individual" && mode !== "team") {
      return {
        success: false,
        message: 'Mode permainan tidak valid. Harus "individual" atau "team"',
        gameMode: this.gameMode,
      };
    }

    this.gameMode = mode;

    // Clear data when switching modes
    if (mode === "individual") {
      this.clearTeams();
    } else {
      this.clearAllPlayers();
    }

    return {
      success: true,
      message: `Mode permainan diatur ke ${mode}`,
      gameMode: this.gameMode,
    };
  }

  /**
   * Get current game mode
   * @returns {string} Current game mode
   */
  getGameMode() {
    return this.gameMode;
  }

  /**
   * Set team name
   * @param {string} team - 'teamA' or 'teamB'
   * @param {string} name - Team name
   * @returns {Object} Result of the operation
   */
  setTeamName(team, name) {
    if (team !== "teamA" && team !== "teamB") {
      return {
        success: false,
        message: 'Tim tidak valid. Harus "teamA" atau "teamB"',
        teams: { ...this.teams },
      };
    }

    const validation = this.validateTeamName(name);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors[0],
        teams: { ...this.teams },
      };
    }

    const trimmedName = name.trim();
    this.teams[team].name = trimmedName;

    return {
      success: true,
      message: `Nama ${team} diatur ke "${trimmedName}"`,
      teams: { ...this.teams },
    };
  }

  /**
   * Add player to team
   * @param {string} team - 'teamA' or 'teamB'
   * @param {string} playerName - Player name
   * @returns {Object} Result of the operation
   */
  addPlayerToTeam(team, playerName) {
    if (team !== "teamA" && team !== "teamB") {
      return {
        success: false,
        message: 'Tim tidak valid. Harus "teamA" atau "teamB"',
        teams: { ...this.teams },
      };
    }

    const validation = this.validatePlayerName(playerName);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors[0],
        teams: { ...this.teams },
      };
    }

    const trimmedName = playerName.trim();

    // Check if player already exists in any team
    if (
      this.teams.teamA.players.includes(trimmedName) ||
      this.teams.teamB.players.includes(trimmedName)
    ) {
      return {
        success: false,
        message: "Pemain sudah ada di tim lain",
        teams: { ...this.teams },
      };
    }

    // Check team size limit
    if (this.teams[team].players.length >= 4) {
      return {
        success: false,
        message: "Maksimal 4 pemain per tim",
        teams: { ...this.teams },
      };
    }

    this.teams[team].players.push(trimmedName);

    return {
      success: true,
      message: `${trimmedName} ditambahkan ke ${this.teams[team].name}`,
      teams: { ...this.teams },
      addedPlayer: trimmedName,
      team: team,
    };
  }

  /**
   * Remove player from team
   * @param {string} team - 'teamA' or 'teamB'
   * @param {string} playerName - Player name
   * @returns {Object} Result of the operation
   */
  removePlayerFromTeam(team, playerName) {
    if (team !== "teamA" && team !== "teamB") {
      return {
        success: false,
        message: 'Tim tidak valid. Harus "teamA" atau "teamB"',
        teams: { ...this.teams },
      };
    }

    const playerIndex = this.teams[team].players.indexOf(playerName);
    if (playerIndex === -1) {
      return {
        success: false,
        message: "Pemain tidak ditemukan di tim",
        teams: { ...this.teams },
      };
    }

    this.teams[team].players.splice(playerIndex, 1);

    return {
      success: true,
      message: `${playerName} dihapus dari ${this.teams[team].name}`,
      teams: { ...this.teams },
      removedPlayer: playerName,
      team: team,
    };
  }

  /**
   * Get teams data
   * @returns {Object} Teams data
   */
  getTeams() {
    return { ...this.teams };
  }

  /**
   * Get team players count
   * @param {string} team - 'teamA' or 'teamB'
   * @returns {number} Number of players in team
   */
  getTeamPlayerCount(team) {
    if (team !== "teamA" && team !== "teamB") {
      return 0;
    }
    return this.teams[team].players.length;
  }

  /**
   * Check if teams are ready to start
   * @returns {Object} Readiness status for teams
   */
  areTeamsReadyToStart() {
    const teamACount = this.teams.teamA.players.length;
    const teamBCount = this.teams.teamB.players.length;
    const isReady = teamACount >= 1 && teamBCount >= 1;

    return {
      isReady: isReady,
      teamACount: teamACount,
      teamBCount: teamBCount,
      message: isReady
        ? "Tim siap memulai"
        : "Setiap tim butuh minimal 1 pemain",
    };
  }

  /**
   * Clear all teams
   * @returns {Object} Result of the operation
   */
  clearTeams() {
    this.teams.teamA.name = "Tim A";
    this.teams.teamA.players = [];
    this.teams.teamB.name = "Tim B";
    this.teams.teamB.players = [];

    return {
      success: true,
      message: "Semua tim telah dihapus",
      teams: { ...this.teams },
    };
  }

  /**
   * Validate team name
   * @param {string} teamName - Team name to validate
   * @returns {Object} Validation result
   */
  validateTeamName(teamName) {
    const errors = [];

    if (!teamName || typeof teamName !== "string") {
      errors.push("Nama tim diperlukan");
      return { isValid: false, errors };
    }

    const trimmedName = teamName.trim();

    if (trimmedName.length < this.minNameLength) {
      errors.push(`Nama tim minimal ${this.minNameLength} karakter`);
    }

    if (trimmedName.length > this.maxTeamNameLength) {
      errors.push(`Nama tim maksimal ${this.maxTeamNameLength} karakter`);
    }

    const invalidChars = /[<>\"'&]/;
    if (invalidChars.test(trimmedName)) {
      errors.push("Nama tim mengandung karakter tidak valid");
    }

    if (trimmedName.length === 0) {
      errors.push("Nama tim tidak boleh kosong atau hanya spasi");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      trimmedName: trimmedName,
    };
  }

  /**
   * Get players for game based on current mode
   * @returns {Array} Array of players or teams
   */
  getPlayersForGame() {
    if (this.gameMode === "team") {
      return [
        {
          type: "team",
          name: this.teams.teamA.name,
          players: [...this.teams.teamA.players],
        },
        {
          type: "team",
          name: this.teams.teamB.name,
          players: [...this.teams.teamB.players],
        },
      ];
    } else {
      return this.players.map((player) => ({
        type: "individual",
        name: player,
        players: [player],
      }));
    }
  }

  /**
   * Override isReadyToStart to handle both modes
   * @returns {Object} Readiness status
   */
  isReadyToStart() {
    if (this.gameMode === "team") {
      return this.areTeamsReadyToStart();
    } else {
      const isReady = this.players.length >= this.minPlayers;
      return {
        isReady: isReady,
        playerCount: this.players.length,
        minRequired: this.minPlayers,
        message: isReady
          ? "Siap memulai permainan"
          : `Butuh minimal ${this.minPlayers} pemain untuk memulai`,
      };
    }
  }

  /**
   * Get team players by team identifier
   * @param {string} team - 'A' or 'B' (converted to teamA/teamB internally)
   * @returns {Array} Array of player names in the team
   */
  getTeamPlayers(team) {
    const teamKey = team === "A" ? "teamA" : team === "B" ? "teamB" : team;
    if (teamKey !== "teamA" && teamKey !== "teamB") {
      return [];
    }
    return [...this.teams[teamKey].players];
  }

  /**
   * Get team data by team identifier
   * @param {string} team - 'A' or 'B' (converted to teamA/teamB internally)
   * @returns {Object} Team data object
   */
  getTeamData(team) {
    const teamKey = team === "A" ? "teamA" : team === "B" ? "teamB" : team;
    if (teamKey !== "teamA" && teamKey !== "teamB") {
      return { name: "Tim Tidak Dikenal", players: [] };
    }
    return {
      name: this.teams[teamKey].name,
      players: [...this.teams[teamKey].players],
    };
  }
}

// Create global instance
window.playerManager = new PlayerManager();
