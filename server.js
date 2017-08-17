const MAX_RESOURCE=15;
const JUMP_PREP_3POP_LOCATION=3;
const JUMP_PREP_1POP_LOCATION=4;
const JUMP_PREP_AUTOJUMP_LOCATION=5;
const CENTURION_DESTROYED_MINIMUM_ROLL=7;
const RAIDER_DESTROYED_MINIMUM_ROLL=3;
const HEAVY_RAIDER_DESTROYED_MINIMUM_ROLL=7;
const VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL=8;
const GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL=5;
const BASESTAR_DAMAGES_GALACTICA_MINIMUM_ROLL=4;
const GALACTICA_DESTROYED_DAMAGE=6;
const VIPER_DAMAGED_MINIMUM_ROLL=5;
const VIPER_DESTROYED_MINIMUM_ROLL=8;
const MAX_RAIDERS = 16;
const MAX_HEAVY_RAIDERS = 4;
const MAX_BASESTARS = 2;
const RAIDERS_LAUNCHED=3;
const RAIDERS_LAUNCHED_DURING_ACTIVATION=2;


const SkillTypeEnum = Object.freeze({
    ENGINEERING:"Engineering",
    LEADERSHIP:"Leadership",
    PILOTING:"Piloting",
    POLITICS:"Politics",
    TACTICS:"Tactics",
	LEADERSHIPPOLITICS:"LeadershipPolitics",
	LEADERSHIPENGINEERING:"LeadershipEngineering",
});

