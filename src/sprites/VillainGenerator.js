export function generateVillains(scene) {
  const drawPixelArt = (key, width, height, colors, pixels) => {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const scale = 3; // 3x scale internally
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = pixels[y][x];
        if (p !== ' ') {
          ctx.fillStyle = colors[p] || '#000000';
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    scene.textures.addCanvas(key, canvas);
  };

  // 1. Loki (Highly detailed 24x24)
  const cLoki = { 'G': '#005522', 'L': '#008833', 'Y': '#FFCC00', 'D': '#BBAA00', 'S': '#AABBCC', 'B': '#111111', 'F': '#FFDABB' };
  const pLoki = [
    "      DD    DD      ",
    "     DDD    DDD     ",
    "     YDY    YDY     ",
    "    YYDYY  YYDYY    ",
    "    YYD YYYY DYY    ",
    "    YYDDYYYYDDYY    ",
    "     YDYGGGGYDY     ",
    "     YY GGG  YY     ",
    "      Y GBBG Y      ",
    "      Y YFFY Y      ",
    "        YYYY        ",
    "       GLLLLG       ",
    "      GGLLLLGG   S  ",
    "      GGYYYYGG   S  ",
    "     GGGLLLLGGG  S  ",
    "     LGGBBBBGG  SS  ",
    "     LLGBBBBGL  B   ",
    "     LLGBBBBGL  B   ",
    "     LL GGGG L  B   ",
    "     L  LLLL    B   ",
    "        L  L    B   ",
    "        G  G    B   ",
    "       BB  BB   B   ",
    "      BBB  BBB      "
  ];
  drawPixelArt('villain_1', 24, 24, cLoki, pLoki);

  // 2. Ultron (Highly detailed 24x24)
  const cUltron = { 'S': '#DDDDDD', 'D': '#888888', 'B': '#444444', 'R': '#FF0000', 'G': '#FF5555' };
  const pUltron = [
    "       BBBBBB       ",
    "      DDDDDDDD      ",
    "     DDSSSSSSDD     ",
    "     D SSSSSS D     ",
    "     D SRRRRS D     ",
    "     D SBBBB S D    ",
    "     D DRRRRD D     ",
    "      DDDBBDDD      ",
    "       BDDDDB       ",
    "      DDBBBBDD      ",
    "     DDBBSSBBDD     ",
    "    DD BBSSBB DD    ",
    "    D  BBSSBB  D    ",
    "   DD  BBSSBB  DD   ",
    "   S   BBSSBB   S   ",
    "       BBSSBB       ",
    "       BDDDBB       ",
    "       B DD B       ",
    "       B DD B       ",
    "      D  DD  D      ",
    "      D  D   D      ",
    "      D  D   D      ",
    "     DD DD  DD      ",
    "     DD DD  DD      "
  ];
  drawPixelArt('villain_2', 24, 24, cUltron, pUltron);

  // 3. Mysterio (Highly detailed 24x24)
  const cMyst = { 'G': '#00AA55', 'L': '#00FF88', 'P': '#8800CC', 'D': '#550088', 'W': '#CCFFFF', 'C': '#55AAAA', 'Y': '#FFCC00' };
  const pMyst = [
    "       CCCCCC       ",
    "      CCWWWWCC      ",
    "     CWWWWWWWC      ",
    "    CWWWWWWWWWC     ",
    "    CWWWWWWWWWC     ",
    "    CWWWWWWWWWC     ",
    "     CWWWWWWWC      ",
    "      CCCCCCC       ",
    "    PP  YYY  PP     ",
    "   PP D LLG D PP    ",
    "   P DD GGG DD P    ",
    "   P D  GGG  D P    ",
    "   P D  GGG  D P    ",
    "  PP D  GGG  D PP   ",
    "  P     GGG     P   ",
    "  P     GGG     P   ",
    "        LLL         ",
    "        G G         ",
    "        G G         ",
    "       GG GG        ",
    "       G   G        ",
    "       G   G        ",
    "      GG   GG       ",
    "      GG   GG       "
  ];
  drawPixelArt('villain_3', 24, 24, cMyst, pMyst);

  // 4. Killmonger (Highly detailed 24x24)
  const cKill = { 'B': '#111111', 'D': '#333333', 'Y': '#FFCC00', 'G': '#FFAA00' };
  const pKill = [
    "       B    B       ",
    "      BDB  BDB      ",
    "     BBDDBBBDBB     ",
    "     BDYYYYYYDB     ",
    "     BD YYYY DB     ",
    "     BBDYGGYDBB     ",
    "      BDYYYYDB      ",
    "      BDDDDDDB      ",
    "       BDYYDB       ",
    "      BDDYYDDB      ",
    "     BBDDYYDDBB     ",
    "    BBDD Y Y DDB    ",
    "    B D  Y Y  D B   ",
    "    B D  Y Y  D B   ",
    "   BB D  Y Y  D BB  ",
    "      D BY YB D     ",
    "      B BD DB B     ",
    "      B  D D  B     ",
    "         D D        ",
    "         D D        ",
    "        BD DB       ",
    "        B   B       ",
    "       DB   BD      ",
    "      YDB   BDY     "
  ];
  drawPixelArt('villain_4', 24, 24, cKill, pKill);

  // 5. Red Skull (Highly detailed 24x24)
  const cSkull = { 'R': '#FF0000', 'D': '#990000', 'G': '#334433', 'B': '#111111', 'W': '#FFFFFF' };
  const pSkull = [
    "       BBBBBB       ",
    "      BBBBBBBB      ",
    "     DDDDDDDDDD     ",
    "     DRRRRRRRRD     ",
    "     DR W  W RD     ",
    "     DR RRRR RD     ",
    "      DRRRRRRD      ",
    "       DRRDRD       ",
    "      GGBBBBGG      ",
    "     GGGBBBBBBGG    ",
    "    GGG BBBBBB GGG  ",
    "    G G BBBBBB G G  ",
    "    G G BBBBBB G G  ",
    "   GG G BBBBBB G GG ",
    "   B    BBBBBB    B ",
    "        BB  BB      ",
    "        BB  BB      ",
    "        BB  BB      ",
    "       BBB  BBB     ",
    "       B      B     ",
    "       B      B     ",
    "      BB      BB    ",
    "      BB      BB    ",
    "     BBB      BBB   "
  ];
  drawPixelArt('villain_5', 24, 24, cSkull, pSkull);

  // 6. Thanos (Highly detailed 24x24)
  const cThanos = { 'P': '#8800CC', 'D': '#550088', 'Y': '#FFCC00', 'G': '#FFAA00', 'B': '#222255', 'R':'#FF0000' };
  const pThanos = [
    "      YYYYYYYY      ",
    "     YYPPPPPPYY     ",
    "     Y P DD P Y     ",
    "     Y P    P Y     ",
    "     Y DYYYYD Y     ",
    "      DPPPPPPD      ",
    "      D YYYY D      ",
    "    YYYYYYYYYYYY    ",
    "   YYY BB  BB YYY   ",
    "  YYY  BB  BB  YYY  ",
    "  YYY  BB  BB   RY  ",
    "  Y Y  BB  BB   BY  ",
    "  Y Y  BB  BB   YY  ",
    "  Y Y  BB  BB    Y  ",
    "   YY  YYYYYY       ",
    "       Y    Y       ",
    "       P    P       ",
    "       P    P       ",
    "       P    P       ",
    "      YP    PY      ",
    "      Y      Y      ",
    "      Y      Y      ",
    "     YY      YY     ",
    "    YYY      YYY    "
  ];
  drawPixelArt('villain_6', 24, 24, cThanos, pThanos);
}
