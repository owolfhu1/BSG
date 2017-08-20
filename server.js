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
const RAIDER_DAMAGES_GALACTICA_MINIMUM_ROLL=8;
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
	//Cylon activation step
    ACTIVATE_RAIDERS:"Activate Raiders",
	LAUNCH_RAIDERS:"Launch Raiders",
	ACTIVATE_HEAVY_RAIDERS:"Activate Heavy Raiders",
	ACTIVATE_BASESTARS:"Activate Basestars",
    NONE:"None",

    //Cylon attack cards
    HEAVY_ASSAULT:"Heavy Assault",

	//Other
    RESCUE_THE_FLEET:"Rescue the Fleet",
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
	PLACE_SHIPS:"Place Ships",
    LADAMA_STARTING_LAUNCH:"Lee Adama Starting Launch",
    CHOOSE_VIPER:"Choose Viper",
    ACTIVATE_VIPER:"Activate Viper",
	REPAIR_VIPERS_OR_HANGAR_DECK:"Repair vipers or hangar deck",
    ATTACK_CENTURION:"Attack Centurion",
	WEAPONS_ATTACK:"Weapons Attack",
    MAIN_TURN:"Main Turn",
	DISCARD_FOR_MOVEMENT:"Discard for movement",
    CHOOSE:"Make a choice",
    SKILL_CHECK:"do a skill check",
    SINGLE_PLAYER_DISCARDS: "Single player discards",
    EACH_PLAYER_DISCARDS: "All players discard",
    DRAW_OR_PLAY_QUORUM_CARD:"Draw or Play Quorum Card",
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

const DestinationMap = Object.freeze({
    
    DEEP_SPACE : {
        total : 3,
        name : "Deep Space",
        text : "Lose 1 fuel and 1 morale",
        value : 2,
        action : game => {
            //TODO write this
        },
    },
    
    ICY_MOON : {
        total : 3,
        name : "Icy Moon",
        text : "Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. if 3" +
        " or higher, gain 1 food. Otherwise, destroy 1 raptor.",
        value : 1,
        action : game => {
            //TODO write this
        },
    },
    
    BARREN_PLANET : {
        total : 4,
        name : "Barren Planet",
        text : "Lose 2 fuel.",
        value : 2,
        action : game => {
            //TODO write this
        },
    },
    
    REMOTE_PLANET : {
        total : 3,
        name : "Remote Planet",
        text : "Lose 1 fuel and destroy 1 raptor.",
        value : 2,
        action : game => {
            //TODO write this
        },
    },
    
    TYLIUM_PLANET : {
        total : 4,
        name : "Tylium Planet",
        text : "Lose 1 fuel. The Admiral May risk 1 raptor to roll a die. If 3 or higher, " +
        "gain 2 fuel. Otherwise, destroy 1 raptor.",
        value : 1,
        action : game => {
            //TODO write this
        },
    },
    
    ASTEROID_FIELD : {
        total : 2,
        name : "Astroid Field",
        text : "Lose 2 fuel. Then draw 1 civilian ship and destroy it. [lose the resources on the back].",
        value : 3,
        action : game => {
            //TODO write this
        },
    },
    
    RAGNAR_ANCHORAGE : {
        total : 1,
        name : "Ragnar Anchorage",
        text : "The Admiral may repair up to 3 vipers and 1 raptor. These ships may be damaged or even destroyed.",
        value : 1,
        action : game => {
            //TODO write this
        },
    },
    
    CYLON_AMBUSH : {
        total : 1,
        name : "Cylon Ambush",
        text : "Lose 1 fuel. Then place 1 basestar and 3 raiders infront of" +
        " Galactica and 3 civilian ships behind Galactica.",
        value : 3,
        action : game => {
            //TODO write this
        },
    },
    
    CYLON_REFINERY : {
        total : 1,
        name : "Cylon Refinery",
        text : "Lose 1 fuel. The Admiral may risk 2 vipers to roll a die. If 6 or higher, " +
        "gain 2 fuel. otherwise, damage 2 vipers.",
        value : 2,
        action : game => {
            //TODO write this
        },
    },
    
    DESOLATE_MOON : {
        total : 1,
        name : "Desolate Moon",
        text : "Lose 3 fuel.",
        value : 3,
        action : game => {
            //TODO write this
        },
    },
    
});

const QuorumMap = Object.freeze({

    FOOD_RATIONING : {
        total : 2,
        name : 'Food Rationing',
        text : "I estimate that the current civilian population of 45,265 will require at a minimum: " +
        "82 tons of grain, 85 tons of mean, 119 tons of fruit, 304 tons of vegetables... per week. - Gaius Baltar",
        actionText : "Roll a die. If 6 or higher, gain 1 food and remove this card from the" +
        " game. Otherwise no effect and discard this card",
        action : game => {
            //TODO write this
        },
    },
    
    PRESIDENTIAL_PARDON: {
        total : 1,
        name : 'Presidential Pardon',
        text : "I can do more. I can guarantee your safty. I can even order you released. - Laura Roslin",
        actionText : "Move any other character from the brig to any other location on Galactica.",
        action : game => {
            game.choose({
                who : 'current',
                text : 'Choose a player to move from the brig.',
                player : (game, player) => {
                    game.nextAction = next => {
                        next.nextAction = null;
                        next.choose({
                            who : 'current',
                            text : `Choose a location to send ${game.getPlayers()[player].character.name} to.`,
                            other : (second, command) => {
                                second.nextAction = third => {
                                    third.nextAction = null;
                                    if (LocationEnum[command] != null) {
                                        if (third.getLocation(player) === LocationEnum.BRIG) {
                                            third.setLocation(player, command);
                                        } else {
                                            sendNarrationToPlayer(third.getPlayers()[third.getCurrentPlayer()].userId,
                                                "that player was not in the brig so nothing happens");
                                        }
                                    } else {
                                        sendNarrationToPlayer(third.getPlayers()[third.getCurrentPlayer()].userId,
                                            "incorrect location, nothing happens");
                                    }
                                    third.playCrisis(third.getDecks()[DeckTypeEnum.CRISIS].deck.pop());
                                };
                            }
                        })
                    };
                },
            });
        },
    },
    
    RELEASE_CYLON_MUGSHOTS : {
        total : 1,
        name : 'Release Cylon Mugshots',
        text : 'The Cylons have the ability to mimic human form; they look like us now. This man has ' +
        'been identified as a Cylon Agent. We believe him to be responsible for the bombing. - Laura Roslin',
        actionText : "Look at 1 random Loyalty Card belonging to any other player, then roll a die. " +
        "If 3 or less, lose 1 morale. Then discard this card.",
        action : game => {
            //TODO write this
        },
    },

    ARREST_ORDER : {
        total : 2,
        name : "Arrest_ORDER",
        text : "HE has confessed to lying under oath and dereliction of duty in a time of war. He has been stripped of" +
        " rank and confined to the Galactica brig. - Laura Roslin",
        actionText : "Choos a character and send him to the Brig location. Then discard this card.",
        action : game => {
            //TODO write this
        },
    },
    
    AUTHORIZATION_OF_BRUTAL_FORCE : {
        total : 2,
        name : 'Authorization of Brutal Force',
        text : "They have... over 1,300 innocent people on board... - Laura Roslin<br>No choice now. Them or us. William Adama",
        actionText : "Destroy 3 raiders, 1 heavy or 1 centurion. Then roll a die, and if 2 or less, lose 1 population. " +
        "Then discard this card",
        action : game => {
            //TODO write this
        },
    },
    
    INSPIRATIONAL_SPEECH : {
        total : 4,
        name : "Inspirational Speech",
        text : "I'm sure I speak on behalf of everyone in the fleer when i say, thank you." +
        " Without your dedication, tireless effords, and sacrifice, none of us would be here today. Laura Roslin",
        actionText : "Roll a die. If 6 or higher, gain 1 morale and remove this card from" +
        " the game. Otherwise, no effect and discard this card.",
        action : game => {
            //TODO write this
        },
    },
    
    ENCOURAGE_MUTINY : {
        total : 1,
        name : "Encourage Mutiny",
        text : "We both took an oath to protect and defend the Articles of Colonization. Those Articles " +
        "are under attack, as is our entire democratic way of life. - Laura Roslin",
        actionText : "Choose any other player [excluding the Admiral]. That player rolls a die." +
        " if 3 or higher, he receives the Admiral title; otherwise, lose 1 morale. then discard this card.",
        action : game => {
            //TODO write this
        },
    },
    
    ACCEPT_PROPHECY : {
        total : 1,
        name : "Accept Prophecy",
        text : "Madam President, have you read the Scrolls of Pythia? - Porter<br>Many times, " +
        "and I humbly believe I am fullfilling the role of the Leader. - Laura Roslin",
        actionText : "Draw 1 Skill Card of any type (it may be from outside your skillset). Keep this card in play." +
        ` When a player activates 'Administration' or chooses the President with the "Admiral's Quarters" location,` +
            " increase the difficulty by 2, then discard this card.",
        action : game => {
            //TODO write this
        },
    },
    
    ASSIGN_VICE_PRESIDENT : {
        total : 1,
        name : "Assign Vice President",
        text : "If anything should happen to you, Madame President, we have no designated successor. The civilian " +
        "branch of our government would be paralyzed... - Tom Zarek",
        actionText : "Draw 2 politics cards and give this card to any other player. Keep this card in play. While this" +
        ` player is not President, other players may not be chosen with the "Administration" location.`,
        action : game => {
            //TODO write this
        },
    },
    
    ASSIGN_ARBITRATOR : {
        total : 1,
        name : "Assign Arbitrator",
        text : "I need a free hand. The authority to follow evidence wherever" +
        " it might lead, without command review. - Hadrian",
        actionText : "Draw 2 polictics cards and give this card to any other player. Keep this card in play." +
        ` When a player activates the "Admiral's Quarters" location, this player may discard this card to` +
        ' reduce or increase the difficulty by 3.',
        action : game => {
            //TODO write this
        },
    },
    
    ASSIGN_MISSION_SPECIALIST : {
        total : 1,
        name : "Assign Mission Specialist",
        text : "Reality is there's a good chance it can Jump all the way back to Caprica, retieve the Arrow, and help" +
        " us find Earth. The real Earth. - Laura Roslin",
        actionText : "Draw 2 polictics cards and give this card to any other player. Keep this card in play." +
        " The next time the fleet jumps, this player chooses the destination instead of the Admiral. He " +
        "draws 3 Destination Cards [instead of 2] and chooses 1. Then discard this card.",
        action : game => {
            //TODO write this
        },
    },
    
});

