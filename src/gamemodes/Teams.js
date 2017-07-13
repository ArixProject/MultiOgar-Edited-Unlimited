﻿var Mode = require('./Mode');

function Teams() {
    Mode.apply(this, Array.prototype.slice.call(arguments));
    
    this.ID = 1;
    this.name = "Teams";
    this.decayMod = 1.5;
    this.packetLB = 50;
    this.haveTeams = true;
    this.colorFuzziness = 32;
    
    // Special
    this.teamAmount = 3; // Amount of teams. Having more than 3 teams will cause the leaderboard to work incorrectly (client issue).
    this.colors = [{
            'r': 223,
            'g': 0,
            'b': 0
        }, {
            'r': 0,
            'g': 223,
            'b': 0
        }, {
            'r': 0,
            'g': 0,
            'b': 223
        },]; // Make sure you add extra colors here if you wish to increase the team amount [Default colors are: Red, Green, Blue]
    this.nodes = []; // Teams
}

module.exports = Teams;
Teams.prototype = new Mode();

//Gamemode Specific Functions

Teams.prototype.fuzzColorComponent = function (component) {
    component += Math.random() * this.colorFuzziness >> 0;
    return component;
};

Teams.prototype.getTeamColor = function (team) {
    var color = this.colors[team];
    return {
        r: this.fuzzColorComponent(color.r),
        b: this.fuzzColorComponent(color.b),
        g: this.fuzzColorComponent(color.g)
    };
};

// Override

Teams.prototype.onPlayerSpawn = function (gameServer, player) {
    // Random color based on team
    player.setColor(this.getTeamColor(player.team));
    // Spawn player
    gameServer.spawnPlayer(player, gameServer.randomPos());
};

Teams.prototype.onServerInit = function (gameServer) {
    // Set up teams
    for (var i = 0; i < this.teamAmount; i++) {
        this.nodes[i] = [];
    }
    
    // migrate current players to team mode
    for (var i = 0; i < gameServer.clients.length; i++) {
        var client = gameServer.clients[i].playerTracker;
        this.onPlayerInit(client);
        client.setColor(this.getTeamColor(client.team));
        for (var j = 0; j < client.cells.length; j++) {
            var cell = client.cells[j];
            cell.setColor(client.color);
            this.nodes[client.team].push(cell);
        }
    }
};

Teams.prototype.onPlayerInit = function (player) {
    // Get random team
    player.team = Math.floor(Math.random() * this.teamAmount);
};

Teams.prototype.onCellAdd = function (cell) {
    // Add to team list
    this.nodes[cell.owner.team].push(cell);
};

Teams.prototype.onCellRemove = function (cell) {
    // Remove from team list
    var index = this.nodes[cell.owner.team].indexOf(cell);
    if (index != -1) {
        this.nodes[cell.owner.team].splice(index, 1);
    }
};

Teams.prototype.onCellMove = function (cell, gameServer) {
    // Find team
    for (var i = 0; i < cell.owner.visibleNodes.length; i++) {
        // Only collide with player cells
        var check = cell.owner.visibleNodes[i];
        
        if ((check.cellType != 0) || (cell.owner == check.owner)) {
            continue;
        }
        
        // Collision with teammates
        var team = cell.owner.team;
        if (check.owner.team == team) {
            var manifold = gameServer.checkCellCollision(cell, check); // Calculation info
            if (manifold != null) { // Collided
                // Cant eat team members
                !manifold.cell2.canEat(manifold.cell1);
            }
        }
    }
};

Teams.prototype.updateLB = function (gameServer) {
    gameServer.leaderboardType = this.packetLB;
    var total = 0;
    var teamMass = [];
    // Get mass
    for (var i = 0; i < this.teamAmount; i++) {
        // Set starting mass
        teamMass[i] = 0;
        
        // Loop through cells
        for (var j = 0; j < this.nodes[i].length; j++) {
            var cell = this.nodes[i][j];
            if (!cell) continue;
            teamMass[i] += cell._mass;
            total += cell._mass;
        }
    }
    // No players
    if (total <= 0) {
        for (var i = 0; i < this.teamAmount; i++) {
            gameServer.leaderboard[i] = 0;
        }
        return;
    }
    // Calc percentage
    for (var i = 0; i < this.teamAmount; i++) {
        gameServer.leaderboard[i] = teamMass[i] / total;
    }
};
