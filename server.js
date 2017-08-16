const MAX_RESOURCE=15;
const JUMP_PREP_3POP_LOCATION=3;
const JUMP_PREP_1POP_LOCATION=4;
const JUMP_PREP_AUTOJUMP_LOCATION=5;


const SkillTypeEnum = Object.freeze({
    ENGINEERING:"Engineering",
    LEADERSHIP:"Leadership",
    PILOTING:"Piloting",
    POLITICS:"Politics",
    TACTICS:"Tactics",
	LEADERSHIPPOLITICS:"LeadershipPolitics",
	LEADERSHIPENGINEERING:"LeadershipEngineering",
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
	PICK_HYBRID_SKILL_CARD:"Pick Hybrid Skill Card",
    PICK_RESEARCH_CARD:"Pick Research Card",
    PICK_LAUNCH_LOCATION:"Pick Launch Location",
    LADAMA_STARTING_LAUNCH:"Lee Adama Starting Launch",
    MAIN_TURN:"Main Turn",
	DISCARD_FOR_MOVEMENT:"Discard for movement",
    CHOOSE:"Make a choice",
    SKILL_CHECK:"do a skill check",
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
    ARMORY:"Armory",
    SICKBAY:"Sickbay",
    BRIG:"Brig",
    
});

const CrisisMap = Object.freeze({

	WATER_SABOTAGED : {
		text : "Every tank on the starboard side has ruptured. " +
		"We're venting all our water directly into space. - Saul Tigh",
		skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: no effect, fail: -2 food',
            pass : game => game.nextTurn(),
            fail : game => {
                game.addFood(-2);
                game.nextTurn();
            },
        },
		choose : {
			who : 'current',
			text : 'skillCheck(PO/L/TA) (pass(13): no effect, fail: -2 food) or lose 1 food',
			choice1 : game => game.doSkillCheck(CrisisMap.WATER_SABOTAGED.skillCheck),//TODO write this function
			choice2 : game => game.addFood(-1),
		},
		jump : true,
		cylons : '1 raider',
	},

    //TODO write the below cards to use nextAction() and nextTurn()
    
    PRISONER_REVOLT : {
        text : "Before I release my captives... I demand the immediate" +
		" resignation of Laura Roslin and her ministers. - Tom Zarek",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: no effect, 6+: -1 population, fail: -1 pop and president chooses who takes the president',
            pass : game => {/* do nothing */},
            middle : {
            	value : 6,
				action : game => game.addPopulation(-1),
			},
            fail : game => {
                game.addPopulation(-1);
                game.choose({
                    who : 'president',
                    text : 'pick a player to give president role to',
                    player : (game, player) => game.setPresident(player),
                });
            },
        },
        jump : true,
        cylons : '1 heavy raider',
    },

    RESCUE_THE_FLEET : {
	    text : "The Cylons are waiting for us back there. How long will that take to calculate " +
        "once we get back there? - Saul Tigh, Twelve hours. - Felix Gaeta",
        choose : {
            who : 'admiral',
            text : '-2 population or -1 morale and place basestar and 3 raiders and 3 civ ships',
            choice1 : game => game.addPopulation(-2),
            choice2 : game => {
                game.addMorale(-1);
                //TODO place base star and 3 raiders in front and 3 civ ships behind BSG
            },
        },
        jump : true,
	    cylons : '1 raider',
    },

    WATER_SHORTAGE : {
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        choose : {
            who : 'president',
            text : '-1 food or president discards 2 skill cards then current player discards 3',
            choice1 : game => game.addFood(-1),
            choice2 : game => {
                //TODO solve the problem of having pres discard then having current player discard
                //this is going to be a bitch
				//idea: we could have a doNext variable in the game which is normaly null,
				//and then another function nextPhase(phase) that checks if there is a function in the doNext variable else changes the phases
            },
        },
        jump : true,
        cylons : 'base star attacks',
    },
    
    CYLON_SCREENINGS : {
        text : "We should test the people in the most sensitive positions first. - William Adama",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : 'pass: no effect, fail: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the president or admiral',
            pass : game => {/* do nothing */},
            fail : game => {
                game.addMorale(-1);
                
            },
        },
        choose : {
            who : 'current',
            text : 'skillCheck(PO/L) (pass(9): no effect, fail: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the president or admiral. OR  each player discards 2 skill cards',
            choice1 : game => game.doSkillCheck(CrisisMap.CYLON_SCREENINGS.skillCheck),
            choice2 : game => game.eachPlayerDiscards(2), //TODO write this
        },
        jump : false,
        cylons : '1 raider',
    },
    
    GUILTY_BY_COLLUSION : {
        text : "Guess you haven't heard... Cylons don't have rights. Know what we do to Cylons, Chief? - Saul Tigh",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: current player may choose a character to move to the brig' +
            ', fail: -1 morale',
            pass : game => game.choose({
                who : 'current',
                text : 'pick a player to give president role to',
                player : (game, player) => game.setPresident(player),
            }),
            fail : game => game.addMorale(-1),
        },
        jump : true,
        cylons : '1 heavy raider',
    },

});

