
/*
    daybreak expansion includes :
        - 30 new Crisis Cards: CrisisMap
        - 2 new Loyalty Cards: LoyaltyMap
        - 12 new characters: CharacterMap
        - 22 Mutiny Cards: MutinyMap
        - 8 Mission Cards: MissionMap
        - 14 Motive Cards: MotiveMap
        - 51 new Skill Cards: SkillCardMap
        - 14 new locations: LocationMap
        - 2 extra cards: Extras
*/

const enums = require(__dirname + '/enums').enums;

const WhoEnum = enums.WhoEnum;
const SkillTypeEnum = enums.SkillTypeEnum;
const CylonActivationTypeEnum = enums.CylonActivationTypeEnum;
const LocationEnum = enums.LocationEnum;
const SkillPlayTimeEnum = enums.SkillPlayTimeEnum;
const CharacterTypeEnum = enums.CharacterTypeEnum;

const CrisisMap = Object.freeze({
    
    ABANDON_GALACTICA : {
        name : 'Abandon Galactica',
        text : "Make the cellerators the last thig your men take out. " +
        "Then, turn out the lights and let the old girl die in peace. -Lee Adama",
        graphic : 'BSD_Crisis_AbandonGalactica.jpg',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Discard 1 nuke token. if you do not have any nuke tokens, ' +
            'you cannot choose this option (-OR-) -1 food and the Admiral draws 2 Treachery Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    A_DESPERATE_PACT : {
        name : 'A Desperate Pact',
        text : "Every revolution begins with one small act of courage. -Tome Zarek",
        graphic : 'BSD_Crisis_ADesperatePact.jpg',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/PI)(15) PASS: no effect, FAIL: -1 morale and give the President title to the player ' +
            '(aside from the current president) highest on the Presidential like of succession ' +
            '(-OR-) The President discards 3 Skill Cards, then the current player draws 1 mutiny Card',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text : '(PO/L/PI)(15) PASS: no effect, FAIL: -1 morale and give the President title to the player ' +
            '(aside from the current president) highest on the Presidential like of succession.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    AN_AMBITIOUS_OPERATION : {
        name : 'An Ambitious Operation',
        text : "We were looking for a facility where we knew boomer would probably take hera, " +
        "But it was no longer there. -William Adama",
        graphic : 'BSD_Crisis_AnAmbitiousOperation.jpg',
        choose : {
            who : WhoEnum,
            text : '-1 fuel. The admiral chooses another player to gain 1 miracle token ' +
            '(-OR-) Roll a die. On 4 or less, -1 fuel.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //BLINDSIDED: cylon attack card
    BLINDSIDED : {
        name : 'Blindsided',
        text : '1) Activate: raiders.<br>2) Setup: 2 basestars, 2 heavy raiders, 3 raiders, 1 vipers, and ' +
        '3 civilian ship.<br>3) Special Rule - <i>Pluck Out Their Eyes:</i> Destroy one raptor.',
        graphic : 'BSD_Crisis_Blindsided.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.BLINDSIDED,
    },
    
    CONSULT_THE_HYBRID : {
        name : 'Consult the Hybrid',
        text : "We excite a state to case by vibration or relaxation into the first excited single state. " +
        "Yes, yes, and merrily, we go. -The Hybrid",
        graphic : 'BSD_Crisis_ConsultTheHybrid.jpg',
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(10) PASS: The current player draws a Mutiny Card and 2 Skill Cards(they may be from' +
            ' outside their skill set) (-OR-) -1 food, and shuffle 2 Treachery Cards into the Destiny deck.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    DANGEROUS_PLOTS : {
        name : 'Dangerous Plots',
        text : "We lose those four, we lose Earth. If everything goes south," +
        " we destroy the base ship and everyone on it. -Lee Adama",
        graphic : 'BSD_Crisis_DangerousPlots.jpg',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'The Admiral and the President both draw 1 Mutininy Card (-OR-)' +
            ' -1 morale, and the current player discards 3 Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    DISHONEST_TACTICS : {
        name : 'Dishonest Tactics',
        text : "The idea of being publicly humiliated as a corrupt politician with your hand in the till." +
        " Well, that would scare you. -William Adama",
        graphic : 'BSD_Crisis_DishonestTactics.jpg',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale, and the President may choose 1 player to move from the Brig to Command ' +
            '(-OR-) -1 fuel and the President draws 2 Quorum Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    DOMESTIC_DISPUTE : {
        name : 'Domestic Dispute',
        text : "Cally. I told you last night, and I'm telling you again right now. I am not having an affair. -Galen Tyrol",
        graphic : 'BSD_Crisis_DomesticDispute.jpg',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS,SkillTypeEnum.TACTICS],
            text : '(PO/T)(9) PASS: no effect, FAIL: -1 morale and the current player is sent to Sickbay.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    EARTH_IN_RUINS : {
        name : 'Earth in Ruins',
        text : "The planet was nuked about two thousand years ago. -Karl 'helo' Agathon",
        graphic : 'BSD_Crisis_EarthInRuins.jpg',
        choose : {
            who : WhoEnum,
            text : '(PO/L/T)(9) PASS: -1 morale, FAIL: -2 morale ' +
            '(-OR-) -1 food and the current player draws 1 Mutiny card.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(9) PASS: -1 morale, FAIL: -2 morale',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    ENEMY_OF_MY_ENEMY : {
        name : 'Enemy of my Enemy',
        text : "We're asking for your help, here. We can't do it alone. -Natalie",
        graphic : 'BSD_Crisis_EnemyOfMyEnemy.jpg',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/PI)(13) PASS: -1 morale, FAIL: -2 morale and damage Galactica (-Or-) Damage Galactica twice.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text : '(PO/L/PI)(13) PASS: -1 morale, FAIL: -2 morale and damage Galactica.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //EventHorizon = cylon attack card
    EVENT_HORIZON : {
        name : 'Event Horizon',
        text : '1) Activate: raiders.<br>2) Setup: 2 basestars, 4 raiders and 3 vipers<br>3) Special Rule - ' +
        '<i>Gravity Well:</i> Keep this card in play until the fleet jumps. ' +
        'No player can activate a viper unless he first discards a Skill Card.',
        graphic : 'BSD_Crisis_EventHorizon.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.EVENT_HORIZON,
    },
    
    GALACTICA_FALLING_APART : {
        name : 'Galactica Falling Apart',
        text : "It's throughout the entire ship. Hairline fractures in all the beams. Galen Tyrol",
        graphic : 'BSD_Crisis_GalacticaFallingApart.jpg',
        choose : {
            who : WhoEnum,
            text : '(L/PI/E)(8) PASS: no effect, FAIL: -1 morale and damage Galactica (-OR-) Roll a die. ' +
            'On a 6 or lower, -1 food',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(L/PI/E)(8) PASS: no effect, FAIL: -1 morale and damage Galactica.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    GIVE_IN_TO_DESPAIR : {
        name : '',
        text : "",
        graphic : 'BSD_Crisis_GiveInToDespair.jpg',
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(14)(9) PASS: no effect, MIDDLE: -1 food and the current player draws 3 Treachery Cards' +
            ', FAIL: -2 morale.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 9,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    //HornetsNest - cylon attack card
    HORNETS_NEST : {
        name: 'Hornet\'s Nest',
        text: '1) Activate: raiders.<br>2) Setup: 1 basestar, 6 raiders, 2 vipers and 3 civilian ships<br>' +
        '3) Special Rule - <i>Suppressive Fire:</i> Keep this card in play until the fleet jumps or a basestar is ' +
        'destroyed. Players cannot use actions on Piloting Cards',
        graphic : 'BSD_Crisis_HornetsNest.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.HORNETS_NEST,
    },
    
    HYBRID_IN_PANIC : {
        name : 'Hybrid in Panic',
        text : "Calm your mind. Cease countdown. Cease countdown. Circulation. Ventilation. Control. -The Hybrid",
        graphic : 'BSD_Crisis_HybridInPanic.jpg',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.TACTICS,SkillTypeEnum.ENGINEERING],
            text : '(T/E)(12)(8) PASS: Increase the Jump Preparation track by 1, ' +
            'MIDDLE: the current player discards 2 Skill Cards, FAIL: -1 fuel,',
            pass : game => {
                //TODO
            },
            middle : {
                value : 8,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    INCITEMENT_TO_MUTINY : {
        name : 'Incitement to Mutiny',
        text : "I remind you once again that Mr. Zarek was taken into custody " +
        "because he was agitating against a lawful order. -Lee Adama",
        graphic : 'BSD_Crisis_IncitementToMutiny.jpg',
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(13)(7) PASS: no effect, MIDDLE: shuffle 2 Treachery Cards into the Destiny deck, FAIL: shuffle 4 Treachery Cards into the Destiny deck.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 7,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    INSUBORDINATE_CREW : {
        name : 'Insubordinate Crew',
        text : "Captain Thrace. As X.O. of the Demetrius and acting under article ten of Colonial military code, I am " +
        "hereby relieving you of your command. -Karl 'Helo' Agathon",
        graphic : 'BSD_Crisis_InsubordinateCrew.jpg',eck : {
            value : 12,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(12) PASS: no effect, FAIL: -1 morale and each ' +
            'player that does not have a Mutiny Card draws 1 Mutiny Card..',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //LOCKDOWN - cylon attack card
    LOCKDOWN : {
        name : 'Lockdown',
        text : '1) Activate: heavy raiders.<br>2) Setup: 1 basestar, 4 heavy raiders, 1 viper and 2 civilian ships<br>' +
        '3) Special Rule - <i>Concerted Attack:</i> Keep this card in play until the fleet jumps or a basestar is ' +
        'destroyed. Players acticate the "Armory" location',
        graphic : 'BSD_Crisis_Lockdown.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LOCKDOWN,
    },
    
    ONE_LAST_COCKTAIL : {
        name : 'One Last Cocktai',
        text : "You're using the last little bit of life that you've got.. -Sherman 'Doc' Cottle",
        graphic : 'BSD_Crisis_OneLastCocktail.jpg',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/E)(7) PASS: no effect, FAIL: -1 food, -1 morale (-OR-) Roll a die. ' +
            'On a 6 or lower, -1 morale and the President is sent to "Sickbay"',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(7) PASS: no effect, FAIL: -1 food, -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    QUESTION_PROCEDURE : {
        name : 'Question Procedure',
        text : "Of course you have authority over emergency measures. " +
        "But you bulldozed this through after the session was closed. -Lee Adama",
        graphic : 'BSD_Crisis_QuestionProcedure.jpg',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale (-OR-) damage Galactica and the President discards 3 SKill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    QUORUM_IN_UPROAR : {
        name : 'Quorum in Uproar',
        text : "I think you should leave now, Mr. Vice President. -Jacob Cantrell",
        graphic : 'BSD_Crisis_QuorumInUproar.jpg',
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(8) PASSL no effect, ' +
            'FAIL: The President discards 2 random Quorum Cards and 2 Random Skill Cards.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    RALLYING_SUPPORT : {
        name : 'Rallying Support',
        text : "Every citizen has the right to protect themselves from oppression. " +
        "Take whatever measures you think neccessary. -Tom Zarek",
        graphic : 'BSD_Crisis_RallyingSupport.jpg',
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(8) PASS: no effect, ' +
            'FAIL: -1 population and the current player draws 1 Mutiny Card and 1 Treachery Card.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    REACTOR_CRITICAL : {
        name : 'Reactor Critical',
        text : "What did you do? Blow the tylium stores? -Kara Thrace",
        graphic : 'BSD_Crisis_ReactorCritical.jpg',
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(7) PASS: The current player draws 2 Treachery Cards, FAIL: -1 fuel.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    REBUILD_TRUST : {
        name : 'Rebuild Trust',
        text : "Give Athena back her daughter. She needs her family. " +
        "We all need out family. Take care of this one. -William Adama",
        graphic : 'BSD_Crisis_RebuildTrust.jpg',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: each character in the Brig may move to any location on Galactica, ' +
            'FAIL: -2 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    RELIGIOUS_TURMOIL : {
        name : 'Religious Turmoil',
        text : "Sons of Ares. Is that the people who committed this attack? -Gaius Baltar",
        graphic : 'BSD_Crisis_Religious Turmoil.jpg',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(7) PASS: no effect, FAIL: -1 morale and each player discards 1 Skill Card' +
            ' (-OR-) Roll a die. On a 4 or lower, -1 food and -1 population.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(7) PASS: no effect, FAIL: -1 morale and each player discards 1 Skill Card.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //REPRISAL - cylon attack card
    REPRISAL : {
        name : 'Reprisal',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 1 heavy raider, 5 raiders, 2 vipers, and 2 civilian ships' +
        '<br>3) Special Rule - <i>Opportunity for Treason:</i> Shuffle 2 Treachery Cards into the Destiny deck. ' +
        ' Then, then current player draws a Mutiny Card',
        graphic : 'BSD_Crisis_Reprisal.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.REPRISAL,
    },
    
    REQUISITION_FOR_DEMETRIUS : {
        name : 'Requisition for Demetrius',
        text : "Helo handpicked a crew for you. I'm giving you a ship. Hope you can stand the smell. -Willy Wonka",
        graphic : 'BSD_Crisis_RequisitionForDemetrius.jpg',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 food, then roll a die. On 6 or lower, shuffle 2 Treachery Cards into the Destiny deck ' +
            '(-OR-) The Admiral draws 1 Mutiny Card and 2 Treachery Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    SECRET_MEETINGS : {
        name : 'Secret Meetings',
        text : "I've fooled you for months now. I didn't want to, but i did. -Saul Tigh",
        graphic : 'BSD_Crisis_SecretMeetings.jpg',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T/E)(9) PASS: no effect, FAIL: -1 morale (-OR-) The current player draws' +
            ' 1 Mutiny Card. Then, he chooses a player to draw 1 Mutiny Card.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/T/E)(9) PASS: no effect, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    STARVATION_IN_DOGSVILLE : {
        name : 'Starvation in Dogsville',
        text : "There is a way to feed ourselves and the people from Dogsville. There is a way to bring hope to the " +
        "lower decks. To the whole of this poor ship. There is a way to win! -Gaius Baltar",
        graphic : 'BSD_Crisis_StarvationInDogsville.jpg',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'Roll a die: On 4 or less: (-1 population and -1 food (-OR-) -2 food)',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    //TRIAL_BY_FIRE - cylon attack card
    TRIAL_BY_FIRE : {
        name : 'Trial by Fire',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 2 heavy raiders, 3 raiders, 1 viper and 1 civilian ship' +
        '<br>3) Special Rule - <i>Cavalry\'s Here:</i> The human fleet gains an assault raptor. The current player ' +
        'places it in a space area with a viper launch icon and may immediately activate it.',
        graphic : 'BSD_Crisis_TrialByFire.jpg',
        instructions : game => {
            //TODO ERIC
        },
        jump : false,
        cylons : CylonActivationTypeEnum.TRIAL_BY_FIRE,
    },
    
});

const LoyaltyMap = Object.freeze({
    
    //only saw in in my pictures, TODO find other loyalty card from daybreak
    
    YOU_ARE_THE_MUTINEER: {
        name: "You are the Mutineer",
        text: "IMMEDIATELY REVEAL THIS CARD<br/>" +
        "If you receive this card facedown, immediatly reveal it and draw another Loyalty Card." +
        " Any time you receive this card, lose your titles and draw a Mutiny Card, If you reveal yourself as a Cylong, " +
        "give this card faceup to a human player of your choice. Do not move to the Brig when you gain a second Mutiny " +
        "Card. If you gain a third Mutiny Card, you must move to the Brig." +
        "<br/><b>When you resolve a Prepare for Jump icon, you must Draw a Mutiny Card.</b>",
        graphic: "BSD_Loyalty_Mutineer.jpg",
        action: game => {
            //TODO
        },
        role: 'cylon',
    },

});

const CharacterMap = Object.freeze({
    
    AARON_DORAL: {
        name: 'Aaron Doral',
        characterGraphic: 'BSD_Characters_AaronDoral.png',
        pieceGraphic: 'PlayerPiece_Aaron_Doral.png',
        type: CharacterTypeEnum.CYLON_LEADER,
        skills: {
            Treachery : 1,
            PoliticsTactics: 1,
        },
        startLocation: LocationEnum.CAPRICA,
        /*
            Industrious:
                While infiltrating, draw 2 extra Skill Cards on your turn instead of 1.
                Disregard this ability while you are in Sickbay
    
            Meticulous - after action ending infiltration:
                Once per game, when you use an action to end your Infiltration, you may move to any
                Cylon location and take another action instead of moving to the Resurrection Ship.
    
            Vanity:
                You cannot contribute to skill checks during another player's Action Step.
        */
    },
    
    KARL_HELO_AGATHON: {
        name: 'Karl "Helo" Agathon',
        characterGraphic: 'BSD_Characters_AltHelo.png',
        pieceGraphic: 'PlayerPiece_AltHelo.png',
        type: CharacterTypeEnum.PILOTING,
        skills: {
            Leadership: 2,
            Tactics: 2,
            Piloting : 1,
        },
        startLocation: LocationEnum.ADMIRALS_QUARTERS,
        /*
            Raptor Pilot:
                When you look at the top card of a deck as a result of a Launch Scout Card, look at the top
                2 cards instead and, in the order of your choosing, place eac card on the top or bottom of the deck.
    
            No On Gets Left Behind - when removing ships for jump:
                Once per game, durring the Remove Ships step of Jumping the fleet, lose 1 fuel to gain 2 population.
    
            Family Commitments:
                If you are not on Galactica, draw 1 fewer Skill Card during your Receive Skills step.
        */
    },
    
    LEE_ADAMA: {
        name: 'Lee Adama',
        characterGraphic: 'BSD_Characters_AltLee.png',
        pieceGraphic: 'Player_Piece_Lee_Adama.png',
        type: CharacterTypeEnum.POLITICAL_LEADER,
        skills: {
            Tactics: 1,
            Piloting : 2,
            LeadershipPolitics : 2,
        },
        startLocation: LocationEnum.ADMIRALS_QUARTERS,
        /*
            Forward Thinker:
                After you use an Executive Order Skill Card and the chosen player has finished moving
                and taking actions, you may activate your current location.
    
            Choose a Different Path - before you make a choice from a crisis card:
               Once per game, when you must make a choice on a Crisis Card, you may choose to have the
               result be: "the current player discards 5 skill cards
    
            Moral Dilemma:
                When you draw a Mutiny Card, you must discard 2 Skill Cards.
        */
    },
    
    TOM_ZAREK: {
        name: 'Tom Zarek',
        characterGraphic: 'BSD_Characters_AltZarek.png',
        pieceGraphic: 'PlayerPiece_Tom_Zarek.png',
        type: CharacterTypeEnum.MILITARY_LEADER,
        skills: {
            Politics : 2,
            Leadership: 2,
            Tactics: 1,
        },
        startLocation: LocationEnum.WEAPONS_CONTROL,
        /*
            Necessary Steps:
                Each time a player draws a Mutiny Card, you instead look at the top 2 cards of the Mutiny deck,
                give 1 to that player, and place the other on the bottom of the deck.
    
            Abuse Power - action:
                Once per game, draw 4 Mutiny Cards, Choose 1 of them to play and place the other 3 Mutiny Cards
                on the bottom of the deck. Ignore your Necessary Steps ability and do not move to the Brig.
    
            Disreputable:
                You start the game with 1 Mutiny Card.
        */
    },
    
    SHARON_ATHENA_AGATHON: {
        name: 'Sharon "Athena" Agathon',
        characterGraphic: 'BSD_Characters_Athena.png',
        pieceGraphic: 'PlayerPiece_Athena_4.0.png',
        type: CharacterTypeEnum.CYLON_LEADER,
        skills: {
            Piloting : 1,
            LeadershipEngineering : 1,
        },
        startLocation: LocationEnum.HANGAR_DECK,
        /*
            For Love:
                Once per turn, when another player must discard 1 or more Skill Cards
                (except when discarding down to his card limit) you may draw 1 Treachery Card
                to reduce the number of cards he discards by 1.
    
            Resolute - action:
                Once per game, activate any undamaged location.
    
            Grieving:
                When you are in a hazardous location, you cannot draw a Skill Card
                during your Receive Skills or Draw Skills steps.
        */
    },
    
    DANNA_BIERS: {
        name: 'D\'Anna Biers',
        characterGraphic: 'BSD_Characters_DAnnaBiers.png',
        pieceGraphic: 'PlayerPiece_DAnnaBiers.png',
        type: CharacterTypeEnum.CYLON_LEADER,
        skills: {
            PoliticsLeadership : 1,
            TreacheryEngineering : 1,
        },
        startLocation: LocationEnum.HUMAN_FLEET || LocationEnum.PRESS_ROOM,
        /*
            Visions - Action:
                If you are infiltrating, choose a human player and look at 1 of his Loyalty Cards at random.
                Then, end your infiltration and move to the Resurrection Ship.
    
            Don't trust anyone - action:
                Once per game, draw 2 Super Crisis Cards.
    
            Heretic:
                If you are on the Resurrection Ship location (but not the Hub Destroyed location)
                you much discard a Super Crisis Card to move to a different location.
        */
    },
    
    SHERMAN_DOC_COTTLE: {
        name: 'Sherman "Doc" Cottle',
        characterGraphic: 'BSD_Characters_DocCottle.png',
        pieceGraphic: 'PlayerPiece_DocCottle.png',
        type: CharacterTypeEnum.SUPPORT,
        skills: {
            Politics : 1,
            Tactics: 2,
            Engineering : 2,
        },
        startLocation: LocationEnum.RESEARCH_LAB,
        /*
            Treatment - action:
                Choose a human player and draw 2 Skill Cards from his skill set. Then, give him
                2 Skill cards from your hand.
    
            Quarantine - action:
                Once per game, look at each civilian ship on the board. Choose 1 and draw a new civilian ship
                to replace it if possible. Shuffle the choosen ship back into the pile of unused civilian ships.
    
            Specialized:
                You cannot use actions printed on Engineering Cards.
        */
    },
    
    GAIUS_BALTAR: {
        name: 'Gaius Baltar',
        characterGraphic: 'BSD_Characters_GaiusFrakkinBaltar.png',
        pieceGraphic: 'PlayerPiece_Baltar.png',
        type: CharacterTypeEnum.SUPPORT,
        skills: {
            Politics : 2,
            Leadership: 2,
            Engineering : 1,
        },
        startLocation: LocationEnum.ADMIRALS_QUARTERS,
        /*
            Cult Leader - action:
                Choose a player in the same location as you and either give him one of your miracle
                tokens or take his miricle token.
    
            Broadcast - action:
                Discard 3 miracle tokens to raise any resource by 2.
                (you can have up to 3 tokens)
    
            Spiritual Crisis:
                You cannot use an action printed on a You Are A Cylon Loyalty Card unless you are in the Brig.
        */
    },
    
    BRENDAN_HOT_DOG_COSTANZA: {
        name: 'Brendan "hot Dog" Costanza',
        characterGraphic: 'BSD_Characters_HotDog.png',
        pieceGraphic: 'PlayerPiece_HotDog.png',
        type: CharacterTypeEnum.PILOTING,
        skills: {
            Leadership: 1,
            Tactics: 1,
            Piloting : 2,
            Engineering : 1,
        },
        startLocation: LocationEnum.HANGAR_DECK,
        /*
            Memento:
                Once per turn, immediately after population is reduced,
                you may draw the top 3 cards from the Piloting deck, discard 1 of them and keep the other 2 cards.
    
            Escort - before flipping over a civilian ship:
                Once per game, before flipping over a civilian ship in a space area and destroying it,
                you may destroy an undamaged viper instead.
                Shuffle the civilian ship back into the pile of unused civilian ships.
    
            Forced to Eject:
                Any time a viper you are piloting is damaged, destroy it instead.
        */
    },
    
    LOUIS_HOSHI: {
        name: 'Louis Hoshi',
        characterGraphic: 'BSD_Characters_LouisHoshi.png',
        pieceGraphic: 'PlayerPiece_LouisHoshi.png',
        type: CharacterTypeEnum.MILITARY_LEADER,
        skills: {
            Leadership: 2,
            Tactics: 2,
            Engineering : 1,
        },
        startLocation: LocationEnum.COMMUNICATIONS,
        /*
            Dutiful:
                Once during your turn, if you activate Command, Communications, or Weapons Control, you may
                discard 1 skill card to immediately activate that location again.
    
            Organized - action:
                Once per game, if you are not in the Brig, activate any 3 undamaged locations,
                regardless of where you are. You cannot activate the same location more then once nor Cylon locations
    
            Reluctant:
                You must discard 1 Skill Card to use a Skill Card action.
        */
    },
    
    ROMO_LAMPKIN: {
        name: 'Romo Lampkin',
        characterGraphic: 'BSD_Characters_RomoLampkin.png',
        pieceGraphic: 'PlayerPiece_RomoLampkin.png',
        type: CharacterTypeEnum.POLITICAL_LEADER,
        skills: {
            Politics : 2,
            Tactics: 2,
        },
        startLocation: LocationEnum.ADMINISTRATION,
        /*
            Deceitful:
                When a Crisis Card requires you to discard Skill Cards, reduce the number
                of cards you discard by 1(once per crisis card).
    
            Attorney - action:
                Once per game, move a character in the Brig to any non-hazardous location on Galactica.
                If he belongs to another, take all of that player's Skill Cards.
    
            Kleptomania:
                If you end your Movement Step in a location with another player, you must discard 2 Skill Cards.
                If you connot you are sent to the Bring at the end of your turn.
        */
    },
    
    SIMON_ONEILL: {
        name: 'Simon O\'Neill',
        characterGraphic: 'BSD_Characters_SimonONeill.png',
        pieceGraphic: 'PlayerPiece_SimonONeill.png',
        type: CharacterTypeEnum.CYLON_LEADER,
        skills: {
            Engineering : 1,
            TreacheryTactics : 1,
        },
        startLocation: LocationEnum.CYLON_FLEET,
        /*
            Calculating:
                You may contribute 2 Skill Cards to skill checks, or 3 Skill Cards when Infiltrating.
                Disregard this ability when you are in the Brig.
    
            Modifications - at the start of a player actiatie cylon ships step:
                Once per game, at the start of a player's Activate Cylon ships step, either choose a Cylon
                ship type to activate or launch raiders. Ignore any activate Cylon Ships icons on
                the bottom of the crisis card.
    
            Logic bound:
                when you paly any Skill Cards into a skill check, you must play 1 face up.
        */
    },
    
});

const MutinyMap = Object.freeze({
    
    //cardBack graphic : 'BSD_MutinyBack.jpg'
    
    ARMED_RESISTANCE: {
        name: 'Armed Resistance',
        text: "We've got civilians arming themselves down here. -Kara \"Starbuck\" Thrace",
        graphic: 'BSD_Mutiny_ArmedResistance.jpg',
        actionText: 'Send the Admiral to "Sickbay" and look at the top card of the Crisis deck. ' +
        'Place that card on the top or bottom of the deck and discard this card.',
        action: game => {
            //TODO
        },
    },
    
    ASSUME_COMMAND: {
        name: 'Assume Command',
        text: "Sergent of the Gaurds. Take the senior staff. Put them in a holding cell. -Felix Gaeta",
        graphic: 'BSD_Mutiny_AssumeCommand.jpg',
        actionText: 'Discard 5 Skill Cards to take the Admiral title. Then, discard this card.<br.><b>You cannot play ' +
        'this card if you do not have 5 or more Skill Cards, you already hold the Admiral title, or you are in the Brig</b>',
        action: game => {
            //TODO
        },
    },
    
    BAIT_AND_SWITCH: {
        name: 'Bait and Switch',
        text: "... I never really believed in your conversion, " +
        "so I was counting on your well-honed sense of self-preservation.",
        graphic: 'BSD_Mutiny_BaitAndSwitch.jpg',
        actionText: 'Draw 2 Skill Cards (They may be from outside your skill set). Then, shuffle 2' +
        ' Treachery Cards into the Destiny deck and discard this card.',
        action: game => {
            //TODO
        },
    },
    
    BETRAYAL_OF_TRUST: {
        name: 'Betrayal of Trust',
        text: "The blood on these dog tags comes from necrotic flesh. That means a dead body. -Gaius Baltar",
        graphic: 'BSD_Mutiny_BetrayalOfTrust.jpg',
        actionText: 'Draw 2 Treachery Cards. Then, look at the top card of the Destination deck and place' +
        ' it on the top or the bottom of the deck. Finally, discard this card.',
        action: game => {
            //TODO
        },
    },
    
    BLACKMAIL: {
        name: 'Blackmail',
        text: "Read the file. It's some juicy stuff. Make a great story for the press. -William Adama",
        graphic: 'BSD_Mutiny_Blackmail.jpg',
        actionText: 'Take 3 random Skill Cards from the President. Then, discard this card.<br/>' +
        '<b>You cannot play this card if you are the President or if the President has 2 or fewer Skill Cards.</b>',
        action: game => {
            //TODO
        },
    },
    
    CLIPPED_WINGS: {
        name: 'Clipped Wings',
        text: "If the hangar deck's gone, \"C.I.C.\" and weapons are next. And then, nobody's safe. -Galen Tyrol",
        graphic: 'BSD_Mutiny_ClippedWings.jpg',
        actionText: 'Return all vipers in space areas to the "Reserves" and repair all damaged vipers. Then, draw 2 ' +
        'Treachery Cards and discard this card.<br/>' +
        '<b>You cannnot play this card unless there is at least 1 viper in a space area</b>',
        action: game => {
            //TODO
        },
    },
    
    CONTROVERSIAL_SPEECH: {
        name: 'Controversial Speech',
        text: "She's afraid of your teachings. She will take the wireless, and she will silence you ... -Paulla",
        graphic: 'BSD_Mutiny_ControversialSpeech.jpg',
        actionText: 'Roll a die. If the result is 6 or higherm gain 1 morale and remove this card from the game.' +
        ' Otherwise, discard this card and each player, including Cylon players, draws 1 Treachery Card.',
        action: game => {
            //TODO
        },
    },
    
    FEED_THE_PEOPLE: {
        name: 'Feed the People',
        text: "I'm coming back here and if it is the last thing I do, " +
        "I will ensure that every single one of you are fed. -Gaius Baltar",
        graphic: 'BSD_Mutiny_FeedThePeople.jpg',
        actionText: 'Decrease the Jump Preparation track by 2 and gain 1 food. Then, remove this card from the game.',
        action: game => {
            //TODO
        },
    },
    
    IMPEACHMENT: {
        name: 'Impeachment',
        text: "Zarek's got the Quorum in an uproar. The press is going crazy. The" +
        " government is spinning out of control. -William Adama",
        graphic: 'BSD_Mutiny_Impeachment.jpg',
        actionText: 'Discard 5 Skill cards to take the President title. Then, Discard this card.<br/><b>You cannot' +
        ' play this card if you do not have 5 or more Skill Cards or you already hold the President title.</b>',
        action: game => {
            //TODO
        },
    },
    
    MAKE_A_DEAL: {
        name: 'Make a Deal',
        text: "Listen to me, Mr. Adama, Lee. I'm asking to have a genuine conversation. Please. -Gaius Balta",
        graphic: 'BSD_Mutiny_MakeADeal.jpg',
        actionText: 'Choose a character in the Brig and move him to any location on Galactica.' +
        ' Then, discard this card and choose a player to draw a Mutiny Card.<br/>' +
        '<b>You cannot play this card if there are no characters in the Brig.</b>',
        action: game => {
            //TODO
        },
    },
    
    NECESSARY_RISK: {
        name: 'Necessary Risk',
        text: "Hashi did some calculations from Race-track's photos." +
        " We take out the \"F.T.L.\" and Hub's stranded. -Karl \"Helo\" Agathon",
        graphic: 'BSD_Mutiny_NecessaryRisk.jpg',
        actionText: 'Increase food by 1. Then, choose 1 space area and place 1 basestar and 3 raiders in that area.' +
        ' Finaly, remove this card from the game.<br/>' +
        '<b>You can play this card even if all the Cylon ships cannot be placed.</b>',
        action: game => {
            //TODO
        },
    },
    
    PANIC: {
        name: 'Panic',
        text: "They're hiding in the fleet. Battle station stand down. Marine launch Blue Squadron. -Felix Gaeta",
        graphic: 'BSD_Mutiny_Panic.jpg',
        actionText: 'Place 1 civilian ship behind Galactica',
        action: game => {
            //TODO
        },
    },
    
    PEACEFUL_RESISTANCE: {
        name: 'Peaceful Resistance',
        text: "So, now what? Going to give orders at gunpoint? -Karl \"Helo\" Agathon",
        graphic: 'BSD_Mutiny_PeacefulResistance.jpg',
        actionText: 'Move to "Sickbay" and roll a die. On a result of 4 or less, send the Admiral to the Brig. Then,' +
        'Discard this card.',
        action: game => {
            //TODO
        },
    },
    
    RUINED_REPUTATION: {
        name: 'Ruined Reputation',
        text: "I don't think that the legand and the myth of Tom Zarek ... can survive the airing of that much " +
        "dirty laundry. -William Adama",
        graphic: 'BSD_Mutiny_RuinedReputation.jpg',
        actionText: 'Choos one human player to draw 2 Skill CArds (they may be from outside his skillset). ' +
        'Then, roll a die. On a result of 4 or less, send that palyer to the Brig. Then, discard this card.',
        action: game => {
            //TODO
        },
    },
    
    SCAVENGING_FOR_PARTS: {
        name: 'Scavenging for Parts',
        text: "I am submitting my requisition now for Galactica's CO and particulate scrubbers. -Xeno Fenner",
        graphic: 'BSD_Mutiny_ScavengingForParts.jpg',
        actionText: 'Damage Galactica and, if possible, choose 1 civilian ship in a space area. ' +
        'Shuffle that ship inot the pile of unused civilian ships, Then, discard this card.',
        action: game => {
            //TODO
        },
    },
    
    SELFISH_ACT: {
        name: 'Selfish Act',
        text: "I'm done taking orders from you. -Tory Foster",
        graphic: 'BSD_Mutiny_SelfishAct.jpg',
        actionText: 'Draw 2 Skill Cards. Discard this card and then draw another Mutiny Card.',
        action: game => {
            //TODO
        },
    },
    
    SEND_A_MESSAGE: {
        name: 'Send a Message',
        text: "... the other pilot had no qualms about shooting down" +
        " the President of the Colonies. -Sharon \"Athena\" Agathon",
        graphic: 'BSD_Mutiny_SendAMessage.jpg',
        actionText: 'Damage Galactica and, if possible, attack a centurion on the Boarding Party track,' +
        ' adding 2 to the die result. Then, discard this card.',
        action: game => {
            //TODO
        },
    },
    
    SET_THE_AGENDA: {
        name: 'Set the Agenda',
        text: "The leaders of this fleet are succumbing to wishful thinking because they can't face reality. -Tom Zarek",
        graphic: 'BSD_Mutiny_SetTheAgenda.jpg',
        actionText: 'The President draws 2 Quorum Cards. Look at his Quorum Cards and choose 2 cards. ' +
        'Place them on the bottom of the Quorum deck in any order. Then, discard this card.<br/>' +
        'You cannot play this card if you are the President.',
        action: game => {
            //TODO
        },
    },
    
    THE_STRONG_SURVIVE: {
        name: 'The Strong Survive',
        text: "Give the jump coordinate only to those ships that kept their \"F.T.L.'s\" online." +
        " Order them to jump immediately. -Felix Gaeta",
        graphic: 'BSD_Mutiny_TheStrongSurvive.jpg',
        actionText: 'Draw a civilian ship to destroy. ' +
        'Then, increase the Jump Preparation track by 1 and remove this card frm the game.',
        action: game => {
            //TODO
        },
    },
    
    UNAUTHORIZED_USAGE: {
        name: 'Unauthorized Usage',
        text: "Arm all weapons, engage the target and destroy. -Felix Gaeta",
        graphic: 'BSD_Mutiny_UnauthorizedUsage.jpg',
        actionText: 'Launch 1 nuke at a basestar. Then remove this card and all nuke tokens from the game.<br/>' +
        'You cannot use this card if the Admiral has no nuke tokens.',
        action: game => {
            //TODO
        },
    },
    
    VIOLENT_PROTEST: {
        name: 'Violent Protest',
        text: "There's been an uprising, I'm not sure how many of the crew are involved. It is widestread. -Lee Adama",
        graphic: 'BSD_Mutiny_ViolentProtest.jpg',
        actionText: 'Draw 2 Politics Cards and send the President to "Sickbay." Then, descard this card.',
        action: game => {
            //TODO
        },
    },
    
    WEAPONS_ARMED: {
        name: 'Weapons Armed',
        text: "I don't want to come out of this crap with cold weapons... -Margreret \"Racetrack\" Edmondson",
        graphic: 'BSD_Mutiny_WeaponsArmed.jpg',
        actionText: 'Destroy a raptor to gain an assault raptor. Then, launch 2 raiders from each basestar.<br/>' +
        'You cannot play this card if there are no raptors in the "reserves."',
        action: game => {
            //TODO
        },
    },
    
});

const MissionMap = Object.freeze({
    
    // cardback graphic : 'BSD_MissionBack.jpg'
    
    ATTACK_ON_THE_COLONY: {
        name: 'Attack on the Colony',
        text: "Galactica's ... gone through a lot of battles. This will be her last. -William Adama",
        graphic: 'BSD_Missions_AttackOnTheColony.jpg',
        pass: 'Remove All basestars from the board. Then, remove 1 basestar from the game.',
        fail: 'Place 1 basestar in front of Galactica and damage Galactica.',
        value: 0,
        skillCheck: {
            value: 14,
            types: [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text: '(T/PI)(14) PASS: Remove All basestars from the board. Then, remove 1 basestar from the game. ' +
            'FAIL: Place 1 basestar in front of Galactica and damage Galactica.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    CYLON_CIVIL_WAR: {
        name: 'Cylon Civil War',
        text: "The whole fleet is split right down the middle. -Sharon \"Boomer\" Valerii",
        graphic: 'BSD_Missions_CylonCivilWar.jpg',
        pass: 'Place the Rebel Basestar game board in play with the Basestar Allegiance marker set to its human side.',
        fail: 'Place the Rebel Basestar game board in play with the Basestar Allegiance marker set to its Cylon side.',
        value: 0,
        skillCheck: {
            value: 21,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text: '(PO/L/T)(21) PASS: Place the Rebel Basestar game board in play with the Basestar Allegiance' +
            ' marker set to its human side., FAIL: Place the Rebel Basestar game board in play with the ' +
            'Basestar Allegiance marker set to its Cylon side..',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    DESTROY_THE_HUB: {
        name: 'Destroy the Hub',
        text: "Death would be permanent for all of us. They've gone insane. -Cavil",
        graphic: 'BSD_Missions_DestroyTheHub.jpg',
        pass: 'Flip the Cylon Locations overlay over. If a player is sent to the Resurrection Ship location, they' +
        ' are now sent to the Hub Destroyed location instead.',
        fail: '-1 population. Return all vipers in space areas to the Reseres and then damage 2 vipers.',
        value: 0,
        skillCheck: {
            value: 14,
            types: [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text: '(L/T/PI)(14) PASS: Flip the Cylon Locations overlay over. If a player is sent to the ' +
            'Resurrection Ship location, they are now sent to the Hub Destroyed location instead., ' +
            'FAIL: -1 population. Return all vipers in space areas to the Reseres and then damage 2 vipers.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    DIGGING_UP_THE_PAST: {
        name: 'Digging Up the Past',
        text: "The thirteenth tribe, a tribe of Cylons, came to this planet and called it Earth. -Saul Tigh",
        graphic: 'BSD_Missions_DiggingUpThePast.jpg',
        pass: 'This card counts as 1 distance. The next time the fleet jumps, place this card next to the Earth Card.',
        fail: 'Shuffle 2 Treachery Cards into the Destiny deck and turn this card facedown on the "Active Mission" space.',
        value: 1,
        skillCheck: {
            value: 14,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text: '(PO/L)(14) PASS: This card counts as 1 distance. The next time the fleet jumps, ' +
            'place this card next to the Earth Card, FAIL: Shuffle 2 Treachery Cards into the ' +
            'Destiny deck and turn this card facedown on the "Active Mission" space.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    NEEDS_OF_THE_PEOPLE: {
        name: 'Needs of the People',
        text: "What you have right now is starving civilians, with no representation. - Gaius Baltar",
        graphic: 'BSD_Missions_NeedsOfThePeople.jpg',
        pass: '+2 food and repair 1 damaged location.',
        fail: '-1 food and each human player draws a Treachery Card.',
        value: 0,
        skillCheck: {
            value: 18,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.ENGINEERING],
            text: '(PO/L/E)(18) PASS: +2 food and repair 1 damaged location,' +
            ' FAIL: -1 food and each human player draws a Treachery Card.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    RESCUE_HERA: {
        name: 'Rescue Hera',
        text: "Without her. our children are going to die off one by one. -Ellen Tigh",
        graphic: 'BSD_Missions_RescueHera.jpg',
        pass: 'Each human player that does not have a miracle token gains 1 miracle token.',
        fail: '-1 morale and destroy a raptor.',
        value: 0,
        skillCheck: {
            value: 20,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text: '(PO/T/PI)(20) PASS: Each human player that does not have a miracle token gains 1 miracle token' +
            ', FAIL: -1 morale and destroy a raptor.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    THE_RED_STRIPES: {
        name: 'The Red Stripes',
        text: "Let them find their own destiny, I think they've earned their freedom. -Ellen Tigh",
        graphic: 'BSD_Missions_TheRedStripes.jpg',
        pass: 'Remove all heavy raiders and conturions from the board. Then, remove 2' +
        ' heavy raiders and 2 conturions from the game.',
        fail: 'Place 1 heavy raider in frount of Galactica and 1 centurion at the start of the Boarding Party track',
        value: 0,
        skillCheck: {
            value: 16,
            types: [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text: '(T/PI/E)(16) PASS: Remove all heavy raiders and conturions from the board. Then, remove 2' +
            ' heavy raiders and 2 conturions from the game, FAIL: Place 1 heavy raider in frount of' +
            ' Galactica and 1 centurion at the start of the Boarding Party track.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
    THE_SEARCH_FOR_HOME: {
        name: 'The Search For Home',
        text: "It's just the next hurdle. The key is to, you know, not panic. Just trust yourself. -Slick",
        graphic: 'BSD_Missions_TheSearchForHome.jpg',
        pass: 'This card counts as 1 distance. The next time the fleet jumps, place this card next to the Earth Card',
        fail: '-1 fuel. Then turn this card facedown on the "Active Mission" space.',
        value: 2,
        skillCheck: {
            value: 25,
            types: [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text: '(PO/L/T/E)() PASS: This card counts as 1 distance. The next time the fleet ' +
            'jumps, place this card next to the Earth Card, FAIL: -1 fuel. Then turn this' +
            ' card facedown on the "Active Mission" space.',
            pass: game => {
                //TODO
            },
            fail: game => {
                //TODO
            },
        },
    },
    
});

const MotiveMap = Object.freeze({
    
    //cardback graphic : 'BSD_MotivesBack.jpg'
    
    A_FALSE_SENSE_OF_SECURITY: {
        name: 'A False Sense of Security',
        graphic: 'BSD_Motives_AFalseSenseOfSecurity.jpg',
        text: 'Reveal this card if the game is over and morale is at 3 or more',
        allegiance: 'cylon',
    },
    
    A_JUSTIFIED_RESPONSE: {
        name: 'A Justified Response',
        graphic: 'BSD_Motives_AJustifiedResponse.jpg',
        text: 'Reveal this card if the fleet marker is on a blue space of the Jump Preparation' +
        ' track and there are no raiders, heavy raiders, or basestars on the board.',
        allegiance: 'cylon',
    },
    
    END_THE_CHASE: {
        name: 'End the Chase',
        graphic: 'BSD_Motives_EndTheChase.jpg',
        text: 'Reveal this card if "FTL Control" or "Admiral\'s Quarters" is damaged.',
        allegiance: 'human',
    },
    
    FIGHT_WITH_HONOR: {
        name: 'Right with Honor',
        graphic: 'BSD_Motives_FightWithHonor.jpg',
        text: 'Reveal this card if the game is over and you have at least 3 Treachery Cards in your hand of Skill Cards',
        allegiance: 'human',
    },
    
    HARVEST_THEIR_RESOURCES: {
        name: 'Harvest their Resources',
        graphic: 'BSD_Motives_HarvestTheirResources.jpg',
        text: 'Reveal this card if the game is over and food is at 2 or more.',
        allegiance: 'cylon',
    },
    
    IMPROVE_EFFICIENCY: {
        name: 'Improve Efficiency',
        graphic: 'BSD_Motives_ImproveEfficiency.jpg',
        text: 'Reveal this card if the game is over and yu have at least 1 politics card, ' +
        '1 tactics card and 1 engineering card in your hand of Skill Cards.',
        allegiance: 'human',
    },
    
    KEEP_THEM_DOCILE: {
        name: 'Keep them Docile',
        graphic: 'BSD_Motives_KeepThemDocile.jpg',
        text: 'Reveal this card if the game is over and food is 4 or less.',
        allegiance: 'human',
    },
    
    LEARN_TO_CHERISH: {
        name: 'Learn to Cherish',
        graphic: 'BSD_Motives_LearnToCherish.jpg',
        text: 'Reveal this card if the game is over and population is 6 or less.',
        allegiance: 'human',
    },
    
    MAKE_AN_ALLY: {
        name: 'Make an Ally',
        graphic: 'BSD_Motives_MakeAnAlly.jpg',
        text: 'Reveal this card if another player is in the Brig and you have a Mutiny Card.<br/>' +
        '<b>*When playing at The Hybrid you may reveal this card if two other players are in the Brig.</b>',
        allegiance: 'human',
    },
    
    NO_UNNECESSARY_FORCE: {
        name: 'No Unnecessary Force',
        graphic: 'BSD_Motives_NoUnnecessaryForce.jpg',
        text: 'Reveal this card if 5<b>*</b> or more distance has been traveled and no centurions are on the ' +
        'Boarding Party track.<br/><b>* 7 if playing the 4 destinations campaign</b>',
        allegiance: 'cylon',
    },
    
    PRESSURE_THEIR_LEADERS: {
        name: 'Pressure their Leaders',
        graphic: 'BSD_Motives_PressureTheirLeaders.jpg',
        text: 'Reveal this card if the game is over and morale is 5 or less.',
        allegiance: 'human',
    },
    
    REMOVE_THE_THREAT: {
        name: 'Remove the Threat',
        graphic: 'BSD_Motives_RemoveTheThreat.jpg',
        text: 'Reveal this card if the game is over and at least 4 vipers are damaged or destroyed.',
        allegiance: 'human',
    },
    
    SAVOR_THEIR_DEMISE: {
        name: 'Savor their Demise',
        graphic: 'BSD_Motives_SavorTheirDemise.jpg',
        text: 'Reveal this card if the game is over and 7<b>*</b> or more distance has been traveled.<br/>' +
        '<b>* 9 if playing the 4 destinations campaign.</b>',
        allegiance: 'cylon',
    },
    
    SUBJECTS_FOR_STUDY: {
        name: 'Subjects for Study',
        graphic: 'BSD_Motives_SubjectsForStudy.jpg',
        text: 'Reveal this card if the game is over and population is at 4 or more.',
        allegiance: 'cylon',
    },
    
});

const SkillCardMap = Object.freeze({
    
    //TODO find totals
    
    /*
        INSTALL_UPGRADES - Skill Check:
            If this skill check passes, the current player draws 2 Engineering Cards
            if it fails he draws 1 Engineering Card.
    */
    
    INSTALL_UPGRADES_0: {
        name: 'Install Upgrades',
        graphic: 'BSD_Skill_Eng_InstallUpgrades.png',
        type: SkillTypeEnum.ENGINEERING,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
        
    },
    
    /*
        RAPTOR_SPECIALIST - Action:
            Either destroy a raptor to gain an assault raptor or return a destroyed raptor to the "Reserves".
    */
    
    RAPTOR_SPECIALIST_3: {
        name: 'Raptor Specialist',
        graphic: 'BSD_Skill_Eng_RaptorSpecialist3.png',
        type: SkillTypeEnum.ENGINEERING,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    RAPTOR_SPECIALIST_4: {
        name: 'Raptor Specialist',
        graphic: 'BSD_Skill_Eng_RaptorSpecialist4.png',
        type: SkillTypeEnum.ENGINEERING,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        TEST_THE_LIMITS - Action:
            If the fleet marker is not on a blue space of the Jump preparation track, increase the track by 1
            and roll a die. if 5 or lower, damage Galactica.
    */
    
    TEST_THE_LIMITS_5: {
        name: 'Test the Limits',
        graphic: 'BSD_Skill_Eng_TestTheLimits.png',
        type: SkillTypeEnum.ENGINEERING,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        ALL_HANDS_ON_DECK - skill check:
            For each Skill Card in this check with a strength of "0," add 1 to the check's total strength.
    */
    
    ALL_HANDS_ON_DECK_0: {
        name: 'All Hands on Deck',
        graphic: 'BSD_Skill_Lea_AllHandsOnDeck.png',
        type: SkillTypeEnum.LEADERSHIP,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        CHANGE_OF_PLANS:
            Play this card after a skill check is passed.
            Instead of resolving the "pass" result, each human player draws 2 Skill Cards.
    */
    
    CHANGE_OF_PLANS_5: {
        name: 'Change of Plans',
        graphic: 'BSD_Skill_Lea_ChangeOfPlans.png',
        type: SkillTypeEnum.LEADERSHIP,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.AFTER_SKILL_PASS,
    },
    
    /*
        RESTORE_ORDER:
            Play before cards are added to a skill check.
            Do not resolve skill check abilities while resolving this skill check.
    */
    
    RESTORE_ORDER_3: {
        name: 'Restore Order',
        graphic: 'BSD_Skill_Lea_RestoreOrder3.png',
        type: SkillTypeEnum.LEADERSHIP,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    RESTORE_ORDER_4: {
        name: 'Restore Order',
        graphic: 'BSD_Skill_Lea_RestoreOrder4.png',
        type: SkillTypeEnum.LEADERSHIP,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        COMBAT_VETERAN - Action:
            Choose 1 unmanned viper in the "Reserves" or a space area and activate it up to 3 times.
    */
    
    COMBAT_VETERAN_3: {
        name: 'Combat Veteran',
        graphic: 'BSD_Skill_Pil_CombatVeteran3.png',
        type: SkillTypeEnum.PILOTING,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    COMBAT_VETERAN_4: {
        name: 'Combat Veteran',
        graphic: 'BSD_Skill_Pil_CombatVeteran4.png',
        type: SkillTypeEnum.PILOTING,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        DOGFIGHT - skill check:
            The current player may damage 1 viper in a space area or in the "Reserves" to remove this skill check.
    */
    
    DOGFIGHT_0: {
        name: 'Dogfight',
        graphic: 'BSD_Skill_Pil_Dogfight.png',
        type: SkillTypeEnum.PILOTING,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        LAUNCH_RESERVES - action:
            Place up to 2 unmanned vipers from the "Reserves" into a space area containing a piloted viper.
            Then, activate those unmanned vipers.
    */
    
    LAUNCH_RESERVES_5: {
        name: 'Launch Reserves',
        graphic: 'BSD_Skill_Pil_LaunchReserves.png',
        type: SkillTypeEnum.PILOTING,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        FORCE_THEIR_HAND - skill check:
            If the current payer is a human player, he may play 1 Skill Card faceup int this check. If he does not, he must draw 1 mutiny Card.
    */
    
    FORCE_THEIR_HAND_0: {
        name: 'Force their Hand',
        graphic: 'BSD_Skill_Pol_ForceTheirHand.png',
        type: SkillTypeEnum.POLITICS,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        NEGOTIATION - action:
            Place a basestar in front of Galactica and draw a Politics Card.
            Do not launch or activate any Cylon ships for the rest of this turn.
    */
    
    NEGOTIATION_5: {
        name: 'Negotiation',
        graphic: 'BSD_Skill_Pol_Negotiation.png',
        type: SkillTypeEnum.POLITICS,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        POPULAR_INFLUENCE - action:
            Draw 2 Quorum Cards and choose 1 to give to the President. Then, either play or discard the other card.
    */
    
    POPULAR_INFLUENCE_3: {
        name: 'Popular influence',
        graphic: 'BSD_Skill_Pol_PopularInfluence3.png',
        type: SkillTypeEnum.POLITICS,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    POPULAR_INFLUENCE_4: {
        name: 'Popular influence',
        graphic: 'BSD_Skill_Pol_PopularInfluence4.png',
        type: SkillTypeEnum.POLITICS,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        A_SECOND_CHANCE:
            Play before cards are added to a skill check.
            If the check passes the printed difficulty by 4 or more, the current player gains 1 miracle token.
    */
    
    A_SECOND_CHANCE_5: {
        name: 'A Second Chance',
        graphic: 'BSD_Skill_Tac_ASecondChance.png',
        type: SkillTypeEnum.TACTICS,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        QUICK_THINKING - skill check:
            The current player may choose 1 with a strength of 3 or less (not a "Quick Thinking" Card)
            to remove from this check and add to his had.
    */
    
    QUICK_THINKING_0: {
        name: 'Quick Thinking',
        graphic: 'BSD_Skill_Tac_QuickThinking.png',
        type: SkillTypeEnum.TACTICS,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        UNORTHODOX_PLAN - action:
            Activate one of the following locations, even if it is damaged:
            "Command" "Armory" "Weapons Control" or "Communications".
    */
    
    UNORTHODOX_PLAN_3: {
        name: 'Unorthodox Plan',
        graphic: 'BSD_Skill_Tac_UnorthodoxPlan3.png',
        type: SkillTypeEnum.TACTICS,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    UNORTHODOX_PLAN_4: {
        name: 'Unorthodox Plan',
        graphic: 'BSD_Skill_Tac_UnorthodoxPlan4.png',
        type: SkillTypeEnum.TACTICS,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.ACTION,
    },
    
    /*
        A_BETTER_MACHINE - skill check:
            text.
    */
    
    A_BETTER_MACHINE_3: {
        name: 'A Better Machine',
        graphic: 'BSD_Skill_Tre_ABetterMachine.png',
        type: SkillTypeEnum.TREACHERY,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        BAIT - skill check:
            Place 1 civilian ship behind Galactica.
            When a player chooses to discard this card they draw 1 mutiny card.
    */
    
    BAIT_0: {
        name: 'Bait',
        graphic: 'BSD_Skill_Tre_Bait.png',
        type: SkillTypeEnum.TREACHERY,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        DRADIS_CONTACT - skill check:
            Place 2 raiders in front of Galactica.
            When a player chooses to discard this card they draw 1 mutiny card.
    */
    
    DRADIS_CONTACT_0: {
        name: 'Dradis Contact',
        graphic: 'BSD_Skill_Tre_DradisContact.png',
        type: SkillTypeEnum.TREACHERY,
        value: 0,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        EXPLOIT_A_WEAKNESS - skill check:
            The current player must choose a human player to draw 1 Mutiny Card.
    */
    
    EXPLOIT_A_WEAKNESS_5: {
        name: 'Exploit a Weakness',
        graphic: 'BSD_Skill_Tre_ExploitAWeakness.png',
        type: SkillTypeEnum.TREACHERY,
        value: 5,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        PERSONAL_VICES - skill check:
            Each human player draws 1 Treachery Card.
            If the current player is a human player, he also draws a Mutiny Card.
    */
    
    PERSONAL_VICES_3: {
        name: 'Peronal Vices',
        graphic: 'BSD_Skill_Tre_PersonalVices.png',
        type: SkillTypeEnum.TREACHERY,
        value: 3,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
    /*
        VIOLENT_OUTBURSTS - skill check:
            The current player is sent to "Sickbay".
    */
    
    VIOLENT_OUTBURSTS_4: {
        name: 'Violent Outbursts',
        graphic: 'BSD_Skill_Tre_ViolentOutbursts.png',
        type: SkillTypeEnum.TREACHERY,
        value: 4,
        total: 0,
        playTime: SkillPlayTimeEnum.NONE,
    },
    
});

const LocationMap = Object.freeze({
    
    // Colonial One overlay graphic : 'Daybreak_Colonial_One.png'
    // Colonial One destroyed overlay graphic : 'Daybreak_Colonial_One_Destroyed.png'
    // Demetrius game board graphic : 'Daybreak_Demetrius.png'
    // Rebel basestar game board graphic : 'Daybreak_Rebel_Basestar.png'
    // Rebel basestar allegiance tokens :
    //              human graphic : 'BSD_Allegiance_Human.png'
    //              cylon graphic : 'BSD_Allegiance_Cylon.png'
    //              blank graphic : 'BSD_Allegiance_Blank.png'
    // Cylon overlays :
    //              normal graphic : 'BSD_CylonOverlay1.png'
    //              hub destroyed graphic : 'BSD_CylonOverlay2.png'
    
    //Cylon overlay is same as pegasus
    
    HUB_DESTROYED : {
        name : 'Hub Destroyed',
        area : 'cylon',
        enum : LocationEnum.HUB_DESTROYED,
        text : 'During your Draw Skills Step, discard al of your Super Crisis Cards and do not draw Skill Cards' +
        '<br/>Action: Discard 3 Skill Cards to draw 1 Super Crisis Card and move to the Cylon Fleet location.',
    },
    
    //COLONIAL ONE OVERLAY:
    
    QUORUM_CHAMBER : {
        name : 'Quorum Chamber',
        area : 'human',
        enum : LocationEnum.QUORUM_CHAMBER,
        text : 'Action: If you are the President, draw 1 Quorum Card. You may then ether draw 1 additional' +
        ' Quorum Card or play 1 from your hand.',
    },
    
    PRESS_ROOM : {
        name : 'Press Room',
        area : 'human',
        enum : LocationEnum.PRESS_ROOM,
        text : 'Action: Choose another player to draw 1 Mutiny Card.(He does not move to the Brig) ' +
        'He keeps 1 of his Mutiny Cards and discards the rest. You may then discard a Mutiny Card.',
    },
    
    //Presidents Office same as original
    
    ADMINISTRATION : {
        name : 'Administration',
        area : 'human',
        enum : LocationEnum.ADMINISTRATION,
        text : 'Action: Draw 1 Mutiny Card. If the President has any Mutiny Cards, choose a player to gain ' +
        'the Presidents title. If the Accept Prophecy card is in play, the President may discard it to keep his title.',
    },
    
    //DEMETRUIUS BOARD LOCATIONS:
    
    BRIDGE : {
        name : 'Bridge',
        area : 'human',
        enum : LocationEnum.BRIDGE,
        text : 'Action: If there is no MissionCard on the Active Mission space, ' +
        'activate the top card of the Mission deck.<br/><b>Do not draw a Crisis Card this turn.</b>',
    },
    
    TACTICAL_PLOT : {
        name : 'Tactical Plot',
        area : 'human',
        enum : LocationEnum.TACTICAL_PLOT,
        text : 'Action: Look at the top card of the Mission deck and place it on the top of bottom of the deck.',
    },
    
    CAPTAINS_CABIN : {
        name : 'Captin\'s Cabin',
        area : 'human',
        enum : LocationEnum.CAPTAINS_CABIN,
        text : 'Action: Choose a skill type (it may be from outside your skill set). ' +
        'Each player, including Cylon players, draws 1 Skill Card of that type.',
    },
    
    /*  Active Mission space:
            When the fleet jumps: If this card is face up and has a distance number on it,
            place it next to the Earth Object Card. If this card is face up and does not have a distance number,
            discard it. If this card is facedown, reshuffle it back into the mission deck.
    */
    
    //REBEL BASESTAR LOCATIONS: (for area, it changes)
    
    HYBRID_TANK : {
        name : 'Hybrid Tank',
        area : '????',
        enum : LocationEnum.HYBRID_TANK,
        text : 'Action: Discard a miracle token or a Super Crisis Card to look at the top 5 cards on the Crisis deck.' +
        ' Then, place them on the top of the deck in the order of your choosing.',
    },
    
    DATASTREAM : {
        name : 'Datastream',
        area : '????',
        enum : LocationEnum.DATASTREAM,
        text : 'Action: Discard a miracle token or a Super Crisis Card to search 1 Skill deck and its discard pile ' +
        'for any 3 cards. Then ann those cards to your hand and shuffle the discard pile into the deck.'
    },
    
    RAIDER_BAY : {
        name : 'Raider Bay',
        area : '????',
        enum : LocationEnum.RAIDER_BAY,
        text : 'Action: Discard a miracle token or a Super Crisis Card to choose a space area. ' +
        'Place either 2 raiders or 4 unmanned vipers in this area and immediately activate them.'
    },

});

const Extras = Object.freeze({});

exports.data = Object.freeze({
    CrisisMap: CrisisMap,
    LoyaltyMap: LoyaltyMap,
    CharacterMap: CharacterMap,
    MutinyMap: MutinyMap,
    MissionMap: MissionMap,
    MotiveMap: MotiveMap,
    SkillCardMap: SkillCardMap,
    LocationMap: LocationMap,
    Extras: Extras,
});
