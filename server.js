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
const RAIDERS_DESTROYED_BY_NUKE=3;
const NUMBER_OF_RAPTORS=4;

//server
let express = require('express');
let app = express();
app.use(express.static(__dirname + '/images'));
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html') );
http.listen(port,() => console.log('listening on *:' + port) );

//boolean turns DB on and off
let dataBaseOn = false;
let pg;
let client;

if (dataBaseOn) {
    pg = require('pg');
    pg.defaults.ssl = true;
    client = new pg.Client(process.env.DATABASE_URL);
    client.connect();
}

//holds online users
const users = {};
const games = {};
const lobby = {};
const tables = {};
const offLineUsers = {};
function LoggedOut(gameId, index) {
    this.gameId = gameId;
    this.index = index;
}

if (dataBaseOn) {
    client.query('SELECT * FROM users;').on('row', row => {
        offLineUsers[row.name] = new LoggedOut(row.gameid, row.index)
    });
    client.query('SELECT * FROM games;').on('row', row => {
        let game = new Game(-1,-1);
        game.restore(row.game);
        games[row.id] = game;
    });
}

const InPlayEnum = Object.freeze({
    JAMMED_ASSAULT:"Jammed Assault",
    THIRTY_THREE:"Thirty Three",
    AMBUSH:"Ambush",
    CYLON_SWARM:"Cylon Swarm",
	DETECTOR_SABOTAGE:"Detector Sabotage",
    ACCEPT_PROPHECY:"Accept Prophecy",
});

