// Imports
var GameMode = require('../gamemodes');
var Logger = require('./Logger');
var Entity = require('../entity');
var UserRoleEnum = require('../enum/UserRoleEnum');

function Commands() {
    this.list = {}; // Empty
}

module.exports = Commands;

// Utils
var fillChar = function (data, char, fieldLength, rTL) {
    var result = data.toString();
    if (rTL === true) {
        for (var i = result.length; i < fieldLength; i++)
            result = char.concat(result);
    } else {
        for (var i = result.length; i < fieldLength; i++)
            result = result.concat(char);
    }
    return result;
};

// Commands
Commands.list = {
    help: function (gameServer, split) {
       Logger.print("                       ┌────────────────────────────┐                       \n"+
                    "                       │ LIST OF AVAILABLE COMMANDS │                       \n"+
                    "┌──────────────────────┴────────────────────────────┴──────────────────────┐\n"+
                    "│                         ----Players and AI----                           │\n"+
                    "│                                                                          │\n"+
                    "│ playerlist                   │ Get list of players, bots, ID's, etc      │\n"+
                    "│ minion [PlayerID] [#] [name] │ Adds suicide minions to the server        │\n"+
                    "│ addbot [number]              │ Adds bots to the server                   │\n"+
                    "│ kickbot [number]             │ Kick a number of bots                     │\n"+
                    "│ kick [PlayerID]              │ Kick player or bot by client ID           │\n"+
                    "│ kickall                      │ Kick all players and bots                 │\n"+
                    "│ kill [PlayerID]              │ Kill cell(s) by client ID                 │\n"+
                    "│ killall                      │ Kill everyone                             │\n"+
                    "│                                                                          │\n"+
                    "│                          ----Player Commands----                         │\n"+
                    "│                                                                          │\n"+
                    "│ spawn [entity] [pos] [mass]  │ Spawns an entity                          │\n"+
                    "│ mass [PlayerID] [mass]       │ Set cell(s) mass by client ID             │\n"+
                    "│ merge [PlayerID]             │ Merge all client's cells                  │\n"+
                    "│ spawnmass [PlayerID] [mass]  │ Sets a players spawn mass                 │\n"+
                    "│ freeze [PlayerID]            │ Freezes a player                          │\n"+
                    "│ speed [PlayerID]             │ Sets a players base speed                 │\n"+
                    "│ rec [PlayerID]               │ Gives a player instant-recombine          │\n"+
                    "| popsplit [PlayerID]          | Gives a player Perfect Popsplits          |\n"+
                    "│ split [PlayerID] [Amount]    │ Forces a player to split                  │\n"+
                    "│ replace [PlayerID] [entity]  │ Replaces a player with an entity          │\n"+
                    "│ pop [PlayerID]               │ Pops a player with any virus              │\n"+
                    "| explode [PlayerID]           | Explodes a player into ejected mass       |\n"+
                    "│ play [PlayerID]              │ Disable/enables a player from spawning    │\n"+
                    "| userrole [PlayerID] [role]   | Gives a player a User Role temporarily    |\n"+
                    "│                                                                          │\n"+
                    "│                          ----Server Commands----                         │\n"+
                    "│                                                                          │\n"+
                    "│ pause                        │ Pause game, freeze all nodes              │\n"+
                    "│ board [string] [string] ...  │ Set scoreboard text                       │\n"+
                    "│ change [setting] [value]     │ Change specified settings                 │\n"+
                    "│ reload                       │ Reload config file and banlist            │\n"+
                    "│ ban [PlayerID │ IP]          │ Bans a player(s) IP                       │\n"+
                    "│ unban [IP]                   │ Unbans an IP                              │\n"+
                    "│ banlist                      │ Get list of banned IPs.                   │\n"+
                    "│ mute [PlayerID]              │ Mute player from chat                     │\n"+
                    "│ unmute [PlayerID]            │ Unmute player from chat                   │\n"+
                    "| lms                          | Starts/ends last man standing             |\n"+
                    "│                                                                          │\n"+
                    "│                          ----Miscellaneous----                           │\n"+
                    "│                                                                          │\n"+
                    "│ clear                        │ Clear console output                      │\n"+
                    "│ reset                        │ Removes all nodes                         │\n"+
                    "│ status                       │ Get server status                         │\n"+
                    "│ debug                        │ Get/check node lengths                    │\n"+
                    "│ exit                         │ Stop the server                           │\n"+
                    "| restart                      | Restarts the server                       |\n"+
                    "│                                                                          │\n"+
                    "├──────────────────────────────────────────────────────────────────────────┤\n"+
                    '│         Psst! Do "shortcuts" for a list of command shortcuts!            │\n'+
                    "└──────────────────────────────────────────────────────────────────────────┘");
    },
    shortcuts: function (gameServer, split) {
       Logger.print("                       ┌────────────────────────────┐                       \n"+
                    "                       │ LIST OF COMMAND SHORTCUTS  │                       \n"+
                    "┌──────────────────────┴──────┬─────────────────────┴──────────────────────┐\n"+
                    "│ st                          │ Alias for status                           │\n"+
                    "│ pl                          │ Alias for playerlist                       │\n"+
                    "│ m                           │ Alias for mass                             │\n"+
                    "│ sm                          │ Alias for spawnmass                        │\n"+
                    "│ ka                          │ Alias for killall                          │\n"+
                    "│ k                           │ Alias for kill                             │\n"+
                    "│ mg                          │ Alias for merge                            │\n"+
                    "│ s                           │ Alias for speed                            │\n"+
                    "│ mn                          │ Alias for minion                           │\n"+
                    "│ f                           │ Alias for freeze                           │\n"+
                    "│ ab                          │ Alias for addbot                           │\n"+
                    "│ kb                          │ Alias for kickbot                          │\n"+
                    "│ c                           │ Alias for change                           │\n"+
                    "│ n                           │ Alias for name                             │\n"+
                    "│ rep                         │ Alias for replace                          │\n"+
                    "| e                           | Alias for explode                          |\n"+
                    "└─────────────────────────────┴────────────────────────────────────────────┘");
    },
    debug: function (gameServer, split) {
        // Count client cells
        var clientCells = 0;
        for (var i in gameServer.clients) {
            clientCells += gameServer.clients[i].playerTracker.cells.length;
        }
        // Output node information
       Logger.print("Clients:        " + fillChar(gameServer.clients.length, " ", 4, true) + " / " + gameServer.config.serverMaxConnections + " + bots"+"\n"+
                    "Total nodes:" + fillChar(gameServer.nodes.length, " ", 8, true)+"\n"+
                    "- Client cells: " + fillChar(clientCells, " ", 4, true) + " / " + (gameServer.clients.length * gameServer.config.playerMaxCells)+"\n"+
                    "- Ejected cells:" + fillChar(gameServer.nodesEjected.length, " ", 4, true)+"\n"+
                    "- Food:        " + fillChar(gameServer.nodesFood.length, " ", 4, true) + " / " + gameServer.config.foodMaxAmount+"\n"+
                    "- Viruses:      " + fillChar(gameServer.nodesVirus.length, " ", 4, true) + " / " + gameServer.config.virusMaxAmount+"\n"+
                    "Moving nodes:   " + fillChar(gameServer.movingNodes.length, " ", 4, true)+"\n"+
                    "Quad nodes:     " + fillChar(gameServer.quadTree.scanNodeCount(), " ", 4, true)+"\n"+
                    "Quad items:     " + fillChar(gameServer.quadTree.scanItemCount(), " ", 4, true));
    },
    reset: function (gameServer, split) {
        Logger.warn("Removed " + gameServer.nodes.length + " nodes");
        while (gameServer.nodes.length > 0) {
            gameServer.removeNode(gameServer.nodes[0]);
        }
        // just to make sure the jobs done
        while (gameServer.nodesEjected.length > 0) {
            gameServer.removeNode(gameServer.nodesEjected[0]);
        }
        while (gameServer.nodesFood.length > 0) {
            gameServer.removeNode(gameServer.nodesFood[0]);
        }
        while (gameServer.nodesVirus.length > 0) {
            gameServer.removeNode(gameServer.nodesVirus[0]);
        }
        Commands.list.killall(gameServer, split);
    },
    gamemode: function (gameServer, split) {
        var mode = parseInt(split[1]);
        if (isNaN(mode)) {
            Logger.warn("Invalid Game Mode Selected!");
            return;
        }
        if (mode > 8 || mode < 0) {
            Logger.warn("Invalid Game Mode Selected!");
            return;
        }
        var gamemode = GameMode.get(mode);
        // Reset
        gameServer.gameMode.packetLB = gamemode.packetLB;
        gameServer.gameMode.updateLB = gamemode.updateLB;
        Commands.list.reset(gameServer, split);
        gameServer.loadFiles(); // Load Config In case Previous Gamemodes changed them
        gameServer.gameMode = gamemode;
        gamemode.onServerInit(gameServer);
        Commands.list.reset(gameServer, split); // Just in case
        Logger.print("Successfully Changed Game Mode to: " + gameServer.gameMode.name);
    },
    minion: function(gameServer, split) {
        var id = parseInt(split[1]);
        var add = parseInt(split[2]);
        var name = split.slice(3, split.length).join(' ');
            
        // Error! ID is NaN
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player id!");
            return;
        }
        
        // Find ID specified and add/remove minions for them
        for (var i in gameServer.clients) {
            var client = gameServer.clients[i].playerTracker;
            
            if (client.pID == id) {
                // Remove minions
                if (client.minionControl == true && isNaN(add)) {
                    client.minionControl = false;
                    client.miQ = 0;
                    Logger.print("Succesfully removed minions for " + client._name);
                // Add minions
                } else {
                    client.minionControl = true;
                    // Add minions for client
                    if (isNaN(add)) add = 1; 
                    for (var i = 0; i < add; i++) {
                        gameServer.bots.addMinion(client, name);
                    }
                    Logger.print("Added " + add + " minions for " + client._name);
                }
                break;
            }
        }
    },
    addbot: function (gameServer, split) {
        var add = parseInt(split[1]);
        if (isNaN(add)) {
            add = 1; // Adds 1 bot if user doesnt specify a number
        }
        
        for (var i = 0; i < add; i++) {
            gameServer.bots.addBot();
        }
        Logger.print("Added " + add + " player bots");
    },
    ban: function (gameServer, split) {
        // Error message
        var logInvalid = "Please specify a valid player ID or IP address!";
        
        if (split[1] == null) {
            // If no input is given; added to avoid error
            Logger.warn(logInvalid);
            return;
        }
        
        if (split[1].indexOf(".") >= 0) {
            // If input is an IP address
            var ip = split[1];
            var ipParts = ip.split(".");
            
            // Check for invalid decimal numbers of the IP address
            for (var i in ipParts) {
                if (i > 1 && ipParts[i] == "*") {
                    // mask for sub-net
                    continue;
                }
                // If not numerical or if it's not between 0 and 255
                // TODO: Catch string "e" as it means "10^".
                if (isNaN(ipParts[i]) || ipParts[i] < 0 || ipParts[i] >= 256) {
                    Logger.warn(logInvalid);
                    return;
                }
            }
            
            if (ipParts.length != 4) {
                // an IP without 3 decimals
                Logger.warn(logInvalid);
                return;
            }
            ban(gameServer, split, ip);
            return;
        }
        // if input is a Player ID
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            // If not numerical
            Logger.warn(logInvalid);
            return;
        }
        ip = null;
        for (var i in gameServer.clients) {
            var client = gameServer.clients[i];
            if (client == null || !client.isConnected)
                continue;
            if (client.playerTracker.pID == id) {
                ip = client._socket.remoteAddress;
                break;
            }
        }
        if (ip) ban(gameServer, split, ip);
        else Logger.warn("Player ID " + id + " not found!");
    },
    banlist: function (gameServer, split) {
        Logger.print("Showing " + gameServer.ipBanList.length + " banned IPs: ");
        Logger.print(" IP              | IP ");
        Logger.print("───────────────────────────────────");
                      
        for (var i = 0; i < gameServer.ipBanList.length; i += 2) {
            Logger.print(" " + fillChar(gameServer.ipBanList[i], " ", 15) + " | " 
                    + (gameServer.ipBanList.length === i + 1 ? "" : gameServer.ipBanList[i + 1])
            );
        }
    },
    kickbot: function (gameServer, split) {
        var toRemove = parseInt(split[1]);
        if (isNaN(toRemove)) {
            toRemove = -1; // Kick all bots if user doesnt specify a number
        }
        if (toRemove < 1) {
            Logger.warn("Invalid argument!");
            return;
        }
        var removed = 0;
        for (var i = 0; i < gameServer.clients.length; i++) {
            var socket = gameServer.clients[i];
            if (socket.isConnected != null) continue;
            socket.close();
            removed++;
            if (removed >= toRemove)
                break;
        }
        if (removed == 0)
            Logger.warn("Cannot find any bots");
        else if (toRemove == removed)
            Logger.warn("Kicked " + removed + " bots");
        else
            Logger.warn("Only " + removed + " bots were kicked");
    },
    board: function (gameServer, split) {
        var newLB = [], reset = split[1];
        for (var i = 1; i < split.length; i++) {
            if (split[i]) {
                newLB[i - 1] = split[i];
            } else {
                newLB[i - 1] = " ";
            }
        }
        
        // Clears the update leaderboard function and replaces it with our own
        gameServer.gameMode.packetLB = 48;
        gameServer.gameMode.specByLeaderboard = false;
        gameServer.gameMode.updateLB = function (gameServer) {
            gameServer.leaderboard = newLB;
            gameServer.leaderboardType = 48;
        };
        if (reset != "reset") {
            Logger.print("Successfully changed leaderboard values");
            Logger.print('Do "board reset" to reset leaderboard');
        }
        if (reset == "reset") {
            // Gets the current gamemode
            var gm = GameMode.get(gameServer.gameMode.ID);
        
            // Replace functions
            gameServer.gameMode.packetLB = gm.packetLB;
            gameServer.gameMode.updateLB = gm.updateLB;
            Logger.print("Successfully reset leaderboard");
        }
    },
    change: function (gameServer, split) {
        if (split.length < 3) {
            Logger.warn("Invalid command arguments");
            return;
        }
        var key = split[1];
        var value = split[2];
        
        // Check if int/float
        if (value.indexOf('.') != -1) {
            value = parseFloat(value);
        } else {
            value = parseInt(value);
        }
        
        if (value == null || isNaN(value)) {
            Logger.warn("Invalid value: " + value);
            return;
        }
        if (!gameServer.config.hasOwnProperty(key)) {
            Logger.warn("Unknown config value: " + key);
            return;
        }
        gameServer.config[key] = value;
        
        // update/validate
        gameServer.config.playerMinSize = Math.max(32, gameServer.config.playerMinSize);
        Logger.setVerbosity(gameServer.config.logVerbosity);
        Logger.setFileVerbosity(gameServer.config.logFileVerbosity);
        Logger.print("Set " + key + " = " + gameServer.config[key]);
    },
    clear: function () {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    },
    exit: function (gameServer, split) {
        Logger.warn("Closing server...");
        gameServer.wsServer.close();
        process.exit(1);
    },
    restart: function(gameServer) {
        Logger.warn("Restarting server...");
        gameServer.wsServer.close();
        process.exit(3)
    },
    kick: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        // kick player
        var count = 0;
        gameServer.clients.forEach(function (socket) {
            if (socket.isConnected == false)
               return;
            if (id != 0 && socket.playerTracker.pID != id)
                return;
            // remove player cells
            Commands.list.kill(gameServer, split);
            // disconnect
            socket.close(1000, "Kicked from server");
            var name = socket.playerTracker._name;
            Logger.print("Kicked \"" + name + "\"");
            gameServer.sendChatMessage(null, null, "Kicked \"" + name + "\""); // notify to don't confuse with server bug
            count++;
        }, this);
        if (count > 0) return;
        if (id == 0)
            Logger.warn("No players to kick!");
        else
            Logger.warn("Player with ID " + id + " not found!");
    },
    mute: function (gameServer, args) {
        if (!args || args.length < 2) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var id = parseInt(args[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var player = playerById(id, gameServer);
        if (player == null) {
            Logger.warn("Player with id=" + id + " not found!");
            return;
        }
        if (player.isMuted) {
            Logger.warn("Player with id=" + id + " already muted!");
            return;
        }
        Logger.print("Player \"" + player._name + "\" was muted");
        player.isMuted = true;
    },
    unmute: function (gameServer, args) {
        if (!args || args.length < 2) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var id = parseInt(args[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var player = playerById(id, gameServer);
        if (player == null) {
            Logger.warn("Player with id=" + id + " not found!");
            return;
        }
        if (!player.isMuted) {
            Logger.warn("Player with id=" + id + " already not muted!");
            return;
        }
        Logger.print("Player \"" + player._name + "\" was unmuted");
        player.isMuted = false;
    },
    kickall: function (gameServer, split) {
        this.id = 0; //kick ALL players
        // kick player
        var count = 0;
        gameServer.clients.forEach(function (socket) {
            if (socket.isConnected == false)
               return;
            if (this.id != 0 && socket.playerTracker.pID != this.id)
                return;
            // remove player cells
            Commands.list.killall(gameServer, split);
            // disconnect
            socket.close(1000, "Kicked from server");
            var name = socket.playerTracker._name;
            Logger.print("Kicked \"" + name + "\"");
            gameServer.sendChatMessage(null, null, "Kicked \"" + name + "\""); // notify to don't confuse with server bug
            count++;
        }, this);
        if (count > 0) return;
        if (this.id == 0)
            Logger.warn("No players to kick!");
        else
            Logger.warn("Player with ID " + this.id + " not found!");
    },
    kill: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        
        var count = 0;
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                    count++;
                }
                
                Logger.print("Killed " + client._name + " and removed " + count + " cells");
                break;
            }
        }
    },
    killall: function (gameServer, split) {
        var count = 0;
        for (var i = 0; i < gameServer.clients.length; i++) {
            var playerTracker = gameServer.clients[i].playerTracker;
            while (playerTracker.cells.length > 0) {
                gameServer.removeNode(playerTracker.cells[0]);
                count++;
            }
        }
        if (this.id) Logger.print("Removed " + count + " cells");
    },
    mass: function (gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var amount = parseInt(split[2]);
        if (isNaN(amount)) {
            Logger.warn("Please specify a valid number");
            return;
        }
        var size = Math.sqrt(amount * 100);
        
        // Sets mass to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].setSize(size);
                }
                Logger.print("Set mass of " + client._name + " to " + (size * size / 100).toFixed(3));
                break;
            }
        }
    },
    spawnmass: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        
        var amount = Math.max(parseInt(split[2]), 9);
        var size = Math.sqrt(amount * 100);
        if (isNaN(amount)) {
            Logger.warn("Please specify a valid mass!");
            return;
        }

        // Sets spawnmass to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.spawnmass = size;
                Logger.print("Set spawnmass of "+ client._name + " to " + (size * size / 100).toFixed(3));
            }
        }
    },   
    speed: function (gameServer, split) {
        var id = parseInt(split[1]);
        var speed = parseInt(split[2]);
        if (isNaN(id)) {
            Logger.print("Please specify a valid player ID!");
            return;
        }
        
        if (isNaN(speed)) {
            Logger.print("Please specify a valid speed!");
            return;
        }

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.customspeed = speed;
                // override getSpeed function from PlayerCell
                Entity.PlayerCell.prototype.getSpeed = function () {
                    var speed = 2.1106 / Math.pow(this._size, 0.449);
                    // tickStep = 40ms
                    this._speed = (this.owner.customspeed > 0) ? 
                    speed * 40 * this.owner.customspeed : // Set by command
                    speed * 40 * this.gameServer.config.playerSpeed;
                    return this._speed;
                };
            }
        }
        Logger.print("Set base speed of "+ client._name + " to " + speed);
    },
    merge: function (gameServer, split) {
        // Validation checks
        var id = parseInt(split[1]);
        var set = split[2];
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        
        // Find client with same ID as player entered
        var client;
        for (var i = 0; i < gameServer.clients.length; i++) {
            if (id == gameServer.clients[i].playerTracker.pID) {
                client = gameServer.clients[i].playerTracker;
                break;
            }
        }
        
        if (!client) {
            Logger.warn("Client is nonexistent!");
            return;
        }
        
        if (client.cells.length == 1) {
            Logger.warn("Client already has one cell!");
            return;
        }
        
        // Set client's merge override
        var state;
        if (set == "true") {
            client.mergeOverride = true;
            client.mergeOverrideDuration = 100;
            state = true;
        } else if (set == "false") {
            client.mergeOverride = false;
            client.mergeOverrideDuration = 0;
            state = false;
        } else {
            if (client.mergeOverride) {
                client.mergeOverride = false;
                client.mergeOverrideDuration = 0;
            } else {
                client.mergeOverride = true;
                client.mergeOverrideDuration = 100;
            }
            state = client.mergeOverride;
        }
        if (state) Logger.print(client._name + " is now force merging");
        else Logger.print(client._name + " isn't force merging anymore");
    },
    rec: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        
        // set rec for client
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.rec = !client.rec;
                if (client.rec) Logger.print(client._name + " is now in rec mode!");
                else Logger.print(client._name + " is no longer in rec mode");
            }
        }
    },
    popsplit: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }

        for (var i in gameServer.clients) {
            var client = gameServer.clients[i].playerTracker;
            if (client.pID == id) {
                client.perfectpopsplit = !client.perfectpopsplit;
                if (client.perfectpopsplit) Logger.print(client._name + " is now in popsplit mode!");
                else Logger.print(client._name + " is no longer in popsplit mode");
            }
        }
    },
    split: function (gameServer, split) {
        var id = parseInt(split[1]);
        var count = parseInt(split[2]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        if (isNaN(count)) {
            Logger.print("Split player 4 times");
            count = 4;
        }
        if (count > gameServer.config.playerMaxCells) {
            Logger.print("Split player to playerMaxCells");
            count = gameServer.config.playerMaxCells;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var i = 0; i < count; i++) {
                    gameServer.splitCells(client);
                }
                Logger.print("Forced " + client._name + " to split " + count + " times");
                break;
            }
        }
    },

    unban: function (gameServer, split) {
        if (split.length < 2 || split[1] == null || split[1].trim().length < 1) {
            Logger.warn("Please specify a valid IP!");
            return;
        }
        var ip = split[1].trim();
        var index = gameServer.ipBanList.indexOf(ip);
        if (index < 0) {
            Logger.warn("IP " + ip + " is not in the ban list!");
            return;
        }
        gameServer.ipBanList.splice(index, 1);
        saveIpBanList(gameServer);
        Logger.print("Unbanned IP: " + ip);
    },
    userrole: function(gameServer, split) {
        // Temporarily changes the User Role of a player until that player leaves the server.
        var id = parseInt(split[1]);
        var role = split[2]
        if(isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        if (role != "admin" && role != "moder" && role != "user" && role != "guest" || role == null) {
            Logger.warn("Please specify a valid Role!");
            return;
        }
        for (var i in gameServer.clients) {
            var client = gameServer.clients[i].playerTracker;
            if (client.pID == id) {
                if (role == "admin") {
                    client.userRole = UserRoleEnum.ADMIN;
                    Logger.print("Successfully changed " + getName(client._name) + "'s Role to Admin");
                    gameServer.sendChatMessage(null, client, "You have been temporarily changed to ADMIN."); // notify
                } else if (role == "moder") {
                    client.userRole = UserRoleEnum.MODER;
                    Logger.print("Successfully changed " + getName(client._name) + "'s Role to Moder");
                    gameServer.sendChatMessage(null, client, "You have been temporarily changed to MODER."); // notify
                } else if (role == "user") {
                    client.userRole = UserRoleEnum.USER;
                    Logger.print("Successfully changed " + getName(client._name) + "'s Role to User!");
                    gameServer.sendChatMessage(null, client, "You have been temporarily changed to USER."); // notify
                } else {
                    client.userRole = UserRoleEnum.GUEST;
                    Logger.print("Successfully changed " + getName(client._name) + "'s Role to Guest!");
                    gameServer.sendChatMessage(null, client, "You have been temporarily changed to GUEST."); // notify
                }
            }
        }
    },
    playerlist: function (gameServer, split) {
        Logger.print("\nCurrent players: " + gameServer.clients.length);
        Logger.print('Do "playerlist m" or "pl m" to list minions\n');
        Logger.print(" ID     | IP              | P | CELLS | SCORE  |   POSITION   | " + fillChar('NICK', ' ', gameServer.config.playerMaxNickLength) + " "); // Fill space
        Logger.print(fillChar('', '─', ' ID     | IP              | CELLS | SCORE  |   POSITION   |   |  '.length + gameServer.config.playerMaxNickLength));
        var sockets = gameServer.clients.slice(0);
        sockets.sort(function (a, b) { return a.playerTracker.pID - b.playerTracker.pID; });
        for (var i = 0; i < sockets.length; i++) {
            var socket = sockets[i];
            var client = socket.playerTracker;
            var ip = (client.isMi) ? "[MINION]" : "[BOT]";
            var type = split[1];
            
            // list minions
            if (client.isMi) {
                if (typeof type == "undefined" || type == "" || type != "m") {
                    continue;
                } else if (type == "m") {
                    ip = "[MINION]";
                }
            }
            
            // ID with 3 digits length
            var id = fillChar((client.pID), ' ', 6, true);
            
            // Get ip (15 digits length)
            if (socket.isConnected != null) {
                ip = socket.remoteAddress;
            }
            ip = fillChar(ip, ' ', 15);
            var protocol = gameServer.clients[i].packetHandler.protocol;
            if (protocol == null)
                protocol = "?";
            // Get name and data
            var nick = '',
                cells = '',
                score = '',
                position = '',
                data = '';
            if (socket.closeReason != null) {
                // Disconnected
                var reason = "[DISCONNECTED] ";
                if (socket.closeReason.code)
                    reason += "[" + socket.closeReason.code + "] ";
                if (socket.closeReason.message)
                    reason += socket.closeReason.message;
                Logger.print(" " + id + " | " + ip + " | " + protocol + " | " + reason);
            } else if (!socket.packetHandler.protocol && socket.isConnected) {
                Logger.print(" " + id + " | " + ip + " | " + protocol + " | " + "[CONNECTING]");
            } else if (client.spectate) {
                nick = "in free-roam";
                if (!client.freeRoam) {
                    var target = client.getSpectateTarget();
                    if (target != null) {
                        nick = target._name;
                    }
                }
                data = fillChar("SPECTATING: " + nick, '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                Logger.print(" " + id + " | " + ip + " | " + protocol + " | " + data);
            } else if (client.cells.length > 0) {
                nick = fillChar(client._name, ' ', gameServer.config.playerMaxNickLength);
                cells = fillChar(client.cells.length, ' ', 5, true);
                score = fillChar((client._score / 100) >> 0, ' ', 6, true);
                position = fillChar(client.centerPos.x >> 0, ' ', 5, true) + ', ' + fillChar(client.centerPos.y >> 0, ' ', 5, true);
                Logger.print(" " + id + " | " + ip + " | " + protocol + " | " + cells + " | " + score + " | " + position + " | " + nick);
            } else {
                // No cells = dead player or in-menu
                data = fillChar('DEAD OR NOT PLAYING', '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                Logger.print(" " + id + " | " + ip + " | " + protocol + " | " + data);
            }
        }
    },
    pause: function (gameServer, split) {
        gameServer.run = !gameServer.run; // Switches the pause state
        var s = gameServer.run ? "Unpaused" : "Paused";
        Logger.print(s + " the game.");
    },
    freeze: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.print("Please specify a valid player ID!");
            return;
        }

        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.frozen = !client.frozen;
                if (client.frozen) {
                    Logger.print("Froze " + client._name);
                } else {
                    Logger.print("Unfroze " + client._name);
                }
                break;
            }
        }
    },
    reload: function (gameServer, split) {
        gameServer.loadFiles();
        Logger.print("Reloaded the config file succesully");
    },
    status: function (gameServer, split) {
        var ini = require('./ini.js');
        // Get amount of humans/bots
        var humans = 0,
            bots = 0;
        for (var i = 0; i < gameServer.clients.length; i++) {
            if ('_socket' in gameServer.clients[i]) {
                humans++;
            } else {
                bots++;
            }
        }
        
        Logger.print("Connected players: " + gameServer.clients.length + "/" + gameServer.config.serverMaxConnections);
        Logger.print("Players: " + humans + " - Bots: " + bots);
        Logger.print("Server has been running for " + Math.floor(process.uptime() / 60) + " minutes");
        Logger.print("Current memory usage: " + Math.round(process.memoryUsage().heapUsed / 1048576 * 10) / 10 + "/" + Math.round(process.memoryUsage().heapTotal / 1048576 * 10) / 10 + " mb");
        Logger.print("Current game mode: " + gameServer.gameMode.name);
        Logger.print("Current update time: " + gameServer.updateTimeAvg.toFixed(3) + " [ms]  (" + ini.getLagMessage(gameServer.updateTimeAvg) + ")");
    },
    spawn: function (gameServer, split) {
        var ent = split[1];
        if (typeof ent == "undefined" || ent == "" || (ent != "virus" && ent != "food" && ent != "mothercell")) {
            Logger.warn("Please specify either virus, food, or mothercell");
            return;
        }
    
        var pos = {
            x: parseInt(split[2]),
            y: parseInt(split[3])
        };
        var mass = parseInt(split[4]);
        
        // Make sure the input values are numbers
        if (isNaN(pos.x) || isNaN(pos.y)) {
            Logger.warn("Invalid coordinates");
            return;
        }
        
        // Start size for each entity 
        if (ent == "virus") {
            var size = gameServer.config.virusMinSize;
        } else if (ent == "mothercell") {
            size = gameServer.config.virusMinSize * 2.5;
        } else if (ent == "food") {
            size = gameServer.config.foodMinMass;
        }
        
        if (!isNaN(mass)) {
            size = Math.sqrt(mass * 100);
        }
        
        // Spawn for each entity
        if (ent == "virus") {
            var virus = new Entity.Virus(gameServer, null, pos, size);
            gameServer.addNode(virus);
            Logger.print("Spawned 1 virus at (" + pos.x + " , " + pos.y + ")");
        } else if (ent == "food") {
            var food = new Entity.Food(gameServer, null, pos, size);
            food.setColor(gameServer.getRandomColor());
            gameServer.addNode(food);
            Logger.print("Spawned 1 food cell at (" + pos.x + " , " + pos.y + ")");
        } else if (ent == "mothercell") {
            var mother = new Entity.MotherCell(gameServer, null, pos, size);
            gameServer.addNode(mother);
            Logger.print("Spawned 1 mothercell at (" + pos.x + " , " + pos.y + ")");
        }
    },
    replace: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        var ent = split[2];
        if (typeof ent == "undefined" || ent == "" || (ent != "virus" && ent != "food" && ent != "mothercell")) {
            Logger.warn("Please specify either virus, food, or mothercell");
            return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                while (client.cells.length > 0) {
                    var cell = client.cells[0];
                    gameServer.removeNode(cell);
                    // replace player with entity
                    if (ent == "virus") {
                        var virus = new Entity.Virus(gameServer, null, cell.position, cell._size);
                        gameServer.addNode(virus);
                        Logger.print("Replaced " + client._name + " with a virus");
                    } else if (ent == "food") {
                        var food = new Entity.Food(gameServer, null, cell.position, cell._size);
                        food.setColor(gameServer.getRandomColor());
                        gameServer.addNode(food);
                        Logger.print("Replaced " + client._name + " with a food cell");
                    } else if (ent == "mothercell") {
                        var mother = new Entity.MotherCell(gameServer, null, cell.position, cell._size);
                        gameServer.addNode(mother);
                        Logger.print("Replaced " + client._name + " with a mothercell");
                    }
                }
            }
        }
    },
    pop: function (gameServer, split) {
        var id = parseInt(split[1]);
        var type = parseInt(split[2]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        if (isNaN(type)) {
            Logger.warn("Please specify a valid virus ID!");
            Logger.info("1 is for a normal virus.");
            Logger.info("2 is for a Lottery virus.");
            Logger.info("3 is for a Popsplit Virus.");
            return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                if (type == 1) {
                var virus = new Entity.Virus(gameServer, null, client.centerPos, gameServer.config.virusMinSize);
                gameServer.addNode(virus);
                } else if (type == 2) {
                var lottery = new Entity.Lottery(gameServer, null, client.centerPos, gameServer.config.virusMinSize);
                gameServer.addNode(lottery);
                }
                else if ( type == 3) {
                var popsplitVirus = new Entity.PopsplitVirus(gameServer, null, client.centerPos, gameServer.config.virusMinSize);
                gameServer.addNode(popsplitVirus);
                }
                else {
                Logger.warn("Please specify a valid virus ID!");
                Logger.info("1 is for a normal virus.");
                Logger.info("2 is for a Lottery virus.");
                Logger.info("3 is for a Popsplit Virus.");
                return;
                }
                Logger.print("Popped " + client._name);
            }
        }
    },
    explode: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var i = 0; i < client.cells.length; i++) {
                    var cell = client.cells[i];
                    while (cell._size > gameServer.config.playerMinSize) {
                        // remove mass from parent cell
                        var loss = gameServer.config.ejectSizeLoss;
                        var sq = cell._sizeSquared - loss * loss;
                        cell.setSize(Math.sqrt(sq));
                        // explode the cell
                        var dx = client.mouse.x - cell.position.x;
                        var dy = client.mouse.y - cell.position.y;
                        dx /= Math.sqrt(dx * dx + dy * dy);
                        dy /= Math.sqrt(dx * dx + dy * dy);
                        var pos = {
                            x: cell.position.x + dx * cell._size,
                            y: cell.position.y + dy * cell._size
                        };
                        var ejected = new Entity.EjectedMass(gameServer, null, pos, gameServer.config.ejectSize);
                        ejected.setColor(cell.color);
                        ejected.setBoost(780 * Math.random(), 6.28 * Math.random());
                        gameServer.addNode(ejected);
                    }
                    cell.setSize(gameServer.config.playerMinSize);
                }
            }
        }
    },
    play: function (gameServer, split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            Logger.warn("Please specify a valid player ID!");
            return;
        }
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.disableSpawn = !client.disableSpawn;
                if (client.disableSpawn) {
                    Commands.list.kill(gameServer, split);
                    Logger.print("Disabled spawning for " + client._name);
                } else {
                    Logger.print("Enabled spawning for " + client._name);
                }
            }
        }
    },
    lms: function (gameServer, split) {
        for (var i in gameServer.clients) {
            var client = gameServer.clients[i].playerTracker;
            var state = false;
            state = !state;
            if (state) client.disableSpawn = true;
            else client.disableSpawn = false;
        }
        if (state) Logger.print("Started last man standing");
        else Logger.print("Stopped last man standing");
    },
    
    // Aliases for commands
    
    st: function (gameServer, split) { // Status
        Commands.list.status(gameServer, split);
    },
    pl: function (gameServer, split) { // Playerlist
        Commands.list.playerlist(gameServer, split);
    },
    m: function (gameServer, split) { // Mass
        Commands.list.mass(gameServer, split);
    },
    mn: function (gameServer, split) { // Minion
        Commands.list.minion(gameServer, split);
    },
    sm: function (gameServer, split) { // Spawnmass
        Commands.list.spawnmass(gameServer, split);
    },
    ka: function (gameServer, split) { // Killall
        Commands.list.killall(gameServer, split);
    },
    k: function (gameServer, split) { // Kill
        Commands.list.kill(gameServer, split);
    },
    mg: function (gameServer, split) { // Merge
        Commands.list.merge(gameServer, split);
    },
    s: function (gameServer, split) { // Speed
        Commands.list.speed(gameServer, split);
    },
    f: function (gameServer, split) { // Freeze
        Commands.list.freeze(gameServer, split);
    },
    ab: function (gameServer, split) { // Addbot
        Commands.list.addbot(gameServer, split); 
    },
    kb: function (gameServer, split) { // Kickbot
        Commands.list.kickbot(gameServer, split);
    },
    c: function (gameServer, split) { // Change
        Commands.list.change(gameServer, split);
    },
    n: function (gameServer, split) { // Name
        Commands.list.name(gameServer, split);
    },
    rep: function (gameServer, split) {
        Commands.list.replace(gameServer, split);
    },
    e: function (gameServer, split) {
        Commands.list.explode(gameServer, split);
    }
};