const CrisisMap = Object.freeze({
/*
	WATER_SABOTAGED : {
	    name : 'Water Sabotaged',
		text : "Every tank on the starboard side has ruptured. " +
		"We're venting all our water directly into space. - Saul Tigh",
		skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(13) PASS: no effect, FAIL: -2 food.',
            pass : game => game.activateCylons(CrisisMap.WATER_SABOTAGED.cylons),
            fail : game => {
                game.addFood(-2);
                game.activateCylons(CrisisMap.WATER_SABOTAGED.cylons);
            },
        },
		choose : {
			who : 'current',
			text : `(PO/L/T)(13) PASS: no effect, FAIL: -2 food. (-OR-) lose 1 food`,
			choice1 : game => {
                game.nextAction = next => {
                    next.nextAction = null;
                    game.doSkillCheck(CrisisMap.WATER_SABOTAGED.skillCheck);
                };
            },
			choice2 : game => {
                game.addFood(-1);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.WATER_SABOTAGED.cylons);
                };
            },
		},
		jump : true,
		cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
	},
    
    PRISONER_REVOLT : {
	    name : 'Prisoner Revolt',
        text : "Before I release my captives... I demand the immediate" +
		" resignation of Laura Roslin and her ministers. - Tom Zarek",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(11)(6) PASS: no effect, MIDDLE: -1 population, FAIL:' +
            ' -1 pop and President chooses who takes the President title.',
            pass : game => game.activateCylons(CrisisMap.PRISONER_REVOLT.cylons),
            middle : {
            	value : 6,
				action : game => {
            	    game.addPopulation(-1);
                    game.activateCylons(CrisisMap.PRISONER_REVOLT.cylons);
                },
			},
            fail : game => {
                game.addPopulation(-1);
                game.choose({
                    who : 'president',
                    text : 'Pick a player to give president role to.',
                    player : (game, player) => {
                        game.setPresident(player);
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.activateCylons(CrisisMap.PRISONER_REVOLT.cylons);
                        };
                    },
                });
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },

    RESCUE_THE_FLEET : {
	    name : 'Rescue the Fleet',
	    text : "The Cylons are waiting for us back there. How long will that take to calculate " +
        "once we get back there? - Saul Tigh, Twelve hours. - Felix Gaeta",
        choose : {
            who : 'admiral',
            text : '-2 population (-OR-) -1 morale and place basestar and 3 raiders and 3 civ ships.',
            choice1 : game => {
                game.addPopulation(-2);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.RESCUE_THE_FLEET.cylons);
                }
            },
            choice2 : game => {
                game.addMorale(-1);
                next.activateCylons(CylonActivationTypeEnum.RESCUE_THE_FLEET);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.RESCUE_THE_FLEET.cylons);
                }
            },
        },
        jump : true,
	    cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },

    WATER_SHORTAGE : {
	    name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. CrisisMap is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        choose : {
            who : 'president',
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.WATER_SHORTAGE.cylons);
                };
            },
            choice2 : game => {
                game.singlePlayerDiscards(game.getCurrentPresident(), 2);
                game.nextAction = next => {
                    next.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CrisisMap.WATER_SHORTAGE.cylons);
                    };
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    CYLON_SCREENINGS : {
	    name : 'Cylon Screenings',
        text : "We should test the people in the most sensitive positions first. - William Adama",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: no effect, FAIL: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the President or Admiral.',
            pass : game => game.activateCylons(CrisisMap.CYLON_SCREENINGS.cylons),
            fail : game => {
                game.addMorale(-1);
                game.choose({
                    who : 'current',
                    text : 'view a random loyalty card from the: President (-OR-) Admiral.',
                    choice1 : game => {
                        game.nextAction = next => {
                            game.nextAction = null;
                            game.activateCylons(CrisisMap.CYLON_SCREENINGS.cylons);
                        };
                        let current = game.getPlayers()[game.getCurrentPlayer()];
                        let president = game.getPlayers()[game.getCurrentPresident()];
                        let rand = Math.ceil(Math.random() * president.loyalty.length) -1;
                        sendNarrationToPlayer(current.userId, president.loyalty[rand].toString());
                    },
                    choice2 : game => {
                        game.nextAction = next => {
                            game.nextAction = null;
                            game.activateCylons(CrisisMap.CYLON_SCREENINGS.cylons);
                        };
                        let current = game.getPlayers()[game.getCurrentPlayer()];
                        let admiral = game.getPlayers()[game.getCurrentAdmiral()];
                        let rand = Math.ceil(Math.random() * admiral.loyalty.length) -1;
                        sendNarrationToPlayer(current.userId, president.loyalty[rand].toString());
                    },
                });
            },
        },
        choose : {
            who : 'current',
            text : '(PO/L)(9) PASS: no effect, FAIL: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the President or Admiral. (-OR-) each player discards 2 skill cards',
            choice1 : game => {
                game.nextAction = next => next.nextAction = null;
                game.doSkillCheck(CrisisMap.CYLON_SCREENINGS.skillCheck);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.CYLON_SCREENINGS.cylons);
                };
                game.eachPlayerDiscards(2);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    GUILTY_BY_COLLUSION : {
	    name : 'Guilty by Collusion',
        text : "Guess you haven't heard... Cylons don't have rights. Know what we do to Cylons, Chief? - Saul Tigh",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(9) PASS: current player may choose a character to move to the brig' +
            ', FAIL: -1 morale.',
            pass : game => game.choose({
                who : 'current',
                text : 'pick a player to send to brig',
                player : (game, player) => {
                    if (!isNaN(player))
                        if (parseInt(player) > -1 && parseInt(player) < game.getPlayers().length) {
                            game.sendPlayerToBrig(player);
                            for (let x = 0; x < game.getPlayers().length; x++)
                                sendNarrationToPlayer(game.getPlayers()[x].userId,
                                    `${game.getPlayers()[player].character.name} has been sent to the brig`);
                        }
                    game.nextAction = next => {
                        next.nextAction = null;
                        next.activateCylons(CrisisMap.GUILTY_BY_COLLUSION.cylons);
                    };
                },
            }),
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(CrisisMap.GUILTY_BY_COLLUSION.cylons);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },

    INFORMING_THE_PUBLIC : {
	    name : 'Informing the Public',
        text : "I also strongly recommend alerting the public to the Cylon threat. - Hadriam",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(7) PASS: Current player looks at 1 random Loyalty Card belonging to a player. FAIL: -2 morale.',
            pass : game => {
                game.choose({
                    who : 'current',
                    text : 'which player do you pick to look at a random loyalty card?',
                    player : (game, player) => {
                        let loyalties = game.getPlayers()[player].loyalty;
                        let index = Math.ceil(Math.random() * loyalties.length) - 1;
                        sendNarrationToPlayer(game.getPlayers()[game.getCurrentPlayer()].userId,
                            loyalties[index].toString());
                        //todo change CrisisMap when we know how loyalty works
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.activateCylons(CrisisMap.INFORMING_THE_PUBLIC.cylons);
                        }
                    }
                });
            },
            fail : game => {
                game.addMorale(-2);
                game.activateCylons(CrisisMap.INFORMING_THE_PUBLIC.cylons);
            },
        },
        choose : {
            who : 'current',
            text : '(PO/L)(7) PASS: Current player looks at 1 random Loyalty Card belonging to a player.' +
            ' FAIL: -2 morale. (-OR-) lower. -1 morale and -1 population',
            choice1 : game => {
                game.nextAction = next => next.nextAction = null;
                game.doSkillCheck(CrisisMap.INFORMING_THE_PUBLIC.skillCheck);
            },
            choice2 : game => {
                let roll = rollDie();
                if (roll <= 4) {
                    game.addPopulation(-1);
                    game.addMorale(-1);
                    sendNarrationToAll(`a ${roll} was rolled and you lost 1 population/morale.`);
                } else sendNarrationToAll(`a ${roll} was rolled so nothing happens!`);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.INFORMING_THE_PUBLIC.cylons);
                }
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    */
    HEAVY_ASSAULT : {
	    name : 'Heavy Assault',
	    text : "INSTRUCTIONS: 1) Activate: raiders. 2) Setup: 2 basestars, 1 viper, " +
        "3 civilian ships. 3) Special Rule - HEAVY BOMBARDMENT : Each basestar immediatly attacks Galactica.",
        instructions : game => {
            game.activateCylons(CrisisMap.HEAVY_ASSAULT.cylons);

            /*
            game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            game.nextAction = next => {
                next.activateCylons(CrisisMap.HEAVY_ASSAULT.cylons);
                next.nextAction = second => {
                    second.nextAction = null;
                    second.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);

                };
            };
            */
        },
        jump : false,
	    cylons : CylonActivationTypeEnum.HEAVY_ASSAULT,
    },
    /*
    THE_OLYMPIC_CARRIER : {
	    name : 'The Olympic Carrier',
	    text : "We have new orders. We're directed to... destroy the Olympic Carrier and then return" +
        " to Galactica. - Sharon Valerii" +
        " It's a civilian ship... - Kara Thrace",
        skillCheck: {
            value: 11,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text: '(PO/L/PI)(11)(8) PASS: no effect, MIDDLE: -1 population, FAIL: -1 population and morale.',
            pass: game => game.activateCylons(CrisisMap.THE_OLYMPIC_CARRIER.cylons),
            middle: {
                value: 8,
                action: game => {
                    game.addPopulation(-1);
                    game.activateCylons(CrisisMap.THE_OLYMPIC_CARRIER.cylons);
                },
            },
            fail: game => {
                game.addPopulation(-1);
                game.addMorale(-1);
                game.activateCylons(CrisisMap.THE_OLYMPIC_CARRIER.cylons);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    CYLON_ACCUSATION : {
	    name : 'Cylon Accusation',
	    text : "Laura. I have something to tell you. Commander Adama... is a Cylon. - Leoben Conoy",
        skillCheck : {
	        value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(10) PASS: no effect, FAIL: the current player is placed in the brig.',
            pass : game => game.activateCylons(CrisisMap.CYLON_ACCUSATION.cylons),
            fail : game => {
                game.sendPlayerToBrig(game.getCurrentPlayer());
                game.activateCylons(CrisisMap.CYLON_ACCUSATION.cylons);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    FOOD_SHORTAGE : {
	    name : 'Food Shortage',
	    text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediatly. - Laura Roslin',
        choose : {
            who : 'president',
            text : '-2 food (-OR-) -1 food, president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-2);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CrisisMap.FOOD_SHORTAGE.cylons);
                };
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CrisisMap.FOOD_SHORTAGE.cylons);
                    };
                    next.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                };
                game.singlePlayerDiscards(game.getCurrentPresident(), 2);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    REQUEST_RESIGNATION : {
	    name : 'Request Resignation',
	    text : "I'm going to have to ask you for your resignation, Madam President. - William Adama" +
        ", No - Laura Roslin, Then I'm terminating your presidency. - William Adama",
        choose : {
	        who : 'admiral',
            text : 'The president and admiral both discard 2 skill cards. (-OR-) The President may choose to give the ' +
            'President title to the admiral, or move to the brig.',
            choice1 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CrisisMap.REQUEST_RESIGNATION.cylons);
                    };
                    next.singlePlayerDiscards(game.getCurrentAdmiral(), 2);
                };
                game.singlePlayerDiscards(game.getCurrentPresident(), 2);
            },
            choice2 : game => {
	            game.choose({
                    who : 'president',
                    text : 'Give up president to admiral (-OR-) go to brig.',
                    choice1 : game => {
                        game.setPresident(game.getCurrentAdmiral());
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.activateCylons(CrisisMap.REQUEST_RESIGNATION.cylons);
                        };
                    },
                    choice2 : game => {
                        game.sendPlayerToBrig(game.getCurrentPresident());
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.activateCylons(CrisisMap.REQUEST_RESIGNATION.cylons);
                        };
                    },
                });
	            game.nextAction = next => next.nextAction = null;
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    ELECTIONS_LOOM : {
	    name : 'Elections Loom',
	    text : "Your're frakking right about democracy and consent of the people. I believe in those things." +
        " And we're going to have them. - Lee Adama",
        skillCheck : {
	        value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(8)(5) PASS: nothing, MIDDLE: -1 morale, FAIL: -1 morale, president discards 4 skill cards.',
            pass : game => game.activateCylons(CrisisMap.ELECTIONS_LOOM.cylons),
            middle : {
	            value : 5,
                action : game => {
	                game.addMorale(-1);
                    game.activateCylons(CrisisMap.ELECTIONS_LOOM.cylons);
                },
            },
            fail : game => {
                game.addMorale(-1);
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CrisisMap.ELECTIONS_LOOM.cylons);
                    }
                };
                game.singlePlayerDiscards(game.getCurrentPresident(), 4);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    FULFILLER_OF_PROPHECY : {
	    name : 'Fulfiller of Prophecy',
	    text : "The scrolls tell us that a dying leader will lead us to salvation. - Porter",
        skillCheck : {
	        value : 6,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(6) PASS: the current player draws 1 politics Skill Card. FAIL: -1 population.',
            pass : game => {
	            game.getPlayers()[game.getCurrentPlayer()].hand.push(game.getDecks()[SkillTypeEnum.POLITICS].deck.pop());
	            game.activateCylons(CrisisMap.FULFILLER_OF_PROPHECY.cylons);
            },
            fail : game => {
	            game.addPopulation(-1);
                game.activateCylons(CrisisMap.FULFILLER_OF_PROPHECY.cylons);
            },
        },
        choose : {
	        who : 'current',
            text : '(PO/L)(6) PASS: the current player draws 1 politics Skill Card. FAIL: -1 population.' + ` (-OR-) ` +
            'current player discards 1 skill card. After the Activate Cylon Ships step, return to the resolve ' +
            'Crisis step to draw another crisis and resolve it.',
            choice1 : game => {
                game.nextAction = next => next.nextAction = null;
                game.doSkillCheck(CrisisMap.FULFILLER_OF_PROPHECY.skillCheck);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.playCrisis(game.getDecks().Crisis.deck.pop());
                    };
                    next.activateCylons(CrisisMap.FULFILLER_OF_PROPHECY.cylons);
                };
	            game.singlePlayerDiscards(game.getCurrentPlayer(), 1);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    */
    
});