const SkillTypeEnum = Object.freeze({
    ENGINEERING:"Engineering",
    LEADERSHIP:"Leadership",
    PILOTING:"Piloting",
    POLITICS:"Politics",
    TACTICS:"Tactics",
	LEADERSHIPPOLITICS:"LeadershipPolitics",
	LEADERSHIPENGINEERING:"LeadershipEngineering",
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

const CardTypeEnum = Object.freeze({
    LOYALTY : 'loyalty',
    SKILL : 'skill',
    CRISIS : 'crisis',
    SUPER_CRISIS: 'super crisis',
    QUORUM : 'quorum',
    DESTINATION : 'destination',
    
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
    RAIDING_PARTY:"Raiding Party",
	THIRTY_THREE:"Thirty-Three",
	AMBUSH:"Ambush",
	SURROUNDED:"Surrounded",
	TACTICAL_STRIKE:"Tactical Strike",
	BOARDING_PARTIES:"Boarding Parties",
	BESIEGED:"Besieged",
	JAMMED_ASSAULT:"Jammed Assault",
	CYLON_SWARM:"Cylon Swarm",
	
	//Super Crisis
    MASSIVE_ASSAULT:"Massive Assault",
	
	//Other
    RESCUE_THE_FLEET:"Rescue the Fleet",
    CRIPPLED_RAIDER:"Crippled Raider",
    CYLON_TRACKING_DEVICE:"Cylon Tracking Device",
    CYLON_AMBUSH:"Cylon Ambush",

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
	REVEAL_CIVILIANS:"Reveal Civilians",
    MOVE_CIVILIANS:"Move Civilians",
    MAIN_TURN:"Main Turn",
	DISCARD_FOR_MOVEMENT:"Discard for movement",
    CHOOSE:"Make a choice",
    SKILL_CHECK:"Skill Check",
    SINGLE_PLAYER_DISCARDS: "Single player discards",
    EACH_PLAYER_DISCARDS: "All players discard",
	LAUNCH_NUKE:"Launch Nuke",
    CYLON_DAMAGE_GALACTICA:"Cylon Damage Galactica",
    END_TURN:"End Turn",
});

const LocationEnum = Object.freeze({ //Shares some text with GalacticaDamageTypeEnum and also in client, don't change one without the others
    
    //Colonial One
    PRESS_ROOM:"Press Room",
    PRESIDENTS_OFFICE:"Presidents Office",
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
    ADMIRALS_QUARTERS:"Admirals Quarters",
    HANGAR_DECK:"Hangar Deck",
    ARMORY:"Armory",
    SICKBAY:"Sickbay",
    BRIG:"Brig",
    
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

const GalacticaDamageTypeEnum = Object.freeze({ //Shares some text with LocationEnum and also in client, don't change one without the others
    FTL_CONTROL:"FTL Control",
    WEAPONS_CONTROL:"Weapons Control",
    COMMAND:"Command",
    ADMIRALS_QUARTERS:"Admirals Quarters",
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

const WhoEnum = Object.freeze({
    CURRENT : 'current',
    ADMIRAL : 'admiral',
    PRESIDENT : 'president',
    ACTIVE : 'active',
});

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
            fun();
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
            game.nextAction = (next, fun) => {
                next.nextAction = null;
                fun();
            };
        	game.addFuel(-1);
            game.choose(DestinationMap.ICY_MOON.choice);
        },
        choice : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk a raptor for 1 food (-OR-) Risk nothing',
            choice1 : game => {
                if(game.getRaptorsInHangar()===0){
                    sendNarrationToAll("No raptors left to risk",game.gameId);
                    return;
                }
                sendNarrationToAll("Admiral risks a raptor",game.gameId);
                let roll=rollDie();
                sendNarrationToAll("Admiral rolls a "+roll,game.gameId);
                if(roll>2){
                    sendNarrationToAll("Food increased by 1!",game.gameId);
                    game.addFood(1);
                }else{
                    sendNarrationToAll("Raptor destroyed!",game.gameId);
                    game.addRaptor(-1);
                }
            },
            choice2 : game => {
                sendNarrationToAll("Admiral decides not to risk a raptor", game.gameId);
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
            fun();
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
            fun();
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
            game.nextAction = next => {
                next.nextAction = null;
                fun();
            };
            game.addFuel(-1);
            game.choose(DestinationMap.TYLIUM_PLANET.choice);
        },
        choice : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk a raptor for 2 fuel (-OR-) Risk nothing',
            choice1 : game => {
                if(game.getRaptorsInHangar()===0){
                    sendNarrationToAll("No raptors left to risk",game.gameId);
                    return;
                }
                sendNarrationToAll("Admiral risks a raptor",game.gameId);
                let roll=rollDie();
                sendNarrationToAll("Admiral rolls a "+roll,game.gameId);
                if(roll>2){
                    sendNarrationToAll("Fuel increased by 2!",game.gameId);
                    game.addFuel(2);
                }else{
                    sendNarrationToAll("Raptor destroyed!",game.gameId);
                    game.addRaptor(-1);
                }
            },
            choice2 : game => {
                sendNarrationToAll("Admiral decides not to risk a raptor",game.gameId);
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
            fun();
        },
    },
    /* commented out for now because im not sure how to handle this
    RAGNAR_ANCHORAGE : {
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
            choice2 : game => sendNarrationToAll("Admiral decides not to repair anything",game.gameId),
        },
        choice2 : {
            who : WhoEnum.ADMIRAL,
            text : 'which ships would you like to repair?',
            other : (game, command) => {
                //eric im not sure how we should do this
                //TODO figure out how to make this choice, how would we select 0 to 3 vipers and 0 to 1 raptors?
            },
        }
    },
    */
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
                fun();
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
            game.nextAction = next => {
                next.nextAction = null;
                fun();
            };
            game.choose(DestinationMap.CYLON_REFINERY.choose);
        },
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Risk 2 vipers to gain 2 fuel on a roll of 6 or higher (-OR-) don\'t',
            choice1 : game => {
                let roll = rollDie();
                if (roll < 6)
                    game.damageVipersInHangar(2);
                else game.addFuel(2);
                sendNarrationToAll(`A ${roll} was rolled so, ${roll < 6 ? '2 vipers are damaged' : 'you gain 2 fuel'}.`, game.gameId);
            },
            choice2 : game => sendNarrationToAll("Admiral decides not to risk the vipers",game.gameId),
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
            fun();
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
        action : game => {
            let roll = rollDie();
            sendNarrationToAll(`${game.getPlayers()[game.getActivePlayer()].character.name} rolls a ${roll} and ${
                roll > 5 ? "you gain one food" : "the rationing was unsuccessful"}.`, game.gameId);
            game.addFood(roll > 5 ? 1 : 0);
            game.afterQuorum(roll < 6);
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
                who : WhoEnum.CURRENT,
                text : 'Choose a player to move from the brig.',
                player : (game, player) => {
                    game.nextAction = next => {
                        next.nextAction = null;
                        next.choose({
                            who : WhoEnum.CURRENT,
                            text : `Choose a location to send ${game.getPlayers()[player].character.name} to.`,
                            options: (next) => {
                                return next.getPlayerNames();
                            },
                            other : (second, command) => {
                                second.nextAction = third => {
                                    third.nextAction = null;
                                    if (LocationEnum[command] != null) {
                                        if(command === LocationEnum.BRIG){
                                            sendNarrationToPlayer(third.getPlayers()[third.getCurrentPlayer()].userId,
                                                "Can't send to the Brig");
                                            game.choose(QuorumMap.PRESIDENTIAL_PARDON.choice);
                                        }
                                        if (third.getLocation(player) === LocationEnum.BRIG) {
                                            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name +" releases "+game.getPlayers()[player].character.name+" from the Brig, and to "+command,game.gameId);
                                            third.sendPlayerToLocation(player, command);
                                        } else {
                                            sendNarrationToPlayer(third.getPlayers()[third.getCurrentPlayer()].userId,
                                                "that player was not in the brig so nothing happens");
                                        }
                                    } else {
                                        sendNarrationToPlayer(third.getPlayers()[third.getCurrentPlayer()].userId,
                                            "Incorrect location");
                                        game.choose(QuorumMap.PRESIDENTIAL_PARDON.choice);
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
        action : game => game.choose(QuorumMap.RELEASE_CYLON_MUGSHOTS),
        choice : {
            who : WhoEnum.CURRENT,
            text : 'Whos random loyalty card would you like to see?',
            options: (next) => {
                return next.getPlayerNames();
            },
            player : (game, player) => {
                game.randomLoyaltyReveal(game.getCurrentPlayer(), player);
                let roll = rollDie();
                game.addMorale(roll > 3 ? 0 : -1);
                sendNarrationToAll(`A ${roll} was rolled, so ${roll > 3 ? 'nothing happens' : 'you lose 1 morale'}.`, game.gameId);
                game.afterQuorum(true);
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
            who : WhoEnum.CURRENT,
            text : 'Which player would you like to send to the brig?',
            options: (next) => {
                return next.getPlayerNames();
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
        actionText : "Destroy 3 raiders, 1 heavy or 1 centurion. Then roll a die, and if 2 or less, lose 1 population. " +
        "Then discard this card",
        action : game => game.choose(QuorumMap.AUTHORIZATION_OF_BRUTAL_FORCE.choice),
        choice : {
            who : WhoEnum.CURRENT,
            text : `Choose to destroy: 3 'raiders', 1 'heavy' raider or 1 'centurion'.`,
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
                        sendNarrationToPlayer(game.getPlayers()[game.getCurrentPlayer()].userId,
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
        action : game => {
            let roll = rollDie();
            sendNarrationToAll(`${game.getPlayers()[game.getActivePlayer()].character.name} rolls a ${roll} and ${
                roll > 5 ? "you gain one morale" : "the speech was unsuccessful"}.`, game.gameId);
            game.addMorale(roll > 5 ? 1 : 0);
            game.afterQuorum(roll < 6);
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
            who : WhoEnum.CURRENT,
            text : 'Choose a player to give the admiral title to.',
            options: (next) => {
                return next.getPlayerNames();
            },
            player : (game, player) => {
                if (player === game.getCurrentAdmiral()) {
                    sendNarrationToPlayer(game.getPlayers()[game.getCurrentPlayer()].userId, 'Not the Admiral!');
                    game.choose(QuorumMap.ENCOURAGE_MUTINY.choice);
                } else {
                    let roll = rollDie();
                    sendNarrationToAll(`A ${roll} was rolled so, ${roll > 2 ? `the Admiral is now ${
                        game.getPlayers()[player].character.name}` : 'nothing happens'}.`, game.gameId);
                    if (roll > 2)
                        game.setAdmiral(player);
                    game.afterQuorum(true);
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
            who : WhoEnum.CURRENT,
            text : `choose a skill card: 'politics', 'leadership', 'tactics', 'piloting' or 'engineering'.`,
            options: (next) => {
                return next.getSkillCardTypeNamesForPlayer(null);
            },
            other : (game, text) => {
                text = text.toLowerCase();
                let type = 'error';
                switch (text) {
                    case '0' : type = DeckTypeEnum.POLITICS; break;
                    case '1' : type = DeckTypeEnum.LEADERSHIP; break;
                    case '2' : type = DeckTypeEnum.TACTICS; break;
                    case '3' : type = DeckTypeEnum.PILOTING; break;
                    case '4' : type = DeckTypeEnum.ENGINEERING; break;
                    default :
                        game.choose(QuorumMap.ACCEPT_PROPHECY.choice);
                        return;
                }
                sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws a "+type+" skill card",game.gameId);
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
            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards",game.gameId);
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_VICE_PRESIDENT.choice);
        },
        choice : {
            who : WhoEnum.CURRENT,
            text : 'Who should be the vice president?',
            options: (next) => {
                return next.getPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    sendNarrationToPlayer(game.getPlayers()[player].userId, 'Not yourself!');
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
            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards",game.gameId);
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_ARBITRATOR.choice);
        },
        choice : {
            who : WhoEnum.CURRENT,
            text : 'Who should be the arbitrator?',
            options: (next) => {
                return next.getPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    sendNarrationToPlayer(game.getPlayers()[player].userId, 'Not yourself!');
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
            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws 2 Politics skill cards",game.gameId);
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.getPlayers()[game.getActivePlayer()].hand.push(game.drawCard(game.getDecks()[DeckTypeEnum.POLITICS]));
            game.choose(QuorumMap.ASSIGN_MISSION_SPECIALIST.choice);
        },
        choice : {
            who : WhoEnum.CURRENT,
            text : 'Who should be the mission specialist?',
            options: (next) => {
                return next.getPlayerNames();
            },
            player : (game, player) => {
                if (game.getActivePlayer()===player) {
                    sendNarrationToPlayer(game.getPlayers()[player].userId, 'Not yourself!');
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
            2) else if card has 'skillCheck' key -> run game.doSkillCheck(card.skillCheck)
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
			choice1 : game => game.doSkillCheck(CrisisMap.WATER_SABOTAGED.skillCheck),
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
                return next.getPlayerNames();
            },
            player : (game, player) => {
                
                if (game.getCurrentPresident() === player) {
                    sendNarrationToPlayer(game.getPlayers()[player].userId, 'You must give up the presidency!');
                    game.choose(CrisisMap.PRISONER_REVOLT.failChoice);
                } else {
                    game.setPresident(player);
                    sendNarrationToAll(`The new president is ${game.getPlayers()[player].character.name}`,game.gameId);
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
                        second.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                    };
                    next.singlePlayerDiscards(game.getCurrentPresident(), 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    //
    //WATER_SHORTAGE_2 : this.WATER_SHORTAGE_1,
    //
    //WATER_SHORTAGE_3 : this.WATER_SHORTAGE_1,
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
                        second.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                    };
                    next.singlePlayerDiscards(game.getCurrentPresident(), 2);
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
                        second.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                    };
                    next.singlePlayerDiscards(game.getCurrentPresident(), 2);
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
                        game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                    },
                    choice2 : game => {
                        game.randomLoyaltyReveal(game.getCurrentPlayer(), game.getCurrentAdmiral());
                        game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
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
                game.doSkillCheck(CrisisMap.CYLON_SCREENINGS.skillCheck);
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
                let options=next.getPlayerNames();
                options.push("Nobody");
                return options;
            },
            player : (game, player) => {
                if (!isNaN(player))
                    if (parseInt(player) > -1 && parseInt(player) < game.getPlayers().length) {
                        game.sendPlayerToLocation(player, LocationEnum.BRIG);
                        for (let x = 0; x < game.getPlayers().length; x++)
                            sendNarrationToAll(`${game.getPlayers()[player].character.name} has been sent to the brig`,game.gameId);
                    }else if(player===game.getPlayers().length){
                        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name +" decides not the send anyone to the Brig",game.gameId);
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
                return next.getPlayerNames();
            },
            player : (game, player) => {
                game.randomLoyaltyReveal(game.getCurrentPlayer(), player);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            }
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(7) PASS: Current player looks at 1 random Loyalty Card belonging to a player.' +
            ' FAIL: -2 morale. (-OR-) Roll a die. On a 4 or lower. -1 morale and -1 population',
            choice1 : game => game.doSkillCheck(CrisisMap.INFORMING_THE_PUBLIC.skillCheck),
            choice2 : game => {
                let roll = rollDie();
                if (roll <= 4) {
                    game.addPopulation(-1);
                    game.addMorale(-1);
                    sendNarrationToAll(`A ${roll} was rolled and you lost 1 population/morale.`,game.gameId);
                } else sendNarrationToAll(`A ${roll} was rolled so nothing happens!`,game.gameId);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
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
                        second.singlePlayerDiscards(game.getCurrentPlayer(), 3);
                    };
                    next.singlePlayerDiscards(game.getCurrentPresident(), 2);
                };
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //
    //FOOD_SHORTAGE_2 : this.FOOD_SHORTAGE_1,
    //
    //FOOD_SHORTAGE_3 : this.FOOD_SHORTAGE_1,
    //
    //FOOD_SHORTAGE_4 : this.FOOD_SHORTAGE_1,
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
                        second.singlePlayerDiscards(game.getCurrentAdmiral(), 2);
                    };
                    next.singlePlayerDiscards(game.getCurrentPresident(), 2);
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
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
                    }
                };
                game.singlePlayerDiscards(game.getCurrentPresident(), 4);
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
            choice1 : game => game.doSkillCheck(CrisisMap.FULFILLER_OF_PROPHECY.skillCheck),
            choice2 : game => {
                game.nextAction = next => {
                    next.nextAction = second => {
                        second.nextAction = third => {
                            third.nextAction = null;
                            third.playCrisis(game.getDecks().Crisis.deck.pop());
                        };
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
                    };
                    next.singlePlayerDiscards(game.getCurrentPlayer(), 1);
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
            fail : game => {
                let roll = rollDie();
                game.addPopulation(roll > 4 ? 0 : -2);
                sendNarrationToAll(`A ${roll} was rolled, ${roll > 4 ? 'nothing happens' : 'you lose 2 population'}.`,game.gameId);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(12) PASS: no effect, FAIL: Roll a die. IF 4 or lower, -2 population. (-OR-) ' +
            'The current player discards 4 random Skill Cards.',
            choice1 : game => game.doSkillCheck(CrisisMap.KEEP_TABS_ON_VISITOR.skillCheck),
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
    DETECTOR_SABOTAGE : { //TODOO when this card is in play, dont reveal loyalties
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
            choice1 : game => game.doSkillCheck(CrisisMap.SCOUTING_FOR_FUEL.skillCheck),
            choice2 : game => {
                let roll = rollDie();
                sendNarrationToAll(`A ${roll} was rolled, so ${roll > 4 ? 'nothing happens' : 'you lose a fuel'}.`,game.gameId);
                game.addFuel(roll > 4 ? 0 : -1);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //TODO for eric
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
            choice1 : game => game.doSkillCheck(CrisisMap.BOMB_THREAT.skillCheck),
            choice2 : game => {
                let roll = rollDie();
                sendNarrationToAll(`A ${roll} was rolled so ${
                    roll > 4 ? 'nothing happens' : 'you activate skillcheck fail'}.`,game.gameId);
                if (roll > 4)
                    game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                else CrisisMap.BOMB_THREAT.skillCheck.fail(game);
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //small TODO for eric
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
            	//TODO ERIC Remove vipers
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
            choice1 : game => game.doSkillCheck(CrisisMap.COLONIAL_DAY.skillCheck),
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
                    next.nextAction = second => {
                        second.nextAction = null;
                        second.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                    };
                    next.addMorale(-1);
                    next.singlePlayerDiscards(WhoEnum.ADMIRAL, 2);
                }
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(9) PASS: no effect, FAIL: -1 moral and the Admiral discards 2 Skill Cards (-OR-) -1 morale.',
            choice1 : game => game.doSkillCheck(CrisisMap.ADMIRAL_GRILLED.skillCheck),
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
                    sendNarrationToAll('No nukes remaining',game.gameId);
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
            choice1 : game => game.doSkillCheck(CrisisMap.ANALYZE_ENEMY_FIGHTER.skillCheck),
            choice2 : game => {
                let roll = rollDie();
                sendNarrationToAll(`a ${roll} was rolled, ${ roll < 5 ?
                    'you lose a population and current player discards 2 skill cards' : 'so nothing happens'}.`,game.gameId);
                if (roll < 5) {
                    game.nextAction = next => {
                        next.nextAction = next.nextAction = second => {
                            second.nextAction = null;
                            second.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
                        };
                    };
                    game.addPopulation(-1);
                    game.singlePlayerDiscards(WhoEnum.CURRENT, 2);
                } else game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
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
            choice1 : game => game.doSkillCheck(CrisisMap.A_TRAITOR_ACCUSED.skillCheck),
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
                return next.getPlayerNames();
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
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
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
                    second.singlePlayerDiscards(second.getCurrentPlayer(),3);
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
            choice1 : game => game.doSkillCheck(CrisisMap.CRIPPLED_RAIDER.skillCheck),
            choice2 : game => {
                let roll = rollDie();
                sendNarrationToAll(`a ${roll} was rolled`,game.gameId);
                if (roll < 5){
                    game.nextAction = null;
                    game.activateCylons(CylonActivationTypeEnum.RESCUE_THE_FLEET);
                }
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
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
                    sendNarrationToAll(`${game.getPlayers()[game.getCurrentPresident()].character.name
                        } has lost the presidency to ${game.getPlayers()[game.getCurrentAdmiral()].character.name}`,game.gameId);
                    game.setPresident(game.getCurrentAdmiral());
                } else sendNarrationToAll(game.getPlayers()[game.getCurrentAdmiral()].character.name +
                    ' is already president so nothing happens.',game.gameId);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
            },
            choice2 : game => {
                game.nextAction = next =>{
                    next.nextAction = null;
                    next.activateCylons(CylonActivationTypeEnum.ACTIVATE_BASESTARS);
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
    //TODO for eric
    BESIEGED : {
        name : 'Besieged',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 1 heavy raider, 4 raiders, 2 vipers, and 3 civilian shi' +
        'ps.<br>3) Special Rule - <i>Heavy Casualties:</i> The 4 raiders that were just setup are immediately activated',
        graphic : "BSG_Crisis_Besieged.png",
        instructions : game => {
            game.nextAction = next => {
                next.nextAction = second => {
                    second.nextAction = null;
                    //NEED TO ACTIVATE THOSE 4 SPECIFIC RAIDERS
                    second.endCrisis();
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
                return next.getPlayerNames();
            },
            player : (game, player) => {
                game.randomLoyaltyReveal(game.getCurrentPlayer(), player);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS);
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
            choice1 : game => game.doSkillCheck(CrisisMap.SCOUTING_FOR_WATER.skillCheck),
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
            choice1 : game => game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS),
            choice2 : game => {
                let roll = rollDie();
                game.addFuel(roll > 5 ? 0 : -1);
                sendNarrationToAll(`a ${roll} was rolled and ${roll > 5 ? 'nothing happened' : '1 fuel was lost'}`,game.gameId);
                game.activateCylons(CylonActivationTypeEnum.ACTIVATE_RAIDERS);
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
            },
        },
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T/E)(11) PASS: Increase the Jump Preparation track by 1, FAIL: -1 population and' +
            ' place 1 centurion marker at the start of the Boarding Party track (-OR-)' +
            ' -1 population and decrease the Jump Preparation track by 1.',
            choice1 : game => game.doSkillCheck(CrisisMap.NETWORK_COMPUTERS.skillCheck),
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
            choice1: game => game.doSkillCheck(CrisisMap.FORCED_WATER_MINING.skillCheck),
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
                        return next.getPlayerNames();
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
        instructions : game => {
            //TODO ERIC
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
                let options=next.getPlayerNames();
                options.push("Nobody");
                return options;
            },
            player : (game, player) => {
            	let foundCharacter=false;
				for(let i=0;i<game.getPlayers().length;i++){
					if(game.isLocationOnGalactica(game.getPlayers()[i].location)){
						foundCharacter=true;
					}
				}
				if(!foundCharacter){
                    sendNarrationToAll("No players on Galactica to send to Sickbay",game.gameId);
				}else{
                    if (!isNaN(player) && player>=0 && player<game.getPlayers().length) {
                        sendNarrationToAll(game.getPlayers()[player].character.name + " was sent to Sickbay!", game.gameId);
                        game.sendPlayerToLocation(player, LocationEnum.SICKBAY);
                    }else{
                        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " decides not to send anyone to Sickbay", game.gameId);
                    }
                }
				game.endCrisis();
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
                let options=next.getPlayerNames();
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
                    sendNarrationToAll("No players on Galactica to send to the Brig",game.gameId);
                }else{
                    if (!isNaN(player) && player>=0 && player<game.getPlayers().length) {
                        sendNarrationToAll(game.getPlayers()[player].character.name + " was sent to the Brig!", game.gameId);
                        game.sendPlayerToLocation(player, LocationEnum.BRIG);
                    }else{
                        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " decides not to send anyone to the Brig", game.gameId);
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
            choice1 : game => {
            	game.addMorale(-1);
                sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" lowers morale by 1!", game.gameId);
                game.endCrisis();
            },
            choice2 : game => {
                sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" decides not to lower morale", game.gameId);
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
		
		CAG - Action:
			Once per game, you may activate up to 6 unmanned vipers.
		
		Headstrong:
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
        characterGraphic:"Chars_Baltar.png",
        pieceGraphic:"PlayerPiece_Baltar.png",
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
        characterGraphic:"Chars_Galen_Tyrol.png",
        pieceGraphic:"PlayerPiece_Tyrol.png",
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
		 
		Sleeper Agent:
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
		 
		Declare Martial Law - Action:
		 	Once per game, give the President title to the Admiral.
		 
		Alcoholic:
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

const AdmiralLineOfSuccession = Object.freeze([
	CharacterMap.BADAMA,
    CharacterMap.TIGH,
    CharacterMap.AGATHON,
    CharacterMap.LADAMA,
    CharacterMap.THRACE,
    CharacterMap.VALERII,
    CharacterMap.TYROL,
    CharacterMap.ZAREK,
    CharacterMap.BALTAR,
    CharacterMap.ROSLIN,
]);

const PresidentLineOfSuccession = Object.freeze([
    CharacterMap.ROSLIN,
    CharacterMap.BALTAR,
    CharacterMap.ZAREK,
    CharacterMap.LADAMA,
    CharacterMap.BADAMA,
    CharacterMap.AGATHON,
    CharacterMap.TYROL,
    CharacterMap.VALERII,
    CharacterMap.TIGH,
    CharacterMap.THRACE,
]);

const SkillCardMap = Object.freeze({
	REPAIR_1:{
		name:"Repair",
        graphic:"BSG_Skill_Eng_Repair_1.png",
		type:SkillTypeEnum.ENGINEERING,
		value:1,
		total:8,
    },
    REPAIR_2:{
        name:"Repair",
        graphic:"BSG_Skill_Eng_Repair_2.png",
        type:SkillTypeEnum.ENGINEERING,
        value:2,
        total:6,
    },
    RESEARCH_3:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_3.png",
        type:SkillTypeEnum.ENGINEERING,
        value:3,
        total:4,
    },
    RESEARCH_4:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_4.png",
        type:SkillTypeEnum.ENGINEERING,
        value:4,
        total:2,
    },
    RESEARCH_5:{
        name:"Research",
        graphic:"BSG_Skill_Eng_Sci_Research_5.png",
        type:SkillTypeEnum.ENGINEERING,
        value:5,
        total:1,
    },
    XO_1:{
        name:"XO",
        graphic:"BSG_Skill_Led_XO_1.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:1,
        total:8,
    },
    XO_2:{
        name:"XO",
        graphic:"BSG_Skill_Led_XO_2.png",
        type:SkillTypeEnum.LEADERSHIP,
        value:2,
        total:6,
    },
	EMERGENCY_3:{
		name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_3.png",
        type:SkillTypeEnum.LEADERSHIP,
		value:3,
		total:4,
	},
	EMERGENCY_4:{
		name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_4.png",
        type:SkillTypeEnum.LEADERSHIP,
		value:4,
		total:2,
	},
	EMERGENCY_5:{
		name:"Emergency",
        graphic:"BSG_Skill_Led_Dec Emergency_5.png",
        type:SkillTypeEnum.LEADERSHIP,
		value:5,
		total:1,
	},
	EVASIVE_1:{
		name:"Evasive",
        graphic:"BSG_Skill_Pil_Evasive_1.png",
        type:SkillTypeEnum.PILOTING,
		value:1,
		total:8,
	},
	EVASIVE_2:{
		name:"Evasive",
        graphic:"BSG_Skill_Pil_Evasive_2.png",
        type:SkillTypeEnum.PILOTING,
		value:2,
		total:6,
	},
	FIREPOWER_3:{
		name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_3.png",
        type:SkillTypeEnum.PILOTING,
		value:3,
		total:4,
	},
	FIREPOWER_4:{
		name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_4.png",
        type:SkillTypeEnum.PILOTING,
		value:4,
		total:2,
	},
	FIREPOWER_5:{
		name:"Firepower",
        graphic:"BSG_Skill_Pil_Maximum_5.png",
        type:SkillTypeEnum.PILOTING,
		value:5,
		total:1,
	},
	CONSOLIDATE_1:{
		name:"Consolidate",
        graphic:"BSG_Skill_Pol_Con_Power_1.png",
        type:SkillTypeEnum.POLITICS,
		value:1,
		total:8,
	},
	CONSOLIDATE_2:{
		name:"Consolidate",
        graphic:"BSG_Skill_Pol_Con_Power_2.png",
        type:SkillTypeEnum.POLITICS,
		value:2,
		total:6,
	},
	COMMITTEE_3:{
		name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_3_old.png",
        type:SkillTypeEnum.POLITICS,
		value:3,
		total:4,
	},
	COMMITTEE_4:{
		name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_4_old.png",
        type:SkillTypeEnum.POLITICS,
		value:4,
		total:2,
	},
	COMMITTEE_5:{
		name:"Committee",
        graphic:"BSG_Skill_Pol_Inv Committee_5_old.png",
        type:SkillTypeEnum.POLITICS,
		value:5,
		total:1,
	},
	SCOUT_1:{
		name:"Scout",
        graphic:"BSG_Skill_Tac_Launch_Scout_1.png",
        type:SkillTypeEnum.TACTICS,
		value:1,
		total:8,
	},
	SCOUT_2:{
		name:"Scout",
        graphic:"BSG_Skill_Tac_Launch_Scout_2.png",
        type:SkillTypeEnum.TACTICS,
		value:2,
		total:6,
	},
	PLANNING_3:{
		name:"Planning",
        graphic:"BSG_Skill_Pol_Inv Committee_3_old.png",
        type:SkillTypeEnum.TACTICS,
		value:3,
		total:4,
	},
	PLANNING_4:{
		name:"Planning",
        graphic:"BSG_Skill_Pol_Inv Committee_4_old.png",
        type:SkillTypeEnum.TACTICS,
		value:4,
		total:2,
	},
	PLANNING_5:{
		name:"Planning",
        graphic:"BSG_Skill_Pol_Inv Committee_5_old.png",
        type:SkillTypeEnum.TACTICS,
		value:5,
		total:1,
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
            //TODO write this
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
            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " activates " +
                LocationEnum.PRESIDENTS_OFFICE,game.gameId);
            sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws a quorum card",game.gameId);
            sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId, "You drew "+readCard(game.getQuorumHand()[game.getQuorumHand().length-1]).name);
            game.choose(LocationMap.PRESIDENTS_OFFICE.choice);
        },
        choice : {
            who : WhoEnum.ACTIVE,
            text : 'Play drawn card or draw another?',
            options: (next) => {
                return ["Play","Draw"];
            },
            choice1 : game => {
                game.playQuorumCard(game.getQuorumHand().length-1);
            },
            choice2 : game => {
                game.getQuorumHand().push(game.drawCard(game.getDecks()[DeckTypeEnum.QUORUM]));
                sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name + " draws another quorum card",game.gameId);
                sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId, "You drew "+readCard(game.getQuorumHand()[game.getQuorumHand().length-1]).name);
                game.addToActionPoints(-1);
                game.setPhase(GamePhaseEnum.MAIN_TURN);
                game.doPostAction();
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
                who : WhoEnum.CURRENT,
                text : 'choose a player to try and give President to.',
                options: (next) => {
                    return next.getPlayerNames();
                },
                player : (next, player) => {
                    next.nextAction = second => second.nextAction = null;
                    sendNarrationToAll(next.getPlayers()[game.getActivePlayer()].character.name+
                        " chooses "+next.getPlayers()[player].character.name,next.gameId);
                    next.doSkillCheck({
                        value : 5,
                        types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
                        text : `(PO/L)(5) PASS: ${next.getPlayers()[player].character.name
                        } becomes president, FAIL: nothing happens.`,
                        pass : second => {
                            second.setPresident(player);
                            second.addToActionPoints(-1);
                            second.playCrisis(second.drawCard(second.getDecks()[DeckTypeEnum.CRISIS]));
                        },
                        fail : second => second.playCrisis(second.drawCard(second.getDecks()[DeckTypeEnum.CRISIS])),
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
        name : "Admirals Quarters",
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

function Game(users,gameId,handicap){
	let game = this;
	this.gameId = gameId;
	let players=users;
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
    let activeDestinations = null;
    let activeQuorum = null;
    let revealSkillChecks = false;//set to true for testing
    this.nextAction = game => {};
    this.nextAction = null;
    //let nextAction = aGame => this.nextAction(aGame);
    let hasAction = () => this.nextAction != null;
    
    this.randomLoyaltyReveal = (to, from) => {
        
        if (inPlay.indexOf(InPlayEnum.DETECTOR_SABOTAGE) === -1) {
            let rand = Math.floor(Math.random() * players[from].loyalty.length);
            sendNarrationToPlayer(players[to].userId, `Random loyalty card from ${
                players[from].character.name} reads: <br/>${players[from].loyalty[rand].text}`);
            sendNarrationToPlayer(players[from].userId, `You reveal to ${
                players[to].character.name}, a loyalty random card: <br/>${players[from].loyalty[rand].text}`);
        } else sendNarrationToAll(`${players[to].character.name} tried tpo reveal a loyalty from ${
            players[from].character.name} but was blocked by detector sabotage card in play`, gameId);
        
    };
    
    let choice1 = game => {};
    let choice2 = game => {};
    let choiceText = 'no choice';
    let choiceOptions = [];

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

	let inPlay=[];
    let centurionTrack=[0,0,0,0];
    let jumpTrack=-1;
    let distanceTrack=0;
    let destinations = [];
    let damagedLocations=[];
    let nukesRemaining=-1;
    let currentPresident=-1;
    let currentAdmiral=-1;
    let currentArbitrator=-1;
    this.setArbitrator = player => currentArbitrator = player;
    let currentMissionSpecialist=-1;
    this.setMissionSpecialist = player => currentMissionSpecialist = player;
    let currentVicePresident=-1;
    this.setVicePresident = player => currentPresident = player;
    let quorumHand=[];
    let skillCheckCards=[];

	//Flags etc
	let vipersToActivate=0;
	let currentViperLocation=-1;
    let civilianShipsToReveal=0;
    let currentCivilianShipLocation=-1;
    let shipNumberToPlace=[];
    let shipPlacementLocations=[];
    let damageOptions=[];

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

    let interpretWhoEnum = whoEnum => {
        switch (whoEnum) {
            case WhoEnum.PRESIDENT : whoEnum = currentPresident; break;
            case WhoEnum.ADMIRAL : whoEnum = currentAdmiral; break;
            case WhoEnum.CURRENT : whoEnum = currentPlayer; break;
            case WhoEnum.ACTIVE : whoEnum = activePlayer; break;
        }
        return whoEnum
    };

	this.endCrisis = () => {
        console.log("in end crisis");
        if (hasAction())
            this.nextAction(game);
        else nextTurn();
	};
	
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
        console.log(this.nextAction + '');
        phase = GamePhaseEnum.SINGLE_PLAYER_DISCARDS;
        player = interpretWhoEnum(player);
        if (numberToDiscard >= players[player].hand.length) {
            console.log('AUTO DISCARDING');
            for (let x = 0; x < numberToDiscard; x++)
                this.discardRandomSkill(player);//only discards if player has card so no worries about over discarding
            this.nextAction(this);
            return;
        }
        activePlayer = player;
        discardAmount = numberToDiscard;
        sendNarrationToPlayer(players[activePlayer], `Choose ${discardAmount} cards to discard.`);
    };
    
    this.eachPlayerDiscards = (numberToDiscard) => {
        phase = GamePhaseEnum.EACH_PLAYER_DISCARDS;
        nextActive();
        discardAmount = numberToDiscard;
        if (players[activePlayer].hand.length <= discardAmount) {
            while (players[activePlayer].hand.length <= discardAmount) {
                console.log('AUTO DISCARDING!');
                for (let x = 0; x < discardAmount; x++)
                    this.discardRandomSkill(activePlayer);
                if (++playersChecked === players.length) {
                    playersChecked = 0;
                    discardAmount = 0;
                    this.nextAction(this);
                    return;
                } else {
                    nextActive();
                    sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                        discardAmount} skill cards to discard`);
                }
            }
        } else sendNarrationToPlayer(players[activePlayer], `Choose ${discardAmount} cards to discard.`);
    };
    
    this.choose = choice => {
        console.log("in choose");
        console.log("chocie is "+choice);

        phase = GamePhaseEnum.CHOOSE;
        choice.who = interpretWhoEnum(choice.who);
        console.log("finished interpreting and chooser is "+choice.who);

        if (choice.player != null) {
            console.log("in player choice");

            choice1 = choice.player;
            choice2 = null;
        } else if (choice.other != null) {
            console.log("in misc choice");

            choice1 = null;
            choice2 = choice.other;
        } else {
            console.log("in this or that choice");

            choice1 = choice.choice1;
            choice2 = choice.choice2;
        }
        choiceText = choice.text;

        if(choice['options']!=null){
            console.log("found custom options");

            choiceOptions=choice.options(game);
        }else{
            console.log("no custom options");

            choiceOptions=["First","Second"];
        }
        activePlayer = choice.who;
        console.log("set active player to "+activePlayer);

        sendNarrationToPlayer(players[choice.who].userId, choice.text);
        
        if (!('private' in choice))
            for (let x = 0; x < players.length; x++)
                if (x !== choice.who)
                    sendNarrationToPlayer(players[x].userId, `${players[x].character.name} is making a choice: <br/>${choice.text}`)
        
    };
    
    let playCrisis = card => {
        let cardJSON = readCard(card);
        jumpTrack += cardJSON.jump ? 1 : 0;
        sendNarrationToAll(`${players[currentPlayer].character.name} plays a ${cardJSON.name} crisis card: `,game.gameId);
        sendNarrationToAll(cardJSON.text,game.gameId);
        activeCrisis = card;
        decks.Crisis.discard.push(card);
        if (cardJSON.choose != null)
            this.choose(cardJSON.choose);
        else if (cardJSON.skillCheck != null)
            this.doSkillCheck(cardJSON.skillCheck);
        else cardJSON.instructions(this);
    };

	//Getter and setter land
    this.getPhase = () => phase;
    this.setPhase = phaseEnum => phase = phaseEnum;
    this.inPlay = () => inPlay;
    this.getPlayers = () => players;
	this.getCurrentPlayer = () => currentPlayer;
    this.getActivePlayer = () => activePlayer;
    this.getCurrentPresident = () => currentPresident;
    this.getCurrentAdmiral = () => currentAdmiral;
    this.getDecks = () => decks;
    this.getQuorumHand = () => quorumHand;
    this.getLocation = player => players[player].location;
    this.getDamagedLocations = () => damagedLocations;
    this.getRaptorsInHangar = () => raptorsInHangar;
    this.getNukesRemaining = () => nukesRemaining;
    this.getDamageOptions = () => damageOptions;
    this.playCrisis = playCrisis;
    this.addFuel = x => fuelAmount += x;
    this.addFood = x => foodAmount += x;
    this.addMorale = x => moraleAmount += x;
    this.addPopulation = x => populationAmount += x;
    this.getFuel = () => fuelAmount;
    this.getFood = () => foodAmount;
    this.getMorale = () => moraleAmount;
    this.getPopulation = () => populationAmount;
    this.setPresident = x => currentPresident = x;
    this.setAdmiral = x => currentAdmiral = x;
    this.addNukesRemaining = (num) => nukesRemaining+=num;
    this.isLocationOnGalactica = function(loc){
    	return isLocationOnGalactica(loc);
	};
    this.destroyCivilianShip = function(loc,num){
    	destroyCivilianShip(loc,num)
	};
    this.sendPlayerToLocation = function(player,loc){
        sendPlayerToLocation(player,loc)
    };
    this.setDamageOptions = function(options){
        damageOptions=options;
    };
    this.addToActionPoints = function(num){
        addToActionPoints(num);
    };
    this.playQuorumCard = function(num){
        playQuorumCard(num);
    };
    
    this.discardRandomSkill = player => {
        if (players[player].hand.length > 0) {
            let rand = Math.floor(Math.random() * players[player].hand.length);
            decks[players[player].hand[rand].type].discard.push(players[player].hand.splice(rand, 1)[0]);
            sendNarrationToAll(`${players[player].character.name} discards a random card.`,game.gameId);
        } else {
            sendNarrationToAll(`${players[player].character.name} had no cards left to discard!`,game.gameId);
        }
    };
    
    this.discardSkill = (player, index) => {
      let card = players[player].hand.splice(index, 1)[0];
      decks[card.type].discard.push(card);
    };

    function sendGameState(playerNumber){
        let handArray=[];
        for(let i=0;i<players[playerNumber].hand.length;i++){
            handArray.push(players[playerNumber].hand[i].graphic);
        }
        let quorumArray=[];
        for(let i=0;i<quorumHand.length;i++){
            console.log(quorumHand[i]);
            quorumArray.push(readCard(quorumHand[i]).graphic);
        }

        let gameStateJSON= {
            currentPlayer: currentPlayer,
            /*
            let phase = GamePhaseEnum.SETUP;
            let activePlayer = -1;
            let currentMovementRemaining = -1;
            let activeMovementRemaining = -1;
            let currentActionsRemaining = -1;
            let activeActionsRemaining = -1;
            let spaceAreas = {"Northeast": [], "East": [], "Southeast": [], "Southwest": [], "West": [], "Northwest": []};
            let availableCharacters = [];
            let charactersChosen = 0;
            let discardAmount = 0;
            let activeCrisis = null;
            let revealSkillChecks = true;//set to true for testing
            this.nextAction = game => {
            };
            this.nextAction = null;
            let nextAction = aGame => this.nextAction(aGame);
            let hasAction = () => this.nextAction != null;

            let choice1 = game => {
            };
            let choice2 = game => {
            };
            let choiceText = 'no choice';

            let playersChecked = 0;
            let passValue = 0;
            let middleValue = -1;
            let skillText = '';
            let skillCheckTypes = []; //ie [SkillTypeEnum.POLITICS, SkillTypeEnum.PILOTING]
            let skillPass = game => {
            };
            let skillMiddle = game => {
            };
            let skillFail = game => {
            };
            */

            //Different for each player
            narration:"",
            character:players[playerNumber].character.characterGraphic,
            hand:handArray,
            quorumHand:[],
            nukes:0,
            activeLocation:-1,
            canMove:false,
            active:false,
            spaceAreas:{"Northeast":[],"East":[],"Southeast":[],"Southwest":[],"West":[],"Northwest":[]},
            loyalty:[],


            playerLocations:[],
            availableCharacters:[],
            choiceOptions:choiceOptions,

            vipersInHangar:vipersInHangar,
            raptorsInHangar:raptorsInHangar,
            damagedVipers:damagedVipers,

            gamePhase:phase,
            crisis:null,
            quorum:null,

            fuelAmount:fuelAmount,
            foodAmount:foodAmount,
            moraleAmount:moraleAmount,
            populationAmount:populationAmount,
/*
            let inPlay = [];
            */
            centurionTrack:centurionTrack,
            /*
            let jumpTrack = -1;
            let distanceTrack = 0;
            let damagedLocations = [];
            let nukesRemaining = -1;
            let currentPresident = -1;
            let currentAdmiral = -1;
            let currentArbitrator = -1;
            let currentMissionSpecialist = -1;
            let currentVicePresident = -1;
            let quorumHand = [];
            let skillCheckCards = [];

            //Flags etc
            let vipersToActivate = 0;
            let currentViperLocation = -1;
            let civilianShipsToReveal = 0;
            let currentCivilianShipLocation = -1;
            let shipNumberToPlace = [];
            let shipPlacementLocations = [];
            let damageOptions = [];
            */
        };
        if(activeCrisis!=null){
            gameStateJSON.crisis=readCard(activeCrisis).graphic;
        }
        if(activeDestinations!=null){
            let destinations=[];
            for(let i=0;i<activeDestinations.length;i++){
                if(playerNumber===currentMissionSpecialist||(playerNumber==currentAdmiral&&currentMissionSpecialist===-1)){
                    if(activeDestinations.length>1){
                        gameStateJSON.narration="Choose jump destination";
                    }else{
                        gameStateJSON.narration="What do you want to do?";
                    }
                    destinations.push(readCard(activeDestinations[i]).graphic);
                }else{
                    if(activeDestinations.length>1) {
                        gameStateJSON.narration = (currentMissionSpecialist != -1 ? "Mission specialist" : "Admiral") + " is looking at the destinations";
                        destinations.push("BSG_Destination_Back.png");
                    }else{
                        gameStateJSON.narration = (currentMissionSpecialist != -1 ? "Mission specialist" : "Admiral") + " is deciding what to do";
                        destinations.push(readCard(activeDestinations[i]).graphic);
                    }
                }
            }
            gameStateJSON.destinations=destinations;
        }
        if(activeQuorum!=null){
            gameStateJSON.quorum=readCard(activeQuorum).graphic;
        }
        for(let i=0;i<players[playerNumber].loyalty.length;i++){
            gameStateJSON.loyalty.push(players[playerNumber].loyalty[i].graphic);
        }
        for(let s in SpaceEnum){
            for(let i=0;i<spaceAreas[SpaceEnum[s]].length;i++){
                let infoArr=[spaceAreas[SpaceEnum[s]][i].type,spaceAreas[SpaceEnum[s]][i].pilot===-1?-1:players[spaceAreas[SpaceEnum[s]][i].pilot].character.pilotGraphic,spaceAreas[SpaceEnum[s]][i].type.damage];
                if(spaceAreas[SpaceEnum[s]][i].activated&&playerNumber===activePlayer){
                    infoArr.push(spaceAreas[SpaceEnum[s]][i].resource);
                }
                gameStateJSON.spaceAreas[SpaceEnum[s]].push(infoArr);
            }
        }
        for(let i=0;i<players.length;i++){
            gameStateJSON.playerLocations.push([players[i].location,players[i].character.pieceGraphic]);
        }
        if(currentPresident===playerNumber){
            gameStateJSON.quorumHand=quorumArray;
        }
        if(currentAdmiral===playerNumber){
            gameStateJSON.nukes=nukesRemaining;
        }
        if(activePlayer===playerNumber&&activeActionsRemaining>0&&players[playerNumber].viperLocation===-1){
            gameStateJSON.activeLocation=players[playerNumber].location;
        }
        if(activePlayer===playerNumber&&activeMovementRemaining>0&&phase===GamePhaseEnum.MAIN_TURN){
            gameStateJSON.canMove=true;
        }
        if(activePlayer===playerNumber){
            gameStateJSON.active=true;
        }
        if(phase===GamePhaseEnum.PICK_CHARACTERS&&playerNumber===activePlayer){
            for(let i=0;i<availableCharacters.length;i++){
                gameStateJSON.availableCharacters.push([availableCharacters[i],CharacterMap[availableCharacters[i]].characterGraphic]);
            }
        }

        //console.log(gameStateJSON);
        sendGameStateToPlayer(players[playerNumber].userId,JSON.stringify(gameStateJSON));


    }
			
	let setUpNewGame=function() {
	    if (players === -1)
	        return;
        vipersInHangar = 8;
        raptorsInHangar = 4;
        damagedVipers = 0;
        fuelAmount = 8 + parseInt(handicap);
        foodAmount = 8 + parseInt(handicap);
        moraleAmount = 10 + parseInt(handicap);
        populationAmount = 12 + parseInt(handicap);
        nukesRemaining = 2;
        jumpTrack = 4;
        
        //for testing
        let testSkills = buildStartingSkillCards();
        for (let x = 0; x < players.length; x++)
            for (let i = 0; i < 5; i++)
                players[x].hand.push(testSkills.pop());
        //end testing
        
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

        //Create Destination Deck
        for (let key in DestinationMap)
            for (let x = 0; x < DestinationMap[key].total; x++)
                decks[DeckTypeEnum.DESTINATION].deck.push(new Card(CardTypeEnum.DESTINATION, key));
        shuffle(decks[DeckTypeEnum.DESTINATION].deck);
        
        //Create Loyalty Deck
		let notACylonCards=0;
        let youAreACylonCards=0;
		if(players.length===2) {
            notACylonCards=3;
            youAreACylonCards=1;
        }else if(players.length===3){
			notACylonCards=5;
            youAreACylonCards=1;
		}else if(players.length===5){
            notACylonCards=8;
            youAreACylonCards=2;
		}
        for(let i=0;i<notACylonCards;i++){
			decks[DeckTypeEnum.LOYALTY].deck.push(LoyaltyMap.YOU_ARE_NOT_A_CYLON);
        }
        let tempCylons=[];
        tempCylons.push(LoyaltyMap.YOU_ARE_A_CYLON_AARON);
        tempCylons.push(LoyaltyMap.YOU_ARE_A_CYLON_BOOMER);
        tempCylons.push(LoyaltyMap.YOU_ARE_A_CYLON_LEOBEN);
        tempCylons.push(LoyaltyMap.YOU_ARE_A_CYLON_SIX);
        shuffle(tempCylons);
        for(let i=0;i<youAreACylonCards;i++){
            decks[DeckTypeEnum.LOYALTY].deck.push(tempCylons.pop());
        }
        shuffle(decks[DeckTypeEnum.LOYALTY].deck);

        //Create Quorum Deck
        for(let key in QuorumMap){
            decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM, key));
        }
        for(let i=0;i<3;i++){
            decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'INSPIRATIONAL_SPEECH'));
        }
        decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'FOOD_RATIONING'));
        decks[DeckTypeEnum.QUORUM].deck.push(new Card(CardTypeEnum.QUORUM,'ARREST_ORDER'));
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
        for(let key in CrisisMap)
            decks[DeckTypeEnum.CRISIS].deck.push(new Card(CardTypeEnum.CRISIS, key));
        shuffle(decks[DeckTypeEnum.CRISIS].deck);
        //decks[DeckTypeEnum.CRISIS].deck.push(new Card(CardTypeEnum.CRISIS, "HEAVY_ASSAULT"));

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
        for(let type in ShipTypeEnum){
            shipNumberToPlace[ShipTypeEnum[type]]=0;
        }

        for(let key in CharacterMap){
            availableCharacters.push(key);
        }

		quorumHand.push(drawCard(decks[DeckTypeEnum.QUORUM]));
        phase=GamePhaseEnum.PICK_CHARACTERS;

        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }

        askForCharacterChoice();
	};

    this.getPlayerNames = function(){
        let names=[];
        for(let i=0;i<this.getPlayers().length;i++){
            names.push(this.getPlayers()[i].character.name);
        }
        return names;
    };

    this.getSkillCardTypeNamesForPlayer = function(player) {
        if(player==null||player===-1) {
            return ["Politics", "Leadership", "Tactics", "Piloting", "Engineering"];
        }else{

        }
    };

	let askForCharacterChoice=function(){
        sendNarrationToPlayer(players[activePlayer].userId, "Pick your character");
    };

    let chooseCharacter=function(character){
		if(availableCharacters.indexOf(character)>=0){
			players[activePlayer].character=CharacterMap[character];
            charactersChosen++;
            availableCharacters.splice(availableCharacters.indexOf(character),1);
            sendNarrationToAll("Player "+activePlayer+" picked "+CharacterMap[character].name,game.gameId);

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

    let dealLoyaltyCards = function(){
    	for(let i=0;i<players.length;i++){
    		players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
		}
		if(distanceTrack<4){
            for(let i=0;i<players.length;i++){
            	if(players[i].character.name===CharacterMap.BALTAR.name){
                    players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
                    break;
				}
            }
		}else{
            for(let i=0;i<players.length;i++){
                if(players[i].character.name===CharacterMap.VALERII.name){
                    players[i].loyalty.push(decks[DeckTypeEnum.LOYALTY].deck.pop());
                    break;
                }
            }
		}
	};

    let beginFirstTurn=function(){
    	for(let i=0;i<players.length;i++){
			players[i].location=players[i].character.startLocation;
		}

		//Lines of succession
		let foundPresident=false;
		for(let i=0;i<PresidentLineOfSuccession.length&&!foundPresident;i++){
            for(let j=0;j<players.length;j++){
				if(players[j].character.name===PresidentLineOfSuccession[i].name){
					currentPresident=j;
                    foundPresident=true;
					break;
				}
            }
		}
        let foundAdmiral=false;
        for(let i=0;i<AdmiralLineOfSuccession.length&&!foundAdmiral;i++){
            for(let j=0;j<players.length;j++){
                if(players[j].character.name===AdmiralLineOfSuccession[i].name){
                    currentAdmiral=j;
                    foundAdmiral=true;
                    break;
                }
            }
        }

		dealLoyaltyCards();
        for(let i=0;i<players.length;i++){
            let loyalty=players[i].loyalty;
            let loyaltyText="Loyalty:<br>";
            for(let j=0;j<loyalty.length;j++){
                loyaltyText+=loyalty[j].name+"- "+loyalty[j].text+",<br>";
            }
            sendNarrationToPlayer(players[i].userId, loyaltyText);
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
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn",game.gameId);
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
                    (skills[SkillTypeEnum.LEADERSHIPPOLITICS]-amount)+" Politics",game.gameId);
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
                    (skills[SkillTypeEnum.LEADERSHIPENGINEERING] - amount) + " Engineering",game.gameId);
            }
        }
    };

    let pickResearchCard=function(text){
		if(text==='0'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.ENGINEERING+
                " skill card",game.gameId);
            players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.ENGINEERING]));
            phase=GamePhaseEnum.MAIN_TURN;
		}else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " draws an "+SkillTypeEnum.TACTICS+" skill card",game.gameId);
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
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southwest",game.gameId);
            players[activePlayer].viperLocation=SpaceEnum.SW;
            spaceAreas[SpaceEnum.SW].push(s);
        }else if(text==='1'){
            sendNarrationToAll(players[activePlayer].character.name + " launches in a viper to the Southeast",game.gameId);
            players[activePlayer].viperLocation=SpaceEnum.SE;
            spaceAreas[SpaceEnum.SE].push(s);
        }
        vipersInHangar--;

        if(phase===GamePhaseEnum.LADAMA_STARTING_LAUNCH) {
            activePlayer = currentPlayer;
            sendNarrationToAll("It's " + players[currentPlayer].character.name + "'s turn",game.gameId);
            addStartOfTurnCardsForPlayer(currentPlayer);
        }else{
            phase=GamePhaseEnum.MAIN_TURN;
        }

        return;
    };

    let revealCivilians = function(text){
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
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.CIVILIAN){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a civilian ship');
            return;
        }else if(spaceAreas[loc][num].activated){
            sendNarrationToPlayer(players[activePlayer].userId, 'Already revealed');
            return;
        }

        sendNarrationToPlayer(players[activePlayer].userId, 'Civilian ship type is '+spaceAreas[loc][num].resource);
        spaceAreas[loc][num].activated=true;
        civilianShipsToReveal--;
        if(civilianShipsToReveal===0){
            let count=countShips();
            if(count[ShipTypeEnum.CIVILIAN]===1){
                civilianShipsToReveal=1;
            }else{
                civilianShipsToReveal=2;
            }
            sendNarrationToPlayer(players[activePlayer].userId, ' Select the space location and number of the first revealed ship to move,' +
				' or \'done\' to skip moving ships');
            phase=GamePhaseEnum.MOVE_CIVILIANS;
            return;
		}

        sendNarrationToPlayer(players[activePlayer].userId, civilianShipsToReveal+" civilians to reveal. Select a space location and number");
        return;
	};

    let moveCivilians=function(text){
    	if(text.toUpperCase()==="DONE"){
            sendNarrationToPlayer(players[activePlayer].userId, 'Done moving ships');
            phase=GamePhaseEnum.MAIN_TURN;
            return;
		}
    	if(currentCivilianShipLocation!==-1){
            if(SpaceEnum[text]!=null){
                if(isAdjacentSpace(SpaceEnum[text],currentCivilianShipLocation[0])){
					let c = spaceAreas[currentCivilianShipLocation[0]][currentCivilianShipLocation[1]];
					c.activated=false;
					spaceAreas[currentCivilianShipLocation[0]].splice(currentCivilianShipLocation[1],1);
					spaceAreas[SpaceEnum[text]].push(c);
					sendNarrationToAll(players[activePlayer].character.name + " moves a civilian ship from "
						+currentCivilianShipLocation[0]
						+" to "+SpaceEnum[text],game.gameId);
					currentCivilianShipLocation=-1;
					civilianShipsToReveal--;
					if(civilianShipsToReveal===0){
						sendNarrationToPlayer(players[activePlayer].userId, 'Done moving ships');
						phase=GamePhaseEnum.MAIN_TURN;
					}else{
                        sendNarrationToPlayer(players[activePlayer].userId, civilianShipsToReveal+
							" civilians to move. Select a space location and number, or 'done' to skip moving ships");
                    }
					return;
                }else{
                    sendNarrationToPlayer(players[activePlayer].userId, 'Not an adjacent space');
                    return;
                }
            }else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Invalid input');
                return;
            }
		}

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
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.CIVILIAN||!spaceAreas[loc][num].activated){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a revealed civilian ship to move');
            return;
        }

        sendNarrationToPlayer(players[activePlayer].userId, 'Choose a space location for this ship');
        currentCivilianShipLocation=[loc,num];
	};

    let chooseViper = function(text){
        if(text==='SW'||text==='SE'){
            if(vipersInHangar===0){
                sendNarrationToPlayer(players[activePlayer].userId, 'No vipers left in reserve');
                return;
            }
            vipersInHangar--;
            vipersToActivate--;
            if(text==="SW"){
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SW",game.gameId);
                spaceAreas[SpaceEnum.SW].push(new Ship(ShipTypeEnum.VIPER));
            }else{
                sendNarrationToAll(players[activePlayer].character.name + " launches a viper to the SE",game.gameId);
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

        if(text.length<3){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }

        text=text.split(" ")[0];

        if(text==null||SpaceEnum[text]==null){
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
                            +" to "+SpaceEnum[text],game.gameId);
                        currentViperLocation=-1;
                        vipersToActivate--;
                        break;
                    }
                    console.log("viper not found in area");
                }
			}else{
                sendNarrationToPlayer(players[activePlayer].userId, 'Not an adjacent space');
				return;
            }
        }else{
            let num=parseInt(text.substr(2));
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
        let num=parseInt(text.substr(10));
        if(isNaN(num) || num<0 || num>=centurionTrack.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid location');
            return;
        }else if(centurionTrack[num]===0){
            sendNarrationToPlayer(players[activePlayer].userId, 'No centurions there');
            return;
		}
		let roll=rollDie();
        sendNarrationToAll(players[activePlayer].character.name + " rolls a "+roll,game.gameId);
        if(roll>=CENTURION_DESTROYED_MINIMUM_ROLL){
            sendNarrationToAll(players[activePlayer].character.name + " kills a centurion!",game.gameId);
            centurionTrack[num]--;
        }else{
            sendNarrationToAll(players[activePlayer].character.name + " didn't kill the centurion",game.gameId);
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
		let attackerName=players[activePlayer].character.name;
        /*if(!isAttackerGalactica){
            attackerName="Viper";
		}*/
        let roll=rollDie();
        sendNarrationToAll(attackerName + " attacks the "+ship.type+" at "+loc,game.gameId);
        sendNarrationToAll(attackerName + " rolls a "+roll,game.gameId);
        console.log(inPlay);
        console.log(inPlay.indexOf(InPlayEnum.AMBUSH));
        if(inPlay.indexOf(InPlayEnum.AMBUSH)!==-1&&!isAttackerGalactica){ //TO FIX: Don't reduce roll for piloted vipers
            roll-=2;
            sendNarrationToAll("Viper gets -2 because of training new pilots!",game.gameId);
            return;
        }
        if(ship.type===ShipTypeEnum.RAIDER) {
            if (roll>=RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(attackerName + " destroys the raider!",game.gameId);
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(attackerName + " tries to attack the raider and misses",game.gameId);
            }
        }else if(ship.type===ShipTypeEnum.HEAVY_RAIDER) {
            if (roll>=HEAVY_RAIDER_DESTROYED_MINIMUM_ROLL) {
                sendNarrationToAll(attackerName + " destroys the heavy raider!",game.gameId);
                spaceAreas[loc].splice(num,1);
            } else {
                sendNarrationToAll(attackerName + " tries to attack the heavy raider and misses",game.gameId);
            }
        }else if(ship.type===ShipTypeEnum.BASESTAR) {
            if(ship.damage[0]==BasestarDamageTypeEnum.STRUCTURAL||
                ship.damage[1]==BasestarDamageTypeEnum.STRUCTURAL){
                roll+=2;
                sendNarrationToAll("Roll upgraded to "+roll+" by basestar structural damage",game.gameId);
            }
            if((isAttackerGalactica&&roll>=GALACTICA_DAMAGES_BASESTAR_MINIMUM_ROLL)
                ||roll>=VIPER_DAMAGES_BASESTAR_MINIMUM_ROLL){
                damageBasestar(loc,num);
            }else{
                sendNarrationToAll(attackerName + " tries to attack the basestar and misses",game.gameId);
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
        sendNarrationToAll(players[activePlayer].character.name + " hits the basestar!",game.gameId);
        sendNarrationToAll("The basestar has taken "+damageType+" damage!",game.gameId);
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
        sendNarrationToAll("The basestar is destroyed!",game.gameId);
        if(basestar.damage[0]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[0]);
        if(basestar.damage[1]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[1]);
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
	
    let jump = () => {
        let lastPhase = phase;
        jumpTrack = jumpTrack > 5 ? 1 : 0; //if jumptrack was overshot from network computers

        for(let s in SpaceEnum){
            let numShips=spaceAreas[SpaceEnum[s]].length;
            for(let i=0;i<numShips;i++) {
                if (spaceAreas[SpaceEnum[s]][0].type === ShipTypeEnum.VIPER) {
                    if(spaceAreas[SpaceEnum[s]][0].pilot!==-1){
                        players[spaceAreas[SpaceEnum[s]][0].pilot].viperLocation=-1;
                    }
                    vipersInHangar++;
                }else if (spaceAreas[SpaceEnum[s]][0].type === ShipTypeEnum.BASESTAR) {
                    let basestar=spaceAreas[SpaceEnum[s]][0];
                    if(basestar.damage[0]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[0]);
                    if(basestar.damage[1]!==-1) decks[DeckTypeEnum.BASESTAR_DAMAGE].deck.push(basestar.damage[1]);
                    shuffle(decks[DeckTypeEnum.BASESTAR_DAMAGE].deck);
                }
                spaceAreas[SpaceEnum[s]].splice(0,1);
            }
        }

        let cardOne = drawCard(decks[DeckTypeEnum.DESTINATION]);
        let cardTwo = drawCard(decks[DeckTypeEnum.DESTINATION]);

        activeDestinations=[cardOne,cardTwo];

        this.choose({
            who : currentMissionSpecialist === -1 ? WhoEnum.ADMIRAL : currentMissionSpecialist,
            text : `${readCard(cardOne).name}: ${readCard(cardOne).text} (-OR-) ${
                readCard(cardTwo).name}: ${readCard(cardTwo).text}`,
            private : `IMPORTANT CONFIDENTIAL DOCUMENTS`,
            options: game => [readCard(cardOne).name,readCard(cardTwo).name],
            choice1 : game => {
                phase = lastPhase;
                activeDestinations=[cardOne];
                playDestination(cardOne);
                decks[DeckTypeEnum.DESTINATION].deck.splice(0, 0, cardTwo);
            },
            choice2 : game => {
                phase = lastPhase;
                activeDestinations=[cardTwo];
                playDestination(cardTwo);
                decks[DeckTypeEnum.DESTINATION].deck.splice(0, 0, cardOne);
            },
        });

        if (currentMissionSpecialist !== -1) {
            currentMissionSpecialist = -1;
            decks[DeckTypeEnum.QUORUM].discard.push(new Card(CardTypeEnum.QUORUM, 'ASSIGN_MISSION_SPECIALIST'));
        }
        
    };
    
	let nextTurn=function(){
        console.log("in next turn");

        phase = GamePhaseEnum.END_TURN;

        if (jumpTrack >= 5) {
            jump();
            return;
        }

	    activeCrisis=null;
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

        sendNarrationToAll("It's "+players[currentPlayer].character.name+"'s turn",game.gameId);
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

	this.setInPlay = function(card){
		this.inPlay().push(card);
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

    let isLocationCylon=function(location){
        return location === LocationEnum.CAPRICA || location === LocationEnum.CYLON_FLEET ||
            location === LocationEnum.HUMAN_FLEET || location === LocationEnum.RESURRECTION_SHIP;
    };

    let isLocationOnGalactica=function(location){
    	return !isLocationOnColonialOne() && !isLocationCylon();
	};

	let addToActionPoints=function(num){
		activeActionsRemaining+=num;

        if(activePlayer===currentPlayer){
			currentActionsRemaining+=num;
		}
	};

	this.addToFTL=function(num){
        jumpTrack+=num;
        if(jumpTrack<0){
        	jumpTrack=0;
		}
    };

    this.addCenturion=function(loc,num){
        centurionTrack[loc]+=num;
        if(centurionTrack[loc]<0){
        	centurionTrack[loc]=0;
		}
    };

	let doCrisisStep=function(){
		console.log("starting crisis step");
		let crisisCard=drawCard(decks[DeckTypeEnum.CRISIS]);
		console.log(readCard(crisisCard));
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
        sendNarrationToAll("Jump preparation increases",game.gameId);
        if(jumpTrack===JUMP_PREP_AUTOJUMP_LOCATION){
			jumpGalactica();
		}
	};

	let jumpGalactica = function(){
		sendNarrationToAll("Galactica jumps to a new location!",game.gameId);

	};

	let destroyCivilianShip = function(loc,num){
        sendNarrationToAll("Civilian ship destoyed!",game.gameId);
        let ship=null;
        if(loc===-1){
            ship=new Ship(ShipTypeEnum.CIVILIAN);
            ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
		}else{
            ship=spaceAreas[loc][num];
            spaceAreas[loc].splice(num,1);
        }
        switch(ship.resource){
			case CivilianShipTypeEnum.ONE_POPULATION:
                sendNarrationToAll("One population lost!",game.gameId);
                populationAmount--;
                break;
            case CivilianShipTypeEnum.TWO_POPULATION:
                sendNarrationToAll("Two population lost!",game.gameId);
                populationAmount-=2;
                break;
            case CivilianShipTypeEnum.POPULATION_FUEL:
                sendNarrationToAll("Population and fuel lost!",game.gameId);
                populationAmount--;
                fuelAmount--;
                break;
            case CivilianShipTypeEnum.POPULATION_MORALE:
                sendNarrationToAll("Population and morale lost!",game.gameId);
                populationAmount--;
                moraleAmount--;
                break;
            case CivilianShipTypeEnum.NOTHING:
                sendNarrationToAll("Luckily not much was in the ship",game.gameId);
                break;
			default:
				break;
		}
	};

	let activateRaider=function(loc,num){ //Returns true if raider moved
		if(spaceAreas[loc][num].activated){
			return false;
		}
		spaceAreas[loc][num].activated=true;

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot === -1) {
                sendNarrationToAll("Cylon raider attacks a viper",game.gameId);
                let roll = rollDie();
                sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    return false;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return false;
                } else {
                    sendNarrationToAll("The raider misses!",game.gameId);
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.VIPER&&spaceAreas[loc][i].pilot !== -1) {
                sendNarrationToAll("Cylon raider attacks viper piloted by "
                    +players[spaceAreas[loc][i].pilot].character.name+"!",game.gameId);
                let roll = rollDie();
                sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
                if (roll >= VIPER_DESTROYED_MINIMUM_ROLL) {
                    sendNarrationToAll("Critical hit, the viper is destroyed!",game.gameId);
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    return false;
                } else if (roll >= VIPER_DAMAGED_MINIMUM_ROLL) {
                    sendNarrationToAll("The viper is damaged",game.gameId);
                    players[spaceAreas[loc][i].pilot].viperLocation=-1;
                    players[spaceAreas[loc][i].pilot].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[spaceAreas[loc][i].pilot].character.name+" is sent to Sickbay!",game.gameId);
                    spaceAreas[loc].splice(i,1);
                    damagedVipers++;
                    return false;
                } else {
                    sendNarrationToAll("The raider misses!",game.gameId);
                    return false;
                }
            }
        }

        for(let i=0;i<spaceAreas[loc].length;i++) {
            if (spaceAreas[loc][i].type === ShipTypeEnum.CIVILIAN) {
                sendNarrationToAll("Cylon raider attacks a civilian ship!",game.gameId);
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

                    sendNarrationToAll("Cylon raider advances towards the civilian ships",game.gameId);
                    let v = spaceAreas[loc][num];
                    spaceAreas[loc].splice(num,1);
                    spaceAreas[newLocation].push(v);
                    return true;
                }
			}
		}

        sendNarrationToAll("Cylon raider attacks galactica!",game.gameId);
        let roll = rollDie();
        sendNarrationToAll("Cylon raider rolls a " + roll,game.gameId);
        if (roll >= RAIDER_DAMAGES_GALACTICA_MINIMUM_ROLL) {
            sendNarrationToAll("Galactica is hit!",game.gameId);
            damageGalactica();
        } else {
            sendNarrationToAll("The raider misses!",game.gameId);
        }

        return false;
    };

	this.damageVipersInHangar = function(num){
		if(num>vipersInHangar){
			num=vipersInHangar;
		}
		vipersInHangar-=num;
		damagedVipers+=num;
	};
	
    this.addRaptor = function(num){
    	raptorsInHangar+=num;
    	if(raptorsInHangar<0){
            raptorsInHangar=0;
		}else if(raptorsInHangar>NUMBER_OF_RAPTORS){
            raptorsInHangar=NUMBER_OF_RAPTORS;
		}
    };

	this.activateRaiders = function(){
        sendNarrationToAll("Cylons activate raiders!",game.gameId);
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
                            sendNarrationToAll("Basestar can't launch raiders because of hangar damage",game.gameId);
                            continue;
                        }
                        sendNarrationToAll("Basestar launches raiders!",game.gameId);
                        let raidersToLaunch=RAIDERS_LAUNCHED_DURING_ACTIVATION;
                        if(inPlay.indexOf(InPlayEnum.CYLON_SWARM)!==-1){
                            sendNarrationToAll("Cylons are swarming!",game.gameId);
                            raidersToLaunch++;
                        }
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
        sendNarrationToAll("Cylon basestars launch raiders!",game.gameId);
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
                        sendNarrationToAll("Basestar can't launch raiders because of hangar damage",game.gameId);
                        continue;
                    }
                    let raidersToLaunch=RAIDERS_LAUNCHED;
                    if(inPlay.indexOf(InPlayEnum.CYLON_SWARM)!==-1){
                        sendNarrationToAll("Cylons are swarming!",game.gameId);
                        raidersToLaunch++;
                    }
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
        sendNarrationToAll("Cylons activate heavy raiders!",game.gameId);
        if(centurionTrack[centurionTrack.length-1]>0){
            sendNarrationToAll("Centurions kill the crew of Galactica!",game.gameId);
            gameOver();
            return;
        }
        for(let i=centurionTrack.length-2;i>=0;i--){
            if(centurionTrack[i]>0){
                sendNarrationToAll("Centurions advance!",game.gameId);
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
                        sendNarrationToAll("Centurions board Galactica!",game.gameId);
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
                        sendNarrationToAll("Cylon basestar launches heavy raiders!",game.gameId);
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
                        sendNarrationToAll("Basestar can't attack Galactica because of weapons damage",game.gameId);
                        continue;
                    }
                    sendNarrationToAll("Cylon basestar attacks Galactica!",game.gameId);
                    let roll = rollDie();
                    sendNarrationToAll("Cylon basestar rolls a " + roll,game.gameId);
                    if (roll >= BASESTAR_DAMAGES_GALACTICA_MINIMUM_ROLL) {
                        sendNarrationToAll("Galactica is hit!",game.gameId);
                        damageGalactica();
                    } else {
                        sendNarrationToAll("The basestar misses!",game.gameId);
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
									'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+
                                    "(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                                return;
                            }
                        }

                        sendNarrationToPlayer(players[activePlayer].userId, "Done placing ships");
						phase=GamePhaseEnum.MAIN_TURN;
                        if (hasAction())
                            this.nextAction(game);
                        else nextTurn();
                        return;
					}
				}
            }
        }

        sendNarrationToPlayer(players[activePlayer].userId, "Can't place there");
		return;
	};

	let calcShipsToPlace = function(){
        let shipCount=countShips();
        for(let type in ShipTypeEnum){
            shipNumberToPlace[ShipTypeEnum[type]]=0;
        }
        for(let type in ShipTypeEnum){
        	let num = shipPlacementLocations[ShipTypeEnum[type]].length;
        	let num2 = num;
        	switch(ShipTypeEnum[type]){
				case ShipTypeEnum.BASESTAR:
					num2=MAX_BASESTARS-shipCount[ShipTypeEnum.BASESTAR];
					break;
				case ShipTypeEnum.RAIDER:
                    num2=MAX_RAIDERS-shipCount[ShipTypeEnum.RAIDER];
                    break;
                case ShipTypeEnum.HEAVY_RAIDER:
                   	num2=MAX_HEAVY_RAIDERS-shipCount[ShipTypeEnum.HEAVY_RAIDER];
                    break;
                case ShipTypeEnum.VIPER:
                	num2=vipersInHangar;
                    break;
                case ShipTypeEnum.CIVILIAN:
                    num2=decks[DeckTypeEnum.CIV_SHIP].deck.length;
                    break;
                default:
					break;
			}
            shipNumberToPlace[ShipTypeEnum[type]]=Math.min(num,num2);
        }

        let needToPlaceManually=false;
        for(let type in ShipTypeEnum){
            if(shipPlacementLocations[ShipTypeEnum[type]]!=null&&shipPlacementLocations[ShipTypeEnum[type]].length
                ===shipNumberToPlace[ShipTypeEnum[type]]){
                for(let i=0;i<shipPlacementLocations[ShipTypeEnum[type]].length;i++){
                    console.log(shipPlacementLocations[ShipTypeEnum[type]]);
                    if(ShipTypeEnum[type]===ShipTypeEnum.CIVILIAN){
                        let ship=new Ship(ShipTypeEnum.CIVILIAN);
                        ship.resource=drawCard(decks[DeckTypeEnum.CIV_SHIP]);
                        spaceAreas[shipPlacementLocations[ShipTypeEnum[type]][i]].push(ship);
                    }else{
                        spaceAreas[shipPlacementLocations[ShipTypeEnum[type]][i]].push(new Ship(ShipTypeEnum[type]));
                    }
                    if(ShipTypeEnum[type]===ShipTypeEnum.VIPER){
                        vipersInHangar--;
                    }
                }
                shipNumberToPlace[ShipTypeEnum[type]]=0;
                shipPlacementLocations[type]=[];
            }else{
                needToPlaceManually=true;
            }
        }

        if(needToPlaceManually){
            for(let type in ShipTypeEnum){
                if(shipNumberToPlace[ShipTypeEnum[type]]>0) {
                    sendNarrationToPlayer(players[activePlayer].userId,
                        'Place '+shipNumberToPlace[ShipTypeEnum[type]]+" "+ShipTypeEnum[type]+
                        "(s) at the following options:"+shipPlacementLocations[ShipTypeEnum[type]]);
                    phase = GamePhaseEnum.PLACE_SHIPS;
                    return true;
                }
            }
        }

        return false;
	};

	this.activateCylons = type => {
		//Cylon activation step
		if(type===CylonActivationTypeEnum.ACTIVATE_RAIDERS){
            this.activateRaiders();
        }else if(type===CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS){
            this.activateHeavyRaiders();
		}else if(type===CylonActivationTypeEnum.ACTIVATE_BASESTARS){
            this.activateBasestars();
        }else if(type===CylonActivationTypeEnum.LAUNCH_RAIDERS){
            this.launchRaiders();
        }else if(type===CylonActivationTypeEnum.NONE){

        }

        //Cylon attack cards
        else if(type===CylonActivationTypeEnum.AMBUSH){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.BESIEGED){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.BOARDING_PARTIES){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.CYLON_SWARM){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.HEAVY_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
			if(calcShipsToPlace()){
				return;
			}
        }
        else if(type===CylonActivationTypeEnum.JAMMED_ASSAULT){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.W);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.RAIDING_PARTY){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.SURROUNDED){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.NW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.TACTICAL_STRIKE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.SW);
            shipPlacementLocations[ShipTypeEnum.HEAVY_RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            if(calcShipsToPlace()){
                return;
            }
        }
        else if(type===CylonActivationTypeEnum.THIRTY_THREE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.VIPER].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.NE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SE);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.SW);
            if(calcShipsToPlace()){
                return;
            }
        }

        //Other
        else if(type===CylonActivationTypeEnum.RESCUE_THE_FLEET){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CRIPPLED_RAIDER){
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CYLON_TRACKING_DEVICE){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }else if(type===CylonActivationTypeEnum.CYLON_AMBUSH){
            shipPlacementLocations[ShipTypeEnum.BASESTAR].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.RAIDER].push(SpaceEnum.W);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            shipPlacementLocations[ShipTypeEnum.CIVILIAN].push(SpaceEnum.E);
            if(calcShipsToPlace()){
                return;
            }
        }

        //if any instructions on what to do next exist, do them, else go to next turn
        if (hasAction())
            this.nextAction(game);
        else nextTurn();
        
        return;
	};
    
	let damageGalactica=function(){
        let damageType=drawCard(decks[DeckTypeEnum.GALACTICA_DAMAGE]);
        sendNarrationToAll("Basestar damages "+damageType+"!",game.gameId);
        damageLocation(damageType);
		return;
	};

    let damageLocation=function(loc){
        if(loc===GalacticaDamageTypeEnum.FOOD){
            game.addFood(-1);
        }else if(loc===GalacticaDamageTypeEnum.FUEL){
            game.addFuel(-1);
        }else{
            damagedLocations[loc]=true;
            let totalDamage=0;
            for(let i=0;i<damagedLocations.length;i++){
                if(damagedLocations[i]){
                    totalDamage++;
                }
            }
            if(totalDamage>=6){
                sendNarrationToAll("Galactica is destroyed!",game.gameId);
                gameOver();
            }
            for(let i=0;i<players.length;i++){
                if(players[i].location===loc&&players[i].viperLocation===-1){
                    players[i].location=LocationEnum.SICKBAY;
                    sendNarrationToAll(players[i].character.name+" is sent to Sickbay!",game.gameId);
                }
            }
        }
    };

    let sendPlayerToLocation = function(player, location){
        if(players[player].viperLocation!==-1){
            for(let i=0;i<spaceAreas[players[player].viperLocation].length;i++){
                if(spaceAreas[players[player].viperLocation][i].pilot===player){
                    spaceAreas[players[player].viperLocation].splice(i,1);
                    players[player].viperLocation=-1;
                    vipersInHangar++;
                    break;
                }
            }
        }
        sendNarrationToAll(players[player].character.name + " is sent to " + location,game.gameId);
        players[player].location = location;
    };

	let playQuorumCard = num => {
        activeQuorum = quorumHand[num];
        quorumHand.splice(num,1);
        readCard(activeQuorum).action(game);
	};
    
    this.afterQuorum = discardBool => {
        
        if (discardBool)
            decks[DeckTypeEnum.QUORUM].discard.push(activeQuorum);
        activeQuorum = null;
        
        playCrisis(this.drawCard(this.getDecks()[DeckTypeEnum.CRISIS]));
        
    };
    
    let launchNuke = function(text){
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
        }else if(spaceAreas[loc][num].type!==ShipTypeEnum.BASESTAR){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a basestar');
            return;
        }
        sendNarrationToAll(players[activePlayer].character.name+" launches a nuke at the basestar to the "+loc+"!",game.gameId);
        let roll=rollDie();
        sendNarrationToAll(players[activePlayer].character.name+" rolls a "+roll,game.gameId);
        if(spaceAreas[loc][num].damage[0]==BasestarDamageTypeEnum.STRUCTURAL||
            spaceAreas[loc][num].damage[1]==BasestarDamageTypeEnum.STRUCTURAL){
            roll+=2;
            sendNarrationToAll("Roll upgraded to "+roll+" by basestar structural damage",game.gameId);
        }
        if(roll>6){
            destroyBasestar(loc,num);
            let raidersDestroyed=0;
            for(let i=0;i<spaceAreas[loc].length&&raidersDestroyed<RAIDERS_DESTROYED_BY_NUKE;i++){
				if(spaceAreas[loc][num].type===ShipTypeEnum.RAIDER){
                    spaceAreas[loc].splice(num,i);
                    raidersDestroyed++;
                    i--;
                }
			}
			if(raidersDestroyed>0){
                sendNarrationToAll(raidersDestroyed+" raiders were also destroyed!",game.gameId);
            }
		}else if(roll>2){
            destroyBasestar(loc,num);
        }else{
			let bs=spaceAreas[loc][num];
			damageBasestar(loc,num);
			if(spaceAreas[loc][num]===bs) {
                damageBasestar(loc, num);
            }
        }
        phase=GamePhaseEnum.MAIN_TURN;
    };

    let runCylonReveal = function(num){
        sendNarrationToAll(players[activePlayer].character.name+" reveals as a Cylon!",game.gameId);
        if(players[activePlayer].location===LocationMap.BRIG){
            sendNarrationToAll(players[activePlayer].character.name+" was in the brig and couldn't cause any damage",game.gameId);
        }
        players[activePlayer].isRevealedCylon=true;
        sendPlayerToLocation(activePlayer,LocationEnum.RESURRECTION_SHIP);
        players[activePlayer].superCrisisHand.push(decks[DeckTypeEnum.SUPER_CRISIS].deck.pop());
        let card=players[activePlayer].loyalty[num];
        players[activePlayer].revealedLoyalty.push(card);
        players[activePlayer].loyalty.splice(num,1);
        if(players[activePlayer].location!==LocationMap.BRIG) {
            card.action(game);
        }
	};
    
    this.cylonDamageGalactica = function(){
        let damageOptions=[];
        for(let i=0;i<5;i++){
            let damage=game.getDecks()[DeckTypeEnum.GALACTICA_DAMAGE].deck.pop();
            damageOptions.push(damage);
            sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId,i+": "+damage);
        }
        game.setDamageOptions(damageOptions);
    	phase=GamePhaseEnum.CYLON_DAMAGE_GALACTICA;
	};

    let cylonDamageGalactica = function(text){
        let input=text.split(" ");
        if(input.length!==2||isNaN(input[0])||isNaN(input[1])||input[0]>game.getDamageOptions().length||input[1]>game.getDamageOptions().length){
            sendNarrationToPlayer(game.getPlayers()[game.getActivePlayer()].userId, 'Invalid input');
            return;

        }
        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" damages "+game.getDamageOptions()[input[0]]+"!",game.gameId);
        damageLocation(game.getDamageOptions()[input[0]]);
        sendNarrationToAll(game.getPlayers()[game.getActivePlayer()].character.name+" damages "+game.getDamageOptions()[input[1]]+"!",game.gameId);
        damageLocation(game.getDamageOptions()[input[1]]);
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
                            +LocationEnum[players[activePlayer].location],game.gameId);
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
                sendNarrationToAll(players[activePlayer].character.name + " repairs the "+LocationEnum.HANGAR_DECK,game.gameId);
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
                sendNarrationToAll(players[activePlayer].character.name + " repairs two damaged vipers",game.gameId);
                return
            }else if(damagedVipers>0){
                damagedVipers--;
                vipersInHangar++;
                sendNarrationToAll(players[activePlayer].character.name + " repairs a damaged viper",game.gameId);
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
			if(players[activePlayer].isRevealedCylon){
                sendNarrationToPlayer(players[activePlayer].userId, 'Revealed cylons can\'t use skill card abilities!');
                return;
			}
            let num=parseInt(text.substr(5));
            if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid hand card');
                return;
            }

            let card=players[activePlayer].hand[num];
            if(playSkillCardAction(card)){
                addToActionPoints(-1);
			}
            return;
		}else if(text.substr(0,6).toUpperCase()==="QUORUM" && text.length>7){
            if(players[activePlayer].isRevealedCylon){
                sendNarrationToPlayer(players[activePlayer].userId, 'Revealed cylons can\'t use quorum card abilities!');
                return;
            }
            let num=parseInt(text.substr(7));
            if(isNaN(num) || num<0 || num>=quorumHand.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid quorum card');
                return;
            }
            if(readCard(quorumHand[num]).name===QuorumMap.PRESIDENTIAL_PARDON.name){
                let foundBrig=false;
                for(let i=0;i<players.length;i++){
                    if(players[i].location===LocationEnum.BRIG){
                        foundBrig=true;
                        break;
                    }
                }
                if(!foundBrig){
                    sendNarrationToPlayer(players[activePlayer].userId, 'No one is in the Brig');
                    return;
                }
            }
            playQuorumCard(num);
            return;
        }if(text.toUpperCase()==="ACTIVATE"){
            let success=activateLocation(players[activePlayer].location);
            if(success && players[activePlayer].viperLocation===-1){
                addToActionPoints(-1);
            }
            return;
        }else if(text.toUpperCase()==="NUKE"){
			if(activePlayer!==currentAdmiral){
                sendNarrationToPlayer(players[activePlayer].userId, "You're not the admiral!");
                return;
            }else if(nukesRemaining===0){
                sendNarrationToPlayer(players[activePlayer].userId, "No nukes left");
				return;
			}
            let count=countShips();
            if(count[ShipTypeEnum.BASESTAR]===0){
                sendNarrationToPlayer(players[activePlayer].userId, "No basestars to nuke");
                return;
            }
            addToActionPoints(-1);
            phase = GamePhaseEnum.LAUNCH_NUKE;
            sendNarrationToPlayer(players[activePlayer].userId, "Select the space location and number of the basestar to nuke");
            return;
        }else if(text.toUpperCase().substr(0,7)==="LOYALTY"){
            let num=parseInt(text.substr(8));
            if(isNaN(num) || num<0 || num>players[activePlayer].loyalty.length){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid card');
                return;
            }else if(players[activePlayer].loyalty[num].role!=="cylon"){
                sendNarrationToPlayer(players[activePlayer].userId, 'Not a cylon card');
                return;
            }
            addToActionPoints(-1);
            runCylonReveal(num);
            return;
        }
        else if(text.toUpperCase()==="NOTHING"){
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

                            sendNarrationToAll(players[activePlayer].character.name + " stops piloting their viper",game.gameId);
                            vipersInHangar++;
                            players[activePlayer].viperLocation=-1;
						}

						players[activePlayer].location = LocationEnum[l];
						currentMovementRemaining--;
						sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l],game.gameId);
						sendNarrationToPlayer(players[activePlayer].userId, "Discard a card to continue");
						phase=GamePhaseEnum.DISCARD_FOR_MOVEMENT;
						return;
					}
				}

				players[activePlayer].location = LocationEnum[l];
				currentMovementRemaining--;
                activeMovementRemaining--;
                sendNarrationToAll(players[activePlayer].character.name + " moves to " + LocationEnum[l],game.gameId);
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
                            " moves in viper from "+players[activePlayer].viperLocation+" to "+SpaceEnum[text],game.gameId);
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
            let num=parseInt(text.substr(2));
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
        let num=parseInt(text.substr(5,1));
        if(isNaN(num) || num<0 || num>=players[activePlayer].hand.length){
            sendNarrationToPlayer(players[activePlayer].userId, 'Not a valid card');
            return;
        }

        let cardName=(players[activePlayer].hand)[num].name+" "+(players[activePlayer].hand)[num].value;
        players[activePlayer].hand.splice(num,1);
        sendNarrationToAll(players[activePlayer].character.name+" discards "+cardName,game.gameId);
		phase=GamePhaseEnum.MAIN_TURN;
    };
	
	let makeChoice = text => {
        if (choice2 === null) {
            if (isNaN(parseInt(text)) || parseInt(text) < 0 || parseInt(text) >= choiceOptions.length)
                return;
            choice1(this, parseInt(text));
        } else if (choice1 === null) {
            choice1(this, text);
        } else {
            if (text === '0') choice1(this);
            else if (text === '1') choice2(this);
            else return;
        }
        if (hasAction())
            this.nextAction(this);
    };
	
	let singlePlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand.length - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    this.discardSkill(activePlayer, x);
            discardAmount = 0;
            this.nextAction(this);
        } else {
        	sendNarrationToPlayer(players[activePlayer].userId,
                `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
                players[activePlayer].hand.length -1}`);
        }
    };
	
	let eachPlayerDiscardPick = text => {
        let indexes = isLegitIndexString(text, players[activePlayer].hand.length, discardAmount);
        if (indexes !== false) {
            for (let x = players[activePlayer].hand.length - 1; x > -1; x--)
                if (indexes.indexOf(x) > -1)
                    this.discardSkill(activePlayer, x);
            if (++playersChecked === players.length) {
                playersChecked = 0;
                discardAmount = 0;
                this.nextAction(this);
            } else {
                nextActive();
                if (players[activePlayer].hand.length <= discardAmount) {
    //if you set discardAmount to the players hand length then it will be that way for all players who have to discard
                    while (players[activePlayer].hand.length <= discardAmount) {
                        for (let x = 0; x < discardAmount; x++)
                            this.discardRandomSkill(activePlayer);
                        if (++playersChecked === players.length) {
                            playersChecked = 0;
                            discardAmount = 0;
                            this.nextAction(this);
                            return;
                        } else {
                            nextActive();
                            sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                                discardAmount} skill cards to discard`);
                        }
                    }
                } else sendNarrationToPlayer(players[activePlayer].userId, `Please choose ${
                    discardAmount} skill cards to discard`);
            }
        } else sendNarrationToPlayer(players[activePlayer].userId,
            `illegitimate input: please enter a string of ${discardAmount} indexes from 0 to ${
            players[activePlayer].hand.length -1}`);
    };
	
	let calculateSkillCheckCards = () => {
	    let count = 0;
        sendNarrationToAll('Two random cards are added from the destiny deck.',game.gameId);
        skillCheckCards.push(drawDestiny());
        skillCheckCards.push(drawDestiny());
	    shuffle(skillCheckCards);
	    console.log(skillCheckCards);
	    for (let x = skillCheckCards.length -1; x > -1; x--) {
	        let card = skillCheckCards[x];
	        sendNarrationToAll(`Counting skill check reveals: ${card.name} ${card.value} - ${card.type}`,game.gameId);
	        count += card.value * (arrHasValue(skillCheckTypes, card.type) ? 1 : -1);
        }
        sendNarrationToAll(`Skill Check count results: ${count}`,game.gameId);
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
            sendNarrationToAll(players[activePlayer].character.name+" passes",game.gameId);
		}else{
            let indexes = false;
            for (let x = 1; x <= players[activePlayer].hand.length; x++) {
                indexes = isLegitIndexString(text, players[activePlayer].hand.length, x);
                if (indexes !== false)
                    x = 420;
            }
            console.log(indexes);
            if (indexes === false){
                sendNarrationToPlayer(players[activePlayer].userId, 'does not compute');
                return;
            }
            if(players[activePlayer].isRevealedCylon&&indexes.length>1){
                sendNarrationToPlayer(players[activePlayer].userId, 'Can\'t contribute more than 1 card as a revealed cylon');
                return;
			}
            for (let x = 0; x < indexes.length; x++) {
                let player = players[activePlayer];
                let card = player.hand[indexes[x]];
                let revealString = `${card.type}: ${card.name} ${card.value}`;
                sendNarrationToAll(`${player.character.name} added a ${
                    revealSkillChecks ? revealString : 'card'} to the skill check.`,game.gameId);
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
                sendNarrationToAll("Crisis passed!",game.gameId);
                skillPass(this);
            }else if (temp >= middleValue && middleValue !== -1) {
                sendNarrationToAll("Crisis partially pass",game.gameId);
                skillMiddle(this);
            }else{
                sendNarrationToAll("Crisis failed!",game.gameId);
                skillFail(this);
            }
        } else {
            nextActive();
            sendNarrationToPlayer(players[activePlayer].userId, skillText);
        }
    };
	
	let didSecondRound = false;
	let playDestination = card => {
        console.log("in play destination");

        let cardJSON = readCard(card);
        activeDestinations=null;
	    destinations.push(card);
	    
	    distanceTrack += cardJSON.value;
	    
	    if (distanceTrack > 4 && !didSecondRound) {
	        didSecondRound = true;
            dealLoyaltyCards();
        }
        
        if (distanceTrack > 7) {
	        //end game?
        }

	    switch (phase) {
            case GamePhaseEnum.END_TURN :
                cardJSON.action(this, () => nextTurn() );
                break;
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
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.PRESS_ROOM,game.gameId);
                sendNarrationToAll(players[activePlayer].character.name + " draws 2 Politics skill cards",game.gameId);
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                players[activePlayer].hand.push(drawCard(decks[DeckTypeEnum.POLITICS]));
                return true;
            case LocationEnum.PRESIDENTS_OFFICE:
                if(activePlayer===currentPresident){
                    LocationMap.PRESIDENTS_OFFICE.action(game);
                }else{
                    sendNarrationToPlayer(activePlayer, "You're not the president");
                    return false;
                }
                return false;
            case LocationEnum.ADMINISTRATION:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.ADMINISTRATION,game.gameId);
                LocationMap.ADMINISTRATION.action(game);
                return false;
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

                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.FTL_CONTROL,game.gameId);
                let roll = rollDie();
                sendNarrationToAll(players[activePlayer].character.name + " roll a " + roll,game.gameId);
                if (roll < 7) {
                    //this.addPopulation(-popLoss);
                    populationAmount -= popLoss;
                    sendNarrationToAll(popLoss + " population was left behind!",game.gameId);
                } else {
                    sendNarrationToAll("Everyone made it safely!",game.gameId);
                }

                return true;
			case LocationEnum.WEAPONS_CONTROL:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.WEAPONS_CONTROL,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Select a space location and a ship number");
                phase = GamePhaseEnum.WEAPONS_ATTACK;
                return true;
            case LocationEnum.COMMUNICATIONS:
                if(inPlay.indexOf(InPlayEnum.JAMMED_ASSAULT)!==-1){
                    sendNarrationToPlayer(players[activePlayer].userId, "Communications has been jammed!");
                    return;
                }
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.COMMUNICATIONS,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Select a space location and a ship number");
                let count=countShips();
                if(count[ShipTypeEnum.CIVILIAN]===0){
                    sendNarrationToPlayer(players[activePlayer].userId, "No civilian ships to activate");
                    return;
				}else if(count[ShipTypeEnum.CIVILIAN]===1){
                    civilianShipsToReveal=1;
                }else{
                    civilianShipsToReveal=2;
                }
                phase = GamePhaseEnum.REVEAL_CIVILIANS;
                return true;
            case LocationEnum.RESEARCH_LAB:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.RESEARCH_LAB,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId, "Select 0 for Engineering or 1 for Tactics");
                phase = GamePhaseEnum.PICK_RESEARCH_CARD;
                return true;
            case LocationEnum.COMMAND:
                sendNarrationToAll(players[activePlayer].character.name + " activates " + LocationEnum.COMMAND,game.gameId);
                sendNarrationToPlayer(players[activePlayer].userId,
                    "Select a viper to activate, or select the SW or SE space area to launch a viper");
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
                    sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.HANGAR_DECK,game.gameId);
                    sendNarrationToPlayer(players[activePlayer].userId,
                        "Select 0 for Southwest launch or 1 for Southeast launch");
                    addToActionPoints(1);
                    phase=GamePhaseEnum.PICK_LAUNCH_LOCATION;
                    return true;
				}else{
                    sendNarrationToPlayer(players[activePlayer].userId, "No vipers left to pilot");
            		return false;
				}
                return true;
            case LocationEnum.ARMORY:
            	for(let i=0;i<centurionTrack.length;i++){
            		if(centurionTrack[i]>0){
                        sendNarrationToAll(players[activePlayer].character.name+" activates "+LocationEnum.ARMORY,game.gameId);
                        sendNarrationToPlayer(players[activePlayer].userId, "Select a centurion on the boarding track");
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
        text=text.toString();
    	if(text.toUpperCase()==="HAND"){
            let hand=players[getPlayerNumberById(userId)].hand;
            let handText="Hand:<br>";
    		for(let i=0;i<hand.length;i++){
                handText+=i+": "+hand[i].name+" "+hand[i].value+" - "+hand[i].type+"<br>";
			}
            sendNarrationToPlayer(userId, handText);
            return;
		}else if (text.toUpperCase()==="LOYALTY") {
            let loyalty=players[getPlayerNumberById(userId)].loyalty;
            let loyaltyText="Loyalty:<br>";
            for(let i=0;i<loyalty.length;i++){
                loyaltyText+=loyalty[i].name+"- "+loyalty[i].text+",<br>";
            }
            loyalty=players[getPlayerNumberById(userId)].revealedLoyalty;
            loyaltyText+="Revealed:<br>";
            for(let i=0;i<loyalty.length;i++){
                loyaltyText+=loyalty[i].name+"- "+loyalty[i].text+",<br>";
            }
            sendNarrationToPlayer(userId, loyaltyText);
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
            		msg+=readCard(quorumHand[i]).name+",";
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
            msg+="Raptors: "+raptorsInHangar+"<br>";
        	msg+="Damaged Locations: ";
        	for(let type in GalacticaDamageTypeEnum){
        		if(damagedLocations[GalacticaDamageTypeEnum[type]]){
                    msg+=GalacticaDamageTypeEnum[type]+",";
                }
            }
            msg+="<br>";
        	msg+="Centurions:"+centurionTrack+"<br>";
            msg+="Jump:"+jumpTrack+"/5";
            sendNarrationToPlayer(userId, msg);
            return;
        }else if(text.toUpperCase()==="INPLAY") {
            sendNarrationToPlayer(userId, this.inPlay());
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
        }else if(phase===GamePhaseEnum.REVEAL_CIVILIANS){
            revealCivilians(text);
        }else if(phase===GamePhaseEnum.MOVE_CIVILIANS){
            moveCivilians(text);
        }else if(phase===GamePhaseEnum.PLACE_SHIPS){
            placeShips(text);
        }else if(phase===GamePhaseEnum.MAIN_TURN){
            doMainTurn(text);
        }else if(phase===GamePhaseEnum.DISCARD_FOR_MOVEMENT){
            discardForMovement(text);
        }else if(phase===GamePhaseEnum.CHOOSE){
            makeChoice(text);
        }else if (phase === GamePhaseEnum.SKILL_CHECK) {
            doSkillCheckPick(text);
        }else if (phase === GamePhaseEnum.EACH_PLAYER_DISCARDS) {
            eachPlayerDiscardPick(text)
        }else if (phase === GamePhaseEnum.SINGLE_PLAYER_DISCARDS) {
            singlePlayerDiscardPick(text);
        }else if (phase === GamePhaseEnum.LAUNCH_NUKE) {
            launchNuke(text);
        }else if (phase === GamePhaseEnum.CYLON_DAMAGE_GALACTICA) {
            cylonDamageGalactica(text);
        }

        game.doPostAction();
	};

    this.doPostAction = function(){
        console.log("in do post action");
        if(currentActionsRemaining===0&&phase===GamePhaseEnum.MAIN_TURN&&!players[currentPlayer].isRevealedCylon){
            doCrisisStep();
        }
        for(let i=0;i<players.length;i++){
            sendGameState(i);
        }
    };
	
	this.save = () => {
	    let savedGame = {};
	    savedGame.gameId = this.gameId;
	    savedGame.players = players;
	    savedGame.currentPlayer = currentPlayer;
	    savedGame.phase = phase;
	    savedGame.activePlayer = activePlayer;
	    savedGame.currentMovmentRemaining = currentMovementRemaining;
	    savedGame.activeMovementRemaining = activeMovementRemaining;
        savedGame.currentActionsRemaining = currentActionsRemaining;
        savedGame.activeActionsRemaining = activeActionsRemaining;
        savedGame.spaceAreas = spaceAreas;
        savedGame.availableCharacters = availableCharacters;
        savedGame.charactersChosen = charactersChosen;
        savedGame.discardAmount = discardAmount;
        savedGame.activeCrisis = activeCrisis;
        savedGame.revealSkillChecks = revealSkillChecks;
        
        //functions
        savedGame.nextAction = hasAction() ? ('' + this.nextAction) : 'null';
        savedGame.choice1 = choice1 != null ? (choice1 + '') : 'null';
        savedGame.choice2 = choice2 != null ? (choice1 + '') : 'null';
        
        
        savedGame.choiceText = choiceText;
        savedGame.playersChecked = playersChecked;
        savedGame.passValue = passValue;
        savedGame.middleValue = middleValue;
        savedGame.skillText = skillText;
        savedGame.skillCheckTypes = skillCheckTypes;
        
        //functions
        savedGame.skillPass = skillPass + '';
        savedGame.skillMiddle = skillMiddle + '';
        savedGame.skillFail = skillFail + '';
        
        
        savedGame.vipersInHangar = vipersInHangar;
        savedGame.raptorsInHangar = raptorsInHangar;
        savedGame.damagedVipers = damagedVipers;
        savedGame.fuelAmount = fuelAmount;
        savedGame.foodAmount = foodAmount;
        savedGame.moraleAmount = moraleAmount;
        savedGame.populationAmount = populationAmount;
        savedGame.inPlay = inPlay;
        savedGame.centurionTrack = centurionTrack;
        savedGame.jumpTrack = jumpTrack;
        savedGame.distanceTrack = distanceTrack;
        savedGame.damagedLocations = damagedLocations;
        savedGame.nukesRemaining = nukesRemaining;
        savedGame.currentPresident = currentPresident;
        savedGame.currentAdmiral = currentAdmiral;
        savedGame.currentArbitrator = currentArbitrator;
        savedGame.currentMissionSpecialist = currentMissionSpecialist;
        savedGame.currentVicePresident = currentVicePresident;
        savedGame.quorumHand = quorumHand;
        savedGame.skillCheckCards = skillCheckCards;
        savedGame.vipersToActivate = vipersToActivate;
        savedGame.currentViperLocation = currentViperLocation;
        savedGame.civilianShipsToReveal = civilianShipsToReveal;
        savedGame.currentCivilianShipLocation = currentCivilianShipLocation;
        savedGame.shipNumberToPlace = shipNumberToPlace;
        savedGame.shipPlacementLocations = shipPlacementLocations;
        savedGame.damageOptions = damageOptions;
        savedGame.decks = decks;
	    return savedGame;
    };
    
    this.restore = savedGame => {
        this.gameId = savedGame.gameId;
        players = savedGame.players;
        currentPlayer = savedGame.currentPlayer;
        phase = savedGame.phase;
        activePlayer = savedGame.activePlayer;
        currentMovementRemaining = savedGame.currentMovmentRemaining;
        activeMovementRemaining = savedGame.activeMovementRemaining;
        currentActionsRemaining = savedGame.currentActionsRemaining;
        activeActionsRemaining = savedGame.activeActionsRemaining;
        spaceAreas = savedGame.spaceAreas;
        availableCharacters = savedGame.availableCharacters;
        charactersChosen = savedGame.charactersChosen;
        discardAmount = savedGame.discardAmount;
        activeCrisis = savedGame.activeCrisis;
        revealSkillChecks = savedGame.revealSkillChecks;
        
        //functions
        this.nextAction = eval(savedGame.nextAction);
        choice1 = eval(savedGame.choice1);
        choice2 = eval(savedGame.choice2);
    
        choiceText = savedGame.choiceText;
        playersChecked = savedGame.playersChecked;
        passValue = savedGame.passValue;
        middleValue = savedGame.middleValue;
        skillText = avedGame.skillText;
        skillCheckTypes = savedGame.skillCheckTypes;
        
        //functions
        skillPass = eval(savedGame.skillPass);
        skillMiddle = eval(savedGame.skillMiddle);
        skillFail = eval(savedGame.skillFail);
    
        vipersInHangar = savedGame.vipersInHangar;
        raptorsInHangar = savedGame.raptorsInHangar;
        damagedVipers = savedGame.damagedVipers;
        fuelAmount = savedGame.fuelAmount;
        foodAmount = savedGame.foodAmount;
        moraleAmount = savedGame.moraleAmount;
        populationAmount = savedGame.populationAmount;
        inPlay = savedGame.inPlay;
        centurionTrack = savedGame.centurionTrack;
        jumpTrack = savedGame.jumpTrack;
        distanceTrack = savedGame.distanceTrack;
        damagedLocations = savedGame.damagedLocations;
        nukesRemaining = savedGame.nukesRemaining;
        currentPresident = savedGame.currentPresident;
        currentAdmiral = savedGame.currentAdmiral;
        currentArbitrator = savedGame.currentArbitrator;
        currentMissionSpecialist = savedGame.currentMissionSpecialist;
        currentVicePresident = savedGame.currentVicePresident;
        quorumHand = savedGame.quorumHand;
        skillCheckCards = savedGame.skillCheckCards;
        vipersToActivate = savedGame.vipersToActivate;
        currentViperLocation = savedGame.currentViperLocation;
        civilianShipsToReveal = savedGame.civilianShipsToReveal;
        currentCivilianShipLocation = savedGame.currentCivilianShipLocation;
        shipNumberToPlace = savedGame.shipNumberToPlace;
        shipPlacementLocations = savedGame.shipPlacementLocations;
        damageOptions = savedGame.damageOptions;
        decks = savedGame.decks;
    };
    
    setUpNewGame();
    
}

const rollDie = () => Math.ceil(Math.random() * 8);

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

function Player(userId, username){
    this.username=username;
	this.userId=userId;
	this.gameId='none';
	this.character=-1;
	this.hand=[];
    this.superCrisisHand=[];
    this.loyalty=[];
    this.revealedLoyalty=[];
    this.usedOncePerGame=false;
	this.isRevealedCylon=false;
	this.viperLocation=-1;
	this.ready = false;
}

function Table(host) {
    this.host = host;
    this.gameId = Math.random().toString(36);
    this.players = [];
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

io.on('connection', socket => {
    
    let userId = socket.id;
    let user;
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
      
        let available = true;
        for (let id in users)
            if (users[id].username === username)
                available = false;
        if (available) {
    
            name = username;
            io.to(userId).emit('login', name);
            
            if (username in offLineUsers) {
                let oldUser = offLineUsers[username];
                let game = games[oldUser.gameId];
                
                users[userId] = game.getPlayers()[oldUser.index];
                users[userId].userId = userId;
                user = users[userId];
                
                io.to(userId).emit('clear');
                sendNarrationToPlayer(userId, 'You have re-joined the game, welcome back.');
                sendNarrationToAll(`We have regained communication with ${
                    games[user.gameId].getPlayers()[oldUser.index].character.name}`, user.gameId);
                
                delete offLineUsers[name];
                
                if (dataBaseOn) {
                    client.query(`DELETE FROM users WHERE name = '${name}';`);
                }
                
            }  else {
                
                users[userId] = new Player(userId, username);
                user = users[userId];
                lobby[name] = userId;
                for (let key in lobby)
                    io.to(lobby[key]).emit('lobby', tables);
    
            }
            
        }
    });
    
    socket.on('game_text', text => runCommand(text,userId,user.gameId));
    
    socket.on('new_table', () => {
        delete lobby[users[userId].username];
        let newTable = new Table(name);
        user.gameId = newTable.gameId;
        newTable.players.push(user);
        tables[user.gameId] = newTable;
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
        io.to(userId).emit('table', newTable);
    });
    
    socket.on('join_table', gameId =>{
        console.log('join table');
        let table = tables[gameId];
        user.gameId = gameId;
        table.players.push(user);
        delete lobby[name];
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
    
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('table', table);
    });
    
    socket.on('ready', () => {
        let table = tables[user.gameId];
        let player;
        for (let x = 0; x < table.players.length; x++)
            if (table.players[x].username === name)
                player = x;
        table.players[player].ready = !table.players[player].ready;
        
        let count = 0;
        for (let x = 0; x < table.players.length; x++)
            if (table.players[x].ready)
                count++;
        
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('table', table);
    });
    
    socket.on('start_game', handicap => {
        let table = tables[user.gameId];
        for (let x = 0; x < table.players.length; x++)
            io.to(table.players[x].userId).emit('clear');
    
        games[user.gameId] = new Game(table.players,user.gameId,handicap);
    
        if (dataBaseOn) {
            client.query(`INSERT INTO games (id, game) VALUES ('${
                user.gameId}', '${JSON.stringify(games[user.gameId].save())}');`);
        }
    
        delete tables[user.gameId];
        for (let key in lobby)
            io.to(lobby[key]).emit('lobby', tables);
    });
    
    //when a user disconnects remove them from users
    socket.on('disconnect', () => {
    
        if (name !== 'error') {
    
            if (user.gameId in tables) {
                let index;
                for (let x = 0; x < tables[user.gameId].players.length; x++)
                    if (tables[user.gameId].username === name)
                        index = x;
        
                if (name === tables[user.gameId].host) {
                    
                    //put players back in lobby
                    for (let x = 0; x < tables[user.gameId].players.length; x++)
                        if (tables[user.gameId].players[x].username !== name)
                            lobby[tables[user.gameId].players[x].username] = tables[user.gameId].players[x].userId;
                    
                    delete tables[user.gameId];
    
                } else {
                    
                    tables[user.gameId].players.splice(index, 1);
            
                    for (let x = 0; x < tables[user.gameId].players.length; x++)
                        io.to(tables[user.gameId].players[x].userId).emit('table', tables[user.gameId]);
            
                }
        
                for (let key in lobby)
                    io.to(lobby[key]).emit('lobby', tables);
        
            } else if (user.gameId in games) {
                let index = 'index finding error';
                for (let x = 0; x < games[user.gameId].getPlayers().length; x++)
                    if (games[user.gameId].getPlayers()[x].username === name)
                        index = x;
        
                sendNarrationToAll(`Oh no! we've lost communication with ${
                    games[user.gameId].getPlayers()[index].character.name}`, user.gameId);
                
                offLineUsers[name] = new LoggedOut(user.gameId, index);
                
                if (dataBaseOn) {
                    client.query(`INSERT INTO users (name, gameid, index) VALUES ('${name}','${user.gameId}',${index})`);
                }
        
            } else if (name in lobby) delete lobby[name];
    
            delete users[userId];
    
        }
        
    });
    
});

function sendGameStateToPlayer(userId, gameState){
    io.to(userId).emit('gameState', gameState);
}

function sendNarrationToPlayer(userId, narration){
	if(userId===-1){
		for(let key in users){
			io.to(users[key]).emit('game_text', narration);
		}
	}else{
		io.to(userId).emit('game_text', '<p>'+narration+"</p>");
	}
}

function sendNarrationToAll(narration, gameId){
    let game = games[gameId];
    for(let x = 0; x < game.getPlayers().length; x++){
        io.to(game.getPlayers()[x].userId).emit('game_text', "<p>"+narration+"</p>");
    }
}

function runCommand(text,userId,gameId){
	if(gameId==='none'){
        io.to(userId).emit('game_text', "<p>Game hasn't started yet</p>");
		return;
	}
	
	games[gameId].runCommand(text,userId);
    
    if (dataBaseOn) {
        client.query(`UPDATE games SET game = '${JSON.stringify(games[gameId].save())}' WHERE id = '${gameId}';`);
    }
    
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

function Card(type, key) {
    this.type = type;
    this.key = key;
}

const readCard = card => {
    let x = 'card reading error';
    switch (card.type) {
        case CardTypeEnum.SKILL : x = SkillCardMap[card.key]; break;//TODO
        case CardTypeEnum.CRISIS : x = CrisisMap[card.key]; break; //added to game
        case CardTypeEnum.SUPER_CRISIS : x = SuperCrisisMap[card.key]; break;//TODO
        case CardTypeEnum.QUORUM : x = QuorumMap[card.key]; break;//added but not used
        case CardTypeEnum.LOYALTY : x = LoyaltyMap[card.key]; break;//TODO
        case CardTypeEnum.DESTINATION : x = DestinationMap[card.key]; break;//deck made but not used
    }
    return x;
};

/*
when you make a deck of cards :

    let deck = [];
    for (let key in CardMap)
        deck.push(new Card(CardTypeEnum.TYPE, key);

 */













