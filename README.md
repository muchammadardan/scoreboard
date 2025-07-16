# 🏆 Scoreboard Application

A modern, responsive web-based scoreboard application for tracking game scores with persistent data storage and comprehensive game history.

## ✨ Features

### Core Functionality

- **Multiple Player Support**: Add/remove players dynamically with input validation
- **Game Type Selection**: Pre-configured games (Badminton, Ping Pong, Volleyball) with customizable target scores
- **Real-time Scoring**: Increment/decrement scores with visual feedback
- **Winner Detection**: Automatic winner announcement with game completion statistics
- **Local Storage**: All data persisted locally in browser storage
- **Game History**: Complete history of all played games with detailed statistics
- **Visitor Counter**: Real-time visitor tracking with total visits, today's visits, and online users
- **Google Analytics Integration**: Comprehensive tracking with GA4 for usage analytics

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Keyboard Shortcuts**: Quick actions using keyboard combinations
- **Visual Feedback**: Leading player highlighting and score animations
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Game Management

- **Game Setup**: Configure game type, target score, and players before starting
- **Score Management**: Easy score tracking with +/- buttons
- **Game Controls**: Reset scores, start new games, or play again
- **Statistics**: Game duration tracking and player performance metrics

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- No additional software installation required

### Installation

1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start playing!

### File Structure

```
papan_score/
├── index.html              # Main HTML structure
├── styles/
│   └── main.css           # Application styling
├── scripts/
│   ├── app.js             # Main application controller
│   ├── analyticsManager.js # Analytics and visitor tracking
│   ├── gameManager.js     # Game logic and scoring
│   ├── playerManager.js   # Player management
│   ├── storageManager.js  # Local storage operations
│   └── uiController.js    # UI interactions and updates
└── README.md              # Project documentation
```

## 🎮 How to Use

### Setting Up a Game

1. **Select Game Type**: Choose from Badminton (21), Ping Pong (11), or Volleyball (25)
2. **Set Target Score**: Modify the target score if needed (1-100 points)
3. **Add Players**: Enter player names and click "Add Player" (minimum 2, maximum 8)
4. **Start Game**: Click "Start Game" when ready

### During the Game

- **Update Scores**: Use +/- buttons to update player scores
- **Track Progress**: Leading player is highlighted in green
- **Monitor Game**: View current target score and game type
- **Reset if Needed**: Use "Reset Scores" to start over

### Game Completion

- **Winner Announcement**: Automatic detection when target score is reached
- **Game Statistics**: View final scores and game duration
- **Next Actions**: Choose to play again, start new game, or view history

### Game History

- **View History**: Click "Show History" to see all previous games
- **Game Details**: See players, scores, winners, and timestamps
- **Clear History**: Remove all history if needed

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + N**: Start new game (when in game view)
- **Ctrl/Cmd + R**: Reset scores (when in game view)
- **Ctrl/Cmd + H**: Toggle game history
- **Escape**: Close winner modal

## 🎯 Game Types & Rules

### Badminton

- **Target Score**: 21 points (customizable)
- **Win Condition**: Must win by 2 points
- **Scoring**: Rally point system

### Ping Pong

- **Target Score**: 11 points (customizable)
- **Win Condition**: Must win by 2 points
- **Scoring**: Standard table tennis rules

### Volleyball

- **Target Score**: 25 points (customizable)
- **Win Condition**: Must win by 2 points
- **Scoring**: Rally point system

## 💾 Data Storage

### Local Storage

- **Current Game**: Active game state and scores
- **Game History**: Up to 50 most recent completed games
- **Settings**: User preferences and custom configurations

### Data Persistence

- Automatic saving every 30 seconds during active games
- Save on page unload to prevent data loss
- Manual save triggers on score updates

### Data Management

- **Export**: Use `window.debugApp.exportData()` in browser console
- **Import**: Use `window.debugApp.importData(data)` in browser console
- **Reset**: Use `window.debugApp.resetApp()` to clear all data

