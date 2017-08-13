const MAX_RESOURCE=15;

const SkillTypeEnum = Object.freeze({
    ENGINEERING:"Engineering",
    LEADERSHIP:"Leadership",
    PILOTING:"Piloting",
    POLITICS:"Politics",
    TACTICS:"Tactics",
});

const CharacterTypeEnum = Object.freeze({
    MILITARY_LEADER:"Military Leader",
    POLITICAL_LEADER:"Political Leader",
    PILOT:"Pilot",
	SUPPORT:"Support",
});

const GamePhaseEnum = Object.freeze({
    SETUP:"Setup",
    PICK_CHARACTERS:"Pick Characters",
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

const CharacterMap = Object.freeze({
	LADAMA: {
		name:"Lee Adama",
		type:CharacterTypeEnum.PILOT,
		skills:{
			tactics:1,
			piloting:2,
			leadershipPolitics:2,
		},
		start:'eric! i dont know what to do here -orion', //launch and pilot a viper
		/*
		alert viper pilot:
			when a viper is placed in a space area from the "Reserves," you may choose
			to pilot it and take 1 action. You may only do this when you are on
			Galactica location. excluding the "Brig."
		
		CAG - Action:
			Once per game, you may activate up to 6 unmanned vipers.
		
		Headstrong:
			When you are forced to discard Skill Cards, you must discard randomly.
		*/
		
	},
    BADAMA: {
        name:"William Adama",
        type:CharacterTypeEnum.MILITARY_LEADER,
        skills:{
            leadership:3,
            tactics:2,
        },
		start:LocationEnum.ADMIRALS_QUARTERS,
		/*
		Inspirational Leader:
			When you draw a Crisis Card, all 1 strength Skill Cards count positive for
		 	the skill check
	 
		Command Authority:
		 	Once per game, after resolving a skill check, instead of discarding the used
		 	Skill Cards, draw them into your hand.
	 
		Emotionally Attached:
		 	You may not activate the "Admiral's Quarters" location.
		*/
    },
	BALTAR:{
        name:"Gaius Baltar",
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            politics:2,
            leadership:1,
            engineering:1,
        },
		start:LocationEnum.RESEARCH_LAB,
		/*
		Delusional Intuition:
			After you draw a Crisis Card, draw 1 Skill Card of your choice (it may be
		 	from outside your skill set).
		 
		Cylon Detector - Action:
			Once per game, you may look at all Loyalty Cards belonging to another player.
		 
		Coward:
			You start the game with 2 loyalty Cards (instead of 1).
		*/
    },
	TYROL:{
        name:'"Chief" Galen Tyrol',
        type:CharacterTypeEnum.SUPPORT,
        skills:{
            politics:1,
            leadership:2,
            engineering:2,
        },
		/*
		Maintenance Engineer:
			During your turn, after you use a "Repair" Skill Card, you may take another
			action (once per tern).
		 
		Blind Devotion:
			Once per game, after cards have been added to a skill Check (but before
			revealing them), you may choose a skill type. All cards of the chosen type
			are considered strength 0.
		 
		Reckless:
			Your hand limit is 8 (instead of 10).
		*/
    },
	THRACE:{
        name:'Kara "Starbuck" Thrace',
        type:CharacterTypeEnum.PILOT,
        skills:{
            tactics:2,
            piloting:2,
            leadershipengineering:1,
        },
		start: LocationEnum.HANGAR_DECK,
		/*
		Expert Pilot:
			When you start your turn piloting a viper, you may take 2 actions during
			your Action Step (instead of 1).
		 
		Secret Destiny:
			Once per game, immediately after a Crisis Card is revealed, discard it
			and draw a new one.
		 
		Insubordinate:
			When a player chooses you with the "Admiral's Quarters" location,
			reduce the difficulty by 3.
		*/
    },
    AGATHON: {
        name: 'Karl "Helo" Agathon',
        type: CharacterTypeEnum.MILITARY_LEADER,
        skills: {
            leadership: 2,
            tactics: 2,
            piloting: 1,
        },
        start: LocationEnum.HANGAR_DECK,//see "Stranded"
		/*
		ECO Officer:
		 	During your turn, you may reroll a die that was just rolled (once per turn).
		 	You must use the new result.
	 
		Moral Compass:
		 	Once per game, after a player makes a choice on a Crisis Card, you may change it.
	 
		Stranded:
		 	Your character is not placed on the game board at the start of the game. While
		 	not on the game board, you may not move, be moved, or take actions. At the start
		 	of your second turn, place your character on the "Hanger Deck" location.
		*/
    },
	ROSLIN:{
        name:'Laura Roslin',
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            politics:3,
            leadership:2,
        },
        start: LocationEnum.PRESIDENTS_OFFICE,
		/*
		Religious Visions:
			When you draw Crisis Cards, draw 2 and choose 1 to resolve. Place the
			other on the bottom of the deck.
		 
		Skilled Politician - Action:
			Once per game, draw 4 Quorum Cards. Chose 1 to resolve and place the
			rest on the bottom of the deck. You do not need to be President to
			use this ability.
		 
		Terminal Illness:
			In order to activate a location, you must first discard 2 Skill Cards.
		*/
    },
	VALERII:{
        name:'Sharon "Boomer" Valerii',
        type:CharacterTypeEnum.PILOT,
        skills:{
            tactics:2,
            piloting:2,
			engineering:1,
        },
        start: LocationEnum.ARMORY,
		/*
		Recon:
			At the end of your turn, you may look at the top card of the Crisis
			Deck and place it on the bottom.
		 
		Mysterious Intuition:
			Once per game, before resolving a skill check on a Crisis Card, choose
			the result (Pass or Fail), instead of resolving it normally.
		 
		Sleeper Agent:
			During the Sleeper Agent Phase, you are dealt 2 Loyalty Cards
			(instead of 1) and then moved to the "brig" location.
		 */
    },
	TIGH:{
        name:'Saul Tigh',
        type:CharacterTypeEnum.MILITARY_LEADER,
        skills:{
            leadership:2,
			tactics:3,
        },
        start: LocationEnum.COMMAND,
		/*
		Cylon Hatred:
		 	When a player activates the "Admiral's  Quarters" location, you may
		 	choose to reduce the difficulty by 3.
		 
		Declare Martial Law - Action:
		 	Once per game, give the President title to the Admiral.
		 
		Alcoholic:
			At the start of any player's turn, if you have exactly 1 Skill
			Card in your hand, you must discard it.
		*/
    },
	ZAREK:{
        name:'Tom Zarek',
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            politics:2,
            leadership:2,
            tactics:1,
        },
        start: LocationEnum.ADMINISTRATION,
		/*
		Friends in Low Places:
		 	When a player activates the "Administration" or the "Brig" location,
		 	you may choose to reduce or increase the difficulty by 2.
		 
		Unconventional Tactics - Action:
		 	Once per game, lose 1 population to gain 1 of any other resource type.
		 
		Convicted Criminal:
		 	You may not activate locations occupied by other characters (except the "brig").
		*/
    },
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
	
	//TODO replace 9s with correct values
	
	RESEARCH_3:{
		name:"Research 3",
		type:SkillTypeEnum,
		value:3,
		total:9,
	},
	RESEARCH_4:{
		name:"Research 4",
		type:SkillTypeEnum,
		value:4,
		total:9,
	},
	RESEARCH_5:{
		name:"Research 5",
		type:SkillTypeEnum,
		value:5,
		total:9,
	},
	EMERGENCY_3:{
		name:"Emergency 3",
		type:SkillTypeEnum,
		value:3,
		total:9,
	},
	EMERGENCY_4:{
		name:"Emergency 4",
		type:SkillTypeEnum,
		value:4,
		total:9,
	},
	EMERGENCY_5:{
		name:"Emergency 5",
		type:SkillTypeEnum,
		value:5,
		total:9,
	},
	XO_1:{
		name:"XO 1",
		type:SkillTypeEnum,
		value:1,
		total:9,
	},
	XO_2:{
		name:"XO 2",
		type:SkillTypeEnum,
		value:2,
		total:9,
	},
	EVASIVE_1:{
		name:"Evasive 1",
		type:SkillTypeEnum,
		value:1,
		total:9,
	},
	EVASIVE_2:{
		name:"Evasive 2",
		type:SkillTypeEnum,
		value:2,
		total:9,
	},
	FIREPOWER_3:{
		name:"Firepower 3",
		type:SkillTypeEnum,
		value:3,
		total:9,
	},
	FIREPOWER_4:{
		name:"Firepower 4",
		type:SkillTypeEnum,
		value:4,
		total:9,
	},
	FIREPOWER_5:{
		name:"Firepower 5",
		type:SkillTypeEnum,
		value:5,
		total:9,
	},
	CONSOLIDATE_1:{
		name:"Consolidate 1",
		type:SkillTypeEnum,
		value:1,
		total:9,
	},
	CONSOLIDATE_2:{
		name:"Consolidate 2",
		type:SkillTypeEnum,
		value:2,
		total:9,
	},
	COMMITTEE_3:{
		name:"Committee 3",
		type:SkillTypeEnum,
		value:3,
		total:9,
	},
	COMMITTEE_4:{
		name:"Committee 4",
		type:SkillTypeEnum,
		value:4,
		total:9,
	},
	COMMITTEE_5:{
		name:"Committee 5",
		type:SkillTypeEnum,
		value:5,
		total:9,
	},
	SCOUT_1:{
		name:"Scout 1",
		type:SkillTypeEnum,
		value:1,
		total:9,
	},
	SCOUT_2:{
		name:"Scout 2",
		type:SkillTypeEnum,
		value:2,
		total:9,
	},
	PLANNING_3:{
		name:"Planning 3",
		type:SkillTypeEnum,
		value:3,
		total:9,
	},
	PLANNING_4:{
		name:"Planning 4",
		type:SkillTypeEnum,
		value:4,
		total:9,
	},
	PLANNING_5:{
		name:"Planning 5",
		type:SkillTypeEnum,
		value:5,
		total:9,
	},
	
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