let turn: string = 'X'
let game_type: number = 3
let total_turns: number = 0
let robot: boolean = true
let finished: boolean = false

let selections: { [key: string]: number[] } = {};
selections['X'] = [];
selections['O'] = [];

let scores: { [key: string]: number } = {};
scores['X'] = 0;
scores['O'] = 0;
scores['D'] = 0;

function resetParams() {
  turn = 'X';
  total_turns = 0;
  robot = true;
  finished = false;
  selections['X'] = [];
  selections['O'] = [];
}

function generateGame(): void {

  // Reset การตั้งค่าทั้งหมด
  resetParams();

  // รับค่า การตั้งค่าเกม ขนาดตาราง 3x3 4x4 5x5
  const gameTypeInput = document.getElementById('game_type') as HTMLInputElement;
  game_type = Number(gameTypeInput.value);


  // ตรวจสอบการเปิดปิดการเล่นกับBot
  const robot_object = document.getElementById('robot') as HTMLInputElement;
  if (robot_object.checked === true) robot = true;
  else robot = false;

  // ล้างค่าทุกอย่างบนตาราง
  const gameBoard = document.getElementById('game-board') as HTMLElement;
  gameBoard.innerHTML = '';



  // สร้างตาราง ตามขนาดที่เลือก
  for (let row = 1; row <= game_type; row++) {
    for (let col = 1; col <= game_type; col++) {
      let unique_name = 'grid-' + row + '-' + col;
      let unique_id = row + '' + col;
      let button = document.createElement("input");

      button.setAttribute("value", ' ');
      button.setAttribute("id", unique_id);
      button.setAttribute("name", unique_name);
      button.setAttribute("class", 'grid-box');
      button.setAttribute("type", 'button');
      button.setAttribute("onclick", "markCheck(this)");
      document.getElementById('game-board')!.appendChild(button);
    }

    let breakline = document.createElement("br");
    document.getElementById('game-board')!.appendChild(breakline);
  }
}

// สลับฝั่ง
function changeTurn() {
  if (turn == 'X') {
    turn = 'O'
  } else turn = 'X';
}


// รูปแบบการชนะของแต่ละแบบ
function winnerPatterns() {
  var wins = Array();

  // 3 x 3 winning patterns
  if (game_type == 3) wins = [
    [11, 12, 13], [21, 22, 23], [31, 32, 33],
    [11, 21, 31], [12, 22, 32], [13, 23, 33],
    [11, 22, 33], [13, 22, 31]
  ];


  // 4 x 4 winning patterns
  if (game_type == 4) wins = [
    [11, 12, 13, 14], [21, 22, 23, 24], [31, 32, 33, 34], [41, 42, 43, 44],
    [11, 21, 31, 41], [12, 22, 32, 42], [13, 23, 33, 43], [14, 24, 34, 44],
    [14, 23, 32, 41], [11, 22, 33, 44]
  ];


  // 5 x 5 winning patterns
  if (game_type == 5) wins = [
    [11, 12, 13, 14, 15], [21, 22, 23, 24, 25], [31, 32, 33, 34, 35], [41, 42, 43, 44, 45], [51, 52, 53, 54, 55],
    [11, 21, 31, 41, 51], [12, 22, 32, 42, 52], [13, 23, 33, 43, 53], [14, 24, 34, 44, 54], [15, 25, 35, 45, 55],
    [11, 22, 33, 44, 55], [15, 24, 33, 42, 51]
  ];

  return wins
}

// รูปแบบการลงของBot จะเป็นตามสูตรการเล่น
function DefaultRobotPatterns() {
  let robot_turns = Array();

  // 3 x 3 winning patterns;
  if (game_type == 3) robot_turns = [22, 11, 33, 13, 21, 23, 12, 32, 31];


  // 4 x 4 winning patterns;
  if (game_type == 4) robot_turns = [11, 22, 33, 44, 14, 13, 12, 21, 31, 41, 42, 43, 24, 34, 32, 23];


  // 5 x 5 winning patterns;
  if (game_type == 5) robot_turns = [11, 22, 33, 44, 55, 15, 14, 13, 12, 51, 41, 31, 21, 35, 45, 25, 53, 52, 54, 42, 43, 32, 34, 23, 24];

  return robot_turns
}


// CheckWin ตรวจสอบว่าได้ผู้ชนะหรือไม่
function checkWinner(): void {
  const selected: number[] = selections[turn].sort();
  const win_patterns: number[][] = winnerPatterns();

  let finished: boolean = false;

  for (let x = 0; x < win_patterns.length; x++) {

    if (!finished) {
      finished = isWinner(win_patterns[x], selections[turn]);

      if (finished) {

        // Update คะแนน
        scoreUpdate(turn);

        // เมื่อเกมจบทำการปิดไม่สามารถเลือกลงต่อได้
        disableAllBoxes();

        alert(`Player ${turn} Won !!`);

        break;
      }
    }
  }



  // ถ้าช่องเต็มหมดและไม่มีใครชนะประกาศว่า "เสมอ"
  if ((total_turns == (game_type * game_type)) && finished === false) {
    alert('Game Draw!');
    finished = true;
    disableAllBoxes();
    scoreUpdate('D')
  }
}

