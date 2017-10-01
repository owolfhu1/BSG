

const enums = require(__dirname + '/enums').enums;

const WhoEnum = enums.WhoEnum;
const SkillTypeEnum = enums.SkillTypeEnum;
const DeckTypeEnum = enums.DeckTypeEnum;
const SpaceEnum = enums.SpaceEnum;
const CylonActivationTypeEnum = enums.CylonActivationTypeEnum;
const CharacterTypeEnum = enums.CharacterTypeEnum;
const LocationEnum = enums.LocationEnum;
const SkillPlayTimeEnum = enums.SkillPlayTimeEnum;
const InPlayEnum = enums.InPlayEnum;
const GamePhaseEnum = enums.GamePhaseEnum;

const DestinationMap = Object.freeze({
    
    DEEP_SPACE : {
        total : 3,
        name : "Deep Space",
        text : "Lose 1 fuel and 1 morale",
        graphic : "BSG_Dest_Deep_Space.png",
        value : 2,
        action : (game, fun) => {
            game.addFuel(-1);
            game.addMorale(-1);
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.doPostDestination();
                }
            });
        },
    },
    
    ICY_MOON : {
        total : 3,
        name : "Icy Moon",
        text : "Lose 1 fuel. The Admiral may risk 1 raptor to roll a die. if 3" +
        " or higher, gain 1 food. Otherwise, destroy 1 raptor.",
        graphic : "BSG_Dest_Icy_Moon.png",
        value : 1,
        action : game => {
            game.nextAction = null;
            game.addFuel(-1);
            game.choose(DestinationMap.ICY_MOON.choice);
        },
        choice : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk a raptor for 1 food (-OR-) Risk nothing',
            options: (next) => {
                return ["Risk raptor for +1 food","Nothing"];
            },
            choice1 : preRoll => {
                preRoll.afterRoll = game => {
                    if (game.getRaptorsInHangar() === 0) {
                        game.narrateAll("No raptors left to risk");
                        game.doPostDestination();
                        return;
                    }
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.narrateAll("Admiral rolls a " + roll);
                    if (roll > 2) {
                        game.narrateAll("Food increased by 1!");
                        game.addFood(1);
                    } else {
                        game.narrateAll("Raptor destroyed!");
                        game.addRaptor(-1);
                    }
                    game.doPostDestination();
                };
                preRoll.setUpRoll(8, WhoEnum.ADMIRAL, 'Gain a food if 3 or higher, else lose a raptor.');
            },
            choice2 : game => {
                game.narrateAll("Admiral decides not to risk a raptor");
                game.doPostDestination();
            },
        },
    },
    
    BARREN_PLANET : {
        total : 4,
        name : "Barren Planet",
        text : "Lose 2 fuel.",
        graphic : "BSG_Dest_Baren_Planet.png",
        value : 2,
        action : (game, fun) => {
            game.addFuel(-2);
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.doPostDestination();
                }
            });
        },
    },
    
    REMOTE_PLANET : {
        total : 3,
        name : "Remote Planet",
        text : "Lose 1 fuel and destroy 1 raptor.",
        graphic : "BSG_Dest_Remote_Planet.png",
        value : 2,
        action : (game, fun) => {
            game.addFuel(-1);
            game.addRaptor(-1);
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.doPostDestination();
                }
            });
        },
    },
    
    TYLIUM_PLANET : {
        total : 4,
        name : "Tylium Planet",
        text : "Lose 1 fuel. The Admiral May risk 1 raptor to roll a die. If 3 or higher, " +
        "gain 2 fuel. Otherwise, destroy 1 raptor.",
        graphic : "BSG_Dest_Tylium_Planet.png",
        value : 1,
        action : (game, fun) => {
            game.nextAction = null;
            game.addFuel(-1);
            game.choose(DestinationMap.TYLIUM_PLANET.choice);
        },
        choice : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk a raptor for 2 fuel (-OR-) Risk nothing',
            options: (next) => {
                return ["Risk raptor for +2 fuel","Nothing"];
            },
            choice1 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    if (game.getRaptorsInHangar() === 0) {
                        game.narrateAll("No raptors left to risk");
                        game.doPostDestination();
                        return;
                    }
                    game.narrateAll("Admiral risks a raptor");
                    game.setActiveRoll(roll);
                    game.narrateAll("Admiral rolls a " + roll);
                    if (roll > 2) {
                        game.narrateAll("Fuel increased by 2!");
                        game.addFuel(2);
                    } else {
                        game.narrateAll("Raptor destroyed!");
                        game.addRaptor(-1);
                    }
                    game.doPostDestination();
                };
                preRoll.setUpRoll(8, WhoEnum.ADMIRAL, 'Gain 2 fuel if 3 or higher, else lose a raptor.');
            },
            choice2 : game => {
                game.narrateAll("Admiral decides not to risk a raptor");
                game.doPostDestination();
            },
        },
    },
    
    ASTEROID_FIELD : {
        total : 2,
        name : "Asteroid Field",
        text : "Lose 2 fuel. Then draw 1 civilian ship and destroy it. [lose the resources on the back].",
        graphic : "BSG_Dest_Asteroid_Field.png",
        value : 3,
        action : (game, fun) => {
            game.addFuel(-2);
            game.destroyCivilianShip(-1, 1);
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.doPostDestination();
                }
            });
        },
    },
    RAGNAR_ANCHORAGE : { //Basically works but technically admiral should be able to repair only some of the ships
        total : 1,
        name : "Ragnar Anchorage",
        text : "The Admiral may repair up to 3 vipers and 1 raptor. These ships may be damaged or even destroyed.",
        graphic : "BSG_Dest_Ragnar_Anchorage.png",
        value : 1,
        action : game => {
            game.addFuel(-1);
            game.choose(DestinationMap.RAGNAR_ANCHORAGE.choice1);
        },
        choice1 : {
            who : WhoEnum.ADMIRAL,
            text : 'Repair up to 3 vipers and a raptor (-OR-) Repair nothing',
            choice1 : game => game.choose(DestinationMap.RAGNAR_ANCHORAGE.choice2),
            choice2 : game => game.narrateAll("Admiral decides not to repair anything"),
        },
        choice2 : {
            who : WhoEnum.ADMIRAL,
            text : 'which ships would you like to repair?',
            other : (game, command) => {
                game.narrateAll("Admiral repairs 3 vipers and a raptor");
                game.addRaptor(1);
                game.repairVipers(3,true);
                game.doPostDestination();
            },
        }
    },
    CYLON_AMBUSH : {
        total : 1,
        name : "Cylon Ambush",
        text : "Lose 1 fuel. Then place 1 basestar and 3 raiders in front of" +
        " Galactica and 3 civilian ships behind Galactica.",
        graphic : "BSG_Dest_Cylon_Ambush.png",
        value : 3,
        action : (game, fun) => {
            game.nextAction = next => {
                game.nextAction = null;
                game.choose({
                    who : WhoEnum.ACTIVE,
                    text : '',
                    options: (next) => {
                        return ["Continue"];
                    },
                    other : (game, player) => {
                        game.doPostDestination();
                    }
                });
            };
            game.addFuel(-1);
            game.activateCylons(CylonActivationTypeEnum.CYLON_AMBUSH);
        },
    },
    
    CYLON_REFINERY : {
        total : 1,
        name : "Cylon Refinery",
        text : "Lose 1 fuel. The Admiral may risk 2 vipers to roll a die. If 6 or higher, " +
        "gain 2 fuel. otherwise, damage 2 vipers.",
        graphic : "BSG_Dest_Cylon_Refinery.png",
        value : 2,
        action : (game, fun) => {
            game.nextAction = null;
            game.choose(DestinationMap.CYLON_REFINERY.choose);
            if(game.getVipersInHangar()<2){
            	game.choose({
					who : WhoEnum.ACTIVE,
					text : 'Not enough vipers to risk',
					options: (next) => {
						return ["Continue (No vipers to risk)"];
					},
					other : (game, player) => {
						game.doPostDestination();
					}                              
				});
            }
        },
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk 2 vipers to gain 2 fuel on a roll of 6 or higher (-OR-) don\'t',
            options: (next) => {
                return ["Risk 2 vipers for +2 fuel","Risk Nothing"];
            },
            choice1 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    if (roll < 6)
                        game.damageVipersInHangar(2);
                    else game.addFuel(2);
                    game.narrateAll(`A ${roll} was rolled so, ${roll < 6 ? '2 vipers are damaged' : 'you gain 2 fuel'}.`);
                    game.doPostDestination();
                };
                preRoll.setUpRoll(8, WhoEnum.ADMIRAL, 'Gain 2 fuel if 6 or higher, else lose 2 vipers.');
            },
            choice2 : game => {
                game.narrateAll("Admiral decides not to risk the vipers");
                game.doPostDestination();
            },
        },
    },
    
    DESOLATE_MOON : {
        total : 1,
        name : "Desolate Moon",
        text : "Lose 3 fuel.",
        graphic : "BSG_Dest_Desolate_Moon.png",
        value : 3,
        action : (game, fun) => {
            game.addFuel(-3);
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.doPostDestination();
                }
            });
        },
    },
    
});

