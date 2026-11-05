// Every page of the guide. Hand-edited; coordinates are pixels on the page's screenshot (1440 wide).
// Shapes: {c:[cx,cy,r]} circle, {e:[x0,y0,x1,y1]} ellipse, {r:[x0,y0,x1,y1,radius]} rounded box, {p:[[x,y],...]} polygon.
// A page: title, ver (game version of the screenshot), shot, optional view (crop [x0,y0,x1,y1]), parent, optional badge (tab letter),
//   marks (badges drawn on the screenshot), lit (always lit, not explained), optional intro / note (HTML above / below the items),
//   items (numbered, in screen order) and taps (unnumbered tap areas such as close / back buttons).
// A tap: {to: page} or {back: true} (goes to the parent page), shape, label.
// An item: n, name, text (HTML, optional), at (callout center), lit (shapes; also its tap area), to (page it opens, optional)
//   or back: true (goes to the parent page; no Open button), tap (with to: only this area opens the page; the rest of lit just selects the item).
window.SITE = {
  title: 'English Monst UI Guide',
  start: 'home',
  menu: ['home', 'shortcut-settings', 'more-options', 'data-backup', 'backup'],
  pages: {
    'home': {
      title: 'Home Screen', ver: '33.0', badge: 'A', parent: null, shot: 'screens/home.png',
      lit: [{ r: [0, 2476, 1440, 2825, 0] }],
      marks: [{ badge: 'A', at: [123, 2735] }],
      items: [
        { n: 1, name: 'More Options', at: [1250, 489], lit: [{ c: [1327, 557, 87] }], to: 'more-options' },
        { n: 2, name: 'Notices', text: 'Current notices or news', at: [1250, 713], lit: [{ c: [1327, 781, 87] }] },
        { n: 3, name: 'Gift Box', text: 'In-game presents can be collected here. Tap the blue button to delete all messages', at: [1250, 937], lit: [{ c: [1327, 1005, 87] }] },
        { n: 4, name: 'Gacha Ridora Lab', at: [44, 1217], lit: [{ p: [[77, 1178], [71, 1181], [63, 1191], [62, 1216], [44, 1233], [30, 1255], [15, 1269], [9, 1283], [9, 1312], [13, 1323], [18, 1329], [18, 1434], [28, 1453], [41, 1464], [59, 1470], [101, 1470], [109, 1478], [115, 1480], [167, 1479], [177, 1470], [188, 1470], [206, 1464], [219, 1453], [227, 1440], [230, 1430], [230, 1331], [237, 1323], [241, 1312], [240, 1279], [235, 1269], [224, 1258], [215, 1253], [202, 1233], [183, 1216], [183, 1194], [179, 1186], [171, 1179], [164, 1177]] }] },
        { n: 5, name: 'Campaigns', text: 'Active campaigns or Limited Time Events', at: [49, 1645], lit: [{ r: [17, 1592, 1428, 1870, 130] }] },
        { n: 6, name: 'Monspot', at: [88, 1930], lit: [{ r: [67, 1911, 434, 2114, 22] }] },
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
    'shortcut-settings': {
      title: 'Shortcut Settings', ver: '33.0', parent: 'home', shot: 'screens/shortcut_settings.png', view: [20, 600, 1420, 2260],
      lit: [{ r: [165, 830, 1276, 910, 12] }, { r: [133, 1793, 1193, 1928, 12] }],
      intro: 'Choose where the shortcut takes you',
      note: '※The default depends on the quest type, so the setting may switch depending on the last played quest',
      items: [
        { n: 1, name: 'Shortcut', text: 'Takes you to the <b class="cyan">entry</b> of the area for your last played quest', at: [103, 968], lit: [{ r: [95, 960, 1345, 1334, 12] }] },
        { n: 2, name: 'Super Shortcut', text: 'Takes you directly to the <b class="yellow">team select screen</b> for your last played quest', at: [103, 1361], lit: [{ r: [95, 1353, 1345, 1725, 12] }] },
      ],
      taps: [{ to: 'home', shape: { r: [540, 2027, 904, 2170, 20] }, label: 'OK' }],
    },
    'more-options': {
      title: 'More Options', ver: '33.0', parent: 'home', shot: 'screens/more_options.png', view: [10, 700, 1430, 2175],
      items: [
        { n: 1, name: 'Official Info', text: 'Contains all the official SNS accounts', at: [229, 1220], lit: [{ r: [65, 896, 392, 1174, 22] }] },
        { n: 2, name: 'Dictionary', text: 'Opens browser to the Official Dictionary website (External Link)', at: [557, 1220], lit: [{ r: [393, 896, 720, 1174, 22] }] },
        { n: 3, name: 'Help', text: 'Opens the in-game help pages<br>[No Translations Planned]', at: [884, 1220], lit: [{ r: [720, 896, 1047, 1174, 22] }] },
        { n: 4, name: 'Return to Title', text: 'Returns to the title animation', at: [229, 1651], lit: [{ r: [65, 1327, 392, 1605, 22] }] },
        { n: 5, name: 'Options', at: [557, 1651], lit: [{ r: [393, 1327, 720, 1605, 22] }] },
        { n: 6, name: 'Data Backup', at: [884, 1651], lit: [{ r: [720, 1327, 1047, 1605, 22] }], to: 'data-backup' },
        { n: 7, name: 'Other', text: '[No Translations Planned]', at: [1210, 1651], lit: [{ r: [1046, 1327, 1373, 1605, 22] }] },
      ],
      taps: [{ to: 'home', shape: { c: [721, 2021, 80] }, label: 'Close' }],
    },
    'data-backup': {
      title: 'Data Backup', ver: '33.0', parent: 'more-options', shot: 'screens/data_backup.png',
      items: [
        { n: 1, name: 'Important Notes (Legalese)', text: 'Opens a webpage', at: [128, 618], lit: [{ r: [88, 602, 1345, 788, 16] }] },
        { n: 2, name: 'Link / Back Up', text: 'Shows the Backup popup', at: [128, 862], lit: [{ r: [88, 847, 1345, 1037, 16] }], to: 'backup' },
      ],
      taps: [{ back: true, shape: { r: [13, 419, 220, 534, 20] }, label: 'Back' }],
    },
    'backup': {
      title: 'Backup', ver: '33.0', parent: 'data-backup', shot: 'screens/backup.png', view: [40, 740, 1400, 2310],
      items: [
        { n: 1, name: 'Backup', text: 'Backing up lets you transfer your data if you delete the app or change devices.<br><b class="warn">Never share your MIXI ID or verification code.</b><br>A MIXI ID is required.', at: [150, 870], lit: [{ r: [98, 932, 1342, 2043, 20] }] },
        { n: 2, name: 'Yes', text: 'Opens the backup webpage', at: [150, 2095], lit: [{ r: [126, 2081, 493, 2227, 20] }] },
        { n: 3, name: 'No', at: [973, 2095], lit: [{ r: [949, 2081, 1317, 2227, 20] }], back: true },
      ],
      taps: [],
    },
  },
};
