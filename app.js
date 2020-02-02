// BUDGET CONTROLLER
var budgetController = (function() {

    // Some code
})();


// UI CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings :function() {
            return DOMStrings
        }
    };

    // Some code
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();

        }

        });

    }    

    var ctrlAddItem = function() {
        var input = UICtrl.getInput();
        // 1 - get input data
        // 2 - Add the item to the budget controller
        // 3 - Add the new item to the UI
        // 4 - Calculate the budget
        // 5 - display the budget on the UI

    }

    return {
        init: function() {
            console.log("Application has started")
            setupEventListeners()
        }
    }
    

})(budgetController, UIController);


// MOST VITAL BECAUSE IT STARTS THE APP
controller.init()