const SuperCrisisMap = Object.freeze({

    MASSIVE_ASSAULT : {
        name : 'Massive Assault',
        text : "1) Activate: heavy raiders, basestars" +
        "<br>2) Setup: 2 basestars, 1 heavy raider, 6 raiders, 2 vipers, and 4 civilian ships." +
        "<br>3) Special Rule - <i>Power Failure:</i> Move the fleet token 2 spaces towards" +
        " the start of the Jump Preparation track.",
        instructions : game => {
            //TODO write this
        },
    },
    
    INBOUND_NUKES : {
        name : 'Inbound nukes',
        text : "Spread out the fleet. No ship closer than five hundred clicks from any other ship." +
        " If there is a nuke, I want to limit the damage. - William Adama",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.LEADERSHIP ,SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(L/T)(15) PASS: no effect, FAIL: -1 fuel, -1 food, and -1 population.',
            pass : game => {
                //TODO write this
            },
            fail : game => {
                //TODO write this
            },
        },
    },
    
    CYLON_INTRUDERS : {
        name : 'Cylon Intruders',
        text : "If they succees, they'll override the decompression safeties and vent us all into space. " +
        "Once we're all dead, they'll turn the ship's guns on the fleet and wipe it out, once and for all. - Saul Tigh",
        skillCheck : {
            value : 18,
            types : [SkillTypeEnum.LEADERSHIP ,SkillTypeEnum.TACTICS],
            text : '(L/T)(18)(14) PASS: no effect, MIDDLE: Place 1 centurion marker at the start of the Boarding Party track. ' +
            'FAIL: Damage Galactica and place 2 Centurion markers at the start of the Boarding Party track.',
            pass : game => {
                //TODO write this
            },
            middle : {
                value : 14,
                action : game => {
                    //TODO write this
                }
            },
            fail : game => {
                //TODO write this
            },
        },
    },
    
    FLEET_MOBILIZATION : {
        name : 'Fleet Mobilization',
        text : "You know the drill, people. Scatter formation. keep'em off the civies and Don't stray" +
        " beyond the recovery line. - Lee Adama",
        skillCheck : {
            value : 24,
            types : [SkillTypeEnum.LEADERSHIP ,SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(L/T/PI/E)(24) PASS: Activate: basestars, base + 3 raiders, ' +
            'FAIL: -1 morale and Activate: basestars, raiders, heavy raiders, base + 3 raiders',
            pass : game => {
                //TODO write this
            },
            fail : game => {
                //TODO write this
            },
        },
    },
    
    BOMB_ON_COLONIAL_1 : {
        name : 'Bomb on Colonial 1',
        text : "We're running out of time. There's four minutes until your bomb goes off. I'm here" +
        " to tell you that this conflict between our people... it doesn't have to continue. - Laura Roslin",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(15) PASS: no effect, FAIL: -2 morale and all characters on Colonial One are sent ' +
            'to "Sickbay." Keep this card in play. Characters may not move to Colonial One for the rest of the game.',
            pass : game => {
                //TODO write this
            },
            fail : game => {
                //TODO write this
            },
        },
    },

});

