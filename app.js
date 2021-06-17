(function($){
    'use strict';

    const app = (function(){

        return {
            
            init: function(){
                this.ajaxRequest();
                this.cleaGame();
                this.addCart();
                this.completeGame();
            },

/* ------------ AJAX REQUEST -------------- */
            ajaxRequest: function() {
                const AJAX = new XMLHttpRequest();
                AJAX.open('GET', './games.json');
                AJAX.send();
                AJAX.addEventListener('readystatechange', this.getGameRules);
            },

            isReady: function() {
                return this.readyState === 4 && this.status === 200
            },

            getGameRules: function() {
                if(!app.isReady.call(this))
                    return;

                let data = JSON.parse(this.responseText);
                
                app.selectGame(data);

            },

/* ------------  Click to select game -------------- */
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

            handleSelectGame: function(rules) {

                this.rules = rules;
                //this.completeGame(rules.range, rules.maxNumber, rules.type, rules.price);
                this.generatebuttons(rules);
                this.generateGame(rules.maxNumber, rules.type, rules.price);

                $('[data-js="game"]').get().textContent = rules.type;
                $('[data-js="gameRules"]').get().textContent = rules.description;

            },

            rules: {},

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

            generatebuttons: function(rules) {

                let div = $('[data-js="numbers"]').get();

                if(div.hasChildNodes() === true)
                    div.innerHTML = ''

                for(let i = 1; i <= rules.range; i++) {
                    const $button = document.createElement('button');
                    $button.value = i;
                    $button.setAttribute("data-js", 'number-choice')
                    $button.appendChild(document.createTextNode(`${i}`));
                    div.appendChild($button);
                }    

            },

            currentGame: [],

            generateGame: function(gameRule, gameType, gamePrice) {
                $('[data-js="number-choice"]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.addNumberToArray(gameRule, button.value, gameType, gamePrice);
                    })
                })
            },

            addNumberToArray: function(gameRule, selectedNumber, gameType, gamePrice) {
                
                if(this.currentGame.length < gameRule){

                    if(this.currentGame.indexOf(selectedNumber) === -1 && selectedNumber !== 0){

                        this.currentGame.push(selectedNumber);
                    }

                    if(this.currentGame.length == (gameRule))

                        this.currentGame.push([gameType, gamePrice]);
                };
                                
            },

            cleaGame: function() {
                $('[data-js="clear"]').on('click', () => {
                    this.currentGame = [];
                })
            },

            cart: [],
            
            addCart: function() {
                $('[data-js="addToCart"]').on( 'click', () => {
                    this.cart.push([this.currentGame]);
                    this.currentGame = [];
                    this.cartDisplay();
                })
            },

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
                        this.getOnlyNumbers(game[0], div);                        
                    
                    $button.value = div.id;
                    $button.addEventListener('click', () => {
                        this.HandleDelete($button.value, Price)
                    });

                    div.appendChild($button);
                    div.appendChild(this.getOnlyNumbers(game[0]))
                    Cart.appendChild(div);
                })
                this.getPrice(Price);
            },

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

            getPrice: function(price) {
                if(price.length === 0) {
                    let total = 0;
                    $('[data-js="price"]').get().textContent = `TOTAL ${
                        total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                    }`
                } else {
                const total = price.reduce((total, currentElement) => +total + +currentElement);
                let formated = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                $('[data-js="price"]').get().textContent = `TOTAL ${formated}`
            }
            },

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