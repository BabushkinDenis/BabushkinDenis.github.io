"use strict";
/* jshint browser:true, jquery:true,browserify:true */
/*
 * 
 sidebar:change_region  Смена региона
 * 
 */
/* jshint ignore:start */

var busEvent = {
    on: function (eventName, handler) {
        var this_ = this,
            eventName_ = eventName;
        eventName.split(",").map(function(e){
            eventName_ = e.trim();
            if (!this_._eventHandlers) {
                this_._eventHandlers = {};
            }
            if (!this_._eventHandlers[eventName_]) {
                this_._eventHandlers[eventName_] = [];
            }
            this_._eventHandlers[eventName_].push(handler);
        });
    },
    off: function (eventName, handler) {
        var handlers = this._eventHandlers && this._eventHandlers[eventName];
        if (!handlers) {
            return;
        }

        handlers.splice(0, handlers.length);

        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] == handler) {
                handlers.splice(i--, 1);
            }
        }
    },
    trigger: function (eventName /*, ... */) {

        if (!this._eventHandlers || !this._eventHandlers[eventName]) {
            return; // обработчиков для события нет
        }

        // вызвать обработчики
        var handlers = this._eventHandlers[eventName];
        for (var i = 0; i < handlers.length; i++) {
            handlers[i].apply(this, [].slice.call(arguments, 1));
        }
    }
};


module.exports = busEvent;

/* jshint ignore:end */