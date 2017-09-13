/*
    exodus expansion includes :
        - 40 Crisis Cards - CrisisMap
        - 35 Ally Cards - AllyMap
        - 20 Loyalty Cards - LoyaltyMap
        - 7 Crossroads Cards - CrossroadMap
        - 3 Quorum Cards - QuorumMap
        - 3 Super Crisis Cards - SuperCrisisMap
        - 2 alt Admiral & CAG roll cards - RollMap
*/

const enums = require(__dirname + '/enums').enums;
const CylonActivationTypeEnum = enums.CylonActivationTypeEnum;
const WhoEnum = enums.WhoEnum;
const SkillTypeEnum = enums.SkillTypeEnum;

const CrisisMap = Object.freeze({
    
    //cylon
    
    DETENTE : {
        name : 'Detente',
        text : 'We have a stand-off. Very predictable. -Brother Cavil',
        graphic : 'BSEC_Crisis_Detente.png',
        choose : {
            who : WhoEnum.CAG,
            text : 'All vipers in space areas are returned to the Reserves. ' +
            'All characters who were piloting vipers are placed in the Hanger Deck. ' +
            'Increase the Pursuit track by 1 (-OR-) Activate: basestars, raiders,heavy raiders.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    RAIDERS_INBOUND : {
        name : 'Raiders Inbound',
        text : 'Hostiles inbound! Two hundres plus! -Felix Gaeta',
        graphic : 'BSEC_Crisis_Raiders_Inbound.png',
        choose : {
            who : WhoEnum.CAG,
            text : '-1 population and damage Galactica once. (-OR-)' +
            ' The CAG and the Admiral must each discard 3 Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    RETURN_TO_DUTY : {
        name : 'Return to Duty',
        text : 'If you wanna die, I\'ll open up and airlock for you. ' +
        'But you are not taking one of my vipers with you. -Lee Adama',
        graphic : 'BSEC_Crisis_Return_Duty.png',
        choose : {
            who : WhoEnum.CAG,
            text : 'Any character on Galactica with piloting in his skill set may immediately launch ' +
            'himself in a viper. Then launch raiders (-OR-) activate basestars.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    REVIEW_CAMERA_FOOTAGE : {
        name : 'Review Camera Footage',
        text : 'Chief, I\'m going to need you to develop my gun camera footage ASAP. -Kara "Starbuck" Thrace',
        graphic : 'BSEC_Crisis_Review_Footage.png',
        choose : {
            who : WhoEnum.CAG,
            text : 'Damage 2 vipers in the Reserves (if able) and increase the Pursuit track by 1. The CAG may activate' +
            ' 1 unmanned viper (-OR-) The CAG discards 2 Skill Cards, then the current player discards 3 Skill Cards.',
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
    
    TRACKED_BY_RADIATION : {
        name : 'Tracked by Radiation',
        text : "In the last battle, we discovered your fuel ship ... had a unique radiation signature. " +
        "They must have found a way to track it. -Captrica Six",
        graphic : 'BSEC_Crisis_Tracked_Radiation.png',
        choose : {
            who : WhoEnum.CAG,
            text : 'Place a basestar and 3 raiders in frount of Galactica and 2 civilian ships behind Galctica ' +
            '(-OR-) -1 fuel.',
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
    
    TRAINING_A_ROOKIE : {
        name : 'Training a Rookie',
        text : '',
        graphic : 'BSEC_Crisis_Training_Rookie.png',
        choose : {
            who : WhoEnum.CAG,
            text : 'Activate one unmanned viper. Then activate raiders (-OR-) The CAG chooses ' +
            '2 vipers that are not currently damaged or destroyed and moves them to the Damaged Viper box.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    //regular
    
    AIRLOCK_LEAK : {
        name : 'Airlock Leak',
        text : 'From a leak that size, they\'ll be out of air in half an hour. Maybe less. -Lee "Apollo" Adama',
        graphic : 'BSE_Crisis_Airlock_Leak.png',
        skillCheck : {
            value : 6,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(6) PASS: no effect, FAIL: Damage Galactica and the current player is sent to Sickbay.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    XXX : {
        name : '',
        text : "",
        graphic : '',
        
        jump : false,
        cylons : CylonActivationTypeEnum,
    },
    
});

const AllyMap = Object.freeze({});

const LoyaltyMap = Object.freeze({});

const CrossroadMap = Object.freeze({});

const QuorumMap = Object.freeze({});

const SuperCrisisMap = Object.freeze({});

const LocationMap = Object.freeze({});

const TitleMap = Object.freeze({

    ADMIRAL : {
        name : 'Admiral',
        graphic : 'BSE_Title_Admiral.png',
        text : 'When the fleet jumps, you draw 2 Destination Cards and choose 1. You control the nuke tokens.' +
        'Action: Launch 1 nuke at a space area(the nuke token is discarded). 1-2 = Damage a basestar twice,' +
        ' 3 - 6 = Destroy a basestar, 7 = Destroy a basestar and 3 raiders, 8 = Destroy every ship in the space area.'
    },
    
    CAG : {
        name : 'CAG',
        graphic : 'BSE_Title_CAG.png',
        text : 'When a civilian ship needs to be placed on the main game board, you choose the space area. ' +
        'You must choose an area that does not already contain civilian ships (if able). ' +
        'Action: Activate 1 unmanned viper and then give the CAG Title Card to any other human player. ' +
        'Action:  Once per turn, if you are piloting a viper, you may activate 1 unmanned viper ' +
        'and then take another action.',
    },

});

exports.data = Object.freeze({
    CrisisMap : CrisisMap,
    AllyMap : AllyMap,
    LoyaltyMap : LoyaltyMap,
    CrossroadMap : CrossroadMap,
    QuorumMap : QuorumMap,
    SuperCrisisMap : SuperCrisisMap,
    LocationMap : LocationMap,
    TitleMap : TitleMap,
});