const QuorumMap = Object.freeze({
    //
    FOOD_RATIONING : {
        total : 2,
        name : 'Food Rationing',
        graphic:"BSG_Quorum_Food_Rationing.png",
        text : "I estimate that the current civilian population of 45,265 will require at a minimum: " +
        "82 tons of grain, 85 tons of mean, 119 tons of fruit, 304 tons of vegetables... per week. - Gaius Baltar",
        actionText : "Roll a die. If 6 or higher, gain 1 food and remove this card from the" +
        " game. Otherwise no effect and discard this card",
        action : preRoll => {
            preRoll.afterRoll = game => {
                let roll = game.roll;
                game.setActiveRoll(roll);
                game.narrateAll(`${game.getPlayers()[game.getActivePlayer()].character.name} rolls a ${roll} and ${
                    roll > 5 ? "you gain one food" : "the rationing was unsuccessful"}.`);
                game.addFood(roll > 5 ? 1 : 0);
                game.choose({
                    who: WhoEnum.ACTIVE,
                    text: '',
                    options: (next) => {
                        return ["Continue"];
                    },
                    other: (game1, text) => {
                        game1.afterQuorum(roll < 6);
                    }
                });
            };
            preRoll.setUpRoll(8, WhoEnum.ACTIVE, 'Gain a food on 6 or higher and destroy this card, else discard this card.');
        },
    },
    //
    PRESIDENTIAL_PARDON: {
        total : 1,
        name : 'Presidential Pardon',
        graphic:"BSG_Quorum_Pres_Pardon.png",
        text : "I can do more. I can guarantee your safety. I can even order you released. - Laura Roslin",
        actionText : "Move any other character from the brig to any other location on Galactica.",
        action : game => {
            game.choose({
                who : WhoEnum.ACTIVE,
                text : 'Choose a player to move from the brig.',
                player : (game, player) => {
                    game.nextAction = next => {
                        next.nextAction = null;
                        next.choose({
                            who : WhoEnum.ACTIVE,
                            text : `Choose a location to send ${game.getPlayers()[player].character.name} to.`,
                            options: (next) => {
                                return next.getHumanPlayerNames();
                            },
                            other : (second, command) => {
                                second.nextAction = third => {
                                    third.nextAction = null;
                                    if (LocationEnum[command] != null) {
                                        if(command === LocationEnum.BRIG){
                                            third.narratePlayer(third.getCurrentPlayer(), "Can't send to the Brig");
                                            third.choose(QuorumMap.PRESIDENTIAL_PARDON.choice);
                                        }
                                        if (third.getLocation(player) === LocationEnum.BRIG) {
                                            third.narrateAll(third.getPlayers()[third.getActivePlayer()].character.name
                                                +" releases "+third.getPlayers()[player].character.name+" from the Brig, and to "+command);
                                            third.sendPlayerToLocation(player, command);
                                        } else {
                                            third.narratePlayer(third.getCurrentPlayer(),
                                                "that player was not in the brig so nothing happens");
                                        }
                                    } else {
                                        third.narratePlayer(third.getCurrentPlayer(), "Incorrect location");
                                        third.choose(QuorumMap.PRESIDENTIAL_PARDON.choice);
                                    }
                                    third.afterQuorum(true);
                                };
                            }
                        });
                    };
                },
            });
        },
    },
    //
    RELEASE_CYLON_MUGSHOTS : {
        total : 1,
        name : 'Release Cylon Mugshots',
        graphic:"BSG_Quorum_Release_Mugshots.png",
        text : 'The Cylons have the ability to mimic human form; they look like us now. This man has ' +
        'been identified as a Cylon Agent. We believe him to be responsible for the bombing. - Laura Roslin',
        actionText : "Look at 1 random Loyalty Card belonging to any other player, then roll a die. " +
        "If 3 or less, lose 1 morale. Then discard this card.",
        action : game => game.choose(QuorumMap.RELEASE_CYLON_MUGSHOTS.choice),
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Whos random loyalty card would you like to see?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (preRoll, player) => {
            	if (preRoll.getActivePlayer()===player) {
                    preRoll.narratePlayer(player, 'Not yourself!');
                    preRoll.choose(QuorumMap.RELEASE_CYLON_MUGSHOTS.choice);
                    return;
                }
                preRoll.randomLoyaltyReveal(preRoll.getCurrentPlayer(), player);
                preRoll.choose({
					who: WhoEnum.ACTIVE,
					text: 'Loyalty',
					options: (next) => {
						return ["Continue"];
					},
					other: (next, text) => {
						next.afterRoll = second => {
							let roll = second.roll;
							second.setActiveRoll(roll);
							second.addMorale(roll > 3 ? 0 : -1);
							second.narrateAll(`A ${roll} was rolled, so ${roll > 3 ? 'nothing happens' : 'you lose 1 morale'}.`);
							second.afterQuorum(true);
						};
						next.setLoyaltyShown(null);
						next.setUpRoll(8, WhoEnum.ACTIVE, 'Lose a moral on 3 or less.');
					},
				});
            }
        },
    },
    //
    ARREST_ORDER : {
        total : 2,
        name : "Arrest Order",
        graphic:"BSG_Quorum_Arrest_Order.png",
        text : "He has confessed to lying under oath and dereliction of duty in a time of war. He has been stripped of" +
        " rank and confined to the Galactica brig. - Laura Roslin",
        actionText : "Choose a character and send him to the Brig location. Then discard this card.",
        action : game => game.choose(QuorumMap.ARREST_ORDER.choice),
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Which player would you like to send to the brig?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                game.sendPlayerToLocation(player, LocationEnum.BRIG);
                game.afterQuorum(true);
            },
        },
    },
    //has TODOs
    AUTHORIZATION_OF_BRUTAL_FORCE : {
        total : 2,
        name : 'Authorization of Brutal Force',
        graphic:"BSG_Quorum_Authorize_Brute_Force.png",
        text : "They have... over 1,300 innocent people on board... - Laura Roslin<br>No choice now. Them or us. William Adama",
        actionText : "Destroy 3 raiders, 1 heavy raider or 1 centurion. Then roll a die, and if 2 or less, lose 1 population. " +
        "Then discard this card",
        action : game => game.choose(QuorumMap.AUTHORIZATION_OF_BRUTAL_FORCE.choice),
        choice : {
            who : WhoEnum.ACTIVE,
            text : `Choose to destroy: 3 'raiders', 1 'heavy' raider or 1 'centurion'.`,
            options: (game) => {
                return ["3 raiders","1 heavy raider","1 centurion"]
            },
            other : (game, text) => {
                text = text.toLowerCase();
                switch (text) {
                    case 'raiders' :
                        //TODO destory 3 raiders
                        break;
                    case 'heavy' :
                        //TODO destory 1 heavy raider
                        break;
                    case 'centurion' :
                        //TODO destory 1 centurion
                        break;
                    default :
                        game.narratePlayer(game.getCurrentPlayer(),
                            `Invalid input, please choose: 'raiders', 'heavy' or 'centurion'.`);
                        game.choose(QuorumMap.AUTHORIZATION_OF_BRUTAL_FORCE.choice);
                        return;
                }
                game.afterQuorum(true);
            },
        },
    },
    //
    INSPIRATIONAL_SPEECH : {
        total : 4,
        name : "Inspirational Speech",
        graphic:"BSG_Quorum_Inspire_Speech.png",
        text : "I'm sure I speak on behalf of everyone in the fleer when i say, thank you." +
        " Without your dedication, tireless effords, and sacrifice, none of us would be here today. Laura Roslin",
        actionText : "Roll a die. If 6 or higher, gain 1 morale and remove this card from" +
        " the game. Otherwise, no effect and discard this card.",
        action : preRoll => {
            preRoll.afterRoll = game => {
                let roll = game.roll;
                game.setActiveRoll(roll);
                game.narrateAll(`${game.getPlayers()[game.getActivePlayer()].character.name} rolls a ${roll} and ${
                    roll > 5 ? "you gain one morale" : "the speech was unsuccessful"}.`);
                game.addMorale(roll > 5 ? 1 : 0);
                game.choose({
                    who: WhoEnum.ACTIVE,
                    text: 'Inspirational Speech',
                    options: (next) => {
                        return ["Continue"];
                    },
                    other: (game1, text) => {
                        game1.afterQuorum(roll < 6);
                    },
                });
            };
            preRoll.setUpRoll(8, WhoEnum.ACTIVE, 'On 6 or higher, gain a moral and destroy this card, else discard.');
        },
    },
    //
    ENCOURAGE_MUTINY : {
        total : 1,
        name : "Encourage Mutiny",
        graphic:"BSG_Quorum_Encourage_Mutiny.png",
        text : "We both took an oath to protect and defend the Articles of Colonization. Those Articles " +
        "are under attack, as is our entire democratic way of life. - Laura Roslin",
        actionText : "Choose any other player [excluding the Admiral]. That player rolls a die." +
        " if 3 or higher, he receives the Admiral title; otherwise, lose 1 morale. then discard this card.",
        action : game => game.choose(QuorumMap.ENCOURAGE_MUTINY.choice),
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Choose a player to give the admiral title to.',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    game.narratePlayer(player, 'Not yourself!');
                    game.choose(QuorumMap.ENCOURAGE_MUTINY.choice);
                }else if (player === game.getCurrentAdmiral()) {
                    game.narratePlayer(game.getCurrentPlayer(), 'Not the Admiral!');
                    game.choose(QuorumMap.ENCOURAGE_MUTINY.choice);
                } else {
                    game.afterRoll = afterRoll => {
                        let roll = afterRoll.roll;
                        afterRoll.setActiveRoll(roll);
                        afterRoll.narrateAll(`A ${roll} was rolled so, ${roll > 2 ? `the Admiral is now ${
                            afterRoll.getPlayers()[player].character.name}` : 'nothing happens'}.`);
                        if (roll > 2)
                            afterRoll.setAdmiral(player);
                        afterRoll.afterQuorum(true);
                    };
                    game.setUpRoll(8, player, `${game.getPlayers()[player].character.name} becomes Admiral on 3 or higher.`);
                }
            },
        },
    },
    //
    ACCEPT_PROPHECY : {
        total : 1,
        name : "Accept Prophecy",
        graphic:"BSG_Quorum_Accept_Prophecy.png",
        text : "Madam President, have you read the Scrolls of Pythia? - Porter<br>Many times, " +
        "and I humbly believe I am fulfilling the role of the Leader. - Laura Roslin",
        actionText : "Draw 1 Skill Card of any type (it may be from outside your skillset). Keep this card in play." +
        ` When a player activates 'Administration' or chooses the President with the "Admiral's Quarters" location,` +
        " increase the difficulty by 2, then discard this card.",
        action : game => game.choose(QuorumMap.ACCEPT_PROPHECY.choice),
        choice : {
            who : WhoEnum.ACTIVE,
            text : `choose a skill card: 'politics', 'leadership', 'tactics', 'piloting' or 'engineering'.`,
            options: (next) => {
                return next.getSkillCardTypeNamesForPlayer(null);
            },
            other : (game, text) => {
                let type = 'error';
                switch (text) {
                    case 0 : type = DeckTypeEnum.POLITICS; break;
                    case 1 : type = DeckTypeEnum.LEADERSHIP; break;
                    case 2 : type = DeckTypeEnum.TACTICS; break;
                    case 3 : type = DeckTypeEnum.PILOTING; break;
                    case 4 : type = DeckTypeEnum.ENGINEERING; break;
                    default :
                        game.choose(QuorumMap.ACCEPT_PROPHECY.choice);
                        return;
                }
                game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws a "+type+" skill card");
                game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[type]));
                game.setInPlay(InPlayEnum.ACCEPT_PROPHECY);
                game.afterQuorum(false);
            },
        },
    },
    //
    ASSIGN_VICE_PRESIDENT : {
        total : 1,
        name : "Assign Vice President",
        graphic:"BSG_Quorum_Assign_V_Pres.png",
        text : "If anything should happen to you, Madame President, we have no designated successor. The civilian " +
        "branch of our government would be paralyzed... - Tom Zarek",
        actionText : "Draw 2 politics cards and give this card to any other player. Keep this card in play. While this" +
        ` player is not President, other players may not be chosen with the "Administration" location.`,
        action : game => {
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards");
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_VICE_PRESIDENT.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Who should be the vice president?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    game.narratePlayer(player, 'Not yourself!');
                    game.choose(QuorumMap.ASSIGN_VICE_PRESIDENT.choice);
                } else {
                    game.setVicePresident(player);
                    game.afterQuorum(false);
                }
            },
        },
    },
    //
    ASSIGN_ARBITRATOR : {
        total : 1,
        name : "Assign Arbitrator",
        graphic:"BSG_Quorum_Assign_Arbitrator.png",
        text : "I need a free hand. The authority to follow evidence wherever" +
        " it might lead, without command review. - Hadrian",
        actionText : "Draw 2 politics cards and give this card to any other player. Keep this card in play." +
        ` When a player activates the "Admiral's Quarters" location, this player may discard this card to` +
        ' reduce or increase the difficulty by 3.',
        action : game => {
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards");
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_ARBITRATOR.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Who should be the arbitrator?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    game.narratePlayer(player, 'Not yourself!');
                    game.choose(QuorumMap.ASSIGN_ARBITRATOR.choice);
                } else {
                    game.setArbitrator(player);
                    game.afterQuorum(false);
                }
            },
        },
    },
    //
    ASSIGN_MISSION_SPECIALIST : {
        total : 1,
        name : "Assign Mission Specialist",
        graphic:"BSG_Quorum_Assign_Miss_Specialist.png",
        text : "Reality is there's a good chance it can Jump all the way back to Caprica, retieve the Arrow, and help" +
        " us find Earth. The real Earth. - Laura Roslin",
        actionText : "Draw 2 politics cards and give this card to any other player. Keep this card in play." +
        " The next time the fleet jumps, this player chooses the destination instead of the Admiral. He " +
        "draws 3 Destination Cards [instead of 2] and chooses 1. Then discard this card.",
        action : game => {
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards");
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_MISSION_SPECIALIST.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Who should be the mission specialist?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    game.narratePlayer(player, 'Not yourself!');
                    game.choose(QuorumMap.ASSIGN_MISSION_SPECIALIST.choice);
                } else {
                    game.setMissionSpecialist(player);
                    game.afterQuorum(false);
                }
            },
        },
    },
    
});

