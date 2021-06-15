(function(){

    function DOM(elements)  {
        
        if(!(this instanceof DOM))
            return new DOM(elements);

        this.element = this.getDOMElements(elements)
    
    }
    
    DOM.prototype.getDOMElements = (elements) => {
        return document.querySelectorAll(elements)
    }
    
    // Creating ON ;
    
    DOM.prototype.on = function on(eventType, callback) {
    
        Array.prototype.forEach.call(this.element, (element) => {
            element.addEventListener(eventType, callback, false);
        })
    
    }
    
    //Creating OFF;
    
    DOM.prototype.off = function off(eventType, callback) {
    
        Array.prototype.forEach.call(this.element, (element) => {
            element.removeEventListener(eventType, callback, false);
        })
    }
    
    //Foreach
    
    DOM.prototype.forEach = function forEach() {
    
        return Array.prototype.forEach.apply(this.element, arguments);
    }
    
    //map 
    
    DOM.prototype.map = function map() {
    
        return Array.prototype.map.apply(this.element, arguments);
    
    }
    
    //filter
    
    DOM.prototype.filter = function filter() {
    
        return Array.prototype.filter.apply(this.element, arguments);
    
    }
    
    //reduce
    DOM.prototype.reduce = function reduce() {
    
        return Array.prototype.reduce.apply(this.element, arguments);
    
    }
    
    //reduceRight
    
    DOM.prototype.reduceRight = function reduceRight() {
    
        return Array.prototype.reduceRight.apply(this.element, arguments);
    
    }
    
    //Every
    
    DOM.prototype.every = function every() {
    
        return Array.prototype.every.apply(this.element, arguments);
    
    }
    
    //Some
    
    DOM.prototype.some = function some() {
    
        return Array.prototype.some.apply(this.element, arguments);
    
    }
    
    
    //Creating Get
    DOM.prototype.get = function get (index) {
        if(!index)
            return this.element[0];
        return this.element;
    }

    window.DOM = DOM

}())