const CharacterMap = Object.freeze({
	LADAMA: {
		name:"Lee Adama",
		type:CharacterTypeEnum.PILOT,
		skills:{
			Tactics:1,
			Piloting:2,
			LeadershipPolitics:2,
		},
		startLocation:LocationEnum.HANGAR_DECK,
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
            Leadership:3,
            Tactics:2,
        },
        startLocation:LocationEnum.ADMIRALS_QUARTERS,
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
            Politics:2,
            Leadership:1,
            Engineering:1,
        },
        startLocation:LocationEnum.RESEARCH_LAB,
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
            Politics:1,
            Leadership:2,
            Engineering:2,
        },
        startLocation: LocationEnum.HANGAR_DECK,
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
            Tactics:2,
            Piloting:2,
            LeadershipEngineering:1,
        },
        startLocation: LocationEnum.HANGAR_DECK,
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
            Leadership: 2,
            Tactics: 2,
            Piloting: 1,
        },
        startLocation: LocationEnum.HANGAR_DECK,//see "Stranded"
		/*
		ECO Officer:
		 	During your turn, you may reroll a die that was just rolled (once per turn).
		 	You must use the new result.
	 
		Moral Compass:
		 	Once per game, after a player makes a choice on a Crisis Card, you may change it.
	 
		Stranded:
		 	Your character is not placed on the game board at the start of the game. While
		 	not on the game board, you may not move, be moved, or take actions. At the start
		 	of your second turn, place your character on the "Hangar Deck" location.
		*/
    },
	ROSLIN:{
        name:'Laura Roslin',
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            Politics:3,
            Leadership:2,
        },
        startLocation: LocationEnum.PRESIDENTS_OFFICE,
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
            Tactics:2,
            Piloting:2,
			Engineering:1,
        },
        startLocation: LocationEnum.ARMORY,
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
            Leadership:2,
			Tactics:3,
        },
        startLocation: LocationEnum.COMMAND,
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
            Politics:2,
            Leadership:2,
            Tactics:1,
        },
        startLocation: LocationEnum.ADMINISTRATION,
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

const ShipTypeEnum = Object.freeze({
    VIPER:"Viper",
	BASESTAR:"Basestar",
	RAIDER:"Raider",
	HEAVY_RAIDER:"Heavy Raider",
	CIVILIAN:"Civilian",
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
    XO_1:{
        name:"XO",
        type:SkillTypeEnum.LEADERSHIP,
        value:1,
        total:8,
    },
    XO_2:{
        name:"XO",
        type:SkillTypeEnum.LEADERSHIP,
        value:2,
        total:6,
    },
	EMERGENCY_3:{
		name:"Emergency",
		type:SkillTypeEnum.LEADERSHIP,
		value:3,
		total:4,
	},
	EMERGENCY_4:{
		name:"Emergency",
		type:SkillTypeEnum.LEADERSHIP,
		value:4,
		total:2,
	},
	EMERGENCY_5:{
		name:"Emergency",
		type:SkillTypeEnum.LEADERSHIP,
		value:5,
		total:1,
	},
	EVASIVE_1:{
		name:"Evasive",
		type:SkillTypeEnum.PILOTING,
		value:1,
		total:8,
	},
	EVASIVE_2:{
		name:"Evasive",
		type:SkillTypeEnum.PILOTING,
		value:2,
		total:6,
	},
	FIREPOWER_3:{
		name:"Firepower",
		type:SkillTypeEnum.PILOTING,
		value:3,
		total:4,
	},
	FIREPOWER_4:{
		name:"Firepower",
		type:SkillTypeEnum.PILOTING,
		value:4,
		total:2,
	},
	FIREPOWER_5:{
		name:"Firepower",
		type:SkillTypeEnum.PILOTING,
		value:5,
		total:1,
	},
	CONSOLIDATE_1:{
		name:"Consolidate",
		type:SkillTypeEnum.POLITICS,
		value:1,
		total:8,
	},
	CONSOLIDATE_2:{
		name:"Consolidate",
		type:SkillTypeEnum.POLITICS,
		value:2,
		total:6,
	},
	COMMITTEE_3:{
		name:"Committee",
		type:SkillTypeEnum.POLITICS,
		value:3,
		total:4,
	},
	COMMITTEE_4:{
		name:"Committee",
		type:SkillTypeEnum.POLITICS,
		value:4,
		total:2,
	},
	COMMITTEE_5:{
		name:"Committee",
		type:SkillTypeEnum.POLITICS,
		value:5,
		total:1,
	},
	SCOUT_1:{
		name:"Scout",
		type:SkillTypeEnum.TACTICS,
		value:1,
		total:8,
	},
	SCOUT_2:{
		name:"Scout",
		type:SkillTypeEnum.TACTICS,
		value:2,
		total:6,
	},
	PLANNING_3:{
		name:"Planning",
		type:SkillTypeEnum.TACTICS,
		value:3,
		total:4,
	},
	PLANNING_4:{
		name:"Planning",
		type:SkillTypeEnum.TACTICS,
		value:4,
		total:2,
	},
	PLANNING_5:{
		name:"Planning",
		type:SkillTypeEnum.TACTICS,
		value:5,
		total:1,
	},
	
});