## 📊 Analytics & Visitor Tracking

### Google Analytics 4 Integration

The application includes comprehensive Google Analytics 4 (GA4) tracking:

- **Measurement ID**: G-6TX7FERP9M
- **Page Views**: Automatic tracking of page visits and sessions
- **Event Tracking**: Custom events for game interactions
- **User Behavior**: Analysis of game preferences and usage patterns

### Visitor Counter

Real-time visitor statistics displayed in the header:

- **Total Visits**: Cumulative visitor count
- **Today's Visits**: Daily visitor count (resets at midnight)
- **Online Users**: Current active users (simulated real-time data)

### Tracked Events

The following events are automatically tracked:

#### Game Events

- `game_start`: When a new game begins
- `game_complete`: When a game finishes with winner
- `game_reset`: When scores are reset
- `score_update`: When player scores change

#### UI Events

- `start_game_clicked`: Game start button interactions
- `reset_scores_clicked`: Score reset actions
- `new_game_clicked`: New game creation
- `toggle_history_clicked`: History view toggles

### Privacy & Data Collection

- **Anonymous Tracking**: No personal information is collected
- **Local Storage**: Visitor counts stored locally for immediate display
- **GA4 Compliance**: Follows Google Analytics privacy guidelines
- **No Cookies**: Uses cookieless tracking methods where possible

### Analytics Data Access

For website owners, analytics data can be viewed in:

1. Google Analytics 4 dashboard (analytics.google.com)
2. Real-time reports for current activity
3. Audience reports for visitor demographics
4. Event reports for user interactions

## 🛠️ Technical Details

### Architecture

- **Modular Design**: Separate managers for different concerns
- **Event-Driven**: Reactive UI updates based on state changes
- **Error Handling**: Comprehensive error catching and user feedback
- **Browser Compatibility**: Works with all modern browsers

### Performance

- **Lightweight**: No external dependencies
- **Fast Loading**: Optimized CSS and JavaScript
- **Responsive**: Smooth animations and interactions
- **Memory Efficient**: Automatic cleanup and storage limits

### Security

- **XSS Protection**: HTML escaping for user inputs
- **Input Validation**: Comprehensive validation for all user inputs
- **Safe Storage**: Secure local storage implementation

## 🎨 Customization

### Adding Custom Game Types

```javascript
// Use the game manager to add custom games
window.gameManager.addCustomGameType("Custom Game", {
  defaultScore: 15,
  minWinBy: 1,
});
```

### Styling Modifications

- Edit `styles/main.css` to customize appearance
- CSS variables available for easy theme changes
- Responsive breakpoints for mobile optimization

## 🐛 Troubleshooting

### Common Issues

1. **Scores not saving**: Check if browser allows local storage
2. **UI not updating**: Refresh the page to reset application state
3. **Player names not accepting**: Check for invalid characters or length limits
4. **Game not starting**: Ensure minimum 2 players are added

### Browser Console

- Use `window.debugApp.getAppInfo()` to check application status
- Check browser console for detailed error messages
- Use developer tools to inspect local storage

### Reset Application

If you encounter persistent issues:

1. Open browser console
2. Run `window.debugApp.resetApp()`
3. Confirm the reset when prompted

## 📱 Mobile Support

### Touch Interactions

- Large, touch-friendly buttons
- Responsive design for all screen sizes
- Optimized for portrait and landscape modes

### Mobile Features

- Swipe gestures supported
- Zoom and pan capabilities
- Full-screen mode compatible

## 🔄 Updates & Maintenance

### Version Information

- Current Version: 1.0.0
- Check version: `window.debugApp.getAppInfo().version`

### Future Enhancements

- Tournament bracket support
- Player statistics dashboard
- Export to PDF/CSV
- Online multiplayer support
- Custom themes and colors

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📞 Support

For support or questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Use the reset function if needed
4. Submit an issue for persistent problems

---

**Enjoy your games! 🏆**