const CrisisMap = Object.freeze({
    
    /*
            *** STEPS WHEN PLAYING A CRISIS CARD ***
            
            1) if card has 'choose' key -> run game.choose(card.choose)
            2) else if card has 'skillCheck' key -> run game.beforeSkillCheck(card.skillCheck)
            3) else run card.instructions(game)
            4) functions in card objects should handle what to do after card is resolved
    */
    
    //
    WATER_SABOTAGED : {
        name : 'Water Sabotaged',
        text : "Every tank on the starboard side has ruptured. " +
        "We're venting all our water directly into space. - Saul Tigh",
        graphic : "BSG_Crisis_Water_Sabotaged.png",
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(13) PASS: no effect, FAIL: -2 food.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addFood(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : `(PO/L/T)(13) PASS: no effect, FAIL: -2 food. (-OR-) lose 1 food`,
            choice1 : game => game.beforeSkillCheck(CrisisMap.WATER_SABOTAGED.skillCheck),
            choice2 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    PRISONER_REVOLT : {
        name : 'Prisoner Revolt',
        text : "Before I release my captives... I demand the immediate" +
        " resignation of Laura Roslin and her ministers. - Tom Zarek",
        graphic : "BSG_Crisis_Prisoner_Revolt.png",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(11)(6) PASS: no effect, MIDDLE: -1 population, FAIL:' +
            ' -1 pop and President chooses another player to take the President title.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 6,
                action : game => {
                    game.addPopulation(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addPopulation(-1);
                game.choose(CrisisMap.PRISONER_REVOLT.failChoice);
            },
        },
        failChoice : {
            who : WhoEnum.PRESIDENT,
            text : 'Pick another player to give president role to.',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                
                if (game.getCurrentPresident() === player) {
                    game.narratePlayer(player, 'You must give up the presidency!');
                    game.choose(CrisisMap.PRISONER_REVOLT.failChoice);
                } else {
                    game.setPresident(player);
                    game.narrateAll(`The new president is ${game.getPlayers()[player].character.name}`);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                }
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    RESCUE_THE_FLEET : {
        name : 'Rescue the Fleet',
        text : "The Cylons are waiting for us back there. How long will that take to calculate " +
        "once we get back there? - Saul Tigh, Twelve hours. - Felix Gaeta",
        graphic : "BSG_Crisis_Rescue_Fleet.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-2 population (-OR-) -1 morale and place basestar and 3 raiders and 3 civ ships.',
            choice1 : game => {
                game.addPopulation(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.RESCUE_THE_FLEET);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    WATER_SHORTAGE_1 : {
        name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        graphic : "BSG_Crisis_Water_Short.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                            console.log('ENDCARD');
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    WATER_SHORTAGE_2 : {
        name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        graphic : "BSG_Crisis_Water_Short.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                            console.log('ENDCARD');
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    WATER_SHORTAGE_3 : {
        name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        graphic : "BSG_Crisis_Water_Short.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                            console.log('ENDCARD');
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    WATER_SHORTAGE_4 : {
        name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        graphic : "BSG_Crisis_Water_Short3.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    WATER_SHORTAGE_5 : {
        name : 'Water Shortage',
        text : "I think that you and I can come up with some kind of an understanding. This is not the only " +
        "crisis that I'm dealing with. The water shortage affects the entire fleet. Lee Adama",
        graphic : "BSG_Crisis_Water_Short2.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 food. (-OR-) president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    CYLON_SCREENINGS : {
        name : 'Cylon Screenings',
        text : "We should test the people in the most sensitive positions first. - William Adama",
        graphic : "BSG_Crisis_Cylon_Screenings.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: no effect, FAIL: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the President or Admiral.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                game.choose({
                    who : WhoEnum.CURRENT,
                    text : 'view a random loyalty card from the: President (-OR-) Admiral.',
                    options: (next) => {
                        return ["President","Admiral"];
                    },
                    choice1 : game => {
                    	game.randomLoyaltyReveal(game.getCurrentPlayer(), game.getCurrentPresident());
                    	game.choose({
							who: WhoEnum.CURRENT,
							text: 'Loyalty',
							options: (next) => {
								return ["Continue"];
							},
							other: (next, text) => {
								next.nextAction=null;
								next.setLoyaltyShown(null);
								next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
							},
						});
                    },
                    choice2 : game => {
                        game.randomLoyaltyReveal(game.getCurrentPlayer(), game.getCurrentAdmiral());
                    	game.choose({
							who: WhoEnum.ACTIVE,
							text: 'Loyalty',
							options: (next) => {
								return ["Continue"];
							},
							other: (next, text) => {
								next.nextAction=null;
								next.setLoyaltyShown(null);
								next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
							},
						});
                    },
                });
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(9) PASS: no effect, FAIL: -1 morale, and the current player looks at 1 ' +
            'random loyalty Card belonging to the President or Admiral. (-OR-) each player discards 2 skill cards',
            choice1 : game => {
                game.nextAction = next => next.nextAction = null;
                game.beforeSkillCheck(CrisisMap.CYLON_SCREENINGS.skillCheck);
            },
            choice2 : game => game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.activateCylons(CrisisMap.CYLON_SCREENINGS.cylons);
                };
                next.eachPlayerDiscards(2);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    GUILTY_BY_COLLUSION : {
        name : 'Guilty by Collusion',
        text : "Guess you haven't heard... Cylons don't have rights. Know what we do to Cylons, Chief? - Saul Tigh",
        graphic : "BSG_Crisis_Guilty_Collusion.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(9) PASS: current player may choose a character to move to the brig' +
            ', FAIL: -1 morale.',
            pass : game => game.choose(CrisisMap.GUILTY_BY_COLLUSION.passChoice),
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        passChoice : {
            who : WhoEnum.CURRENT,
            text : 'pick a player to send to brig',
            options: (next) => {
                let options=next.getHumanPlayerNames();
                options.push("Nobody");
                return options;
            },
            player : (game, player) => {
                if (!isNaN(player))
                    if (parseInt(player) > -1 && parseInt(player) < game.getPlayers().length) {
                        game.sendPlayerToLocation(player, LocationEnum.BRIG);
                        for (let x = 0; x < game.getPlayers().length; x++)
                            game.narrateAll(`${game.getPlayers()[player].character.name} has been sent to the brig`);
                    }else if(player===game.getPlayers().length){
                        game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name +" decides not the send anyone to the Brig");
                    }
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    INFORMING_THE_PUBLIC : {
        name : 'Informing the Public',
        text : "I also strongly recommend alerting the public to the Cylon threat. - Hadrian",
        graphic : "BSG_Crisis_Informing_Public.png",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(7) PASS: Current player looks at 1 random Loyalty Card belonging to a player. FAIL: -2 morale.',
            pass : game => game.choose(CrisisMap.INFORMING_THE_PUBLIC.passChoice),
            fail : game => {
                game.addMorale(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        passChoice : {
            who : WhoEnum.CURRENT,
            text : 'which player do you pick to look at a random loyalty card?',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                game.randomLoyaltyReveal(game.getCurrentPlayer(), player);
                game.choose({
					who: WhoEnum.CURRENT,
					text: 'Loyalty',
					options: (next) => {
						return ["Continue"];
					},
					other: (next, text) => {
						next.nextAction=null;
						next.setLoyaltyShown(null);
						next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
					},
				});
            }
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(7) PASS: Current player looks at 1 random Loyalty Card belonging to a player.' +
            ' FAIL: -2 morale. (-OR-) Roll a die. On a 4 or lower. -1 morale and -1 population',
            choice1 : game => game.beforeSkillCheck(CrisisMap.INFORMING_THE_PUBLIC.skillCheck),
            choice2 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    if (roll <= 4) {
                        game.addPopulation(-1);
                        game.addMorale(-1);
                        game.narrateAll(`A ${roll} was rolled and you lost 1 population/morale.`);
                    } else game.narrateAll(`A ${roll} was rolled so nothing happens!`);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT,'On 4 or lower, -1 morale and population.');
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    HEAVY_ASSAULT : {
        name : 'Heavy Assault',
        text : "INSTRUCTIONS: 1) Activate: raiders. 2) Setup: 2 basestars, 1 viper, " +
        "3 civilian ships. 3) Special Rule - HEAVY BOMBARDMENT : Each basestar immediately attacks Galactica.",
        graphic : "BSG_Crisis_Heavy_Assault.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                };
                next.activateCylons(CylonActivationTypeEnum.HEAVY_ASSAULT);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.HEAVY_ASSAULT,
    },
    //
    THE_OLYMPIC_CARRIER : {
        name : 'The Olympic Carrier',
        text : "We have new orders. We're directed to... destroy the Olympic Carrier and then return" +
        " to Galactica. - Sharon Valerii" +
        " It's a civilian ship... - Kara Thrace",
        graphic : "BSG_Crisis_The_Olympic.png",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text : '(PO/L/PI)(11)(8) PASS: no effect, MIDDLE: -1 population, FAIL: -1 population and morale.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 8,
                action : game => {
                    game.addPopulation(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addPopulation(-1);
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    CYLON_ACCUSATION : {
        name : 'Cylon Accusation',
        text : "Laura. I have something to tell you. Commander Adama... is a Cylon. - Leoben Conoy",
        graphic : "BSG_Crisis_Cylon_Accusation.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(10) PASS: no effect, FAIL: the current player is placed in the brig.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.BRIG);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    FOOD_SHORTAGE_1 : {
        name : 'Food Shortage',
        text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediately. - Laura Roslin',
        graphic : "BSG_Crisis_Food_Shortage.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 food (-OR-) -1 food, president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.addFood(-1);
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    FOOD_SHORTAGE_2 : {
        name : 'Food Shortage',
        text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediately. - Laura Roslin',
        graphic : "BSG_Crisis_Food_Shortage.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 food (-OR-) -1 food, president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    FOOD_SHORTAGE_3 : {
        name : 'Food Shortage',
        text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediately. - Laura Roslin',
        graphic : "BSG_Crisis_Food_Shortage.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 food (-OR-) -1 food, president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    FOOD_SHORTAGE_4 : {
        name : 'Food Shortage',
        text : 'Get the names of those ships. Tell their captains to go on Emergency rations immediately. - Laura Roslin',
        graphic : "BSG_Crisis_Food_Shortage.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 food (-OR-) -1 food, president discards 2 skill cards then current player discards 3.',
            choice1 : game => {
                game.addFood(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        second.singlePlayerDiscards(WhoEnum.CURRENT, 3);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    REQUEST_RESIGNATION : {
        name : 'Request Resignation',
        text : "I'm going to have to ask you for your resignation, Madam President. - William Adama" +
        ", No - Laura Roslin, Then I'm terminating your presidency. - William Adama",
        graphic : "BSG_Crisis_Request_Resignation.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'The president and admiral both discard 2 skill cards. (-OR-) The President may choose to give the ' +
            'President title to the admiral, or move to the brig.',
            choice1 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                        };
                        second.singlePlayerDiscards(WhoEnum.ADMIRAL, 2);
                    };
                    next.singlePlayerDiscards(WhoEnum.PRESIDENT, 2);
                };
            },
            choice2 : game => game.choose(CrisisMap.REQUEST_RESIGNATION.chooseChoice2),
        },
        chooseChoice2 : {
            who : WhoEnum.PRESIDENT,
            text : 'Give up president to admiral (-OR-) go to brig.',
            options: (next) => {
                return ["Give presidency to Admiral","Go to Brig"];
            },
            choice1 : game => {
                game.setPresident(game.getCurrentAdmiral());
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.sendPlayerToLocation(game.getCurrentPresident(), LocationEnum.BRIG);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    ELECTIONS_LOOM : {
        name : 'Elections Loom',
        text : "Your're frakking right about democracy and consent of the people. I believe in those things." +
        " And we're going to have them. - Lee Adama",
        graphic : "BSG_Crisis_Elections_Loom.png",
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(8)(5) PASS: nothing, MIDDLE: -1 morale, FAIL: -1 morale, president discards 4 skill cards.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 5,
                action : game => {
                    game.addMorale(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addMorale(-1);
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                };
                game.singlePlayerDiscards(WhoEnum.PRESIDENT, 4);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    FULFILLER_OF_PROPHECY : {
        name : 'Fulfiller of Prophecy',
        text : "The scrolls tell us that a dying leader will lead us to salvation. - Porter",
        graphic : "BSG_Crisis_Fulfiller_Prophecy.png",
        skillCheck : {
            value : 6,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(6) PASS: the current player draws 1 politics Skill Card. FAIL: -1 population.',
            pass : game => {
                game.getPlayers()[game.getCurrentPlayer()].hand.push(game.drawCard(game.getDecks()[SkillTypeEnum.POLITICS]));
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            fail : game => {
                game.addPopulation(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(6) PASS: the current player draws 1 politics Skill Card. FAIL: -1 population.' + ` (-OR-) ` +
            'current player discards 1 skill card. After the Activate Cylon Ships step, return to the resolve ' +
            'Crisis step to draw another crisis and resolve it.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.FULFILLER_OF_PROPHECY.skillCheck),
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            if(third.getPlayers()[third.getCurrentPlayer()].character.name===CharacterMap.ROSLIN.name){
								sendNarrationToAll(third.getPlayers()[third.getCurrentPlayer()].character.name+" looks at top two crisis cards",thirdId);
								third.roslinVisions();
								return;
							}
                            third.playCrisis(game.getDecks().Crisis.deck.pop());
                        };
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                    };
                    next.singlePlayerDiscards(WhoEnum.CURRENT, 1);
                };
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    RAIDING_PARTY : {
        name : 'Raiding Party',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 2 heavy raiders, 5 raiders, 2 vipers, and 3 civilian' +
        ' ships.<br>3) Special Rule - <i>FTL Failure:</i> Move the fleet token 1 space towards the start of the Jump',
        graphic : "BSG_Crisis_Raiding_Party.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.addToFTL(-1);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.RAIDING_PARTY);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.RAIDING_PARTY,
    },
    //
    RIOTS_1 : {
        name : 'Riots',
        text : "Don't be so sure, Commander. Rebellions are contagious. People are already" +
        " rioting over the water crisis. We can't afford to destabilize this government right now. - Laura Roslin",
        graphic : "BSG_Crisis_Riots2.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 food & -1 morale, (-OR-) -1 population & -1 fuel.',
            choice1 : game  => {
                game.nextAction = null;
                game.addFood(-1);
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = null;
                game.addPopulation(-1);
                game.addFuel(-1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    RIOTS_2 : {
        name : 'Riots',
        text : "Don't be so sure, Commander. Rebellions are contagious. People are already" +
        " rioting over the water crisis. We can't afford to destabilize this government right now. - Laura Roslin",
        graphic : "BSG_Crisis_Riots.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 food & -1 morale, (-OR-) -1 population & -1 fuel.',
            choice1 : game => {
                game.nextAction = null;
                game.addFood(-1);
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = null;
                game.addPopulation(-1);
                game.addFuel(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    KEEP_TABS_ON_VISITOR : {
        name : 'Keep Tabs on Visitor',
        text : 'Marines tailed her all over the ship. They say she went around a corner then she was gone - Saul Tigh',
        graphic : "BSG_Crisis_Keep_Tabs.png",
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(12) PASS: no effect, FAIL: Roll a die. IF 4 or lower, -2 population.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.addPopulation(roll > 4 ? 0 : -2);
                    game.narrateAll(`A ${roll} was rolled, ${roll > 4 ? 'nothing happens' : 'you lose 2 population'}.`);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT, 'Lose 2 population on 4 or lower.');
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(12) PASS: no effect, FAIL: Roll a die. IF 4 or lower, -2 population. (-OR-) ' +
            'The current player discards 4 random Skill Cards.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.KEEP_TABS_ON_VISITOR.skillCheck),
            choice2 : game => {
                for (let w = 0; w < 4; w++)
                    game.discardRandomSkill(game.getCurrentPlayer());
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            }               ,
        },
        jump: true,
        cylons: CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    RESISTANCE : {
        name : 'Resistance',
        text : "Three other ships are also refusing the resupply " +
        "Galactica until the president has been reinstated. -Felix Gaeta",
        graphic : "BSG_Crisis_Resistance.png",
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : "(PO/L/T)(12)(9) PASS: no effect, MIDDLE: -1 food, FAIL: -1 food & -1 fuel",
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 9,
                action : game => {
                    game.addFood(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addFood(-1);
                game.addFuel(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    JUMP_COMPUTER_FAILURE : {
        name : 'Jump Computer Failure',
        text : "What's going on, Saul? Where's the fleet? - Ellen Tigh<br>" +
        "We don't know; they jumped to another location. - Saul Tigh",
        graphic : "BSG_Crisis_Jump_Comp_Fail.png",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(7) PASS: no effect, FAIL: -1 population and move the fleet token' +
            ' 1 space towards the start of the Jump Preparation track.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS),
            fail : game => {
                game.addToFTL(-1);
                game.addPopulation(-1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    UNEXPECTED_REUNION : {
        name : 'Unexpected Reunion',
        text : "I can't believe you're alive. - Saul Tigh<br>Can't believe it myself. Don't even remember " +
        "the last few weeks... it's weeks, right? - Ellen Tigh",
        graphic : "BSG_Crisis_Unexpected_Reunion.png",
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(8) PASS: no effect, FAIL: -1 morale, and the current' +
            ' player discards his hand of Skill Cards.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                while (game.getPlayers()[game.getCurrentPlayer()].hand.length > 0) {
                    game.discardRandomSkill(game.getCurrentPlayer());
                }
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    DETECTOR_SABOTAGE : {
        name : 'Detector Sabotage',
        text : "They're trying to kill me. - Gaius Baltar<br>Me, me - always me. They're trying " +
        "to destroy your work. Destroying you is an added bonus. - Six",
        graphic : "BSG_Crisis_Detector_Sabotage.png",
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(8) PASS: no effect, FAIL: All characters in the "Research Lab" location' +
            ' are sent to "Sickbay." Keep this card in play. Players may not look at other players Loyalty Cards.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            fail : game => {
                for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.getPlayers()[x].location === LocationEnum.RESEARCH_LAB)
                        game.sendPlayerToLocation(x, LocationEnum.SICKBAY);
                game.setInPlay(InPlayEnum.DETECTOR_SABOTAGE);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    SCOUTING_FOR_FUEL : {
        name : 'Scouting for Fuel',
        text : "...scouring nieghboring star systems and we anticipate they'll soon find more tylium. Laura Roslin",
        graphic : "BSG_Crisis_Scouting_Fuel.png",
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(12) PASS: +1 fuel, FAIL: -1 fuel and destroy 1 raptor.',
            pass : game => {
                game.addFuel(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addFuel(-1);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose: {
            who : WhoEnum.CURRENT,
            text : '(T/PI)(12) PASS: +1 fuel, FAIL: -1 fuel and destroy 1 raptor (-OR-) Roll a die. If 4 or lower, -1 fuel.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.SCOUTING_FOR_FUEL.skillCheck),
            choice2 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.rollDie();
                    game.setActiveRoll(roll);
                    game.narrateAll(`A ${roll} was rolled, so ${roll > 4 ? 'nothing happens' : 'you lose a fuel'}.`);
                    game.addFuel(roll > 4 ? 0 : -1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT, 'Lose a fuel on 4 or lower.');
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    BOMB_THREAT : {
        name : 'Bomb Threat',
        text : "I've planted a nuclear warhead aboard one of your ships. Leoben Conoy",
        graphic : "BSG_Crisis_Bomb_Threat.png",
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(PO/L/T)(13) PASS: no effect, FAIL: -1 morale and draw a civilian ship and destroy it.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                game.destroyCivilianShip(-1,-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(13) PASS: no effect, FAIL: -1 morale and draw a civilian ship and destroy it ' +
            '(-OR-) Roll a die. If 4 or lower, trigger the fail effect of this card.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.BOMB_THREAT.skillCheck),
            choice2 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.narrateAll(`A ${roll} was rolled so ${
                        roll > 4 ? 'nothing happens' : 'you activate skillcheck fail'}.`);
                    if (roll > 4)
                        game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                    else CrisisMap.BOMB_THREAT.skillCheck.fail(game);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT, 'on 4 or lower, trigger skillcheck fail.');
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    SLEEP_DEPRIVATION : {
        name : 'Sleep Deprivation',
        text : "Five days now. There are limits.. to the human body. " +
        "The human mind. Tolerances you can't push beyond. - Gaius Baltar",
        graphic : "BSG_Crisis_Sleep_Deprivation.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Return all undamaged vipers on the game board to the "Reserves".' +
            ' Then send the current player to "Sickbay" (-OR-) -1 morale.',
            choice1 : game => {
                game.returnVipersToHangar();
                game.sendPlayerToLocation(game.getCurrentPlayer(),LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    COLONIAL_DAY : {
        name : 'Colonial Day',
        text : "Survivors from each of the Twelve Colonies are selecting delegates for the Interim Quorum. - McMamus",
        graphic : "BSG_Crisis_Colonial_Day.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(10) PASS: +1 morale, FAIL: -2 morale.',
            pass : game => {
                game.addMorale(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            fail : game => {
                game.addMorale(-2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(10) PASS: +1 morale, FAIL: -2 morale, (-OR-) -1 morale.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.COLONIAL_DAY.skillCheck),
            choice2 : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    ADMIRAL_GRILLED : {
        name : 'Admiral Grilled',
        text : "What exactly are you planning to do? Are you declaring martial law? - Tom Zerak",
        graphic : "BSG_Crisis_Admiral_Grilled.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(9) PASS: no effect, FAIL: -1 moral and the Admiral discards 2 Skill Cards.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.nextAction = next => {
                	next.nextAction = null;
                    next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
                game.addMorale(-1);
                game.singlePlayerDiscards(WhoEnum.ADMIRAL, 2);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(9) PASS: no effect, FAIL: -1 moral and the Admiral discards 2 Skill Cards (-OR-) -1 morale.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.ADMIRAL_GRILLED.skillCheck),
            choice2 : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //small TODO for eric
    WEAPON_MALFUNCTION : {
        name : 'Weapon Malfunction',
        text : "Watch the ammo hoist for the main guns - you've got a red light right there. - Saul Tigh",
        graphic : "BSG_Crisis_Weapon_Malf.png",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(11) PASS: no effect, FAIL: Damage 2 vipers in space areas. All ' +
            'characters in the "Weapons Control" location are sent to "Sickbay".',
            pass : game => game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS),
            fail : game => {
                //TODO ERIC damage 2 vipers in space
                for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.getPlayers()[x].location === LocationEnum.WEAPONS_CONTROL)
                        game.sendPlayerToLocation(x, LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    THIRTY_THREE : {
        name : 'Thirty-Three',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 2 vipers, and 4 civilian ships.<br>' +
        '3) Special Rule - <i>Relentless Pursuit:</i> Keep this card in play until a civilian ship or basestar' +
        ' is destroyed. If this card is in play when the fleet jumps, shuffle it back into the Crisis deck',
        graphic : "BSG_Crisis_Thirty_Three.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.setInPlay(InPlayEnum.THIRTY_THREE);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.THIRTY_THREE);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.THIRTY_THREE,
    },
    //
    MISSING_G4_EXPLOSIVES : {
        name : 'Missing G4 Explosives',
        text : "There are, at this moment, six G-4 detonators missing from " +
        "the small arms locker on deck 15. - Sharon Valerii",
        graphic : "BSG_Crisis_Missing_G4.png",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(7) PASS: no effect, FAIL: -1 food and all characters ' +
            'in the "Armory" location are sent to the Brig.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addFood(-1);
                for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.getPlayers()[x].location === LocationEnum.ARMORY)
                        game.sendPlayerToLocation(x, LocationEnum.BRIG);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    BUILD_CYLON_DETECTOR : {
        name : 'Build Cylon Detector',
        text : "Commander, the truth is... there is one way. I didn't want to have to ask you for this, but" +
        " what I really need to complete the project... is a nuclear warhead. - Gaius Baltar",
        graphic : "BSG_Crisis_Build_Cylon_Detector.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Discard 1 nuke token. If you do not have any nuke tokens, you may not choose this option. ' +
            '(-OR-) -1 morale and the Admiral discards 2 Skill Cards.',
            choice1 : game => { //puzzle -> will if or else run ^.-
                if (game.getNukesRemaining()===0) {
                    game.narrateAll('No nukes remaining');
                    game.choose(CrisisMap.BUILD_CYLON_DETECTOR.choose);
                }
                else {
                    game.addNukesRemaining(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                }
            },
            choice2 : game => game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                };
                next.addMorale(-1);
                next.singlePlayerDiscards(WhoEnum.ADMIRAL, 2);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    ANALYZE_ENEMY_FIGHTER : {
        name : 'Analyze Enemy Fighter',
        text : "I don't know how Starbuck got this thing moving, much less flew it. - Galen Tyrol",
        graphic : "BSG_Crisis_Analyze_Fighter.png",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(7) PASS: Repair 1 destroyed raptor, FAIL: -1 population.',
            pass : game => {
                game.addRaptor(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addPopulation(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : "(T/E)(7) PASS: Repair 1 destroyed raptor, FAIL: -1 population (-OR-) " +
            "Roll a die. If 4 or lower, -1 population and the current player discards 2 Skill Cards.",
            choice1 : game => game.beforeSkillCheck(CrisisMap.ANALYZE_ENEMY_FIGHTER.skillCheck),
            choice2 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.narrateAll(`a ${roll} was rolled, ${ roll < 5 ?
                        'you lose a population and current player discards 2 skill cards' : 'so nothing happens'}.`);
                    if (roll < 5) {
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                        game.addPopulation(-1);
                        game.singlePlayerDiscards(WhoEnum.CURRENT, 2);
                    } else game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT, 'If 4 or lower, lose 1 population and current player discards 2 skill cards.');
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    A_TRAITOR_ACCUSED : {
        name : 'A Traitor Accused',
        text : "I'm here to see that you're exposed and sentenced to death as the traitor you really are. -Miss Godfrey",
        graphic : "BSG_Crisis_A_Traitor_Accused.png",
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(7) PASS: no effect , FAIL: The current player chooses a character to send to the Brig.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => game.choose(CrisisMap.A_TRAITOR_ACCUSED.failChoice),
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : "(PO/L)(7) PASS: no effect , FAIL: The current player chooses a character to send to the" +
            " Brig (-OR-) The current player discards 5 Skill Cards.",
            choice1 : game => game.beforeSkillCheck(CrisisMap.A_TRAITOR_ACCUSED.skillCheck),
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                    };
                    next.singlePlayerDiscards(WhoEnum.CURRENT, 5);
                };
            },
        },
        failChoice : {
            who : WhoEnum.CURRENT,
            text : 'Choose who to send to the brig.',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
                game.sendPlayerToLocation(player, LocationEnum.BRIG);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    TERRORIST_BOMBER : {
        name : 'Terrorist Bomber',
        text : "Sir, we've found a Marine sentry dead new the small arms locker on C level. " +
        "The locker was entered and explosives were taken. - Hadrian",
        graphic : "BSG_Crisis_Terrorist_Bomber.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(9) PASS: no effect, FAIL: -1 morale and the current player is sent to sickbay.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    LOW_SUPPLIES : {
        name : 'Low Supplies',
        text : "Gonna be riots on those ships. Civilians don't like hearing they can't take a bath" +
        " or wash their clothes or drink more than a thimble a day. - Saul Tigh",
        graphic : "BSG_Crisis_Low_Supplies.png",
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(7) PASS: no effect, FAIL: -1 morale. If food is less than 6, -1 additional morale.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addMorale(game.getFood() < 6 ? -2 : -1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    AMBUSH : {
        name : 'Ambush',
        text : '1) Activate: basestars.<br>2) Setup: 1 basestar, 8 raiders, 2 vipers, and 3 civilian ships.<br>' +
        '3) Special Rule - <i>Training new Pilots:</i> Keep this card in play until the fleet jumps.' +
        ' Each unmanned viper suffers a -2 penalty to its attack rolls.',
        graphic : "BSG_Crisis_Ambush.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.setInPlay(InPlayEnum.AMBUSH);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.AMBUSH);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.AMBUSH,
    },
    //
    MANDATORY_TESTING : {
        name : 'Mandatory Testing',
        text : "I'd like you to call me the moment Commander Adama's test is complete. Will you do that? - Laura Roslin",
        graphic : "BSG_Crisis_Mandatory_Testing.png",
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : "(PO/L)(13)(9) PASS: The President looks at 1 random Loyalty Card of the current player, " +
            "MIDDLE: no effect, FAIL: -1 morale.",
            pass : game => {
                game.randomLoyaltyReveal(game.getCurrentPresident(), game.getCurrentPlayer());
                game.choose({
					who: WhoEnum.PRESIDENT,
					text: 'Loyalty',
					options: (next) => {
						return ["Continue"];
					},
					other: (next, text) => {
						next.nextAction=null;
						next.setLoyaltyShown(null);
						next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
					},
				});
            },
            middle : {
                value : 9,
                action : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            },
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    SECURITY_BREACH : {
        name : 'Security Breach',
        text : "There have been a string of security incidents aboard ship, sir." +
        " The water tank explosion, the discovery of explosives aboard a raptor and now this. - Hadrian",
        graphic : "BSG_Crisis_Security_Breach.png",
        skillCheck: {
            value : 6,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(6) PASS: no effect, FAIL: -1 morale and all characters in the "Command" location are sent to "Sickbay".',
            pass : game => game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.getPlayers()[x].location === LocationEnum.COMMAND)
                        game.sendPlayerToLocation(x, LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump: false,
        cylons: CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    SURROUNDED : {
        name : 'Surrounded',
        text : '1) Activate: basestars.<br>2) Setup: 1 basestar, 1 heavy raider, 7 raiders, 2 vipers, and 3 ' +
        'civilian ships.<br>3) Special Rule - <i>Panic:</i> The current player must discard 3 Skill Cards',
        graphic : "BSG_Crisis_Surrounded.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = third => {
                        third.nextAction = null;
                        third.endCrisis();
                    };
                    second.singlePlayerDiscards(WhoEnum.CURRENT,3);
                };
                next.activateCylons(CylonActivationTypeEnum.SURROUNDED);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                }
            });
        },
        jump : false,
        cylons: CylonActivationTypeEnum.SURROUNDED,
    },
    //
    RESCUE_MISSION_1 : {
        name : 'Rescue Mission',
        text : "Roger that, Boomer. Search and rescue ops are underway for Starbuck." +
        " Bring Hotdog in, the Old Man wants to talk to him. - Anastasia Dualla",
        graphic : "BSG_Crisis_Rescue_Mission.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 morale and the current player is sent to "Sickbay" (-OR-) -1 fuel and destroy 1 raptor.',
            choice1 : game  => {
                game.nextAction = null;
                game.addMorale(-1);
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = null;
                game.addFuel(-1);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump: true,
        cylons: CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    RESCUE_MISSION_2 : {
        name : 'Rescue Mission',
        text : "Roger that, Boomer. Search and rescue ops are underway for Starbuck." +
        " Bring Hotdog in, the Old Man wants to talk to him. - Anastasia Dualla",
        graphic : "BSG_Crisis_Rescue_Mission2.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 morale and the current player is sent to "Sickbay" (-OR-) -1 fuel and destroy 1 raptor.',
            choice1 : game  => {
                game.nextAction = null;
                game.addMorale(-1);
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = null;
                game.addFuel(-1);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    PRISONER_LABOR : {
        name : "Prisoner Labor",
        text : "They're going to work for their points and they're going to earn their freedom. - Lee Admama",
        graphic : "BSG_Crisis_Prison_Labor.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(10) PASS: no effect, FAIL: -1 morale, -1 food.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addMorale(-1);
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    CYLON_VIRUS : {
        name : 'Cylon Virus',
        text : "It's the virus, sir. I think it spawned copies of itself in some of our computer systems." +
        " It's knocked out main power and auxiliary units. - Felix Gaeta",
        graphic : "BSG_Crisis_Cylon_Virus.png",
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(13) PASS: no effect, FAIL: All characters in the "FTL Control" location' +
            ' are sent to "Sickbay". Then place 1 centurion marker at the start of the Boarding Party track.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS),
            fail : game => {
                for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.getPlayers()[x].location === LocationEnum.FTL_CONTROL)
                        game.sendPlayerToLocation(x, LocationEnum.SICKBAY);
                game.addCenturion(0,1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump: false,
        cylons: CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    CRIPPLED_RAIDER : {
        name : 'Crippled Raider',
        text : "Contact. Single Raider... same telltales. Seems to be flying in circles. - Felix Gaeta",
        graphic : "BSG_Crisis_Crippled_Raider.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(10) PASS: Increase the Jump Preparation track by 1, FAIL: -1 population.',
            pass : game => {
                game.addToFTL(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addPopulation(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/E)(10) PASS: Increase the Jump Preparation track by 1, FAIL: -1 population (-OR-) Roll a ' +
            'die. If 4 or lower, place 3 raiders in front of Galactica and 1 civilian ship behind it.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.CRIPPLED_RAIDER.skillCheck),
            choice2 : preGame => {
                preGame.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.narrateAll(`a ${roll} was rolled`);
                    if (roll < 5) {
                        game.nextAction = null;
                        game.activateCylons(CylonActivationTypeEnum.RESCUE_THE_FLEET);
                    }
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preGame.setUpRoll(8, WhoEnum.CURRENT,
                    'If 4 or lower, place 3 raiders in front of Galactica and 1 civilian ship behind it.');
            },
        },
        jump: true,
        cylons: CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    TACTICAL_STRIKE : {
        name : 'Tactical Strike',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 1 heavy raider, 5 raiders, 2 vipers, and ' +
        '3 civilian ships.<br>3) Special Rule - <i>Hanger Assault:</i> Damage 2 vipers in the reserves.',
        graphic : "BSG_Crisis_Tactical_Strike.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.damageVipersInHangar(2);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.TACTICAL_STRIKE);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.TACTICAL_STRIKE,
    },
    //
    BOARDING_PARTIES : {
        name : 'Boarding Parties',
        text : '1) Activate: heavy raiders.<br>2) Setup: 1 basestar, 4 heavy raider, 4 raiders, and 3 civilian' +
        ' ships.<br>3) Special Rule - <i>Surprise Assault:</i> There are no vipers in this setup.',
        graphic : "BSG_Crisis_Boarding_Parties.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = null;
                next.activateCylons(CylonActivationTypeEnum.BOARDING_PARTIES);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.BOARDING_PARTIES,
    },
    //
    HANGAR_ACCIDENT : {
        name : 'Hangar Accident',
        text : "Metal fatigue. Old equipment - cheap bit of metal snaps, drops a million" +
        " cubit drone to the deck, kills thirteen pilots and lands seven more in sick bay. - Hadrian",
        graphic : "BSG_Crisis_Hangar_Accident.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(10)(7) PASS: no effect, MIDDLE: -1 population, FAIL: -1 ' +
            'population and damage 2 vipers in the "Reserves".',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 7,
                action : game => {
                    game.addPopulation(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addPopulation(-1);
                game.damageVipersInHangar(2);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    DECLARE_MARTIAL_LAW : {
        name : 'Declare Martial Law',
        text : "The goverment cannot function under the current circumstances, I have decided to dissolve" +
        " the Quorum of Twelve. And as of this moment, I have declared martial law. - Saul Tigh",
        graphic : "BSG_Crisis_Declare_Marshal_Law.png",
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 morale, and the Admiral receives the President title (-OR-)' +
            ' -1 population and the Admiral discards 2 Skill Cards.',
            choice1 : game => {
                game.nextAction = null;
                game.addMorale(-1);
                if (game.getCurrentAdmiral() !== game.getCurrentPresident()){
                    game.narrateAll(`${game.getPlayers()[game.getCurrentPresident()].character.name
                        } has lost the presidency to ${game.getPlayers()[game.getCurrentAdmiral()].character.name}`);
                    game.setPresident(game.getCurrentAdmiral());
                } else game.narrateAll(game.getPlayers()[game.getCurrentAdmiral()].character.name +
                    ' is already president so nothing happens.');
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                    };
                };
                game.addPopulation(-1);
                game.singlePlayerDiscards(WhoEnum.ADMIRAL, 2);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    RESCUE_CAPRICA_SURVIVORS : {
        name : 'Rescue Caprica Survivors',
        text : "The Cylons have a plan for Caprica. But they haven't killed everyone. " +
        "I think our first order of business has to be planning a rescue mission back to Caprica. - Kara Thrace",
        graphic : "BSG_Crisis_Rescue_Cap_Survivors.png",
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 fuel, -1 food, +1 population (-OR-) -1 morale.',
            choice1 : game => {
                game.nextAction = null;
                game.addFuel(-1);
                game.addFood(-1);
                game.addPopulation(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            choice2 : game => {
                game.nextAction = null;
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    BESIEGED : {
        name : 'Besieged',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 1 heavy raider, 4 raiders, 2 vipers, and 3 civilian shi' +
        'ps.<br>3) Special Rule - <i>Heavy Casualties:</i> The 4 raiders that were just setup are immediately activated',
        graphic : "BSG_Crisis_Besieged.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.activateCylons(CylonActivationTypeEnum.POST_BESIEGED);
                };
                next.activateCylons(CylonActivationTypeEnum.BESIEGED);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.BESIEGED,
    },
    //
    TERRORIST_INVESTIGATION : {
        name : 'Terrorist Investigations',
        text : "I have appointed an independant tribunal to investigate the circumstances " +
        "surrounding the explosion. - Laura Roslin",
        graphic : "BSG_Crisis_Terrorist_Inv.png",
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(12)(6) PASS: Current player looks at 1 random Loyalty Card belonging ' +
            'to any player, MIDDLE: no effect, FAIL: -1 morale',
            pass: game => game.choose(CrisisMap.TERRORIST_INVESTIGATION.passChoice),
            middle : {
                value : 6,
                action : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            },
            fail : game => {
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        passChoice : {
            who : WhoEnum.CURRENT,
            text : "Who's random loyalty card would you like to see?",
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (game, player) => {
            	if (game.getActivePlayer()===player) {
                    game.narratePlayer(player, 'Not yourself!');
                    game.choose(CrisisMap.TERRORIST_INVESTIGATION.choice);
                }
                game.randomLoyaltyReveal(game.getCurrentPlayer(), player);
                game.choose({
					who: WhoEnum.CURRENT,
					text: 'Loyalty',
					options: (next) => {
						return ["Continue"];
					},
					other: (next, text) => {
						next.nextAction=null;
						next.setLoyaltyShown(null);
						next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
					},
				});
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    SCOUTING_FOR_WATER : {
        name : 'Scouting for Water',
        text : "There's panic in the air. If you don't find a source of water out there... - Lee Adama",
        graphic : "BSG_Crisis_Scouting_Water.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(9) PASS: +1 food, FAIL: -1 fuel and destroy 1 raptor.',
            pass : game => {
                game.addFood(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addFuel(-1);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/PI)(9) PASS: +1 food, FAIL: -1 fuel and destroy 1 raptor (-OR-) -1 food.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.SCOUTING_FOR_WATER.skillCheck),
            choice2 : game => {
                game.addFood(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    CRASH_LANDING : {
        name : 'Crash Landing',
        text : "Gotta put down, gotta put down, get this thing of the ground. Crashdown." +
        " Everybody get your masks on! - Crashdown",
        graphic : "BSG_Crisis_Crash_Landing.png",
        skillCheck : {
            value : 6,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(6) PASS: no effect, FAIL: The Admiral may spend 1 fuel. If he does not,' +
            ' -1 morale and the current player is sent to "Sickbay".',
            pass: game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            fail: game => game.choose(CrisisMap.CRASH_LANDING.failChoice),
        },
        failChoice : {
            who : WhoEnum.ADMIRAL,
            text : 'Spend 1 fuel (-OR-) -1 morale and the current player is sent to "Sickbay".',
            options: (next) => {
                return ["Spend 1 fuel","-1 morale, current player sent to sickbay"];
            },
            choice1 : game => {
                game.addFuel(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
            choice2 : game => {
                game.addMorale(-1);
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.SICKBAY);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    JAMMED_ASSAULT : {
        name : 'Jammed Assault',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 2 heavy raider, 4 raiders, 2 vipers,' +
        ' and 4 civilian ships.<br>3) Special Rule - <i>Communications Jamming:</i> Keep this card in play until ' +
        'the fleet jumps. Players may not activate the "Communications" location.',
        graphic : "BSG_Crisis_Jammed_Assault.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.setInPlay(InPlayEnum.JAMMED_ASSAULT);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.JAMMED_ASSAULT);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.JAMMED_ASSAULT,
    },
    //TODO for ERIC
    LEGENDARY_DISCOVERY : {
        name : 'Legendary Discovery',
        text : "... the aerial survey turned up evidence of at least one city on the surface. - Billy Keikeya",
        graphic : "BSG_Crisis_Leg_Discovery.png",
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(14) PASS: Place this card next to the Kobol Objective card. ' +
            'It counts as 1 distance, FAIL: -1 food and destroy 1 raptor.',
            pass : game => {
                //TODO ERIC
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
            fail : game => {
                game.addFood(-1);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    //
    CYLON_SWARM : {
        name : 'Cylon Swarm  ',
        text : '1) Activate: basestars.<br>2) Setup: 1 basestar, 1 heavy raider, 5 raiders, 2 vipers,' +
        ' and 3 civilian ships.<br>3) Special Rule - <i>Massive Deployment:</i> Keep this card in play until ' +
        'the fleet jumps. Each time a basestar launches raiders or heavy raiders, ' +
        'it launches 1 additional ship of the same type.',
        graphic : "BSG_Crisis_Cylon_Swarm.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.setInPlay(InPlayEnum.CYLON_SWARM);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.CYLON_SWARM);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                }
            });
        },
        jump : false,
        cylons : CylonActivationTypeEnum.CYLON_SWARM,
    },
    //
    SEND_SURVEY_TEAM : {
        name : 'Send Survey Team',
        text : "Frankly it's more efficient for me to gather my own initial samples. - Gaius Baltar",
        graphic : "BSG_Crisis_Send_Survey.png",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(15) PASS: no effect, FAIL: The current player is sent to "Sickbay" and destroy 1 raptor.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.sendPlayerToLocation(game.getCurrentPlayer(), LocationEnum.SICKBAY);
                game.addRaptor(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/PI/E)(15) PASS: no effect, FAIL: The current player is sent to "Sickbay" and destroy 1 raptor' +
            ' (-OR-) Roll a die. If 5 or less, -1 fuel',
            choice1 : game => game.beforeSkillCheck(CrisisMap.SEND_SURVEY_TEAM.skillCheck),
            choice2 : preRoll => {
                preRoll.afterRoll = game => {
                    let roll = game.roll;
                    game.setActiveRoll(roll);
                    game.addFuel(roll > 5 ? 0 : -1);
                    game.narrateAll(`a ${roll} was rolled and ${roll > 5 ? 'nothing happened' : '1 fuel was lost'}`);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                preRoll.setUpRoll(8, WhoEnum.CURRENT, 'If 5 or less, lose 1 fuel.');
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    LOSS_OF_A_FRIEND : {
        name : 'Loss of a Friend',
        text : "She was a vital, living person... aboard my ship for almost two years. " +
        "She couldn't have been just a machine. Could you love a machine? - William Adama",
        graphic : "BSG_Crisis_Loss_Friend.png",
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9)(7) PASS: no effect, MIDDLE: The current player discards 2 Skill Cards, ' +
            'FAIL: -1 morale and the current player discards 2 Skill Cards.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle: {
                value : 7,
                action : game => {
                    game.nextAction = next => {
                        next.nextAction = null;
                        next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                    };
                    game.singlePlayerDiscards(WhoEnum.CURRENT, 2);
                },
            },
            fail : game => {
                game.nextAction = next => {
                    next.nextAction = null;
                    next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                };
                game.addMorale(-1);
                game.singlePlayerDiscards(WhoEnum.CURRENT, 2);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    NETWORK_COMPUTERS : {
        name : 'Network Computers',
        text : "Colonel, you know the Old Man would never do this. No computer networks on his ship. - Kelly",
        graphic : "BSG_Crisis_Network_Computers.png",
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/T/E)(11) PASS: Increase the Jump Preparation track by 1, ' +
            'FAIL: -1 population and place 1 centurion marker at the start of the Boarding Party track',
            pass : game => {
                game.addToFTL(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addPopulation(-1);
                game.addCenturion(0,1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T/E)(11) PASS: Increase the Jump Preparation track by 1, FAIL: -1 population and' +
            ' place 1 centurion marker at the start of the Boarding Party track (-OR-)' +
            ' -1 population and decrease the Jump Preparation track by 1.',
            choice1 : game => game.beforeSkillCheck(CrisisMap.NETWORK_COMPUTERS.skillCheck),
            choice2 : game => {
                game.addPopulation(-1);
                game.addToFTL(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    FORCED_WATER_MINING : {
        name : 'Forced Water Mining',
        text : "You're going to tell your men to help us get that water off the moon. - Lee Adama",
        graphic : "BSG_Crisis_Forced_Water.png",
        skillCheck : {
            value : 17,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/L/T/E)(17) PASS: +1 food, FAIL: -1 population, -1 morale.',
            pass : game => {
                game.addFood(1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
            fail : game => {
                game.addPopulation(-1);
                game.addMorale(-1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T/E)(17) PASS: +1 food, FAIL: -1 population, -1 morale (-OR-)' +
            ' +1 food, -1 morale and each player discards 1 random Skill Card.',
            choice1: game => game.beforeSkillCheck(CrisisMap.FORCED_WATER_MINING.skillCheck),
            choice2: game => {
                game.addFood(1);
                game.addMorale(-1);
                for (let x = 0; x < game.getPlayers().length; x++)
                    game.discardRandomSkill(x);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    WITCH_HUNT : {
        name : 'Witch Hunt',
        text : "This morning a mob of men and women on one of the ships trapped a man they thought" +
        " was a cylon... and tore him physically limb from limb. - Laura Roslin",
        graphic : "BSG_Crisis_Witch_Hunt.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(10)(6) PASS: no effect, MIDDLE: -1 morale, FAIL: -1 morale. ' +
            'Current player chooses a character and moves him to "Sickbay".',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS),
            middle : {
                value : 6,
                action : game => {
                    game.addMorale(-1);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                },
            },
            fail : game => {
                game.addMorale(-1);
                game.choose({
                    who : WhoEnum.CURRENT,
                    text : 'Who gets sent to Sickbay?',
                    options: (next) => {
                        return next.getHumanPlayerNames();
                    },
                    player : (game, player) => {
                        game.nextAction = next => {
                            next.nextAction = null;
                            next.sendPlayerToLocation(player, LocationEnum.SICKBAY);
                            next.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                        };
                    }
                });
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //
    CYLON_TRACKING_DEVICE : {
        name : 'Cylon Tracking Device',
        text : "We're installing a Cylon transponder aboard your raptor. In theory it should" +
        " allow you to approach the baseship without being fired upon. - William Adama",
        graphic : "BSG_Crisis_Tracking_Device.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(10) PASS: no effect, FAIL: Destroy 1 raptor and place a basestar' +
            ' in front of Galactica and 2 civilian ships behind it.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            fail : game => {
                game.addRaptor(-1);
                game.nextAction = next => {
                    next.nextAction = null;
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                };
                game.activateCylons(CylonActivationTypeEnum.CYLON_TRACKING_DEVICE);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    UNIDENTIFIED_SHIP : {
        name : 'Unidentified Ship',
        text : "The Adriatic is in weapons range and she's got ship-to-ship missiles." +
        " Tom, that thing is moving fast. If we're going to shoot it down, we'd better shoot it down! - Meier",
        graphic : "BSG_Crisis_Unidentified_Ship.png",
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(10) PASS: no effect, FAIL: -1 population.',
            pass : game => game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS),
            fail : game => {
                game.addPopulation(-1);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
});

const SuperCrisisMap = Object.freeze({
    
    MASSIVE_ASSAULT : {
        name : 'Massive Assault',
        text : "1) Activate: heavy raiders, basestars" +
        "<br>2) Setup: 2 basestars, 1 heavy raider, 6 raiders, 2 vipers, and 4 civilian ships." +
        "<br>3) Special Rule - <i>Power Failure:</i> Move the fleet token 2 spaces towards" +
        " the start of the Jump Preparation track.",
        graphic:"BSG_S_Crisis_Massive_Assault.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    second.addToFTL(-2);
                    second.endCrisis();
                };
                next.activateCylons(CylonActivationTypeEnum.MASSIVE_ASSAULT);
            };
            game.choose({
                who : WhoEnum.ACTIVE,
                text : '',
                options: (next) => {
                    return ["Continue"];
                },
                other : (game, player) => {
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                }
            });
        },
    },
    
    INBOUND_NUKES : {
        name : 'Inbound nukes',
        text : "Spread out the fleet. No ship closer than five hundred clicks from any other ship." +
        " If there is a nuke, I want to limit the damage. - William Adama",
        graphic:"BSG_S_Crisis_Inbound_Nukes.png",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(15) PASS: no effect, FAIL: -1 fuel, -1 food, and -1 population',
            pass : game => game.endCrisis(),
            fail : game => {
            	game.addFuel(-1);
                game.addFood(-1);
                game.addPopulation(-1);;
                game.endCrisis()
            },
        },
    },
    
    CYLON_INTRUDERS : {
        name : 'Cylon Intruders',
        text : "If they succeed, they'll override the decompression safeties and vent us all into space. " +
        "Once we're all dead, they'll turn the ship's guns on the fleet and wipe it out, once and for all. - Saul Tigh",
        graphic:"BSG_S_Crisis_Cylon_Intrude.png",
        skillCheck : {
            value : 18,
            types : [SkillTypeEnum.LEADERSHIP ,SkillTypeEnum.TACTICS],
            text : '(L/T)(18)(14) PASS: no effect, MIDDLE: Place 1 centurion marker at the start of the Boarding Party track. ' +
            'FAIL: Damage Galactica and place 2 Centurion markers at the start of the Boarding Party track.',
            pass : game => {
                game.endCrisis();
            },
            middle : {
                value : 14,
                action : game => {
                	game.addCenturion(0,1);
                    game.endCrisis();
                }
            },
            fail : game => {
            	game.damageGalactica();
                game.addCenturion(0,2);
                game.endCrisis();
            },
        },
    },
    
    FLEET_MOBILIZATION : {
        name : 'Fleet Mobilization',
        text : "You know the drill, people. Scatter formation. keep'em off the civies and Don't stray" +
        " beyond the recovery line. - Lee Adama",
        graphic:"BSG_S_Crisis_Fleet_Mobile.png",
        skillCheck : {
            value : 24,
            types : [SkillTypeEnum.LEADERSHIP ,SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(L/T/PI/E)(24) PASS: Activate: basestars, launch raiders, ' +
            'FAIL: -1 morale and Activate: basestars, raiders, heavy raiders, launch raiders',
            pass : game => {
            	game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
            fail : game => {
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                game.activateCylons(CylonActivationTypeEnum.LAUNCH_RAIDERS);
            },
        },
    },
    
    BOMB_ON_COLONIAL_1 : {
        name : 'Bomb on Colonial 1',
        text : "We're running out of time. There's four minutes until your bomb goes off. I'm here" +
        " to tell you that this conflict between our people... it doesn't have to continue. - Laura Roslin",
        graphic:"BSG_S_Crisis_Bomb_Colonial_1.png",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(15) PASS: no effect, FAIL: -2 morale and all characters on Colonial One are sent ' +
            'to "Sickbay." Keep this card in play. Characters may not move to Colonial One for the rest of the game.',
            pass : game => {
                game.endCrisis();
            },
            fail : game => {
            	game.addMorale(-2);
            	for (let x = 0; x < game.getPlayers().length; x++)
                    if (game.isLocationOnColonialOne(game.getPlayers()[x].location))
                        game.sendPlayerToLocation(x, LocationEnum.SICKBAY);
                game.setInPlay(InPlayEnum.BOMB_ON_COLONIAL_1);
                game.endCrisis();
            },
        },
    },
    
});

const LoyaltyMap = Object.freeze({
    
    YOU_ARE_NOT_A_CYLON : {
        total : 10,
        name:"You are not a cylon",
        text : "Our tests indicate that you are not a Cylon, although you can never really know for sure...",
        graphic: "BSG_Loyalty_Not_Cylon.png",
        role : 'human',
    },
    
    YOU_ARE_A_SYMPATHIZER : {
        total : 1,
        name:"You are a Sympathizer",
        text : 'IMMEDIATELY REVEAL THIS CARD If at least 1 resource is half full or lower [red], ' +
        'you are moved to the brig. Otherwise, you become a revealed Cylon player. You do not receive a ' +
        'Super Crisis Card and may not activate the "Cylon Fleet" location.',
        graphic: "BSG_Loyalty_Sympathizer.png",
        action : game => {},//idk if this needs an action or just handle it in game its single case
        role : 'sympathizer',
    },
    
    YOU_ARE_A_CYLON_AARON : {
        total : 1,
        name:"You are a cylon",
        text : "CAN DAMAGE GALACTICA Action: Reveal this card. If you are not in the Brig," +
        " you may draw up to 5 Galactica damage tokens. Choose 2 of them to resolve and discard the others.",
        graphic: "BSG_Loyalty_Damage_Gal.png",
        action : game => {
            game.cylonDamageGalactica();
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_CYLON_BOOMER : {
        total : 1,
        name:"You are a cylon",
        text : "CAN SEND A CHARACTER TO SICKBAY Action: Reveal this card. If you are not in the Brig, " +
        'you may choose a character on Galactica. That character must discard 5 skill Cards and is moved to "Sickbay."',
        graphic: "BSG_Loyalty_Sickbay.png",
        action : game => {
            game.choose(LoyaltyMap.YOU_ARE_A_CYLON_BOOMER.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Who do you want to send to sickbay?',
            options: (next) => {
                let options=next.getHumanPlayerNames();
                options.push("Nobody");
                return options;
            },
            player : (game, player) => {
                let foundCharacter=false;
                for(let i=0;i<game.getPlayers().length;i++){
                    if(game.isLocationOnGalactica(game.getPlayers()[i].location)){
                        foundCharacter=true;
                        break;
                    }
                }
                if(!foundCharacter){
                    game.narrateAll("No players on Galactica to send to Sickbay");
                }else{
                    if (!isNaN(player) && player>=0 && player<game.getPlayers().length) {
                        game.narrateAll(game.getPlayers()[player].character.name + " was sent to Sickbay!");
                        game.sendPlayerToLocation(player, LocationEnum.SICKBAY);
                        game.nextAction = next => {
                            game.nextAction = null;
                            game.endCrisis();
                        };
                        game.singlePlayerDiscards(player, 5);
                    }else{
                        game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " decides not to send anyone to Sickbay");
                        game.endCrisis();
                    }
                }
            },
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_CYLON_SIX : {
        total : 1,
        name:"You are a cylon",
        text : "CAN SEND A CHARACTER TO THE BRIG Action: Reveal this card. If you are not in the Brig," +
        " you may choose a character on Galactica. Move that character to the 'BRIG'",
        graphic: "BSG_Loyalty_Brig.png",
        action : game => {
            game.choose(LoyaltyMap.YOU_ARE_A_CYLON_SIX.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Who do you want to send to the brig?',
            options: (next) => {
                let options=next.getHumanPlayerNames();
                options.push("Nobody");
                return options;
            },
            player : (game, player) => {
                console.log(player);
                
                let foundCharacter=false;
                for(let i=0;i<game.getPlayers().length;i++){
                    if(game.isLocationOnGalactica(game.getPlayers()[i].location)){
                        foundCharacter=true;
                    }
                }
                if(!foundCharacter){
                    game.narrateAll("No players on Galactica to send to the Brig");
                }else{
                    if (!isNaN(player) && player>=0 && player<game.getPlayers().length) {
                        game.narrateAll(game.getPlayers()[player].character.name + " was sent to the Brig!");
                        game.sendPlayerToLocation(player, LocationEnum.BRIG);
                    }else{
                        game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " decides not to send anyone to the Brig");
                    }
                }
                game.endCrisis();
            },
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_CYLON_LEOBEN : {
        total : 1,
        name:"You are a cylon",
        text : "CAN REDUCE MORALE BY ONE Action: Reveal this card. If you are not in the Brig, " +
        'you may reduce moral by 1."',
        graphic: "BSG_Loyalty_Morale.png",
        action : game => {
            game.choose(LoyaltyMap.YOU_ARE_A_CYLON_LEOBEN.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Lower Morale by 1 (-OR-) Don\'t lower Morale',
            options: (next) => {
                return ["Lower Morale","Do Nothing"];
            },
            choice1 : game => {
                game.addMorale(-1);
                game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name+" lowers morale by 1!");
                game.endCrisis();
            },
            choice2 : game => {
                game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name+" decides not to lower morale");
                game.endCrisis();
            },
        },
        role : 'cylon',
    },
    
});

const CharacterMap = Object.freeze({
    LADAMA: {
        name:"Lee Adama",
        characterGraphic:"Chars_Lee_Adama.png",
        pieceGraphic:"Player_Piece_Lee_Adama.png",
        pilotGraphic:"BSG_pilot_token_Apollo.png",
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
        
        *CAG - Action:
            Once per game, you may activate up to 6 unmanned vipers.
        
        *-Headstrong:
            When you are forced to discard Skill Cards, you must discard randomly.
        */
        
    },
    
    BADAMA: {
        name:"William Adama",
        characterGraphic:"Chars_Bill_Adama.png",
        pieceGraphic:"PlayerPiece_Bill_Adama.png",
        type:CharacterTypeEnum.MILITARY_LEADER,
        skills:{
            Leadership:3,
            Tactics:2,
        },
        startLocation:LocationEnum.ADMIRALS_QUARTERS,
        /*
        *Inspirational Leader:
            When you draw a Crisis Card, all 1 strength Skill Cards count positive for
             the skill check
     
        Command Authority:
             Once per game, after resolving a skill check, instead of discarding the used
             Skill Cards, draw them into your hand.
     
        *Emotionally Attached:
             You may not activate the "Admiral's Quarters" location.
        */
    },
    
    BALTAR:{
        name:"Gaius Baltar",
        characterGraphic:"Chars_Baltar.png",
        pieceGraphic:"PlayerPiece_Baltar.png",
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            Politics:2,
            Leadership:1,
            Engineering:1,
        },
        startLocation:LocationEnum.RESEARCH_LAB,
        oncePerGame: game => {
        	game.choose({
				who : WhoEnum.ACTIVE,
				text : 'Who\'s loyalty do you want to reveal?',
				options: (next) => {
					return next.getHumanPlayerNames();
				},
				player : (next, player) => {
					if (next.getActivePlayer()===player) {
						next.narratePlayer(player, 'Not yourself!');
						CharacterMap.BALTAR.oncePerGame(next);
						return;
					}
					next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name +
						" looks at "+next.getPlayers()[player].character.name+" loyalty cards");
					next.fullLoyaltyReveal(next.getCurrentPlayer(), player);
					next.choose({
						who: WhoEnum.ACTIVE,
						text: 'Loyalty',
						options: (next) => {
							return ["Continue"];
						},
						other: (next, text) => {
							next.nextAction=null;
							next.setLoyaltyShown(null);
							next.setPhase(GamePhaseEnum.MAIN_TURN);
							next.doPostAction();
						},
					});
				}
			});
		},
        /*
        Delusional Intuition:
            After you draw a Crisis Card, draw 1 Skill Card of your choice (it may be
             from outside your skill set).
         
        Cylon Detector - Action:
            Once per game, you may look at all Loyalty Cards belonging to another player.
         
        *Coward:
            You start the game with 2 loyalty Cards (instead of 1).
        */
    },
    
    TYROL:{
        name:'"Chief" Galen Tyrol',
        characterGraphic:"Chars_Galen_Tyrol.png",
        pieceGraphic:"PlayerPiece_Galen.png",
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
         
        *Reckless:
            Your hand limit is 8 (instead of 10).
        */
    },
    
    THRACE:{
        name:'Kara "Starbuck" Thrace',
        characterGraphic:"Chars_Kara_Thrace.png",
        pieceGraphic:"PlayerPiece_Starbuck.png",
        pilotGraphic:"BSG_pilot_token_Starbuck.png",
        type:CharacterTypeEnum.PILOT,
        skills:{
            Tactics:2,
            Piloting:2,
            LeadershipEngineering:1,
        },
        startLocation: LocationEnum.HANGAR_DECK,
        /*
        *Expert Pilot:
            When you start your turn piloting a viper, you may take 2 actions during
            your Action Step (instead of 1).
         
        Secret Destiny:
            Once per game, immediately after a Crisis Card is revealed, discard it
            and draw a new one.
         
        *Insubordinate:
            When a player chooses you with the "Admiral's Quarters" location,
            reduce the difficulty by 3.
        */
    },
    
    AGATHON: {
        name: 'Karl "Helo" Agathon',
        characterGraphic:"Chars_Karl_Agathon.png",
        pieceGraphic:"PlayerPiece_Helo.png",
        pilotGraphic:"BSG_pilot_token_Helo.png",
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
        characterGraphic:"Chars_Laura_Roslin.png",
        pieceGraphic:"PlayerPiece_Laura_Roslin.png",
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            Politics:3,
            Leadership:2,
        },
        startLocation: LocationEnum.PRESIDENTS_OFFICE,
        oncePerGame: game => {
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 4 quorum cards");
            game.setHiddenQuorum([
            	game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]),
            	game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]),
            	game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]),
            	game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]),
            ]);
            CharacterMap.ROSLIN.oncePerGameChoice(game);
		},
		oncePerGameChoice: game => {
			game.choose({
				who : WhoEnum.ACTIVE,
				text : 'Play which quorum card?',
				options: (next) => {
					return [
						game.readCard(next.getHiddenQuorum()[0]).name,
						game.readCard(next.getHiddenQuorum()[1]).name,
						game.readCard(next.getHiddenQuorum()[2]).name,
						game.readCard(next.getHiddenQuorum()[3]).name,						
					];
				},
				other : (next,card) => {
					next.nextAction=null;
					next.getQuorumHand().push(next.getHiddenQuorum()[card]);
					if(next.playQuorumCard(next.getQuorumHand().length-1)){
						for(let i=0;i<next.getHiddenQuorum().length;i++){
							if(i!==card){
								next.getDecks()[DeckTypeEnum.QUORUM].discard.push(next.getHiddenQuorum()[i]);
							}
						}
						next.setHiddenQuorum([]);
						return;
					}else{
						CharacterMap.ROSLIN.oncePerGameChoice(next);
					}
				},
			});			
		}
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
        characterGraphic:"Chars_Sharon_Valerii.png",
        pieceGraphic:"PlayerPiece_Boomer.png",
        pilotGraphic:"BSG_pilot_token_Boomer.png",
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
         
        *Sleeper Agent:
            During the Sleeper Agent Phase, you are dealt 2 Loyalty Cards
            (instead of 1) and then moved to the "brig" location.
         */
    },
    
    TIGH:{
        name:'Saul Tigh',
        characterGraphic:"Chars_Soal_Tigh.png",
        pieceGraphic:"PlayerPiece_Tigh.png",
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
         
        *Declare Martial Law - Action:
             Once per game, give the President title to the Admiral.
         
        *Alcoholic:
            At the start of any player's turn, if you have exactly 1 Skill
            Card in your hand, you must discard it.
        */
    },
    
    ZAREK:{
        name:'Tom Zarek',
        characterGraphic:"Chars_Tom_Zarek.png",
        pieceGraphic:"PlayerPiece_Tom_Zarek.png",
        type:CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            Politics:2,
            Leadership:2,
            Tactics:1,
        },
        startLocation: LocationEnum.ADMINISTRATION,
        oncePerGame: game => {
        	game.choose({
				who : WhoEnum.ACTIVE,
				text : 'What resource do you want to raise?',
				options: (next) => {
					return ["Fuel","Food","Morale"];
				},
				other : (next, resource) => {
					if(next<0||next>2){
						CharacterMap.ZAREK.oncePerGame(next);
						return;
					}
					switch (resource) {
						case 0:
							next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name +
						" lowers the population to increase fuel!");
							next.addFuel(1);
							break;
						case 1:
							next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name +
						" lowers the population to increase food!");
							next.addFood(1);
							break;
						case 2:
							next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name +
						" lowers the population to increase morale!");
							next.addMorale(1);
							break;
						default:
							break;
					}
					next.nextAction=null;
					next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name +
						" lowers the population to increase fuel!");
					next.addPopulation(-1);
					next.setPhase(GamePhaseEnum.MAIN_TURN);
					next.doPostAction();
				}
			});
		},
        /*
        Friends in Low Places:
             When a player activates the "Administration" or the "Brig" location,
             you may choose to reduce or increase the difficulty by 2.
         
        Unconventional Tactics - Action:
             Once per game, lose 1 population to gain 1 of any other resource type.
         
        *Convicted Criminal:
             You may not activate locations occupied by other characters (except the "brig").
        */
    },
    
});

const SkillCardMap = Object.freeze({
    
    /*
        REPAIR:
            Repair your current location, or if you are in the
            hanger deck location, you may repair up to 2 damaged vipers.
    */
    
    REPAIR_1:{
        name:"Repair",
        graphic:"BSG_Skill_Eng_Repair_1.png",
        type:SkillTypeEnum.ENGINEERING,
        value:1,
        total:8,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    REPAIR_2:{
        name:"Repair",
        graphic:"BSG_Skill_Eng_Repair_2.png",
        type:SkillTypeEnum.ENGINEERING,
        value:2,
        total:6,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    /*
        SCIENTIFIC RESEARCH:
            Play before cards are added to a skill check.
            All engineering cards in the skill check count as positive strength.
    */
    
    RESEARCH_3:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_3.png",
        type:SkillTypeEnum.ENGINEERING,
        value:3,
        total:4,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    RESEARCH_4:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_4.png",
        type:SkillTypeEnum.ENGINEERING,
        value:4,
        total:2,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    RESEARCH_5:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_5.png",
        type:SkillTypeEnum.ENGINEERING,
        value:5,
        total:1,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        EXECUTIVE ORDER - action:
            Choose any other player. He may move his character and then take 1 action OR not move and take 2 actions.
            Limit of 1 Executive Order card used per turn.
    */
    
    XO_1:{
        name:"XO",
        graphic:"BSG_Skill_Led_XO_1.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:1,
        total:8,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    XO_2:{
        name:"XO",
        graphic:"BSG_Skill_Led_XO_2.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:2,
        total:6,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    /*
        DECLARE EMERGENCY:
            Play after Strength is totaled in a skill check to reduce its difficulty by 2.
            Limit of 1 Declare emergency card per skill check.
    */
    
    EMERGENCY_3:{
        name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_3.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:3,
        total:4,
        playTime : SkillPlayTimeEnum.AFTER_SKILL_CHECK,
    },
    
    EMERGENCY_4:{
        name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_4.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:4,
        total:2,
        playTime : SkillPlayTimeEnum.AFTER_SKILL_CHECK,
    },
    
    EMERGENCY_5:{
        name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_5.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:5,
        total:1,
        playTime : SkillPlayTimeEnum.AFTER_SKILL_CHECK,
    },
    
    /*
        EVASIVE MANEUVERS:
            Play after any viper is attacked to reroll the die.
            If the viper is piloted, subtract 2 from the roll.
    */
    
    EVASIVE_1:{
        name:"Evasive",
        graphic:"BSG_Skill_Pil_Evasive_1.png",
        type:SkillTypeEnum.PILOTING,
        value:1,
        total:8,
        playTime : SkillPlayTimeEnum.AFTER_VIPER_ATTACKED,
    },
    
    EVASIVE_2:{
        name:"Evasive",
        graphic:"BSG_Skill_Pil_Evasive_2.png",
        type:SkillTypeEnum.PILOTING,
        value:2,
        total:6,
        playTime : SkillPlayTimeEnum.AFTER_VIPER_ATTACKED,
    },
    
    /*
        MAXIMUM FIREPOWER - action:
            Play while piloting a viper to attack up to 4 times.
    */
    
    FIREPOWER_3:{
        name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_3.png",
        type:SkillTypeEnum.PILOTING,
        value:3,
        total:4,
        playTime : SkillPlayTimeEnum.VIPER,
        
    },
    
    FIREPOWER_4:{
        name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_4.png",
        type:SkillTypeEnum.PILOTING,
        value:4,
        total:2,
        playTime : SkillPlayTimeEnum.VIPER,
    },
    
    FIREPOWER_5:{
        name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_5.png",
        type:SkillTypeEnum.PILOTING,
        value:5,
        total:1,
        playTime : SkillPlayTimeEnum.VIPER,
    },
    
    /*
        CONSOLIDATE POWER - action:
            Draw 2 Skill Cards of any type(s). They may be outside your skill set.
    */
    
    CONSOLIDATE_1:{
        name:"Consolidate",
        graphic:"BSG_Skill_Pol_Con_Power_1.png",
        type:SkillTypeEnum.POLITICS,
        value:1,
        total:8,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    CONSOLIDATE_2:{
        name:"Consolidate",
        graphic:"BSG_Skill_Pol_Con_Power_2.png",
        type:SkillTypeEnum.POLITICS,
        value:2,
        total:6,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    /*
        INVESTIGATIVE COMMITTEE:
            Play before cards are added to a Skill Check. All Skill Cards are played
            faceup during this Skill Check (excluding those from the Destiny deck).
    */
    
    COMMITTEE_3:{
        name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_3_old.png",
        type:SkillTypeEnum.POLITICS,
        value:3,
        total:4,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    COMMITTEE_4:{
        name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_4_old.png",
        type:SkillTypeEnum.POLITICS,
        value:4,
        total:2,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    COMMITTEE_5:{
        name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_5_old.png",
        type:SkillTypeEnum.POLITICS,
        value:5,
        total:1,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        LAUNCH " - action:
            Risk 1 raptor to roll a die. If 3 or higher, look at the top card of the Crisis or Destination deck
             and place it on top or bottom. Otherwise destroy 1 raptor.
    */
    
    SCOUT_1:{
        name:"Launch Scout",
        graphic:"BSG_Skill_Tac_Launch_Scout_1.png",
        type:SkillTypeEnum.TACTICS,
        value:1,
        total:8,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    SCOUT_2:{
        name:"Launch Scout",
        graphic:"BSG_Skill_Tac_Launch_Scout_2.png",
        type:SkillTypeEnum.TACTICS,
        value:2,
        total:6,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    /*
        STRATEGIC PLANNING:
            Play before any die roll to add 2 to the result. Limit of 1 Strategic planning card used per roll.
    */
    
    PLANNING_3:{
        name:"Planning",
        graphic:"BSG_Skill_Tac_Strat_3.png",
        type:SkillTypeEnum.TACTICS,
        value:3,
        total:4,
        playTime : SkillPlayTimeEnum.BEFORE_DIE_ROLL,
    },
    
    PLANNING_4:{
        name:"Planning",
        graphic:"BSG_Skill_Tac_Strat_4.png",
        type:SkillTypeEnum.TACTICS,
        value:4,
        total:2,
        playTime : SkillPlayTimeEnum.BEFORE_DIE_ROLL,
    },
    
    PLANNING_5:{
        name:"Planning",
        graphic:"BSG_Skill_Tac_Strat_5.png",
        type:SkillTypeEnum.TACTICS,
        value:5,
        total:1,
        playTime : SkillPlayTimeEnum.BEFORE_DIE_ROLL,
    },
    
});

const LocationMap = Object.freeze({
    //Colonial One
    PRESS_ROOM : {
        name : "Press Room",
        area : "colonial",
        enum : LocationEnum.PRESS_ROOM,
        text : 'Action: Draw 2 politics Skill Cards.',
        action : game => {
            //Move here from server eventually
        },
    },
    
    PRESIDENTS_OFFICE : {
        name : "Presidents Office",
        area : "colonial",
        enum : LocationEnum.PRESIDENTS_OFFICE,
        text : "Action: If you are President, draw 1 Quorum Card. " +
        "You may then draw 1 additional Quorum Card or play 1 from your hand.",
        action : game => {
            game.getQuorumHand().push(game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]));
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates " +
                LocationEnum.PRESIDENTS_OFFICE);
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws a quorum card");
            game.narratePlayer(game.getActivePlayer(), "You drew "+game.readCard(game.getQuorumHand()[game.getQuorumHand().length-1]).name);
            game.setHiddenQuorum([game.getQuorumHand()[game.getQuorumHand().length-1]]);
            game.choose(LocationMap.PRESIDENTS_OFFICE.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Play drawn card or draw another?',
            options: (next) => {
                return ["Play","Draw"];
            },
            choice1 : next => {
            	next.nextAction=null;
                next.setHiddenQuorum([]);
                if(next.playQuorumCard(next.getQuorumHand().length-1)){
                	return;
                }else{
                	next.choose(LocationMap.PRESIDENTS_OFFICE.choice);
                }
            },
            choice2 : next => {
            	next.nextAction=null;
                next.getQuorumHand().push(next.drawCard(next.getDecks()[DeckTypeEnum.QUORUM]));
                next.setHiddenQuorum([next.getQuorumHand()[next.getQuorumHand().length-1]]);
                next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name + " draws another quorum card");
                next.narratePlayer(next.getActivePlayer(), "You drew "+next.readCard(next.getQuorumHand()[next.getQuorumHand().length-1]).name);
                next.choose({
                    who : WhoEnum.ACTIVE,
                    text : '',
                    options: (second) => {
                        return ["Continue"];
                    },
                    other : (second, player) => {
                    	second.nextAction=null;
                        second.setHiddenQuorum([]);
                        second.setPhase(GamePhaseEnum.MAIN_TURN);
                        second.doPostAction();
                    }
                });
            },
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
                who : WhoEnum.ACTIVE,
                text : 'choose a player to try and give President to.',
                options: (next) => {
                    return next.getHumanPlayerNames();
                },
                player : (next, player) => {
                    next.nextAction = second => second.nextAction = null;
                    next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name+
                        " chooses "+next.getPlayers()[player].character.name);
                    let difficulty=5;
                	if(next.getInPlay().indexOf(InPlayEnum.ACCEPT_PROPHECY)!==-1){
                		next.narrateAll("Difficulty increased by 2 because "+
                			next.getPlayers()[player].character.name+" accepted prophecy");
						difficulty+=2;
					}
					let zarek=next.getPlayerByCharacterName(CharacterMap.ZAREK.name);
                    if(zarek!==-1&&!next.getPlayers()[zarek].isRevealedCylon){
						next.narrateAll(next.getPlayers()[zarek].character.name+" can use friends in low places");
						next.choose({
							who : zarek,
							text : 'Can use friends in low places',
							options: (next) => {
								return ["-2 Difficulty","+2 Difficulty","Nothing"];
							},
							other : (next, num) => {
								if(num===0){
									next.narrateAll(next.getPlayers()[zarek].character.name+" lowers difficulty by 2!");
									LocationMap.ADMINISTRATION.action2(next,player,difficulty-2);
								}else if(num===1){
									next.narrateAll(next.getPlayers()[zarek].character.name+" increases difficulty by 2!");
									LocationMap.ADMINISTRATION.action2(next,player,difficulty+2);
								}else{
									next.narrateAll(next.getPlayers()[zarek].character.name+" decides not to change the difficulty");
									LocationMap.ADMINISTRATION.action2(next,player,difficulty);
								}
							}
						})
						return;
					}
                    LocationMap.ADMINISTRATION.action2(game,player,difficulty);  
                },
            });
        },
        action2 : (game,player,difficulty) => {
        	game.beforeSkillCheck({
				value : difficulty,
				types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
				text : `(PO/L)(${difficulty}) PASS: ${game.getPlayers()[player].character.name
					} becomes president, FAIL: nothing happens.`,
				pass : next => {
					next.setPresident(player);
					next.addToActionPoints(-1);
					next.doPostAction();
				},
				fail : next => next.doPostAction(),
			});
        },
    },
    
    //Cylon Locations
    CAPRICA : {
        name : "Caprica",
        area : "cylon",
        enum : LocationEnum.CAPRICA,
        text : 'Action: Play your super Crisis Card or draw 2 Crisis Cards, choose 1 to resolve and discard the other.' +
        '<br><b>No Activate Cylon Ships or Prepare for Jump steps.</b>',
        action : game => {
            game.choose(LocationMap.CAPRICA.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Play drawn card or draw another?',
            options: (next) => {
                return ["Play Super Crisis","Draw 2 Crisis"];
            },
            choice1 : game => {
            	if(game.getPlayers()[game.getActivePlayer()].superCrisisHand.length===0){
            		game.narratePlayer(game.getActivePlayer(), "You don't have a super crisis card");
            		game.choose(LocationMap.CAPRICA.choice);
            	}
            	game.addToActionPoints(-1);
				let card=game.getPlayers()[game.getActivePlayer()].superCrisisHand[0];
				game.getPlayers()[game.getActivePlayer()].superCrisisHand.splice(0,1);
				game.playSuperCrisis(card);
            },
            choice2 : game => {
            	let cardOne = game.drawCard(game.getDecks()[DeckTypeEnum.CRISIS]);
            	let cardTwo = game.drawCard(game.getDecks()[DeckTypeEnum.CRISIS]);
				game.setCrisisOptions([cardOne,cardTwo]);
				for(let i=0;i<game.getPlayers().length;i++){
					game.sendGameState(i);
				}
				game.choose({
					who : WhoEnum.ACTIVE,
					text : "Play which crisis?",
					private : `IMPORTANT CONFIDENTIAL DOCUMENTS`,
					options: next => [next.readCard(cardOne).name,next.readCard(cardTwo).name],
					choice1 : next => {
						next.playCrisis(next.getCrisisOptions()[0]);
						next.getDecks()[DeckTypeEnum.CRISIS].discard.push(next.getCrisisOptions()[0]);
						next.setCrisisOptions(null);
					},
					choice2 : next => {
						next.playCrisis(next.getCrisisOptions()[1]);
						next.getDecks()[DeckTypeEnum.CRISIS].discard.push(next.getCrisisOptions()[1]);
						next.setCrisisOptions(null);
					},
				});
            },
        },
    },
    
    CYLON_FLEET : {
        name : "Cylon Fleet",
        area : "cylon",
        enum : LocationEnum.CYLON_FLEET,
        text : "Action: Activate all Cylon ship[s of one type, or launch 2 raiders and" +
        " 1 heavy raider from each basestar.",
        action : game => {
            game.addToActionPoints(-1);
            game.choose(LocationMap.CYLON_FLEET.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'What would you like to activate?',
            options: (next) => {
                return ["Basestars","Raiders","Heavy Raiders","Launch Ships"];
            },
            other : (game, text) => {
            	console.log(text);
                switch (text) {
                    case 0:
                    	game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates Basestars!");
                    	game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                    	break;
                    case 1:
                    	game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates Raiders!");
                    	game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                    	break;
                    case 2:
                    	game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates Heavy Raiders!");
                    	game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                    	break;
                    case 3:
                    	game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " launches ships!");
                    	game.activateCylons(CylonActivationTypeEnum.CYLON_FLEET);
                    	break;
                    default:
                        game.choose(LocationMap.CYLON_FLEET.choice);
                        break;
                }
            },
        },
    },
    
    HUMAN_FLEET : {
        name : "Human Fleet",
        area : "cylon",
        enum : LocationEnum.HUMAN_FLEET,
        text : "Action: Look at any player's hand and steal 1 skill Card " +
        "[place it in your hand]. Then roll a die and if 5 or higher damage Galactica.",
        action : game => {
            game.choose({
                who : WhoEnum.ACTIVE,
                text : 'Choose a player to steal from',
                options: (next) => {
                    return next.getHumanPlayerNames();
                },
                player : (next, player) => {
                    
                },
            });
        },
    },
    
    RESURRECTION_SHIP : {
        name : "Resurrection Ship",
        area : "cylon",
        enum : LocationEnum.RESURRECTION_SHIP,
        text : "Action: You may discard your Super Crisis Card to draw a new one. Then if distance" +
        " is 7 or less, give your unrevealed loyalty card(s) to any player.",
        action : game => {
            game.addToActionPoints(-1);
            if(game.getPlayers()[game.getActivePlayer()].superCrisisHand.length>0){
                game.choose(LocationMap.RESURRECTION_SHIP.choice1);
            }else{
                game.narratePlayer(game.getActivePlayer(), "You don't have a super crisis card");
                if(game.getDistanceTrack()<=7){
                	game.choose(LocationMap.RESURRECTION_SHIP.choice2);
                }else{
                	game.narratePlayer(next.getActivePlayer(), "Distance traveled is too far to give loyalty");
                    game.setPhase(GamePhaseEnum.MAIN_TURN);
                }
            }
        },
        choice1 : {
            who : WhoEnum.ACTIVE,
            text : 'Keep your super crisis or discard for a new one?',
            options: (next) => {
                return ["Keep","Discard"];
            },
            other : (next, choice) => {
                next.nextAction = null;
                if(choice===0){
                    next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name + " keeps super crisis card");
                }else{
                    next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name + " discards super crisis card for a new one");
                    next.getDecks()[DeckTypeEnum.SUPER_CRISIS].discard.push(next.getPlayers()[next.getActivePlayer()].superCrisisHand[0]);
                    next.getPlayers()[next.getActivePlayer()].superCrisisHand=[];
                    next.getPlayers()[next.getActivePlayer()].superCrisisHand.push(next.getDecks()[DeckTypeEnum.SUPER_CRISIS].deck.pop());
                    next.narratePlayer(next.getActivePlayer(), "You drew "+next.readCard(next.getPlayers()[next.getActivePlayer()].superCrisisHand[0]).name);
                }
                if(next.getPlayers()[next.getActivePlayer()].loyalty.length>0){
                	if(next.getDistanceTrack()<=7){
						next.choose(LocationMap.RESURRECTION_SHIP.choice2);
					}else{
						next.narratePlayer(next.getActivePlayer(), "Distance traveled is too far to give loyalty");
						next.setPhase(GamePhaseEnum.MAIN_TURN);
					}
                    next.choose(LocationMap.RESURRECTION_SHIP.choice2);
                }else{
                    next.narratePlayer(next.getActivePlayer(), "You don't have any unrevealed loyalty cards");
                    next.setPhase(GamePhaseEnum.MAIN_TURN);
                }
            },
        },
        choice2 : {
            who : WhoEnum.ACTIVE,
            text : 'Choose a player to give unrevealed loyalty cards to',
            options: (next) => {
                return next.getHumanPlayerNames();
            },
            player : (next, player) => {
            	next.fullLoyaltyReveal(player,next.getActivePlayer());
				next.choose({
					who: WhoEnum.ACTIVE,
					text: 'Loyalty',
					options: (second) => {
						return ["Continue"];
					},
					other: (second, text) => {
						second.nextAction = null;
						second.setLoyaltyShown(null);
						second.narrateAll(second.getPlayers()[second.getActivePlayer()].character.name+
							" gives unrevealed loyalty cards to "+second.getPlayers()[player].character.name);
						for(let i=0;i<second.getPlayers()[second.getActivePlayer()].loyalty.length;i++){
							second.getPlayers()[player].loyalty.push(second.getPlayers()[second.getActivePlayer()].loyalty[i]);
						}
						second.getPlayers()[second.getActivePlayer()].loyalty=[];
						second.setPhase(GamePhaseEnum.MAIN_TURN);
					},
				});
            },
        },
    },
    
    //Galactica
    FTL_CONTROL : {
        name : "FTL Control",
        area : "galactica",
        enum : LocationEnum.FTL_CONTROL,
        text : "Action: Jump the fleet if the Jump Preparation track is not in the red zone. *Might lose population.",
        action : game => {
            //Move here from server eventually
        },
    },
    
    WEAPONS_CONTROL : {
        name : "Weapons Control",
        area : "galactica",
        enum : LocationEnum.WEAPONS_CONTROL,
        text : "Action: Attack 1 Cylon ship with Galactica.",
        action : game => {    
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates " + LocationEnum.WEAPONS_CONTROL);
            game.narratePlayer(game.getActivePlayer(), "Select a space location and a ship number");
            game.setPhase(GamePhaseEnum.WEAPONS_ATTACK);
        },
    },
    
    COMMUNICATIONS : {
        name : "Communications",
        area : "galactica",
        enum : LocationEnum.COMMUNICATIONS,
        text : "Action: Look at the back of 2 civilian ships. You may then move them to adjacent area(s)",
        action : game => {
            //Move here from server eventually
        },
    },
    
    RESEARCH_LAB : {
        name : "Research Lab",
        area : "galactica",
        enum : LocationEnum.RESEARCH_LAB,
        text : "Action: Draw 1 engineering or 1 tactics Skill Card.",
        action : game => {
            //Move here from server eventually
        },
    },
    
    COMMAND : {
        name : "Command",
        area : "galactica",
        enum : LocationEnum.COMMAND,
        text : "Action: Activate up to 2 unmanned vipers.",
        action : game => {
            //Move here from server eventually
        },
    },
    
    ADMIRALS_QUARTERS : {
        name : "Admirals Quarters",
        area : "galactica",
        enum : LocationEnum.ADMIRALS_QUARTERS,
        text : "Choose a character, then pass this skill check to send him to the Brig. (L/T)(7)",
        action : game => {
            game.choose({
                who : WhoEnum.ACTIVE,
                text : 'choose a player to try to send to the Brig',
                options: (next) => {
                    return next.getHumanPlayerNames();
                },
                player : (next, player) => {
                    next.nextAction = second => second.nextAction = null;
                    next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name+
                        " chooses "+next.getPlayers()[player].character.name);
                    next.admiralsQuartersDifficulty=7;
                	if(next.getCurrentPresident()===player&&next.getInPlay().indexOf(InPlayEnum.ACCEPT_PROPHECY)!==-1){
                		next.narrateAll("Difficulty increased by 2 because "+
                			next.getPlayers()[player].character.name+" accepted prophecy");
						next.admiralsQuartersDifficulty+=2;
					}
                    if(next.getPlayers()[player].character.name===CharacterMap.THRACE.name){
                        next.narrateAll(CharacterMap.THRACE.name+
                            " gets -2 from insubordination!");
                        next.admiralsQuartersDifficulty-=2;
                    }
                    let tigh=next.getPlayerByCharacterName(CharacterMap.TIGH.name);
                    let zarek=next.getPlayerByCharacterName(CharacterMap.ZAREK.name);
                    if((tigh!==-1&&!next.getPlayers()[tigh].isRevealedCylon)&&(zarek!==-1&&!next.getPlayers()[zarek].isRevealedCylon)){
						let checkPlayer=next.getActivePlayer()+1;
						if(checkPlayer>=next.getPlayers().length){
							checkPlayer=0;
						}
						for(let i=0;i<next.getPlayers().length;i++){
							if(checkPlayer+i>=next.getPlayers().length){
								checkPlayer-=next.getPlayers().length;
							}
							if(next.getPlayers()[checkPlayer].character.name===CharacterMap.TIGH.name){
								LocationMap.ADMIRALS_QUARTERS.checkTigh(next,player,true);
								return;
							}else if(next.getPlayers()[checkPlayer].character.name===CharacterMap.ZAREK.name){
								LocationMap.ADMIRALS_QUARTERS.checkZarek(next,player,true);
								return;
							}
						}
					}else if(tigh!==-1&&!next.getPlayers()[tigh].isRevealedCylon){
						LocationMap.ADMIRALS_QUARTERS.checkTigh(next,player,false);
						return;
					}else if(zarek!==-1&&!next.getPlayers()[zarek].isRevealedCylon){
						LocationMap.ADMIRALS_QUARTERS.checkZarek(next,player,false);
						return;
					}
                    LocationMap.ADMIRALS_QUARTERS.action2(next,player);  
                },
            });
        },
        checkTigh : (game,player,needToCheckZarek) => {
        	let tigh=game.getPlayerByCharacterName(CharacterMap.TIGH.name);
        	game.narrateAll(game.getPlayers()[tigh].character.name+" can use cylon hatred");
			game.choose({
				who : tigh,
				text : 'Can use cylon hatred',
				options: (game) => {
					return ["-3 Difficulty","Nothing"];
				},
				other : (game, num) => {
					if(num===0){
						game.narrateAll(game.getPlayers()[tigh].character.name+" lowers difficulty by 3!");
						game.admiralsQuartersDifficulty-=3;
					}else{
						game.narrateAll(game.getPlayers()[tigh].character.name+" decides not to lower difficulty");
					}
					if(needToCheckZarek){
						LocationMap.ADMIRALS_QUARTERS.checkZarek(game,player,false);
					}else{
						LocationMap.ADMIRALS_QUARTERS.action2(game,player);
					}
				}
			})
			return;
        },
        checkZarek : (game,player,needToCheckTigh) => {
        	let zarek=game.getPlayerByCharacterName(CharacterMap.ZAREK.name);
        	game.narrateAll(game.getPlayers()[zarek].character.name+" can use friends in low places");
			game.choose({
				who : zarek,
				text : 'Can use friends in low places',
				options: (game) => {
					return ["-2 Difficulty","+2 Difficulty","Nothing"];
				},
				other : (game, num) => {
					if(num===0){
						game.narrateAll(game.getPlayers()[zarek].character.name+" lowers difficulty by 2!");
						game.admiralsQuartersDifficulty-=2;
					}else if(num===1){
						game.narrateAll(game.getPlayers()[zarek].character.name+" increases difficulty by 2!");
						game.admiralsQuartersDifficulty+=2;
					}else{
						game.narrateAll(game.getPlayers()[zarek].character.name+" decides not to change the difficulty");
					}
					if(needToCheckTigh){
						LocationMap.ADMIRALS_QUARTERS.checkTigh(game,player,false);
					}else{
						LocationMap.ADMIRALS_QUARTERS.action2(game,player);
					}
				}
			})
			return;
        },
        action2 : (game,player) => {
        	game.beforeSkillCheck({
				value : game.admiralsQuartersDifficulty,
				types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
				text : `(L/T)(${game.admiralsQuartersDifficulty}) PASS: ${game.getPlayers()[player].character.name
					} is sent to the Brig, FAIL: nothing happens.`,
				pass : next => {
					next.admiralsQuartersDifficulty=-1;
					next.sendPlayerToLocation(player, LocationEnum.BRIG);
					next.addToActionPoints(-1);
					next.doPostAction();
				},
				fail : next => next.doPostAction(),
			});
        },
    },
    
    HANGAR_DECK : {
        name : "Hangar Deck",
        area : "galactica",
        enum : LocationEnum.HANGAR_DECK,
        text : "Action: Launch yourself in a viper. You may then take 1 more action.",
        action : game => {
            //Move here from server eventually
        },
    },
    
    ARMORY : {
        name : "Armory",
        area : "galactica",
        enum : LocationEnum.ARMORY,
        text : "Action: Attack a centurion on the Boarding Party track [destroy on roll of 7-8].",
        action : game => {
            for(let i=0;i<game.getCenturionTrack().length;i++){
                if(game.getCenturionTrack()[i]>0){
                    game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name+" activates "+LocationEnum.ARMORY);
                    game.narratePlayer(game.getActivePlayer(), "Select a centurion on the boarding track");
                    game.setPhase(GamePhaseEnum.ATTACK_CENTURION);
                    return true;
                }
            }
            game.narratePlayer(game.getActivePlayer(), "No centurions on Galactica!");
        },
    },
    
    SICKBAY : {
        name : "Sickbay",
        area : "galactica",
        enum : LocationEnum.SICKBAY,
        text : "You may only draw 1 Skill Card during your Receive Skills step.",
        action : game => {
        	game.setUpPlayerSkillDraw(game.getCurrentPlayer(),1);
            game.choose(LocationMap.SICKBAY.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Choose skill card to draw',
            options: (game) => {
                return game.getSkillCardTypeNamesForPlayer(game.getCurrentPlayer());
            },
            other : (game, num) => {
                game.drawPlayerSkillCard(game.getCurrentPlayer(),num);
                game.setPhase(GamePhaseEnum.MAIN_TURN);
            }
        },
    },
    
    BRIG : {
        name : "Brig",
        area : "galactica",
        enum : LocationEnum.BRIG,
        text : "You may not move, draw Crisis Cards, or add more than 1 card to skill checks.<br>" +
        "Action: Pass this skill check to move to any location. (PO/T)(7)",
        action : game => {
            game.narrateAll(game.getPlayers()[game.getActivePlayer()].character.name+" tries to escape the Brig");
            game.beforeSkillCheck({
                value : 7,
                types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
                text : `(PO/T)(7) PASS: ${game.getPlayers()[game.getActivePlayer()].character.name
                    } can move to any location, FAIL: nothing happens.`,
                pass : next => {
                    next.narrateAll(next.getPlayers()[next.getActivePlayer()].character.name+" escapes from the Brig!");
                    next.setPhase(GamePhaseEnum.MOVE_FROM_BRIG);
                },
                fail : next => {
                    next.addToActionPoints(-1);
                    next.setPhase(GamePhaseEnum.MAIN_TURN);
                    next.doPostAction();
                }
            });
            
        },
    },
    
});

exports.data = Object.freeze({
    DestinationMap : DestinationMap,
    QuorumMap : QuorumMap,
    CrisisMap : CrisisMap,
    SuperCrisisMap : SuperCrisisMap,
    LoyaltyMap : LoyaltyMap,
    CharacterMap : CharacterMap,
    SkillCardMap : SkillCardMap,
    LocationMap : LocationMap,
});