const CylonActivationTypeEnum = Object.freeze({
    ACTIVATE_RAIDERS:"Activate Raiders",
	LAUNCH_RAIDERS:"Launch Raiders",
	ACTIVATE_HEAVY_RAIDERS:"Activate Heavy Raiders",
	ACTIVATE_BASESTARS:"Activate Basestars",
    HEAVY_ASSULT:"Heavy Assult",
	NONE:"None"
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
    CHOOSE_VIPER:"Choose Viper",
    ACTIVATE_VIPER:"Activate Viper",
    ATTACK_CENTURION:"Attack Centurion",
	WEAPONS_ATTACK:"Weapons Attack",
    MAIN_TURN:"Main Turn",
	DISCARD_FOR_MOVEMENT:"Discard for movement",
    CHOOSE:"Make a choice",
    SKILL_CHECK:"do a skill check",
    SINGLE_PLAYER_DISCARDS: "Single player discards",
    EACH_PLAYER_DISCARDS: "All players discard",
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

const GalacticaDamageTypeEnum = Object.freeze({ //Shares some text with LocationEnum, don't change one without the other
    FTL_CONTROL:"FTL Control",
    WEAPONS_CONTROL:"Weapons Control",
    COMMAND:"Command",
    ADMIRALS_QUARTERS:"Admiral's Quarters",
    HANGAR_DECK:"Hangar Deck",
    ARMORY:"Armory",
	FOOD:"Food Stores",
	FUEL:"Fuel Stores"
});

const BasestarDamageTypeEnum = Object.freeze({
	CRITICAL:"Critical",
	HANGAR:"Hangar",
	WEAPONS:"Weapons",
	STRUCTURAL:"Structural"
});

const CrisisMap = Object.freeze({

	WATER_SABOTAGED : {
		text : "Every tank on the starboard side has ruptured. " +
		"We're venting all our water directly into space. - Saul Tigh",
		skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: no effect, fail: -2 food',
            pass : game => game.activateCylons(this.WATER_SABOTAGED.cylons),
            fail : game => {
                game.addFood(-2);
                game.activateCylons(this.WATER_SABOTAGED.cylons);
            },
        },
		choose : {
			who : 'current',
			text : 'skillCheck(PO/L/TA) (pass(13): no effect, fail: -2 food) or lose 1 food',
			choice1 : game => {
			    game.doSkillCheck(CrisisMap.WATER_SABOTAGED.skillCheck);
                game.nextAction = () => game.nextAction = null;
            },
			choice2 : game => {
                game.addFood(-1);
                game.nextAction = () => {
                    game.activateCylons(this.WATER_SABOTAGED.cylons);
                    game.nextAction = null;
                };
            },
		},
		jump : true,
		cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
	},
    
    PRISONER_REVOLT : {
        text : "Before I release my captives... I demand the immediate" +
		" resignation of Laura Roslin and her ministers. - Tom Zarek",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: no effect, 6+: -1 population, fail: -1 pop and president chooses who takes the president',
            pass : game => game.activateCylons(this.PRISONER_REVOLT.cylons),
            middle : {
            	value : 6,
				action : game => {
            	    game.addPopulation(-1);
                    game.activateCylons(this.PRISONER_REVOLT.cylons);
                },
			},
            fail : game => {
                game.addPopulation(-1);
                game.choose({
                    who : 'president',
                    text : 'pick a player to give president role to',
                    player : (game, player) => {
                        game.setPresident(player);
                        game.nextAction = () => {
                            game.activateCylons(this.PRISONER_REVOLT.cylons);
                            game.nextAction = null;
                        };
                    },
                });
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },

    RESCUE_THE_FLEET : {
	    text : "The Cylons are waiting for us back there. How long will that take to calculate " +
        "once we get back there? - Saul Tigh, Twelve hours. - Felix Gaeta",
        choose : {
            who : 'admiral',
            text : '-2 population or -1 morale and place basestar and 3 raiders and 3 civ ships',
            choice1 : game => {
                game.addPopulation(-2);
                game.nextAction = () => {
                    game.activateCylons(this.RESCUE_THE_FLEET.cylons);
                    game.nextAction = null;
                }
            },
            choice2 : game => {
                game.addMorale(-1);
                //TODO place base star and 3 raiders in front and 3 civ ships behind BSG
                game.nextAction = () => {
                    game.activateCylons(this.RESCUE_THE_FLEET.cylons);
                    game.nextAction = null;
                }
            },
        },
        jump : true,
	    cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },

    WATER_SHORTAGE : {
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        choose : {
            who : 'president',
            text : '-1 food or president discards 2 skill cards then current player discards 3',
            choice1 : game => {
                game.addFood(-1);
                game.nextAction = () => {
                    game.activateCylons(this.WATER_SHORTAGE.cylons);
                    game.nextAction = null;
                };
            },
            choice2 : game => {
                game.singlePlayerDiscards(game.currentPresident, 2);
                game.nextAction = () => {
                    game.singlePlayerDiscards(game.currentPlayer, 3);
                    game.nextAction = () => {
                        game.activateCylons(this.WATER_SHORTAGE.cylons);
                        game.nextAction = null;
                    };
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    CYLON_SCREENINGS : {
        text : "We should test the people in the most sensitive positions first. - William Adama",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : 'pass: no effect, fail: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the president or admiral',
            pass : game => game.activateCylons(this.CYLON_SCREENINGS.cylons),
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(this.CYLON_SCREENINGS.cylons);
            },
        },
        choose : {
            who : 'current',
            text : 'skillCheck(PO/L) (pass(9): no effect, fail: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the president or admiral. OR  each player discards 2 skill cards',
            choice1 : game => {
                game.doSkillCheck(CrisisMap.CYLON_SCREENINGS.skillCheck);
            },
            choice2 : game => {
                game.eachPlayerDiscards(2);
                game.nextAction = () => {
                    game.activateCylons(this.CYLON_SCREENINGS.cylons);
                    game.nextAction = null;
                }
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
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
                text : 'pick a player to send to brig',
                player : (game, player) => {
                    if (!isNaN(player))
                        if (parseInt(player) > -1 && parseInt(player) < game.players.length) {
                            game.players[player].location = LocationEnum.BRIG;
                            for (let x = 0; x < game.players.length; x++)
                                sendNarrationToPlayer(game.players[x].userId,
                                    `${game.players[player].character.name} has been sent to the brig`);//check that this is correct
                        }
                    game.nextAction = () => {
                        game.activateCylons(this.GUILTY_BY_COLLUSION.cylons);
                        game.nextAction = null;
                    };
                },
            }),
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(this.GUILTY_BY_COLLUSION.cylons);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },

    INFORMING_THE_PUBLIC : {
        text : "I also strongly recommend alerting the public to the Cylon threat. - Hadriam",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : 'pass: Current player looks at 1 random Loyalty Card belonging to a player. fail: -2 morale',
            pass : game => {
                game.choose({
                    who : 'current',
                    text : 'which player do you pick to look at a random loyalty card?',
                    player : (game, player) => {
                        let loyalties = game.players[player].loyalty;
                        let index = Math.ceil(Math.random() * loyalties.length) - 1;
                        sendNarrationToPlayer(game.players[game.currentPlayer].userId, loyalties[index].toString());//todo change this when we know how loyalty works
                        game.nextAction = () => {
                            game.activateCylons(this.INFORMING_THE_PUBLIC.cylons);
                            game.nextAction = null;
                        }
                    }
                });
            },
            fail : game => {
                game.addMorale(-2);
                game.activateCylons(this.INFORMING_THE_PUBLIC.cylons);
            },
        },
        choose : {
            who : 'current',
            text : 'skillCheck(PO/L) (pass(7):Current player looks at 1 random Loyalty Card belonging to a player, fail: -2 morale ' +
            'OR  Roll a die. on 4 or lower. -1 morale and -1 population',
            choice1 : game => {
                game.doSkillCheck(this.INFORMING_THE_PUBLIC.skillCheck);
                game.nextAction = () => game.nextAction = null;
            },
            choice2 : game => {
                let roll = rollDie();
                if (roll <= 4) {
                    game.addPopulation(-1);
                    game.addMorale(-1);
                    sendNarrationToAll(`${game.players[game.currentPlayer].name} rolled a ${roll} and lost 1 population/morale.`);
                } else sendNarrationToAll(`${game.players[game.currentPlayer].name} rolled a ${roll} so nothing happens!`);
                game.nextAction = () => {
                    game.activateCylons(this.INFORMING_THE_PUBLIC.cylons);
                    game.nextAction = null;
                }
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    HEAVY_ASSAULT : {
	    text : "INSTRUCTIONS: 1) Activate: raiders. 2) Setup: 2 basestars, 1 viper, " +
        "3 civilian ships. 3) Special Rule - HEAVY BOMBARDMENT : Each basestar immediatly attacks Galactica.",
        instructions : game => game.activateCylons(this.HEAVY_ASSAULT.cylons),
        jump : false,
	    cylons : CylonActivationTypeEnum.HEAVY_ASSULT,
    },
    
    THE_OLYMPIC_CARRIER : {
	    text : "We have new orders. We're directed to... destroy the Olympic Carrier and then return to Galactica. - Sharon Valerii" +
        " It's a civilian ship... - Kara Thrace",
        skillCheck: {
            value: 11,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text: 'pass: no effect, 8+: -1 population, fail: -1 population and morale.',
            pass: game => game.activateCylons(this.THE_OLYMPIC_CARRIER.cylons),
            middle: {
                value: 8,
                action: game => {
                    game.addPopulation(-1);
                    game.activateCylons(this.THE_OLYMPIC_CARRIER.cylons);
                },
            },
            fail: game => {
                game.addPopulation(-1);
                game.addMorale(-1);
                game.activateCylons(this.THE_OLYMPIC_CARRIER.cylons);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    CYLON_ACCUSATION : {
	    text : "Laura. I have something to tell you. Commander Adama... is a Cylon. - Leoben Conoy",
        skillCheck : {
	        value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : 'pass: no effect, fail: the current player is placed in the brig',
            pass : game => game.activateCylons(this.CYLON_ACCUSATION.cylons),
            fail : game => {
                game.players[game.currentPlayer].location = LocationEnum.BRIG;
                game.activateCylons(this.CYLON_ACCUSATION.cylons);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    FOOD_SHORTAGE : {
	    text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediatly. - Laura Roslin',
        choose : {
            who : 'president',
            text : '-2 food or -1 food, president discards 2 skill cards then current player discards 3',
            choice1 : game => {
                game.addFood(-2);
                game.nextAction = () => {
                    game.activateCylons(this.FOOD_SHORTAGE.cylons);
                    game.nextAction = null;
                };
            },
            choice2 : game => {
                game.singlePlayerDiscards(game.currentPresident, 2);
                game.nextAction = () => {
                    game.singlePlayerDiscards(game.currentPlayer, 3);
                    game.nextAction = () => {
                        game.activateCylons(this.FOOD_SHORTAGE.cylons);
                        game.nextAction = null;
                    };
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    REQUEST_RESIGNATION : {
	    text : "I'm going to have to ask you for your resignation, Madam President. - William Adama" +
        ", No - Laura Roslin, Then I'm terminating your presidency. - William Adama",
        choose : {
	        who : 'admiral',
            text : 'The president and admiral both discard 2 skill cards. OR The President may choose to give the ' +
            'President title to the admiral, or move to the brig.',
            choice1 : game => {
                game.singlePlayerDiscards(game.currentPresident, 2);
                game.nextAction = () => {
                    game.singlePlayerDiscards(game.currentAdmiral, 2);
                    game.nextAction = () => {
                        game.activateCylons(this.REQUEST_RESIGNATION.cylons);
                        game.nextAction = null;
                    };
                };
            },
            choice2 : game => {
	            game.choose({
                    who : 'president',
                    text : 'give up president to admiral OR go to brig',
                    choice1 : game => {
                        game.setPresident(game.currentAdmiral);
                        game.nextAction = () => {
                            game.activateCylons(this.REQUEST_RESIGNATION.cylons);
                            game.nextAction = null;
                        };
                    },
                    choice2 : game => {
                        game.players[game.currentPresident].location = LocationEnum.BRIG;
                        game.nextAction = () => {
                            game.activateCylons(this.REQUEST_RESIGNATION.cylons);
                            game.nextAction = null;
                        };
                    },
                });
	            game.nextAction = () => game.nextAction = null;
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    ELECTIONS_LOOM : {
	    text : "",
        skillCheck : {
	        value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : 'pass: nothing, (5): '
        }
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
	this.players = players;
	let currentPlayer=-1;
	this.currentPlayer = currentPlayer;
	let phase=GamePhaseEnum.SETUP;
	let activePlayer=-1;
	let currentMovementRemaining=-1;
	let activeMovementRemaining=-1;
	let currentActionsRemaining=-1;
	let activeActionsRemaining=-1;
	let spaceAreas={"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]};	
    let availableCharacters=[];
    let charactersChosen=0;
    let discardAmount = 0;
    
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

	//Flags etc
	let vipersToActivate=0;
	let currentViperLocation=-1;
	
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
	let damagedLocations=[];
	let nukesRemaining=-1;
	let currentPresident=-1;
	this.currentPresident = currentPresident;
	let currentAdmiral=-1;
	this.currentAdmiral = currentAdmiral;
	let skillCheckCards=[];
	
	for(let key in users){
		players.push(new Player(users[key]));
	}
    
    this.doSkillCheck = skillJson => {
        phase = GamePhaseEnum.SKILL_CHECK;
        skillCheckTypes = skillJson.types;
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
    
    this.singlePlayerDiscards = (player, numberToDiscard) => {
        phase = GamePhaseEnum.SINGLE_PLAYER_DISCARDS;
        activePlayer = player;
        discardAmount = numberToDiscard;
        sendNarrationToPlayer(players[activePlayer], `Choose ${discardAmount} cards to discard.`);
    };
    
    this.eachPlayerDiscards = (numberToDiscard) => {
        phase = GamePhaseEnum.EACH_PLAYER_DISCARDS;
        nextActive();
        discardAmount = numberToDiscard;
        sendNarrationToPlayer(players[activePlayer], `Choose ${discardAmount} cards to discard.`);
    };
    
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
    
    this.playCrisis = card => {
        if ('choose' in card)
            this.choose(card.choose);
        else if ('skillCheck' in card)
            this.doSkillCheck(card.skillCheck);
        else card.instructions(this);
    };
    
    this.addFuel = x => fuelAmount += x;
    this.addFood = x => foodAmount += x;
    this.addMorale = x => moraleAmount += x;
    this.addPopulation = x => populationAmount += x;
    this.setPresident = x => currentPresident = x;
    this.setAdmiral = x => currentAdmiral = x;
    
    let discardSkill = (player, index) => {
      let card = players[player].hand.splice(index, 1)[0];
      decks[card.type].discard.push(card);
    };
			
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

        //Create Galactica damage array
		for(let type in GalacticaDamageTypeEnum){
			if(GalacticaDamageTypeEnum[type]===GalacticaDamageTypeEnum.FOOD||GalacticaDamageTypeEnum[type]===GalacticaDamageTypeEnum.FUEL){
				continue;
			}
			damagedLocations[type]=false;
		}

		console.log(damagedLocations);

		//Create starting skill card decks
        let skillDeck=buildStartingSkillCards();
        for (let i = 0; i < skillDeck.length; i++) {
            decks[skillDeck[i].type].deck.push(skillDeck[i]);
        }

        //Create glactica damage deck
        for(let type in GalacticaDamageTypeEnum){
            decks[DeckTypeEnum.GALACTICA_DAMAGE].deck.push(GalacticaDamageTypeEnum[type]);
        }
        shuffle(decks[DeckTypeEnum.GALACTICA_DAMAGE].deck);

        //Create basestar damage deck
		for(let type in BasestarDamageTypeEnum){
        	decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(BasestarDamageTypeEnum[type]);
		}
		shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);

		//Create crisis deck
        for(let type in CrisisMap){
            decks[DeckTypeEnum.CRISIS].deck.push(CrisisMap[type]);
        }
        shuffle(decks[DeckTypeEnum.CRISIS].deck);

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
        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!=null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
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
                sendNarrationToAll(players[activePlayer].character.name + " picks " + amount + " Leadership and "+
                    (skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount)+" Politics");
            }
        }else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!=null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
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
                sendNarrationToAll(players[activePlayer].character.name + " picks " + amount + " Leadership and " +
                    (skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount) + " Engineering");
            }
        }
    };

    let pickResearchCard=function(text){
		if(text==='0'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.ENGINEERING+" skill card");
            players[activePlayer].hand.push(decks[DeckTypeEnum.ENGINEERING].deck);
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.TACTICS+" skill card");
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
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southwest");
            players[activePlayer].viperLocation=SpaceEnum.SW;
            spaceAreas[SpaceEnum.SW].push(s);
        }else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southeast");
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

    let chooseViper = function(text){
    	if(SpaceEnum[text]==null){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
		}

		for(let i=0;i<spaceAreas[SpaceEnum[text]].length;i++){
			if(spaceAreas[SpaceEnum[text]][i].type===ShipTypeEnum.VIPER&&spaceAreas[SpaceEnum[text]][i].pilot===-1){
				currentViperLocation=SpaceEnum[text];
				phase=GamePhaseEnum.ACTIVATE_VIPER;
                sendNarrationToPlayer(players[activePlayer].userId, 'Choose an action for this viper');
                return;
			}
		}

		sendNarrationToPlayer(players[activePlayer].userId, 'There are no unmanned vipers there');
		return;
	};

	let activateViper = function(text){
        if(SpaceEnum[text]!=null){
			if(isAdjacentSpace(SpaceEnum[text],currentViperLocation)){
                for(let i=0;i<spaceAreas[currentViperLocation].length;i++){
                    if(spaceAreas[currentViperLocation][i].type===ShipTypeEnum.VIPER&&spaceAreas[currentViperLocation][i].pilot===-1){
                    	console.log("viper found in area");
                        let v = spaceAreas[currentViperLocation][i];
                        spaceAreas[currentViperLocation].splice(i,1);
                        spaceAreas[SpaceEnum[text]].push(v);
                        sendNarrationToAll(players[activePlayer].character.name + " moves an unmanned viper from "+currentViperLocation+" to "+SpaceEnum[text]);
                        currentViperLocation=-1;
                        vipersToActivate--;
                        break;
                    }
                    console.log("viper not found in area");
                }
			}
        }else{
            let num=parseInt(text);
            if(isNaN(num) || num<0 || num>=centurionTrack.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
                return;
            }
            if(attackCylonShip(currentViperLocation,num,false)) {
                vipersToActivate--;
            }
        }

        if(vipersToActivate>0){
            sendNarrationToPlayer(players[activePlayer].userId, vipersToActivate+' viper(s) left to activate. Select a location to activate a viper');
            phase=GamePhaseEnum.CHOOSE_VIPER;
        }else{
            sendNarrationToPlayer(players[activePlayer].userId, "Done activating vipers");
            phase=GamePhaseEnum.MAIN_TURN;
        }

        return;
	};

	let attackCenturion=function(text){
        let num=parseInt(text);
        if(isNaN(num) || num<0 || num>=centurionTrack.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }else if(centurionTrack[num]===0){
            sendNarrationToPlayer(players[activePlayer].userId, 'No centurions there');
            return;
		}
		let roll=rollDie();
        sendNarrationToAll(players[activePlayer].character.name + " rolls a "+roll);
        if(roll>=CENTURION_DESTROYED_MINIMUM_ROLL){
            sendNarrationToAll(players[activePlayer].character.name + " kills a centurion!");
            centurionTrack[num]--;
        }else{
            sendNarrationToAll(players[activePlayer].character.name + " didn't kill the centurion");
		}
        phase=GamePhaseEnum.MAIN_TURN;
        return;
	};

	let attackCylonShip=function(loc, num, isAttackerGalactica){
        let ship=spaceAreas[loc][num];
        if(ship.type===ShipTypeEnum.VIPER||ship.type===ShipTypeEnum.CIVILIAN){
            sendNarrationToPlayer(players[activePlayer].userId, 'Can\'t attack a human ship!');
            return false;
        }

        let roll=rollDie();
        sendNarrationToAll(players[activePlayer].character.name + " attacks the "+ship.type+" at "+loc);
        sendNarrationToAll(players[activePlayer].character.name + " rolls a "+roll);
        if(ship.type===ShipTypeEnum.RAIDER) {
            if (roll>=RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(players[activePlayer].character.name + " destroys the raider!");
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(players[activePlayer].character.name + " tries to attack the raider and misses");
            }
        }else if(ship.type===ShipTypeEnum.HEAVY_RAIDER) {
            if (roll>=HEAVY_RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(players[activePlayer].character.name + " destroys the heavy raider!");
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(players[activePlayer].character.name + " tries to attack the heavy raider and misses");
            }
        }else if(ship.type===ShipTypeEnum.BASESTAR) {
            if(ship.damage[0]==BasestarDamageTypeEnum.STRUCTURAL||
                ship.damage[1]==BasestarDamageTypeEnum.STRUCTURAL){
                roll+=2;
                sendNarrationToAll("Roll upgraded to "+roll+" by basestar structural damage");
            }
            if((isAttackerGalactica&&roll>=GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL)||roll>=VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL){
                damageBasestar(loc,num);
            }else{
                sendNarrationToAll(players[activePlayer].character.name + " tries to attack the basestar and misses");
            }
        }

        return true;
	};

    let weaponsAttack=function(text){
    	let input=text.split(" ");
    	if(input.length!==2){
            sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
            return;
        }
    	let loc=SpaceEnum[input[0]];
        let num=parseInt(input[1]);
        if(loc==null || isNaN(num) || num<0 || num>=spaceAreas[loc].length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
            return;
        }
        if(attackCylonShip(loc,num,true)) {
            phase = GamePhaseEnum.MAIN_TURN;
        }
        return;
    };

	let isAdjacentSpace = (space1,space2) =>
			(space1===SpaceEnum.NE&&(space2===SpaceEnum.NW||space2===SpaceEnum.E))||
            (space1===SpaceEnum.E&&(space2===SpaceEnum.NE||space2===SpaceEnum.SE))||
            (space1===SpaceEnum.SE&&(space2===SpaceEnum.E||space2===SpaceEnum.SW))||
            (space1===SpaceEnum.SW&&(space2===SpaceEnum.SE||space2===SpaceEnum.W))||
            (space1===SpaceEnum.W&&(space2===SpaceEnum.SW||space2===SpaceEnum.NW))||
            (space1===SpaceEnum.NW&&(space2===SpaceEnum.W||space2===SpaceEnum.NE));

	let damageBasestar=function(loc,num){
		let basestar=spaceAreas[loc][num];
		if(basestar.damage[1]!==-1||basestar.damage[0]===BasestarDamageTypeEnum.CRITICAL) {
            destroyBasestar(loc,num);
            return;
        }

        let damageType=drawCard(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);
        sendNarrationToAll(players[activePlayer].character.name + " hits the basestar!");
        sendNarrationToAll("The basestar has taken "+damageType+" damage!");
        if(basestar.damage[0]===-1){
            basestar.damage[0]=damageType;
		}else{
            basestar.damage[1]=damageType;
            if(damageType===BasestarDamageTypeEnum.CRITICAL){
                destroyBasestar(loc,num);
                return;
			}
		}
	};

	let destroyBasestar=function(loc,num){
        let basestar=spaceAreas[loc][num];
        sendNarrationToAll("The basestar is destroyed!");
        decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[0]);
        decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[1]);
        shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);
        spaceAreas[loc].splice(num, 1);
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
			if(skills[SkillTypeEnum[type]]==null||SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPENGINEERING
                || SkillTypeEnum[type]===SkillTypeEnum.LEADERSHIPPOLITICS){
				continue;
			}
			for(let i=0;i<skills[SkillTypeEnum[type]];i++) {
                players[player].hand.push(drawCard(decks[DeckTypeEnum[type]].deck));
            }
		}

        if(skills[SkillTypeEnum.LEADERSHIPPOLITICS]!=null&&skills[SkillTypeEnum.LEADERSHIPPOLITICS]>0){
            phase=GamePhaseEnum.PICK_HYBRID_SKILL_CARD;
            sendNarrationToPlayer(players[activePlayer].userId, "Pick up to "+skills[SkillTypeEnum.LEADERSHIPPOLITICS]+
                " "+SkillTypeEnum.LEADERSHIP+". The rest will be "+SkillTypeEnum.POLITICS);
        	return;
		}else if(skills[SkillTypeEnum.LEADERSHIPENGINEERING]!=null&&skills[SkillTypeEnum.LEADERSHIPENGINEERING]>0){
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

	let addToActionPoints=function(num){
		activeActionsRemaining+=num;

        if(activePlayer===currentPlayer){
			currentActionsRemaining+=num;
		}
	};

	let doCrisisStep=function(){
		console.log("starting crisis step");
		let crisisCard=drawCard(decks[DeckTypeEnum.CRISIS].deck);
		console.log(crisisCard);
		activateCylonShips(crisisCard.cylons);
		decks[DeckTypeEnum.CRISIS].discard.push(crisisCard);
	};

	let activateRaider=function(loc,num){
		if(spaceAreas[loc][num].activated){
			return;
		}
		spaceAreas[loc][num].activated=true;

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot === -1) {
                sendNarrationToAll("Cylon raider attacks a viper");
                let roll = rollDie();
                sendNarrationToAll("Cylon raider rolls a " + roll);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!");
                    spaceAreas[loc].splice(i,1);
                    return;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged");
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return;
                } else {
                    sendNarrationToAll("The raider misses!");
                    return;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot !== -1) {
                sendNarrationToAll("Cylon raider attacks viper piloted by "+players[spaceAreas[loc][i].pilot].character.name+"!");
                let roll = rollDie();
                sendNarrationToAll("Cylon raider rolls a " + roll);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!");
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!");
                    spaceAreas[loc].splice(i,1);
                    return;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged");
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!");
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return;
                } else {
                    sendNarrationToAll("The raider misses!");
                    return;
                }
            }
        }


		let closestPath=[];
		switch(loc){
			case SpaceEnum.NE:
                closestPath=[SpaceEnum.E,SpaceEnum.NW,SpaceEnum.SE,SpaceEnum.W,SpaceEnum.SW];
				break;
            case SpaceEnum.E:
                closestPath=[SpaceEnum.SE,SpaceEnum.NE,SpaceEnum.SW,SpaceEnum.NW,SpaceEnum.W];
                break;
            case SpaceEnum.SE:
                closestPath=[SpaceEnum.SW,SpaceEnum.E,SpaceEnum.W,SpaceEnum.NE,SpaceEnum.NW];
                break;
            case SpaceEnum.SW:
                closestPath=[SpaceEnum.W,SpaceEnum.SW,SpaceEnum.NW,SpaceEnum.SE,SpaceEnum.NE];
                break;
            case SpaceEnum.W:
                closestPath=[SpaceEnum.NW,SpaceEnum.SW,SpaceEnum.NE,SpaceEnum.SE,SpaceEnum.E];
                break;
            case SpaceEnum.NW:
                closestPath=[SpaceEnum.NE,SpaceEnum.W,SpaceEnum.E,SpaceEnum.SW,SpaceEnum.SE];
                break;
			default:
				break;
		}



	};

	let activateCylonShips = function(type){
		if(type===CylonActivationTypeEnum.ACTIVATE_RAIDERS){
            sendNarrationToAll("Cylons activate raiders!");
            let totalRaiders=0;
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                    if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                        totalRaiders++;
                    }
                }
            }
            if(totalRaiders===0){
                for(let s in SpaceEnum){
                    for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                        if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                        	if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.HANGAR||
								spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.HANGAR){
                                sendNarrationToAll("Basestar can't launch raiders because of hangar damage");
                                continue;
							}
                            sendNarrationToAll("Basestar launches raiders!");
                            let raidersToLaunch=MAX_RAIDERS;
                            if(totalRaiders+RAIDERS_LAUNCHED_DURING_ACTIVATION>MAX_RAIDERS){
                                raidersToLaunch=MAX_RAIDERS-totalRaiders;
                            }
                            totalRaiders+=raidersToLaunch;
                            for(let j=0;j<raidersToLaunch;j++){
                                spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.RAIDER));
                            }
                        }
                    }
                }
			}else{
                for(let s in SpaceEnum){
                    for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                        if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                            activateRaider(SpaceEnum[s],i);
                        }
                    }
                }
                for(let s in SpaceEnum){
                    for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                        if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                            spaceAreas[SpaceEnum[s]][i].activated=false;
                        }
                    }
                }
			}

        }else if(type===CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS){
            sendNarrationToAll("Cylons activate heavy raiders!");
            if(centurionTrack[centurionTrack.length-1]>0){
            	sendNarrationToAll("Centurions kill the crew of Galactica!");
             	gameOver();
             	return;
            }
			for(let i=centurionTrack.length-1;i>0;i--){
				if(centurionTrack[i]>0){
					sendNarrationToAll("Centurions advance!");
					centurionTrack[i+1]=centurionTrack[i];
				}
			}
			centurionTrack[0]=0;

			let heavyRaidersFound=0;
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                    if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.HEAVY_RAIDER){
						heavyRaidersFound++;
						let newLocation=-1;
						switch(SpaceEnum[s]){
                            case SpaceEnum.NE:
                                newLocation=SpaceEnum.E;
                                break;
                            case SpaceEnum.E:
                                newLocation=SpaceEnum.SE;
                                break;
                            case SpaceEnum.W:
                                newLocation=SpaceEnum.SW;
                                break;
                            case SpaceEnum.NW:
                                newLocation=SpaceEnum.W;
                                break;
                            case SpaceEnum.SE:
                            case SpaceEnum.SW:
                                break;
                            default:
                                break;
                        }
                        if(newLocation===-1){
                            sendNarrationToAll("Centurions board Galactica!");
                            centurionTrack[0]++;
                            spaceAreas[SpaceEnum[s]].splice(i,1);
                            heavyRaidersFound--;
                        }else{
                            let heavyRaider = spaceAreas[SpaceEnum[s]][i];
                            spaceAreas[SpaceEnum[s]].splice(i,1);
                            spaceAreas[newLocation].push(heavyRaider);
                        }
                    }
                }
            }

            if(!heavyRaidersFound){
                for(let s in SpaceEnum){
                    for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                        if(heavyRaidersFound>=MAX_HEAVY_RAIDERS){
                            return;
                        }
                        if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                            sendNarrationToAll("Cylon basestar launches heavy raiders!");
                            spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.HEAVY_RAIDER));
                            heavyRaidersFound++;
                        }
                    }
                }
            }
		}else if(type===CylonActivationTypeEnum.ACTIVATE_BASESTARS){
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                    if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                        if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.WEAPONS||
                            spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.WEAPONS){
                            sendNarrationToAll("Basestar can't attack Galactica because of hangar damage");
                            continue;
                        }
                        sendNarrationToAll("Cylon basestar attacks Galactica!");
                        let roll = rollDie();
                        sendNarrationToAll("Cylon basestar rolls a " + roll);
                        if (roll >= BASESTAR_DAMAGES_GALACTICA_MINIMUM_ROLL) {
                            sendNarrationToAll("Galactica is hit!");
                            damageGalactica();
                        } else {
                            sendNarrationToAll("The basestar misses!");
                        }
					}
                }
            }
        }else if(type===CylonActivationTypeEnum.LAUNCH_RAIDERS){
            sendNarrationToAll("Cylon basestars launch raiders!");
            let totalRaiders=0;
			for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++) {
                    if (spaceAreas[SpaceEnum[s]][i].type === ShipTypeEnum.RAIDER) {
                        totalRaiders++;
                    }
                }
            }

            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                    if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                        if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.HANGAR||
                            spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.HANGAR){
                            sendNarrationToAll("Basestar can't launch raiders because of hangar damage");
                            continue;
                        }
                    	let raidersToLaunch=MAX_RAIDERS;
                    	if(totalRaiders+RAIDERS_LAUNCHED>MAX_RAIDERS){
                            raidersToLaunch=MAX_RAIDERS-totalRaiders;
						}
                        totalRaiders+=raidersToLaunch;
                    	for(let j=0;j<raidersToLaunch;j++){
                            spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.RAIDER));
                        }
                    }
                }
            }
        }else if(type===CylonActivationTypeEnum.NONE){

        }

        return;
	};
    this.activateCylons = activateCylonShips;
    
	let damageGalactica=function(){
        let damageType=drawCard(decks[DeckTypeEnum.GALACTICA_DAMAGE].deck);
        sendNarrationToAll("Basestar damages the "+GalacticaDamageTypeEnum[damageType]+"!");
        if(GalacticaDamageTypeEnum[damageType]===GalacticaDamageTypeEnum.FOOD){
			foodAmount--;
            //this.addFood(-1);
		}else if(GalacticaDamageTypeEnum[damageType]===GalacticaDamageTypeEnum.FUEL){
            fuelAmount--;
            //this.addFuel(-1);
		}else{
			damagedLocations[GalacticaDamageTypeEnum[damageType]]=true;
			let totalDamage=0;
			for(let i=0;i<damagedLocations.length;i++){
				if(damagedLocations[i]){
                    totalDamage++;
				}
			}
			if(totalDamage>=6){
                sendNarrationToAll("Galactica is destroyed!");
                gameOver();
            }
            for(let i=0;i<players.length;i++){
                if(players[i].location===GalacticaDamageTypeEnum[damageType]){
                    players[i].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[i].character.name+" is sent to Sickbay!");
                }
            }
		}

		console.log(damagedLocations);

		return;
	};

	let doMainTurn = function(text){
        if(text.toUpperCase()==="ACTIVATE"){
            let success=activateLocation(players[activePlayer].location);
            if(success && players[activePlayer].viperLocation===-1){
                addToActionPoints(-1);
            }
            return;
        }else if(text.toUpperCase()==="NOTHING"){
            addToActionPoints(-1);
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
					if(players[activePlayer].viperLocation!==-1||isLocationOnColonialOne(players[activePlayer].location)!==isLocationOnColonialOne(LocationEnum[l])){
						if(players[activePlayer].hand.length===0){
							sendNarrationToPlayer(players[activePlayer].userId, "Not enough cards");
							return;
						}

                        if(players[activePlayer].viperLocation!==-1){
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

        if(players[activePlayer].viperLocation!==-1&&SpaceEnum[text]!=null){
            if(isAdjacentSpace(SpaceEnum[text],players[activePlayer].viperLocation)){
                for(let i=0;i<spaceAreas[players[activePlayer].viperLocation].length;i++){
                    if(spaceAreas[players[activePlayer].viperLocation][i].pilot===activePlayer){
                        let v = spaceAreas[players[activePlayer].viperLocation][i];
                        spaceAreas[players[activePlayer].viperLocation].splice(i,1);
                        spaceAreas[SpaceEnum[text]].push(v);
                        sendNarrationToAll(players[activePlayer].character.name + " moves in viper from "+players[activePlayer].viperLocation+" to "+SpaceEnum[text]);
                        players[activePlayer].viperLocation=SpaceEnum[text];
                        if(currentMovementRemaining>0){
                            currentMovementRemaining--;
						}else{
                        	addToActionPoints(-1);
						}
                        break;
                    }
                }
            }
        }else if(players[activePlayer].viperLocation!==-1){
            let num=parseInt(text);
            if(isNaN(num) || num<0 || num>=spaceAreas[players[activePlayer].viperLocation].length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid ship location');
                return;
            }
            if(attackCylonShip(players[activePlayer].viperLocation,num,false)) {
                addToActionPoints(-1);
                phase = GamePhaseEnum.MAIN_TURN;
            }
            return;
		}

		return;
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
	
	let makeChoice = text => {
        //if choice2 is null it means the choice is to do something to a player
        if (choice2 === null) {
            choice1(this, parseInt(text));
        } else {
            if (text === '1') choice1(this);
            else if (text === '2') choice2(this);
        }
        this.nextAction();
    };
	
	let singlePlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    discardSkill(activePlayer, x);
            this.nextAction();
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${players[activePlayer].hand.length -1}`);
        discardAmount = 0;
    };
	
	let eachPlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    discardSkill(activePlayer, x);
            if (++playersChecked === players.length) {
                playersChecked = 0;
                discardAmount = 0;
                this.nextAction();
            } else {
                nextActive();
                sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${discardAmount} skill cards to discard`);
            }
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${players[activePlayer].hand.length -1}`);
    };
	
	let calculateSkillCheckCards = () => {
	    let count = 0;
	    for (let x = skillCheckCards.length -1; x > -1; x++) {
            count += skillCheckTypes.indexOf(skillCheckCards[x].type) > -1 ? skillCheckCards[x].value : skillCheckCards[x].value * -1;
            decks[skillCheckCards[x].type].discard.push(skillCheckCards.splice(x, 1)[0]);
        }
	    return count;
    };
	
	let doSkillCheckPick = text => {
	    let indexes = false;
        for (let x = 0; x < players[activePlayer].length; x++) {
            indexes = isLegitIndexString(text, players[activePlayer].hand.length, x);
            if (indexes !== false)
                x = 420;
        }
        if (indexes === false){
            sendNarrationToPlayer(players[activePlayer].userId, 'does not compute');
            return;
        }
        for (let x = players[activePlayer].hand - 1; x > -1; x--)
            if (indexes.indexOf(x) > -1)
                skillCheckCards.push(players[activePlayer].hand.splice(x,1)[0]);
        if (++playersChecked === players.length) {
            playersChecked = 0;
            let temp = calculateSkillCheckCards();
            if (temp >= passValue)
                skillPass();
            else if (temp >= middleValue && middleValue !== -1)
                skillMiddle();
            else
                skillFail();
        } else {
            nextActive();
            sendNarrationToPlayer(players[activePlayer].userId, skillText);
        }
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
		if(damagedLocations[location]){
            sendNarrationToPlayer(players[activePlayer].userId, location+" is damaged!");
            return false;
        }
        switch (location) {
            //Colonial One
            case LocationEnum.PRESS_ROOM:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.PRESS_ROOM);
                sendNarrationToAll(players[activePlayer].character.name + " draws 2 Politics skill cards");
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
                if (jumpTrack < JUMP_PREP_3POP_LOCATION) {
                    sendNarrationToPlayer(players[activePlayer].userId, "Jump track is in the red!");
                    return false;
                }

                let popLoss = 0;
                if (jumpTrack < JUMP_PREP_3POP_LOCATION) {
                    popLoss = 3;
                } else if (jumpTrack < JUMP_PREP_3POP_LOCATION) {
                    popLoss = 1;
                } else {
                    return false;
                }

                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.FTL_CONTROL);
                let roll = rollDie();
                sendNarrationToAll(players[activePlayer].character.name + " roll a " + roll);
                if (roll < 7) {
                    //this.addPopulation(-popLoss);
                    populationAmount -= popLoss;
                    sendNarrationToAll(popLoss + " population was left behind!");
                } else {
                    sendNarrationToAll("Everyone made it safely!");
                }

                return true;
			case LocationEnum.WEAPONS_CONTROL:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.WEAPONS_CONTROL);
                sendNarrationToPlayer(players[activePlayer].userId, "Select a space location and a ship number");
                phase = GamePhaseEnum.WEAPONS_ATTACK;
                return true;
            case LocationEnum.COMMUNICATIONS:
                return true;
            case LocationEnum.RESEARCH_LAB:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.RESEARCH_LAB);
                sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Engineering or 1 for Tactics");
                phase = GamePhaseEnum.PICK_RESEARCH_CARD;
                return true;
            case LocationEnum.COMMAND:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.COMMAND);
                sendNarrationToPlayer(players[activePlayer].userId, "Select a space location to activate a viper");
                vipersToActivate = 2;
                phase = GamePhaseEnum.CHOOSE_VIPER;
                return true;
            case LocationEnum.ADMIRALS_QUARTERS:
                return true;
            case LocationEnum.HANGAR_DECK:
				if(players[activePlayer].viperLocation!==-1){
                    sendNarrationToPlayer(players[activePlayer].userId, "You're already piloting a viper!");
                    return false;
				}else if(players[activePlayer].character.skills.Piloting == null) {
                    sendNarrationToPlayer(players[activePlayer].userId, "You're not a pilot!");
                    return false;
                }else if(vipersInHangar>0){
                    sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.HANGAR_DECK);
                    sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Southwest launch or 1 for Southeast launch");
                   addToActionPoints(1);
                    phase=GamePhaseEnum.PICK_LAUNCH_LOCATION;
                    return true;
				}else{
                    sendNarrationToPlayer(players[activePlayer].userId, "No vipers left ot pilot");
            		return false;
				}
                return true;
            case LocationEnum.ARMORY:
            	for(let i=0;i<centurionTrack.length;i++){
            		if(centurionTrack[i]>0){
                        sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.ARMORY);
                        sendNarrationToPlayer(players[activePlayer].userId, "Select a position on the boarding track");
                        phase=GamePhaseEnum.ATTACK_CENTURION;
                        return true;
					}
				}
                sendNarrationToPlayer(players[activePlayer].userId, "No centurions on Galactica!");
                return false;
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
            if(players[getPlayerNumberById(userId)].viperLocation!==-1){
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
            		if(spaceAreas[SpaceEnum[s]][i].pilot!==-1){
                        msg+=" & pilot "+players[spaceAreas[SpaceEnum[s]][i].pilot].character.name;
					}
                    if(spaceAreas[SpaceEnum[s]][i].damage[0]!==-1){
                        msg+=" with "+spaceAreas[SpaceEnum[s]][i].damage[0]+" damage";
                        if(spaceAreas[SpaceEnum[s]][i].damage[1]!==-1){
                            msg+=" and "+spaceAreas[SpaceEnum[s]][i].damage[1]+" damage";
						}
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
        }else if(text.toUpperCase()==="CENTURIONS") {
            sendNarrationToPlayer(userId, centurionTrack);
            return;
        }else if(text.toUpperCase()==="PHASE"){
            sendNarrationToPlayer(userId, phase);
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
        }else if(phase===GamePhaseEnum.CHOOSE_VIPER){
            chooseViper(text);
        }else if(phase===GamePhaseEnum.ACTIVATE_VIPER){
            activateViper(text);
        }else if(phase===GamePhaseEnum.ATTACK_CENTURION){
            attackCenturion(text);
        }else if(phase===GamePhaseEnum.WEAPONS_ATTACK){
            weaponsAttack(text);
        }else if(phase===GamePhaseEnum.MAIN_TURN){
            doMainTurn(text);
        }else if(phase===GamePhaseEnum.DISCARD_FOR_MOVEMENT){
            discardForMovement(text);
        }else if(phase===GamePhaseEnum.CHOOSE){
            makeChoice(text);
        } else if (phase === GamePhaseEnum.SKILL_CHECK) {
            doSkillCheckPick(text);
        } else if (phase === GamePhaseEnum.EACH_PLAYER_DISCARDS) {
            eachPlayerDiscardPick(text)
        } else if (phase === GamePhaseEnum.SINGLE_PLAYER_DISCARDS) {
            singlePlayerDiscardPick(text);
        }

        if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN){
            doCrisisStep();
            nextTurn();
        }
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
	this.activated=false;
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
            if(numPlayers===1){
            	host=userId;
            }
            
            //temporary way to set up a 3 player game for testing
            if(numPlayers>1){
            	for(let key in users){
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

const isLegitIndexString = (string, max, amount) => {
    string = string.split(' ');
    let numbers = [];
    if (string.length !== amount)
        return false;
    for (x = 0; x < string.length; x++)
        if (isNaN(string[x]))
            return false;
        else if(parseInt(string[x]) >= max || parseInt(string[x]) < 0)
            return false;
        else if (numbers.indexOf(parseInt(string[x])) !== -1)
            return false;
        else numbers.push(parseInt(string[x]));
    return numbers;
};