const MAX_RESOURCE=15;

//characters objects

const SkillTypeEnum = Object.freeze({
    ENGINEERING:"Engineering",
    LEADERSHIP:"Leadership",
    PILOTING:"Piloting",
    POLITICS:"Politics",
    TACTICS:"Tactics",
});

const GamePhaseEnum = Object.freeze({
    SETUP:"Setup",
    PICK_CHARACTERS:"Pick Characters",
});

const CharacterMap = Object.freeze({ //set up later for character objects
	LADAMA: {
		name:"Lee Adama",
		type:SkillTypeEnum.PILOTING,
		skills:{
			tactics:1,
			piloting:2,
			leadershipPolitics:2,
		},
	},
    BADAMA: {
        name:"Bill Adama",
        type:SkillTypeEnum.LEADERSHIP,
        skills:{
            leadership:3,
            tactics:2,
        },
    },
	/*
	BALTAR:"Gaius Baltar",
	TYROL:"Galen Tyrol",
	THRACE:"Kara Thrace",
	AGATHON:"Karl Agathon",
	ROSLIN:"Laura Roslin",
	VALERII:"Sharon Valerii",
	TIGH:"Saul Tigh",
	ZAREK:"Tom Zarek",
	*/
});

const LocationEnum = Object.freeze({
	
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

const SpaceEnum = Object.freeze({
	NE:"Northeast",
	E:"East",
	SE:"Southeast",
	SW:"Southwest",
	W:"West",
	NW:"Northwest",	
});

const SkillCardMap = Object.freeze({
	REPAIR_1:{
		name:"Repair",
		type:SkillTypeEnum.ENGINEERING,
		value:1,
		total:8,
    },
    REPAIR_2:{
        name:"Repair",
        type:SkillTypeEnum.ENGINEERING,
        value:2,
        total:6,
    },
    REASEARCH_3:{
        name:"Research",
        type:SkillTypeEnum.ENGINEERING,
        value:3,
        total:4,
    },
    REASEARCH_4:{
        name:"Research",
        type:SkillTypeEnum.ENGINEERING,
        value:4,
        total:2,
    },
    REASEARCH_5:{
        name:"Research",
        type:SkillTypeEnum.ENGINEERING,
        value:5,
        total:1,
    },
	/*
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
	*/
});

const DeckTypeEnum = Object.freeze({
	ENGINEERING_DECK:"Engineering",
	LEADERSHIP_DECK:"Leadership",
	PILOTING_DECK:"Piloting",
	POLITICS_DECK:"Politics",
	TACTICS_DECK:"Tactics",
	LOYALTY_DECK:"Loyalty",
	DESTINATION_DECK:"Destination",
	CRISIS_DECK:"Crisis",
	SUPER_CRISIS_DECK:"SuperCrisis",
	DESTINY_DECK:"Destiny",
	QUORUM_DECK:"Quorum",
	GALACTICA_DAMAGE_DECK:"GalacticeDamage",
	BASESTAR_DAMAGE_DECK:"BasestarDamage",
	CIV_SHIP_DECK:"CivShip",
});

const getKey = (obj, key) => obj[key];

function Game(users,host){
	this.host=host;
	this.players=[];
	this.currentPlayer=-1;
	this.phase=GamePhaseEnum.SETUP;
	this.activePlayer=-1;
	this.currentMovementRemaining=-1;
	this.activeMovementRemaining=-1;
	this.currentActionsRemaining=-1;
	this.activeActionsRemaining=-1;
	this.spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
	this.locations=[];
    this.availableCharacters=[];
    this.charactersChosen=0;

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

	this.decks={
        Engineering:this.engineeringSkillDeck,
        Leadership:this.leadershipSkillDeck,
        Piloting:this.pilotingSkillDeck,
        Politics:this.politicsSkillDeck,
        Tactics:this.tacticsSkillDeck,
        Loyalty:this.loyaltyDeck,
        Destination:this.destinationDeck,
        Crisis:this.crisisDeck,
        SuperCrisis:this.superCrisisDeck,
        Destiny:this.destinyDeck,
        Quorum:this.quorumDeck,
        GalacticeDamage:this.galacticaDamageDeck,
        BasestarDamage:this.basestarDamageDeck,
        CivShip:this.civilianShipDeck,
	};
	
	this.centurionTrack=[0,0,0,0];
	this.jumpTrack=-1;
	this.damagedLocation=[false,false,false,false,false,false,false];// make associative
	this.nukesRemaining=-1;
	this.currentPresident=-1;
	this.currentAdmiral=-1;
	this.skillCheckCards=[];
	
	for(let key in users){
		this.players.push(new Player(users[key]));
	}
			
	this.setUpNewGame=function() {
        this.vipersInHangar = 8;
        this.raptorsInHangar = 4;
        this.damagedVipers = 0;
        this.fuelAmount = 8;
        this.foodAmount = 8;
        this.moraleAmount = 10;
        this.populationAmount = 12;
        this.nukesRemaining = 2;
        this.jumpTrack = 0;

        this.currentPlayer = Math.floor(Math.random() * this.players.length);
        this.activePlayer=this.currentPlayer;
        sendNarration(this.players[this.currentPlayer].userId, "You are first player");

		//Create starting skill card decks
        let skillDeck=buildStartingSkillCards();
        for (let i = 0; i < skillDeck.length; i++) {
            //console.log(this.decks[skillDeck[i].type]);
            this.decks[skillDeck[i].type].push(skillDeck[i]);
        }
        console.log(this);

        for(let key in CharacterMap){
            this.availableCharacters.push(key);
        }

        this.phase=GamePhaseEnum.PICK_CHARACTERS;
        this.askForCharacterChoice();

		//console.log(this.drawCard(this.decks[DeckTypeEnum.POLITICS_DECK]).name;
	};

	this.askForCharacterChoice=function(){
        sendNarration(this.players[this.activePlayer].userId, "Pick your character");
    };

    this.chooseCharacter=function(character){
    	console.log(this.availableCharacters);
		if(this.availableCharacters.indexOf(character)>=0){
			this.players[this.activePlayer].character=CharacterMap[character];
            this.charactersChosen++;
            this.availableCharacters.splice(this.availableCharacters.indexOf(character),1);
            console.log(this.availableCharacters);

            if(this.charactersChosen===this.players.length){
                this.phase=GamePhaseEnum.TURN;
                return;
            }
            this.nextActive();
            this.askForCharacterChoice();
        }else{
            sendNarration(this.players[this.activePlayer].userId, "That character isn't available");
		}
	};

    this.nextActive=function(){
        this.activePlayer++;

        if(this.activePlayer>=this.players.length){
            this.activePlayer=0;
        }
    };
	
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
	};
	
	this.addStartOfTurnCardsForPlayer=function(player){
		
		
	};

    this.drawCard =function(deck){
		return deck.pop();
	};
	//this.drawCard = deckType => getKey(this, deckType).pop();
	
	this.setUpNewGame();
}

function buildStartingSkillCards(){
	let cards =[];

    for(let key in SkillCardMap){
        for (let i = 0; i < SkillCardMap[key].total; i++) {
            cards.push(SkillCardMap[key]);
        }
    }

	return cards;
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
            if(numPlayers>1){
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
	if(userId===-1){
		for(var key in users){
			io.to(users[key]).emit('game_text', narration);
		}
	}else{
		io.to(userId).emit('game_text', '<p>'+narration+"</p>");
	}
}

function runCommand(text,userId){
	if(game.players[game.activePlayer].userId!=userId){
		return;
	}

	if(game.phase===GamePhaseEnum.PICK_CHARACTERS){
		game.chooseCharacter(text);
	}

        
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