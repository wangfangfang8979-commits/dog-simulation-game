class DogSimulationGame {
    constructor() {
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
                name: '',
                breed: '',
                age: 0,
                personality: [],
                energy: 100,
                happiness: 100,
                health: 100,
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

        this.breedInfo = {
            'golden-retriever': { name: 'Golden Retriever', energy: 'High', size: 'Large', temperament: 'Friendly' },
            'labrador': { name: 'Labrador Retriever', energy: 'High', size: 'Large', temperament: 'Friendly' },
            'german-shepherd': { name: 'German Shepherd', energy: 'High', size: 'Large', temperament: 'Protective' },
            'bulldog': { name: 'Bulldog', energy: 'Low', size: 'Medium', temperament: 'Calm' },
            'beagle': { name: 'Beagle', energy: 'Medium', size: 'Medium', temperament: 'Playful' },
            'poodle': { name: 'Poodle', energy: 'Medium', size: 'Medium', temperament: 'Intelligent' },
            'rottweiler': { name: 'Rottweiler', energy: 'Medium', size: 'Large', temperament: 'Protective' },
            'yorkshire-terrier': { name: 'Yorkshire Terrier', energy: 'Medium', size: 'Small', temperament: 'Energetic' },
            'boxer': { name: 'Boxer', energy: 'High', size: 'Large', temperament: 'Playful' },
            'dachshund': { name: 'Dachshund', energy: 'Low', size: 'Small', temperament: 'Loyal' },
            'siberian-husky': { name: 'Siberian Husky', energy: 'Very High', size: 'Large', temperament: 'Independent' },
            'great-dane': { name: 'Great Dane', energy: 'Low', size: 'Very Large', temperament: 'Gentle' },
            'chihuahua': { name: 'Chihuahua', energy: 'Medium', size: 'Very Small', temperament: 'Loyal' },
            'border-collie': { name: 'Border Collie', energy: 'Very High', size: 'Medium', temperament: 'Intelligent' },
            'mixed-breed': { name: 'Mixed Breed', energy: 'Variable', size: 'Variable', temperament: 'Variable' }
        };

        this.events = [
            {
                id: 'puppy_arrival',
                title: 'Puppy Arrival',
                description: 'Your new puppy {dogName} has arrived! They\'re excited but nervous in their new home. You can see the curiosity in their eyes as they explore their new surroundings.',
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
                description: 'It\'s {dogName}\'s first night in your home. You can hear them crying and whining from their crate. The sound tugs at your heartstrings.',
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
                description: 'You just discovered that {dogName} had an accident on your favorite carpet. The stain is already setting in, and you can smell it from across the room.',
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
                description: 'You just caught {dogName} eating something they shouldn\'t have from the trash. They\'re acting lethargic and you\'re worried about their health.',
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
                description: 'Your friends have invited you to a party tonight, but you have {dogName} to consider. They\'re looking at you with those puppy eyes.',
                choices: [
                    {
                        text: 'Bring {dogName} along',
                        effects: { dogHappiness: 10, socialEvents: 1, time: -20, playerHappiness: 5 }
                    },
                    {
                        text: 'Find a pet sitter',
                        effects: { money: -100, time: -10, playerHappiness: 10, socialEvents: 1 }
                    },
                    {
                        text: 'Stay home with {dogName}',
                        effects: { dogHappiness: 15, playerHappiness: -5, time: -5 }
                    }
                ]
            },
            {
                id: 'training_opportunity',
                title: 'Training Opportunity',
                description: 'A professional dog trainer is offering classes in your area. {dogName} has been showing some behavioral issues that you\'re not sure how to handle.',
                choices: [
                    {
                        text: 'Enroll {dogName} in training classes',
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
                description: 'Your work schedule has changed, requiring longer hours. {dogName} will need to be alone for much longer periods during the day.',
                choices: [
                    {
                        text: 'Hire a dog walker for {dogName}',
                        effects: { money: -300, dogHappiness: 10, time: 10, playerHappiness: 5 }
                    },
                    {
                        text: 'Leave {dogName} alone longer',
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
                description: '{dogName} needs grooming, but you\'re not sure about the cost. Their fur is getting matted and they\'re starting to smell.',
                choices: [
                    {
                        text: 'Professional grooming for {dogName}',
                        effects: { money: -150, dogHappiness: 10, groomingSessions: 1, time: -10 }
                    },
                    {
                        text: 'Groom {dogName} at home',
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
                description: 'You want to take a vacation, but need to consider {dogName}. They\'re wagging their tail as you look at travel brochures.',
                choices: [
                    {
                        text: 'Board {dogName} at a kennel',
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
                description: '{dogName} has developed a barking problem that\'s bothering your neighbors. You\'ve received a complaint letter in your mailbox.',
                choices: [
                    {
                        text: 'Hire a behaviorist for {dogName}',
                        effects: { money: -300, training: 15, obedience: 20, time: -20 }
                    },
                    {
                        text: 'Try training {dogName} at home',
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
    }

    bindEvents() {
        // Welcome screen
        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('character-creation');
        });

        // Character creation
        document.getElementById('next-to-dog').addEventListener('click', () => {
            this.showScreen('dog-creation');
        });

        document.getElementById('create-character').addEventListener('click', () => {
            this.createCharacter();
        });

        // Dog creation form updates
        document.getElementById('dog-name').addEventListener('input', () => {
            this.updateDogPreview();
        });

        document.getElementById('dog-breed').addEventListener('change', () => {
            this.updateDogPreview();
        });

        document.getElementById('dog-age').addEventListener('change', () => {
            this.updateDogPreview();
        });

        // Personality checkboxes
        document.querySelectorAll('.checkbox-label input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateDogPreview();
            });
        });

        // Game actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.performAction(action);
            });
        });

        // Payment system
        document.getElementById('purchase-image').addEventListener('click', () => {
            this.showPaymentModal();
        });

        document.getElementById('process-payment').addEventListener('click', () => {
            this.processPayment();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.hidePaymentModal();
        });

        // Restart game
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateDogPreview() {
        const name = document.getElementById('dog-name').value || 'Your Dog';
        const breed = document.getElementById('dog-breed').value;
        const age = document.getElementById('dog-age').value;
        const personality = Array.from(document.querySelectorAll('.checkbox-label input:checked'))
            .map(cb => cb.value);

        document.getElementById('preview-name').textContent = name;
        document.getElementById('preview-breed').textContent = this.breedInfo[breed]?.name || 'Choose a breed';
        document.getElementById('preview-age').textContent = `Age: ${age} months`;
        document.getElementById('preview-personality').textContent = `Personality: ${personality.join(', ') || 'None selected'}`;
    }

    createCharacter() {
        const playerName = document.getElementById('player-name').value.trim();
        const lifestyle = document.getElementById('lifestyle').value;
        const income = document.getElementById('income').value;
        const livingSituation = document.getElementById('living-situation').value;

        const dogName = document.getElementById('dog-name').value.trim();
        const dogBreed = document.getElementById('dog-breed').value;
        const dogAge = document.getElementById('dog-age').value;
        const dogPersonality = Array.from(document.querySelectorAll('.checkbox-label input:checked'))
            .map(cb => cb.value);

        if (!playerName) {
            alert('Please enter your name!');
            return;
        }

        if (!dogName) {
            alert('Please enter your dog\'s name!');
            return;
        }

        this.gameState.player.name = playerName;
        this.gameState.player.lifestyle = lifestyle;
        this.gameState.player.income = income;
        this.gameState.player.livingSituation = livingSituation;

        this.gameState.dog.name = dogName;
        this.gameState.dog.breed = dogBreed;
        this.gameState.dog.age = parseInt(dogAge);
        this.gameState.dog.personality = dogPersonality;

        // Adjust starting stats based on lifestyle and breed
        this.adjustStartingStats();

        this.showScreen('game-screen');
        this.updateUI();
        this.startGame();
    }

    adjustStartingStats() {
        const lifestyle = this.gameState.player.lifestyle;
        const income = this.gameState.player.income;
        const breed = this.gameState.dog.breed;
        const breedData = this.breedInfo[breed];

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

        // Adjust dog stats based on breed
        if (breedData) {
            switch (breedData.energy) {
                case 'Very High':
                    this.gameState.dog.energy = 120;
                    break;
                case 'High':
                    this.gameState.dog.energy = 110;
                    break;
                case 'Medium':
                    this.gameState.dog.energy = 100;
                    break;
                case 'Low':
                    this.gameState.dog.energy = 90;
                    break;
            }
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
        // Personalize the event description with the dog's name
        let description = event.description.replace(/{dogName}/g, this.gameState.dog.name);
        document.getElementById('event-description').textContent = description;
        
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

    performAction(action) {
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
        setInterval(() => {
            this.gameState.player.day++;
            this.gameState.dog.age += 0.1;
            
            // Natural decay
            this.gameState.dog.energy = Math.max(0, this.gameState.dog.energy - 5);
            this.gameState.dog.happiness = Math.max(0, this.gameState.dog.happiness - 2);
            this.gameState.dog.health = Math.max(0, this.gameState.dog.health - 1);
            
            // Player time regeneration
            this.gameState.player.time = Math.min(100, this.gameState.player.time + 10);
            
            this.updateUI();
            
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

        // Update dog info
        document.getElementById('dog-display-name').textContent = this.gameState.dog.name;
        document.getElementById('dog-display-breed').textContent = this.breedInfo[this.gameState.dog.breed]?.name || 'Mixed Breed';

        // Update dog stats
        document.getElementById('energy-bar').style.width = `${this.gameState.dog.energy}%`;
        document.getElementById('happiness-bar').style.width = `${this.gameState.dog.happiness}%`;
        document.getElementById('health-bar').style.width = `${this.gameState.dog.health}%`;
    }

    endGame() {
        this.showScreen('results-screen');
        this.generateResults();
        this.generateDogImage();
    }

    generateResults() {
        const stats = this.gameState.statistics;
        const player = this.gameState.player;
        const dog = this.gameState.dog;

        // Experience summary
        let experienceText = '';
        if (dog.happiness > 80) {
            experienceText = `You had a wonderful experience with ${dog.name}!`;
        } else if (dog.happiness > 60) {
            experienceText = `You had a good experience with ${dog.name}.`;
        } else if (dog.happiness > 40) {
            experienceText = `You had a challenging but manageable experience with ${dog.name}.`;
        } else {
            experienceText = `You found dog ownership quite difficult with ${dog.name}.`;
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
    }

    generateDogImage() {
        const canvas = document.getElementById('dog-image-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 400;
        canvas.height = 400;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw dog based on stats
        const dog = this.gameState.dog;
        const breedData = this.breedInfo[dog.breed];
        
        // Dog body (size based on breed)
        let bodySize = 80;
        if (breedData) {
            switch (breedData.size) {
                case 'Very Small': bodySize = 50; break;
                case 'Small': bodySize = 60; break;
                case 'Medium': bodySize = 80; break;
                case 'Large': bodySize = 100; break;
                case 'Very Large': bodySize = 120; break;
            }
        }
        
        // Body color based on happiness
        const happinessColor = dog.happiness > 80 ? '#FFD700' : 
                             dog.happiness > 60 ? '#FFA500' : 
                             dog.happiness > 40 ? '#CD853F' : '#8B4513';
        
        // Draw body
        ctx.fillStyle = happinessColor;
        ctx.beginPath();
        ctx.ellipse(200, 250, bodySize, bodySize * 0.6, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Head
        const headSize = bodySize * 0.4;
        ctx.beginPath();
        ctx.arc(200, 200, headSize, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ears (position based on energy)
        const earAngle = dog.energy > 80 ? 0.3 : dog.energy > 60 ? 0.1 : -0.1;
        ctx.beginPath();
        ctx.moveTo(200 - headSize * 0.8, 200 - headSize * 0.5);
        ctx.quadraticCurveTo(200 - headSize * 0.6, 200 - headSize * 1.2 + earAngle * 20, 
                            200 - headSize * 0.4, 200 - headSize * 0.8);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(200 + headSize * 0.8, 200 - headSize * 0.5);
        ctx.quadraticCurveTo(200 + headSize * 0.6, 200 - headSize * 1.2 + earAngle * 20, 
                            200 + headSize * 0.4, 200 - headSize * 0.8);
        ctx.fill();
        
        // Eyes (expression based on health)
        const eyeSize = dog.health > 80 ? 8 : dog.health > 60 ? 6 : 4;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(200 - headSize * 0.3, 200 - headSize * 0.1, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(200 + headSize * 0.3, 200 - headSize * 0.1, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(200, 200 + headSize * 0.2, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Tail (wagging based on happiness)
        const tailWag = dog.happiness > 80 ? 0.5 : dog.happiness > 60 ? 0.2 : -0.2;
        ctx.strokeStyle = happinessColor;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(200 + bodySize * 0.8, 250);
        ctx.quadraticCurveTo(200 + bodySize * 1.2 + tailWag * 30, 250 - 20, 
                            200 + bodySize * 1.4 + tailWag * 40, 250 - 40);
        ctx.stroke();
        
        // Add name
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(dog.name, 200, 350);
        
        // Add breed
        ctx.font = '16px Inter';
        ctx.fillStyle = '#666';
        ctx.fillText(breedData?.name || 'Mixed Breed', 200, 370);
    }

    showPaymentModal() {
        document.getElementById('payment-modal').style.display = 'block';
    }

    hidePaymentModal() {
        document.getElementById('payment-modal').style.display = 'none';
    }

    processPayment() {
        const cardName = document.getElementById('card-name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        const cardCvv = document.getElementById('card-cvv').value.trim();

        if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
            alert('Please fill in all payment details.');
            return;
        }

        // Simulate payment processing
        const processBtn = document.getElementById('process-payment');
        const originalText = processBtn.textContent;
        processBtn.textContent = 'Processing...';
        processBtn.disabled = true;

        setTimeout(() => {
            // Simulate successful payment
            this.hidePaymentModal();
            this.showDogImage();
            
            // Reset button
            processBtn.textContent = originalText;
            processBtn.disabled = false;
            
            alert('Payment successful! Your dog\'s portrait is now available.');
        }, 2000);
    }

    showDogImage() {
        document.getElementById('dog-image-placeholder').style.display = 'none';
        document.getElementById('dog-image-canvas').style.display = 'block';
        document.getElementById('purchase-image').textContent = 'Download Portrait';
        document.getElementById('purchase-image').onclick = () => this.downloadImage();
    }

    downloadImage() {
        const canvas = document.getElementById('dog-image-canvas');
        const link = document.createElement('a');
        link.download = `${this.gameState.dog.name}-portrait.png`;
        link.href = canvas.toDataURL();
        link.click();
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
                name: '',
                breed: '',
                age: 0,
                personality: [],
                energy: 100,
                happiness: 100,
                health: 100,
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