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

let SkillCardEnum = Object.freeze({
	REPAIR_:"Repair 1",
	REPAIR_2:"Repair 2",
	RESEARCH_3:"Research 3",
	RESEARCH_4:"Research 4",
	RESEARCH_5:"Research 5",
	EMERGENCY_3:"Emergency 3",
	EMERGENCY_4:"Emergency 4",
	EMERGENCY_5:"Emergency 5",
	XO_1:"XO 1",
	XO_2:"XO 2",
	EVASIVE_1:"Evasive 1",
	EVASIVE_2:"Evasive 2",
	FIREPOWER_3:"Firepower 3",
	FIREPOWER_4:"Firepower 4",
	FIREPOWER_5:"Firepower 5",
	CONSOLIDATE_1:"Consolidate 1",
	CONSOLIDATE_2:"Consolidate 2",
	COMMITTEE_3:"Committee 3",
	COMMITTEE_4:"Committee 4",
	COMMITTEE_5:"Committee 5",
	SCOUT_1:"Scout 1",
	SCOUT_2:"Scout 2",
	PLANNING_3:"Planning 3",
	PLANNING_4:"Planning 4",
	PLANNING_5:"Planning 5",
});

let SkillTypeEnum = Object.freeze({
	ENGINEERING:"Engineering",
	LEADERSHIP:"Leadership",
	PILOTING:"Piloting",
	POLITICS:"Politics",
	TACTICS:"Tactics",
});

let DeckTypeEnum = Object.freeze({
	ENGINEERING_DECK:"Engineering Deck",
	LEADERSHIP_DECK:"Leadership Deck",
	PILOTING_DECK:"Piloting Deck",
	POLITICS_DECK:"Politics Deck",
	TACTICS_DECK:"Tactics Deck",
	LOYALTY_DECK:"Loyalty Deck",
	DESTINATION_DECK:"Destination Deck",
	CRISIS_DECK:"Crisis Deck",
	SUPER_CRISIS_DECK:"Super Crisis Deck",
	DESTINY_DECK:"Destiny Deck",
	QUORUM_DECK:"Quorum Deck",
	GALACTICA_DAMAGE_DECK:"Galactice Damage Deck",
	BASESTAR_DAMAGE_DECK:"Basestar Damage Deck",
	CIV_SHIP_DECK:"Civ Ship Deck",
});

function Game(users,host){
	this.host=host;
	this.players=[];
	this.currentPlayer=-1;
	this.activePlayer=-1;
	this.currentMovementRemaining=-1;
	this.activeMovementRemaining=-1;
	this.currentActionsRemaining=-1;
	this.activeActionsRemaining=-1;
	this.spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
	this.locations=[];
	
	this.vipersInHangar=-1;
	this.raptorsInHangar=-1;
	this.damagedVipers=-1;
	this.fuelAmount=-1;
	this.foodAmount=-1;
	this.moraleAmount=-1;
	this.populationAmount=-1;
	
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
	this.jumpTrack=-1;
	this.damagedLocation=[false,false,false,false,false,false,false];// make associative
	this.nukesRemaining=-1;
	this.currentPresident=-1;
	this.currentAdmiral=-1;
	this.skillCheckCards=[];
	
	for(var key in users){
		this.players.push(new Player(users[key]));
	}
			
	this.setUpNewGame=function(){
		this.vipersInHangar=8;
		this.raptorsInHangar=4;
		this.damagedVipers=0;
		this.fuelAmount=8;
		this.foodAmount=8;
		this.moraleAmount=10;
		this.populationAmount=12;
		this.nukesRemaining=2;
		this.jumpTrack=0;		
		
		this.currentPlayer=Math.floor(Math.random() * this.players.length);
		sendNarration(this.players[this.currentPlayer].userId,"You are first player");
		 
	}	
	
	this.nextTurn=function(){
		this.currentPlayer++;
		
		if(this.currentPlayer>=this.players.length){
			this.currentPlayer=0;
		}
		
		this.activePlayer=this.currentPlayer;
		this.currentMovementRemaining=1;
		this.activeMovementRemaining=1;
		this.currentActionsRemaining=1;
		this.activeActionsRemaining=1;
		
		this.addStartOfTurnCardsForPlayer(this.currentPlayer);
	}
	
	this.addStartOfTurnCardsForPlayer=function(player){
		
		
	}
	
	this.drawCard
	
	this.setUpNewGame();
}

function Player(userId){
	this.userId=userId;
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

function SkillCard(type,skillType,power){
	this.type=type;
	this.skillType=skillType;
	this.power=power;
}

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html') );
http.listen(port,() => console.log('listening on *:' + port) );

//holds online users
const users = {};
let game=null;
let host=null;
let numPlayers=0;


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
            numPlayers++;
            if(numPlayers==1){
            	host=userId;
            }
            
            //temporary way to set up a 3 player game for testing
            if(numPlayers>2){
            	for(var key in users){
					io.to(users[key]).emit('game_text', "<p>Starting new game!</p>");
				}
            	game=new Game(users,host);
            }
        }
    });
    
    socket.on('game_text', text => {
    	runCommand(text,userId);
    });
    
    //when a user disconnects remove them from users
    socket.on('disconnect', () => delete users[name]);
    
});

function sendNarration(userId, narration){
	if(userId==-1){
		for(var key in users){
			io.to(users[key]).emit('game_text', narration);
		}
	}else{
		io.to(userId).emit('game_text', '<p>'+narration+"</p>");
	}
}

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