
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
        - ? new locations: PegasusLocationMap
        - ? special cards: PegasusExtras
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
            text : '(PO/L/T)(13) PASS: +1 food, FAIL: -2 food and -1 morale (-OR-) -1 food and each player discards 1 Skill Card and draws 1 Treachery Card.',
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
    //TODO find totals
    BINARY_STAR: {
        total : 1,
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
        total : 1,
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
        total : 1,
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
        total : 1,
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
        total : 1,
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

    //HOSTILE card back grafic : 'BSP_agenda_bk.gif'
    //SYMPATHETIC card back grafic : 'BSP_sagenda_bk.gif'
    
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

const PegasusCharacterMap = Object.freeze({});

const PegasusSkillCardMap = Object.freeze({});

const CapricaCrisisMap = Object.freeze({
    
    //card back graphic : 'BSP_newcaprica_bk.gif'
    
});

const PegasusQuorumMap = Object.freeze({});

const PegasusLocationMap = Object.freeze({
    
    //CYLON LOCATIONS: (replaces original cylon locations)
    //graphic : 'BSD_CylonOverlay1.png'
    CAPRICA : {},
    
    CYLON_FLEET : {},
    
    HUMAN_FLEET : {},
    
    RESURRECTION_SHIP : {},
    
    //PAGASUS LOCATIONS:
    //graphic : 'BSP_pegasus_board_II.jpg'
    PEGASUS_CIC : {},
    
    AIRLOCK : {},
    
    MAIN_BATTERIES : {},
    
    ENGINE_ROOM : {},
    
    //NEW CAPRICA LOCATIONS:
    //graphic : 'BSP_new_caprica_board.jpg'
    MEDICAL_CENTER : {},
    
    RESISTANCE_HQ : {},
    
    DETENTION : {},
    
    OCCUPATION_AUTHORITY : {},
    
    BREEDERS_CANYON : {},
    
    SHIPYARD : {},
    
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
    
});








