/*
    exodus expansion includes :
        - 40 Crisis Cards - CrisisMap
        - 35 Ally Cards - AllyMap
        - 20 Loyalty Cards - LoyaltyMap
        - 7 Crossroads Cards - CrossroadMap
        - 3 Quorum Cards - QuorumMap
        - 3 Super Crisis Cards - SuperCrisisMap
        -
*/

const enums = require(__dirname + '/enums').enums;

const CrisisMap = Object.freeze({});

const AllyMap = Object.freeze({});

const LoyaltyMap = Object.freeze({});

const CrossroadMap = Object.freeze({});

const QuorumMap = Object.freeze({});

const SuperCrisisMap = Object.freeze({});

const LocationMap = Object.freeze({});

exports.data = Object.freeze({
    CrisisMap : CrisisMap,
    AllyMap : AllyMap,
    LoyaltyMap : LoyaltyMap,
    CrossroadMap : CrossroadMap,
    QuorumMap : QuorumMap,
    SuperCrisisMap : SuperCrisisMap,
    LocationMap : LocationMap,
});