// functions from GameServer

function playerById (id, gameServer) {
    if (id == null) return null;
    for (var i = 0; i < gameServer.clients.length; i++) {
        var playerTracker = gameServer.clients[i].playerTracker;
        if (playerTracker.pID == id) {
            return playerTracker;
        }
    }
    return null;
}

function saveIpBanList (gameServer) {
    var fs = require("fs");
    try {
        var blFile = fs.createWriteStream('../src/ipbanlist.txt');
        // Sort the blacklist and write.
        gameServer.ipBanList.sort().forEach(function (v) {
            blFile.write(v + '\n');
        });
        blFile.end();
        Logger.info(gameServer.ipBanList.length + " IP ban records saved.");
    } catch (err) {
        Logger.error(err.stack);
        Logger.error("Failed to save " + '../src/ipbanlist.txt' + ": " + err.message);
    }
}

function ban (gameServer, split, ip) {
    var ipBin = ip.split('.');
    if (ipBin.length != 4) {
        Logger.warn("Invalid IP format: " + ip);
        return;
    }
    gameServer.ipBanList.push(ip);
    if (ipBin[2] == "*" || ipBin[3] == "*") {
        Logger.print("The IP sub-net " + ip + " has been banned");
    } else {
        Logger.print("The IP " + ip + " has been banned");
    }
    gameServer.clients.forEach(function (socket) {
        // If already disconnected or the ip does not match
        if (socket == null || !socket.isConnected || !gameServer.checkIpBan(socket.remoteAddress))
            return;
        // remove player cells
        Commands.list.kill(gameServer, split);
        // disconnect
        socket.close(null, "Banned from server");
        var name = socket.playerTracker._name;
        Logger.print("Banned: \"" + name + "\" with Player ID " + socket.playerTracker.pID);
        gameServer.sendChatMessage(null, null, "Banned \"" + name + "\""); // notify to don't confuse with server bug
    }, gameServer);
    saveIpBanList(gameServer);
}
