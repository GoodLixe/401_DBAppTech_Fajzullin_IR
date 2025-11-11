// Главный модуль приложения
class GuessNumberApp {
    constructor() {
        this.game = new Game();
        this.ui = new GameUI();
        
        this.init();
    }

    // Инициализация приложения
    init() {
        console.log('🚀 Инициализация приложения "Угадай число"');
        
        // Устанавливаем обработчики событий для UI
        this.setupEventHandlers();
        
        // Показываем стартовый экран
        this.ui.showScreen('start');
        this.ui.focusGuessInput();
    }

    // Настройка обработчиков событий
    setupEventHandlers() {
        // Старт новой игры
        this.ui.onStartGame = () => this.handleStartGame();
        
        // Отправка попытки
        this.ui.onSubmitGuess = () => this.handleSubmitGuess();
        
        // Новая игра
        this.ui.onNewGame = () => this.handleNewGame();
        
        // Показать статистику
        this.ui.onShowStats = () => this.handleShowStats();
        
        // Вернуться к игре
        this.ui.onBackToGame = () => this.handleBackToGame();
        
        // Играть снова
        this.ui.onPlayAgain = () => this.handlePlayAgain();
    }

    // Обработчик начала игры
    handleStartGame() {
        const playerName = this.ui.elements.playerName.value.trim() || 'Игрок';
        
        if (playerName.length === 0) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        // Начинаем новую игру
        const gameInfo = this.game.startNewGame(playerName);
        
        // Обновляем UI
        this.ui.updateGameInfo(this.game.getGameStats());
        this.ui.clearInputs();
        this.ui.showScreen('game');
        this.ui.focusGuessInput();
        this.ui.setGameControlsEnabled(true);

        console.log(`🎮 Начата новая игра для: ${playerName}`);
    }

    // Обработчик отправки попытки
    handleSubmitGuess() {
        const guessInput = this.ui.elements.guessInput;
        const guess = guessInput.value.trim();

        if (!guess) {
            alert('Пожалуйста, введите число');
            return;
        }

        try {
            // Делаем попытку угадать
            const attempt = this.game.makeGuess(guess);
            
            // Обновляем UI
            this.ui.updateGameInfo(this.game.getGameStats());
            this.ui.showFeedback(attempt);
            this.ui.updateAttemptsHistory(this.game.getAttemptsHistory());
            
            // Очищаем поле ввода
            guessInput.value = '';
            this.ui.focusGuessInput();

            // Если игра выиграна
            if (attempt.result === 'win') {
                this.ui.setGameControlsEnabled(false);
                setTimeout(() => {
                    this.ui.showWinScreen(this.game.secretNumber, attempt.attemptNumber);
                }, 1500);
            }

            // Если превышен лимит попыток
            if (attempt.gameOver) {
                this.ui.setGameControlsEnabled(false);
            }

        } catch (error) {
            alert(error.message);
            this.ui.focusGuessInput();
        }
    }

    // Обработчик новой игры
    handleNewGame() {
    this.game.resetGame();
    this.ui.updateAttemptsHistory([]); // Очищаем список попыток
    this.ui.elements.feedbackMessage.textContent = ''; // Очищаем сообщение
    this.ui.elements.feedbackMessage.className = 'feedback'; // Сбрасываем стили
    this.ui.showScreen('start');
    this.ui.clearInputs();
    this.ui.elements.playerName.value = 'Игрок'; // Сбрасываем имя только при новой игре
    this.ui.elements.playerName.focus();
    
    console.log('🔄 Игра сброшена, возврат к стартовому экрану');
    }

    // Обработчик показа статистики
    handleShowStats() {
        const gameHistory = this.game.getGameHistory();
        this.ui.showStats(gameHistory);
    }

    // Обработчик возврата к игре
    handleBackToGame() {
        this.ui.showScreen('game');
        this.ui.focusGuessInput();
    }


    // Обработчик "играть снова"
    handlePlayAgain() {
    const currentPlayer = this.game.playerName;
    
    // Начинаем новую игру с тем же игроком
    this.game.resetGame();
    this.game.startNewGame(currentPlayer);
    
    // Обновляем UI - очищаем историю попыток и сообщение
    this.ui.updateGameInfo(this.game.getGameStats());
    this.ui.updateAttemptsHistory([]); // Очищаем список попыток
    this.ui.elements.feedbackMessage.textContent = ''; // Очищаем сообщение
    this.ui.elements.feedbackMessage.className = 'feedback'; // Сбрасываем стили
    this.ui.clearInputs();
    this.ui.showScreen('game');
    this.ui.setGameControlsEnabled(true);
    this.ui.focusGuessInput();
    
    console.log(`🔄 Новая игра для: ${currentPlayer}`);
    }

    // Получить отладочную информацию
    getDebugInfo() {
        return {
            game: this.game.getGameStats(),
            secretNumber: this.game.getHint(),
            gameHistory: this.game.getGameHistory()
        };
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляр приложения
    window.app = new GuessNumberApp();
    
    // Добавляем глобальные функции для отладки
    window.getGameInfo = () => window.app.getDebugInfo();
    window.showHint = () => {
        const hint = window.app.game.getHint();
        console.log(`🔍 Подсказка: загаданное число ${hint}`);
        return hint;
    };
    
    console.log('✅ Приложение "Угадай число" успешно загружено!');
    console.log('💡 Для отладки используйте: getGameInfo() или showHint()');
});

// Добавляем обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('❌ Ошибка приложения:', event.error);
});

// Обработчик перед закрытием страницы
window.addEventListener('beforeunload', (event) => {
    if (window.app.game.isGameActive) {
        event.preventDefault();
        event.returnValue = 'У вас есть незавершенная игра. Вы уверены, что хотите уйти?';
        return event.returnValue;
    }
});