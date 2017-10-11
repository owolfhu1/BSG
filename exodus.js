/*
    exodus expansion includes :
        - 40 Crisis Cards - CrisisMap
        - 35 Ally Cards - AllyMap
        - 20 Loyalty Cards - LoyaltyMap
        - 7 Crossroads Cards - CrossroadMap
        - 3 Quorum Cards - QuorumMap
        - 3 Super Crisis Cards - SuperCrisisMap
        - 2 alt Admiral & CAG roll cards - RollMap
        - 20 skill cards - SkillCardMap
        - 7 Destination cards - DestinationMap
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
    
    AMBUSHED_BY_THE_PRESS : {
        name : 'Ambushed by the Press',
        text : "Alright. Enough of this crap. We're done here. -Tory Foster",
        graphic : 'BSE_Crisis_Ambushed_Press.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale (-OR-) The President must discard all of their Skill Cards.',
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
    
    CENTURION_ASSAULT : {
        name : 'Centurion Assault',
        text : "Somewhere in the North valley. Okay, get your men on the line. " +
        "Full ammo loads. They're comming from the North. Lee \"Apollo\" Adama",
        graphic : 'BSE_Crisis_Cent_Assault.png',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(9) PASS: no effect, FAIL: Destroy 1 raptor and the current player is sent to Sickbay.',
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
    
    CONSULT_THE_PRISONER : {
        name : 'Consult the Prisoner',
        text : "Make him belive that if he collaborates, at the very least, he'll have his life -Laura Roslin",
        graphic : 'BSE_Crisis_Consult_Prisoner.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T/E)(13) PASS: Increase the Jump Preparation track by 1, ' +
            'FAIL: Each player discards 1 Skill Card and the current player is sent to the Brig ' +
            '(-OR-) The Admiral discards 2 Skill Cards and the current player discards 3 Skill Cards',
            choice1 : game => game.doSkillCheck(CrisisMap.CONSULT_THE_PRISONER.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/T/E)(13) PASS: Increase the Jump Preparation track by 1, ' +
            'FAIL: Each player discards 1 Skill Card and the current player is sent to the Brig.',
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
    
    CONTROVERSIAL_MANUSCRIPT : {
        name : 'Controversial Manuscript',
        text : "He's having is reprinted and passed out among the Fleet " +
        "and he'S calling it, \"My Triumphs, My Mistakes.\" by Gaius Baltar. -Laura Roslin",
        graphic : 'BSE_Crisis_Controversial_Manuscript.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale (-OR-) +1 morale and damage Galactica twice.',
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
    
    CYLON_GENOCIDE : {
        name : 'Cylon Genocide',
        text : "I'm talking about losing a piece of our souls. =Karl 'Helo' Agathon",
        graphic : 'BSE_Crisis_Cylon_Genocide.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : ' (PO/L/T/E)(21) PASS: Destroy all Cylon ships currently on the main game board, ' +
            'FAIL: -1 morale, then activate: basestars, heavy raiders, and launch raiders (-OR-) ' +
            'Roll a die. If 4 or lower, the current player is sent to the Brig.',
            choice1 : game => game.doSkillCheck(CrisisMap.CYLON_GENOCIDE.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 21,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/L/T/E)(21) PASS: Destroy all Cylon ships currently on the main game board, ' +
            'FAIL: -1 morale, then activate: basestars, heavy raiders, and launch raiders.',
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
    
    DIVISIVE_BEHAVIOR : {
        name : 'Divisive Behavior',
        text : "You gonna turn the rest of my pilots against each other? " +
        "Poison the crew? You've already done that, Saul. -William Adama",
        graphic : 'BSE_Crisis_Divisive_Behaviour.png',
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/T/E)(13) PASS: Increase the Jump Preparation track by 1, ' +
            'FAIL: Each player discards 1 Skill Card and the current player is sent to the Brig.',
            consequence : {
                text : 'The current player chooses another player to send to Sickbay',
                action : game => {
                    //TODO
                },
            },
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
    
    FAMILIAR_FACE : {
        name : 'Familiar Face',
        text : "Krypter, Krypter, Krypter! This is Bulldog ... -Daniel 'Bulldog' Novacek",
        graphic : 'BSE_Crisis_Familiar_Face.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(12) PASS: The Admiral may choose a character to send to the Brig, ' +
            'FAIL: -1 morale and the Admiral must discard all of his Skill Cards (-OR-) -1 morale.',
            choice1 : game => game.doSkillCheck(CrisisMap.FAMILIAR_FACE.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(12) PASS: The Admiral may choose a character to send to the Brig, ' +
            'FAIL: -1 morale and the Admiral must discard all of his Skill Cards.',
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
    
    GUILTY_CONSCIENCE : {
        name : 'Guilty Conscience',
        text : "The truth hurts, Bulldog. But it's better to know the truth than to live a lie. -Saul Tigh",
        graphic : 'BSE_Crisis_Guilty_Conscience.png',
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(7) PASS: no effect, FAIL: The current player discards 3 random Skill Cards.',
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
    
    HAUNTED_BY_THE_PAST : {
        name : 'Haunted by the Past',
        text : "I can't believe you'd abandon me... -Ellen Tigh",
        graphic : 'BSE_Crisis_Haunted_Past.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(12) PASS: no effect, FAIL: Each player must discard 1 random Skill Card.',
            consequence : {
                text : 'The current player gives any Title Cards he has to the player (aside from himself)' +
                ' highest on the Line of Succession.',
                action : game => {
                    //TODO
                },
            },
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
    
    APPOINT_HEAD_OF_SECURITY : {
        name : 'Appoint Head of Security',
        text : "Take a good look at this room. Every time you leave, memorize it. " +
        "If anything changes, don't touch it. -Lee 'Apollo' Adama",
        graphic : 'BSE_Crisis_Head_Security.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Return all undamaged vipers on the game board to the "Reserves". ' +
            'Then the Admiral must discard 2 random Skill Cards (-OR-) -1 morale and damage Galactica once.',
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
    
    HERA_RESCUED : {
        name : 'Hera Rescued',
        text : "I believe the future of the Cylon rests with this child ... -Caprica Six",
        graphic : 'BSE_Crisis_Hera_Rescued.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(10) PASS: no effect, FAIL: -2 morale and destroy 1 raptor (-OR-) -1 moral.',
            choice1 : game => game.doSkillCheck(CrisisMap.HERA_RESCUED.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(10) PASS: no effect, FAIL: -2 morale and destroy 1 raptor.',
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
    
    HIDDEN_EXPLOSIVES : {
        name : 'Hidden Explosives',
        text : "If that thing had gone off, we'd be picking up raptor and people parts with tweezers. -'Chief' Galen Tyrol",
        graphic : 'BSE_Crisis_Hidden_Explosives.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Destroy 1 raptor and the current player is sent to Sickbay (-OR-) -1 morale.',
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
    
    HIDDEN_IDENTITY : {
        name : 'Hidden Identity',
        text : "Yeah, because if they find out who you really are, they'll kick you out of the service ... or worse? -Enzo",
        graphic : 'BSE_Crisis_Hidden_Identity.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(12) PASS: no effect, FAIL: -1 morale. Current player is sent to the Brig.',
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
    
    IN_THE_RING : {
        name : 'In the Ring',
        text : "This allows them to let off some steam, out in the open, so everybody can participate. -William Adama",
        graphic : 'BSE_Crisis_In_The_Ring.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(12) PASS: +1 morale, FAIL: -1 morale and the current player is sent to Sickbay.',
            consequence : {
                text : 'The current player chooses another player to send to Sickbay.',
                action : game => {
                    //TODO
                },
            },
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
    
    INTERROGATION : {
        name : 'Interrogation',
        text : "You know, none of us are enjoying this. " +
        "So, why don't you just tell me what I need to know, and your suffering will come to an end. -Laura Roslin",
        graphic : 'BSE_Crisis_Interrogation.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'The admiral chooses another player to send to Sickbay. The Admiral may then look at 1' +
            ' of that character\'s Loyalty Cards at random ' +
            '(-OR-) The Admiral discards 2 Skill Cards; then the current player discards 3 Skill Cards.',
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
    
    JOE_S_BAR : {
        name : "Joe's bar",
        text : "Any friend of the major's is a friend of mine. Which means you get the good stuff. -Joe",
        graphic : 'BSE_Crisis_Joes_Bar.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.ENGINEERING],
            text : '(PO/L/E)(12) PASS: +1 morale, FAIL: -1 morale and the current player is sent to the Brig.',
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
    
    LABOR_DISPUTE : {
        name : 'Labor Dispute',
        text : "There are a lot of dirty jobs that need to be done every day in this fleet:" +
        " cleaning, hauling, low-level maintenace, things like that. - 'Chief' Galen Tyrol",
        graphic : 'BSE_Crisis_Labor_Dispute.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 morale (-OR-) -1 fuel and decrease the Jump Preparation track by 1.',
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
    
    METAL_OF_DISTINCTION : {
        name : 'Metal of Distinction',
        text : "It's not for you. It's for the them. Stand up there," +
        " acknowledge your Fleet and give them what they need: a hero. -Laura Roslin",
        graphic : 'BSE_Crisis_Medal_Distinction.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '+1 morale. place 2 civ ships on the game board, and then: activate raiders (-OR-) -1 morale.',
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
    
    MYSTERIOUS_GUIDE : {
        name : 'Mysterious Guide',
        text : "You'r not Leoben. -Kara 'Starbuck' Thrace",
        graphic : 'BSE_Crisis_Mysterious_Guide.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(11) PASS: Increase the Jump Preparation track by 1, ' +
            'FAIL: -1 fuel and the current player discards all of his Skill Cards (-OR-) -1 morale.',
            choice1 : game => game.doSkillCheck(CrisisMap.MYSTERIOUS_GUIDE.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(11) PASS: Increase the Jump Preparation track by 1,' +
            ' FAIL: -1 fuel and the current player discards all of his Skill Cards.',
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
    
    MYSTERIOUS_MESSAGE : {
        name : 'Mysterious Message',
        text : "Mist of Dreams drip along the nascent echo ... and love no more, End of Line. -Hybrid",
        graphic : 'BSE_Crisis_Mysterious_Message.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/E)(9) PASS: The current player may search the Destiny deck and choose 2 cards to discard. ' +
            'He then reshuffles the Destiny deck, FAIL: launch raiders, activate basestars (-OR-) activate basestars.',
            choice1 : game => game.doSkillCheck(CrisisMap.MYSTERIOUS_MESSAGE.skillCheck),
            choice2 : game => {
                //TODO
            }
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/E)(9) PASS: The current player may search the Destiny deck and choose 2 cards to discard. ' +
            'He then reshuffles the Destiny deck, FAIL: launch raiders, activate basestars.',
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
    
    POWER_FAILURE : {
        name : 'Power Failure',
        text : "We have negative auxiliary power. We're on batteries only. -Anastasia 'Dee' Dualla",
        graphic : 'BSE_Crisis_Power_Failure.png',
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(L/T/E)(14) PASS: no effect, FAIL: reduce the Jump Preparation track by 1.',
            consequence : {
                text : 'Damage Galactica once.',
                action : game => {
                    //TODO
                },
            },
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
    
    RAPTOR_MALFUNCTION : {
        name : 'Raptor Malfunction',
        text : "There's a fire in engine two! It's gonna blow! -Margaret 'Racetrack' Edmondson",
        graphic : 'BSE_Crisis_Raptor_Malfunction.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/PI/E)(12) PASS: no effect, FAIL: Damage Galactica once and destroy 1 raptor ' +
            '(-OR-) The current player is sent to "Sickbay"',
            choice1 : game => game.doSkillCheck(CrisisMap.RAPTOR_MALFUNCTION.skillCheck),
            choice2 : game => {
                //TODO
            }
        },
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(12) PASS: no effect, FAIL: Damage Galactica once and destroy 1 raptor.',
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
    
    SET_A_TRAP : {
        name : 'Set a Trap',
        text : "Three 'clankers' just entered out kill zone. -Lee 'Apollo' Adama",
        graphic : 'BSE_Crisis_Set_A_Trap.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(L/T)(10) PASS: Destroy a centurion on the Boarding Party Track, FAIL: Place a centurion' +
            ' at the start of the Boarding Party track. The current player is sent to "Sickbay" (-OR-)' +
            ' Roll a die. If 4 or lower, place a centurion at the start of the Boarding Party track.',
            choice1 : game => game.doSkillCheck(CrisisMap.SET_A_TRAP.skillCheck),
            choice2 : game => {
                //TODO
            }
        },
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(10) PASS: Destroy a centurion on the Boarding Party Track, ' +
            'FAIL: Place a centurion at the start of the Boarding Party track. The current player is sent to "Sickbay".',
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
    
    STRANGE_BEACON : {
        name : 'Strange Beacon',
        text : "It must have been left here by the Thirteenth Tribe. A beacon carrying the disease, " +
        "left by some humans like you to destroy us. -Dark-haired Six on the infected basestar",
        graphic : 'BSE_Crisis_Strange_Beacon.png',
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(13) PASS: Choose 1 space area on the main game board and remove all Cylon ships in ' +
            'that area, FAIL: Decrease the Jump Preparation track by 1.',
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
    
    TEMPLE_OF_THE_FIVE : {
        name : 'Temple of the Five',
        text : "Our initial radio carbon readings suggest the temple's at least four thousand years old," +
        " which lines up with the exodus of the Thirteenth Tribe. -'Chief' Galen Tyrol",
        graphic : 'BSE_Crisis_Temple_Five.png',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(9) PASS: The current player may draw 2 Skill Cards, FAIL: Decrease the Jump Preparation track by 1.',
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
    
    THE_CIRCLE : {
        name : 'The Circle',
        text : "The Circle has examined the evidence and found you guilty of treason against humanity. -Diana Seelix",
        graphic : 'BSE_Crisis_The_Circle.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'You must choose another player to receive the President title or the current player is executed' +
            ' (-OR-) The President discards 2 Skill Cards, then the current player discards 3 Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            }
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    THE_PASSAGE : {
        name : 'The Passage',
        text : "Once you jump in, the light is so blinding you begin to drift . -Sharon 'Athena' Agathon",
        graphic : 'BSE_Crisis_The_Passage.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(T/PI/E)(14) PASS:Increase the Jump Preparation track by 1, FAIL: Destroy 2 civilian ships (-OR-)' +
            ' Roll a die. If 6 or lower, the current player is sent to "Sickbay".',
            choice1 : game => game.doSkillCheck(CrisisMap.THE_PASSAGE.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(T/PI/E)(14) PASS:Increase the Jump Preparation track by 1, FAIL: Destroy 2 civilian ships.',
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
    
    THREAT_OF_SUPER_NOVA : {
        name : 'Threat of Super Nova',
        text : "They don't want to be here when that nova shock front gets here - neither do we. -Saul Tigh",
        graphic : 'BSE_Crisis_Threat_S_Nova.png',
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING],
            text : '(L/PI/E)(10) PASS: no effect, FAIL: -1 population and damage Galactica.',
            consequence : {
                text : 'activate basestars.',
                action : game => {
                    //TODO
                },
            },
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
    
    TRUTH_AND_RECONCILIATION : {
        name : 'Truth and Reconciliation',
        text : "We are all victims of the Cylons and none of us can be impartial. -Laura Roslin",
        graphic : 'BSE_Crisis_Truth_Reconcile.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale and the President must choose a character to send to the Brig (-OR-) ' +
            'The President discards 2 Skill Cards, then the current player discards 3 Skill Cards.',
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
    
    UNEXPECTED_DEATHS : {
        name : 'Unexpected Deaths',
        text : "Capricans? Oh, he likes Capricans. The mortality rate was six percent. Sagitarrons? Ninety percent." +
        " Ninety percent of the Sagitarrons died. -Karl 'Helo' Agathon",
        graphic : 'BSE_Crisis_Unexplained_Deaths.png',
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(8) PASS: no effect, FAIL: -1 morale, -1 population.',
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
    
    UNFAIR_BIAS : {
        name : 'Unfair Bias',
        text : "That's because they're a bunch of stubborn root-sucking jack-asses holding onto" +
        " traditions that are a thousand years old. -Saul Tigh",
        graphic : 'BSE_Crisis_Unfair_Bias.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(12) PASS: no effect, FAIL: Damage Galactica and the current player discards ' +
            'his hand of Skill Cards.',
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
    
    UNWELCOME_FACES : {
        name : 'Unwelcome Faces',
        text : "Well, you just lost your visiting privileges. Hold that thing here until we get back. -Saul Tigh",
        graphic : 'BSE_Crisis_Unwelcome_Faces.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : "The Admiral must discard all of his skill cards and then choose a character to send to the Brig " +
            "(-OR-) -1 morale and damage Galactica once."
            choice1 : {
                //TODO
            },
            choice2 : {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    WIDESPREAD_STARVATION : {
        name : 'Widespread Starvation',
        text : "There is no food here. There are no rations anywhere on this ship. It someone told you there" +
        " was food, they were lying! -Anastasia 'Dee' Dualla",
        graphic : 'BSE_Crisis_Widespread_Starve.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-2 food (-OR-) -1 food, -1 population.',
            choice1 : {
                //TODO
            },
            choice2 : {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
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

const SkillCardMap = Object.freeze({});

const DestinationMap = Object.freeze({});

exports.data = Object.freeze({
    CrisisMap : CrisisMap,
    AllyMap : AllyMap,
    LoyaltyMap : LoyaltyMap,
    CrossroadMap : CrossroadMap,
    QuorumMap : QuorumMap,
    SuperCrisisMap : SuperCrisisMap,
    LocationMap : LocationMap,
    TitleMap : TitleMap,
    SkillCardMap : SkillCardMap,
    DestinationMap : DestinationMap,
});