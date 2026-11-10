// Every page of the guide. Hand-edited; coordinates are pixels on the page's screenshot (1440 wide).
// Shapes: {c:[cx,cy,r]} circle, {e:[x0,y0,x1,y1]} ellipse, {r:[x0,y0,x1,y1,radius]} rounded box, {p:[[x,y],...]} polygon.
// A page: title, ver (game version of the screenshot), shot, optional view (crop [x0,y0,x1,y1]; a cropped page is a popup, shown at its in-game spot on top of its parent's screenshot), parent, optional badge (tab letter),
//   toggle (optional [label, page] pairs shown as a switch on the screenshot's top-left, for versions of one screen),
//   marks (badges drawn on the screenshot), dim: false (screens with few elements: nothing is grayed out), lit (always lit, not explained; only with dimming), optional intro / note (HTML above / below the items),
//   items (numbered, in screen order) and taps (unnumbered close / back buttons; lit like items, so their shape gets the same ~8px margin).
// A tap: {to: page} or {back: true} (goes to the parent page), shape, label.
// An item: n, name, text (HTML, optional), at (callout center), lit (shapes; also its tap area), to (page it opens, optional)
//   or back: true (goes to the parent page; no Open button), tap (with to: only this area opens the page; the rest of lit just selects the item).
//   overlay ({ title, html } shown in a box over the page when the item is tapped, for info with no screen of its own; adds a button labeled
//   button, default Open).
// The Monspot page has two versions, switched by the region toggle on its screenshot.
// The Powers chart, shown over the page from Monspot's ? button and the Spot screen's power.
const POWERS = { title: 'Powers', html: 'Values are Main / Sub<br><span class="yellow">Every power except Soul Badges Upgrade can also appear as a boosted Plus version</span><table class="powers"><tr><th></th><th></th><th class="plus">Plus</th><th>Regular</th></tr><tr><td class="icons"><img src="icons/power_stamina.png" alt=""></td><td>On quest clear, returns x% of stamina spent back</td><td class="plus">30% / 20%</td><td>20% / 10%</td></tr><tr><td class="icons"><img src="icons/power_exp.png" alt=""></td><td>On quest clear, gives EXP Bonus</td><td class="plus">75% / 50%</td><td>50% / 25%</td></tr><tr><td class="icons"><img src="icons/power_score.png" alt=""></td><td>On quest clear, gives Score Bonus</td><td class="plus">60pt / 40pt</td><td>40pt / 20pt</td></tr><tr><td class="icons"><img src="icons/power_luck.png" alt=""></td><td>Monsters get bonus luck</td><td class="plus">+30 / +20</td><td>+20 / +10</td></tr><tr><td class="icons"><img src="icons/power_nocon.png" alt=""></td><td>No-Continue Clear Bonus x2 Chance</td><td class="plus">75% / 50%</td><td>50% / 25%</td></tr><tr><td class="icons"><img src="icons/power_soul.png" alt=""></td><td>Soul Badges Upgrade</td><td class="plus">—</td><td>+2 / +1 levels</td></tr><tr><td class="icons"><img src="icons/power_fire.png" alt=""><img src="icons/power_water.png" alt=""><img src="icons/power_wood.png" alt=""><img src="icons/power_light.png" alt=""><img src="icons/power_dark.png" alt=""></td><td>Stat Boost for that element</td><td class="plus">ATK 2000 / 1500<br>HP 2000 / 1500<br>SPD 40.8 / 30.6</td><td>ATK 1500 / 500<br>HP 1500 / 500<br>SPD 30.6 / 10.2</td></tr><tr><td class="icons"><img src="icons/power_luckskill.png" alt=""></td><td>Luck Skill Activation Rate Up</td><td class="plus">2.2x / 2x</td><td>2x / 1.2x</td></tr><tr><td class="icons"><img src="icons/power_king.png" alt=""></td><td colspan="3">ALL of the above at Plus values. Only for Premium Monpass owners. Their MySpot power is ALWAYS the King icon</td></tr></table>※ Powers have no effect in some quests' };

const MONSPOT_REGIONS = [['Outside Japan', 'monspot'], ['In Japan', 'monspot-japan']];
// The map area stays lit on both versions, so their different backgrounds show.
const MONSPOT_MAP = { p: [[0, 736], [778, 736], [820, 640], [820, 636], [1440, 636], [1440, 2470], [0, 2470]] };

