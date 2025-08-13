document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================================
    // ============================= I. CONSTANTS & DOM ELEMENTS =========================
    // ===================================================================================
    
    // --- Screens ---
    const screens = {
        mainMenu: document.getElementById('main-menu-screen'),
        category: document.getElementById('category-screen'),
        quiz: document.getElementById('quiz-screen'),
        end: document.getElementById('end-screen'),
        highScores: document.getElementById('high-scores-screen'),
        achievements: document.getElementById('achievements-screen'),
    };

    // --- Main Menu Elements ---
    const playerNameInput = document.getElementById('player-name');
    const avatarSelectionContainer = document.getElementById('avatar-selection');
    const playButton = document.getElementById('play-btn');

    // --- Settings ---
    const themeToggle = document.getElementById('theme-toggle');
    const soundToggle = document.getElementById('sound-toggle');

    // --- Navigation Buttons ---
    const navButtons = document.querySelectorAll('.nav-btn');

    // --- Category Screen ---
    const categoryButtonsContainer = document.getElementById('category-buttons');

    // --- Quiz HUD Elements ---
    const progressText = document.getElementById('progress-text');
    const progressBarFull = document.getElementById('progress-bar-full');
    const timerText = document.getElementById('timer-text');
    const scoreText = document.getElementById('score-text');
    const categoryTitleQuiz = document.getElementById('category-title-quiz');
    const questionElement = document.getElementById('question');
    const answerButtonsContainer = document.getElementById('answer-buttons');

    // --- Lifelines ---
    const lifeline5050Btn = document.getElementById('lifeline-5050');
    const lifelineSkipBtn = document.getElementById('lifeline-skip');
    const lifelineTimeBtn = document.getElementById('lifeline-time');

    // --- End Screen ---
    const finalScoreElement = document.getElementById('final-score');
    const accuracyElement = document.getElementById('accuracy');
    const avgTimeElement = document.getElementById('avg-time');
    const highScoreForm = document.getElementById('high-score-form');
    const saveScoreBtn = document.getElementById('save-score-btn');
    
    // --- High Scores Screen ---
    const highScoresList = document.getElementById('high-scores-list');
    const clearScoresBtn = document.getElementById('clear-scores-btn');

    // --- Achievements Screen & Toast ---
    const achievementsGrid = document.getElementById('achievements-grid');
    const achievementToastContainer = document.getElementById('achievement-toast-container');
    
    // --- Audio Elements ---
    const sounds = {
        click: document.getElementById('sound-click'),
        correct: document.getElementById('sound-correct'),
        wrong: document.getElementById('sound-wrong'),
        start: document.getElementById('sound-game-start'),
        end: document.getElementById('sound-game-end'),
        achievement: document.getElementById('sound-achievement'),
    };

    // ===================================================================================
    // ============================= II. GAME CONFIG & DATA ==============================
    // ===================================================================================

    const TIME_PER_QUESTION = 15;
    const POINTS_PER_CORRECT_ANSWER = 100;
    const TIME_BONUS_MULTIPLIER = 10;
    const MAX_HIGH_SCORES = 10;
    const QUESTION_COUNT = 10;

    const avatars = [
        { id: 'avatar1', url: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=player1' },
        { id: 'avatar2', url: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=player2' },
        { id: 'avatar3', url: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=player3' },
        { id: 'avatar4', url: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=player4' },
    ];
    
    const achievements = {
        firstGame: { id: 'firstGame', title: "Welcome, Puzzler!", desc: "Play your first game to completion.", icon: 'https://i.imgur.com/KQloL0a.png', toastClass: 'bigger-icon' },
        scienceNovice: { id: 'scienceNovice', title: "Lab Assistant", desc: "Complete a Science quiz.", icon: 'https://static.vecteezy.com/system/resources/previews/027/205/877/non_2x/isolated-simple-microscope-for-laboratory-in-pixel-art-free-png.png' },
        historyBuff: { id: 'historyBuff', title: "Time Traveler", desc: "Complete a History quiz.", icon: 'https://png.pngtree.com/png-clipart/20240508/original/pngtree-scroll-paper-in-pixel-art-style-png-image_15040538.png' },
        movieManic: { id: 'movieManic', title: "Film Critic", desc: "Complete a Movies quiz.", icon: 'https://i.imgur.com/MV0IpE4.png' },
        generalGenius: { id: 'generalGenius', title: "Jack of All Trades", desc: "Complete a General quiz.", icon: 'https://preview.redd.it/the-earth-original-size-16x16-pixels-v0-0nejy0dgpdq81.png?auto=webp&s=4391db252278d02f5fbc10e43fecb0487f9ad696' },
        perfectScore: { id: 'perfectScore', title: "Flawless Victory", desc: "Get a perfect score in any quiz.", icon: 'https://static.vecteezy.com/system/resources/thumbnails/027/517/684/small_2x/pixel-art-gold-number-100-icon-png.png' },
        speedDemon: { id: 'speedDemon', title: "Speed Demon", desc: "Finish a quiz with avg. time under 5s.", icon: 'https://png.pngtree.com/png-clipart/20250514/original/pngtree-minimalist-pixel-lightning-bolt-on-transparent-background-vector-png-image_20971493.png' },
        clutchPlayer: { id: 'clutchPlayer', title: "Clutch Player", desc: "Answer correctly with < 2s left.", icon: 'https://static.vecteezy.com/system/resources/previews/054/978/930/non_2x/game-hourglass-pixelated-free-png.png' },
        highScorer: { id: 'highScorer', title: "On The Board!", desc: "Make it onto the Hall of Fame.", icon: 'https://png.pngtree.com/png-vector/20240827/ourlarge/pngtree-pixel-art-trophies-vector-png-image_13598926.png' },
        marathoner: { id: 'marathoner', title: "Quiz Marathoner", desc: "Complete all four categories.", icon: 'https://static.vecteezy.com/system/resources/previews/055/855/475/non_2x/gold-medal-pixel-art-style-winner-medal-first-place-second-and-third-8-bit-sports-medal-png.png' }
    };
    
    const questions = {
        science: [
            { question: "What is the powerhouse of the cell?", answers: [{ text: "Mitochondria", correct: true }, { text: "Nucleus", correct: false }, { text: "Ribosome", correct: false }, { text: "Chloroplast", correct: false }] },
            { question: "What is the chemical symbol for gold?", answers: [{ text: "Au", correct: true }, { text: "Ag", correct: false }, { text: "Go", correct: false }, { text: "Gd", correct: false }] },
            { question: "How many planets are in our solar system?", answers: [{ text: "8", correct: true }, { text: "9", correct: false }, { text: "7", correct: false }, { text: "10", correct: false }] },
            { question: "What force pulls objects towards the center of the Earth?", answers: [{ text: "Gravity", correct: true }, { text: "Magnetism", correct: false }, { text: "Friction", correct: false }, { text: "Inertia", correct: false }] },
            { question: "What is the fastest land animal?", answers: [{ text: "Cheetah", correct: true }, { text: "Lion", correct: false }, { text: "Pronghorn", correct: false }, { text: "Gazelle", correct: false }] },
            { question: "What is the standard unit of measurement for energy?", answers: [{ text: "Joule", correct: true }, { text: "Watt", correct: false }, { text: "Newton", correct: false }, { text: "Pascal", correct: false }] },
            { question: "What type of galaxy is the Milky Way?", answers: [{ text: "Spiral", correct: true }, { text: "Elliptical", correct: false }, { text: "Irregular", correct: false }, { text: "Lenticular", correct: false }] },
            { question: "Which element has the atomic number 1?", answers: [{ text: "Hydrogen", correct: true }, { text: "Helium", correct: false }, { text: "Oxygen", correct: false }, { text: "Carbon", correct: false }] },
            { question: "What part of the plant conducts photosynthesis?", answers: [{ text: "Leaves", correct: true }, { text: "Roots", correct: false }, { text: "Stem", correct: false }, { text: "Flower", correct: false }] },
            { question: "What is the hardest known natural material?", answers: [{ text: "Diamond", correct: true }, { text: "Graphene", correct: false }, { text: "Quartz", correct: false }, { text: "Steel", correct: false }] }
        ],
        history: [
            { question: "Who was the first emperor of Rome?", answers: [{ text: "Augustus", correct: true }, { text: "Julius Caesar", correct: false }, { text: "Nero", correct: false }, { text: "Constantine", correct: false }] },
            { question: "In what year did World War II end?", answers: [{ text: "1945", correct: true }, { text: "1944", correct: false }, { text: "1939", correct: false }, { text: "1918", correct: false }] },
            { question: "The Renaissance began in which country?", answers: [{ text: "Italy", correct: true }, { text: "France", correct: false }, { text: "England", correct: false }, { text: "Spain", correct: false }] },
            { question: "Who invented the printing press?", answers: [{ text: "Johannes Gutenberg", correct: true }, { text: "Leonardo da Vinci", correct: false }, { text: "Isaac Newton", correct: false }, { text: "Galileo Galilei", correct: false }] },
            { question: "The ancient city of Babylon was located in modern-day...", answers: [{ text: "Iraq", correct: true }, { text: "Egypt", correct: false }, { text: "Greece", correct: false }, { text: "Iran", correct: false }] },
            { question: "Which civilization built the Machu Picchu complex?", answers: [{ text: "Inca", correct: true }, { text: "Aztec", correct: false }, { text: "Maya", correct: false }, { text: "Olmec", correct: false }] },
            { question: "The Magna Carta was signed in what year?", answers: [{ text: "1215", correct: true }, { text: "1066", correct: false }, { text: "1492", correct: false }, { text: "1776", correct: false }] },
            { question: "Who was the famous queen of ancient Egypt?", answers: [{ text: "Cleopatra", correct: true }, { text: "Nefertiti", correct: false }, { text: "Hatshepsut", correct: false }, { text: "Sobekneferu", correct: false }] },
            { question: "The Cold War was a standoff between the USA and which other superpower?", answers: [{ text: "Soviet Union", correct: true }, { text: "China", correct: false }, { text: "Germany", correct: false }, { text: "Japan", correct: false }] },
            { question: "Who wrote 'The Communist Manifesto'?", answers: [{ text: "Karl Marx & Friedrich Engels", correct: true }, { text: "Vladimir Lenin", correct: false }, { text: "Adam Smith", correct: false }, { text: "Joseph Stalin", correct: false }] }
        ],
        movies: [
            { question: "Which movie won the first-ever Academy Award for Best Picture?", answers: [{ text: "Wings", correct: true }, { text: "The Jazz Singer", correct: false }, { text: "Metropolis", correct: false }, { text: "Sunrise", correct: false }] },
            { question: "Who directed the 'Lord of the Rings' trilogy?", answers: [{ text: "Peter Jackson", correct: true }, { text: "George Lucas", correct: false }, { text: "James Cameron", correct: false }, { text: "Steven Spielberg", correct: false }] },
            { question: "What is the highest-grossing film of all time (unadjusted for inflation)?", answers: [{ text: "Avatar", correct: true }, { text: "Avengers: Endgame", correct: false }, { text: "Titanic", correct: false }, { text: "Star Wars: The Force Awakens", correct:false }] },
            { question: "In 'The Matrix', what color pill does Neo take?", answers: [{ text: "Red", correct: true }, { text: "Blue", correct: false }, { text: "Green", correct: false }, { text: "Yellow", correct: false }] },
            { question: "What is the name of the fictional African country in 'Black Panther'?", answers: [{ text: "Wakanda", correct: true }, { text: "Genovia", correct: false }, { text: "Sokovia", correct: false }, { text: "Zamunda", correct: false }] },
            { question: "Who played the Joker in the 2008 film 'The Dark Knight'?", answers: [{ text: "Heath Ledger", correct: true }, { text: "Jack Nicholson", correct: false }, { text: "Joaquin Phoenix", correct: false }, { text: "Jared Leto", correct: false }] },
            { question: "What does 'Hakuna Matata' mean?", answers: [{ text: "No worries", correct: true }, { text: "Hello friend", correct: false }, { text: "Circle of life", correct: false }, { text: "My son", correct: false }] },
            { question: "Which Quentin Tarantino film is split into non-chronological chapters?", answers: [{ text: "Pulp Fiction", correct: true }, { text: "Reservoir Dogs", correct: false }, { text: "Kill Bill: Volume 1", correct: false }, { text: "Inglourious Basterds", correct: false }] },
            { question: "What is the name of the car in 'Back to the Future'?", answers: [{ text: "DeLorean", correct: true }, { text: "Ferrari", correct: false }, { text: "Batmobile", correct: false }, { text: "Corvette", correct: false }] },
            { question: "In 'Forrest Gump', life is like a box of...", answers: [{ text: "Chocolates", correct: true }, { text: "Kittens", correct: false }, { text: "Rocks", correct: false }, { text: "Surprises", correct: false }] }
        ],
        general: [
            { question: "What is the capital of Australia?", answers: [{ text: "Canberra", correct: true }, { text: "Sydney", correct: false }, { text: "Melbourne", correct: false }, { text: "Perth", correct: false }] },
            { question: "How many strings does a standard violin have?", answers: [{ text: "4", correct: true }, { text: "5", correct: false }, { text: "6", correct: false }, { text: "7", correct: false }] },
            { question: "Which artist painted the Mona Lisa?", answers: [{ text: "Leonardo da Vinci", correct: true }, { text: "Vincent van Gogh", correct: false }, { text: "Pablo Picasso", correct: false }, { text: "Michelangelo", correct: false }] },
            { question: "What is the smallest country in the world?", answers: [{ text: "Vatican City", correct: true }, { text: "Monaco", correct: false }, { text: "Nauru", correct: false }, { text: "San Marino", correct: false }] },
            { question: "What is the main ingredient in guacamole?", answers: [{ text: "Avocado", correct:true }, { text: "Tomato", correct: false }, { text: "Onion", correct: false }, { text: "Lime", correct: false }] },
            { question: "How many dots appear on a pair of dice?", answers: [{ text: "42", correct: true }, { text: "21", correct: false }, { text: "36", correct: false }, { text: "50", correct: false }] },
            { question: "Which is the only vowel on a standard keyboard that is not on the top row of letters?", answers: [{ text: "A", correct: true }, { text: "E", correct: false }, { text: "I", correct: false }, { text: "O", correct: false }] },
            { question: "What is the national animal of Scotland?", answers: [{ text: "Unicorn", correct: true }, { text: "Lion", correct: false }, { text: "Eagle", correct: false }, { text: "Bear", correct: false }] },
            { question: "Which planet is closest to the sun?", answers: [{ text: "Mercury", correct: true }, { text: "Venus", correct: false }, { text: "Earth", correct: false }, { text: "Mars", correct: false }] },
            { question: "In which sport would you perform a 'slam dunk'?", answers: [{ text: "Basketball", correct: true }, { text: "Volleyball", correct: false }, { text: "Tennis", correct: false }, { text: "American Football", correct: false }] }
        ]
    };
    
    // ===================================================================================
    // ============================= III. STATE VARIABLES ================================
    // ===================================================================================

    let playerData = {};
    let currentCategory = '';
    let score = 0;
    let shuffledQuestions, currentQuestionIndex;
    let timerInterval;
    let timeLeft = TIME_PER_QUESTION;
    let isSoundEnabled = true;
    let lifelines = {};
    let correctAnswers = 0;
    let totalTimeTaken = 0;
    let answeredQuestionsCount = 0;
    let clutchAnswer = false;
    let achievementQueue = [];
    let isToastVisible = false;

    // ===================================================================================
    // ============================= IV. INITIALIZATION ==================================
    // ===================================================================================

    function init() {
        loadPlayerData();
        setupTheme();
        setupSound();
        populateCategories();
        populateAvatars();
        setupPlayerInfo();
        setupEventListeners();
        showScreen('mainMenu');
    }

    function loadPlayerData() {
        const savedData = JSON.parse(localStorage.getItem('pixelPuzzlerPRO'));
        playerData = savedData || {
            name: '',
            avatar: avatars[0].url,
            highScores: [],
            achievements: {},
            stats: { gamesPlayed: 0, categoriesCompleted: {} }
        };
    }

    function savePlayerData() {
        localStorage.setItem('pixelPuzzlerPRO', JSON.stringify(playerData));
    }
    
    function setupTheme() {
        const savedTheme = localStorage.getItem('pixelPuzzlerTheme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
    }

    function setupSound() {
        isSoundEnabled = soundToggle.checked;
    }

    function populateCategories() {
        categoryButtonsContainer.innerHTML = '';
        for (const category in questions) {
            const button = document.createElement('button');
            button.innerText = category.charAt(0).toUpperCase() + category.slice(1);
            button.classList.add('btn');
            button.dataset.category = category;
            categoryButtonsContainer.appendChild(button);
        }
    }
    
    function populateAvatars() {
        avatarSelectionContainer.innerHTML = '';
        avatars.forEach((avatar) => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'avatar';
            input.value = avatar.url;
            if (avatar.url === playerData.avatar) {
                input.checked = true;
            }
            const img = document.createElement('img');
            img.src = avatar.url;
            img.alt = `Pixel Avatar`;
            label.appendChild(input);
            label.appendChild(img);
            avatarSelectionContainer.appendChild(label);
        });
    }

    function setupPlayerInfo() {
        playerNameInput.value = playerData.name || '';
    }
    
    // ===================================================================================
    // ============================= V. CORE GAME FLOW ===================================
    // ===================================================================================

    function startGame(category) {
        playSound('start');
        currentCategory = category;
        score = 0;
        correctAnswers = 0;
        totalTimeTaken = 0;
        answeredQuestionsCount = 0;
        clutchAnswer = false;

        scoreText.innerText = `Score: ${score}`;
        categoryTitleQuiz.innerText = `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        
        shuffledQuestions = [...questions[category]].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT);
        currentQuestionIndex = 0;
        
        resetLifelines();
        showScreen('quiz');
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < shuffledQuestions.length) {
            updateProgressBar();
            showQuestion(shuffledQuestions[currentQuestionIndex]);
            startTimer();
        } else {
            endGame();
        }
    }

    function showQuestion(questionData) {
        questionElement.innerText = questionData.question;
        answerButtonsContainer.innerHTML = '';

        // *** FIX: Randomize the order of answers before displaying them ***
        const shuffledAnswers = [...questionData.answers].sort(() => Math.random() - 0.5);

        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) button.dataset.correct = true;
            answerButtonsContainer.appendChild(button);
        });
        
        answerButtonsContainer.addEventListener('click', selectAnswer, { once: true });
    }
    
    function selectAnswer(e) {
        if (!e.target.matches('.btn')) return;
        
        stopTimer();
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';
        
        const timeTaken = TIME_PER_QUESTION - timeLeft;
        totalTimeTaken += timeTaken;
        answeredQuestionsCount++;
        
        if(isCorrect) {
            playSound('correct');
            correctAnswers++;
            const timeBonus = Math.max(0, timeLeft * TIME_BONUS_MULTIPLIER);
            score += POINTS_PER_CORRECT_ANSWER + timeBonus;
            scoreText.innerText = `Score: ${score}`;
            if (timeLeft < 2) clutchAnswer = true;
        } else {
            playSound('wrong');
        }

        Array.from(answerButtonsContainer.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });

        currentQuestionIndex++;
        setTimeout(setNextQuestion, 2000); 
    }

    function endGame() {
        playSound('end');
        showScreen('end');
        
        const accuracy = shuffledQuestions.length > 0 ? (correctAnswers / shuffledQuestions.length) * 100 : 0;
        const avgTime = answeredQuestionsCount > 0 ? (totalTimeTaken / answeredQuestionsCount).toFixed(2) : 0;
        finalScoreElement.innerText = score;
        accuracyElement.innerText = `${accuracy.toFixed(0)}%`;
        avgTimeElement.innerText = `${avgTime}s`;
        
        playerData.stats.gamesPlayed = (playerData.stats.gamesPlayed || 0) + 1;
        if (accuracy === 100) { // Only count perfect games as "completed" for the marathon
             if (!playerData.stats.categoriesCompleted[currentCategory]) {
                playerData.stats.categoriesCompleted[currentCategory] = true;
            }
        }
        
        checkAchievements(accuracy, avgTime);
        checkHighScore();
        savePlayerData();
    }

    // ===================================================================================
    // ============================= VI. HELPER & UI FUNCTIONS ===========================
    // ===================================================================================

    function showScreen(screenId) {
        for (const id in screens) {
            screens[id].classList.add('hide');
        }
        // If the screenId exists in our screens object, show it. This prevents errors.
        if(screens[screenId]) {
            screens[screenId].classList.remove('hide');
        } else {
            console.error(`Screen with ID "${screenId}" not found.`);
            screens.mainMenu.classList.remove('hide'); // Default to main menu on error
        }
    }

    function resetState() {
        timeLeft = TIME_PER_QUESTION;
        timerText.innerText = timeLeft;
        timerText.classList.remove('low-time');
        answerButtonsContainer.removeEventListener('click', selectAnswer, { once: true }); 
    }

    function updateProgressBar() {
        const progressPercent = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
        progressBarFull.style.width = `${progressPercent}%`;
        progressText.innerText = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    }

    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }
    
    // ===================================================================================
    // ============================= VII. TIMER LOGIC ====================================
    // ===================================================================================

    function startTimer() {
        timeLeft = TIME_PER_QUESTION;
        timerText.innerText = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerText.innerText = timeLeft;
            if (timeLeft <= 5) {
                timerText.classList.add('low-time');
            }
            if (timeLeft <= 0) {
                stopTimer();
                handleTimeOut();
            }
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
    }

    function handleTimeOut() {
        playSound('wrong');
        totalTimeTaken += TIME_PER_QUESTION;
        answeredQuestionsCount++;
        
        Array.from(answerButtonsContainer.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });

        currentQuestionIndex++;
        setTimeout(setNextQuestion, 2000);
    }
    
    // ===================================================================================
    // ============================= VIII. LIFELINE LOGIC ================================
    // ===================================================================================
    
    function resetLifelines() {
        lifelines = { fiftyFifty: 1, skip: 1, time: 1 };
        updateLifelineUI();
        [lifeline5050Btn, lifelineSkipBtn, lifelineTimeBtn].forEach(btn => btn.disabled = false);
    }

    function updateLifelineUI() {
        lifeline5050Btn.querySelector('.lifeline-uses').innerText = `(${lifelines.fiftyFifty})`;
        lifelineSkipBtn.querySelector('.lifeline-uses').innerText = `(${lifelines.skip})`;
        lifelineTimeBtn.querySelector('.lifeline-uses').innerText = `(${lifelines.time})`;
    }

    function useFiftyFifty() {
        if (lifelines.fiftyFifty > 0) {
            playSound('click');
            const incorrectAnswers = Array.from(answerButtonsContainer.children).filter(button => !button.dataset.correct);
            for (let i = 0; i < 2 && incorrectAnswers.length > 1; i++) {
                const randomButton = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
                randomButton.style.visibility = 'hidden';
                incorrectAnswers.splice(incorrectAnswers.indexOf(randomButton), 1);
            }
            lifelines.fiftyFifty--;
            lifeline5050Btn.disabled = true;
            updateLifelineUI();
        }
    }

    function useSkip() {
        if (lifelines.skip > 0) {
            playSound('click');
            stopTimer();
            lifelines.skip--;
            lifelineSkipBtn.disabled = true;
            updateLifelineUI();
            currentQuestionIndex++;
            setNextQuestion();
        }
    }
    
    function useAddTime() {
        if (lifelines.time > 0) {
            playSound('click');
            timeLeft += 5;
            timerText.innerText = timeLeft;
            lifelines.time--;
            lifelineTimeBtn.disabled = true;
            updateLifelineUI();
        }
    }

    // ===================================================================================
    // ========================== IX. HIGH SCORE & ACHIEVEMENT LOGIC =====================
    // ===================================================================================
    
    function checkHighScore() {
        const lowestHighScore = playerData.highScores.length < MAX_HIGH_SCORES ? -1 : playerData.highScores[playerData.highScores.length - 1].score;
        if (score > lowestHighScore) {
            highScoreForm.classList.remove('hide');
        } else {
            highScoreForm.classList.add('hide');
        }
    }

    function saveHighScore() {
        const newScore = { name: playerData.name, avatar: playerData.avatar, score: score };
        playerData.highScores.push(newScore);
        playerData.highScores.sort((a,b) => b.score - a.score);
        playerData.highScores.splice(MAX_HIGH_SCORES);
        unlockAchievement('highScorer');
        savePlayerData();
        highScoreForm.classList.add('hide');
    }

    function displayHighScores() {
        highScoresList.innerHTML = playerData.highScores.map((entry, index) => `
            <li>
                <span class="rank">${index + 1}</span>
                <span class="avatar"><img src="${entry.avatar}" alt="Avatar"></span>
                <span class="name">${entry.name}</span>
                <span class="score">${entry.score}</span>
            </li>
        `).join('');
    }

    function clearHighScores() {
        if (confirm("Are you sure you want to clear all high scores? This cannot be undone.")) {
            playerData.highScores = [];
            savePlayerData();
            displayHighScores();
        }
    }

    function checkAchievements(accuracy, avgTime) {
        if (!playerData.achievements.firstGame) unlockAchievement('firstGame');
        if (accuracy === 100) unlockAchievement('perfectScore');
        if (avgTime < 5 && answeredQuestionsCount === QUESTION_COUNT) unlockAchievement('speedDemon');
        if (clutchAnswer) unlockAchievement('clutchPlayer');
        
        switch(currentCategory) {
            case 'science': unlockAchievement('scienceNovice'); break;
            case 'history': unlockAchievement('historyBuff'); break;
            case 'movies': unlockAchievement('movieManic'); break;
            case 'general': unlockAchievement('generalGenius'); break;
        }
        
        if (Object.keys(playerData.stats.categoriesCompleted).length >= Object.keys(questions).length) {
            unlockAchievement('marathoner');
        }
    }
    
    function unlockAchievement(id) {
        if (!playerData.achievements[id]) {
            playerData.achievements[id] = true;
            achievementQueue.push(achievements[id]);
            processAchievementQueue();
        }
    }

    function processAchievementQueue() {
        if (isToastVisible || achievementQueue.length === 0) return;
        
        isToastVisible = true;
        const achievement = achievementQueue.shift();
        displayToast(achievement);
    }
    
    function displayToast(achievement) {
        playSound('achievement');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        
        const toastIconClass = achievement.toastClass ? `toast-icon ${achievement.toastClass}` : 'toast-icon';
        toast.innerHTML = `
            <div class="${toastIconClass}"><img src="${achievement.icon}" alt="Achievement Icon"></div>
            <div class="toast-content">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.title}</p>
            </div>
        `;
        achievementToastContainer.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
                isToastVisible = false;
                processAchievementQueue();
            });
        }, 4000); 
    }

    function displayAchievements() {
        achievementsGrid.innerHTML = Object.values(achievements).map(ach => {
            const isUnlocked = playerData.achievements[ach.id];
            return `
                <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon">
                        ${isUnlocked ? `<img src="${ach.icon}" alt="${ach.title}">` : '❔'}
                    </div>
                    <div class="badge-info">
                        <h3 class="badge-title">${isUnlocked ? ach.title : '???'}</h3>
                        <p class="badge-desc">${isUnlocked ? ach.desc : 'Keep playing to unlock this secret achievement.'}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===================================================================================
    // ========================== X. SETTINGS & AUDIO ====================================
    // ===================================================================================

    function playSound(soundId) {
        if (isSoundEnabled && sounds[soundId]) {
            sounds[soundId].currentTime = 0;
            sounds[soundId].play().catch(e => console.error("Audio play failed:", e));
        }
    }
    
    // ===================================================================================
    // ========================== XI. EVENT LISTENERS ====================================
    // ===================================================================================

    function setupEventListeners() {
        // *** FIX: Robust navigation logic to handle all nav buttons ***
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                playSound('click');
                const targetKebab = e.currentTarget.dataset.nav; // e.g., "main-menu"
                // Convert kebab-case to camelCase (e.g., "main-menu" -> "mainMenu") to match the screens object keys
                const targetCamel = targetKebab.replace(/-(\w)/g, (_, c) => c.toUpperCase());
                
                // Pre-navigation tasks
                if (targetCamel === 'highScores') displayHighScores();
                if (targetCamel === 'achievements') displayAchievements();
                
                showScreen(targetCamel);
            });
        });

        playButton.addEventListener('click', () => {
            playSound('click');
            playerData.name = playerNameInput.value.trim() || 'PLAYER ONE';
            const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
            playerData.avatar = selectedAvatar ? selectedAvatar.value : avatars[0].url;
            savePlayerData();
            showScreen('category');
        });
        
        categoryButtonsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.btn[data-category]')) {
                startGame(e.target.dataset.category);
            }
        });

        lifeline5050Btn.addEventListener('click', useFiftyFifty);
        lifelineSkipBtn.addEventListener('click', useSkip);
        lifelineTimeBtn.addEventListener('click', useAddTime);
        
        saveScoreBtn.addEventListener('click', () => {
            playSound('click');
            saveHighScore();
        });
        clearScoresBtn.addEventListener('click', () => {
            playSound('wrong');
            clearHighScores();
        });
        
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('pixelPuzzlerTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        
        soundToggle.addEventListener('change', () => {
            isSoundEnabled = soundToggle.checked;
        });
    }

    // ===================================================================================
    // ========================== XII. LET THE GAMES BEGIN ===============================
    // ===================================================================================
    
    init();

});
