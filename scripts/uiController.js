/**
 * UI Controller - Handles all user interface interactions and DOM manipulation
 * Manages UI updates, event handling, and visual feedback
 */
class UIController {
  constructor() {
    this.elements = {};
    this.isHistoryVisible = false;
    this.currentView = "setup"; // 'setup' or 'game'

    // Delay initialization to ensure DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeElements();
        this.attachEventListeners();
        this.loadInitialState();
      });
    } else {
      this.initializeElements();
      this.attachEventListeners();
      this.loadInitialState();
    }
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    const elementIds = {
      // Game Setup Elements
      gameSetup: "gameSetup",
      gameType: "gameType",
      targetScore: "targetScore",

      // Game Mode Elements
      gameModeSelect: "gameMode",
      individualSection: "individualPlayersSection",
      teamSection: "teamPlayersSection",

      // Individual Mode Elements
      playerNameInput: "playerNameInput",
      addPlayerBtn: "addPlayerBtn",
      playersList: "playersList",
      playerCount: "playerCount",

      // Team Mode Elements
      teamAName: "teamANameInput",
      teamBName: "teamBNameInput",
      teamAPlayerInput: "teamAPlayerInput",
      teamBPlayerInput: "teamBPlayerInput",
      addTeamAPlayerBtn: "addTeamAPlayerBtn",
      addTeamBPlayerBtn: "addTeamBPlayerBtn",
      teamAPlayersList: "teamAPlayersList",
      teamBPlayersList: "teamBPlayersList",
      teamACount: "teamACount",
      teamBCount: "teamBCount",

      // Custom Game Type Elements
      addGameTypeBtn: "addGameTypeBtn",
      customGameTypeSection: "customGameTypeSection",
      customGameName: "customGameName",
      customGameScore: "customGameScore",
      customGameMinWin: "customGameMinWin",
      saveCustomGameBtn: "saveCustomGameBtn",
      cancelCustomGameBtn: "cancelCustomGameBtn",

      // Advanced Score Elements
      scoreConfigBtn: "scoreConfigBtn",
      advancedScoreSection: "advancedScoreSection",
      minWinBy: "minWinBy",
      maxScore: "maxScore",
      enableDeuce: "enableDeuce",
      applyScoreConfigBtn: "applyScoreConfigBtn",
      resetScoreConfigBtn: "resetScoreConfigBtn",

      startGameBtn: "startGameBtn",

      // Scoreboard Elements
      scoreboard: "scoreboard",
      currentGameType: "currentGameType",
      currentTargetScore: "currentTargetScore",
      scoreCards: "scoreCards",
      resetScoresBtn: "resetScoresBtn",
      newGameBtn: "newGameBtn",

      // History Elements
      toggleHistoryBtn: "toggleHistoryBtn",
      clearHistoryBtn: "clearHistoryBtn",
      historyList: "historyList",

      // Winner Modal Elements
      winnerModal: "winnerModal",
      winnerName: "winnerName",
      winnerScore: "winnerScore",
      gameDuration: "gameDuration",
      playAgainBtn: "playAgainBtn",
      newGameModalBtn: "newGameModalBtn",
      viewHistoryBtn: "viewHistoryBtn",
    };

    this.elements = {};
    const missingElements = [];

    // Get all elements and check if they exist
    for (const [key, id] of Object.entries(elementIds)) {
      const element = document.getElementById(id);
      if (element) {
        this.elements[key] = element;
      } else {
        missingElements.push(id);
        console.warn(`Element with ID '${id}' not found`);
      }
    }

    // Throw error if critical elements are missing
    if (missingElements.length > 0) {
      throw new Error(`Missing DOM elements: ${missingElements.join(", ")}`);
    }
  }

  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners() {
    // Game Setup Events
    this.elements.gameType.addEventListener("change", () =>
      this.onGameTypeChange()
    );
    this.elements.targetScore.addEventListener("input", () =>
      this.onTargetScoreChange()
    );

    // Game Mode Events
    this.elements.gameModeSelect.addEventListener("change", () =>
      this.onGameModeChange()
    );

    // Individual Mode Events
    if (this.elements.playerNameInput) {
      this.elements.playerNameInput.addEventListener("keypress", (e) =>
        this.onPlayerNameKeyPress(e)
      );
    }
    if (this.elements.addPlayerBtn) {
      this.elements.addPlayerBtn.addEventListener("click", () =>
        this.onAddPlayer()
      );
    }

    // Team Mode Events
    if (this.elements.teamAPlayerInput) {
      this.elements.teamAPlayerInput.addEventListener("keypress", (e) =>
        this.onTeamPlayerKeyPress(e, "A")
      );
    }
    if (this.elements.teamBPlayerInput) {
      this.elements.teamBPlayerInput.addEventListener("keypress", (e) =>
        this.onTeamPlayerKeyPress(e, "B")
      );
    }
    if (this.elements.addTeamAPlayerBtn) {
      this.elements.addTeamAPlayerBtn.addEventListener("click", () =>
        this.onAddTeamPlayer("A")
      );
    }
    if (this.elements.addTeamBPlayerBtn) {
      this.elements.addTeamBPlayerBtn.addEventListener("click", () =>
        this.onAddTeamPlayer("B")
      );
    }

    // Team name setting buttons
    const setTeamANameBtn = document.getElementById("setTeamANameBtn");
    const setTeamBNameBtn = document.getElementById("setTeamBNameBtn");
    if (setTeamANameBtn) {
      setTeamANameBtn.addEventListener("click", () => this.onSetTeamName("A"));
    }
    if (setTeamBNameBtn) {
      setTeamBNameBtn.addEventListener("click", () => this.onSetTeamName("B"));
    }

    // Custom Game Type Events
    if (this.elements.addGameTypeBtn) {
      this.elements.addGameTypeBtn.addEventListener("click", () =>
        this.onShowCustomGameForm()
      );
    }
    if (this.elements.saveCustomGameBtn) {
      this.elements.saveCustomGameBtn.addEventListener("click", () =>
        this.onSaveCustomGame()
      );
    }
    if (this.elements.cancelCustomGameBtn) {
      this.elements.cancelCustomGameBtn.addEventListener("click", () =>
        this.onCancelCustomGame()
      );
    }

    // Advanced Score Configuration Events
    if (this.elements.scoreConfigBtn) {
      this.elements.scoreConfigBtn.addEventListener("click", () =>
        this.onShowAdvancedScore()
      );
    }
    if (this.elements.applyScoreConfigBtn) {
      this.elements.applyScoreConfigBtn.addEventListener("click", () =>
        this.onApplyScoreConfig()
      );
    }
    if (this.elements.resetScoreConfigBtn) {
      this.elements.resetScoreConfigBtn.addEventListener("click", () =>
        this.onResetScoreConfig()
      );
    }

    this.elements.startGameBtn.addEventListener("click", () =>
      this.onStartGame()
    );

    // Scoreboard Events
    this.elements.resetScoresBtn.addEventListener("click", () =>
      this.onResetScores()
    );
    this.elements.newGameBtn.addEventListener("click", () => this.onNewGame());

    // History Events
    this.elements.toggleHistoryBtn.addEventListener("click", () =>
      this.onToggleHistory()
    );
    this.elements.clearHistoryBtn.addEventListener("click", () =>
      this.onClearHistory()
    );

    // Winner Modal Events
    this.elements.playAgainBtn.addEventListener("click", () =>
      this.onPlayAgain()
    );
    this.elements.newGameModalBtn.addEventListener("click", () =>
      this.onNewGameFromModal()
    );
    this.elements.viewHistoryBtn.addEventListener("click", () =>
      this.onViewHistoryFromModal()
    );

    // Close modal when clicking outside
    this.elements.winnerModal.addEventListener("click", (e) => {
      if (e.target === this.elements.winnerModal) {
        this.hideWinnerModal();
      }
    });
  }

  /**
   * Load initial state from storage
   */
  loadInitialState() {
    // Initialize game type options
    this.updateGameTypeOptions();

    // Load saved game if exists
    const savedGame = window.gameManager.getCurrentGameState();
    if (savedGame && savedGame.isGameActive && savedGame.players.length > 0) {
      this.switchToGameView();
      this.updateScoreboard();
    } else {
      this.switchToSetupView();
    }

    this.updateGameHistory();
    this.updatePlayerCount();
  }

  /**
   * Handle game type selection change
   */
  onGameTypeChange() {
    const selectedGameType = this.elements.gameType.value;
    const defaultScore = window.gameManager.getDefaultScore(selectedGameType);
    this.elements.targetScore.value = defaultScore;
  }

  /**
   * Handle target score input change
   */
  onTargetScoreChange() {
    const score = parseInt(this.elements.targetScore.value);
    if (score < 1) {
      this.elements.targetScore.value = 1;
    } else if (score > 100) {
      this.elements.targetScore.value = 100;
    }
  }

  /**
   * Handle game mode change
   */
  onGameModeChange() {
    const gameMode = this.elements.gameModeSelect.value;
    window.playerManager.setGameMode(gameMode);

    if (gameMode === "individual") {
      this.elements.individualSection.style.display = "block";
      this.elements.teamSection.style.display = "none";
    } else {
      this.elements.individualSection.style.display = "none";
      this.elements.teamSection.style.display = "block";
    }

    this.updateStartButtonState();
  }

  /**
   * Handle player name input keypress
   */
  onPlayerNameKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.onAddPlayer();
    }
  }

  /**
   * Handle add player button click
   */
  onAddPlayer() {
    const playerName = this.elements.playerNameInput.value.trim();
    if (!playerName) return;

    const result = window.playerManager.addPlayer(playerName);

    if (result.success) {
      this.elements.playerNameInput.value = "";
      this.updatePlayersList();
      this.updatePlayerCount();
      this.updateStartButtonState();
      this.showMessage(result.message, "success");
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Handle team player input keypress
   */
  onTeamPlayerKeyPress(e, team) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.onAddTeamPlayer(team);
    }
  }

  /**
   * Handle add team player
   */
  onAddTeamPlayer(team) {
    const inputElement =
      team === "A"
        ? this.elements.teamAPlayerInput
        : this.elements.teamBPlayerInput;
    const playerName = inputElement.value.trim();
    if (!playerName) return;

    // Convert "A" to "teamA" and "B" to "teamB" for PlayerManager
    const teamKey = team === "A" ? "teamA" : "teamB";
    const result = window.playerManager.addPlayerToTeam(teamKey, playerName);

    if (result.success) {
      inputElement.value = "";
      this.updateTeamPlayersList();
      this.updateTeamCounts();
      this.updateStartButtonState();
      this.showMessage(result.message, "success");
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Handle remove team player
   */
  onRemoveTeamPlayer(team, playerName) {
    // Convert "A" to "teamA" and "B" to "teamB" for PlayerManager
    const teamKey = team === "A" ? "teamA" : "teamB";
    const result = window.playerManager.removePlayerFromTeam(
      teamKey,
      playerName
    );

    if (result.success) {
      this.updateTeamPlayersList();
      this.updateTeamCounts();
      this.updateStartButtonState();
      this.showMessage(result.message, "success");
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Handle set team name
   */
  onSetTeamName(team) {
    const inputElement =
      team === "A" ? this.elements.teamAName : this.elements.teamBName;
    const displayElement = document.getElementById(
      team === "A" ? "teamADisplayName" : "teamBDisplayName"
    );
    const teamName = inputElement.value.trim();

    if (!teamName) {
      this.showMessage("Silakan masukkan nama tim", "error");
      return;
    }

    // Convert "A" to "teamA" and "B" to "teamB" for PlayerManager
    const teamKey = team === "A" ? "teamA" : "teamB";
    const result = window.playerManager.setTeamName(teamKey, teamName);

    if (result.success) {
      displayElement.textContent = teamName;
      inputElement.value = "";
      this.showMessage(result.message, "success");
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Show custom game type form
   */
  onShowCustomGameForm() {
    this.elements.customGameTypeSection.style.display = "block";
    this.elements.addGameTypeBtn.style.display = "none";
  }

  /**
   * Cancel custom game type form
   */
  onCancelCustomGame() {
    this.elements.customGameTypeSection.style.display = "none";
    this.elements.addGameTypeBtn.style.display = "inline-block";
    this.clearCustomGameForm();
  }

  /**
   * Save custom game type
   */
  onSaveCustomGame() {
    const gameName = this.elements.customGameName.value.trim();
    const defaultScore = parseInt(this.elements.customGameScore.value);
    const minWinBy = parseInt(this.elements.customGameMinWin.value);

    if (!gameName) {
      this.showMessage("Silakan masukkan nama permainan", "error");
      return;
    }

    if (!defaultScore || defaultScore < 1 || defaultScore > 100) {
      this.showMessage("Skor target harus antara 1 dan 100", "error");
      return;
    }

    if (!minWinBy || minWinBy < 1 || minWinBy > 10) {
      this.showMessage("Minimal menang harus antara 1 dan 10", "error");
      return;
    }

    try {
      const gameTypeKey = window.gameManager.addDynamicGameType({
        name: gameName,
        defaultScore: defaultScore,
        minWinBy: minWinBy,
      });

      this.updateGameTypeOptions();
      this.elements.gameType.value = gameTypeKey;
      this.elements.targetScore.value = defaultScore;
      this.onCancelCustomGame();
      this.showMessage(
        `Jenis permainan ${gameName} berhasil ditambahkan!`,
        "success"
      );
    } catch (error) {
      this.showMessage(
        error.message || "Gagal menambahkan jenis permainan",
        "error"
      );
    }
  }

  /**
   * Show advanced score configuration
   */
  onShowAdvancedScore() {
    const isVisible =
      this.elements.advancedScoreSection.style.display === "block";
    this.elements.advancedScoreSection.style.display = isVisible
      ? "none"
      : "block";
    this.elements.scoreConfigBtn.textContent = isVisible
      ? "Lanjutan"
      : "Sembunyikan Lanjutan";
  }

  /**
   * Apply advanced score configuration
   */
  onApplyScoreConfig() {
    const targetScore = parseInt(this.elements.targetScore.value);
    const minWinBy = parseInt(this.elements.minWinBy.value);
    const maxScore = parseInt(this.elements.maxScore.value);
    const enableDeuce = this.elements.enableDeuce.checked;

    if (minWinBy < 1 || minWinBy > 10) {
      this.showMessage("Minimal menang harus antara 1 dan 10", "error");
      return;
    }

    if (maxScore && maxScore < targetScore) {
      this.showMessage(
        "Skor maksimal harus lebih besar dari skor target",
        "error"
      );
      return;
    }

    // Use the new GameManager method to set advanced settings
    window.gameManager.setAdvancedSettings({
      minWinBy: minWinBy,
      maxScore: maxScore || null,
      enableDeuce: enableDeuce,
    });

    this.showMessage("Pengaturan skor lanjutan diterapkan", "success");
  }

  /**
   * Reset score configuration to defaults
   */
  onResetScoreConfig() {
    const gameType = this.elements.gameType.value;
    const defaultScore = window.gameManager.getDefaultScore(gameType);
    const gameConfig = window.gameManager.getGameTypeConfig(gameType);

    this.elements.targetScore.value = defaultScore;
    this.elements.minWinBy.value = gameConfig.minWinBy || 2;
    this.elements.maxScore.value = "";
    this.elements.enableDeuce.checked = false;

    // Clear advanced settings using the new method
    window.gameManager.setAdvancedSettings({
      minWinBy: gameConfig.minWinBy || 2,
      maxScore: null,
      enableDeuce: false,
    });

    this.showMessage("Pengaturan skor direset ke default", "success");
  }

  /**
   * Clear custom game form
   */
  clearCustomGameForm() {
    this.elements.customGameName.value = "";
    this.elements.customGameScore.value = "21";
    this.elements.customGameMinWin.value = "2";
  }

  /**
   * Update game type options in dropdown
   */
  updateGameTypeOptions() {
    const gameTypes = window.gameManager.getAllGameTypes();
    const currentValue = this.elements.gameType.value;

    this.elements.gameType.innerHTML = "";

    Object.entries(gameTypes).forEach(([key, config]) => {
      const option = document.createElement("option");
      option.value = key;
      const displayName = config.name || key;
      option.textContent = `${displayName} (${config.defaultScore} poin)${
        config.isCustom ? " *" : ""
      }`;
      this.elements.gameType.appendChild(option);
    });

    // Restore selection if it still exists
    if (gameTypes[currentValue]) {
      this.elements.gameType.value = currentValue;
    }
  }

  /**
   * Handle remove player
   */
  onRemovePlayer(playerName) {
    const result = window.playerManager.removePlayer(playerName);

    if (result.success) {
      this.updatePlayersList();
      this.updatePlayerCount();
      this.updateStartButtonState();
      this.showMessage(result.message, "success");
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Handle start game button click
   */
  onStartGame() {
    const gameType = this.elements.gameType.value;
    const targetScore = parseInt(this.elements.targetScore.value);
    const gameMode = window.playerManager.getGameMode();

    let playersData;
    if (gameMode === "team") {
      // Get team data from PlayerManager which stores the team names
      const teamAData = window.playerManager.getTeamData("A");
      const teamBData = window.playerManager.getTeamData("B");

      playersData = {
        teamA: teamAData,
        teamB: teamBData,
      };
    } else {
      // Get individual players
      playersData = window.playerManager.getAllPlayers();
    }

    const validation = window.gameManager.validateGameSetup(
      gameType,
      targetScore,
      playersData,
      gameMode
    );

    if (!validation.isValid) {
      this.showMessage(validation.errors.join(", "), "error");
      return;
    }

    const success = window.gameManager.initializeGame(
      gameType,
      targetScore,
      playersData,
      gameMode
    );

    if (success) {
      this.switchToGameView();
      this.updateScoreboard();
      this.showMessage("Permainan dimulai!", "success");

      // Track UI interaction
      this.trackUIEvent("start_game_clicked", {
        gameType: gameType,
        gameMode: gameMode,
        targetScore: targetScore,
      });
    } else {
      this.showMessage("Gagal memulai permainan", "error");
    }
  }

  /**
   * Handle score update
   */
  onScoreUpdate(playerIndex, change) {
    const result = window.gameManager.updateScore(playerIndex, change);

    if (result.success) {
      this.updateScoreDisplay();

      if (result.gameComplete && result.winner) {
        this.showWinnerModal(result.winner, result.gameStats);
        this.updateGameHistory();
      }
    } else {
      this.showMessage(result.message, "error");
    }
  }

  /**
   * Handle reset scores
   */
  onResetScores() {
    if (confirm("Apakah Anda yakin ingin mereset semua skor?")) {
      window.gameManager.resetScores();
      this.updateScoreDisplay();
      this.showMessage("Skor direset", "success");

      // Track UI interaction
      this.trackUIEvent("reset_scores_clicked", {});
    }
  }

  /**
   * Handle new game
   */
  onNewGame() {
    if (
      confirm(
        "Apakah Anda yakin ingin memulai permainan baru? Progress saat ini akan hilang."
      )
    ) {
      window.gameManager.newGame();
      window.playerManager.clearAllPlayers();

      // Clear team data completely
      window.playerManager.clearTeams();

      // Reset team name input fields
      if (this.elements.teamAName) this.elements.teamAName.value = "";
      if (this.elements.teamBName) this.elements.teamBName.value = "";
      if (this.elements.teamAPlayerInput)
        this.elements.teamAPlayerInput.value = "";
      if (this.elements.teamBPlayerInput)
        this.elements.teamBPlayerInput.value = "";

      // Reset team display names to defaults
      const teamADisplayName = document.getElementById("teamADisplayName");
      const teamBDisplayName = document.getElementById("teamBDisplayName");
      if (teamADisplayName) teamADisplayName.textContent = "Tim A";
      if (teamBDisplayName) teamBDisplayName.textContent = "Tim B";

      this.switchToSetupView();
      this.showMessage("Siap untuk permainan baru", "success");

      // Track UI interaction
      this.trackUIEvent("new_game_clicked", {});
    }
  }

  /**
   * Handle play again from modal
   */
  onPlayAgain() {
    this.hideWinnerModal();
    window.gameManager.resetScores();
    this.updateScoreDisplay();
    this.showMessage("Ronde baru dimulai!", "success");
  }

  /**
   * Handle new game from modal
   */
  onNewGameFromModal() {
    this.hideWinnerModal();
    this.onNewGame();
  }

  /**
   * Handle view history from modal
   */
  onViewHistoryFromModal() {
    this.hideWinnerModal();
    if (!this.isHistoryVisible) {
      this.onToggleHistory();
    }
  }

  /**
   * Handle toggle history
   */
  onToggleHistory() {
    this.isHistoryVisible = !this.isHistoryVisible;
    this.elements.historyList.style.display = this.isHistoryVisible
      ? "block"
      : "none";
    this.elements.toggleHistoryBtn.textContent = this.isHistoryVisible
      ? "Sembunyikan Riwayat"
      : "Tampilkan Riwayat";

    if (this.isHistoryVisible) {
      this.updateGameHistory();
    }

    // Track UI interaction
    this.trackUIEvent("toggle_history_clicked", {
      isVisible: this.isHistoryVisible,
    });
  }

  /**
   * Handle clear history
   */
  onClearHistory() {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus semua riwayat permainan? Ini tidak bisa dibatalkan."
      )
    ) {
      window.storageManager.clearGameHistory();
      this.updateGameHistory();
      this.showMessage("Riwayat permainan dihapus", "success");
    }
  }

  /**
   * Switch to setup view
   */
  switchToSetupView() {
    this.currentView = "setup";
    this.elements.gameSetup.style.display = "block";
    this.elements.scoreboard.style.display = "none";

    // Update displays based on current game mode
    const gameMode = window.playerManager.getGameMode();
    if (gameMode === "team") {
      this.updateTeamPlayersList();
      this.updateTeamCounts();
    } else {
      this.updatePlayersList();
      this.updatePlayerCount();
    }

    this.updateStartButtonState();
  }

  /**
   * Switch to game view
   */
  switchToGameView() {
    this.currentView = "game";
    this.elements.gameSetup.style.display = "none";
    this.elements.scoreboard.style.display = "block";
  }

  /**
   * Update players list display
   */
  updatePlayersList() {
    const players = window.playerManager.getAllPlayers();
    this.elements.playersList.innerHTML = "";

    players.forEach((player, index) => {
      const playerItem = document.createElement("div");
      playerItem.className = "player-item";
      playerItem.innerHTML = `
                <span class="player-name">${this.escapeHtml(player)}</span>
                <button class="remove-player" onclick="window.uiController.onRemovePlayer('${this.escapeHtml(
                  player
                )}')">
                    Hapus
                </button>
            `;
      this.elements.playersList.appendChild(playerItem);
    });
  }

  /**
   * Update player count display
   */
  updatePlayerCount() {
    const count = window.playerManager.getPlayerCount();
    const readiness = window.playerManager.isReadyToStart();

    // Update the count text
    this.elements.playerCount.textContent = count;

    // Update the parent element's content while preserving the playerCount element
    const parentElement = this.elements.playerCount.parentElement;
    parentElement.innerHTML = `
            <span id="playerCount">${count}</span> pemain ditambahkan
            <span style="color: ${readiness.isReady ? "#48bb78" : "#e53e3e"}">
                (${readiness.message})
            </span>
        `;

    // Re-reference the playerCount element since we just recreated it
    this.elements.playerCount = document.getElementById("playerCount");
  }

  /**
   * Update team players lists display
   */
  updateTeamPlayersList() {
    // Update Team A players list
    const teamAPlayers = window.playerManager.getTeamPlayers("A");
    if (this.elements.teamAPlayersList) {
      this.elements.teamAPlayersList.innerHTML = "";

      teamAPlayers.forEach((player) => {
        const playerItem = document.createElement("div");
        playerItem.className = "player-item";
        playerItem.innerHTML = `
          <span class="player-name">${this.escapeHtml(player)}</span>
          <button class="remove-player" onclick="window.uiController.onRemoveTeamPlayer('A', '${this.escapeHtml(
            player
          )}')">
            Hapus
          </button>
        `;
        this.elements.teamAPlayersList.appendChild(playerItem);
      });
    }

    // Update Team B players list
    const teamBPlayers = window.playerManager.getTeamPlayers("B");
    if (this.elements.teamBPlayersList) {
      this.elements.teamBPlayersList.innerHTML = "";

      teamBPlayers.forEach((player) => {
        const playerItem = document.createElement("div");
        playerItem.className = "player-item";
        playerItem.innerHTML = `
          <span class="player-name">${this.escapeHtml(player)}</span>
          <button class="remove-player" onclick="window.uiController.onRemoveTeamPlayer('B', '${this.escapeHtml(
            player
          )}')">
            Hapus
          </button>
        `;
        this.elements.teamBPlayersList.appendChild(playerItem);
      });
    }
  }

  /**
   * Update team counts display
   */
  updateTeamCounts() {
    const teamACount = window.playerManager.getTeamPlayers("A").length;
    const teamBCount = window.playerManager.getTeamPlayers("B").length;

    if (this.elements.teamACount) {
      this.elements.teamACount.textContent = teamACount;
    }

    if (this.elements.teamBCount) {
      this.elements.teamBCount.textContent = teamBCount;
    }
  }

  /**
   * Update start button state
   */
  updateStartButtonState() {
    const readiness = window.playerManager.isReadyToStart();
    this.elements.startGameBtn.disabled = !readiness.isReady;
  }

  /**
   * Update scoreboard display
   */
  updateScoreboard() {
    const gameState = window.gameManager.getCurrentGameState();

    this.elements.currentGameType.textContent =
      gameState.gameType || "Tidak Ada Permainan";
    this.elements.currentTargetScore.textContent = gameState.targetScore || 0;

    this.updateScoreDisplay();
  }

  /**
   * Update score cards display
   */
  updateScoreDisplay() {
    const gameState = window.gameManager.getCurrentGameState();
    const leadingPlayer = window.gameManager.getLeadingPlayer();

    this.elements.scoreCards.innerHTML = "";

    gameState.players.forEach((player, index) => {
      const score = gameState.scores[index] || 0;
      const isLeading =
        leadingPlayer && leadingPlayer.index === index && score > 0;

      // Get display name based on game mode
      let displayName;
      if (gameState.gameMode === "team") {
        // For team mode, player is an object with name and players array
        displayName = player.name;
        const teamPlayers = player.players.join(", ");
        displayName += ` (${teamPlayers})`;
      } else {
        // For individual mode, player is just a string
        displayName = player;
      }

      const scoreCard = document.createElement("div");
      scoreCard.className = `score-card ${isLeading ? "leading" : ""} ${
        gameState.gameMode === "team" ? "team-card" : ""
      }`;
      scoreCard.innerHTML = `
                <div class="player-name">${this.escapeHtml(displayName)}</div>
                <div class="score-display">${score}</div>
                <div class="score-controls">
                    <button class="score-btn minus" onclick="window.uiController.onScoreUpdate(${index}, -1)"
                            ${score <= 0 ? "disabled" : ""}>-</button>
                    <button class="score-btn plus" onclick="window.uiController.onScoreUpdate(${index}, 1)">+</button>
                </div>
            `;
      this.elements.scoreCards.appendChild(scoreCard);
    });
  }

  /**
   * Show winner modal
   */
  showWinnerModal(winner, gameStats) {
    this.elements.winnerName.textContent = winner.playerName;

    const gameState = window.gameManager.getCurrentGameState();
    const finalScores = gameState.scores.join(" - ");
    this.elements.winnerScore.textContent = `Skor Akhir: ${finalScores}`;

    if (gameStats) {
      this.elements.gameDuration.textContent = `Durasi Permainan: ${gameStats.duration}`;
    }

    this.elements.winnerModal.style.display = "flex";
  }

  /**
   * Hide winner modal
   */
  hideWinnerModal() {
    this.elements.winnerModal.style.display = "none";
  }

  /**
   * Update game history display
   */
  updateGameHistory() {
    const history = window.storageManager.getGameHistory();
    this.elements.historyList.innerHTML = "";

    if (history.length === 0) {
      this.elements.historyList.innerHTML =
        '<p style="text-align: center; color: #718096;">Belum ada permainan yang dimainkan</p>';
      return;
    }

    history.forEach((game) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      const date = new Date(game.completedAt).toLocaleDateString();
      const time = new Date(game.completedAt).toLocaleTimeString();

      // Format players display based on game mode
      let playersDisplay;
      if (game.gameMode === "team") {
        // For team mode, show team names and their players
        const teamAInfo = `${
          game.players[0].name
        }: ${game.players[0].players.join(", ")}`;
        const teamBInfo = `${
          game.players[1].name
        }: ${game.players[1].players.join(", ")}`;
        playersDisplay = `${teamAInfo} vs ${teamBInfo}`;
      } else {
        // For individual mode, show player names
        playersDisplay = game.players.join(", ");
      }

      historyItem.innerHTML = `
                <div class="game-type">${game.gameType} ${
        game.gameMode === "team" ? "(Tim)" : "(Individu)"
      } (Target: ${game.targetScore})</div>
                <div class="players">${playersDisplay}</div>
                <div class="result">Pemenang: ${
                  game.winner.name
                } (${game.finalScores.join(" - ")})</div>
                <div class="date">${date} pada ${time} • Durasi: ${
        game.duration
      }</div>
            `;

      this.elements.historyList.appendChild(historyItem);
    });
  }

  /**
   * Show temporary message
   */
  showMessage(message, type = "info") {
    // Remove existing message if any
    const existingMessage = document.querySelector(".temp-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = `temp-message temp-message-${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            background: ${
              type === "success"
                ? "#48bb78"
                : type === "error"
                ? "#e53e3e"
                : "#667eea"
            };
        `;

    document.body.appendChild(messageElement);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.style.animation = "slideOut 0.3s ease";
        setTimeout(() => messageElement.remove(), 300);
      }
    }, 3000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get current view
   */
  getCurrentView() {
    return this.currentView;
  }

  /**
   * Refresh entire UI
   */
  refreshUI() {
    if (this.currentView === "setup") {
      const gameMode = window.playerManager.getGameMode();
      if (gameMode === "team") {
        this.updateTeamPlayersList();
        this.updateTeamCounts();
      } else {
        this.updatePlayersList();
        this.updatePlayerCount();
      }
      this.updateStartButtonState();
    } else {
      this.updateScoreboard();
    }
    this.updateGameHistory();
  }

  /**
   * Track UI events for analytics
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   */
  trackUIEvent(eventName, eventData) {
    try {
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent(eventName, eventData);
      }
    } catch (error) {
      console.error("Failed to track UI event:", error);
      // Don't let analytics errors break the UI
    }
  }
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Create global instance
window.uiController = new UIController();
