(function($){
    'use strict';

    const app = (function(){

        return {
            
            init: function(){
                this.ajaxRequest();
                this.cleaGame();
                this.addCart();
                this.completeGame();
                this.getPrice([]);
            },

        //AJAX request
            ajaxRequest: function() {
                const AJAX = new XMLHttpRequest();
                AJAX.open('GET', './games.json');
                AJAX.send();
                AJAX.addEventListener('readystatechange', this.getGameRules);
            },

            isReady: function() {
                return this.readyState === 4 && this.status === 200
            },

            //Storing selected rules to be used donw in the complete game generator func
                rules: {},

            getGameRules: function() {
                if(!app.isReady.call(this))
                    return;

                let data = JSON.parse(this.responseText);
                
                app.generateSelectors(data);
                app.selectGame(data);
                this.rules = data.types[0];
                app.handleFirstGame(this.rules);

            },

            generateSelectors: function(data) {
                let $div = $('[data-js="buttonsSelectorDiv"]').get();
                let types = data.types;
                types.forEach(game => {
                    let $Button = document.createElement('button');
                    $Button.setAttribute("data-js", `${game.type}`);
                    $Button.appendChild(document.createTextNode(`${game.type}`));
                    $Button.classList.add('chooseGame');
                    $Button.value = types.indexOf(game);
                    $Button.addEventListener('click', () => {
                        this.handleSelectGame(types[$Button.value])
                    })
                    $div.appendChild($Button);
                    
                })
            },
            
            handleFirstGame: function(rules) {

                app.generatebuttons(rules);
                app.generateRulesAndTitle(rules.type, rules.description);
                this.generateGame(rules.maxNumber, rules.type, rules.price);              

            },

            //Select function call buttons 
            selectGame: function(data) {

                $('[data-js="lotofacil"]').on('click', () => {
                    this.handleSelectGame(data.types[0]);
                });

                $('[data-js="megasena"]').on('click',  () => {
                    this.handleSelectGame(data.types[1]);
                });

                $('[data-js="quina"]').on('click',  () => {
                    this.handleSelectGame(data.types[2]);
                });

            },

            //Passing the rules donw to other functions
            handleSelectGame: function(rules) {
                this.currentGame = [];
                console.log(this.currentGame)
                this.rules = rules;
                //this.completeGame(rules.range, rules.maxNumber, rules.type, rules.price);
                this.generatebuttons(rules);
                this.generateGame(rules.maxNumber, rules.type, rules.price);
                app.generateRulesAndTitle(rules.type, rules.description);

            },

            generateRulesAndTitle: function(type, description) {
                $('[data-js="game"]').get().textContent = type;
                $('[data-js="gameRules"]').get().textContent = description;
            },

            //Generate the buttons according to the game rule range propierty
            generatebuttons: function(rules) {

                let div = $('[data-js="numbers"]').get();

                if(div.hasChildNodes() === true)
                    div.innerHTML = ''

                for(let i = 1; i <= rules.range; i++) {
                    const $button = document.createElement('button');
                    $button.value = i;
                    $button.setAttribute("data-js", 'number-choice');
                    $button.id = `${rules.type}`;
                    $button.appendChild(document.createTextNode(`${i}`));
                    div.appendChild($button);
                }    

            },

            completeGame: function() {
                $('[data-js="completeGame"]').on('click', () => {
                    let game = this.rules
                    this.generateCompleteGame(game.range, game.maxNumber, game.type, game.price);
                }); 
                
            }, 

            generateCompleteGame: function(range, maxNumber, gameType, gamePrice) {
                while(this.currentGame.length <= maxNumber) {
                    let selected = Math.floor(Math.random() * range);
                    this.addNumberToArray(maxNumber, selected, gameType, gamePrice);
                } 
            }, 

            //Store the current selected numbers
            //The object recieved here is a multi-dimensional array
            //This array is like [1, 2, 3..., [GameType, GamePrice]]
            currentGame: [],

            //Generate using user's selected numbers at the interface
            generateGame: function(gameRule, gameType, gamePrice) {
                $('[data-js="number-choice"]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.addNumberToArray(gameRule, button, gameType, gamePrice);
                    })
                })
            },

            //Add numbers to the currentGame array
            addNumberToArray: function(gameRule, button, gameType, gamePrice) {
                
                if(this.currentGame.length < gameRule){

                    if(this.currentGame.indexOf(button.value)=== -1 && button.value !== 0){

                        button.classList.add('selected');
                        this.currentGame.push(button.value);

                    }

                    if(this.currentGame.length == (gameRule)) {

                        this.currentGame.push([gameType, gamePrice]);
                        alert('Todos os números já foram selecionados, adicione ao carrinho! ou limpe o jogo')
                    }
                };
                                
            },

            //Clear the CurrentGame array
            cleaGame: function() {
                $('[data-js="clear"]').on('click', () => {
                    this.currentGame = [];
                    app.clearClasses();
                })
            },

            clearClasses: function() {
                $('[data-js="number-choice"]').forEach(button => {
                    button.classList.remove('selected');
                }) 
            },

            //Store all games in the cart
            cart: [],
            
            //Add games to cart
            addCart: function() {
                $('[data-js="addToCart"]').on( 'click', () => {
                    this.checkCurrentGameQuantity(app.rules)
                    this.cartDisplay();
                    this.clearClasses();
                })
            },

            checkCurrentGameQuantity: function(rules) {
                if(this.currentGame.length < rules.maxNumber) {
                    alert(`Selecione mais ${((rules.maxNumber) - (this.currentGame.length))} números para prosseguir`);
                }
                    else {
                        this.cart.push([this.currentGame]);
                        this.currentGame = [];
                    }
            },

            //Generate elements that will be displayed at the cart
            cartDisplay: function() {

                let Cart = $('[data-js="cart"]').get();

               if(Cart.hasChildNodes() === true)
                    Cart.innerHTML = '';
                let Price = []
                this.cart.forEach( game => {

                   let price = game[0][game[0].length-1][1];
                    let div = document.createElement('div');
                    Price.push(price)

                    let $button = document.createElement('i');
                    $button.setAttribute("data-js", 'deleteGame');
                    $button.className = 'fa fa-trash-o'
                    
                    div.setAttribute("data-js", "GameFinished");
                        div.id = this.cart.indexOf(game);
                        console.log(this.cart.indexOf(game))
                        this.getOnlyNumbers(game[0]);                        
                    
                    $button.id = div.id;
                    console.log(div.id)
                    console.log($button.id)
                    console.log(typeof $button.id)
                    $button.addEventListener('click', () => {
                        this.HandleDelete($button.id, Price)
                    });

                    div.appendChild($button);
                    div.appendChild(this.getOnlyNumbers(game[0]))
                    Cart.appendChild(div);
                })
                this.getPrice(Price);
            },

            //Separate the numbers from the array containing the GameType and GamePrice
            //This function will return an div element the will be appended in the upper function 
            getOnlyNumbers: function(game) {

                let gameContainer = document.createElement('div');
                gameContainer.setAttribute("data-js", 'GameContainer')
                
                let gameNumbersComplete = document.createElement('div')
                gameNumbersComplete.setAttribute("data-js", "gameNumbersComplete");

                let color = document.createElement('span');

                let colorDiv = document.createElement('div');
                colorDiv.setAttribute("data-js", "colorDiv");

                let price = document.createElement('span');
                price.setAttribute("data-js", "priceCart");

                let type = document.createElement('span');
                type.setAttribute("data-js", "type");

                let priceAndType = document.createElement('div');
                priceAndType.setAttribute("data-js", "priceAndTye");

                let numbers = []

                game.forEach(item => {
                    if(typeof item === 'string' || typeof item === 'number') {
                        numbers.push(item);
                    } else {

                        gameContainer.className = `${item[0]}`
                        type.appendChild(document.createTextNode(`${item[0]}`));
                        type.className = `${item[0]}`
                        price.appendChild(document.createTextNode(
                            item[1].toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                            ));
                        priceAndType.appendChild(type);
                        priceAndType.appendChild(price);
                    }
                })
                
                gameNumbersComplete.appendChild(document.createTextNode(`${numbers}`));
                gameContainer.appendChild(gameNumbersComplete);
                gameContainer.appendChild(priceAndType);

                return gameContainer
            },


            //Sums the price to be displayed
            getPrice: function(price) {
                console.log(typeof price)
                if(price.length === 0) {
                    let total = 0;
                    $('[data-js="price"]').get().textContent = `Seu carrinho está vazio :(`
                } else {
                const total = price.reduce((total, currentElement) => +total + +currentElement);
                let formated = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                $('[data-js="price"]').get().textContent = `TOTAL ${formated}`
            }
            },

            //Deletes an item from the cart
            HandleDelete: function(id, price) {
                let child = document.getElementById(id);
                document.querySelector('[data-js="cart"]').removeChild(child);
                this.cart.splice(id, 1);
                price.splice(id, 1);
                this.getPrice(price);
            },

        }

    }());

    app.init();

}(window.DOM))