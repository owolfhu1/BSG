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



const CrisisMap = Object.freeze({});

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