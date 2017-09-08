
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
const CharacterTypeEnum = enums.CharacterTypeEnum;
const LocationEnum = enums.LocationEnum;
const SkillPlayTimeEnum = enums.SkillPlayTimeEnum;

const CrisisMap = Object.freeze({});

const LoyaltyMap = Object.freeze({});

const CharacterMap = Object.freeze({});

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

const LocationMap = Object.freeze({});

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