const LoyaltyMap = Object.freeze({
    
    YOU_ARE_NOT_A_CYLON : {
        total : 10,
        text : "Our test indicate that you are not a Cylon, although you can never really know for sure...",
        role : 'human',
    },
    
    YOU_ARE_A_SYMPATHIZER : {
        total : 1,
        text : 'IMMEDIATELY REVEAL THIS CARD If at least 1 resource is half full or lower [red], ' +
        'you are moved to the brig. Otherwise, you become a revealed Cylon player. You do not receive a ' +
        'Super Crisis Card and may not activate the "Cylon Fleet" location.',
        action : game => {},//idk if this needs an action or just handle it in game its single case
        role : 'sympathizer',
    },
    
    YOU_ARE_A_CYLON_AARON : {
        total : 1,
        text : "CAN DAMAGE GALACTICA Action: Reveal this card. If you are not in the Brig," +
        " you may draw up to 5 Galactica damage tokens. Choose 2 of them to resolve and discard the others.",
        action : game => {
            //TODO write this
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_CYLON_BOOMER : {
        total : 1,
        text : "CAN SEND A CHARACTER TO SICKBAY Action: Reveal this card. If you are not in the Brig, " +
        'you may choose a character on Galactica. That character must discard 5 skill Cards and is moved to "Sickbay."',
        action : game => {
            //TODO write this
        },
        role : 'cylon',
    },

    YOU_ARE_A_CYLON_SIX : {
        total : 1,
        text : "CAN SEND A CHARACTER TO THE BRIG Action: Reveal this card. If you are not in the Brig," +
		" you may choose a character on Galactica. Move that character to the 'BRIG'",
        action : game => {
            //TODO write this
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_CYLON_LEOBEN : {
        total : 1,
        text : "CAN REDUCE MORALE BY ONE Action: Reveal this card. If you are not in the Brig, " +
        'you may reduce moral by 1."',
        action : game => {
            //TODO write this
        },
        role : 'cylon',
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

const CivilianShipTypeEnum = Object.freeze({
    ONE_POPULATION:"One Population",
    TWO_POPULATION:"Two Population",
    POPULATION_FUEL:"Population Fuel",
    POPULATION_MORALE:"Population Morale",
    NOTHING:"Nothing",
});

const ActivationTimeEnum = Object.freeze({
    ACTION:"Action",
	BEFORE_SKILL_CHECK:"Before Skill Check",
    STRENGTH_TOTALED:"Strength Totaled",
	VIPER_ATTACKED:"Viper Attacked",
	BEFORE_DIE_ROLL:"Before Die Roll",
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
	GALACTICA_DAMAGE:"GalacticaDamage",
	BASESTAR_DAMAGE:"BasestarDamage",
	CIV_SHIP:"CivShip",
});

const LocationMap = Object.freeze({
    //Colonial One
    PRESS_ROOM : {
        name : "Press Room",
        area : "colonial",
        enum : LocationEnum.PRESS_ROOM,
        text : 'Action: Draw 2 politics Skill Cards.',
        action : game => {
            //TODO write this
        },
    },
    
    PRESIDENTS_OFFICE : {
        name : "President's Office",
        area : "colonial",
        enum : LocationEnum.PRESIDENTS_OFFICE,
        text : "Action: If you are President, draw 1 Quorum Card. " +
        "You may then draw 1 additional Quorum Card or play 1 from your hand.",
        action : game => {
            //TODO write this
        },
    },
    
    ADMINISTRATION : {
        name : "Administration",
        area : "colonial",
        enum : LocationEnum.ADMINISTRATION,
        text : "Administration Action: Choose a character, then pass this skill check" +
        " to give them President title. (PO/L)(5)",
        action : game => {
            game.choose({
                who : 'current',
                text : 'choose a player to try and give President to.',
                player : (next, player) => {
                    next.nextAction = second => second.nextAction = null;
                    next.nextActive();
                    next.doSkillCheck({
                        value : 5,
                        types : [],
                        text : `(PO/L)(5) PASS: ${next.getPlayers()[player].character.name
                        } becomes president, FAIL: nothing happens.`,
                        pass : second => {
                            second.setPresident(player);
                            second.playCrisis(second.drawCard(second.getDecks(DeckTypeEnum.CRISIS)));
                        },
                        fail : second => second.playCrisis(second.drawCard(second.getDecks(DeckTypeEnum.CRISIS))),
                    });
                },
            });
        },
    },
    
    //Cylon Locations
    CAPRICA : {
        name : "Caprica",
        area : "cylon",
        enum : LocationEnum.CAPRICA,
        text : 'Action: Play your super Crisis Card or draw 2 Crisis Cards, choose 1 to resolve and sidcard the other.' +
        '<br><b>No Activate Cylon Ships or Prepare for Jump steps.</b>',
        action : game => {
            //TODO write this
        },
    },
    
    CYLON_FLEET : {
        name : "Cylon Fleet",
        area : "cylon",
        enum : LocationEnum.CYLON_FLEET,
        text : "Action: Activate all Cylon ship[s of one type, or launch 2 raiders and" +
        " 1 heavy raider from each basestar.",
        action : game => {
            //TODO write this
        },
    },
    
    HUMAN_FLEET : {
        name : "Human Fleet",
        area : "cylon",
        enum : LocationEnum.HUMAN_FLEET,
        text : "Action: Look at any player's hand and steal 1 skill Card " +
        "[place it in your hand]. Then roll a die and if 5 or higher damage Galactica.",
        action : game => {
            //TODO write this
        },
    },
    
    RESURRECTION_SHIP : {
        name : "Resurrection Ship",
        area : "cylon",
        enum : LocationEnum.RESURRECTION_SHIP,
        text : "Action: You may discard your Super Crisis Card to draw a new one. Then if distance" +//is this right?
        " is 7 or less, give your unrevealed loyalty card(s) to any player.",
        action : game => {
            //TODO write this
        },
    },
    
    //Galactica
    FTL_CONTROL : {
        name : "FTL Control",
        area : "galactica",
        enum : LocationEnum.FTL_CONTROL,
        text : "Action: Jump the fleet if the Jump Preparation track is not in the red zone. *Might lose population.",
        action : game => {
            //TODO write this
        },
    },
    
    WEAPONS_CONTROL : {
        name : "Weapons Control",
        area : "galactica",
        enum : LocationEnum.WEAPONS_CONTROL,
        text : "Action: Attack 1 Cylon ship with Galactica.",
        action : game => {
            //TODO write this
        },
    },
    
    COMMUNICATIONS : {
        name : "Communications",
        area : "galactica",
        enum : LocationEnum.COMMUNICATIONS,
        text : "Action: Look at the back of 2 civilian ships. You may then move them to adjacent area(s)",
        action : game => {
            //TODO write this
        },
    },
    
    RESEARCH_LAB : {
        name : "Research Lab",
        area : "galactica",
        enum : LocationEnum.RESEARCH_LAB,
        text : "Action: Draw 1 engineering or 1 tactics Skill Card.",
        action : game => {
            //TODO write this
        },
    },
    
    COMMAND : {
        name : "Command",
        area : "galactica",
        enum : LocationEnum.COMMAND,
        text : "Action: Activate up to 2 unmanned vipers.",
        action : game => {
            //TODO write this
        },
    },
    
    ADMIRALS_QUARTERS : {
        name : "Admiral's Quarters",
        area : "galactica",
        enum : LocationEnum.ADMIRALS_QUARTERS,
        text : "Choose a character, then pass this skill check to send him to the Brig. (L/T)(7)",
        action : game => {
            //TODO write this
        },
        
        /*
        { skillckeck example
            value : 5,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : `(L/T)(7) PASS: **player** gets sent to brig, FAIL: nothing happens.`,
            pass : game => {TODO write this},
            fail : game => second.playCrisis(second.drawCard(second.getDecks(DeckTypeEnum.CRISIS))),
        }
        */
    },
    
    HANGAR_DECK : {
        name : "Hangar Deck",
        area : "galactica",
        enum : LocationEnum.HANGAR_DECK,
        text : "Action: Launch yourself in a viper. You may then take 1 more action.",
        action : game => {
            //TODO write this
        },
    },
    
    ARMORY : {
        name : "Armory",
        area : "galactica",
        enum : LocationEnum.ARMORY,
        text : "Action: Attack a centurion on the Boarding Party track [destroy on roll of 7-8].",
        action : game => {
            //TODO write this
        },
    },
    
    SICKBAY : {
        name : "Sickbay",
        area : "galactica",
        enum : LocationEnum.SICKBAY,
        text : "You may only draw 1 Skill Card during your Receive Skills step.",
    },
    
    BRIG : {
        name : "Brig",
        area : "galactica",
        enum : LocationEnum.BRIG,
        text : "You may not move, draw Crisis Cards, or add more than 1 card to skill checks.<br>" +
        "Action: Pass this skill check to move to any location. (PO/T)(7)",
        action : game => {
            //TODO write this
            //TODO write skillcheck
        },
    },
    
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
    let discardAmount = 0;
    let activeCrisis = null;
    let revealSkillChecks = true;//set to true for testing
    this.nextAction = game => {};
    this.nextAction = null;
    let nextAction = aGame => this.nextAction(aGame);
    let hasAction = () => this.nextAction != null;
    
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
	let shipNumberToPlace=[];
    let shipPlacementLocations=[];

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
        GalacticaDamage:{ deck:[], },
        BasestarDamage:{ deck:[], },
        CivShip:{ deck:[], },
	};
	
	let centurionTrack=[0,0,0,0];
	let jumpTrack=-1;
	let damagedLocations=[];
	let nukesRemaining=-1;
	let currentPresident=0;//change back
	let currentAdmiral=1;//change back
	let currentArbitrator=-1;
	let currentMissionSpecialist=-1;
	let currentVicePresident=-1;
	let quorumHand=[];
	let skillCheckCards=[];
	
	for(let key in users){
		players.push(new Player(users[key]));
	}
    
    this.doSkillCheck = skillJson => {
        phase = GamePhaseEnum.SKILL_CHECK;
        skillCheckTypes = skillJson.types;
        skillPass = skillJson.pass;
        skillFail = skillJson.fail;
        if (skillJson.middle != null) {
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
        if (choice.player != null) {
            choice1 = choice.player;
            choice2 = null;
        } else if (choice.other != null) {
            choice1 = null;
            choice2 = choice.other;
        } else {
            choice1 = choice.choice1;
            choice2 = choice.choice2;
        }
        choiceText = choice.text;
        activePlayer = choice.who;
        sendNarrationToPlayer(players[choice.who].userId, choice.text);
    };
    
    let playCrisis = card => {
        console.dir(card);
        sendNarrationToAll(`${players[currentPlayer].character.name} plays a ${card.name} crisis card: `);
        sendNarrationToAll(card.text);
        activeCrisis = card;
        decks.Crisis.discard.push(card);
        if (card.choose != null)
            this.choose(card.choose);
        else if (card.skillCheck != null)
            this.doSkillCheck(card.skillCheck);
        else card.instructions(this);
    };

	//Getter and setter land
    this.getPlayers = () => players;
	this.getCurrentPlayer = () => currentPlayer;
    this.getCurrentPresident = () => currentPresident;
    this.getCurrentAdmiral = () => currentAdmiral;
    this.getDecks = () => decks;
    this.setLocation = (player, location) => players[player].location = location;
    this.getLocation = player => players[player].location;
    this.playCrisis = playCrisis;
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
			if(GalacticaDamageTypeEnum[type]===GalacticaDamageTypeEnum.FOOD||GalacticaDamageTypeEnum[type]===
                GalacticaDamageTypeEnum.FUEL){
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

        //Create Destiny Deck
        buildDestiny();

        //Create Quorum Deck
        for(let type in QuorumMap){
            decks[DeckTypeEnum.QUORUM].deck.push(QuorumMap[type]);
        }
        for(let i=0;i<3;i++){
            decks[DeckTypeEnum.QUORUM].deck.push(QuorumMap.INSPIRATIONAL_SPEECH);
        }
        decks[DeckTypeEnum.QUORUM].deck.push(QuorumMap.FOOD_RATIONING);
        decks[DeckTypeEnum.QUORUM].deck.push(QuorumMap.ARREST_ORDER);
        shuffle(decks[DeckTypeEnum.QUORUM].deck);

        //Create galactica damage deck
        for(let type in GalacticaDamageTypeEnum){
            decks[DeckTypeEnum.GALACTICA_DAMAGE].deck.push(GalacticaDamageTypeEnum[type]);
        }
        shuffle(decks[DeckTypeEnum.GALACTICA_DAMAGE].deck);

        //Create basestar damage deck
		for(let type in BasestarDamageTypeEnum){
        	decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(BasestarDamageTypeEnum[type]);
		}
		shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);

        //Create civilian ship deck
		for(let i=0;i<6;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.ONE_POPULATION);
        }
        for(let i=0;i<2;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.ONE_POPULATION);
        }
        for(let i=0;i<2;i++){
            decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.NOTHING);
        }
        decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.POPULATION_FUEL);
        decks[DeckTypeEnum.CIV_SHIP].deck.push(CivilianShipTypeEnum.POPULATION_MORALE);
        shuffle(decks[DeckTypeEnum.CIV_SHIP].deck);

		//Create crisis deck
        for(let type in CrisisMap){
            decks[DeckTypeEnum.CRISIS].deck.push(CrisisMap[type]);
        }
        shuffle(decks[DeckTypeEnum.CRISIS].deck);

		//Place starting ships
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.BASESTAR));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
        spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
        spaceAreas[SpaceEnum.SE].push(new Ship(ShipTypeEnum.VIPER));
        vipersInHangar-=2;
        for(let i=0;i<2;i++){
        	let ship=new Ship(ShipTypeEnum.CIVILIAN);
            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
            spaceAreas[SpaceEnum.E].push(ship);
        }
        for(let type in ShipTypeEnum){
        	shipPlacementLocations[ShipTypeEnum[type]]=[];
		}

        for(let key in CharacterMap){
            availableCharacters.push(key);
        }

		quorumHand.push(drawCard(decks[DeckTypeEnum.QUORUM]));
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
            sendNarrationToAll("Player "+activePlayer+" picked "+CharacterMap[character].name);

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
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
                }
                for(let i=0;i<skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount;i++){
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
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
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
                }
                for (let i = 0; i < skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount; i++) {
                    players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
                }
                phase=GamePhaseEnum.MAIN_TURN;
                sendNarrationToAll(players[activePlayer].character.name + " picks " + amount + " Leadership and " +
                    (skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount) + " Engineering");
            }
        }
    };

    let pickResearchCard=function(text){
		if(text==='0'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.ENGINEERING+
                " skill card");
            players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.TACTICS+" skill card");
            players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.TACTICS]));
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
        if(text==='0'||text==='1'){
            if(vipersInHangar===0){
                sendNarrationToPlayer(players[activePlayer].userId, 'No vipers left in reserve');
                return;
            }
            vipersInHangar--;
            vipersToActivate--;
            if(text==="0"){
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SW");
                spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
            }else{
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SE");
                spaceAreas[SpaceEnum.SE].push(new Ship(ShipTypeEnum.VIPER));
            }
            if(vipersToActivate>0){
                sendNarrationToPlayer(players[activePlayer].userId, vipersToActivate+
                    ' viper(s) left to activate. Select a location to activate a viper');
                phase=GamePhaseEnum.CHOOSE_VIPER;
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, "Done activating vipers");
                phase=GamePhaseEnum.MAIN_TURN;
            }
            return;
        }

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
                    if(spaceAreas[currentViperLocation][i].type===
                        ShipTypeEnum.VIPER&&spaceAreas[currentViperLocation][i].pilot===-1){
                    	console.log("viper found in area");
                        let v = spaceAreas[currentViperLocation][i];
                        spaceAreas[currentViperLocation].splice(i,1);
                        spaceAreas[SpaceEnum[text]].push(v);
                        sendNarrationToAll(players[activePlayer].character.name + " moves an unmanned viper from "
                            +currentViperLocation
                            +" to "+SpaceEnum[text]);
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
            sendNarrationToPlayer(players[activePlayer].userId, vipersToActivate+
                ' viper(s) left to activate. Select a location to activate a viper');
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
            if((isAttackerGalactica&&roll>=GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL)
                ||roll>=VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL){
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

        let damageType=drawCard(decks[DeckTypeEnum.BASESTAR_DAMAGE]);
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
    this.nextActive = nextActive;
	
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
                players[player].hand.push(drawCard(decks[DeckTypeEnum[type]]));
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
    	if(deck.deck.length===0){
    		if(deck.discard==null||deck.discard.length===0){
    			return null;
			}
    		console.log("reshuffling "+deck.deck);
    		while(deck.discard.length>0){
    			deck.deck.push(deck.discard.pop());
			}
			shuffle(deck.deck);
		}
		return deck.deck.pop();
	};
    this.drawCard = drawCard;

    let buildDestiny =  function(){
        let deck=decks[DeckTypeEnum.DESTINY].deck;
        deck.push(drawCard(decks[DeckTypeEnum.POLITICS]));
        deck.push(drawCard(decks[DeckTypeEnum.POLITICS]));
        deck.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
        deck.push(drawCard(decks[DeckTypeEnum.LEADERSHIP]));
        deck.push(drawCard(decks[DeckTypeEnum.TACTICS]));
        deck.push(drawCard(decks[DeckTypeEnum.TACTICS]));
        deck.push(drawCard(decks[DeckTypeEnum.PILOTING]));
        deck.push(drawCard(decks[DeckTypeEnum.PILOTING]));
        deck.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
        deck.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
        shuffle(deck);
	};

    let drawDestiny = function(){
    	let deck=decks[DeckTypeEnum.DESTINY].deck;
        if(deck.length===0){
			buildDestiny();
        }
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
    	return location === LocationEnum.PRESS_ROOM || location === LocationEnum.PRESIDENTS_OFFICE ||
            location === LocationEnum.ADMINISTRATION;
	};

	let addToActionPoints=function(num){
		activeActionsRemaining+=num;

        if(activePlayer===currentPlayer){
			currentActionsRemaining+=num;
		}
	};

	let doCrisisStep=function(){
		console.log("starting crisis step");
		let crisisCard=drawCard(decks[DeckTypeEnum.CRISIS]);
		console.log(crisisCard);
		//activateCylonShips(crisisCard.cylons);
		playCrisis(crisisCard);
        /*
        if(crisisCard.jump){
        	increaseJumpTrack();
		}
		*/
        decks[DeckTypeEnum.CRISIS].discard.push(crisisCard);
    };

	let increaseJumpTrack = function(){
		jumpTrack++;
        sendNarrationToAll("Jump preparation increases");
        if(jumpTrack===JUMP_PREP_AUTOJUMP_LOCATION){
			jumpGalactica();
		}
	};

	let jumpGalactica = function(){
		sendNarrationToAll("Galactica jumps to a new location!");

	};

	let destroyCivilianShip = function(loc,num){
        sendNarrationToAll("Civilian ship destoyed!");
        let ship=spaceAreas[loc][num];
        switch(ship.resource){
			case CivilianShipTypeEnum.ONE_POPULATION:
                sendNarrationToAll("One population lost!");
                populationAmount--;
                break;
            case CivilianShipTypeEnum.TWO_POPULATION:
                sendNarrationToAll("Two population lost!");
                populationAmount-=2;
                break;
            case CivilianShipTypeEnum.POPULATION_FUEL:
                sendNarrationToAll("Population and fuel lost!");
                populationAmount--;
                fuelAmount--;
                break;
            case CivilianShipTypeEnum.POPULATION_MORALE:
                sendNarrationToAll("Population and morale lost!");
                populationAmount--;
                moraleAmount--;
                break;
            case CivilianShipTypeEnum.NOTHING:
                sendNarrationToAll("Luckily not much was in the ship");
                break;
			default:
				break;
		}
		spaceAreas[loc].splice(num,1);
	};

	let activateRaider=function(loc,num){ //Returns true if raider moved
		if(spaceAreas[loc][num].activated){
			return false;
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
                    return false;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged");
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return false;
                } else {
                    sendNarrationToAll("The raider misses!");
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot !== -1) {
                sendNarrationToAll("Cylon raider attacks viper piloted by "
                    +players[spaceAreas[loc][i].pilot].character.name+"!");
                let roll = rollDie();
                sendNarrationToAll("Cylon raider rolls a " + roll);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!");
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!");
                    spaceAreas[loc].splice(i,1);
                    return false;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged");
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!");
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return false;
                } else {
                    sendNarrationToAll("The raider misses!");
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.CIVILIAN) {
                sendNarrationToAll("Cylon raider attacks a civilian ship!");
				destroyCivilianShip(loc,i);
				return false;
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

		for(let i=0;i<closestPath.length;i++){
			for(let j=0;j<spaceAreas[closestPath[i]].length;j++){
				if(spaceAreas[closestPath[i]][j].type===ShipTypeEnum.CIVILIAN){
					let newLocation=-1;
					if(j%2===0){ //Clockwise
						switch(loc){
                            case SpaceEnum.NE:
                                newLocation=SpaceEnum.E;
                                break;
                            case SpaceEnum.E:
                                newLocation=SpaceEnum.SE;
                                break;
                            case SpaceEnum.SE:
                                newLocation=SpaceEnum.SW;
                                break;
                            case SpaceEnum.SW:
                                newLocation=SpaceEnum.W;
                                break;
                            case SpaceEnum.W:
                                newLocation=SpaceEnum.NW;
                                break;
                            case SpaceEnum.NW:
                                newLocation=SpaceEnum.NE;
                                break;
                            default:
                                break;
						}
					}else{ //Counterclockwise
                        switch(loc){
                            case SpaceEnum.NE:
                                newLocation=SpaceEnum.NW;
                                break;
                            case SpaceEnum.E:
                                newLocation=SpaceEnum.NE;
                                break;
                            case SpaceEnum.SE:
                                newLocation=SpaceEnum.E;
                                break;
                            case SpaceEnum.SW:
                                newLocation=SpaceEnum.SE;
                                break;
                            case SpaceEnum.W:
                                newLocation=SpaceEnum.SW;
                                break;
                            case SpaceEnum.NW:
                                newLocation=SpaceEnum.W;
                                break;
                            default:
                                break;
                        }
					}

                    sendNarrationToAll("Cylon raider advances towards the civilian ships");
                    let v = spaceAreas[loc][num];
                    spaceAreas[loc].splice(num,1);
                    spaceAreas[newLocation].push(v);
                    return true;
                }
			}
		}

        sendNarrationToAll("Cylon raider attacks galactica!");
        let roll = rollDie();
        sendNarrationToAll("Cylon raider rolls a " + roll);
        if (roll >= RAIDER_DAMAGES_GALACTICA_MINIMUM_ROLL) {
            sendNarrationToAll("Galactica is hit!");
            damageGalactica();
        } else {
            sendNarrationToAll("The raider misses!");
        }

        return false;
    };

	this.activateRaiders = function(){
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
                        let raidersToLaunch=RAIDERS_LAUNCHED_DURING_ACTIVATION;
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
                        if(activateRaider(SpaceEnum[s],i)){
                            i--;
                        }
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

    };

	this.launchRaiders = function(){
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
                    let raidersToLaunch=RAIDERS_LAUNCHED;
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
	};

	this.activateHeavyRaiders = function(){
        sendNarrationToAll("Cylons activate heavy raiders!");
        if(centurionTrack[centurionTrack.length-1]>0){
            sendNarrationToAll("Centurions kill the crew of Galactica!");
            gameOver();
            return;
        }
        for(let i=centurionTrack.length-2;i>=0;i--){
            if(centurionTrack[i]>0){
                sendNarrationToAll("Centurions advance!");
                centurionTrack[i+1]=centurionTrack[i];
            }
        }
        centurionTrack[0]=0;

        let totalRaiders=0;
        let heavyRaidersFound=false;
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.HEAVY_RAIDER){
                    totalRaiders++;
                    heavyRaidersFound=true;
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
                        totalRaiders--;
                    }else{
                        let heavyRaider = spaceAreas[SpaceEnum[s]][i];
                        spaceAreas[SpaceEnum[s]].splice(i,1);
                        spaceAreas[newLocation].push(heavyRaider);
                    }
                }
            }
        }

        if(!totalRaiders){
            for(let s in SpaceEnum){
                for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                    if(totalRaiders>=MAX_HEAVY_RAIDERS){
                        return;
                    }
                    if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                        sendNarrationToAll("Cylon basestar launches heavy raiders!");
                        spaceAreas[SpaceEnum[s]].push(new Ship(ShipTypeEnum.HEAVY_RAIDER));
                        totalRaiders++;
                    }
                }
            }
        }
	};

	this.activateBasestars = function(){
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                if(spaceAreas[SpaceEnum[s]][i].type===ShipTypeEnum.BASESTAR){
                    if(spaceAreas[SpaceEnum[s]][i].damage[0]==BasestarDamageTypeEnum.WEAPONS||
                        spaceAreas[SpaceEnum[s]][i].damage[1]==BasestarDamageTypeEnum.WEAPONS){
                        sendNarrationToAll("Basestar can't attack Galactica because of weapons damage");
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
	};

	let countShips = function(){
		let shipCount=[];
		for(let type in ShipTypeEnum){
			shipCount[ShipTypeEnum[type]]=0;
			for(let area in SpaceEnum){
				let ships=spaceAreas[SpaceEnum[area]];
				for(let i=0;i<ships.length;i++){
					if(ships[i].type===ShipTypeEnum[type]){
                        shipCount[ShipTypeEnum[type]]++;
					}
				}
			}
		}
		console.log(shipCount);
		return shipCount;
	};

	let placeShips = function(text){
        if(SpaceEnum[text]==null){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }

        for(let type in ShipTypeEnum){
            if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
            	for(let i=0;i<shipPlacementLocations[ShipTypeEnum[type]].length;i++){
            		if(shipPlacementLocations[ShipTypeEnum[type]][i]===SpaceEnum[text]){
            			let location=shipPlacementLocations[ShipTypeEnum[type]][i];
                        if(ShipTypeEnum[type]===ShipTypeEnum.CIVILIAN){
                            let ship=new Ship(ShipTypeEnum.CIVILIAN);
                            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                            spaceAreas[location].push(ship);
                        }else{
                            spaceAreas[location].push(new Ship(ShipTypeEnum[type]));
                        }
                        if(ShipTypeEnum[type]===ShipTypeEnum.VIPER){
                            vipersInHangar--;
                        }

                        shipPlacementLocations[ShipTypeEnum[type]].splice(i,1);
                        shipNumberToPlace[ShipTypeEnum[type]]--;
                        for(let type in ShipTypeEnum){
                            if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
                                sendNarrationToPlayer(players[activePlayer].userId,
									'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+"(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                                return;
                            }
                        }

                        sendNarrationToPlayer(players[activePlayer].userId, "Done placing ships");
						phase=GamePhaseEnum.MAIN_TURN;
                        if (hasAction())
                            nextAction(this);
                        else nextTurn();
                        return;
					}
				}
            }
        }

        sendNarrationToPlayer(players[activePlayer].userId, "Can't place there");
		return;
	};

	let activateCylonShips = function(type){
		//Cylon activation step
		if(type===CylonActivationTypeEnum.ACTIVATE_RAIDERS){
            this.activateRaiders();
        }else if(type===CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS){
            this.activateHeavyRaiders()
		}else if(type===CylonActivationTypeEnum.ACTIVATE_BASESTARS){
            this.activateBasestars();
        }else if(type===CylonActivationTypeEnum.LAUNCH_RAIDERS){
            this.launchRaiders();
        }else if(type===CylonActivationTypeEnum.NONE){

        }

        //Cylon attack cards
        else if(type===CylonActivationTypeEnum.HEAVY_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.W);
            console.log(shipPlacementLocations);

            let shipCount=countShips();
            shipNumberToPlace[ShipTypeEnum.BASESTAR]=Math.min(2,MAX_BASESTARS-shipCount[ShipTypeEnum.BASESTAR]);
            shipNumberToPlace[ShipTypeEnum.VIPER]=Math.min(1,vipersInHangar);
            shipNumberToPlace[ShipTypeEnum.CIVILIAN]=Math.min(3,MAX_BASESTARS-decks[DeckTypeEnum.CIV_SHIP].deck.length);
            console.log(shipNumberToPlace);

            let needToPlaceManually=false;
            for(let type in ShipTypeEnum){
            	if(shipPlacementLocations[ShipTypeEnum[type]]!=null&&shipPlacementLocations[ShipTypeEnum[type]].length===shipNumberToPlace[type]){
					for(let location in shipPlacementLocations[ShipTypeEnum[type]]){
                        if(ShipTypeEnum[type]===ShipTypeEnum.CIVILIAN){
                            let ship=new Ship(ShipTypeEnum.CIVILIAN);
                            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                            spaceAreas[SpaceEnum.SW].push(ship);
						}else{
                            spaceAreas[location].push(new Ship(ShipTypeEnum[type]));
                        }
                        if(ShipTypeEnum[type]===ShipTypeEnum.VIPER){
                            vipersInHangar--;
                        }
					}
                    shipNumberToPlace[type]=0;
                    shipPlacementLocations[type]=[];
				}else{
                    needToPlaceManually=true;
                }
			}

			if(needToPlaceManually){
            	for(let type in ShipTypeEnum){
            		if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
                        sendNarrationToPlayer(players[activePlayer].userId,
							'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+"(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                        phase = GamePhaseEnum.PLACE_SHIPS;
                        return;
                    }
				}
			}
        }

        //Other
        else if(type===CylonActivationTypeEnum.RESCUE_THE_FLEET){
        	/*
            spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.BASESTAR));
            spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
            spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
            spaceAreas[SpaceEnum.W].push(new Ship(ShipTypeEnum.RAIDER));
            for(let i=0;i<3;i++){
                let ship=new Ship(ShipTypeEnum.CIVILIAN);
                ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                if(ship.resource!=null){
                	spaceAreas[SpaceEnum.E].push(ship);
                }
            }
            */
        }

        //if any instructions on what to do next exist, do them, else go to next turn
        if (hasAction())
            nextAction(this);
        else nextTurn();
        
        
        return;
	};
    this.activateCylons = activateCylonShips;
    
	let damageGalactica=function(){
        let damageType=drawCard(decks[DeckTypeEnum.GALACTICA_DAMAGE]);
        sendNarrationToAll("Basestar damages "+damageType+"!");
        if(damageType===GalacticaDamageTypeEnum.FOOD){
			foodAmount--;
            //this.addFood(-1);
		}else if(damageType===GalacticaDamageTypeEnum.FUEL){
            fuelAmount--;
            //this.addFuel(-1);
		}else{
			damagedLocations[damageType]=true;
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
                if(players[i].location===damageType&&players[i].viperLocation===-1){
                    players[i].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[i].character.name+" is sent to Sickbay!");
                }
            }
		}

		console.log(damagedLocations);

		return;
	};

	this.sendPlayerToBrig = function(playerNumber){
        if(players[playerNumber].viperLocation!==-1){
            for(let i=0;i<spaceAreas[players[playerNumber].viperLocation].length;i++){
                if(spaceAreas[players[playerNumber].viperLocation][i].pilot===playerNumber){
                    spaceAreas[players[playerNumber].viperLocation].splice(i,1);
                    players[playerNumber].viperLocation=-1;
                    vipersInHangar++;
                    break;
                }
            }
        }
        sendNarrationToAll(players[playerNumber].character.name + " is sent to the Brig");
        game.sendPlayerToBrig(playerNumber);
	};

	let drawOrPlayQuorumCard = function(text){
		if(text.toUpperCase()==='DRAW'){
            quorumHand.push(drawCard(decks[DeckTypeEnum.QUORUM]));
            sendNarrationToAll(players[activePlayer].character.name + " draws another quorum card");
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text.toUpperCase()==='PLAY'){
			playQuorumCard(quorumHand.length-1);
            phase=GamePhaseEnum.MAIN_TURN;
        }
	};

	let playQuorumCard = function(num){

	};

	let playSkillCardAction = function(card){
		switch(card.name){
			case "Repair": //Action
				if(players[activePlayer].location===LocationEnum.HANGAR_DECK){
                    if(!damagedLocations[players[activePlayer].location]&&damagedVipers==0){
                        sendNarrationToPlayer(players[activePlayer].userId, 'Nothing to repair');
                        return false;
                    }
                    sendNarrationToPlayer(players[activePlayer].userId, 'Choose 0 for hangar deck or 1 for vipers');
                    phase=GamePhaseEnum.REPAIR_VIPERS_OR_HANGAR_DECK;
                    return false;
				}else{
                    if(damagedLocations[players[activePlayer].location]){
                        sendNarrationToAll(players[activePlayer].character.name + " repairs the "
                            +LocationEnum[players[activePlayer].location]);
                        damagedLocations[players[activePlayer].location]=false;
                        return true;
                    }else{
                        sendNarrationToPlayer(players[activePlayer].userId, 'Current location isn\'t damaged');
                        return false;
                    }
                }
				break;
            case "Research":
                break;
            case "XO": //Action
                break;
            case "Emergency":
                break;
            case "Evasive":
                break;
            case "Firepower": //Action
                break;
            case "Consolidate": //Action
                break;
            case "Committee":
                break;
            case "Scout": //Action
                break;
            case "Planning":
                break;
			default:
				return false;
		}
	};

	let repairVipersOrHangarDeck = function(text){
        if(text==='0'){
            if(damagedLocations[LocationEnum.HANGAR_DECK]){
                sendNarrationToAll(players[activePlayer].character.name + " repairs the "+LocationEnum.HANGAR_DECK);
                damagedLocations[LocationEnum.HANGAR_DECK]=false;
                return true;
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Nothing to repair');
                return false;
            }
        }else if(text==='1'){
            if(damagedVipers>1){
                damagedVipers-=2;
                vipersInHangar+=2;
                sendNarrationToAll(players[activePlayer].character.name + " repairs two damaged vipers");
                return
            }else if(damagedVipers>0){
                damagedVipers--;
                vipersInHangar++;
                sendNarrationToAll(players[activePlayer].character.name + " repairs a damaged viper");
                return;
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, 'No damaged vipers to repair');
                return;
            }
		}else{
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid number. Choose 0 or 1');
            return;
		}
	};

	let doMainTurn = function(text){
		if(text.substr(0,4).toUpperCase()==="HAND" && text.length>5){
            let num=parseInt(text.substr(5,1));
            if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid hand card');
                return;
            }

            let card=players[activePlayer].hand[num];
            if(playSkillCardAction(card)){
                addToActionPoints(-1);
			}
            return;
		}if(text.toUpperCase()==="ACTIVATE"){
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

				if(players[activePlayer].isRevealedCylon && LocationEnum[l]!==LocationEnum.CAPRICA&&LocationEnum[l]!==
                    LocationEnum.CYLON_FLEET&&
                    LocationEnum[l]!==LocationEnum.HUMAN_FLEET&&LocationEnum[l]!==LocationEnum.RESURRECTION_SHIP) {
					sendNarrationToPlayer(players[activePlayer].userId, "You can't move there as a revealed cylon!");
					return;
				}else if(!players[activePlayer].isRevealedCylon && (LocationEnum[l]===
                    LocationEnum.CAPRICA||LocationEnum[l]===LocationEnum.CYLON_FLEET||
                    LocationEnum[l]===LocationEnum.HUMAN_FLEET||LocationEnum[l]===LocationEnum.RESURRECTION_SHIP)) {
					sendNarrationToPlayer(players[activePlayer].userId,
                        "You can't move there unless you're a revealed cylon!");
					return;
				}

				if(!players[activePlayer].isRevealedCylon){
					if(players[activePlayer].viperLocation!==-1||isLocationOnColonialOne(players[activePlayer].location)
                        !==isLocationOnColonialOne(LocationEnum[l])){
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
                        sendNarrationToAll(players[activePlayer].character.name +
                            " moves in viper from "+players[activePlayer].viperLocation+" to "+SpaceEnum[text]);
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
        } else if (choice1 === null) {
            choice1(this, text);
        } else {
            if (text === '1') choice1(this);
            else if (text === '2') choice2(this);
        }
        this.nextAction(this);
    };
	
	let singlePlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    discardSkill(activePlayer, x);
            this.nextAction(this);
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
            players[activePlayer].hand.length -1}`);
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
                this.nextAction(this);
            } else {
                nextActive();
                sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                    discardAmount} skill cards to discard`);
            }
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
            players[activePlayer].hand.length -1}`);
    };
	
	let calculateSkillCheckCards = () => {
	    let count = 0;
        sendNarrationToAll('Two random cards are added from the destiny deck.');
        skillCheckCards.push(drawDestiny());
        skillCheckCards.push(drawDestiny());
	    shuffle(skillCheckCards);
	    console.log(skillCheckCards);
	    for (let x = skillCheckCards.length -1; x > -1; x--) {
	        let card = skillCheckCards[x];
	        sendNarrationToAll(`Counting skill check reveals: ${card.name} ${card.value} - ${card.type}`);
	        count += card.value * (arrHasValue(skillCheckTypes, card.type) ? 1 : -1);
        }
        sendNarrationToAll(`Skill Check count results: ${count}`);
        //Discard skill check cards
        for (let x = skillCheckCards.length -1; x > -1; x--) {
            let card = skillCheckCards[x];
            decks[card.type].discard.push(skillCheckCards.splice(x, 1)[0]);
        }

        console.log('skill check calculated to: ' + count);
        //revealSkillChecks = false; //uncomment to return to normal functionality and ont reveal skill checks
	    return count;
    };
	
	let doSkillCheckPick = text => {
		if(text.toUpperCase()==="PASS"){
            sendNarrationToAll(players[activePlayer].character.name+" passes");
		}else{
            let indexes = false;
            for (let x = 1; x < players[activePlayer].hand.length; x++) {
                indexes = isLegitIndexString(text, players[activePlayer].hand.length, x);
                if (indexes !== false)
                    x = 420;
            }
            console.log(indexes);
            if (indexes === false){
                sendNarrationToPlayer(players[activePlayer].userId, 'does not compute');
                return;
            }
            for (let x = 0; x < indexes.length; x++) {
                let player = players[activePlayer];
                let card = player.hand[indexes[x]];
                let revealString = `${card.type}: ${card.name} ${card.value}`;
                sendNarrationToAll(`${player.character.name} added a ${
                    revealSkillChecks ? revealString : 'card'} to the skill check.`);
                skillCheckCards.push(player.hand.splice(indexes[x], 1)[0]);
            }
		}
        console.log('skillcheckcards: ');
		console.dir(skillCheckCards);
		
        if (++playersChecked === players.length) {
            console.log('checked');
            playersChecked = 0;
            let temp = calculateSkillCheckCards();
            if (temp >= passValue){
                sendNarrationToAll("Crisis passed!");
                skillPass(this);
            }else if (temp >= middleValue && middleValue !== -1) {
                sendNarrationToAll("Crisis partially pass");
                skillMiddle(this);
            }else{
                sendNarrationToAll("Crisis failed!");
                skillFail(this);
            }
        } else {
            nextActive();
            sendNarrationToPlayer(players[activePlayer].userId, skillText);
        }
    };

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
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                return true;
            case LocationEnum.PRESIDENTS_OFFICE:
                if(activePlayer===currentPresident){
                    quorumHand.push(drawCard(decks[DeckTypeEnum.QUORUM]));
                    sendNarrationToAll(players[activePlayer].character.name + " activates " +
                        LocationEnum.PRESIDENTS_OFFICE);
                    sendNarrationToAll(players[activePlayer].character.name + " draws a quorum card");
                    sendNarrationToPlayer(players[activePlayer].userId, "You drew "+quorumHand[quorumHand.length-1].name);
                    sendNarrationToPlayer(players[activePlayer].userId, "'play' to play or 'draw' to draw another");
                    phase = GamePhaseEnum.DRAW_OR_PLAY_QUORUM_CARD;
                }else{
                    sendNarrationToPlayer(activePlayer, "You're not the president");
                    return false;
                }
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
                sendNarrationToPlayer(players[activePlayer].userId,
                    "Select a space location to activate a viper, or 0/1 to launch viper SW/SE");
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
                    sendNarrationToPlayer(players[activePlayer].userId,
                        "Select 0 for Southwest launch or 1 for Southeast launch");
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
                handText+=hand[i].name+" "+hand[i].value+" - "+hand[i].type+", ";
			}
            sendNarrationToPlayer(userId, handText);
            return;
		}else if (text.toUpperCase()==="PLAYERS") {
    	    let list = '';
    	    for (let x = 0; x < players.length; x++)
    	        list += `(${x} - ${players[x].character.name}) `;
    	    sendNarrationToPlayer(userId, list);
    	    return;
        }else if(text.toUpperCase()==="TITLES"){
            let msg="";
            msg+="President: "+players[currentPresident].character.name+"<br>";
            msg+="Admiral: "+players[currentAdmiral].character.name+"<br>";
            sendNarrationToPlayer(userId, msg);
            return;
        }else if(text.toUpperCase()==="QUORUM"){
            if(getPlayerNumberById(userId)===currentPresident){
            	let msg="Quorum: ";
            	for(let i=0;i<quorumHand.length;i++){
            		msg+=quorumHand[i].name+",";
				}
                sendNarrationToPlayer(userId, msg);
            }else{
                sendNarrationToPlayer(userId, "You're not the president");
            }
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
        }else if(text.toUpperCase()==="GALACTICA") {
        	let msg="";
        	msg+="Fuel:"+fuelAmount+" Food:"+foodAmount+" Morale:"+moraleAmount+" Population:"+populationAmount+"<br>";
        	msg+="Vipers: hangar-"+vipersInHangar+" damaged-"+damagedVipers+"<br>";
        	msg+="Damaged Locations:";
        	msg+=damagedLocations+"<br>";
        	msg+="Centurions:"+centurionTrack;
            sendNarrationToPlayer(userId, msg);
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
        }else if(phase===GamePhaseEnum.REPAIR_VIPERS_OR_HANGAR_DECK){
            repairVipersOrHangarDeck(text);
        }else if(phase===GamePhaseEnum.ATTACK_CENTURION){
            attackCenturion(text);
        }else if(phase===GamePhaseEnum.WEAPONS_ATTACK){
            weaponsAttack(text);
        }else if(phase===GamePhaseEnum.PLACE_SHIPS){
            placeShips(text);
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
        }else if (phase === GamePhaseEnum.DRAW_OR_PLAY_QUORUM_CARD) {
            drawOrPlayQuorumCard(text);
        }

        if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN){
            doCrisisStep();
            //nextTurn();
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
    return numbers.sort((a, b) => b - a);
};

const arrHasValue = (arr, value) => {
    for (let x = 0; x < arr.length; x++)
        if (arr[x] === value)
            return true;
    return false;
};