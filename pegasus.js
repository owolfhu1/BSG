
/*
    pegasus expansion includes :
        - 20 new crisis cards: PegasusCrisisMap
        - 5 new super crisis cards: PegasusSuperCrisisMap
        - 5 new destination cards: PegasusDestinationMap
        - 2 new loyalty cards: PegasusLoyaltyMap
        - 6 agenda cards: AgendaMap
        - 7 new characters (3 cylon leaders): PegasusCharacterMap
        - 34 new skill cards: PegasusSkillCardMap
        - 30 New Caprica Crisis cards: CapricaCrisisMap
        - 9 new Quorum cards: PegasusQuorumMap
        - 14 new locations: PegasusLocationMap
        - 2 extra cards: PegasusExtras
*/

const PegasusCrisisMap = Object.freeze({
    
    A_VERDICT_OF_GUILTY : {
        name : 'A Verdict of Guilty',
        text : "I dont't take orders from you! - Admiral Cain<br/>" +
        "Call it what you like. I'm getting my men. -Commander Adama",
        graphic : 'BSP_Crisis_A_Vertict_Guilty.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'The current player is executed and the Admiral discards 3 Skill Cards' +
            ' (-OR-) Damage Galactica twice.',
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
    
    AN_OFFER_OF_PEACE : {
        name : 'An Offer of Peace',
        text : "My mission here is simple: to inform you, you've been given a reprieve. " +
        "Man and Cylon will go their separate ways and no harm done. -Cavil",
        graphic : 'BSP_Crisis_An_Offer_Peace.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(12)(6) PASS: no effect, MIDDLE: Shuffle 2 Treachery cards into the Destiny deck, ' +
            'FAIL: -1 Morale and shuffle 2 Treachery cards into the Destiny deck.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 6,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    ASSASSINATION_PLOT : {
        name : 'Assassination Plot',
        text : "Everything about that woman has just come into focus. And I'm afraid this can only end one way." +
        " You'll have to kill her, Bill. -Laura Roslin",
        graphic : 'BSP_Crisis_Assassin_Plot.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'The Admiral and the current player must both discard 3 Skill Cards and draw 3 Treachery Cards. ' +
            '(-OR-) The Admiral is executed.',
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
    
    CIVIAN_SHIP_NUKED : {
        name : 'Civilian Ship Nuked',
        text : "We suspect the wathead was stolen from your lab and smuggled" +
        " aboard Cloud Nine by a Cylon agent. -William Adama",
        graphic : 'BSP_Crisis_Civ_Ship_Nuked.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'Draw 1 civilian ship and destroy it. Then each player discards 1 Skill Card and ' +
            'draws 1 Treachery Card. (-OR-) Draw 2 civilian ships and destroy them.',
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
    
    CODE_BLUE : {
        name : "Code Blue",
        text : "He's a Cylon! Get out of the frakking way! He's a Cylon! -galen Tyrol",
        graphic : 'BSP_Crisis_Code_Blue.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(13) PASS: The current player looks at 1 random Loyalty Card of any player. ' +
            'FAIL: -1 morale and the current player is sent to the Brig. ' +
            '(-OR-) Each player discards 2 Skill Cards and draws 2 Treachery Cards.',
            choice1 : game => game.doSkillCheck(PegasusCrisisMap.CODE_BLUE.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(13) PASS: The current player looks at 1 random Loyalty Card of any player. ' +
            'FAIL: -1 morale and the current player is sent to the Brig.',
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
    
    DEFENDING_A_PRISONER : {
        name : 'Defending a Prisoner',
        text : "Your're not authorized to be here. Get the hell out. This is official business. -Alastair Thorne",
        graphic : 'BSP_Crisis_Defending_Prisoner.png',
        skillCheck : {
            value : 11,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(11) PASS: No effect, FAIL: -1 morale and roll a die.' +
            ' If 4 or lower, the current player is executed.',
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
    //DOGFIGHT - special cylon attack card.
    DOGFIGHT : {
        name : 'Dogfight',
        text : '1) Activate: raiders.<br>2) Setup: 1 basestar, 4 raiders, 2 vipers, and ' +
        '1 civilian ship.<br>3) Special Rule - <i>Constant Barrage:</i> Keep this card in play until the fleet jumps' +
        ' or no raiders remain on the board. Each time raiders are activated, launch two raiders from each basestar' +
        '(do not activate these new raiders).',
        graphic : 'BSP_Crisis_Dogfight.png',
        instructions : game => {
            //TODO
        },
        jump : false,
        cylons : CylonActivationTypeEnum.DOGFIGHT,
    },
    
    FOOD_HOARDING_IN_THE_FLEET : {
        name : 'Food Hoarding in the Fleet',
        text : "We need to control our supply chain, not random thugs." +
        " I hope I can count on the millitary's support -Laura Roslin",
        graphic : 'BSP_Crisis_Food_Hoarding.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale and roll a die. If 3 or less, draw 1 civilian ship and destroy it (-OR-) -2 food.',
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
    
    MEDICAL_BREAKTHROUGH : {
        name : 'Medical Breakthrough',
        text : "Knowning the Cylons have far greater endurance than humans, I was curius. " +
        "Could their blood also be blessed with a heightened resistance to disease? -Gaius Baltar",
        graphic : 'BSP_Crisis_Medical_Breakthrough.png',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.ENGINEERING],
            text : '(PO/L/E)(12)(6) PASS: Each human player draws 1 Skill Card, MIDDLE: no effect, ' +
            'FAIL: -1 morale and each player discards 1 Skill Card and draws 1 Treachery Card.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 6,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    PRESSURE_THE_SUPPLY_SHIPS : {
        name : 'Pressure the Supply Ships',
        text : "I want a raptor and an armed Marine boarding party for every ship refusing the resupply order. -Saul Tigh",
        graphic : 'BSP_Crisis_Pressure_Supply.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '+1 food and -1 morale. The Admiral discards 2 Skill Cards and draws 2 Treachery Cards. (-OR-) -2 food.',
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
    
    REUNITE_THE_FLEET : {
        name : "Reunite the Fleet",
        text : "Commander, I ... I don't even know what to say. This is ... well, it's a miracle. -Helena Cain",
        graphic : 'BSP_Crisis_Reunite_Fleet.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(10) PASS: +1 population, FAIL: -1 moral and each player discards 1 skillcard and draws ' +
            '1 Treachery Card(-OR-) The current player discards 2 random Skill Cards and draws 2 Treachery Cards.',
            choice1 : game => game.doSkillCheck(PegasusCrisisMap.REUNITE_THE_FLEET.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(10) PASS: +1 population, FAIL: -1 moral and each player discards 1 skillcard and draws ' +
            '1 Treachery Card.',
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
    
    REVIEW_GALACTICAS_LOG : {
        name : "Review Galactica's Log",
        text : "Maybe we should ask Admiral Cain for her logs, just so we can put things in context. -Saul Tigh",
        graphic : 'BSP_Crisis_Review_Logs.png',
        skillCheck : {
            value : 14,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(14)(6) PASS: No effect, MIDDLE: the Admiral must discard 3 Skill Cards, ' +
            'FAIL: -1 morale and the Admiral must discard 5 Skill Cards.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 6,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    SABOTAGE_INVESTIGATED : {
        name : "Sabotage Investigated",
        text : "One bad round's a fluke. More than one is sabotage... -Galen Tyrol",
        graphic : 'BSP_Crisis_Sabotage_Investigated.png',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(9) PASS: -1 food, FAIL: -1 morale, -1 fuel, -1 food.',
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
    //SCAR - special cylon attack card.
    SCAR : {
        name : 'Scar',
        text : '1) Activate: raiders.<br>2) Setup: 1 raider with the Scar token, 2 vipers and 2 civilian ships.<br>' +
        '3) Special Rule - <i>Personal Vendetta:</i> Keep this card in play until the fleet jumps or Scar is destroyed.' +
        ' Whenever raiders are activated, activate the Scar raider twice. Scar may only be destroyed by a roll of 7 or 8.',
        graphic : 'BSP_Crisis_Scar.png',
        instructions : game => {
            //TODO
        },
        jump : false,
        cylons : CylonActivationTypeEnum.SCAR,
    },
    
    STANDOFF_WITH_PEGASUS : {
        name : 'Standoff with Pegasus',
        text : "Galactica/Kat - I've got inbound Pegasus vipers coming right at me. " +
        "Request instructions. -Louanne \"Kat\" Katraine",
        graphic : 'BSP_Crisis_Standoff_Pegasus.png',
        skillCheck : {
            value : 22,
            types : [SkillTypeEnum.POLITICS,SkillTypeEnum.LEADERSHIP,SkillTypeEnum.TACTICS,SkillTypeEnum.PILOTING,],
            text : '(PO/L/T/PI)(22) PASS: The current player may move 1 character from the Brig to any other location' +
            ', FAIL: -1 population, -1 morale and damage 1 viper in a space area (if able).',
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
    
    SUSPICIOUS_ELECTION_RESULTS : {
        name : 'Suspicious Election Results',
        text : "We're dealing with a specific: Do we steal the results of a democratic election... or not? -William Adama",
        graphic : 'BSP_Crisis_Suspicious_Election.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Give the president title to the character (aside from the current president) highest in ' +
            'the line of succession. (-OR-) The Admiral discards 1 random Skill Card and draws 1 Treachery Card.',
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
    
    THE_BLACK_MARKET : {
        name : 'The Black market',
        text : "It's hard to find the moral high ground when we're all standing in the mud. -Phelan",
        graphic : 'BSP_Crisis_The_Black_Market.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(13) PASS: +1 food, FAIL: -2 food and -1 morale (-OR-)' +
            ' -1 food and each player discards 1 Skill Card and draws 1 Treachery Card.',
            choice1 : game => game.doSkillCheck(PegasusCrisisMap.THE_BLACK_MARKET.skillCheck),
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS,SkillTypeEnum.LEADERSHIP,SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(13) PASS: +1 food, FAIL: -2 food and -1 morale.',
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
    //THE GUARDIANS - special cylon attack card.
    THE_GUARDIANS : {
        name : 'The Guardians',
        text : '1) Activate: basestars.<br>2) Setup: 1 basestar, 1 heavy raider, 4 raiders, 2 vipers and 1 civilian ships' +
        '.<br>3) Special Rule - <i>Raptor Crew Captured:</i> Keep this card in play until the fleet jumps. ' +
        'When a basestar is destroyed, lose one morale and destroy 1 raptor.',
        graphic : 'BSP_Crisis_The_Guardians.png',
        instructions : game => {
            //TODO
        },
        jump : false,
        cylons : CylonActivationTypeEnum.THE_GUARDIANS,
    },
    
    TRAINING_SNAFU : {
        name : 'Training Snafu',
        text : "I've got two bent birds, need priority clearance to land. -Kara Thrace",
        graphic : 'BSP_Crisis_Training_Snafu.png',
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.PILOTING],
            text : '(L/PI)(8) PASS: No effect, FAIL: Damage 3 vipers in space areas or in the "Reserves".',
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
    
    UNSETTLING_STORIES : {
        name : 'Unsettling Stories',
        text : "Asked him for his gun, shot him in the head with it. Right in frount of the whole crew. -Fisk",
        graphic : 'BSP_Crisis_Unsettling_Stories.png',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(9) PASS: No effect, FAIL: -1 morale and each player discards 1 Skill Card ' +
            'and draws 1 Treachery Card(-OR-) -1 morale.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: No effect, FAIL: -1 morale and each player discards ' +
            '1 Skill Card and draws 1 Treachery Card.',
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
    
});

const PegasusSuperCrisisMap = Object.freeze({

    //card backs graphic : 'BSP_supercrisis_bk.gif'
    
    DEMAND_PEACE_MANIFESTO : {
        name : '"Demand Peace" Manifesto',
        text : "I'm through talking. You cant play \"innocent cystander,\" but I think you know more than" +
        " you're telling us. Either way, you're a danger to the fleet. -William Adama",
        graphic : 'BSP_S_Crisis_Demand_Peace.png',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 morale and damage Galactica twice (-OR-) ' +
            'The President and the Admiral each discard their hand of Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
    },
    
    FOOTAGE_TRANSMITTED : {
        name : 'Footage Transmitted',
        text : "Hey, I'm skill alive - she's still alive! Told you. -Number Eight<br/>" +
        "Incredible. And the child? -Number Six<br/>It was saved. -Number Three",
        graphic : 'BSP_S_Crisis_Footage.png',
        skillCheck : {
            value : 17,
            text : '(PO/L/T)(17)(12) PASS: Each player draws 1 Treachery Card, MIDDLE: each revealed Cylon player' +
            ' draws 2 Treachery Cards, FAIL: each revealed Cylon player draws 2 Treachery Cards and 1 Super Crisis Card.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 12,
                action : game => {
                    //TODO
                }
            },
            fail : game => {
                //TODO
            },
        },
    },
    //LURED INTO A TRAP - special cylon attack card
    LURED_INTO_A_TRAP : {
        name : 'Lured into a Trap',
        text : '1) Activate: raiders.<br>2) Setup: 2 basestars, 1 heavy raider, 6 raiders, 2 vipers, and 2 civilian ' +
        'ships.<br>3) Special Rule - <i>Dangerous Repairs are Necessary:</i> Keep this card in play until the fleet ' +
        'jumps. Any character in either the "engine Room" or "FTL Control" locations when the fleet jumps is executed."',
        graphic : 'BSP_S_Crisis_Lured_Trap.png',
        instructions : game => {
            //TODO
        },
    },
    
    PSYCHOLOGICAL_WARFARE : {
        name : 'Psychological Warfare',
        text : "Hi, honey, I'm home. You kill me, I download, I come back, " +
        "we start over ... five times now. -Leoben Conoy",
        graphic : 'BSP_S_Crisis_Psy_Warfare.png',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale, each player discards 2 Skill Cards and draws 2 Treachery Cards ' +
            '(-OR-) each revealed Cylon player draws 2 Treachery Cards. ' +
            'Then, discard the entire Destiny deck and build a new one consisting of only 6 Treachery Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
    },
    
    THE_FARM : {
        name : 'The Farm',
        text : "The human race is on the verge of extinction and frankly," +
        " potential mothers are a lot more valuable than a whole squadron... -Simon",
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(15)(8) PASS: no effect, MIDDLE: -1 food, FAIL: -1 food, -1 population. ' +
            'keep this card in play. human players may not use their once per game abilities.',
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
    },

});

const PegasusDestinationMap = Object.freeze({
    
    BINARY_STAR: {
        name : 'Binary Star',
        text : 'Lose one fuel. Place 1 civilian ship in frount of Galactica and 1 civilian ship behind Galactica.',
        graphic : 'BSP_Dest_Binary_Star.png',
        value : 2,
        action : (game, fun) => {
            //TODO
            fun();
        },
    },
    
    A_CIVILIAN_CONVOY: {
        name : 'A Civilian Convoy',
        text : 'Lose 3 fuel and gain 1 population. The Admiral may choose to lose 1 morale to gain 1 fuel.',
        graphic : 'BSP_Dest_Civ_Convoy.png',
        value : 3,
        action : (game, fun) => {
            //TODO
            fun();
        },
    },
    
    GAS_CLOUD : {
        name : 'Gas Cloud',
        text : 'The Admiral may look at the top 3 cards on the Crisis deck,' +
        ' them on the top or bottom of the deck in any order.',
        graphic : 'BSP_Dest_Gas_Cloud.png',
        value : 1,
        action : (game, fun) => {
            //TODO
            fun();
        },
    },
    
    MINING_ASTEROID : {
        name : 'Mining Astroid',
        text : 'Lose 1 fuel and repair 2 vipers. Search the Crisis deck or discard pile for the "Scar" card and ' +
        'immediately resolve it. Then shuffle the Crisis deck',
        graphic : 'BSP_Dest_Mining_Asteroid.png',
        value : 2,
        action : (game, fun) => {
            //TODO
            fun();
        },
    },
    
    MISJUMP : {
        name : 'Misjump',
        text : 'Draw 1 civilian ship and destroy it. Then discard this card and draw a new Destination Card to resolve.',
        graphic : 'BSP_Dest_Misjump.png',
        value : 0,
        action : (game, fun) => {
            //TODO
            fun();
        },
    },

});

const PegasusLoyaltyMap = Object.freeze({
    
    YOU_ARE_A_CYLON_SIX : {
        name:"You are a cylon",
        text : "CAN MAKE PLAYERS DRAW TREACHERY CARDS Action: Reveal this card. If you are not in the Brig," +
        " each human player discards 1 random Skill Card and draws 1 Treachery Card." +
        " Then you draw 2 Treachery Cards (after you discard down to 3 Skill Cards).",
        graphic: "BSP_Loyalty_Cylon.png",
        action : game => {
            //TODO
        },
        role : 'cylon',
    },
    
    YOU_ARE_A_SYMPATHETIC_CYLON : {
        name:"You are a Sympathetic Cylon",
        text : "IMMEDIATELY REVEAL THIS CARD You become a revealed Cylon player but do not receive a " +
        "Super Crisis Card. Draw 1 card from the Sympathatetic Agenda deck (you win only by fulfilling this " +
        "cards criteria). You may also Infiltrate as if you were a Cylon Leader.",
        graphic: "BSP_Loyalty_Sympathetic.png",
        action : game => {
            //TODO
        },
        role : 'cylon',
    },
    
});

const AgendaMap = Object.freeze({

    //HOSTILE card back graphic : 'BSP_agenda_bk.gif'
    //SYMPATHETIC card back graphic : 'BSP_sagenda_bk.gif'
    
    //HOSTILE
    
    SHOW_THEIR_TRUE_NATURE : {
        name : 'Show Their True Nature',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-Either you are in the Brig or Detention or you have been executed at least once',
        graphic : 'BSP_agenda_01.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    SIEGE_WARFARE : {
        name : 'Siege Warfare',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-Every resource is at half or lower.',
        graphic : 'BSP_agenda_02.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    REDUCE_THEM_TO_RUINS : {
        name : 'Reduce Them to Ruins',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-4 or more Galactica and/or Pegasus locations are damaged.<br/>and<br/>Morale is at 3 or lower.',
        graphic : 'BSP_agenda_03.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    GENOCIDE : {
        name : 'Genocide',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-Both food and population are at 2 or lower.',
        graphic : 'BSP_agenda_04.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    MUTUAL_ANNIHILATION : {
        name : 'Mutual Annihilation',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-You have played a Super Crisis Card.',
        graphic : 'BSP_agenda_05.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    GRANT_MERCY : {
        name : 'Grant Mercy',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-Population, morale, or food is at 2 or lower.',
        graphic : 'BSP_agenda_06.gif',
        type : 'HOSTILE',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    //SYMPATHETIC
    
    GUIDE_THEM_TO_DESTINY : {
        name : 'Guide Them to Destiny',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-Population and morale are within 2 of each other.',
        graphic : 'BSP_sagenda_01.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    CONVERT_THE_INFIDELS : {
        name : 'Convert the Infidels',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-All resources are at 3 or lower.',
        graphic : 'BSP_sagenda_02.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    JOIN_THE_COLONIALS : {
        name : 'Join the Colonials',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-You are Infiltrating and not in the Brig or Detention.',
        graphic : 'BSP_sagenda_03.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    THE_ILLUSION_OF_HOPE : {
        name : 'The Illusion of Hope',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-6 or more units of distance have been travelled.',
        graphic : 'BSP_sagenda_04.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    PROVE_THEIR_WORTH : {
        name : 'Prove their Worth',
        text : 'You win the game if:<br/>-The humans have won.<br/>and<br/>' +
        '-At least 5 raptors/vipers are damaged or destroyed.',
        graphic : 'BSP_sagenda_05.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },
    
    SALVAGE_THEIR_EQUIPMENT : {
        name : 'Salvage their Equipment',
        text : 'You win the game if:<br/>-The Cylons have won.<br/>and<br/>' +
        '-2 or fewer Galactica locations are damaged.',
        graphic : 'BSP_sagenda_06.gif',
        type : 'SYMPATHETIC',
        won : (game, player) => {
            //TODO returns boolean
        },
    },

});

const PegasusCharacterMap = Object.freeze({
    
    //HUMAN
    
    HELENA_CAIN : {
        name : 'Helena Cain',
        characterGraphic : 'CharCardP_Cain.png',
        pieceGraphic : 'PlayerPiece_Helena_Cain.png',
        type : CharacterTypeEnum.MILITARY_LEADER,
        skills:{
            Leadership : 2,
            Tactics : 2,
            TacticsLeadership : 1,
        },
        startLocation:LocationEnum.COMMAND,//or pegasus CIC
        /*
        Intolerant:
            When an "Admiral's Quarters" Skill check is passed with 10 or more, you may
            choose to execute that character instead of sending him to the brig.
        
        Blind Jump - action:
            Once per game, if at 6* or less distance, draw 2 civilian ships and destroy them to
            immediately jump the fleet (even if the fleet marker is on a red space). The Admiral
            only draws 1 Destination Card
        
        Bent on Revenge:
            You may not activate the "FTL Control" or "Engine Room" locations.
        */
    },
    
    ANASTASIA_DEE_DUALLA : {
        name : 'Anastasia "Dee" Dualla',
        characterGraphic : 'Chars_Anastasia_Dualla.png',
        pieceGraphic : 'PlayerPiece_Anastasia_Dualla.png',
        type : CharacterTypeEnum.SUPPORT,
        skills:{
            Leadership : 1,
            Tactics : 3,
            Engineering : 1,
        },
        startLocation:LocationEnum.COMMUNICATIONS,
        /*
        Efficient:
            When you activate the "Communications" location, you may look at every civilian
            ship on the game board and may move any number of them.
        
        Fast Learner - before skill checks:
            Once per game, before making a Skill check, look at the top 3 cards of any Skill
            deck (even outside your Skill set), and add all of them to ether the skill check or your hand.
        
        Emotionaly Fragile:
            When morale is reduced to 2 or less, you are executed. if you are human, do not lose 1 moral.
        */
    },
    
    ELLEN_TIGH : {
        name : 'Ellen Tigh',
        characterGraphic : 'Chars_Ellen_Tigh.png',
        pieceGraphic : 'PlayerPiece_Ellen_Tigh.png',
        type : CharacterTypeEnum.POLITICAL_LEADER,
        skills:{
            Politics : 2,
            Leadership : 2,
            Treachery : 1,
        },
        startLocation:LocationEnum.ADMIRALS_QUARTERS,
        /*
        Politically Adroit:
            When you end your Movement step in the same location as another human
            player, you may give that player 1 Skill Card from your hand to draw 2 Skill Cards.
        
        Manipulative - ??:
            Once per game, you may take the admiral or Presedent title at the start of your
            turn. Return that title to its previous owner at the end of your turn.
        
        Nothing But Trouble:
            Your Skill set includes Treachery. (Human players can't use abilities of Treachery Cards.)
        */
    },
    
    LOUANNA_KAT_KATRAINE : {
        name : 'Louanna "Kat" Katraine',
        characterGraphic : 'Chars_Louanna Katraine.png',
        pieceGraphic : 'PlayerPiece_Louanna_Katraine.png',
        pilotGraphic : '',//cant find it, todo make one
        type : CharacterTypeEnum.PILOT,
        skills:{
            Leadership : 1,
            Tactics : 2,
            Piloting : 2,
        },
        startLocation:LocationEnum.HANGAR_DECK,
        /*
        Hotshot:
            When you would roll a die during your action step, you may instead
            discard a Skill Card. use the card's strenght +2 instead of the die roll.
        
        Sacrifice - action:
            Once per game while piloting a viper, send yourself to Sickbay to destroy
            5 raiders, 2 heavy raiders, 1 basestart or 1 civilian ship in your space area.
        
        Stim Junkie:
            At the end of your Action step, if you are in the same location or space area
            that you were in at the start of your turn, you are moved to Sickbay.
        */
    },
    
    //CYLON
    
    CAVIL : {
        name : 'Cavil',
        characterGraphic : 'Chars_Cavil.png',
        pieceGraphic : 'PlayerPiece_Cavil.png',
        type : CharacterTypeEnum.CYLON_LEADER,
        skills:{
            Tactics : 1,
            TreacheryEngineering : 1,
        },
        startLocation:LocationEnum.CYLON_FLEET,
        /*
        Primacy - action:
            Place 1 basestar in front of Galactica, or if all basestars are in play
            you may remove one from the game board. You may then place 3 raiders in
            front of Galactica and 1 civilian ship behind Galactica.
        
        Aggressive Tactics - movement:
            Once per game, you may take two actions.
        
        Lies and Secrets:
            When a player reveals a "You are a Cylon" Loyalty Card, you must discard
            all Skill Cards in your hand.
        */
    },
    
    LEOBEN_CONOY : {
        name : 'Leoben Conoy',
        characterGraphic : 'Chars_Leoben_Conoy.png',
        pieceGraphic : 'PlayerPiece_Leoben_Conoy.png',
        type : CharacterTypeEnum.CYLON_LEADER,
        skills:{
            Politics : 1,
            TreacheryEngineering : 1,
        },
        startLocation:LocationEnum.HUMAN_FLEET,
        /*
        Glimpse the Face of God - movement:
            Draw 2 cards from the top of the Destiny deck, then place 2 cards
            from your hand on the top of the Destany deck.
        
        Criptic Message - action:
            Once per game, Exchange your hand of Skill Cards with another player's hand of Skill Cards.
        
        Clouded:
            You may not voluntarily move to a location that contains another character.
        */
    },
    
    CAPRICA_SIX : {
        name : 'Caprica Six',
        characterGraphic : 'Chars_Six.png',
        pieceGraphic : 'PlayerPiece_Six.png',
        type : CharacterTypeEnum.CYLON_LEADER,
        skills:{
            Leadership : 1,
            TreacheryEngineering : 1,
        },
        startLocation:LocationEnum.CAPRICA,
        /*
        Intimate - movement:
            Draw 1 Skill Card at random from a player's hand. Then, that player draws 1 card
            from the Skill deck of your choice (it may be from outside his skill set).
        
        Human Delusion - after skill check:
            Once per game, after all Skill Cards have been played into a Skill Check
            have been revealed, you may play any number of Skill Cards from your hand into the deck.
        
        Conflicted Loyalties:
            You must discard 1 Skill Card to activate the "Cylon Fleet" location.
        */
    },
    
});

const PegasusSkillCardMap = Object.freeze({
    
    //TODO find totals
    
    /*
        CALCULATIONS:
            Play after a die is rolled to add or subtract 1 from the result.
            Only one CALCULATIONS can be played per die roll.
    */
    
    CALCULATIONS_3:{
        name:'Calculations',
        graphic:'BSG_Skill_Eng_Calculations_3.png',
        type:SkillTypeEnum.ENGINEERING,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.AFTER_DIE_ROLL,
    },
    
    CALCULATIONS_4:{
        name:'Calculations',
        graphic:'BSG_Skill_Eng_Calculations_4.png',
        type:SkillTypeEnum.ENGINEERING,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.AFTER_DIE_ROLL,
    },
    
    CALCULATIONS_5:{
        name:'Calculations',
        graphic:'BSG_Skill_Eng_Calculations_5.png',
        type:SkillTypeEnum.ENGINEERING,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.AFTER_DIE_ROLL,
    },
    
    /*
        JURY RIGGED - RECKLESS:
            Play before cards are added to a Skill check to reduce its difficulty by 4.
    */
    
    JURY_RIGGED_1:{
        name:'Jury Rigged',
        graphic:'BSG_Skill_Eng_Jury_Rigged_1.png',
        type:SkillTypeEnum.ENGINEERING,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    JURY_RIGGED_2:{
        name:'Jury Rigged',
        graphic:'BSG_Skill_Eng_Jury_Rigged_2.png',
        type:SkillTypeEnum.ENGINEERING,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        AT ANY COST - RECKLESS:
            Play before a Skill check.
            All Treachery Cards in the Skill check count as positive strength.
    */
    
    AT_ANY_COST_3:{
        name:'At any Cost',
        graphic:'BSG_Skill_Led_Cost_3.png',
        type:SkillTypeEnum.LEADERSHIP,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    AT_ANY_COST_4:{
        name:'At any Cost',
        graphic:'BSG_Skill_Led_Cost_4.png',
        type:SkillTypeEnum.LEADERSHIP,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    AT_ANY_COST_5:{
        name:'At any Cost',
        graphic:'BSG_Skill_Led_Cost_5.png',
        type:SkillTypeEnum.LEADERSHIP,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        MAJOR VICTORY:
            Play after you destroy a basestar or a centurion on the boarding party track.
            Roll a die. If 5 or higher, gain 1 morale. Limit of 1 "Major Victory" card used per turn.
    */
    
    MAJOR_VICTORY_1:{
        name:'Major Victory',
        graphic:'BSG_Skill_Led_Maj_Vic_1.png',
        type:SkillTypeEnum.LEADERSHIP,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.AFTER_DESTROY,
    },
    
    MAJOR_VICTORY_2:{
        name:'Major Victory',
        graphic:'BSG_Skill_Led_Maj_Vic_2.png',
        type:SkillTypeEnum.LEADERSHIP,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.AFTER_DESTROY,
    },
    
    /*
        FULL THROTTLE - Movement or action:
            If piloting a viper, you may move to any space area.
            You may then attack 1 Cylon ship in your area (even if you didn't move).
    */
    
    FULL_THROTTLE_1:{
        name:'Full Throttle',
        graphic:'BSG_Skill_Pil_Full_Throttle_1.png',
        type:SkillTypeEnum.PILOTING,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION_OR_MOVEMENT,
    },
    
    FULL_THROTTLE_2:{
        name:'Full Throttle',
        graphic:'BSG_Skill_Pil_Full_Throttle_2.png',
        type:SkillTypeEnum.PILOTING,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION_OR_MOVEMENT,
    },
    
    /*
        RUN INTERFERENCE:
            If piloting a viper, you may move to any space area.
            You may then attack 1 Cylon ship in your area (even if you didn't move).
    */
    
    RUN_INTERFERENCE_3:{
        name:'Run Interference',
        graphic:'BSG_Skill_Pil_Run_Interference_3.png',
        type:SkillTypeEnum.PILOTING,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION_OR_MOVEMENT,
    },
    
    RUN_INTERFERENCE_4:{
        name:'Run Interference',
        graphic:'BSG_Skill_Pil_Run_Interference_4.png',
        type:SkillTypeEnum.PILOTING,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION_OR_MOVEMENT,
    },
    
    RUN_INTERFERENCE_5:{
        name:'Run Interference',
        graphic:'BSG_Skill_Pil_Run_Interference_5.png',
        type:SkillTypeEnum.PILOTING,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION_OR_MOVEMENT,
    },
    
    /*
        INVESTIGATIVE COMMITTEE:
            Play before cards are added to a Skill Check. All Skill Cards are played
            faceup during this Skill Check (excluding those from the Destiny deck).
    */
    
    INVESTIGATIVE_COMMITTEE_3:{
        name:'Investigative Committee',
        graphic:'BSG_Skill_Pol_Inv Committee_3.png',
        type:SkillTypeEnum.POLITICS,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    INVESTIGATIVE_COMMITTEE_4:{
        name:'Investigative Committee',
        graphic:'BSG_Skill_Pol_Inv Committee_4.png',
        type:SkillTypeEnum.POLITICS,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
        
    },
    
    INVESTIGATIVE_COMMITTEE_5:{
        name:'Investigative Committee',
        graphic:'BSG_Skill_Pol_Inv Committee_5.png',
        type:SkillTypeEnum.POLITICS,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        PREVENTATIVE POLICY - Movement:
            Choose 1 resource type (fuel, food,morale, or population).
            The next loss of this resource type during this turn is reduced by 1.
    */
    
    PREVENTATIVE_POLICY_3:{
        name:'Preventative Policy',
        graphic:'BSG_Skill_Pol_Prev Policy_3.png',
        type:SkillTypeEnum.POLITICS,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    PREVENTATIVE_POLICY_4:{
        name:'Preventative Policy',
        graphic:'BSG_Skill_Pol_Prev Policy_4.png',
        type:SkillTypeEnum.POLITICS,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    PREVENTATIVE_POLICY_5:{
        name:'Preventative Policy',
        graphic:'BSG_Skill_Pol_Prev Policy_5.png',
        type:SkillTypeEnum.POLITICS,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    /*
        SUPPORT THE PEOPLE - Reckless:
            Choose 1 resource type (fuel, food, morale, or population).
            The next loss of this resource type during this turn is reduced by 1.
    */
    
    SUPPORT_THE_PEOPLE_1:{
        name:'Support the People',
        graphic:'BSG_Skill_Pol_Support_1.png',
        type:SkillTypeEnum.POLITICS,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    SUPPORT_THE_PEOPLE_2:{
        name:'Support the People',
        graphic:'BSG_Skill_Pol_Support_2.png',
        type:SkillTypeEnum.POLITICS,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        CRITICAL_SITUATION - Movement:
            Take 1 action. Only 1 "Critical Situation" or "Executive Order" card may be used per turn.
    */
    
    CRITICAL_SITUATION_3:{
        name:'Critical Situation',
        graphic:'BSG_Skill_Tac_Crit_Sit_3.png',
        type:SkillTypeEnum.TACTICS,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    CRITICAL_SITUATION_4:{
        name:'Critical Situation',
        graphic:'BSG_Skill_Tac_Crit_Sit_4.png',
        type:SkillTypeEnum.TACTICS,
        value:4,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    CRITICAL_SITUATION_5:{
        name:'Critical Situation',
        graphic:'BSG_Skill_Tac_Crit_Sit_5.png',
        type:SkillTypeEnum.TACTICS,
        value:5,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    /*
        GUTS AND INITIATIVE - Reckless:
            Play before cards are added to a Skill check.
            Do not add cards from the Destiny deck into this Skill check.
    */
    
    GUTS_AND_INITIATIVE_1:{
        name:'Guts and Initiative',
        graphic:'BSG_Skill_Tac_Guts_1.png',
        type:SkillTypeEnum.TACTICS,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    GUTS_AND_INITIATIVE_2:{
        name:'Guts and Initiative',
        graphic:'BSG_Skill_Tac_Guts_2.png',
        type:SkillTypeEnum.TACTICS,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.BEFORE_SKILL_CHECK,
    },
    
    /*
        BROADCAST LOCATION - Reckless Skill Check:
            Place 1 basestar in front of Galactica and 1 civilian ship behind Galactica.
            Only 1 of this ability may be resolved in each Skill check.
    */
    
    BROADCAST_LOCATION_1:{
        name:'Broadcast Location',
        graphic:'BSG_Skill_Tre_Broadcast_1.png',
        type:SkillTypeEnum.TREACHERY,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.NONE,
    },
    
    /*
        BY YOUR COMMAND - Reckless Skill Check:
            Activate all raiders, heavy raiders and occupation forces.
            (But not centurions) Only 1 of this ability may be resolved in each Skill check.
    */
    
    BY_YOUR_COMMAND_1:{
        name:'By your Command',
        graphic:'BSG_Skill_Tre_By_Your_Command_1.png',
        type:SkillTypeEnum.TREACHERY,
        value:1,
        total:0,
        playTime : SkillPlayTimeEnum.NONE,
    },
    
    /*
        GOD'S PLAN - Movement:
            Exchange this card with the top card of the Destiny deck.
    */
    
    GODS_PLAN_2:{
        name:'God\'s Plan',
        graphic:'BSG_Skill_Tre_Gods_Plan_2.png',
        type:SkillTypeEnum.TREACHERY,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.MOVEMENT,
    },
    
    /*
        HUMAN WEAKNESS - action:
            IF at least 1 human player is in the Brig or Detention, reduce the highest resource by 1.
    */
    
    HUMAN_WEAKNESS_3:{
        name:'Human Weakness',
        graphic:'BSG_Skill_Tre_Human_Weak_3.png',
        type:SkillTypeEnum.TREACHERY,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.ACTION,
    },
    
    /*
        SABOTAGE:
            Play when a human player discards a Treachery Skill Card. Damage Galactica.
            Only 1 "Sabotage" card may be used per turn.
    */
    
    SABOTAGE_3:{
        name:'Sabotage',
        graphic:'BSG_Skill_Tre_Sabotage_3.png',
        type:SkillTypeEnum.TREACHERY,
        value:3,
        total:0,
        playTime : SkillPlayTimeEnum.HUMAN_DISCARDS_TREACHERY,
    },
    
    /*
        SPECIAL DESTINY - Reckless Skill Check :
            Each player draws 1 Treachery Skill Card.
            Only 1 of this ability may be resolved in each Skill check.
    */
    
    SPECIAL_DESTINY_2:{
        name:'Special Destiny',
        graphic:'BSG_Skill_Tre_Special_Destiny_2.png',
        type:SkillTypeEnum.TREACHERY,
        value:2,
        total:0,
        playTime : SkillPlayTimeEnum.NONE,
    },
    
});

const CapricaCrisisMap = Object.freeze({
    //card back graphic : 'BSP_newcaprica_bk.gif'
    
    HIDING_UNDERGROUND : {
        name : 'Hiding Underground',
        text : "There's a system of tunnels we've been using. -Saumuel Anders",
        graphic : 'BSP_newcaprica_01.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(L/T)(9) PASS: No effect, FAIL: -1 food (-OR-)' +
            ' The current player chooses a human player on New Caprica to send to Detention.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(9) PASS: No effect, FAIL: -1 food.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    PREPARE_FOR_A_FIGHT : {
        name : 'Pretare for a Fight',
        text : "We've stored arms and munitions at key areas throughout the city. -Galen Tyrol",
        graphic : 'BSP_newcaprica_02.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(L/T/E)(8) PASS: Destroy 1 occupation force, FAIL: -1 morale and if the current player ' +
            'is on New Caprica, he is sent to Detention. (-OR-)' +
            ' The current player chooses a human player on New Caprica to send to the Medical Center.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(L/T/E)(8) PASS: Destroy 1 occupation force, ' +
            'FAIL: -1 morale and if the current player is on New Caprica, he is sent to Detention.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    RESCUE_DETAINEES : {
        name : 'Rescue Detainees',
        text : "Take four men and get there ahead of the trucks. Chief! Pull it together. -Saul Tigh",
        graphic : 'BSP_newcaprica_03.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(L/T)(9) PASS: The current player may move a character from Detention to any other ' +
            'New Caprica location, FAIL: -1 morale (-OR-) Roll a die. If 4 or lower, the current player' +
            ' chooses a human player on New Caprica to send to Detention',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(9) PASS: The current player may move a character from' +
            ' Detention to any other New Caprica location, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    NCP_RECRUITMENT : {
        name : 'NCP Recruitment',
        text : "When this is over, guys like him are gonna be strung up. -Galen Tyrol",
        graphic : 'BSP_newcaprica_04.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L)(8) PASS: No effect, FAIL: -1 morale (-OR-) ' +
            'Each player discards 2 Skill Cards and draws 2 Treachery Cards',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(8) PASS: No effect, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    CONTACT_INFORMANT : {
        name : 'Contact Informant',
        text : "Hey, Jake. -Galen Tyrol",
        graphic : 'BSP_newcaprica_05.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(9) PASS: No effect, FAIL: -1 morale and -1 population (-OR-) -1 population.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(9) PASS: No effect, FAIL: -1 morale and -1 population.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    ARREST_AT_NIGHT : {
        name : 'Arrest at Night',
        text : "They're all insurgents, Jammer. We have to break the cycle of violence. -Cavil",
        graphic : 'BSP_newcaprica_06.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(L/T)(10) PASS: No effect, FAIL: -1 morale and if the current palyer is on New Caprica he is ' +
            'sent to Detention (-OR-) Each player discards 2 Skill Cards and draws 2 Treachery cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(L/T)(10) PASS: No effect, FAIL: -1 morale and if the current' +
            ' palyer is on New Caprica he is sent to Detention.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    BRUTAL_TREATMENT : {
        name : 'Brutal Treatment',
        text : "Let me out! Let me out of here! I don't belong here! Let me out! -Kara Thrace",
        graphic : 'BSP_newcaprica_07.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(9) PASS: No effect, FAIL: -1 morale and if the current player is on New Caprica, he is sent ' +
            'to the "Medical Center" (-OR-) The current player chooses a human player on New Caprica to send to Detention.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(9) PASS: No effect, FAIL: -1 morale ' +
            'and if the current player is on New Caprica, he is sent to the "Medical Center".',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    HELD_FOR_QUESTIONING : {
        name : 'Held for Questioning',
        text : "Everyone of importance is being looked at right now. You're no exception. -Gaius Baltar",
        graphic : 'BSP_newcaprica_08.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/L/T)(10) PASS: No effect, FAIL: -1 morale and if the current player is on New Caprica, ' +
            'he is sent to Detention (-OR-) The current player must discard 3 random Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS],
            text : '(PO/L/T)(10) PASS: No effect, ' +
            'FAIL: -1 morale and if the current player is on New Caprica, he is sent to Detention.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    PLAYING_WITH_EMOTIONS : {
        name : 'Playing with Emotions',
        text : "Half human. I mean, you know that she's yours. You just won't admit it. -Leoben Conoy",
        graphic : 'BSP_newcaprica_09.gif',
        choose : {
            who : WhoEnum.CURRENT,
            text : '(PO/T)(7) PASS: No Effect, FAIL: -1 morale (-OR-) ' +
            'The current player must discard 2 random Skill Cards and draw 2 Treachery Cards.',
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
            text : '(PO/T)(7) PASS: No Effect, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    MEET_LIASON_OFFICER : {
        name : 'Meet Liason Officer',
        text : "If they jump in here, they won't get picked up on Cylon DRADIS... -Sammuel T. Anders",
        graphic : 'BSP_newcaprica_10.gif',
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(10) PASS: No effect, FAIL: -1 fuel and destroy 1 raptor.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    A_CYLON_ALLY : {
        name : 'A Cylon Ally',
        text : "How do you know you can trust me? -Sharon<br/>I don't. That's what trust is. -William Adama",
        graphic : 'BSP_newcaprica_11.gif',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Prepare or evacuate 1 civilian ship and roll a die. If the result is 5 or less, the current ' +
            'player is sent to Detention. If the current player is not on New Caprica, you may not choose this option' +
            ' (-OR-) The Admiral discards 2 SkillCards and the current player discards 3 Skill Cards.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    MARINE_REINFORCEMENTS : {
        name : 'Marine Reinforcements',
        text : "WHere there are skin jobs, there are bullet heads. Bring up the R.P.G. -Erin Mathias",
        graphic : 'BSP_newcaprica_12.gif',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : 'Destroy 1 occupation force. The Admiral discards 2 Skill Cards and the current player discards' +
            ' 3 Skill Cards (-OR-) The Admiral chooses a human player on New Caprica to send to Detention.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    ORGANIZE_THE_PILOTS : {
        name : 'Organize the Pilots',
        text : "We should get a breadown of available pilots in the insurgent group. " +
        "Somebody's gotta fly those ships off the ground. -Louanne Katraine",
        graphic : 'BSP_newcaprica_13.gif',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.PILOTING],
            text : '(PO/PI)(9) PASS: Prepare or evacuate 1 civilian ship, FAIL: Destroy the top ship of the Locked' +
            ' Civilian Ships stack. If that stack is empty, destroy the top ship of the Prepared Civilian Ships stack.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    RECOVER_LAUNCH_KEYS : {
        name : 'Recover Launch Keys',
        text : "The best option is that Saul and his people on the ground get " +
        "their hands on the original launch keys. -William Adama",
        graphic : 'BSP_newcaprica_14.gif',
        skillCheck : {
            value : 10,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(L/T/E)() PASS: Prepare or evacuate 1 civilian ship, ' +
            'FAIL: -1 population. If the current player is on New Caprica, he is sent to Detention.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    NCP_GRADUATION : {
        name : 'NCP Graduation',
        text : "You are the dream of a new tommorow for humans and Cylons alike, " +
        "and I salute you for the risks that you have taken for just showing up today. -D'Anna Biers",
        graphic : 'BSP_newcaprica_15.gif',
        choose : {
            who : WhoEnum.ADMIRAL,
            text : '-1 morale (-OR-) -1 population.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    CONTACT_RAPTOR : {
        name : 'Contact Raptor',
        text : "You guys are dreaming. there's no raptor there, okay? -Samuel T. Anders",
        graphic : 'BSP_newcaprica_16.gif',
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.ENGINEERING],
            text : '(PO/E)(7) PASS: No effect, FAIL: -1 morale and the current player discards 2 Skill Cards.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    PREPARE_THE_CIVILANS : {
        name : 'Prepare the Civilians',
        text : "We've had three full-dress rehearsals under the guise of fire and natural disaster drills. -Laura Roslin",
        graphic : 'BSP_newcaprica_17.gif',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: No effect, FAIL: -1 food and place 1 occupation force at "Occupation Authority".',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    ATTACK_ON_THE_POWER_PLANT : {
        name : 'Attack on the Power Plant',
        text : "The power substation was crippled. Almost half the city is without " +
        "power and out best estimates put the repair at two weeks. -Aaron Doral",
        graphic : 'BSP_newcaprica_18.gif',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : '-1 morale and each human player draws 2 Skill Cards (-OR-) -1 population and +1 moral',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    ESTABLISH_SANITATION : {
        name : 'Establish Sanitation',
        text : "I had the most fascinating chat with one of the Dorals ... he's " +
        "got this theory about sanitation being the key to regaining the human trust and confidence... -Gaius Baltal",
        graphic : 'BSP_newcaprica_19.gif',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'Skip the prepare for Jump step of this turn (-OR-) -1 morale.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    INTRA_ATMOS_ENTRY : {
        name : 'Intra-Atmos Entry',
        text : "Well, this should be different. -Brendan \"Hot Dog\" Costanza",
        graphic : 'BSP_newcaprica_20.gif',
        skillCheck : {
            value : 15,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING, SkillTypeEnum.ENGINEERING,],
            text : '(L/T/PI/E)(15)(9) PASS: Prepare or evacuate 1 civilian ship. The increase the Jump Preparation ' +
            'track by 1, MIDDLE: No effect, FAIL: -1 fuel. Then damage Galactica if it is in orbit of New Caprica.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 9,
                action : game => {
                    //TODO
                },
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    RESISTANCE_BOMBINGS : {
        name : 'Resistance Bombing',
        text : "We're on the side of the demons, Chief. -Saul Tigh",
        graphic : 'BSP_newcaprica_21.gif',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.LEADERSHIP, SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(L/T/E)(12)(7) PASS: The Admiral my choose to lose 1 morale to execute a revealed Cylon or ' +
            'destroy 2 occupation forces, MIDDLE: No effect, FAIL: -1 morale, -1 population.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 7,
                action : game => {
                    //TODO
                },
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    BETRAYED_FROM_WITHIN : {
        name : 'Betrayed From Within',
        text : "This is the map, Colonel! The map that I drew for you. I gave this to you in your tent " +
        "and you were gonna burn it, but then your wife offered to do it for you. -Samuel Anders",
        graphic : 'BSP_newcaprica_22.gif',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9)(6) PASS: No effect, MIDDLE: The current player discards 2 random ' +
            'Skill Cards and draws 2 Treachery Cards, FAIL: The current player is executed.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 6,
                action : game => {
                    //TODO
                },
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    DISSENT_AMONG_CYLONS : {
        name : 'Dissent Among Cylons',
        text : "Is it really worth it, Caprica? Is the love or that man really worth possibly losing all of this? -D'Anna Biers",
        graphic : 'BSP_newcaprica_23.gif',
        skillCheck : {
            value : 12,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(12)(7) PASS: Each human player may draw 2 Skill Cards, MIDDLE: no effect, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 7,
                action : game => {
                    //TODO
                },
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.LAUNCH_RAIDERS,
    },
    
    LABOR_UNION_STRIKE : {
        name : 'Labor Union Strike',
        text : "When you elected me Union president, I promised that I would keep us working... -Galen Tyrol",
        graphic : 'BSP_newcaprica_24.gif',
        skillCheck : {
            value : 13,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.TACTICS],
            text : '(PO/T)(13)(10) PASS: +1 morale, MIDDLE: no effect, ' +
            'FAIL: -1 food and if the current player is on New Caprica, he is sent to Detention.',
            pass : game => {
                //TODO
            },
            middle : {
                value : 10,
                action : game => {
                    //TODO
                },
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    DECODE_CYLON_MAPS : {
        name : 'Decode Cyolon Maps',
        text : "Oh, frak, you're right, I can extrapolate the coordinate system... -Galen Tyrol",
        graphic : 'BSP_newcaprica_25.gif',
        skillCheck : {
            value : 8,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.ENGINEERING],
            text : '(T/E)(8) PASS: Prepare or evacuate 1 civilian ship, FAIL: -1 morale and place 1 occupation force on "Occupation Authority."',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : false,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
    CENTURION_AMBUSH : {
        name : 'Centurion Ambush',
        text : "It's a firing squad. Sight in on the Centurions, right now. -Galen Tyrol",
        graphic : 'BSP_newcaprica_26.gif',
        skillCheck : {
            value : 7,
            types : [SkillTypeEnum.TACTICS, SkillTypeEnum.PILOTING],
            text : '(T/PI)(7) PASS: , FAIL: -1 population and if the current player is on New Caprica he is sent to the "Medical Center."',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : false,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    SECOND_THOUGHTS : {
        name : 'Second Thoughts',
        text : "At first they thought they were doing something good, you know? Get the Cylons off the streets, " +
        "let us police our own. -James Lyman",
        graphic : 'BSP_newcaprica_27.gif',
        skillCheck : {
            value : 9,
            types : [SkillTypeEnum.POLITICS, SkillTypeEnum.LEADERSHIP],
            text : '(PO/L)(9) PASS: The current player may move a character from Detention to ' +
            'any other New Caprica location, FAIL: -1 morale.',
            pass : game => {
                //TODO
            },
            fail : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    DEMANDED_SURRENDER : {
        name : 'Demanded Surrender',
        text : "On behalf of the Twelve Colonies of Kobol, I surrender unconditionally. -Gaius Baltar",
        graphic : 'BSP_newcaprica_28.gif',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'The President chooses a human player on New Caprica to send to Detention (-OR-) -1 morale.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : false,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_BASESTARS,
    },
    
    KEEPING_HERA_HIDDEN : {
        name : 'Keeping Hara Hidden',
        text : "Each of them is capable. Each of them is anonymous, and each can be trusted. -Tory Foster",
        graphic : 'BSP_newcaprica_29.gif',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'Shuffle 2 Treachery Cards into the Destiny deck (-OR-)' +
            ' The President chooses a human player on New Caprica to send to Detention.',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_RAIDERS,
    },
    
    EXECUTION_LIST : {
        name : 'Execution List',
        text : "Sign your name! Sign it! -Aaron Doral",
        graphic : 'BSP_newcaprica_30.gif',
        choose : {
            who : WhoEnum.PRESIDENT,
            text : 'Roll a die. If 5 or less, the President is executed (-OR-) -1 population',
            choice1 : game => {
                //TODO
            },
            choice2 : game => {
                //TODO
            },
        },
        jump : true,
        centurion : true,
        cylons : CylonActivationTypeEnum.ACTIVATE_HEAVY_RAIDERS,
    },
    
});

const PegasusQuorumMap = Object.freeze({
    
    ASSIGN_CHIEF_OF_STAFF : {
        name : 'Assign Chief of Staff',
        graphic : 'BSP_Quorum_Assign_Staff.png',
        text : "I'm not here to be your friend or your counsel or your conscience. I'm here to help you win. -Tory Foster",
        actionText : 'Draw 2 Politics Cards and give this card to any other player.<br/>Keep this card in play. ' +
        'Before cards are added to a Skill check, this player may discard this card to make ' +
        'all Politics Cards in the Skill check count as Positive strength.',
        action : game => {
            //TODO
        }
    },
    
    CIVILIAN_SELF_DEFENSE : {
        name : 'Civilian Self Defense',
        graphic : 'BSP_Quorum_Civ_Self_Defence.png',
        text : "The Adriatic is in range and they've got ship-to-ship missiles. -Meier",
        actionText : 'Choose 1 civilian ship. Destry ether 3 raider or 1 heavy raider in the same space area as that' +
        ' ship. Then roll a die. If the result is 2 or less, the civilian ship is destoryed. Then discard this card.',
        action : game => {
            //TODO
        }
    },
    
    CONSULT_THE_ORACLE : {
        name : 'Consult the Oracle',
        graphic : 'BSP_Quorum_Consult_Oracle.png',
        text : "Don't be afraid. I know who you are, what you are ... " +
        "poor thing. You must be terrified. Do you have any candy? -Dodona Selloi",
        actionText : 'Look at the bottom card of any 1 deck. Then look at all cards in the Destiny deck and' +
        ' discard 2 of them. Then shuffle the Destiny deck and discard this card.',
        action : game => {
            //TODO
        }
    },
    
    ENACT_PRODUCTION_QUOTAS : {
        name : 'Enact Production Quotas',
        graphic : 'BSP_Quorum_Enact_Prod_Quotas.png',
        text : "I'll get to the point. Supplies are running low and our people are worried... -Laura Roslin",
        actionText : 'Gain 1 food and lose 1 morale. Then discard this card.',
        action : game => {
            //TODO
        }
    },
    
    EULOGY : {
        name : 'Eulogy',
        graphic : 'BSP_Quorum_Eulogy.png',
        text : "... and she died knowing that her ship andits crew were safe, " +
        "and that her mission had been accomplished. -Fisk",
        actionText : 'If at least 1 morale has been lost by a character being executed, ' +
        'gain 1 morale. Then discard this card.',
        action : game => {
            //TODO
        }
    },
    
    EXECUTE_PRISONER : {
        name : 'Execute Prisoner',
        graphic : 'BSP_Quorum_Execute_Prisoner.png',
        text : "Now, put that thing out the airlock. We don't keep Cylons around, Lieutenant. -Laura Roslin",
        actionText : 'Choos a character in the Brig. The character is executed. Then discard this card.',
        action : game => {
            //TODO
        }
    },
    
    PROBATION : {
        name : 'Probation',
        graphic : 'BSP_Quorum_Probation.png',
        text : "She may be part of the Cylon plan - " +
        "we give her access to our computers and she's the one who shuts us down. -Saul Tigh",
        actionText : 'Dive this card to any player. After he plays cards into a Skill check, ' +
        'you may discard this card to look at the cards he played.',
        action : game => {
            //TODO
        }
    },
    
    RESOURCES_FOR_GALACTICA : {
        name : 'Resources for Galactica',
        graphic : 'BSP_Quorum_Resources_Galactica.png',
        text : "I've got ships on half-rations, others experiencing severe mechanical problems, " +
        "and so far Galactica is the only vessel getting any of its needs met. -Laura Roslin",
        actionText : 'Repair up to 1 location and 2 damaged vipers. Then discard this card.',
        action : game => {
            //TODO
        }
    },
    
    UNSAVORY_CONNECTIONS : {
        name : 'Unsavory Connections',
        graphic : 'BSP_Quroum_Unsavory_Connections.png',
        text : "There's a freighter, Prometheus, Some people say it's gone off the grid ... " +
        "but if you want something bad enough, that's where you go. -Tom Zarek",
        actionText : 'Discard 2 random Skill Cards and draw 2 Treachery Cards. ' +
        'Then gain either 1 food or 1 fuel and discard this card.',
        action : game => {
            //TODO
        }
    },
    
});

const PegasusLocationMap = Object.freeze({
    
    //CYLON LOCATIONS: (replaces original cylon locations)
    //graphic : 'BSD_CylonOverlay1.png'
    
    CAPRICA : {
        name : "Caprica",
        area : "cylon",
        enum : LocationEnum.CAPRICA,
        text : 'Action: Play 1 of your Super Crisis Cards OR draw 2 Super Crisis Cards, choose 1 to resolve and ' +
        'place the other on the bottom<br><b>No Activate Cylon Ships or Prepare for Jump steps.</b>',
        action : game => {
            //TODO write this
        },
    },
    
    CYLON_FLEET : LocationMap.CYLON_FLEET,
    
    HUMAN_FLEET : {
        name : "Human Fleet",
        area : "cylon",
        enum : LocationEnum.HUMAN_FLEET,
        text : "Action: Look at the top card of the Crisis or Destination deck and place it on the top or" +
        " bottom of that deck. Then draw 2 Skill Cards.<br/>OR<br/>Action: Infiltrate Galactica.",
        action : game => {
            //TODO write this
        },
    },
    
    RESURRECTION_SHIP : {
        name : "Resurrection Ship",
        area : "cylon",
        enum : LocationEnum.RESURRECTION_SHIP,
        text : "Draw only 1 Skill Card durring your Draw Skill Cards step.<br/>Action: draw 1 Super Crisis Card.",
        action : game => {
            //TODO write this
        },
    },
    
    //PAGASUS LOCATIONS:
    //graphic : 'BSP_pegasus_board_II.jpg'
    
    PEGASUS_CIC : {
        name : 'Pegasus CIC',
        area : 'pegasus',
        enum : LocationEnum.PEGASUS_CIC,
        text : 'Action: Roll a die; 1-3: Damage Pegasus, 4-6: Damage basestar, 7-8: damage basestar twice.',
        action : game => {
            //TODO
        },
    },
    
    AIRLOCK : {
        name : 'Airlock',
        area : 'pegasus',
        enum : LocationEnum.AIRLOCK,
        text : 'Action: choose a character and pass this Skill check to execute them. ' +
        'Reduce the difficulty of this check by 4 if the character is in the Brig.',
        choose : {
            who: WhoEnum.CURRENT,
            text: 'choose a player to execute',
            player: (game, player) => game.doSkillCheck({
                //TODO skill check, pass: player is executed, fail: no effect
            }),
        },
    },
    
    MAIN_BATTERIES : {
        name : 'Main Matteries',
        area : 'pegasus',
        enum : LocationEnum.MAIN_BATTERIES,
        text : 'Action: Choose a space area to affect and roll a die; ' +
        '1: Destroy 1 civilian ship, 2-3: Damage 1 viper, 4-6: Destroy 2 raiders, 7-8: Destroy 4 raiders.',
        choose : {
            who : WhoEnum.CURRENT,
            text : 'choose a space area to affect.',
            other : (game, input) => {
                //TODO
            },
        },
    },
    
    ENGINE_ROOM : {
        name : 'Engine Room',
        area : 'pegasus',
        enum : LocationEnum.ENGINE_ROOM,
        text : 'Action: Discard 2 Skill Cards to treat the next ' +
        'Crisis Card drawn this turn as if it had a "prepare for jump" icon.',
        action : game => {
            //TODO
        },
    },
    
    //NEW CAPRICA LOCATIONS:
    //graphic : 'BSP_new_caprica_board.jpg'
    
    MEDICAL_CENTER : {
        name : 'Medical Center',
        area : 'caprica',
        enum : LocationEnum.MEDICAL_CENTER,
        text : 'You may only draw 1 Skill Card during your Receive Skill Cards step.',
    },
    
    RESISTANCE_HQ : {
        name : 'Resistance HQ',
        area : 'caprica',
        enum : LocationEnum.RESISTANCE_HQ,
        text : 'Human action: Choose a character on New Caprica, (human or cylon), ' +
        'then pass this Skill check to execute them.',
        choose : {
            who: WhoEnum.CURRENT,
            text: 'choose a player to execute',
            player: (game, player) => game.doSkillCheck({
                //TODO skill check, pass: player is executed, fail: no effect
            }),
        },
    },
    
    DETENTION : {
        name : 'Detention',
        area : 'caprica',
        enum : LocationEnum.DETENTION,
        text : 'You make not move or add more than 2 cards to skill checks.<br/>' +
        'Action: pass this Skill check to more to any location.',
        skillCheck : {
            //TODO
        },
    },
    
    OCCUPATION_AUTHORITY : {
        name : 'Occupation Authority',
        area : 'caprica',
        enum : LocationEnum.OCCUPATION_AUTHORITY,
        text : 'Human Action: If you are the president, you may draw 1 quorum Card. Then you may play 1 Quorum Card.' +
        '<br/>Cylon Action: Activate 1 occupation force and then place 1 occupation force on this location.',
        humanAction : game => {
            //TODO
        },
        cylonAction : game => {
            //TODO
        },
    },
    
    BREEDERS_CANYON : {
        name : 'Breeders Canyon',
        area : 'caprica',
        enum : LocationEnum.BREEDERS_CANYON,
        text : 'Human Action: Reduce the highest resource by 1 to advace the fleet marker 1 space up the Jump track.' +
    '<br/>Cylon Action: Draw and resolve the top card from the Crisis deck, Skip the Prepare for Jump Step of this turn.',
        humanAction : game => {
            //TODO
        },
        cylonAction : game => {
            //TODO
        },
    },
    
    SHIPYARD : {
        name : 'Shipyard',
        area : 'caprica',
        enum : LocationEnum.SHIPYARD,
        text : 'Human Action: Prepare or evacuate 1 civilian ship. If you evacuate a civilian' +
        ' ship, you may then more to any Galactica location.' +
        '<br/>Cylon Action: Look at the top ship of the Locked Civilian Ship stack,' +
        ' and place it on the top or bottom of the stack.',
        humanAction : game => {
            //TODO
        },
        cylonAction : game => {
            //TODO
        },
    },
    
});

const PegasusExtras = Object.freeze({
    
    INFILTRATION : {
        name : 'Infiltration',
        text : 'YOU ARE INFILTRATING<br/>You are treated as a human player in all respects, except the following:<br/>' +
        '-Draw 1 extra Skill Card on your turn.<br/>You may play a maximum of 2 cards into each Skill check.<br/>' +
        '-You may never become Admiral or President.<br/>Action: End your Infiltration and move to the "Resurection Ship.' +
        ' If you were in the Brig, you must then discard down to 3 cards.',
        graphic : 'BSG_Title_Infiltration.png',
        action : (game, player) => {
            //TODO
        },
    },
    
    NEW_CAPRICA_OBJECTIVE : {
        name : 'New Caprica',
        text : 'Resolve when the following distance is travelled:<br/>4: Sleeper Agent phase.' +
        '<br/>7: New Caprica phase(See page 13 in the Pegasus expansion rulebook.)',
        graphic : 'BSG_Objective_NC.png',
    },
    
});
