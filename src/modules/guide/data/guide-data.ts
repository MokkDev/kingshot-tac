import { ArrowType, SideRole } from '../types/guide'
import type { GuideSection, GuideStep } from '../types/guide'

const CH = (...labels: string[]) => labels
const AY: NonNullable<GuideStep['arrows']> = [
    ['X18', 'Y19', ArrowType.Attack],
    ['X27', 'Y28', ArrowType.Attack],
    ['X31', 'Y30', ArrowType.Attack],
  ],
  AZ: NonNullable<GuideStep['arrows']> = [
    ['X19', 'Z18', ArrowType.Attack],
    ['X28', 'Z27', ArrowType.Attack],
    ['X30', 'Z31', ArrowType.Attack],
  ],
  AALL = [...AY, ...AZ]
export const GUIDE_SECTIONS: GuideSection[] = [
  [
    'The map',
    [
      {
        text: 'Three sides, one Temple in the middle.',
        mapMarkers: [['tmp', 'Temple']],
      },
      {
        text: 'We play side {X}. Switch sides above the map.',
        highlights: ['X1'],
        mapMarkers: [['X1', 'We start here']],
        mapFocus: ['ALL'],
      },
      {
        text: 'The other two sides are {Y} and {Z}.',
        highlights: ['Y1', 'Z1'],
        mapMarkers: [
          ['Y1', 'Side {Y}'],
          ['Z1', 'Side {Z}'],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Garrisons sit closer to one neighbor than the other, so fights naturally rotate this way.',
        arrows: [
          ['A1', 'C1', ArrowType.Attack],
          ['C1', 'B1', ArrowType.Attack],
          ['B1', 'A1', ArrowType.Attack],
        ],
        chips: CH('A → C', 'C → B', 'B → A'),
        mapFocus: ['ALL'],
      },
      {
        text: 'You get one role, set by [Leader] before the battle. All 3 of your marches follow it.',
        chips: CH('[Attack]', '[Defense]', '[Floater]', '[Leader]'),
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Buildings on our side',
    [
      {
        text: 'HQ ({X}1): where we start. 1,800 points per minute.',
        highlights: ['X1'],
        mapMarkers: [['X1', 'HQ 1,800/min']],
      },
      {
        text: 'Garrison ({X}24): 1,800 points per minute. Opens at 20:00.',
        highlights: ['X24'],
        mapMarkers: [['X24', 'Garrison 1,800/min']],
      },
      {
        text: 'Clusters of Ruins: 600 points per minute each.',
        highlights: ['@CL'],
        mapMarkers: [['X29', 'Cluster 600/min']],
        mapFocus: ['ALL'],
      },
      {
        text: 'Ruins: 180 points per minute each.',
        highlights: ['@RU'],
        mapFocus: ['ALL'],
      },
      {
        text: 'Transit Hubs: 60 points per minute each. They are the gates between sides.',
        highlights: ['@HUB'],
        mapFocus: ['ALL'],
      },
      {
        text: 'The captain of a building recovers energy faster. [Leader] appoint captains.',
        highlights: ['@CAP'],
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Transit hubs: the gates',
    [
      {
        text: 'Each side has 6 hubs. They are the only way into another side.',
        highlights: ['@HUB'],
        mapFocus: ['ALL'],
      },
      {
        text: '{X}18, {X}27 and {X}31 lead to side {Y}.',
        highlights: ['X18', 'X27', 'X31'],
        arrows: [
          ['X18', 'Y19', ArrowType.Bidirectional],
          ['X27', 'Y28', ArrowType.Bidirectional],
          ['X31', 'Y30', ArrowType.Bidirectional],
        ],
      },
      {
        text: '{X}19, {X}28 and {X}30 lead to side {Z}.',
        highlights: ['X19', 'X28', 'X30'],
        arrows: [
          ['X19', 'Z18', ArrowType.Bidirectional],
          ['X28', 'Z27', ArrowType.Bidirectional],
          ['X30', 'Z31', ArrowType.Bidirectional],
        ],
      },
      {
        text: '{X}30 and {X}31 also lead to the Temple.',
        highlights: ['X30', 'X31'],
        arrows: [
          ['X30', 'tmp', ArrowType.Movement],
          ['X31', 'tmp', ArrowType.Movement],
        ],
      },
      {
        text: '{X}28 is behind our Garrison, so it is locked at first.',
        highlights: ['X28', 'X24'],
        mapMarkers: [['X28', 'Locked until 20:00']],
      },
    ],
  ],
  [
    'Garrisons: locked at first',
    [
      {
        text: 'Garrisons and the hub behind them are blocked until 20:00.',
        highlights: ['X24', 'X28'],
        mapMarkers: [['X24', 'Locked until 20:00']],
      },
      {
        text: 'Until then, sides meet at 4 hubs: {X}18, {X}19, {X}30 and {X}31.',
        highlights: ['X18', 'X19', 'X30', 'X31'],
        arrows: [
          ['X18', 'Y19', ArrowType.Bidirectional],
          ['X19', 'Z18', ArrowType.Bidirectional],
          ['X30', 'Z31', ArrowType.Bidirectional],
          ['X31', 'Y30', ArrowType.Bidirectional],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Your job: early fights are at those 4 hubs.',
        highlights: ['X18', 'X19', 'X30', 'X31'],
        mapFocus: ['ALL'],
      },
    ],
  ],
  // ["Our rotation",[
  // {text:"Every link works both ways. We can attack and be attacked from both sides.",arrows:[["X18","Y19","bi"],["X27","Y28","bi"],["X19","Z18","bi"],["X28","Z27","bi"],["X30","Z31","bi"],["X31","Y30","bi"]],mapFocus:["ALL"]},
  // {text:"{Y}24 is the closest enemy Garrison to us. We attack {Y} through all 3 hubs.",highlights:["Y24"],arrows:[...AY,["Y28","Y24","atk"]],mapMarkers:[["Y24","Closest enemy Garrison"]]},
  // {text:"Side {Z} is closest to our Garrison {X}24, so expect them there. Defend it.",roleMarkers:[["X24","D"]],arrows:[["X28","X24","def"]],mapMarkers:[["X24","Our Garrison","D"]],mapFocus:["X24","X28","Z27"]},
  // {text:"Every side has the same layout, so fights are likely to rotate: A → C → B → A.",highlights:["A24","B24","C24"],arrows:[["A18","C19","atk"],["A27","C28","atk"],["A31","C30","atk"],["C28","C24","atk"],["C18","B19","atk"],["C27","B28","atk"],["C31","B30","atk"],["B28","B24","atk"],["B18","A19","atk"],["B27","A28","atk"],["B31","A30","atk"],["A28","A24","atk"]],mapMarkers:[["C28","A hits C","A"],["B28","C hits B","A"],["A28","B hits A","A"]],chips:CH("A → C","C → B","B → A"),mapFocus:["ALL"]},
  // {text:"Your job:\n[Attack]: push toward {Y}.\n[Defense]: hold {X}24.",arrows:[...AY,["Y28","Y24","atk"]],roleMarkers:[["X24","D"],["Y24","A"]]}]],
  [
    'The Temple',
    [
      {
        text: 'The Temple opens at 40:00.',
        highlights: ['tmp'],
        mapMarkers: [['tmp', 'Opens at 40:00']],
      },
      {
        text: 'It gives 1,800 points per minute and holds a captain.',
        highlights: ['tmp'],
        mapMarkers: [['tmp', '1,800/min']],
      },
      {
        text: 'The occupier at the end gains abundant points.',
        highlights: ['tmp'],
        mapMarkers: [['tmp', 'Hold it at the end']],
      },
      {
        text: 'We reach it only through {X}30 and {X}31.',
        highlights: ['X30', 'X31'],
        arrows: [
          ['X30', 'tmp', ArrowType.Movement],
          ['X31', 'tmp', ArrowType.Movement],
        ],
      },
      {
        text: 'Whoever kills the last NPC guard holds the Temple until someone defeats them.',
        highlights: ['tmp'],
        mapMarkers: [['tmp', 'Last NPC: first holder']],
      },
    ],
  ],
  [
    'Energy',
    [
      {
        text: 'Moving, capturing, attacking, retreating, healing and reviving cost energy.',
        chips: CH('Move', 'Capture', 'Attack', 'Retreat', 'Heal', 'Revive'),
        mapFocus: ['ALL'],
      },
      {
        text: 'The farther you march, the more energy it costs.',
        mapFocus: ['ALL'],
      },
      {
        text: 'Try to spend it on goals, not random fights.',
        mapFocus: ['ALL'],
      },
      {
        text: 'Wounded? Use Conscript to heal. It costs energy. Use it in a building nobody is fighting for.\nMarch fully defeated? Wait for the cooldown, or spend energy to bring it back instantly.',
        highlights: ['@CAP', '@HUB'],
        mapFocus: ['ALL'],
      },
      {
        text: 'The captain of a building recovers energy faster.',
        highlights: ['@CAP'],
        mapFocus: ['ALL'],
      },
      {
        text: '[Leader] give captain slots to the strongest and most active players, tiered by activity, strength and lack of energy.',
        highlights: ['@CAP'],
        mapFocus: ['ALL'],
      },
      {
        text: 'Suggestion: keep 30–40% energy for the 20:00 mark.',
        highlights: ['X24'],
        mapMarkers: [['X24', '20:00']],
        mapFocus: ['ALL'],
      },
      { text: 'Your job: manage your own energy.', mapFocus: ['ALL'] },
    ],
  ],
  [
    'Your marches',
    [
      {
        text: 'You have 3 marches, 3 heroes each. Strongest heroes in March 1, then March 2, then March 3.\nTroops: 50/20/30, or 60/20/20 to hold a Garrison.',
        chips: CH('March 1: strongest', 'March 2: next', 'March 3: the rest'),
        mapFocus: ['ALL'],
      },
      {
        text: 'Buffs: combat buffs work. Capacity, march speed and rally buffs don’t.',
        mapFocus: ['ALL'],
      },
      {
        text: 'Skip Diana and Blue heroes.\nSet your presets before the battle starts.',
        mapFocus: ['ALL'],
      },
    ],
  ],

  [
    'Fighting basics',
    [
      {
        text: 'Our buildings have NPC guards. Enemies must kill them first.',
        highlights: ['X24'],
        mapMarkers: [['X24', 'NPC guards']],
        mapFocus: ['X24', 'X28', 'X21'],
      },
      {
        text: 'Until the NPCs die, you can still send marches into the building.',
        highlights: ['X24'],
        mapFocus: ['X24', 'X28', 'X21'],
      },
      {
        text: 'Once they die, the building is theirs. We must fight to take it back.',
        highlights: ['X28'],
        mapMarkers: [['X28', 'Lost']],
        mapFocus: ['X24', 'X28', 'X21'],
      },
      {
        text: 'NPCs alive when you arrive? Go in. NPCs dead? Stage first, then retake.',
        chips: CH('NPCs alive: go in', 'NPCs dead: stage, retake'),
        mapFocus: ['ALL'],
      },
      {
        text: 'A march’s destination is locked once you send it. Long marches can arrive too late.',
        mapFocus: ['ALL'],
      },
      {
        text: 'Stage first: go to the node before the fight, then move in.',
        arrows: [
          ['X24', 'X28', ArrowType.Movement],
          ['Z27', 'X28', ArrowType.Enemy],
        ],
        mapMarkers: [['X24', 'Stage here']],
        mapFocus: ['X24', 'X28', 'Z27'],
      },
      {
        text: 'A defeated march respawns at your HQ ({X}1) and walks from there.',
        highlights: ['X1'],
        mapMarkers: [['X1', 'Respawn']],
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Battle: Preparation (0–3 min)',
    [
      {
        text: '0–3 min. Check your role and your route.',
        highlights: ['X1'],
        mapFocus: ['REG'],
      },
      {
        text: 'Check that your 3 presets are ready.',
        highlights: ['X1'],
        mapFocus: ['REG'],
      },
      {
        text: 'Use pet buffs and consumables right before the start.',
        highlights: ['X1'],
        mapFocus: ['REG'],
      },
      {
        text: 'Your job: be ready when the clock hits 3:00.',
        highlights: ['X1'],
        mapFocus: ['REG'],
      },
    ],
  ],
  [
    'Battle: Take our nodes (3–20 min)',
    [
      {
        text: '3–20 min. Take all our nodes. Clusters (600) before Ruins (180).',
        highlights: ['@CL'],
        mapFocus: ['ALL'],
      },
      {
        text: '[Attack]: take the right-side nodes, then push through {X}18 and {X}31.\n[Defense]: take the left-side nodes and hold {X}19 and {X}30.\n[Floater]: take the center and back nodes, then fill gaps.\n[Leader]: assign energy and make the calls.',
        arrows: [
          ['X18', 'Y19', ArrowType.Attack],
          ['X31', 'Y30', ArrowType.Attack],
        ],
        roleMarkers: [
          ['X19', SideRole.Defense],
          ['X30', SideRole.Defense],
        ],
        mapMarkers: [
          ['Y19', 'Push', SideRole.Attack],
          ['Y30', 'Push', SideRole.Attack],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Why push right? Hits on {Y}’s other hubs split their reinforcements before the Garrison opens.',
        arrows: [
          ['X18', 'Y19', ArrowType.Attack],
          ['X31', 'Y30', ArrowType.Attack],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Garrisons are locked. Save energy for 20:00.',
        highlights: ['X24'],
        mapMarkers: [['X24', 'Locked']],
      },
    ],
  ],
  [
    'Battle: Garrison squads (18–20 min)',
    [
      {
        text: 'About 18:30. [Leader] tag two handpicked squads. Everyone else keeps their role.',
        chips: CH('Defense squad', 'Attack squad', 'Everyone else: role'),
        mapFocus: ['ALL'],
      },
      {
        text: '[Defense]: stage next to {X}24, ready for 20:00.',
        highlights: ['X24', 'X28'],
        mapMarkers: [['X21', 'Stage here', SideRole.Defense]],
        roleMarkers: [['X21', SideRole.Defense]],
        mapFocus: ['X21', 'X24', 'X28'],
      },
      {
        text: '[Attack]: stage at {Y}28, next to {Y}24.',
        roleMarkers: [['Y28', SideRole.Attack]],
        mapMarkers: [['Y28', 'Stage here', SideRole.Attack]],
        arrows: [['Y28', 'Y24', ArrowType.Bidirectional]],
      },
      {
        text: '20:00. [Defense]: take {X}24 first, then {X}28.',
        arrows: [
          ['X21', 'X24', ArrowType.Defense],
          ['X24', 'X28', ArrowType.Defense],
        ],
        roleMarkers: [
          ['X24', SideRole.Defense],
          ['X28', SideRole.Defense],
        ],
        mapFocus: ['X21', 'X24', 'X28', 'Z27'],
      },
      {
        text: '20:00. [Attack]: push for {Y}24.',
        arrows: [['Y28', 'Y24', ArrowType.Attack]],
        roleMarkers: [['Y24', SideRole.Attack]],
      },
      {
        text: "Don't be late. {Z} will be in {X}28 at 20:00. Being late might cost the Garrison.",
        mapMarkers: [['X24', 'Don’t be late']],
        mapFocus: ['X24', 'X28', 'Z27'],
      },
    ],
  ],
  [
    'Battle: Garrison phase (20–40 min)',
    [
      {
        text: 'Hold {X}24 and {X}28. The Garrison gives 1,800 points per minute.',
        highlights: ['X24', 'X28'],
        mapMarkers: [['X24', '1,800/min']],
      },
      {
        text: '[Defense]: keep all 6 hubs ours and retake any that flip.\n[Attack]: keep pressure through all 3 hubs toward {Y}.\n[Floater]: retake hubs and cover buildings the Attackers pass.',
        arrows: AY,
        highlights: ['@HUB'],
        mapFocus: ['ALL'],
      },
      {
        text: 'If {Y} pressures {X}18, {X}27 or {X}31, [Leader] call [Defense] to the right.',
        arrows: [
          ['Y19', 'X18', ArrowType.Enemy],
          ['Y28', 'X27', ArrowType.Enemy],
          ['Y30', 'X31', ArrowType.Enemy],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Expand only while the hub you crossed stays ours.',
        arrows: AY,
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Battle: Before the Temple (36–40 min)',
    [
      {
        text: 'About 36 min. Heal your troops.',
        highlights: ['X1'],
        mapFocus: ['ALL'],
      },
      {
        text: '[Defense]: make sure every hub is ours. {X}30 and {X}31 matter most.\n[Attack]: keep your role.',
        highlights: ['@HUB'],
        roleMarkers: [
          ['X30', SideRole.Defense],
          ['X31', SideRole.Defense],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: '[Leader] tag a handpicked Temple squad from the [Attack] teams. Everyone else keeps their role.',
        chips: CH('Temple squad', 'Everyone else: role'),
        mapFocus: ['ALL'],
      },
      {
        text: 'Temple squad: move to {X}30 and {X}31.',
        highlights: ['X30', 'X31'],
      },
      {
        text: '[Defense]: protect {X}30 and {X}31. Both hubs are critical to attack temple.\n[Attack]: cut their access by hitting {Y}29 and {Z}29.',
        roleMarkers: [
          ['X29', SideRole.Defense],
          ['Y29', SideRole.Attack],
          ['Z29', SideRole.Attack],
        ],
        mapMarkers: [
          ['X29', 'Defend', SideRole.Defense],
          ['Y29', 'Cut access', SideRole.Attack],
          ['Z29', 'Cut access', SideRole.Attack],
        ],
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Battle: Temple phase (40–60 min)',
    [
      {
        text: '40:00. The Temple just opened!',
        highlights: ['tmp'],
        mapMarkers: [['tmp', 'Opened!']],
      },
      {
        text: 'The Temple squad attacks through {X}30 and {X}31, strongest march first.',
        arrows: [
          ['X30', 'tmp', ArrowType.Attack],
          ['X31', 'tmp', ArrowType.Attack],
        ],
        mapMarkers: [['tmp', 'Plan A']],
      },
      {
        text: 'Whoever kills the last NPC guard holds the Temple until someone defeats them.',
        highlights: ['tmp'],
        mapMarkers: [['tmp', 'Last NPC: first holder']],
      },
      {
        text: 'Some [Attack] members hit {Y}30 and {Z}31 to slow enemy Temple reinforcements.\n[Defense]: hold our hubs.\n[Floater]: reinforce where it’s needed.',
        arrows: [
          ['X31', 'Y30', ArrowType.Attack],
          ['X30', 'Z31', ArrowType.Attack],
        ],
        roleMarkers: [
          ['X30', SideRole.Defense],
          ['X31', SideRole.Defense],
        ],
        mapFocus: ['ALL'],
      },
      {
        text: 'Plan B: if the Temple looks lost, [Leader] call it. Ignore the Temple and everyone gets more aggressive.',
        arrows: AALL,
        mapMarkers: [['tmp', 'Plan B: ignore temple']],
        mapFocus: ['ALL'],
      },
      {
        text: 'Plan B: advance through our safe buildings and attack enemy buildings.\n[Defense] should always prioritize defending our buildings and paths from any attacks.',
        arrows: AALL,
        roleMarkers: [['X24', SideRole.Defense]],
        mapFocus: ['ALL'],
      },
      {
        text: '[Leader] can swap back to Plan A if the Temple looks winnable.',
        chips: CH('Plan A', '⇄', 'Plan B'),
        mapFocus: ['ALL'],
      },
    ],
  ],
  [
    'Battle: The ending',
    [
      {
        text: 'Plan A: the last minutes decide who holds the Temple.',
        highlights: ['tmp'],
      },
      {
        text: 'Plan A: expect pushes from every side.',
        arrows: [
          ['Y30', 'tmp', ArrowType.Enemy],
          ['Y31', 'tmp', ArrowType.Enemy],
          ['Z30', 'tmp', ArrowType.Enemy],
          ['Z31', 'tmp', ArrowType.Enemy],
        ],
        mapFocus: ['tmp', 'X29', 'Y30', 'Z31'],
      },
      {
        text: 'Plan B: keep taking enemy buildings through all our hubs.',
        arrows: AALL,
        mapFocus: ['ALL'],
      },
      { text: 'Keep some energy for the final fights.', mapFocus: ['ALL'] },
      {
        text: 'Stay until the match is complete.',
        chips: CH('Don’t leave early'),
        mapFocus: ['ALL'],
      },
      {
        text: 'Rewards are given at the end. Leave early and you miss them.',
        mapFocus: ['ALL'],
      },
    ],
  ],
]
