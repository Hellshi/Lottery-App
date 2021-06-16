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
                    console.log(this.currentGame.length) 
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

                    if(this.currentGame.indexOf(selectedNumber) === -1){

                        this.currentGame.push(selectedNumber);
                    }

                    if(this.currentGame.length == (gameRule))

                        this.currentGame.push([gameType, gamePrice]);
                        console.log(this.currentGame)
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
                    console.log(this.cart);
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

                    let $button = document.createElement('button');
                    $button.setAttribute("data-js", 'deleteGame');
                    $button.appendChild(document.createTextNode('Delete'));
                    
                    div.setAttribute("data-js", "game");
                        div.id = this.cart.indexOf(game);
                        div.appendChild(document.createTextNode(`${game[0]}`));
                    
                    $button.value = div.id;
                    $button.addEventListener('click', () => {
                        this.HandleDelete($button.value, Price)
                    });

                    div.appendChild($button);
                    Cart.appendChild(div);
                })
                this.getPrice(Price);
            },

            getPrice: function(price) {
                console.log(price.length)
                if(price.length === 0) {
                    let total = 0;
                    $('[data-js="price"]').get().textContent = total
                } else {
                const total = price.reduce((total, currentElement) => total + currentElement);
                $('[data-js="price"]').get().textContent = total
            }
            },

            HandleDelete: function(id, price) {
                let child = document.getElementById(id);
                document.querySelector('[data-js="cart"]').removeChild(child);
                this.cart.splice(id, 1);
                price.splice(id, 1);
                this.getPrice(price);
                console.log(this.cart);
            },

        }

    }());

    app.init();

}(window.DOM))