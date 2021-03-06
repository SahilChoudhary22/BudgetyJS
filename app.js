// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // this function calculates the percentages
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }; 

    // this function returns the calculated percentages
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum; 
    }

    var data = {
        allItems : {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    


    return {
        addItem: function(type, desc, val) {
            var newItem, ID;

            // Assign ID to the new item, ID is the increment of ID of previous item
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            
            
            
            // create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val)
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            // id = 3
            ids = data.allItems[type].map(function(currentval) {
                return currentval.id;
            });

            index = ids.indexOf(id);
            if (index != -1){
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget : function() {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages : function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages : function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        // a function to retreive the data so that we can return it and display on the UI
        getBudget: function() {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },

        testing : function() { 
            console.log(data);
        }

        }

})();


// UI CONTROLLER
var UIController = (function() {

    // We store all DOM strings in a single variable to make the code more organized and easy to modify
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel :'.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num, type) {
        var numSplit, integerr, decimalpart;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        integerr = numSplit[0];

        if(integerr.length > 3) {
            integerr = integerr.substr(0, integerr.length - 3) + ',' + integerr.substr(integerr.length -3, 3);
        } 

        decimalpart = numSplit[1];

        return (type === 'exp' ?'-' :'+') + ' ' + integerr + '.' + decimalpart;

    };

    var nodeListForEach = function(list, callback) {
        for(var i=0; i<list.length; i++) {
            callback(list[i], i); 
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj,type) {
            var html, newHtml;

            // Create HTML string with the placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            //fields will return a list, but we want to loop over it so we wisely convert it into array
            fieldArr = Array.prototype.slice.call(fields);

            // loop over fieldArr
            fieldArr.forEach(function(curval, index, array)  {
                curval.value = "";                
            });

            // set focus back to the description
            fieldArr[0].focus();

        },

        displayPercentages : function(percentages) {
            // this will return a nodelist
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            // we can convert the nodelist to an array by using the slice hack
            // but instead why dont we create our own foreach function for nodelists
            // we can use this function in any of our app we make, its not specific for this one
            

            // calling the function
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            });

        },

        // to display updated budget in the UI
        displayBudget : function(obj) {
            
            // using the ternary operator
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type) ;
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }

        },

        displayMonth : function() {
            var now, month, year;
            
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;
        },

        changedType : function() {

            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue 
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');

        },


        getDOMStrings :function() {
            return DOMStrings
        }
    };

    
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

        // we add event listener to the container because it is the parent where all of the stuff is happening
        document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    
    
    // Updates the budget
    var updateBudget = function() {

        // 5 - Calculate the budget
        budgetCtrl.calculateBudget();

        // 5b - Return the budget
        var budget = budgetCtrl.getBudget();

        // 6 - display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        
        var input, newItem;
        // 1 - get input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2 - Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // 3 - Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4 - Clear the fields
            UICtrl.clearFields();

            // 5 - Calculate and update budget
            updateBudget();

            // 6 - Calculate and update the percentages
            updatePercentages();
        }
    
    }

    var ctrlDelItem = function() {
        var itemID, splitID, type, ID;

        // we bubble up to the parentNode which has the id for the inc obj or exp obj
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        if (itemID) {
            //inc-1
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4 - Calculate and update the percentages
            updatePercentages();
        }
        
    }

    return {
        init: function() {
            console.log("Application has started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            setupEventListeners();

        }
    }
    

})(budgetController, UIController);


// MOST VITAL BECAUSE IT STARTS THE APP
controller.init()