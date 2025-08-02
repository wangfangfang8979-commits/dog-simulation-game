console.log("JS is working");

class DogSimulationGame {
    constructor() {
        // Initialize Supabase client
        this.supabaseUrl = 'https://ihaeqgszndvwjwarpdrd.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYWVxZ3N6bmR2d2p3YXJwZHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDIxMTIsImV4cCI6MjA2OTY3ODExMn0.w2N9Pk5fDQAjHlbMWz-t057wl5YTaX_TDVbpyXshgdY';
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        
        this.gameState = {
            player: {
                name: '',
                lifestyle: '',
                income: '',
                livingSituation: '',
                happiness: 100,
                money: 5000,
                time: 100,
                day: 1
            },
            dog: {
                energy: 100,
                happiness: 100,
                health: 100,
                age: 0,
                training: 0,
                obedience: 0
            },
            statistics: {
                totalSpent: 0,
                vetVisits: 0,
                walks: 0,
                trainingSessions: 0,
                groomingSessions: 0,
                accidents: 0,
                socialEvents: 0
            },
            events: [],
            currentEvent: null
        };

        this.events = [
            {
                id: 'puppy_arrival',
                title: 'Puppy Arrival',
                description: 'Your new puppy has arrived! They\'re excited but nervous in their new home.',
                choices: [
                    {
                        text: 'Give them space to explore',
                        effects: { dogHappiness: 10, dogEnergy: -5, time: -10 }
                    },
                    {
                        text: 'Immediately start training',
                        effects: { dogHappiness: -5, dogEnergy: -15, training: 10, time: -20 }
                    },
                    {
                        text: 'Take them for a walk',
                        effects: { dogHappiness: 15, dogEnergy: -10, time: -15, walks: 1 }
                    }
                ]
            },
            {
                id: 'first_night',
                title: 'First Night',
                description: 'It\'s your puppy\'s first night. They\'re crying and whining.',
                choices: [
                    {
                        text: 'Let them sleep in your room',
                        effects: { dogHappiness: 15, playerHappiness: -5, time: -5 }
                    },
                    {
                        text: 'Keep them in their crate',
                        effects: { dogHappiness: -10, training: 5, obedience: 5 }
                    },
                    {
                        text: 'Stay with them until they sleep',
                        effects: { dogHappiness: 10, time: -20, playerHappiness: -10 }
                    }
                ]
            },
            {
                id: 'house_training',
                title: 'House Training Accident',
                description: 'Your puppy had an accident on the carpet.',
                choices: [
                    {
                        text: 'Clean it up and continue training',
                        effects: { money: -50, time: -10, training: 5, accidents: 1 }
                    },
                    {
                        text: 'Get angry and scold them',
                        effects: { dogHappiness: -20, training: -5, playerHappiness: -10 }
                    },
                    {
                        text: 'Take them outside immediately',
                        effects: { dogHappiness: 5, time: -15, training: 10 }
                    }
                ]
            },
            {
                id: 'vet_emergency',
                title: 'Vet Emergency',
                description: 'Your dog ate something they shouldn\'t have and needs emergency care.',
                choices: [
                    {
                        text: 'Take them to the emergency vet',
                        effects: { money: -500, dogHealth: 20, vetVisits: 1, time: -30 }
                    },
                    {
                        text: 'Wait and see if they get better',
                        effects: { dogHealth: -30, money: -100, playerHappiness: -20 }
                    },
                    {
                        text: 'Call the vet for advice',
                        effects: { money: -50, time: -10, dogHealth: 5 }
                    }
                ]
            },
            {
                id: 'social_event',
                title: 'Social Event Invitation',
                description: 'You\'ve been invited to a party, but you have your dog to consider.',
                choices: [
                    {
                        text: 'Bring your dog along',
                        effects: { dogHappiness: 10, socialEvents: 1, time: -20, playerHappiness: 5 }
                    },
                    {
                        text: 'Find a pet sitter',
                        effects: { money: -100, time: -10, playerHappiness: 10, socialEvents: 1 }
                    },
                    {
                        text: 'Stay home with your dog',
                        effects: { dogHappiness: 15, playerHappiness: -5, time: -5 }
                    }
                ]
            },
            {
                id: 'training_opportunity',
                title: 'Training Opportunity',
                description: 'A professional dog trainer is offering classes in your area.',
                choices: [
                    {
                        text: 'Enroll in training classes',
                        effects: { money: -200, training: 20, obedience: 15, time: -30 }
                    },
                    {
                        text: 'Train at home with online resources',
                        effects: { training: 10, obedience: 5, time: -20 }
                    },
                    {
                        text: 'Skip training for now',
                        effects: { dogHappiness: -5, obedience: -5 }
                    }
                ]
            },
            {
                id: 'work_schedule',
                title: 'Work Schedule Change',
                description: 'Your work schedule has changed, requiring longer hours.',
                choices: [
                    {
                        text: 'Hire a dog walker',
                        effects: { money: -300, dogHappiness: 10, time: 10, playerHappiness: 5 }
                    },
                    {
                        text: 'Leave the dog alone longer',
                        effects: { dogHappiness: -20, dogEnergy: 10, accidents: 2, playerHappiness: -10 }
                    },
                    {
                        text: 'Adjust your schedule to work from home',
                        effects: { playerHappiness: -15, dogHappiness: 15, time: -10 }
                    }
                ]
            },
            {
                id: 'grooming_decision',
                title: 'Grooming Decision',
                description: 'Your dog needs grooming, but you\'re not sure about the cost.',
                choices: [
                    {
                        text: 'Professional grooming',
                        effects: { money: -150, dogHappiness: 10, groomingSessions: 1, time: -10 }
                    },
                    {
                        text: 'Groom at home',
                        effects: { dogHappiness: 5, time: -30, groomingSessions: 1 }
                    },
                    {
                        text: 'Skip grooming this time',
                        effects: { dogHappiness: -10, dogHealth: -5 }
                    }
                ]
            },
            {
                id: 'vacation_planning',
                title: 'Vacation Planning',
                description: 'You want to take a vacation, but need to consider your dog.',
                choices: [
                    {
                        text: 'Board the dog at a kennel',
                        effects: { money: -400, dogHappiness: -10, playerHappiness: 15 }
                    },
                    {
                        text: 'Find a pet-friendly vacation',
                        effects: { money: -200, dogHappiness: 15, playerHappiness: 10, time: -10 }
                    },
                    {
                        text: 'Stay home this year',
                        effects: { playerHappiness: -20, dogHappiness: 10 }
                    }
                ]
            },
            {
                id: 'behavior_issue',
                title: 'Behavior Issue',
                description: 'Your dog has developed a barking problem that\'s bothering neighbors.',
                choices: [
                    {
                        text: 'Hire a behaviorist',
                        effects: { money: -300, training: 15, obedience: 20, time: -20 }
                    },
                    {
                        text: 'Try training at home',
                        effects: { training: 10, obedience: 10, time: -30, playerHappiness: -5 }
                    },
                    {
                        text: 'Ignore the problem',
                        effects: { dogHappiness: -15, playerHappiness: -10, obedience: -10 }
                    }
                ]
            }
        ];

        this.actionCosts = {
            walk: { time: -15, money: 0, dogEnergy: -20, dogHappiness: 15, walks: 1 },
            feed: { time: -5, money: -10, dogEnergy: 20, dogHappiness: 5 },
            play: { time: -20, money: 0, dogEnergy: -15, dogHappiness: 20 },
            train: { time: -25, money: 0, training: 10, obedience: 5, trainingSessions: 1 },
            vet: { time: -30, money: -200, dogHealth: 30, vetVisits: 1 },
            groom: { time: -20, money: -50, dogHappiness: 10, groomingSessions: 1 }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('welcome-screen');
        this.checkForSavedGame();
    }

    // Supabase methods
    async saveGameProgress() {
        try {
            const { data, error } = await this.supabase
                .from('game_saves')
                .upsert([{
                    player_name: this.gameState.player.name,
                    game_data: this.gameState,
                    created_at: new Date().toISOString()
                }], {
                    onConflict: 'player_name'
                });

            if (error) {
                console.error('Error saving game:', error);
                return false;
            }
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    async loadGameProgress(playerName) {
        try {
            const { data, error } = await this.supabase
                .from('game_saves')
                .select('*')
                .eq('player_name', playerName)
                .single();

            if (error) {
                console.error('Error loading game:', error);
                return false;
            }

            if (data) {
                this.gameState = data.game_data;
                this.updateUI();
                this.showScreen('game-screen');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    }

    async saveGameResults() {
        try {
            const { data, error } = await this.supabase
                .from('game_results')
                .insert([{
                    player_name: this.gameState.player.name,
                    player_lifestyle: this.gameState.player.lifestyle,
                    player_income: this.gameState.player.income,
                    living_situation: this.gameState.player.livingSituation,
                    final_dog_happiness: this.gameState.dog.happiness,
                    final_player_happiness: this.gameState.player.happiness,
                    total_spent: this.gameState.statistics.totalSpent,
                    total_days: this.gameState.player.day,
                    vet_visits: this.gameState.statistics.vetVisits,
                    walks: this.gameState.statistics.walks,
                    training_sessions: this.gameState.statistics.trainingSessions,
                    grooming_sessions: this.gameState.statistics.groomingSessions,
                    accidents: this.gameState.statistics.accidents,
                    social_events: this.gameState.statistics.socialEvents,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                console.error('Error saving results:', error);
                return false;
            }
            console.log('Results saved successfully');

            // Also save a simple score
            const score = Math.round((this.gameState.dog.happiness + this.gameState.player.happiness) / 2);
            await this.saveScore(this.gameState.player.name, score);

            return true;
        } catch (error) {
            console.error('Error saving results:', error);
            return false;
        }
    }

    async getLeaderboard() {
        try {
            const { data, error } = await this.supabase
                .from('players')
                .select('*')
                .order('score', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error loading leaderboard:', error);
                return [];
            }
            console.log('Leaderboard:', data);
            return data || [];
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            return [];
        }
    }

    async checkForSavedGame() {
        // Check if there's a saved game in localStorage
        const savedPlayerName = localStorage.getItem('dogGamePlayerName');
        if (savedPlayerName) {
            const hasLoaded = await this.loadGameProgress(savedPlayerName);
            if (hasLoaded) {
                this.showScreen('game-screen');
            }
        }
    }

    // Simple score saving function
    async saveScore(playerName, score) {
        try {
            const { data, error } = await this.supabase
                .from('players')
                .insert([{ name: playerName, score }]);
            
            if (error) {
                console.error('Error saving score:', error);
                return false;
            } else {
                console.log('Score saved:', data);
                return true;
            }
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
        }
    }

    // Get top scores
    async getTopScores(limit = 10) {
        try {
            const { data, error } = await this.supabase
                .from('players')
                .select('*')
                .order('score', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error loading scores:', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.error('Error loading scores:', error);
            return [];
        }
    }

    // Simple leaderboard function (like your example)
    async getLeaderboardSimple() {
        const { data } = await this.supabase
            .from('players')
            .select('*')
            .order('score', { ascending: false });
        console.log('Leaderboard:', data);
        return data;
    }

    purchasePortrait() {
        // Show payment modal
        const modal = document.getElementById('payment-modal');
        modal.style.display = 'block';
    }

    processPayment() {
        // Get payment form data
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;

        // Basic validation
        if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all payment fields.');
            return;
        }

        // Simulate payment processing
        alert('Payment processed successfully! Your dog portrait will be generated.');
        
        // Hide modal
        document.getElementById('payment-modal').style.display = 'none';
        
        // Generate and display dog portrait
        this.generateDogPortrait();
    }

    generateDogPortrait() {
        // Hide placeholder and show canvas
        document.getElementById('dog-image-placeholder').style.display = 'none';
        const canvas = document.getElementById('dog-image-canvas');
        canvas.style.display = 'block';
        
        // Generate a simple dog portrait based on game data
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;
        
        // Draw a simple dog portrait
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(100, 150, 100, 80); // Body
        ctx.fillStyle = '#654321';
        ctx.fillRect(110, 120, 80, 40); // Head
        ctx.fillStyle = '#000';
        ctx.fillRect(125, 135, 5, 5); // Left eye
        ctx.fillRect(170, 135, 5, 5); // Right eye
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(140, 150, 20, 10); // Nose
        
        // Add text
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(`${this.gameState.player.name}'s Dog`, 80, 280);
    }

    bindEvents() {
        // Welcome screen
        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('character-creation');
        });

        // Next to dog creation
        document.getElementById('next-to-dog').addEventListener('click', () => {
            this.showScreen('dog-creation');
        });

        // Character creation
        document.getElementById('create-character').addEventListener('click', async () => {
            await this.createCharacter();
        });

        // Game actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const action = e.currentTarget.dataset.action;
                await this.performAction(action);
            });
        });

        // Restart game
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });

        // Purchase portrait
        document.getElementById('purchase-image').addEventListener('click', () => {
            this.purchasePortrait();
        });

        // Payment modal close button
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('payment-modal').style.display = 'none';
        });

        // Process payment button
        document.getElementById('process-payment').addEventListener('click', () => {
            this.processPayment();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    async createCharacter() {
        const name = document.getElementById('player-name').value.trim();
        const lifestyle = document.getElementById('lifestyle').value;
        const income = document.getElementById('income').value;
        const livingSituation = document.getElementById('living-situation').value;

        if (!name) {
            alert('Please enter your name!');
            return;
        }

        // Check if there's already a saved game for this player
        const hasExistingGame = await this.loadGameProgress(name);
        if (hasExistingGame) {
            alert('Welcome back! Your previous game has been loaded.');
            return;
        }

        this.gameState.player.name = name;
        this.gameState.player.lifestyle = lifestyle;
        this.gameState.player.income = income;
        this.gameState.player.livingSituation = livingSituation;

        // Adjust starting stats based on lifestyle
        this.adjustStartingStats();

        // Save player name to localStorage
        localStorage.setItem('dogGamePlayerName', name);

        this.showScreen('game-screen');
        this.updateUI();
        this.startGame();
    }

    adjustStartingStats() {
        const lifestyle = this.gameState.player.lifestyle;
        const income = this.gameState.player.income;

        // Adjust money based on income
        switch (income) {
            case 'low':
                this.gameState.player.money = 2000;
                break;
            case 'medium':
                this.gameState.player.money = 5000;
                break;
            case 'high':
                this.gameState.player.money = 8000;
                break;
            case 'very-high':
                this.gameState.player.money = 12000;
                break;
        }

        // Adjust time based on lifestyle
        switch (lifestyle) {
            case 'busy':
                this.gameState.player.time = 60;
                break;
            case 'moderate':
                this.gameState.player.time = 100;
                break;
            case 'flexible':
                this.gameState.player.time = 120;
                break;
            case 'student':
                this.gameState.player.time = 80;
                break;
        }
    }

    startGame() {
        this.triggerRandomEvent();
        this.startDailyCycle();
    }

    triggerRandomEvent() {
        if (this.gameState.events.length >= this.events.length) {
            this.endGame();
            return;
        }

        const availableEvents = this.events.filter(event => 
            !this.gameState.events.includes(event.id)
        );

        if (availableEvents.length === 0) {
            this.endGame();
            return;
        }

        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.gameState.currentEvent = randomEvent;
        this.gameState.events.push(randomEvent.id);

        this.displayEvent(randomEvent);
    }

    displayEvent(event) {
        document.getElementById('event-description').textContent = event.description;
        
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';

        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.makeChoice(choice.effects);
            });
            choicesContainer.appendChild(button);
        });
    }

    makeChoice(effects) {
        this.applyEffects(effects);
        this.updateUI();
        
        // Clear event
        document.getElementById('event-description').textContent = 'You made your choice. The day continues...';
        document.getElementById('choices').innerHTML = '';
        
        setTimeout(() => {
            this.triggerRandomEvent();
        }, 2000);
    }

    async performAction(action) {
        if (action === 'save') {
            const success = await this.saveGameProgress();
            if (success) {
                alert('Game saved successfully!');
            } else {
                alert('Failed to save game. Please try again.');
            }
            return;
        }

        const costs = this.actionCosts[action];
        if (!costs) return;

        // Check if player has enough resources
        if (this.gameState.player.time + costs.time < 0) {
            alert('Not enough time for this action!');
            return;
        }

        if (this.gameState.player.money + costs.money < 0) {
            alert('Not enough money for this action!');
            return;
        }

        this.applyEffects(costs);
        this.updateUI();
    }

    applyEffects(effects) {
        Object.keys(effects).forEach(key => {
            const value = effects[key];
            
            if (key.startsWith('dog')) {
                const dogKey = key.replace('dog', '').toLowerCase();
                this.gameState.dog[dogKey] = Math.max(0, Math.min(100, this.gameState.dog[dogKey] + value));
            } else if (key.startsWith('player')) {
                const playerKey = key.replace('player', '').toLowerCase();
                this.gameState.player[playerKey] = Math.max(0, Math.min(100, this.gameState.player[playerKey] + value));
            } else if (key === 'money') {
                this.gameState.player.money += value;
                if (value < 0) {
                    this.gameState.statistics.totalSpent += Math.abs(value);
                }
            } else if (key === 'time') {
                this.gameState.player.time += value;
            } else if (this.gameState.statistics.hasOwnProperty(key)) {
                this.gameState.statistics[key] += value;
            }
        });
    }

    startDailyCycle() {
        setInterval(async () => {
            this.gameState.player.day++;
            this.gameState.dog.age += 0.1;
            
            // Natural decay
            this.gameState.dog.energy = Math.max(0, this.gameState.dog.energy - 5);
            this.gameState.dog.happiness = Math.max(0, this.gameState.dog.happiness - 2);
            this.gameState.dog.health = Math.max(0, this.gameState.dog.health - 1);
            
            // Player time regeneration
            this.gameState.player.time = Math.min(100, this.gameState.player.time + 10);
            
            this.updateUI();
            
            // Auto-save game progress
            await this.saveGameProgress();
            
            // Check for game end conditions
            if (this.gameState.dog.health <= 0 || this.gameState.player.happiness <= 0) {
                this.endGame();
            }
        }, 10000); // 10 seconds per day
    }

    updateUI() {
        // Update player stats
        document.getElementById('player-display-name').textContent = this.gameState.player.name;
        document.getElementById('happiness').textContent = this.gameState.player.happiness;
        document.getElementById('money').textContent = `$${this.gameState.player.money}`;
        document.getElementById('time').textContent = this.gameState.player.time;
        document.getElementById('day').textContent = this.gameState.player.day;

        // Update dog stats
        document.getElementById('energy-bar').style.width = `${this.gameState.dog.energy}%`;
        document.getElementById('happiness-bar').style.width = `${this.gameState.dog.happiness}%`;
        document.getElementById('health-bar').style.width = `${this.gameState.dog.health}%`;
    }

    async endGame() {
        // Save final results to Supabase
        await this.saveGameResults();
        
        this.showScreen('results-screen');
        this.generateResults();
    }

    async generateResults() {
        const stats = this.gameState.statistics;
        const player = this.gameState.player;
        const dog = this.gameState.dog;

        // Experience summary
        let experienceText = '';
        if (dog.happiness > 80) {
            experienceText = 'You had a wonderful experience with your dog!';
        } else if (dog.happiness > 60) {
            experienceText = 'You had a good experience with your dog.';
        } else if (dog.happiness > 40) {
            experienceText = 'You had a challenging but manageable experience.';
        } else {
            experienceText = 'You found dog ownership quite difficult.';
        }

        // Financial summary
        let financialText = '';
        if (stats.totalSpent < 1000) {
            financialText = 'Dog ownership was relatively affordable for you.';
        } else if (stats.totalSpent < 3000) {
            financialText = 'Dog ownership had moderate financial impact.';
        } else {
            financialText = 'Dog ownership was quite expensive.';
        }

        // Lifestyle summary
        let lifestyleText = '';
        if (player.happiness > 80) {
            lifestyleText = 'Dog ownership enhanced your lifestyle significantly.';
        } else if (player.happiness > 60) {
            lifestyleText = 'Dog ownership had a positive impact on your lifestyle.';
        } else if (player.happiness > 40) {
            lifestyleText = 'Dog ownership required significant lifestyle adjustments.';
        } else {
            lifestyleText = 'Dog ownership was very challenging for your lifestyle.';
        }

        // Recommendation
        let recommendation = '';
        const score = (dog.happiness + player.happiness) / 2;
        if (score > 80) {
            recommendation = 'YES - You would likely enjoy dog ownership!';
        } else if (score > 60) {
            recommendation = 'MAYBE - Consider your circumstances carefully.';
        } else {
            recommendation = 'NO - Dog ownership may not be right for you right now.';
        }

        // Update results
        document.getElementById('experience-summary').textContent = experienceText;
        document.getElementById('financial-summary').textContent = financialText;
        document.getElementById('lifestyle-summary').textContent = lifestyleText;
        document.getElementById('recommendation').textContent = recommendation;

        // Final statistics
        document.getElementById('total-spent').textContent = `$${stats.totalSpent}`;
        document.getElementById('total-days').textContent = player.day;
        document.getElementById('final-happiness').textContent = `${Math.round(dog.happiness)}%`;
        document.getElementById('final-player-happiness').textContent = `${Math.round(player.happiness)}%`;

        // Load and display leaderboard
        await this.displayLeaderboard();
    }

    async displayLeaderboard() {
        const leaderboard = await this.getLeaderboard();
        const leaderboardElement = document.getElementById('leaderboard');
        
        if (leaderboard.length === 0) {
            leaderboardElement.innerHTML = '<p>No leaderboard data available yet.</p>';
            return;
        }

        let leaderboardHTML = '<div class="leaderboard-list">';
        leaderboard.forEach((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            leaderboardHTML += `
                <div class="leaderboard-entry ${entry.name === this.gameState.player.name ? 'current-player' : ''}">
                    <span class="rank">${medal}</span>
                    <span class="player-name">${entry.name}</span>
                    <span class="score">${entry.score}%</span>
                </div>
            `;
        });
        leaderboardHTML += '</div>';
        
        leaderboardElement.innerHTML = leaderboardHTML;
    }

    restartGame() {
        this.gameState = {
            player: {
                name: '',
                lifestyle: '',
                income: '',
                livingSituation: '',
                happiness: 100,
                money: 5000,
                time: 100,
                day: 1
            },
            dog: {
                energy: 100,
                happiness: 100,
                health: 100,
                age: 0,
                training: 0,
                obedience: 0
            },
            statistics: {
                totalSpent: 0,
                vetVisits: 0,
                walks: 0,
                trainingSessions: 0,
                groomingSessions: 0,
                accidents: 0,
                socialEvents: 0
            },
            events: [],
            currentEvent: null
        };

        this.showScreen('welcome-screen');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DogSimulationGame();
}); 