window.SITE = {
  title: 'English Monst UI Guide',
  start: 'home',
  // The game's tab bar, at the bottom of every screenshot: always lit, and each tab with a page opens it from any page.
  // badges: the ! circles on the Shop and Striker tabs, which stick out above the bar (lit too, so they aren't cut off).
  tabbar: { top: 2476, badges: [{ c: [683, 2498, 31] }, { c: [1392, 2498, 31] }], tabs: [{ label: 'Home', to: 'home', r: [0, 2476, 240, 2825, 0] }] },
  menu: ['home', 'gacha-ridora-lab', 'increase-limit', 'generate-screen', 'generate-screen-perk', 'monspot', 'monspot-japan', 'training-status', 'speed-up', 'spot', 'change-powers', 'shortcut-settings', 'more-options', 'data-backup', 'backup'],
  pages: {
    'home': {
      title: 'Home Screen', ver: '33.0', badge: 'A', parent: null, shot: 'screens/home.png',
      marks: [{ badge: 'A', at: [123, 2735] }],
      items: [
        { n: 1, name: 'More Options', at: [1250, 489], lit: [{ c: [1327, 557, 87] }], to: 'more-options' },
        { n: 2, name: 'Notices', text: 'Current notices or news', at: [1250, 713], lit: [{ c: [1327, 781, 87] }] },
        { n: 3, name: 'Gift Box', text: 'In-game presents can be collected here. Tap the blue button to delete all messages', at: [1250, 937], lit: [{ c: [1327, 1005, 87] }] },
        { n: 4, name: 'Gacha Ridora Lab', at: [44, 1217], lit: [{ p: [[77, 1178], [71, 1181], [63, 1191], [62, 1216], [44, 1233], [30, 1255], [15, 1269], [9, 1283], [9, 1312], [13, 1323], [18, 1329], [18, 1434], [28, 1453], [41, 1464], [59, 1470], [101, 1470], [109, 1478], [115, 1480], [167, 1479], [177, 1470], [188, 1470], [206, 1464], [219, 1453], [227, 1440], [230, 1430], [230, 1331], [237, 1323], [241, 1312], [240, 1279], [235, 1269], [224, 1258], [215, 1253], [202, 1233], [183, 1216], [183, 1194], [179, 1186], [171, 1179], [164, 1177]] }], to: 'gacha-ridora-lab' },
        { n: 5, name: 'Campaigns', text: 'Active campaigns or Limited Time Events', at: [49, 1645], lit: [{ r: [17, 1592, 1428, 1870, 130] }] },
        { n: 6, name: 'Monspot', at: [88, 1930], lit: [{ r: [67, 1911, 434, 2114, 22] }], to: 'monspot' },
        { n: 7, name: 'Shortcut', at: [614, 1974], tap: { c: [880, 1980, 58] }, lit: [{ p: [[937, 1966], [930, 1950], [917, 1935], [902, 1926], [887, 1922], [873, 1922], [858, 1926], [843, 1935], [831, 1948], [800, 1937], [700, 1935], [606, 1953], [567, 1982], [544, 2019], [542, 2029], [548, 2054], [577, 2079], [585, 2083], [700, 2089], [855, 2080], [863, 2075], [891, 2037], [910, 2030], [928, 2013], [938, 1989]] }], to: 'shortcut-settings' },
        { n: 8, name: 'Quest', at: [516, 2150], lit: [{ p: [[558, 1945], [525, 1977], [497, 2016], [478, 2056], [465, 2107], [463, 2161], [469, 2202], [478, 2232], [487, 2252], [487, 2273], [522, 2348], [521, 2366], [490, 2406], [495, 2408], [944, 2407], [946, 2405], [926, 2369], [921, 2355], [948, 2310], [948, 2254], [963, 2217], [970, 2187], [973, 2161], [973, 2127], [967, 2086], [958, 2056], [943, 2023], [917, 1984], [878, 1945], [839, 1919], [793, 1900], [745, 1890], [691, 1890], [643, 1900], [597, 1919]] }] },
        { n: 9, name: 'Lucky Mons', at: [1009, 1930], lit: [{ r: [988, 1911, 1190, 2163, 22] }] },
        { n: 10, name: 'Navi', at: [1234, 1930], lit: [{ r: [1209, 1911, 1421, 2163, 22] }] },
        { n: 11, name: 'Missions', at: [44, 2226], lit: [{ p: [[521, 2364], [521, 2349], [461, 2218], [459, 2194], [453, 2183], [442, 2172], [422, 2164], [410, 2164], [393, 2170], [379, 2183], [373, 2194], [113, 2194], [92, 2198], [63, 2211], [37, 2235], [22, 2260], [15, 2283], [14, 2313], [16, 2326], [22, 2344], [31, 2361], [63, 2393], [83, 2403], [105, 2409], [483, 2410], [491, 2405]] }] },
        { n: 12, name: 'Join Co-Op', at: [1020, 2215], lit: [{ p: [[922, 2355], [922, 2359], [947, 2405], [955, 2410], [1281, 2410], [1281, 2297], [1284, 2291], [1295, 2282], [1322, 2281], [1303, 2266], [1292, 2248], [1289, 2237], [1290, 2212], [1297, 2196], [1016, 2197]] }] },
        { n: 13, name: 'Co-Op Filter', text: 'When active, tap the quest in the lower-right square to reselect the quest to search for. Tap the filter icon to disable filtering for that specific quest.', at: [1398, 2191], lit: [{ p: [[1334, 2169], [1321, 2174], [1305, 2187], [1297, 2198], [1291, 2213], [1290, 2236], [1294, 2250], [1305, 2267], [1323, 2281], [1295, 2283], [1285, 2291], [1282, 2297], [1282, 2416], [1291, 2428], [1299, 2431], [1411, 2430], [1421, 2422], [1424, 2416], [1424, 2297], [1421, 2291], [1411, 2283], [1377, 2281], [1395, 2267], [1406, 2250], [1410, 2236], [1409, 2213], [1399, 2192], [1379, 2174], [1357, 2167]] }] },
      ],
      taps: [],
    },
    'gacha-ridora-lab': {
      title: 'Gacha Ridora Lab', ver: '33.0', parent: 'home', shot: 'screens/gacha_ridora_lab.png',
      intro: 'Every month, 10 free mons can be generated using the collected energy (+2 free generations if you are a Monpass user). In the end, you can keep 1 of the generated mons.<br><span class="warn">Warning: You can get energy up to the 1st of the next month, but you must claim a mon by the 2nd, 3:59 AM (JP Time).</span>',
      items: [
        { n: 1, name: 'Event Period (JP Time)', at: [222, 632], lit: [{ r: [264, 582, 1176, 681, 50] }] },
        { n: 2, name: 'Total Energy Collected', at: [311, 940], lit: [{ p: [[0, 895], [526, 894], [623, 789], [629, 782], [630, 776], [567, 698], [558, 692], [0, 692]] }] },
        { n: 3, name: 'Rare Energy Rate', text: 'Rare Energy appearance increases at 1000 and 2000 total collected.', at: [1390, 655], lit: [{ r: [632, 714, 1433, 876, 18] }] },
        { n: 4, name: 'Energy Generated', text: 'Generates energy over time that is auto-collected only when entering this screen.<br><span class="warn">Energy stops generating when it hits this cap.</span>', at: [735, 950], lit: [{ r: [782, 904, 1308, 996, 28] }] },
        { n: 5, name: 'Increase Limit', at: [1366, 1042], lit: [{ r: [1310, 890, 1422, 1000, 22] }], to: 'increase-limit' },
        { n: 6, name: 'Waiting for Energy', text: 'Energy pops up every ~18 mins', at: [272, 1500], lit: [{ r: [322, 1434, 1113, 1568, 18] }] },
        { n: 7, name: 'Generate Mons', at: [430, 2058], lit: [{ r: [417, 2047, 1023, 2213, 28] }], to: 'generate-screen' },
        { n: 8, name: 'Current Energy & Generated Mons', at: [700, 2272], lit: [{ p: [[32, 2142], [33, 2350], [38, 2362], [49, 2375], [66, 2384], [86, 2386], [91, 2400], [100, 2409], [111, 2413], [1381, 2413], [1392, 2409], [1401, 2400], [1405, 2391], [1405, 2239], [1401, 2230], [1392, 2221], [1381, 2217], [249, 2217], [247, 2138], [237, 2119], [220, 2106], [206, 2102], [74, 2102], [60, 2106], [49, 2113], [38, 2126]] }] },
      ],
      taps: [{ back: true, shape: { r: [12, 420, 223, 533, 26] }, label: 'Back' }],
    },
    'increase-limit': {
      title: 'Increase Limit', ver: '33.0', dim: false, parent: 'gacha-ridora-lab', shot: 'screens/increase_limit.png', view: [64, 908, 1382, 2132],
      items: [
        { n: 1, name: 'Increase Limit', text: 'Gouzetsu Bonus Points can be used to upgrade the limit of energy generated', at: [118, 1102], lit: [{ r: [100, 1084, 1340, 1890, 24] }] },
        { n: 2, name: 'Upgrade', at: [140, 1942], lit: [{ r: [125, 1925, 496, 2076, 28] }] },
        { n: 3, name: 'Close', at: [960, 1942], lit: [{ r: [945, 1925, 1315, 2076, 28] }], back: true },
      ],
      taps: [],
    },
    'generate-screen': {
      title: 'Generate Screen', ver: '33.0', parent: 'gacha-ridora-lab', shot: 'screens/generate_screen.png',
      lit: [{ r: [14, 760, 483, 1053, 24] }, { r: [485, 760, 951, 1053, 24] }, { r: [952, 760, 1420, 1053, 24] }, { r: [14, 1050, 483, 1343, 24] }, { r: [485, 1050, 951, 1343, 24] }],
      items: [
        { n: 1, name: 'Montama Energy', text: '+1 / mon generated, earn Montama Ridora at 50 energy.', at: [920, 385], lit: [{ p: [[962, 384], [949, 393], [933, 409], [924, 422], [914, 447], [912, 459], [914, 493], [924, 518], [933, 530], [920, 544], [915, 554], [914, 575], [918, 586], [931, 600], [947, 606], [1075, 606], [1088, 602], [1102, 589], [1108, 575], [1108, 558], [1105, 549], [1087, 530], [1100, 510], [1108, 481], [1106, 447], [1096, 422], [1087, 409], [1071, 393], [1058, 384], [1035, 375], [1019, 372], [1001, 372], [978, 377]] }] },
        { n: 2, name: 'Montama Ridora Exchange', at: [1165, 385], lit: [{ p: [[1211, 378], [1198, 387], [1175, 412], [1167, 427], [1161, 445], [1159, 457], [1161, 491], [1167, 509], [1180, 530], [1170, 534], [1161, 543], [1157, 552], [1157, 588], [1161, 597], [1170, 606], [1181, 610], [1336, 610], [1347, 606], [1356, 597], [1360, 588], [1360, 552], [1356, 543], [1343, 531], [1357, 509], [1365, 479], [1363, 445], [1352, 417], [1343, 404], [1326, 387], [1313, 378], [1291, 369], [1271, 365], [1253, 365], [1233, 369]] }] },
        { n: 3, name: 'Featured', text: 'Indicates Featured Mon is in this element', at: [532, 712], lit: [{ c: [532, 815, 58] }, { c: [62, 1105, 58] }] },
        { n: 4, name: 'Featured Limited Mons', at: [972, 1340], lit: [{ r: [970, 1054, 1406, 1338, 30] }] },
        { n: 5, name: 'Possible Mons', at: [36, 1372], lit: [{ r: [17, 1377, 230, 1523, 22] }] },
        { n: 6, name: 'Reset', at: [262, 1372], lit: [{ r: [242, 1377, 456, 1523, 22] }] },
        { n: 7, name: 'Generate Mon', text: 'Requires 300 Energy', at: [502, 1380], lit: [{ p: [[488, 1384], [487, 1491], [491, 1500], [496, 1505], [489, 1520], [489, 1537], [495, 1551], [506, 1562], [522, 1568], [918, 1568], [934, 1562], [945, 1551], [950, 1541], [951, 1520], [944, 1505], [949, 1500], [953, 1491], [953, 1387], [949, 1378], [936, 1367], [929, 1365], [511, 1365], [500, 1369]] }] },
        { n: 8, name: 'Use Monpass Perk', at: [1125, 1440], lit: [{ p: [[1171, 1370], [1167, 1379], [1167, 1501], [1171, 1510], [1180, 1519], [1191, 1523], [1396, 1523], [1407, 1519], [1416, 1510], [1420, 1501], [1420, 1379], [1416, 1370], [1407, 1361], [1396, 1357], [1284, 1357], [1269, 1351], [1252, 1350], [1232, 1357], [1191, 1357], [1180, 1361]] }], to: 'generate-screen-perk' },
        { n: 9, name: 'Generated Mons Per Element', at: [52, 1655], lit: [{ r: [92, 1609, 1346, 1701, 46] }] },
        { n: 10, name: 'Claim', text: 'Only 1 can be claimed', at: [504, 2120], lit: [{ p: [[489, 2129], [489, 2251], [493, 2260], [502, 2269], [519, 2273], [526, 2291], [537, 2302], [553, 2308], [885, 2308], [898, 2304], [912, 2291], [919, 2273], [932, 2273], [943, 2269], [952, 2260], [956, 2251], [956, 2129], [952, 2120], [943, 2111], [936, 2108], [513, 2107], [502, 2111], [493, 2120]] }] },
        { n: 11, name: 'Total Generated', at: [1055, 2118], lit: [{ p: [[1077, 2209], [1078, 2229], [1085, 2243], [1100, 2257], [1118, 2263], [1327, 2263], [1348, 2255], [1362, 2240], [1368, 2224], [1368, 2209], [1362, 2193], [1348, 2178], [1341, 2174], [1343, 2170], [1343, 2125], [1334, 2114], [1328, 2112], [1108, 2113], [1097, 2125], [1097, 2170], [1100, 2176], [1085, 2190]] }] },
      ],
      taps: [{ back: true, shape: { r: [12, 420, 223, 533, 26] }, label: 'Back' }],
    },
    'generate-screen-perk': {
      title: 'Generate Screen (Monpass Perk)', ver: '33.0', dim: false, parent: 'generate-screen', shot: 'screens/generate_screen_perk.png',
      items: [
        { n: 1, name: '2 Slots Left', text: 'Pick any 2 elements to generate from for free', at: [385, 1530], lit: [{ r: [424, 1489, 1013, 1571, 40] }] },
        { n: 2, name: 'Use Energy', at: [1125, 1440], lit: [{ p: [[1171, 1370], [1167, 1379], [1167, 1501], [1171, 1510], [1180, 1519], [1191, 1523], [1396, 1523], [1407, 1519], [1416, 1510], [1420, 1501], [1420, 1379], [1416, 1370], [1407, 1361], [1396, 1357], [1303, 1357], [1293, 1346], [1282, 1339], [1264, 1334], [1252, 1334], [1230, 1341], [1213, 1357], [1187, 1358], [1180, 1361]] }], back: true },
      ],
      taps: [{ to: 'gacha-ridora-lab', shape: { r: [12, 420, 223, 533, 26] }, label: 'Back' }],
    },
    'monspot': {
      title: 'Monspot (Outside Japan)', ver: '33.0', parent: 'home', toggle: MONSPOT_REGIONS, shot: 'screens/monspot_outside_japan.png',
      lit: [MONSPOT_MAP],
      intro: 'Uses GPS to track your real-life location and lets you acquire powers from Spots scattered across Japan.<br>No Spots exist outside of Japan!',
      note: '<span class="sec">First Entry Each Day</span>• 100 Gem Shards <span class="ref">3</span> are automatically converted to 1 orb (if you have enough). Once per day; <span class="ref">6</span> shows once you have it.<br>• A MySpot <span class="ref">7</span> is placed at your current location. Tap <span class="ref">5</span> to move it to where you are now.<br>• Items are collected from your MySpot.<br>• Your MySpot\'s power is slotted into your Main <span class="ref">1</span> and Sub Antenna <span class="ref">2</span>.<span class="sec">Daily Reset</span>• All Spots, including your MySpot, reset at 4AM (JP Time).',
      items: [
        { n: 1, name: 'Main Antenna', text: 'Active when you play solo or host any game', at: [93, 380], lit: [{ c: [93, 500, 78] }] },
        { n: 2, name: 'Sub Antenna', text: 'Active when you play co-op as guest', at: [258, 380], lit: [{ c: [258, 500, 78] }] },
        { n: 3, name: 'Gem Shards', text: 'Current Gem Shard count', at: [413, 380], lit: [{ p: [[335,492],[335,508],[338,523],[352,549],[374,568],[390,575],[405,578],[428,577],[444,572],[462,561],[478,544],[483,546],[644,546],[656,540],[662,533],[665,525],[665,475],[659,463],[650,456],[644,454],[483,454],[478,456],[462,439],[452,432],[436,425],[421,422],[405,422],[390,425],[364,439],[345,461],[338,477]] }] },
        { n: 4, name: 'Powers', at: [729, 380], lit: [{ r: [678, 449, 781, 553, 14] }], overlay: POWERS },
        { n: 5, name: 'Set MySpot to Current Location', at: [1120, 380], lit: [{ r: [1029, 432, 1211, 613, 26] }] },
        { n: 6, name: 'Today\'s Orb Collected', text: 'Shows if you collected today\'s free orb', at: [145, 780], lit: [{ p: [[0, 604], [330, 604], [296, 735], [0, 735]] }] },
        { n: 7, name: 'MySpot', text: 'Placed automatically at your current location each day', at: [600, 1100], lit: [{ p: [[702,1042],[680,1051],[667,1064],[659,1077],[652,1102],[652,1123],[661,1151],[634,1153],[627,1156],[618,1165],[614,1174],[614,1224],[618,1233],[627,1242],[642,1247],[640,1253],[640,1322],[646,1336],[661,1350],[652,1360],[645,1375],[644,1395],[649,1410],[666,1430],[682,1440],[706,1447],[731,1448],[757,1442],[777,1430],[785,1433],[789,1432],[822,1402],[823,1396],[789,1353],[768,1338],[776,1322],[776,1253],[774,1247],[793,1242],[805,1227],[805,1171],[802,1165],[789,1154],[755,1151],[764,1123],[764,1102],[757,1077],[749,1064],[733,1049],[714,1042]] }], to: 'spot' },
      ],
      taps: [],
    },
    'monspot-japan': {
      title: 'Monspot (In Japan)', ver: '33.0', parent: 'home', toggle: MONSPOT_REGIONS, shot: 'screens/monspot.png',
      lit: [MONSPOT_MAP],
      intro: 'Uses GPS to track your real-life location and lets you acquire powers from Spots scattered across Japan. Add your Main <span class="ref">1</span> or Sub Antenna <span class="ref">2</span> to a Spot to get its power.<br>No Spots exist outside of Japan!',
      note: '<span class="sec">First Entry Each Day</span>• 100 Gem Shards <span class="ref">3</span> are automatically converted to 1 orb (if you have enough). Once per day; <span class="ref">7</span> shows once you have it.<br>• A MySpot <span class="ref">12</span> is placed at your current location. Tap <span class="ref">5</span> to move it to where you are now.<br>• Items are collected from your MySpot.<br>• Your MySpot\'s power is slotted into your Main <span class="ref">1</span> and Sub Antenna <span class="ref">2</span>.<span class="sec">At Any Spot</span>• Place your Main <span class="ref">1</span> or Sub Antenna <span class="ref">2</span> (mix and match is OK) to acquire that Spot\'s power.<br>• Pick up items, including Gem Shards <span class="ref">3</span> and other useful items. With <span class="ref">8</span> ON, this happens automatically when you get close to any Spot.<span class="sec">Monspot Training Doors</span>• Approach a door <span class="ref">9</span> to deposit a monster for 24 hours. When complete, the monster is unlocked to Level 120 (equivalent of using a Super Level Scroll). Max 2 per day.<br>• A deposited monster can\'t be used until collected or cancelled <span class="ref">6</span><span class="sec">Daily Reset</span>• All Spots, including your MySpot, reset at 4AM (JP Time).',
      items: [
        { n: 1, name: 'Main Antenna', text: 'Active when you play solo or host any game', at: [93, 380], lit: [{ c: [93, 500, 78] }] },
        { n: 2, name: 'Sub Antenna', text: 'Active when you play co-op as guest', at: [258, 380], lit: [{ c: [258, 500, 78] }] },
        { n: 3, name: 'Gem Shards', text: 'Current Gem Shard count', at: [413, 380], lit: [{ p: [[335,492],[335,508],[338,523],[352,549],[374,568],[390,575],[405,578],[428,577],[444,572],[462,561],[478,544],[483,546],[644,546],[656,540],[662,533],[665,525],[665,475],[659,463],[650,456],[644,454],[483,454],[478,456],[462,439],[452,432],[436,425],[421,422],[405,422],[390,425],[364,439],[345,461],[338,477]] }] },
        { n: 4, name: 'Powers', at: [729, 380], lit: [{ r: [678, 449, 781, 553, 14] }], overlay: POWERS },
        { n: 5, name: 'Set MySpot to Current Location', at: [1120, 380], lit: [{ r: [1029, 432, 1211, 613, 26] }] },
        { n: 6, name: 'Check Monspot Training Status', at: [1315, 380], lit: [{ p: [[1231,441],[1225,453],[1225,559],[1212,560],[1205,567],[1205,615],[1210,621],[1418,622],[1424,617],[1425,567],[1418,560],[1407,559],[1407,453],[1404,445],[1398,438],[1386,432],[1246,432],[1238,435]] }], to: 'training-status' },
        { n: 7, name: 'Today\'s Orb Collected', text: 'Shows if you collected today\'s free orb', at: [145, 780], lit: [{ p: [[0, 604], [330, 604], [296, 735], [0, 735]] }] },
        { n: 8, name: 'Auto-Collect Items', text: 'When ON, items are picked up automatically when you get close to any Spot', at: [545, 780], lit: [{ p: [[330, 604], [798, 604], [820, 640], [778, 735], [296, 735]] }] },
        { n: 9, name: 'Monspot Training Door', text: 'Approach one to deposit a monster for 24 hours', at: [845, 850], lit: [{ r: [637, 782, 793, 943, 30] }] },
        { n: 10, name: 'Monspot (no powers)', text: 'No aura indicates this spot has no power (You can still get items)', at: [250, 985], lit: [{ r: [307, 903, 448, 1072, 50] }], to: 'spot' },
        { n: 11, name: 'Balloon', text: 'Tap to pop it and get a random item!', at: [1080, 945], lit: [{ p: [[1219,1007],[1201,998],[1182,993],[1155,992],[1143,994],[1122,1001],[1105,1011],[1089,1025],[1077,1041],[1068,1059],[1062,1085],[1062,1105],[1066,1125],[1074,1144],[1089,1165],[1120,1189],[1112,1215],[1086,1239],[1048,1245],[1036,1254],[1034,1267],[1043,1279],[1056,1281],[1104,1271],[1144,1234],[1156,1198],[1187,1196],[1214,1186],[1235,1171],[1253,1149],[1262,1131],[1267,1112],[1268,1085],[1266,1073],[1259,1052],[1249,1035],[1235,1019]] }] },
        { n: 12, name: 'MySpot', text: 'Placed automatically at your current location each day', at: [580, 1270], lit: [{ p: [[783,1177],[768,1180],[752,1187],[729,1207],[717,1228],[713,1242],[712,1266],[714,1281],[701,1283],[693,1287],[681,1300],[670,1307],[656,1323],[646,1346],[644,1375],[649,1395],[656,1409],[670,1425],[680,1432],[704,1440],[718,1440],[736,1435],[742,1470],[768,1478],[812,1478],[838,1470],[850,1408],[885,1407],[893,1403],[903,1392],[906,1383],[906,1307],[903,1298],[893,1287],[881,1282],[867,1281],[870,1266],[869,1242],[865,1228],[853,1207],[840,1194],[822,1183],[806,1178]] }], to: 'spot' },
        { n: 13, name: 'Monspot (with powers)', text: 'A blue aura indicates this spot has a power you can use', at: [348, 2108], lit: [{ r: [280, 2147, 416, 2338, 50] }], to: 'spot' },
        { n: 14, name: 'Monspot (collected)', text: 'A blackened top shows you\'ve already collected items from this spot within the last 10 minutes', at: [738, 2158], lit: [{ r: [667, 2202, 808, 2398, 50] }], to: 'spot' },
      ],
      taps: [],
    },
    'training-status': {
      title: 'Training Status', ver: '33.0', dim: false, parent: 'monspot-japan', shot: 'screens/training_status.png', view: [204, 818, 1236, 2038],
      intro: 'Shows time remaining until complete (Max 2 per day)',
      items: [
        { n: 1, name: 'Speed Up', at: [300, 1600], lit: [{ r: [289, 1592, 678, 1720, 26] }], to: 'speed-up' },
        { n: 2, name: 'Cancel Training', at: [773, 1600], lit: [{ r: [762, 1592, 1150, 1720, 26] }] },
        { n: 3, name: 'Close', at: [548, 1830], lit: [{ r: [537, 1822, 905, 1973, 28] }], back: true },
      ],
      taps: [],
    },
    'speed-up': {
      title: 'Speed Up', ver: '33.0', dim: false, parent: 'training-status', shot: 'screens/speed_up.png', view: [66, 680, 1374, 2172],
      intro: 'It costs 1 Staminamin to reduce the wait by 1 hour',
      items: [
        { n: 1, name: 'Yes', at: [300, 1925], lit: [{ p: [[80,2029],[82,2062],[95,2090],[108,2104],[118,2111],[140,2118],[153,2118],[169,2113],[467,2113],[482,2107],[491,2097],[495,2087],[495,1990],[491,1980],[482,1970],[467,1964],[159,1964],[140,1962],[118,1969],[99,1985],[86,2006]] }] },
        { n: 2, name: 'No', at: [962, 1978], lit: [{ r: [947, 1964, 1313, 2113, 28] }], back: true },
      ],
      taps: [],
    },
    'spot': {
      title: 'Spot', ver: '33.0', parent: 'monspot-japan', shot: 'screens/spot.png',
      lit: [{ c: [862, 1535, 225] }],
      items: [
        { n: 1, name: 'Power', at: [60, 690], lit: [{ r: [0, 462, 656, 640, 16] }], overlay: POWERS, button: 'Details' },
        { n: 2, name: 'Earn Items again in...', at: [880, 520], lit: [{ r: [925, 432, 1163, 640, 20] }] },
        { n: 3, name: 'Change Powers', at: [1290, 690], lit: [{ r: [1174, 444, 1400, 636, 24] }], to: 'change-powers' },
      ],
      taps: [],
    },
    'change-powers': {
      title: 'Change Powers', ver: '33.0', dim: false, parent: 'spot', shot: 'screens/change_powers.png', view: [24, 940, 1416, 1916],
      intro: 'Do you want to use these powers?',
      items: [
        { n: 1, name: 'Main Antenna', at: [140, 1190], lit: [{ r: [122, 1145, 668, 1510, 18] }] },
        { n: 2, name: 'Sub Antenna', at: [750, 1190], lit: [{ r: [730, 1145, 1268, 1510, 18] }] },
        { n: 3, name: 'Yes', at: [100, 1712], lit: [{ r: [87, 1707, 455, 1853, 28] }] },
        { n: 4, name: 'No', at: [1000, 1712], lit: [{ r: [987, 1707, 1355, 1853, 28] }], back: true },
      ],
      taps: [],
    },
    'shortcut-settings': {
      title: 'Shortcut Settings', ver: '33.0', dim: false, parent: 'home', shot: 'screens/shortcut_settings.png', view: [42, 614, 1398, 2242],
      intro: 'Choose where the shortcut takes you',
      note: '※The default depends on the quest type, so the setting may switch depending on the last played quest',
      items: [
        { n: 1, name: 'Shortcut', text: 'Takes you to the <b class="cyan">entry</b> of the area for your last played quest', at: [103, 968], lit: [{ r: [95, 960, 1345, 1334, 12] }] },
        { n: 2, name: 'Super Shortcut', text: 'Takes you directly to the <b class="yellow">team select screen</b> for your last played quest', at: [103, 1361], lit: [{ r: [95, 1353, 1345, 1725, 12] }] },
        { n: 3, name: 'OK', at: [548, 2036], lit: [{ r: [533, 2023, 907, 2177, 28] }], back: true },
      ],
      taps: [],
    },
    'more-options': {
      title: 'More Options', ver: '33.0', dim: false, parent: 'home', shot: 'screens/more_options.png', view: [14, 712, 1426, 2158],
      items: [
        { n: 1, name: 'Official Info', text: 'Contains all the official SNS accounts', at: [229, 1220], lit: [{ r: [65, 896, 392, 1174, 22] }] },
        { n: 2, name: 'Dictionary', text: 'Opens browser to the Official Dictionary website (External Link)', at: [557, 1220], lit: [{ r: [393, 896, 720, 1174, 22] }] },
        { n: 3, name: 'Help', text: 'Opens the in-game help pages<br>[No Translations Planned]', at: [884, 1220], lit: [{ r: [720, 896, 1047, 1174, 22] }] },
        { n: 4, name: 'Return to Title', text: 'Returns to the title animation', at: [229, 1651], lit: [{ r: [65, 1327, 392, 1605, 22] }] },
        { n: 5, name: 'Options', at: [557, 1651], lit: [{ r: [393, 1327, 720, 1605, 22] }] },
        { n: 6, name: 'Data Backup', at: [884, 1651], lit: [{ r: [720, 1327, 1047, 1605, 22] }], to: 'data-backup' },
        { n: 7, name: 'Other', text: '[No Translations Planned]', at: [1210, 1651], lit: [{ r: [1046, 1327, 1373, 1605, 22] }] },
      ],
      taps: [{ to: 'home', shape: { c: [721, 2020, 89] }, label: 'Close' }],
    },
    'data-backup': {
      title: 'Data Backup', ver: '33.0', dim: false, parent: 'more-options', shot: 'screens/data_backup.png',
      items: [
        { n: 1, name: 'Important Notes (Legalese)', text: 'Opens a webpage', at: [128, 618], lit: [{ r: [88, 602, 1345, 788, 16] }] },
        { n: 2, name: 'Link / Back Up', text: 'Shows the Backup popup', at: [128, 862], lit: [{ r: [88, 847, 1345, 1037, 16] }], to: 'backup' },
      ],
      taps: [{ back: true, shape: { r: [12, 419, 222, 532, 26] }, label: 'Back' }],
    },
    'backup': {
      title: 'Backup', ver: '33.0', dim: false, parent: 'data-backup', shot: 'screens/backup.png', view: [64, 760, 1382, 2292],
      items: [
        { n: 1, name: 'Backup', text: 'Backing up lets you transfer your data if you delete the app or change devices.<br><b class="warn">Never share your MIXI ID or verification code.</b><br>A MIXI ID is required.', at: [150, 870], lit: [{ r: [98, 932, 1342, 2043, 20] }] },
        { n: 2, name: 'Yes', text: 'Opens the backup webpage', at: [150, 2095], lit: [{ r: [126, 2081, 493, 2227, 20] }] },
        { n: 3, name: 'No', at: [973, 2095], lit: [{ r: [949, 2081, 1317, 2227, 20] }], back: true },
      ],
      taps: [],
    },
  },
};
