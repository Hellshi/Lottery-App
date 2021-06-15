(function($){
    'use strict';

    const app = (function(){

        return {
            
            init: function(){
                this.ajaxRequest();
                this.cleaGame();
                this.addCart();
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
                    this.handleSelectGame(data.types[0])
                });

                $('[data-js="megasena"]').on('click',  () => {
                    this.handleSelectGame(data.types[1])
                });

                $('[data-js="quina"]').on('click',  () => {
                    this.handleSelectGame(data.types[2])
                });

            },

            handleSelectGame: function(rules) {

                $('[data-js="game"]').get().textContent = rules.type;
                $('[data-js="gameRules"]').get().textContent = rules.description;
                
                this.generatebuttons(rules.range);
                this.generateGame(rules.maxNumber);
            },

            generatebuttons: function(GameRange) {

                let div = $('[data-js="numbers"]').get();

                if(div.hasChildNodes() === true)
                    div.innerHTML = ''

                for(let i = 1; i <= GameRange; i++) {
                    const $button = document.createElement('button');
                    $button.value = i;
                    $button.setAttribute("data-js", 'number-choice')
                    $button.appendChild(document.createTextNode(`${i}`));
                    div.appendChild($button);
                }

            },

            currentGame: [],

            generateGame: function(gameRule) {
                $('[data-js="number-choice"]').forEach(button => {
                    button.addEventListener('click', () => {
                        this.addNumberToArray(gameRule, button.value)
                    })
                })
            },

            addNumberToArray: function(gameRule, selectedNumber) {
                if(this.currentGame.length < gameRule){

                    if(this.currentGame.indexOf(selectedNumber) === -1){

                        this.currentGame.push(selectedNumber);
                        console.log(this.currentGame);

                    }
                }
            },

            cleaGame: function() {
                $('[data-js="clear"]').on('click', () => {
                    this.currentGame = [];
                    console.log(this.currentGame);
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

                this.cart.forEach( game => {

                    let div = document.createElement('div');

                    let $button = document.createElement('button');
                    $button.setAttribute("data-js", 'deleteGame');
                    $button.appendChild(document.createTextNode('Delete'));
                    
                    div.setAttribute("data-js", "game");
                        div.id = this.cart.indexOf(game);
                        div.appendChild(document.createTextNode(`${game}`));
                    
                    $button.value = div.id
                    div.appendChild($button);
                    Cart.appendChild(div);
                })

                let $delete = $('[data-js="deleteGame"]');
                let deleteValue = $delete.get().value;
                $delete.on('click', () => {this.HandleDelete(deleteValue)});

            },

            HandleDelete: function(id) {
                let child = document.getElementById(id);
                document.querySelector('[data-js="cart"]').removeChild(child);
                this.cart.splice(id, 1);
                console.log(this.cart);
            }
        }

    }());

    app.init();

}(window.DOM))