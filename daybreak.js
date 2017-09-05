
/*
    daybreak expansion includes :
        - 30 new Crisis Cards: DaybreakCrisisMap
        - 2 new Loyalty Cards: DaybreakLoyaltyMap
        - 12 new characters: DaybreakCharacterMap
        - 22 Mutiny Cards: MutinyMap
        - 8 Mission Cards: MissionMap
        - 14 Motive Cards: MotiveMap
        - 51 new Skill Cards: DaybreakSkillMap
        - 14 new locations: DaybreakLocationMap
        - 2 extra cards: DaybreakExtras
*/

const DaybreakCrisisMap = Object.freeze({});

const DaybreakLoyaltyMap = Object.freeze({});

const DaybreakCharacterMap = Object.freeze({});

const MutinyMap = Object.freeze({});

const MissionMap = Object.freeze({

    // cardback graphic : 'BSD_MissionBack.jpg'
    
    ATTACK_ON_THE_COLONY : {
        name : 'Attack on the Colony',
        text : "Galactica's ... gone through a lot of battles. This will be her last. -William Adama",
        graphic : 'BSD_Missions_AttackOnTheColony.jpg',
        pass : 'Remove All basestars from the board. Then, remove 1 basestar from the game.',
        fail : 'Place 1 basestar in front of Galactica and damage Galactica.',
        value : 0,
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : `(T/PI)(14) PASS: ${
                MissionMap.ATTACK_ON_THE_COLONY.pass} FAIL: ${MissionMap.ATTACK_ON_THE_COLONY.fail}`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    CYLON_CIVIL_WAR : {
        name : 'Cylon Civil War',
        text : "The whole fleet is split right down the middle. -Sharon \"Boomer\" Valerii",
        graphic : 'BSD_Missions_CylonCivilWar.jpg',
        pass : 'Please the Rebel Basestar game board in play with the Basestar Allegiance marker set to its human side.',
        fail : 'Place the Rebel Basestar game board in play with the Basestar Allegiance marker set to its Cylon side.',
        value : 0,
        skillCheck : {
            value : 21,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : `(PO/L/T)(21) PASS: ${
                MissionMap.CYLON_CIVIL_WAR.pass}, FAIL: ${MissionMap.CYLON_CIVIL_WAR.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    DESTROY_THE_HUB : {
        name : 'Destroy the Hub',
        text : "Death would be permanent for all of us. They've gone insane. -Cavil",
        graphic : 'BSD_Missions_DestroyTheHub.jpg',
        pass : 'Flip the Cylon Locations overlay over. If a player is sent to the Resurrection Ship location, they' +
        ' are now sent to the Hub Destroyed location instead.',
        fail : '-1 population. Return all vipers in space areas to the Reseres and then damage 2 vipers.',
        value : 0,
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : `(L/T/PI)(14) PASS: ${
                MissionMap.DESTROY_THE_HUB.pass}, FAIL: ${MissionMap.DESTROY_THE_HUB.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    DIGGING_UP_THE_PAST : {
        name : 'Digging Up the Past',
        text : "The thirteenth tribe, a tribe of Cylons, came to this planet and called it Earth. -Saul Tigh",
        graphic : 'BSD_Missions_DiggingUpThePast.jpg',
        pass : 'This card counts as 1 distance. The next time the fleet jumps, place this card next to the Earth Card',
        fail : 'Shuffle 2 Treachery Cards into the Destiny deck and turn this card facedown on the "Active Mission" space.',
        value : 1,
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : `(PO/L)(14) PASS: ${
                MissionMap.DIGGING_UP_THE_PAST.pass}, FAIL: ${MissionMap.DIGGING_UP_THE_PAST.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    NEEDS_OF_THE_PEOPLE : {
        name : 'Needs of the People',
        text : "What you have right now is starving civilians, with no representation. - Gaius Baltar",
        graphic : 'BSD_Missions_NeedsOfThePeople.jpg',
        pass : '+2 food and repair 1 damaged location.',
        fail : '-1 food and each human player draws a Treachery Card.',
        value : 0,
        skillCheck : {
            value : 18,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.ENGINEERING],
            text : `(PO/L/E)(18) PASS: ${
                MissionMap.NEEDS_OF_THE_PEOPLE.pass}, FAIL: ${MissionMap.NEEDS_OF_THE_PEOPLE.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    RESCUE_HERA : {
        name : 'Rescue Hera',
        text : "Without her. our children are going to die off one by one. -Ellen Tigh",
        graphic : 'BSD_Missions_RescueHera.jpg',
        pass : 'Each human player that does not have a miracle token gains 1 miracle token.',
        fail : '-1 morale and destroy a raptor.',
        value : 0,
        skillCheck : {
            value : 20,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : `(PO/T/PI)(20) PASS: ${
                MissionMap.RESCUE_HERA.pass}, FAIL: ${MissionMap.RESCUE_HERA.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    THE_RED_STRIPES : {
        name : 'The Red Stripes',
        text : "Let them find their own destiny, I think they've earned their freedom. -Ellen Tigh",
        graphic : 'BSD_Missions_TheRedStripes.jpg',
        pass : 'Remove all heavy raiders and conturions from the board. Then, remove 2' +
        ' heavy raiders and 2 conturions from the game.',
        fail : 'Place 1 heavy raider in frount of Galactica and 1 centurion at the start of the Boarding Party track',
        value : 0,
        skillCheck : {
            value : 16,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : `(T/PI/E)(16) PASS: ${
                MissionMap.THE_RED_STRIPES.pass}, FAIL: ${MissionMap.THE_RED_STRIPES.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },
    
    THE_SEARCH_FOR_HOME : {
        name : 'The Search For Home',
        text : "It's just the next hurdle. The key is to, you know, not panic. Just trust yourself. -Slick",
        graphic : 'BSD_Missions_TheSearchForHome.jpg',
        pass : 'This card counts as 1 distance. The next time the fleet jumps, place this card next to the Earth Card',
        fail : '-1 fuel. Then turn this card facedown on the "Active Mission" space.',
        value : 2,
        skillCheck : {
            value : 25,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : `(PO/L/T/E)() PASS: ${
                MissionMap.THE_SEARCH_FOR_HOME.pass}, FAIL: ${MissionMap.THE_SEARCH_FOR_HOME.fail}.`,
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
    },

});

const DaybreakSkillMap = Object.freeze({});

const DaybreakLocationMap = Object.freeze({});

const DaybreakExtras = Object.freeze({});



