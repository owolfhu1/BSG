let MAX_RESOURCE=15;

let CharacterEnum = Object.freeze({
	LADAMA:"Lee Adama",
	BADAMA:"Bill Adama",
	BALTAR:"Gaius Baltar",
	TYROL:"Galen Tyrol",
	THRACE:"Kara Thrace",
	AGATHON:"Karl Agathon",
	ROSLIN:"Laura Roslin",
	VALERII:"Sharon Valerii",
	TIGH:"Saul Tigh",
	ZAREK:"Tom Zarek",
});

let LocationEnum = Object.freeze({
	
	//Colonial One	
	PRESS_ROOM:"Press Room",
	PRESIDENTS_OFFICE:"President's Office",
	ADMINISTRATION:"Administration",
	
	//Cylon Locations
	CAPRICA:"Caprica",
	CYLON_FLEET:"Cylon Fleet",
	HUMAN_FLEET:"Human Fleet",
	RESURRECTION_SHIP:"Resurrection Ship",
		
	//Galactica
	FTL_CONTROL:"FTL Control",
	WEAPONS_CONTROL:"Weapons Control",
	COMMUNICATIONS:"Communications",
	RESEARCH_LAB:"Research Lab",
	COMMAND:"Command",
	ADMIRALS_QUARTERS:"Admiral's Quarters",
	HANGAR_DECK:"Hangar Deck",
	ARMORY:"ARMORY",
	SICKBAY:"SICKBAY",
	BRIG:"BRIG",
	
});

let SpaceEnum = Object.freeze({
	NE:"Northeast",
	E:"East",
	SE:"Southeast",
	SW:"Southwest",
	W:"West",
	NW:"Northwest",	
});

function Game(){
	this.players=[];
	this.currentPlayer=-1;
	this.activePlayer=-1;
	this.currentActionsRemaining=-1;
	this.activeActionsRemaining=-1;
	this.spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
	this.locations=
	
	this.vipersInHangar=8;
	this.raptorsInHangar=4;
	this.damagedVipers=0;
	this.fuelAmount=8;
	this.foodAmount=8;
	this.moraleAmount=10;
	this.populationAmount=12;
	
	//Decks
	this.loyaltyDeck=[];
	this.destinationDeck=[];
	this.crisisDeck=[];
	this.crisisDiscard=[];
	this.superCrisisDeck=[];
	this.superCrisisDiscard=[];
	this.politicsSkillDeck=[];
	this.politicsSkillDiscard=[];
	this.leadershipSkillDeck=[];
	this.leadershipSkillDiscard=[];
	this.tacticsSkillDeck=[];
	this.tacticsSkillDiscard=[];
	this.pilotingSkillDeck=[];
	this.pilotingSkillDiscard=[];
	this.engineeringSkillDeck=[];
	this.engineeringSkillDiscard=[];
	this.destinyDeck=[];
	this.quorumDeck=[];
	this.quorumDiscard=[];
	this.galacticaDamageDeck=[];
	this.basestarDamageDeck=[];
	this.civilianShipDeck=[];
	
	this.centurionTrack=[0,0,0,0];
	this.jumpTrack=0;
	this.damagedLocation=[false,false,false,false,false,false,false];// make associative
	this.nukesRemaining=2;
	this.currentPresident=-1;
	this.currentAdmiral=-1;
	this.skillCheckCards=[];
	
}

function Player(userId){
	this.id=userId;
	this.character=-1;
	this.hand=[];
	this.loyalty=[-1,-1,-1];
	this.usedOncePerGame=false;
	this.isRevealedCylon=false;
}

function Ship(type){
	this.type=type;
	this.location=-1;
	this.pilot=-1;
	this.damage=[-1,-1];
	this.resource=-1;
}

let players={};


let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html') );
http.listen(port,() => console.log('listening on *:' + port) );

//holds online users
const users = {};

io.on('connection', socket => {
    
    let userId = socket.id;
    let name = 'error';

    //send a message to the user
    io.to(userId).emit('game_text', '<p>The server says: welcome to the server!</p>');
    
    //send a message to all connected sockets
    io.sockets.emit('game_text', '<p>A new user has just connected</p>');
    
    //receives emit type 'text' and sends the data back to all clients
    //this can be expanded to do diffrent things depending on what data is
    socket.on('chat', text => io.sockets.emit('chat', text));
    
    //logs in user if username not in use
    socket.on('login', username => {
        console.log('login attempt');
        if (!(username in users)) {
            console.log('login!');
            users[username] = userId;
            name = username;
            //tell client they have logged in with name name
            io.to(userId).emit('login', name);
        }
    });
    
    socket.on('game_text', text => {
    	runCommand(text,userId);
    });
    
    //when a user disconnects remove them from users
    socket.on('disconnect', () => delete users[name]);
    
});

function runCommand(text,userId){
	//this is an example
        if (text === 'something')
            io.to(userId).emit('game_text', '<p>something command</p>');
        else if (text === 'something else')
            io.to(userId).emit('game_text', '<p>something else command</p>');
        else
            io.to(userId).emit('game_text', '<p>that is not a valid command</p>')
        
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}