// ตรวจสอบว่ามีผู้ชนะรึยัง
function isWinner(win_pattern: any[], selections: any[]): boolean {
  let match = 0;

  for (let x = 0; x < win_pattern.length; x++) {
    for (let o = 0; o < selections.length; o++) {
      if (win_pattern[x] == selections[o]) {
        match++;
      }
    }
  }

  if (match == win_pattern.length) {
    return true;
  }

  return false;
}


// ปิดไม่ให้ลงต่อ เมื่อมีผู้ชนะ หรือเสมอ
function disableAllBoxes(): void {
  const elements = document.getElementsByClassName("grid-box");
  for (let i = 0; i < elements.length; i++) {
    (elements[i] as HTMLInputElement).disabled = true;
  }
}

// รีเซ็ทการตั้งค่าบอทให้เป็น true
function resetAIButton(): void {
  const checkbox = document.getElementById('robot') as HTMLInputElement;
  checkbox.checked = true;
}

// ตรวจสอบตำแหน่งการลง และCheckWin ทุกครั้ง ก่อนสลับฝั่ง
function markCheck(obj: HTMLInputElement): void {
  obj.value = turn;
  total_turns++;
  if (turn == 'X') {
    obj.setAttribute("class", 'x-player');
  } else {
    obj.setAttribute("class", 'o-player');
  }
  obj.setAttribute("disabled", 'disabled');
  selections[turn].push(Number(obj.id));
  checkWinner();
  changeTurn();
  // if auto player selected
  if (robot === true) autoTurn();
}



// เปิดAuto ให้บอทลลงเมื่อจบเทิรน์ของ X หรือผู้เล่น
function autoTurn(again: boolean = false): boolean {
  let is_empty_result = true;

  if (turn === 'X' || finished === true) {
    return false;
  }

  // Bot จะมองหาที่ลงตามแบบหรือสูตร ที่ใกล้เคียงที่สุด
  let robot_pattern: string[] = [];
  if (again) {
    robot_pattern = DefaultRobotPatterns();
  } else {
    robot_pattern = getAutoTurnPattern();
  }


  for (let x = 0; x < robot_pattern.length; x++) {
    const desired_obj = document.getElementById(robot_pattern[x]) as HTMLInputElement;
    if (desired_obj.value == '' || desired_obj.value == ' ') {
      markCheck(desired_obj);
      is_empty_result = false;
      break;
    }
  }

  return is_empty_result;
}

// ตรวจสอบการลงของX แล้วเปรียบเทียบกับสูตร
function getAutoTurnPattern(): string[] {
  let pattern: string[] = [];
  pattern = getMostNearestPattern('O');

  if (pattern.length <= 0) {
    pattern = getMostNearestPattern('X');
    if (pattern.length <= 0) {
      pattern = DefaultRobotPatterns();
    }
  }

  return pattern;
}


// หาจุดลงที่ใกล้เคียงกับในสูตร 
function getMostNearestPattern(turn: string): string[] {
  let matches: number = 0;
  let selected: number[] = selections[turn].sort();
  let win_patterns: string[][] = winnerPatterns();
  let finished: boolean = false;

  for (let x = 0; x < win_patterns.length; x++) {
    let intersected = intersectionArray(selected, win_patterns[x]);

    if (intersected.length === win_patterns[x].length - 1) {
      // if any position is found empty then return that pattern; otherwise will check another one from list
      for (let o = 0; o < win_patterns[x].length; o++) {
        let obj = document.getElementById(win_patterns[x][o]) as HTMLInputElement;
        if (obj.value === '' || obj.value === ' ') {
          // Return pattern if got an empty; otherwise will match others 
          return win_patterns[x];
        }
      }
    }
  }
  return [];
}

// เก็บตำแหน่งที่Xลงเพื่อนำไปเปรียบเทียบในสูตร
function intersectionArray(x: any[], o: any[]): any[] {
  const response: any[] = [];
  for (let i = 0; i < x.length; i++) {
    for (let z = 0; z < o.length; z++) {
      if (x[i] == o[z]) {
        response.push(x[i]);
        break;
      }
    }
  }
  return response;
}

//นับคะแนน และ รีเซ็ท
function scoreUpdate(turn: string): void {
  scores[turn]++;
  document.getElementById(`score-${turn}`)!.innerHTML = String(scores[turn]);
}

function resetScore(): void {
  window.location.reload();
}






