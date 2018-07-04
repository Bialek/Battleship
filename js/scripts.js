var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3, 
    shipSunk: 0,
    ships: [    
                { locations: [0, 0, 0], hits: ["","",""] },
                { locations: [0, 0, 0], hits: ["","",""] },
                { locations: [0, 0, 0], hits: ["","",""] }
            ],
    
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;       
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" +(col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);   
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },

    fire: function(guess) {

        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                
                if (this.isSunk(ship)) {
                    view.displayMessage("you sunk my ship");
                    this.shipSunk++;                 
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("miss");
        return false;
    },

    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;

            }
        }
        return true;
    }
};

var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

};

var controller = {
    guesses: 0,
    shots: [],
    processGuess: function(guess) {
        var location = guess;
        if (this.shots.includes(location)) {
            alert("Już tu strzelałeś");
        } else {
            this.shots.push(location);
        }
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips) {
                alert("Zatopiłeś moje statki po " + this.guesses + " Strzałach. Twoja skuteczność to " + Math.floor(100 / ((this.guesses / model.numShips) / model.numShips)) + "%");
                view.displayMessage("Kliknij tutaj, by zrestartować");
            }
        }
    }
};



window.onload = model.generateShipLocations();