const DeckTypeEnum = Object.freeze({
	ENGINEERING:"Engineering",
	LEADERSHIP:"Leadership",
	PILOTING:"Piloting",
	POLITICS:"Politics",
	TACTICS:"Tactics",
	LOYALTY:"Loyalty",
	DESTINATION:"Destination",
	CRISIS:"Crisis",
	SUPER_CRISIS:"SuperCrisis",
	DESTINY:"Destiny",
	QUORUM:"Quorum",
	GALACTICA_DAMAGE:"GalacticeDamage",
	BASESTAR_DAMAGE:"BasestarDamage",
	CIV_SHIP:"CivShip",
});

function Game(users,gameHost){
	let host=gameHost;
	let players=[];
	let currentPlayer=-1;
	let phase=GamePhaseEnum.SETUP;
	let activePlayer=-1;
	let currentMovementRemaining=-1;
	let activeMovementRemaining=-1;
	let currentActionsRemaining=-1;
	let activeActionsRemaining=-1;
	let spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
    let availableCharacters=[];
    let charactersChosen=0;
    
    this.nextAction = null;
    
    let choice1 = game => {};
    let choice2 = game => {};
    let choiceText = 'no choice';
    
    let playersChecked = 0;
    let passValue = 0;
    let middleValue = -1;
    let skillText = '';
    let skillCheckTypes = []; //ie [SkillTypeEnum.POLITICS, SkillTypeEnum.PILOTING]
    let skillPass = game => {};
    let skillMiddle = game => {};
    let skillFail = game => {};
    
    let vipersInHangar=-1;
	let raptorsInHangar=-1;
	let damagedVipers=-1;
	
	let fuelAmount=-1;
	let foodAmount=-1;
	let moraleAmount=-1;
	let populationAmount=-1;
	
	let decks={
        Engineering:{ deck:[], discard:[], },
        Leadership:{ deck:[], discard:[], },
        Piloting:{ deck:[], discard:[], },
        Politics:{ deck:[], discard:[], },
        Tactics:{ deck:[], discard:[], },
        SuperCrisis:{ deck:[], discard:[], },
        Quorum:{ deck:[], discard:[], },
        Crisis:{ deck:[], discard:[], },
        
        //no discard decks
        Destination:{ deck:[], },
        Loyalty:{ deck:[], },
        Destiny:{ deck:[], },
        GalacticeDamage:{ deck:[], },
        BasestarDamage:{ deck:[], },
        CivShip:{ deck:[], },
	};
	
	let centurionTrack=[0,0,0,0];
	let jumpTrack=-1;
	let damagedLocation=[false,false,false,false,false,false,false];// make associative
	let nukesRemaining=-1;
	let currentPresident=-1;
	let currentAdmiral=-1;
	let skillCheckCards=[];
	
	for(let key in users){
		players.push(new Player(users[key]));
	}
    
    this.doSkillCheck = skillJson => {
        skillCheckTypes = skillJson.types;
        phase = GamePhaseEnum.SKILL_CHECK;
        skillPass = skillJson.pass;
        skillFail = skillJson.fail;
        if (skillJson.middle !== null) {
            skillMiddle = skillJson.middle.action;
            middleValue = skillJson.middle.value;
        } else middleValue = -1;
        passValue = skillJson.value;
        skillText = skillJson.text;
        nextActive();
        sendNarrationToPlayer(players[activePlayer].userId, skillText);
    };
    
    this.addFuel = x => fuelAmount += x;
    this.addFood = x => foodAmount += x;
    this.addMorale = x => moraleAmount += x;
    this.addPopulation = x => populationAmount += x;
    this.setPresident = x => currentPresident = x;
    this.setAdmiral = x => currentAdmiral = x;
			
	let setUpNewGame=function() {
        vipersInHangar = 8;
        raptorsInHangar = 4;
        damagedVipers = 0;
        fuelAmount = 8;
        foodAmount = 8;
        moraleAmount = 10;
        populationAmount = 12;
        nukesRemaining = 2;
        jumpTrack = 0;

        currentPlayer = Math.floor(Math.random() * players.length);
        activePlayer=currentPlayer;
        currentMovementRemaining=1;
        activeMovementRemaining=1;
        currentActionsRemaining=1;
        activeActionsRemaining=1;
        sendNarrationToPlayer(players[currentPlayer].userId, "You are first player");

		//Create starting skill card decks
        let skillDeck=buildStartingSkillCards();
        for (let i = 0; i < skillDeck.length; i++) {
            decks[skillDeck[i].type].deck.push(skillDeck[i]);
        }

        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.BASESTAR));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
        spaceAreas[SpaceEnum.SE].push(new Ship(ShipTypeEnum.VIPER));
        spaceAreas[SpaceEnum.E].push(new Ship(ShipTypeEnum.CIVILIAN));
        spaceAreas[SpaceEnum.E].push(new Ship(ShipTypeEnum.CIVILIAN));

        for(let key in CharacterMap){
            availableCharacters.push(key);
        }

        phase=GamePhaseEnum.PICK_CHARACTERS;
        askForCharacterChoice();
        
	};

	let askForCharacterChoice=function(){
        sendNarrationToPlayer(players[activePlayer].userId, "Pick your character");
    };

    let chooseCharacter=function(character){
		if(availableCharacters.indexOf(character)>=0){
			players[activePlayer].character=CharacterMap[character];
            charactersChosen++;
            availableCharacters.splice(availableCharacters.indexOf(character),1);
            sendNarrationToPlayer(players[activePlayer].userId, "You picked "+CharacterMap[character].name);

            if(charactersChosen===players.length){
            	beginFirstTurn();
                return;
            }
            nextActive();
            askForCharacterChoice();
        }else{
            sendNarrationToPlayer(players[activePlayer].userId, "That character isn't available");
		}
	};

    let beginFirstTurn=function(){
    	for(let i=0;i<players.length;i++){
			players[i].location=players[i].character.startLocation;
		}

		let ladamaPlaying=false;
        for(let i=0;i<players.length;i++){
            if(players[i].character.name===CharacterMap.LADAMA.name){
                activePlayer=i;
                sendNarrationToPlayer(players[i].userId, "Select 0 for Southwest launch or 1 for Southeast launch");
                phase=GamePhaseEnum.LADAMA_STARTING_LAUNCH;
                ladamaPlaying=true;
                break;
            }
        }

        if(!ladamaPlaying) {
            activePlayer = currentPlayer;
            phase = GamePhaseEnum.MAIN_TURN;
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn");
            addStartOfTurnCardsForPlayer(currentPlayer);
        }
    };

    let pickHybridSkillCard=function(text){
        let amount=parseInt(text);
        if(isNaN(amount) || amount<0){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            return;
        }

        let skills=players[activePlayer].character.skills;
        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!==null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
            if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]<amount){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            }else{
                for(let i=0;i<amount;i++){
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP].deck));
                }
                for(let i=0;i<skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount;i++){
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS].deck));
                }
                phase=GamePhaseEnum.MAIN_TURN;
                sendNarrationToAll(players[currentPlayer].character.name + " picks " + amount + " Leadership and "+
                    (skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount)+" Politics");
            }
        }else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!==null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
            if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]<amount){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
            }else {
                for (let i = 0; i < amount; i++) {
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP].deck));
                }
                for (let i = 0; i < skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount; i++) {
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING].deck));
                }
                phase=GamePhaseEnum.MAIN_TURN;
                sendNarrationToAll(players[currentPlayer].character.name + " picks " + amount + " Leadership and " +
                    (skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount) + " Politics");
            }
        }
    };

    let pickResearchCard=function(text){
		if(text==='0'){
            sendNarrationToAll(players[currentPlayer].character.name + " draws an "+SkillTypeEnum.ENGINEERING+" skill card");
            players[activePlayer].hand.push(decks[DeckTypeEnum.ENGINEERING].deck);
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text==='1'){
            sendNarrationToAll(players[currentPlayer].character.name + " draws an "+SkillTypeEnum.TACTICS+" skill card");
            players[activePlayer].hand.push(decks[DeckTypeEnum.TACTICS].deck);
            phase=GamePhaseEnum.MAIN_TURN;
		}else{
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
        }
        return;
	};

    let pickLaunchLocation=function(text){
    	if(text!=='0'&&text!=='1'){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid amount');
			return;
        }

        let s = new Ship(ShipTypeEnum.VIPER);
    	s.pilot=activePlayer;

        if(text==='0'){
            sendNarrationToAll(players[currentPlayer].character.name + " launches in a viper to the Southwest");
            players[activePlayer].viperLocation=SpaceEnum.SW;
            spaceAreas[SpaceEnum.SW].push(s);
        }else if(text==='1'){
            sendNarrationToAll(players[currentPlayer].character.name + " launches in a viper to the Southeast");
            players[activePlayer].viperLocation=SpaceEnum.SE;
            spaceAreas[SpaceEnum.SE].push(s);
        }

        if(phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH) {
            activePlayer = currentPlayer;
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn");
            addStartOfTurnCardsForPlayer(currentPlayer);
        }else{
            phase=GamePhaseEnum.MAIN_TURN;
        }

        return;
    };

    let nextActive=function(){
        activePlayer++;

        if(activePlayer>=players.length){
            activePlayer=0;
        }
    };
	
	let nextTurn=function(){
		currentPlayer++;
		
		if(currentPlayer>=players.length){
			currentPlayer=0;
		}
		
		activePlayer=currentPlayer;
		currentMovementRemaining=1;
		activeMovementRemaining=1;
		currentActionsRemaining=1;
		activeActionsRemaining=1;
		
		addStartOfTurnCardsForPlayer(currentPlayer);

        sendNarrationToAll("It's "+players[currentPlayer].character.name+"'s turn");
	};
	this.nextTurn = nextTurn;
	
	let addStartOfTurnCardsForPlayer=function(player){
		let skills=players[player].character.skills;

		for(let type in SkillTypeEnum){
			if(skills[SkillTypeEnum[type]]===null||SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING
                || SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
				continue;
			}
			for(let i=0;i<skills[SkillTypeEnum[type]];i++) {
                players[player].hand.push(drawCard(decks[DeckTypeEnum[type]].deck));
            }
		}

        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!==null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
            phase=GamePhaseEnum.PICK_HYBRID_SKILL_CARD;
            sendNarrationToPlayer(players[activePlayer].userId, "Pick up to "+skills[SkillTypeEnum.LEADERSHIPPOLITICS]+
                " "+SkillTypeEnum.LEADERSHIP+". The rest will be "+SkillTypeEnum.POLITICS);
        	return;
		}else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!==null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
            phase=GamePhaseEnum.PICK_HYBRID_SKILL_CARD;
            sendNarrationToPlayer(players[activePlayer].userId, "Pick up to "+skills[SkillTypeEnum.LEADERSHIPENGINEERING]+
                " "+SkillTypeEnum.LEADERSHIP+". The rest will be "+SkillTypeEnum.ENGINEERING);
        	return;
        }else{
			phase=GamePhaseEnum.MAIN_TURN;
		}
	};

    let drawCard = function(deck){
		return deck.pop();
	};

    let getPlayerNumberById = function(userId){
    	for(let i=0;i<players.length;i++){
    		if(players[i].userId===userId) {
				return i;
            }
		}

		return -1;
	};

	let isLocationOnColonialOne=function(location){
    	return location === LocationEnum.PRESS_ROOM || location === LocationEnum.PRESIDENTS_OFFICE || location === LocationEnum.ADMINISTRATION;
	};

	let spendActionPoint=function(){
		activeActionsRemaining--;

        if(activePlayer===currentPlayer){
			currentActionsRemaining--;
		}
	};

	let doCrisisStep=function(){
		console.log("starting crisis step");

	};

	let doMainTurn = function(text){
        if(text.toUpperCase()==="ACTIVATE"){
            let success=activateLocation(players[activePlayer].location);
            if(success && players[activePlayer].viperLocation===-1){
                spendActionPoint();
            }
            return;
        }else if(text.toUpperCase()==="NOTHING"){
            spendActionPoint();
            return;
		}

		if(currentMovementRemaining>0){
			if(LocationEnum[text]!=null){
				let l=text;
				if(players[activePlayer].location === LocationEnum[l]){
					sendNarrationToPlayer(players[activePlayer].userId, "You are already there!");
					return;
				}else if(LocationEnum[l] === LocationEnum.SICKBAY||LocationEnum[l] === LocationEnum.BRIG){
					sendNarrationToPlayer(players[activePlayer].userId, "You can't move to hazardous locations!");
					return;
				}

				if(players[activePlayer].isRevealedCylon && LocationEnum[l]!==LocationEnum.CAPRICA&&LocationEnum[l]!==LocationEnum.CYLON_FLEET&&
                    LocationEnum[l]!==LocationEnum.HUMAN_FLEET&&LocationEnum[l]!==LocationEnum.RESURRECTION_SHIP) {
					sendNarrationToPlayer(players[activePlayer].userId, "You can't move there as a revealed cylon!");
					return;
				}else if(!players[activePlayer].isRevealedCylon && (LocationEnum[l]===LocationEnum.CAPRICA||LocationEnum[l]===LocationEnum.CYLON_FLEET||
                    LocationEnum[l]===LocationEnum.HUMAN_FLEET||LocationEnum[l]===LocationEnum.RESURRECTION_SHIP)) {
					sendNarrationToPlayer(players[activePlayer].userId, "You can't move there unless you're a revealed cylon!");
					return;
				}

				if(!players[activePlayer].isRevealedCylon){
					if(players[activePlayer].viperLocation!=-1||isLocationOnColonialOne(players[activePlayer].location)!==isLocationOnColonialOne(LocationEnum[l])){
						if(players[activePlayer].hand.length===0){
							sendNarrationToPlayer(players[activePlayer].userId, "Not enough cards");
							return;
						}

                        if(players[activePlayer].viperLocation!=-1){
                            for(let i=0;i<spaceAreas[players[activePlayer].viperLocation].length;i++){
                                if(spaceAreas[players[activePlayer].viperLocation][i].pilot===activePlayer){
                                	console.log("found pilot");
                                    spaceAreas[players[activePlayer].viperLocation].splice(i,1);
                                    break;
								}
							}

                            sendNarrationToAll(players[activePlayer].character.name + " stops piloting their viper");
                            vipersInHangar++;
                            players[activePlayer].viperLocation=-1;
						}

						players[activePlayer].location = LocationEnum[l];
						currentMovementRemaining--;
						sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l]);
						sendNarrationToPlayer(players[activePlayer].userId, "Discard a card to continue");
						phase=GamePhaseEnum.DISCARD_FOR_MOVEMENT;
						return;
					}
				}

				players[activePlayer].location = LocationEnum[l];
				currentMovementRemaining--;
				sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l]);
				return;
			}
        }

	};

	let discardForMovement=function(text){
        let num=parseInt(text);
        if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid card');
            return;
        }

        let cardName=(players[activePlayer].hand)[num].name+" "+(players[activePlayer].hand)[num].value;
        players[activePlayer].hand.splice(num,1);
        sendNarrationToAll(players[activePlayer].character.name+" discards "+cardName);
		phase=GamePhaseEnum.MAIN_TURN;
    };

    /*
	this.getPlayers=function(){
        return players;
    };

    this.getActivePlayer=function(){
        return activePlayer;
    };

    this.getPhase=function(){
        return phase;
    };
    */

    let activateLocation=function(location){

        switch (location){
        	//Colonial One
            case LocationEnum.PRESS_ROOM:
                sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.PRESS_ROOM);
                sendNarrationToAll(players[currentPlayer].character.name + " draws 2 Politics skill cards");
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS].deck));
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS].deck));
                return true;
            case LocationEnum.PRESIDENTS_OFFICE:
                return true;
            case LocationEnum.ADMINISTRATION:
                return true;

			//Cylon Locations
            case LocationEnum.CAPRICA:
                return true;
            case LocationEnum.CYLON_FLEET:
                return true;
            case LocationEnum.HUMAN_FLEET:
                return true;
            case LocationEnum.RESURRECTION_SHIP:
                return true;

			//Galactica
            case LocationEnum.FTL_CONTROL:
				if(jumpTrack<JUMP_PREP_3POP_LOCATION){
					sendNarrationToPlayer(players[activePlayer].userId, "Jump track is in the red!");
					return false;
				}

				let popLoss=0;
                if(jumpTrack<JUMP_PREP_3POP_LOCATION) {
                	popLoss=3;
                }else if(jumpTrack<JUMP_PREP_3POP_LOCATION) {
					popLoss=1;
                }else{
                	return false;
				}

                sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.FTL_CONTROL);
                let die=rollDie();
                if(die<7){
                    this.addPopulation(-popLoss);
                    sendNarrationToAll(popLoss+" population was left behind!");
                }else{
                    sendNarrationToAll("Everyone made it safely!");
                }

                return true;
            case LocationEnum.WEAPONS_CONTROL:
                return true;
            case LocationEnum.COMMUNICATIONS:
                return true;
            case LocationEnum.RESEARCH_LAB:
                sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.RESEARCH_LAB);
                sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Engineering or 1 for Tactics");
                phase=GamePhaseEnum.PICK_RESEARCH_CARD;
                return true;
            case LocationEnum.COMMAND:
                return true;
            case LocationEnum.ADMIRALS_QUARTERS:
                return true;
            case LocationEnum.HANGAR_DECK:
            	if(players[activePlayer].character.skills.Piloting == null) {
                    sendNarrationToPlayer(players[activePlayer].userId, "You're not a pilot!");
                    return false;
                }else if(vipersInHangar>0){
                    sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.HANGAR_DECK);
                    sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Southwest launch or 1 for Southeast launch");
                    phase=GamePhaseEnum.PICK_LAUNCH_LOCATION;
                    return true;
				}else{
                    sendNarrationToPlayer(players[activePlayer].userId, "No vipers left ot pilot");
            		return false;
				}
                return true;
            case LocationEnum.ARMORY:
                return true;
            case LocationEnum.SICKBAY:
                sendNarrationToPlayer(players[activePlayer].userId, "Can't activate sickbay");
                return false;
            case LocationEnum.BRIG:
                return true;
            default:
                return false;
        }



	};

    this.runCommand= function(text,userId){
    	if(text.toUpperCase()==="HAND"){
            let hand=players[getPlayerNumberById(userId)].hand;
            let handText="Hand: ";
    		for(let i=0;i<hand.length;i++){
                handText+=hand[i].name+" "+hand[i].value+", ";
			}
            sendNarrationToPlayer(userId, handText);
            return;
		}else if(text.toUpperCase()==="LOCATION"){
            sendNarrationToPlayer(userId, players[getPlayerNumberById(userId)].location);
            if(players[getPlayerNumberById(userId)].viperLocation!=-1){
                sendNarrationToPlayer(userId, "& in a viper at "+players[getPlayerNumberById(userId)].viperLocation);
			}
            return;
        }else if(text.toUpperCase()==="LOCATIONS"){
            for(let i=0;i<players.length;i++){
                sendNarrationToPlayer(userId, players[i].character.name+": "+players[i].location);
            }
            return;
        }else if(text.toUpperCase()==="SPACE"){
        	let msg="";
            for(let s in SpaceEnum){
            	msg=SpaceEnum[s]+": ";
            	for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
            		msg+=spaceAreas[SpaceEnum[s]][i].type;
            		if(spaceAreas[SpaceEnum[s]][i].pilot===getPlayerNumberById(userId)){
                        msg+=" & pilot "+players[activePlayer].character.name;
					}
                    msg+=", ";
                }
                sendNarrationToPlayer(userId, msg);
            }
            return;
        }else if(text.toUpperCase()==="MOVEACTION"){
            sendNarrationToPlayer(userId, "Active movement remaining: "+activeMovementRemaining);
            sendNarrationToPlayer(userId, "Active actions remaining: "+activeActionsRemaining);
            sendNarrationToPlayer(userId, "Current movement remaining: "+currentMovementRemaining);
            sendNarrationToPlayer(userId, "Current actions remaining: "+currentActionsRemaining);
            return;
        }else if(players[activePlayer].userId!==userId){
        	sendNarrationToPlayer(userId, 'It is not your turn to act!');
            return;
        }

        if(phase===GamePhaseEnum.PICK_CHARACTERS){
            chooseCharacter(text);
        }else if(phase===GamePhaseEnum.PICK_HYBRID_SKILL_CARD){
            pickHybridSkillCard(text);
        }else if(phase===GamePhaseEnum.PICK_RESEARCH_CARD){
            pickResearchCard(text);
        }else if(phase===GamePhaseEnum.PICK_LAUNCH_LOCATION||phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH){
            pickLaunchLocation(text);
        }else if(phase===GamePhaseEnum.MAIN_TURN){
            doMainTurn(text);
            if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN){
                doCrisisStep();
                nextTurn();
            }
        }else if(phase===GamePhaseEnum.DISCARD_FOR_MOVEMENT){
            discardForMovement(text);
        }else if(phase===GamePhaseEnum.CHOOSE){
            //if choice2 is null it means the choice is to do something to a player
            if (choice2 === null) {
                choice1(this, parseInt(text));
            } else {
                if (text === '1') choice1(this);
                else if (text === '2') choice2(this);
            }
            if (this.nextAction !== null) {
                this.nextAction();
                this.nextAction = null;
            }
            else nextTurn();
        } else if (phase === GamePhaseEnum.SKILL_CHECK) {
            sendNarrationToAll('the lazy programmer did not write this code yet!');
            //TODO: turn this into javascript:
            //check that text is string of legit indexs to player's hand, ie for a hand of 5 cards, the string '1 4 3' would be legit
            //add those cards to skillCheckCards (look to see if variable exists, if not, make it)
            //playersChecked++
            //if playersChecked === players.length
            //    playersChecked = 0;
            //    let temp = calculateSkillCheck(skillCheckCards, skillCheckTypes); <-- write this
            //    if temp >= passValue
            //        skillPass();
            //    else if temp >= middleValue && middleValue !== -1
            //        skillMiddle();
            //    else
            //        skillFail();
            //else
            //    nextActive();
            //    sendNarrationToPlayer(players[activePlayer].userId, skillText);
        }
	};
    
    /*
        input choice will be a json looking like:
        {
            choice1: game => {do something to game here},
            choice2: game => {do something to game here},
            text: 'text to tell the player what the choice is',
            who: index of player has a number or a string 'president', 'admiral', 'active'
        }
     */
    //takes a choice json and sets up the game to act when player makes a choice
    this.choose = choice => {
        phase = GamePhaseEnum.CHOOSE;
        switch (choice.who) {
            case 'president' : choice.who = currentPresident; break;
            case 'admiral' : choice.who = currentAdmiral; break;
            case 'current' : choice.who = currentPlayer; break;
            case 'active' : choice.who = activePlayer; break;
        }
        if (choice.player !== null) {
            choice1 = choice.player;
            choice2 = null;
        } else {
            choice1 = choice.choice1;
            choice2 = choice.choice2;
        }
		choiceText = choice.text;
		activePlayer = choice.who;
		sendNarrationToPlayer(players[who].userId, text);
	};

	setUpNewGame();
}

function rollDie(){
	return Math.ceil(Math.random() * 8);
}

function buildStartingSkillCards(){
	let cards =[];
    for(let key in SkillCardMap){
        for (let i = 0; i < SkillCardMap[key].total; i++) {
            cards.push(SkillCardMap[key]);
        }
    }
    shuffle(cards);
	return cards;
}

function Player(userId){
	this.userId=userId;
	this.character=-1;
	this.hand=[];
	this.loyalty=[-1,-1,-1];
	this.usedOncePerGame=false;
	this.isRevealedCylon=false;
	this.viperLocation=-1;
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

function sendNarrationToPlayer(userId, narration){
	if(userId===-1){
		for(let key in users){
			io.to(users[key]).emit('game_text', narration);
		}
	}else{
		io.to(userId).emit('game_text', '<p>'+narration+"</p>");
	}
}

function sendNarrationToAll(narration){
    for(let key in users){
        io.to(users[key]).emit('game_text', "<p>"+narration+"</p>");
    }
}

function runCommand(text,userId){
	if(game===null){
        io.to(userId).emit('game_text', "<p>Game hasn't started yet</p>");
		return;
	}
	game.runCommand(text,userId);
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}