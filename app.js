(function($){
    'use strict';

    const app = (function(){

        return {
            
            init: function(){
                this.ajaxRequest();
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

                $('[data-js="lotofacil"]').on('click', () => {this.handleSelectGame(data.types[0])});
                $('[data-js="megasena"]').on('click',  () => {this.handleSelectGame(data.types[1])});
                $('[data-js="quina"]').on('click',  () => {this.handleSelectGame(data.types[2])});

            },

            handleSelectGame: function(rules) {

                $('[data-js="game"]').get().textContent = rules.type;
                $('[data-js="gameRules"]').get().textContent = rules.description;
                
                this.generatebuttons(rules.range);

            },

            generatebuttons: function(GameRange) {

                let div = $('[data-js="numbers"]').get();

                if(div.hasChildNodes() === true)
                    div.innerHTML = ''

                for(let i = 1; i <= GameRange; i++) {
                    const $button = document.createElement('button');
                    $button.value = 1;
                    $button.setAttribute("data-js", 'number-choice')
                    $button.appendChild(document.createTextNode(`${i}`));
                    div.appendChild($button);
                }

            },
        }

    }());

    app.init();

}(window.DOM))