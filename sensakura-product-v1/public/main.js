
(function(){
"use strict";

window.addEventListener("error", function(e){
  var root=document.getElementById("app");
  if(root && !root.dataset.ready){
    root.innerHTML='<div style="max-width:820px;margin:40px auto;padding:24px;background:#fff;border:1px solid #ddd;border-radius:14px;font-family:system-ui"><h2>SenSakura gặp lỗi khi khởi động</h2><p>'+String(e.message||"Unknown error")+'</p><p>Hãy mở Console để xem chi tiết.</p></div>';
  }
});

const GRADES = ["10","11","12"];
const SUBJECTS = [
  {id:"math",name:"Toán",active:true},
  {id:"physics",name:"Vật lý",active:false},
  {id:"chemistry",name:"Hóa học",active:false},
  {id:"biology",name:"Sinh học",active:false},
  {id:"literature",name:"Ngữ văn",active:false},
  {id:"history",name:"Lịch sử",active:false},
  {id:"geography",name:"Địa lý",active:false}
];

const CURRICULUM = [
  {chapter:"I",title:"Mệnh đề và tập hợp",lessons:["Bài 1. Mệnh đề","Bài 2. Tập hợp và các phép toán trên tập hợp"]},
  {chapter:"II",title:"Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",lessons:["Bài 3. Bất phương trình bậc nhất hai ẩn","Bài 4. Hệ bất phương trình bậc nhất hai ẩn"]},
  {chapter:"III",title:"Hệ thức lượng trong tam giác",lessons:["Bài 5. Giá trị lượng giác của một góc từ 0° đến 180°","Bài 6. Hệ thức lượng trong tam giác"]},
  {chapter:"IV",title:"Vectơ",lessons:["Bài 7. Các khái niệm mở đầu","Bài 8. Tổng và hiệu của hai vectơ","Bài 9. Tích của một vectơ với một số","Bài 10. Vectơ trong mặt phẳng tọa độ","Bài 11. Tích vô hướng của hai vectơ"]},
  {chapter:"V",title:"Các số đặc trưng của mẫu số liệu không ghép nhóm",lessons:["Bài 12. Số gần đúng và sai số","Bài 13. Các số đặc trưng đo xu thế trung tâm","Bài 14. Các số đặc trưng đo độ phân tán"]},
  {chapter:"VI",title:"Hàm số, đồ thị và ứng dụng",lessons:["Bài 15. Hàm số","Bài 16. Hàm số bậc hai","Bài 17. Dấu của tam thức bậc hai","Bài 18. Phương trình quy về phương trình bậc hai"]},
  {chapter:"VII",title:"Phương pháp tọa độ trong mặt phẳng",lessons:["Bài 19. Phương trình đường thẳng","Bài 20. Vị trí tương đối, góc và khoảng cách","Bài 21. Đường tròn trong mặt phẳng tọa độ","Bài 22. Ba đường conic"]},
  {chapter:"VIII",title:"Đại số tổ hợp",lessons:["Bài 23. Quy tắc đếm","Bài 24. Hoán vị, chỉnh hợp và tổ hợp","Bài 25. Nhị thức Newton"]},
  {chapter:"IX",title:"Tính xác suất theo định nghĩa cổ điển",lessons:["Bài 26. Biến cố và định nghĩa cổ điển của xác suất","Bài 27. Thực hành tính xác suất theo định nghĩa cổ điển"]}
];

const TERMS = [
  {jp:"二次関数",reading:"にじかんすう",vi:"hàm số bậc hai"},
  {jp:"放物線",reading:"ほうぶつせん",vi:"parabol"},
  {jp:"頂点",reading:"ちょうてん",vi:"đỉnh"},
  {jp:"対称軸",reading:"たいしょうじく",vi:"trục đối xứng"},
  {jp:"増加",reading:"ぞうか",vi:"đồng biến / tăng"},
  {jp:"減少",reading:"げんしょう",vi:"nghịch biến / giảm"},
  {jp:"方程式",reading:"ほうていしき",vi:"phương trình"},
  {jp:"点を通る",reading:"てんをとおる",vi:"đi qua một điểm"}
];

const GRAMMAR = [
  {pattern:"～について",meaning:"về / liên quan đến ...",example:"この放物線について考えます。"},
  {pattern:"～を求めてください",meaning:"hãy tìm / xác định ...",example:"頂点を求めてください。"},
  {pattern:"～で増加する / 減少する",meaning:"đồng biến / nghịch biến trên ...",example:"x > 2 で増加します。"},
  {pattern:"点Aを通る",meaning:"đi qua điểm A",example:"この放物線は点Aを通ります。"}
];

const QUESTIONS = {
  grammar:{
    prompt:"Cấu trúc 「頂点を求めてください」 có nghĩa phù hợp nhất là gì?",
    answers:["Hãy tìm đỉnh","Hãy vẽ trục","Hãy tìm nghiệm","Đỉnh đang tăng"],
    correct:0,
    feedback:"「N を求めてください」 là cách yêu cầu lịch sự: hãy tìm/xác định N."
  },
  reading:{
    prompt:"関数 y = x² - 4x + 3 の放物線について、頂点と対称軸を求めてください。",
    support:"Đọc câu hỏi và chọn kết quả đúng. Có thể dùng Sổ từ nếu cần.",
    answers:["頂点 (2,-1), 対称軸 x=2","頂点 (-2,1), 対称軸 x=-2","頂点 (2,1), 対称軸 x=2","頂点 (4,3), 対称軸 x=4"],
    correct:0,
    feedback:"x=-b/(2a)=2; thay x=2 được y=-1. Vì vậy đỉnh là (2,-1), trục đối xứng x=2."
  }
};

const DEFAULT_STATE = {
  view:"home",
  grade:"10",
  subject:"math",
  lesson:"Bài 16. Hàm số bậc hai",
  lessonTab:"overview",
  knownTerms:{},
  grammarAnswer:null,
  readingAnswer:null,
  writingText:"",
  writingPassed:false,
  conversationStep:0,
  conversationMessages:[
    {who:"teacher",text:"この放物線の頂点はどこですか。"}
  ],
  speakingCompleted:false,
  errors:[],
  dna:{vocab:46,grammar:44,reading:42,writing:40,speaking:34},
  progress:{vocab:0,grammar:0,readingWriting:0,speaking:0},
  events:[]
};

let state=loadState();

function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem("sensakura-product-v1")||"null");
    if(!saved) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    return Object.assign({},DEFAULT_STATE,saved,{
      knownTerms:Object.assign({},DEFAULT_STATE.knownTerms,saved.knownTerms||{}),
      dna:Object.assign({},DEFAULT_STATE.dna,saved.dna||{}),
      progress:Object.assign({},DEFAULT_STATE.progress,saved.progress||{})
    });
  }catch(e){return JSON.parse(JSON.stringify(DEFAULT_STATE));}
}
function save(){localStorage.setItem("sensakura-product-v1",JSON.stringify(state));}
function track(type,data){
  state.events.push(Object.assign({time:new Date().toISOString(),type:type},data||{}));
  if(state.events.length>600) state.events=state.events.slice(-600);
  save();
}
function clamp(v){return Math.max(10,Math.min(100,v));}
function avgDNA(){var v=Object.values(state.dna);return Math.round(v.reduce((a,b)=>a+b,0)/v.length);}
function totalProgress(){return Math.round((state.progress.vocab+state.progress.grammar+state.progress.readingWriting+state.progress.speaking)/4);}

function navButton(id,label){
  return '<button data-view="'+id+'" class="'+(state.view===id?'active':'')+'">'+label+'</button>';
}
function render(){
  const root=document.getElementById("app");
  root.innerHTML=`
  <div class="app-shell">
    <div class="utility"><div class="utility-inner">
      <div class="utility-links"><span>Nền tảng ôn tập liên môn bằng tiếng Nhật</span><span>Chương trình THPT</span></div>
      <div>Phiên bản nghiên cứu 1.0</div>
    </div></div>

    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-mark">SS</div>
          <div><div class="brand-name">SenSakura</div><div class="brand-sub">Học bài cũ, luyện tiếng Nhật</div></div>
        </div>
        <div class="search">
          <input id="searchInput" placeholder="Tìm bài học, chương, từ khóa..." />
          <button class="search-btn" id="searchBtn">Tìm</button>
        </div>
        <div class="header-actions">
          <div class="profile-chip">Learning DNA <b>${avgDNA()}%</b></div>
        </div>
      </div>
      <div class="mainnav"><div class="mainnav-inner">
        ${navButton("home","Trang chủ")}
        ${navButton("catalog","Mục lục")}
        ${navButton("lesson","Bài học")}
        ${navButton("dna","Learning DNA")}
        ${navButton("errors","Sổ lỗi")}
      </div></div>
    </header>

    <div class="page">
      <div class="breadcrumb">
        <span>Trang chủ</span><span>/</span><strong>Lớp ${state.grade}</strong><span>/</span><strong>Toán</strong><span>/</span><strong>${state.lesson}</strong>
      </div>

      ${selectorBar()}

      <div class="layout">
        <aside class="left-column">${leftSidebar()}</aside>
        <main class="main-column">${mainView()}</main>
        <aside class="right-column">${rightSidebar()}</aside>
      </div>
    </div>

    <footer class="footer"><div class="footer-inner">
      <span>SenSakura — prototype nghiên cứu giáo dục</span>
      <span>Nội dung demo: Toán 10 Kết nối tri thức, Bài 16 Hàm số bậc hai</span>
    </div></footer>
  </div>`;
  root.dataset.ready="1";
  bind();
}

function selectorBar(){
  return `<div class="selector-bar">
    <div class="selector"><label>Khối lớp</label><select id="gradeSelect">
      ${GRADES.map(g=>`<option value="${g}" ${state.grade===g?'selected':''}>Lớp ${g}${g!=="10"?" — đang mở rộng":""}</option>`).join("")}
    </select></div>
    <div class="selector"><label>Môn học</label><select id="subjectSelect">
      ${SUBJECTS.map(s=>`<option value="${s.id}" ${state.subject===s.id?'selected':''}>${s.name}${!s.active?" — đang mở rộng":""}</option>`).join("")}
    </select></div>
    <div class="selector"><label>Bài học</label><select id="lessonSelect">
      ${CURRICULUM.flatMap(c=>c.lessons).map(l=>`<option ${l===state.lesson?'selected':''}>${l}${l!=="Bài 16. Hàm số bậc hai"?" — khóa":""}</option>`).join("")}
    </select></div>
    <button class="go-btn" id="openSelection">Mở bài</button>
  </div>`;
}

function leftSidebar(){
  return `<div class="card">
    <div class="side-section">
      <h3 class="side-title">Chọn lớp</h3>
      <div class="grade-pills">
        ${GRADES.map(g=>`<button class="grade-pill ${state.grade===g?'active':''}" data-grade="${g}">Lớp ${g}</button>`).join("")}
      </div>
    </div>
    <div class="side-section">
      <h3 class="side-title">Môn học</h3>
      <div class="subject-list">
        ${SUBJECTS.map(s=>`<button class="subject-btn ${s.id===state.subject?'active':''} ${!s.active?'locked':''}" data-subject="${s.id}">
          <span>${s.name}</span>${s.active?'<span class="mini-status">Đang mở</span>':'<span class="mini-status">Sắp có</span>'}
        </button>`).join("")}
      </div>
    </div>
    <div class="side-section">
      <h3 class="side-title">Toán 10 Kết nối tri thức</h3>
      <div class="chapter-nav">
        ${CURRICULUM.map(c=>`<button class="chapter-link ${c.chapter==="VI"?'active':''}" data-view="catalog">Chương ${c.chapter}. ${c.title}</button>`).join("")}
      </div>
    </div>
  </div>`;
}

function rightSidebar(){
  return `
  <div class="card progress-card">
    <h3>Tiến độ Bài 16</h3>
    <div class="progress-ring" style="--p:${totalProgress()}%"><b>${totalProgress()}%</b></div>
    <div class="mini-row"><span>Từ vựng</span><b>${state.progress.vocab}%</b></div>
    <div class="mini-row"><span>Ngữ pháp</span><b>${state.progress.grammar}%</b></div>
    <div class="mini-row"><span>Đọc & Viết</span><b>${state.progress.readingWriting}%</b></div>
    <div class="mini-row"><span>Giao tiếp</span><b>${state.progress.speaking}%</b></div>
  </div>
  <div class="card progress-card">
    <h3>Learning DNA</h3>
    ${dnaRowsCompact()}
    <button class="btn ghost" data-view="dna" style="width:100%;margin-top:8px">Xem chi tiết</button>
  </div>
  <div class="notice">
    Cá nhân hóa dựa trên đúng/sai, từ đã biết, kết quả viết và mức hoàn thành giao tiếp. Bản demo không dùng AI để chấm kiến thức Toán.
  </div>`;
}

function dnaRowsCompact(){
  const labels={vocab:"Từ vựng",grammar:"Ngữ pháp",reading:"Đọc",writing:"Viết",speaking:"Giao tiếp"};
  return Object.entries(state.dna).map(([k,v])=>`
    <div class="dna-row"><div class="dna-label"><span>${labels[k]}</span><b>${v}%</b></div><div class="bar"><div style="width:${v}%"></div></div></div>
  `).join("");
}

function mainView(){
  if(state.view==="home") return homeView();
  if(state.view==="catalog") return catalogView();
  if(state.view==="lesson") return lessonView();
  if(state.view==="dna") return dnaView();
  return errorsView();
}

function homeView(){
  return `
  <section class="card hero">
    <div class="eyebrow">Bài đang mở</div>
    <h1>Bài 16. Hàm số bậc hai</h1>
    <p>
      Ôn lại kiến thức Toán 10 đã học trên lớp bằng tiếng Nhật theo bốn mô-đun:
      Từ vựng, Ngữ pháp, Đọc & Viết và Giao tiếp. Mỗi mô-đun cập nhật một phần Learning DNA để nhiệm vụ sau phù hợp hơn với người học.
    </p>
    <div class="actions">
      <button class="btn primary" data-view="lesson">Tiếp tục học</button>
      <button class="btn ghost" data-view="catalog">Xem mục lục Toán 10</button>
    </div>
    <div class="stats">
      <div class="stat"><b>${totalProgress()}%</b><span>Tiến độ bài học</span></div>
      <div class="stat"><b>${avgDNA()}%</b><span>Learning DNA trung bình</span></div>
      <div class="stat"><b>${state.errors.length}</b><span>Nội dung cần ôn lại</span></div>
      <div class="stat"><b>4</b><span>Mô-đun kỹ năng</span></div>
    </div>
  </section>

  <div class="section-head"><div><h2>Học theo bốn mô-đun</h2><p>Chọn một mô-đun hoặc học theo thứ tự từ trái sang phải.</p></div></div>
  <section class="skill-cards">
    ${skillCard("vocab","01","Từ vựng","Thuật ngữ Toán bằng tiếng Nhật.",state.progress.vocab)}
    ${skillCard("grammar","02","Ngữ pháp","Mẫu câu dùng trong đề Toán.",state.progress.grammar)}
    ${skillCard("reading","03","Đọc & Viết","Đọc đề, giải bài và diễn đạt ngắn.",state.progress.readingWriting)}
    ${skillCard("speaking","04","Giao tiếp","Nghe câu hỏi và trả lời bằng tiếng Nhật.",state.progress.speaking)}
  </section>

  <div class="section-head"><div><h2>Cấu trúc sản phẩm</h2><p>Giao diện theo dạng cổng học tập: lớp → môn → chương → bài.</p></div></div>
  <section class="grid-placeholder">
    ${catalogPreview()}
  </section>`;
}

function skillCard(tab,index,title,desc,progress){
  return `<button class="skill-card ${state.lessonTab===tab?'active':''}" data-lesson-tab="${tab}" data-view="lesson">
    <div class="skill-index">${index}</div>
    <h4>${title}</h4><p>${desc}</p>
    <div class="skill-progress"><div style="width:${progress}%"></div></div>
  </button>`;
}

function catalogPreview(){
  return `<div class="card card-pad">
    <div class="section-head" style="margin:0 0 8px"><div><h3>Chương VI. Hàm số, đồ thị và ứng dụng</h3></div><button class="btn ghost" data-view="catalog">Mở mục lục</button></div>
    <div class="curriculum-grid">
      ${CURRICULUM[5].lessons.map(l=>lessonRow(l)).join("")}
    </div>
  </div>`;
}

function lessonRow(l){
  const active=l==="Bài 16. Hàm số bậc hai";
  return `<div class="lesson-row ${active?'active':'locked'}">
    <div class="lesson-info"><b>${l}</b><span>${active?'Nội dung demo đầy đủ: 4 mô-đun kỹ năng':'Nội dung đang mở rộng'}</span></div>
    <span class="lesson-tag ${active?'open':''}">${active?'Mở':'Khóa'}</span>
  </div>`;
}

function catalogView(){
  return `
  <div class="card card-pad">
    <div class="section-head" style="margin:0 0 10px"><div><h2>Toán 10 — Kết nối tri thức với cuộc sống</h2><p>Toàn bộ mục lục được hiển thị; Bài 16 là bài duy nhất mở đầy đủ trong bản demo.</p></div></div>
    <div class="curriculum-grid">
      ${CURRICULUM.map(c=>`
        <div class="chapter-card">
          <div class="chapter-head"><div><b>Chương ${c.chapter}. ${c.title}</b></div><span>${c.lessons.length} bài</span></div>
          ${c.lessons.map(l=>lessonRow(l)).join("")}
        </div>
      `).join("")}
    </div>
  </div>`;
}

function lessonView(){
  return `
  <section class="card">
    <div class="lesson-header">
      <div class="lesson-header-top">
        <div><span class="lesson-tag open">Đang mở</span><h1>Bài 16. Hàm số bậc hai</h1><p>Toán 10 Kết nối tri thức · Ôn tập qua tiếng Nhật · N5–N4 cơ bản</p></div>
        <button class="btn ghost" id="resetLesson">Đặt lại bài</button>
      </div>
    </div>
    <div class="lesson-tabs">
      ${lessonTabBtn("overview","Tổng quan")}
      ${lessonTabBtn("vocab","Từ vựng")}
      ${lessonTabBtn("grammar","Ngữ pháp")}
      ${lessonTabBtn("reading","Đọc & Viết")}
      ${lessonTabBtn("speaking","Giao tiếp")}
      ${lessonTabBtn("result","Kết quả")}
    </div>
    <div class="module">${lessonModule()}</div>
  </section>`;
}
function lessonTabBtn(id,label){return `<button data-lesson-tab="${id}" class="${state.lessonTab===id?'active':''}">${label}</button>`;}

function lessonModule(){
  if(state.lessonTab==="overview") return overviewModule();
  if(state.lessonTab==="vocab") return vocabModule();
  if(state.lessonTab==="grammar") return grammarModule();
  if(state.lessonTab==="reading") return readingWritingModule();
  if(state.lessonTab==="speaking") return speakingModule();
  return resultModule();
}

function overviewModule(){
  return `
  <div class="module-title"><div><h2>Mục tiêu Bài 16</h2><p>Ôn kiến thức Toán đã học, đồng thời tạo ngữ cảnh thực tế để sử dụng tiếng Nhật học thuật.</p></div></div>
  <div class="grid-modules">
    <div class="criteria">
      ${criterion("Mục tiêu Toán","Nhận biết hàm số bậc hai; xác định đỉnh, trục đối xứng; đọc chiều biến thiên; xác định parabol từ dữ kiện và vận dụng.")}
      ${criterion("Mục tiêu tiếng Nhật","Nhận biết thuật ngữ Toán, đọc yêu cầu, dùng các mẫu câu cơ bản và trả lời ngắn bằng tiếng Nhật.")}
      ${criterion("Cơ chế cá nhân hóa","Hệ thống ghi nhận mô-đun nào cần hỗ trợ nhiều hơn và cập nhật Learning DNA theo từng kỹ năng.")}
      ${criterion("Nguyên tắc chính xác","Đáp án Toán được cố định trong nội dung kiểm chứng; phần giao tiếp chỉ luyện diễn đạt, không thay thế đánh giá Toán.")}
    </div>
  </div>
  <div class="actions"><button class="btn primary" data-lesson-tab="vocab">Bắt đầu từ Từ vựng</button></div>`;
}

function criterion(t,d){return `<div class="criterion"><b>${t}</b><p>${d}</p></div>`;}

function vocabModule(){
  const known=Object.keys(state.knownTerms).filter(k=>state.knownTerms[k]).length;
  return `
  <div class="module-title"><div><h2>Từ vựng Toán cần cho Bài 16</h2><p>Nhấn vào thẻ để đánh dấu đã biết. Mục tiêu là đủ từ để đọc đề, không học danh sách quá dài.</p></div><span class="lesson-tag open">${known}/${TERMS.length} đã biết</span></div>
  <div class="term-grid">
    ${TERMS.map((t,i)=>`<button class="term ${state.knownTerms[i]?'known':''}" data-term="${i}">
      <div class="jp">${t.jp}</div><div class="reading">${t.reading}</div><div class="vi">${t.vi}</div>
    </button>`).join("")}
  </div>
  <div class="actions"><button class="btn primary" id="finishVocab">Hoàn thành Từ vựng</button><button class="btn ghost" data-lesson-tab="grammar">Sang Ngữ pháp</button></div>`;
}

function grammarModule(){
  const q=QUESTIONS.grammar, answered=state.grammarAnswer!==null;
  return `
  <div class="module-title"><div><h2>Ngữ pháp trong đề Toán</h2><p>Chỉ tập trung những cấu trúc trực tiếp xuất hiện khi đọc yêu cầu bài tập.</p></div></div>
  <div class="grammar-list">
    ${GRAMMAR.map(g=>`<div class="grammar-item"><b>${g.pattern}</b><p>${g.meaning}<br/>Ví dụ: ${g.example}</p></div>`).join("")}
  </div>
  <div class="section-head"><div><h3>Kiểm tra nhanh</h3></div></div>
  <div class="quiz">
    <div class="question">${q.prompt}</div>
    <div class="answer-list">
      ${q.answers.map((a,i)=>`<button class="answer ${answered?(i===q.correct?'correct':i===state.grammarAnswer?'wrong':''):''}" data-grammar-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${a}</button>`).join("")}
    </div>
    ${answered?`<div class="feedback">${q.feedback}</div>`:""}
  </div>
  <div class="actions"><button class="btn primary" data-lesson-tab="reading">Sang Đọc & Viết</button></div>`;
}

function readingWritingModule(){
  const q=QUESTIONS.reading, answered=state.readingAnswer!==null;
  return `
  <div class="module-title"><div><h2>Đọc & Viết</h2><p>Đọc yêu cầu bằng tiếng Nhật, giải Toán, sau đó viết một câu trả lời ngắn.</p></div></div>
  <div class="reading-box">
    <div class="reading-jp">${q.prompt}</div>
    <div class="reading-gloss">${q.support}</div>
  </div>
  <div class="quiz" style="margin-top:10px">
    <div class="answer-list">
      ${q.answers.map((a,i)=>`<button class="answer ${answered?(i===q.correct?'correct':i===state.readingAnswer?'wrong':''):''}" data-reading-answer="${i}" ${answered?'disabled':''}>${String.fromCharCode(65+i)}. ${a}</button>`).join("")}
    </div>
    ${answered?`<div class="feedback">${q.feedback}</div>`:""}
  </div>

  <div class="section-head"><div><h3>Bài viết ngắn</h3><p>Viết một câu tiếng Nhật nêu đỉnh và trục đối xứng.</p></div></div>
  <div class="write-box">
    <textarea id="writingInput" placeholder="Ví dụ: 頂点は ... です。対称軸は ... です。">${escapeHtml(state.writingText)}</textarea>
    <div class="actions"><button class="btn primary" id="checkWriting">Kiểm tra bài viết</button></div>
    ${state.writingText?writingFeedback():""}
  </div>
  <div class="actions"><button class="btn primary" data-lesson-tab="speaking">Sang Giao tiếp</button></div>`;
}

function writingFeedback(){
  const ok=state.writingPassed;
  return `<div class="feedback"><b>${ok?"Đã đạt yêu cầu demo.":"Chưa đủ ý."}</b><br/>${
    ok?"Câu trả lời có nhắc được 頂点/đỉnh, 対称軸/trục đối xứng và các giá trị cần thiết. Trong nghiên cứu chính thức, phần viết nên được giáo viên hoặc rubric kiểm tra thêm."
      :"Hãy thử dùng 「頂点は (2,-1) です。対称軸は x=2 です。」 hoặc một câu tương đương."
  }</div>`;
}

function speakingModule(){
  return `
  <div class="module-title"><div><h2>Giao tiếp</h2><p>Mô phỏng một giáo viên Nhật hỏi về đồ thị. Bạn có thể nghe câu hỏi và trả lời bằng giọng nói hoặc nhập văn bản.</p></div><span class="lesson-tag open">Nghe · Nói</span></div>
  <div class="conversation">
    <div class="dialogue">
      <div class="dialogue-stream" id="dialogueStream">
        ${state.conversationMessages.map(m=>`<div class="bubble ${m.who==='teacher'?'teacher':'student'}">${escapeHtml(m.text)}</div>`).join("")}
      </div>
      <div class="actions">
        <button class="btn ghost" id="playTeacher">Nghe câu hỏi</button>
      </div>
    </div>
    <div class="speaking-panel">
      <h3>Trả lời lượt hiện tại</h3>
      <p>${speakingInstruction()}</p>
      <div class="speak-status" id="speechStatus">${state.speakingCompleted?"Hoàn thành hội thoại demo.":"Bạn có thể dùng micro hoặc nhập bằng bàn phím."}</div>
      <div class="response-input">
        <input id="speakInput" placeholder="Nhập câu trả lời tiếng Nhật..." ${state.speakingCompleted?'disabled':''}/>
        <button class="btn primary" id="sendSpeak" ${state.speakingCompleted?'disabled':''}>Gửi</button>
      </div>
      <div class="actions"><button class="btn ghost" id="startSpeech" ${state.speakingCompleted?'disabled':''}>Bắt đầu nói</button></div>
      <div class="quick-responses">
        ${quickResponses().map(r=>`<button data-quick-response="${escapeAttr(r)}" ${state.speakingCompleted?'disabled':''}>${escapeHtml(r)}</button>`).join("")}
      </div>
      <div class="notice" style="margin-top:10px">
        Bản demo dùng SpeechSynthesis/SpeechRecognition của trình duyệt nếu có. Nếu trình duyệt không hỗ trợ micro, phần nhập văn bản vẫn hoạt động.
      </div>
    </div>
  </div>
  <div class="actions"><button class="btn primary" data-lesson-tab="result">Xem kết quả</button></div>`;
}

function speakingInstruction(){
  if(state.conversationStep===0) return "Giáo viên hỏi: “Đỉnh của parabol này ở đâu?” Hãy trả lời ngắn bằng tiếng Nhật.";
  if(state.conversationStep===1) return "Giáo viên hỏi tiếp: “Trục đối xứng là gì?” Hãy trả lời ngắn.";
  return "Hội thoại đã hoàn thành.";
}
function quickResponses(){
  if(state.conversationStep===0) return ["頂点は (2,-1) です。","(2,-1) です。"];
  if(state.conversationStep===1) return ["対称軸は x=2 です。","x=2 です。"];
  return [];
}

function resultModule(){
  return `
  <div class="module-title"><div><h2>Kết quả Bài 16</h2><p>Không phải điểm kiểm tra chính thức; đây là dữ liệu để minh họa cơ chế cá nhân hóa.</p></div></div>
  <div class="result-grid">
    <div class="result-box"><b>${state.progress.vocab}%</b><span>Từ vựng</span></div>
    <div class="result-box"><b>${state.progress.grammar}%</b><span>Ngữ pháp</span></div>
    <div class="result-box"><b>${state.progress.readingWriting}%</b><span>Đọc & Viết</span></div>
    <div class="result-box"><b>${state.progress.speaking}%</b><span>Giao tiếp</span></div>
  </div>
  <div class="section-head"><div><h3>Nhận xét cá nhân hóa</h3></div></div>
  <div class="notice">${personalComment()}</div>
  <div class="actions"><button class="btn primary" data-view="dna">Xem Learning DNA</button><button class="btn ghost" data-view="errors">Xem Sổ lỗi</button></div>`;
}

function personalComment(){
  const entries=Object.entries(state.dna).sort((a,b)=>a[1]-b[1]);
  const labels={vocab:"từ vựng",grammar:"ngữ pháp",reading:"đọc",writing:"viết",speaking:"giao tiếp"};
  return `Kỹ năng hiện cần ưu tiên là <b>${labels[entries[0][0]]}</b>. Nhiệm vụ tiếp theo nên giữ độ khó Toán tương đương nhưng tăng cơ hội luyện ${labels[entries[0][0]]}, thay vì tăng độ khó Toán ngay.`;
}

function dnaView(){
  return `<div class="card card-pad">
    <div class="section-head" style="margin:0 0 10px"><div><h2>Learning DNA</h2><p>Hồ sơ động theo năm kỹ năng ngôn ngữ quan sát được trong Bài 16.</p></div><button class="btn ghost" id="resetAll">Đặt lại dữ liệu</button></div>
    <div class="grid-dna">
      ${Object.entries(state.dna).map(([k,v])=>dnaDetailed(k,v)).join("")}
    </div>
    <div class="section-head"><div><h3>Dữ liệu dùng để cập nhật</h3></div></div>
    <div class="criteria">
      ${criterion("Từ vựng","Số thuật ngữ học sinh tự đánh dấu đã biết và việc hoàn thành mô-đun từ vựng.")}
      ${criterion("Ngữ pháp","Kết quả câu hỏi về cấu trúc dùng trong đề Toán.")}
      ${criterion("Đọc","Khả năng hiểu câu hỏi Toán tiếng Nhật và chọn đáp án đúng.")}
      ${criterion("Viết","Khả năng diễn đạt kết quả Toán bằng một câu tiếng Nhật ngắn.")}
      ${criterion("Giao tiếp","Khả năng phản hồi đúng nội dung trong hội thoại mô phỏng bằng giọng nói hoặc văn bản.")}
      ${criterion("Minh bạch","Không có một “điểm AI” bí ẩn; mỗi thay đổi đều xuất phát từ một hoạt động quan sát được.")}
    </div>
  </div>`;
}
function dnaDetailed(k,v){
  const labels={vocab:"Từ vựng",grammar:"Ngữ pháp",reading:"Đọc",writing:"Viết",speaking:"Giao tiếp"};
  return `<div class="card card-pad" style="box-shadow:none"><div class="dna-label"><strong>${labels[k]}</strong><b>${v}%</b></div><div class="bar"><div style="width:${v}%"></div></div></div>`;
}

function errorsView(){
  return `<div class="card card-pad">
    <div class="section-head" style="margin:0 0 10px"><div><h2>Sổ lỗi cá nhân</h2><p>Lưu những điểm cần ôn lại thay vì để lỗi biến mất sau khi làm bài.</p></div><button class="btn ghost" id="exportCsv">Xuất CSV</button></div>
    <div class="error-list">
      ${state.errors.length?state.errors.slice().reverse().map(e=>`<div class="error-item"><b>${escapeHtml(e.title)}</b><p>${escapeHtml(e.detail)}</p></div>`).join(""):'<div class="empty">Chưa có lỗi nào được ghi nhận.</div>'}
    </div>
  </div>`;
}

function bind(){
  document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",function(){
    if(this.dataset.lessonTab) state.lessonTab=this.dataset.lessonTab;
    state.view=this.dataset.view;
    save();render();
  }));
  document.querySelectorAll("[data-lesson-tab]").forEach(el=>el.addEventListener("click",function(){
    state.lessonTab=this.dataset.lessonTab; state.view="lesson"; save(); render();
  }));
  document.querySelectorAll("[data-grade]").forEach(el=>el.addEventListener("click",function(){
    state.grade=this.dataset.grade; save(); render();
  }));
  document.querySelectorAll("[data-subject]").forEach(el=>el.addEventListener("click",function(){
    const s=SUBJECTS.find(x=>x.id===this.dataset.subject);
    state.subject=s.id;
    if(!s.active){alert("Môn này đang được mở rộng. Bản demo hiện mở đầy đủ Toán 10.");}
    save();render();
  }));

  const gradeSelect=document.getElementById("gradeSelect");
  if(gradeSelect) gradeSelect.addEventListener("change",e=>{state.grade=e.target.value;});
  const subjectSelect=document.getElementById("subjectSelect");
  if(subjectSelect) subjectSelect.addEventListener("change",e=>{state.subject=e.target.value;});
  const lessonSelect=document.getElementById("lessonSelect");
  if(lessonSelect) lessonSelect.addEventListener("change",e=>{state.lesson=e.target.value;});
  document.getElementById("openSelection")?.addEventListener("click",()=>{
    const active=state.grade==="10" && state.subject==="math" && state.lesson==="Bài 16. Hàm số bậc hai";
    if(active){state.view="lesson";state.lessonTab="overview";save();render();}
    else{alert("Nội dung này đang được mở rộng. Bản demo hiện mở Bài 16 — Hàm số bậc hai, Toán 10.");save();render();}
  });

  document.getElementById("searchBtn")?.addEventListener("click",runSearch);
  document.getElementById("searchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")runSearch();});

  document.querySelectorAll("[data-term]").forEach(el=>el.addEventListener("click",function(){
    const i=this.dataset.term; state.knownTerms[i]=!state.knownTerms[i];
    const known=Object.values(state.knownTerms).filter(Boolean).length;
    state.dna.vocab=clamp(40+known*6);
    track("term_toggle",{term:TERMS[i].jp,known:state.knownTerms[i]});
    render();
  }));
  document.getElementById("finishVocab")?.addEventListener("click",()=>{
    const known=Object.values(state.knownTerms).filter(Boolean).length;
    state.progress.vocab=Math.max(60,Math.round(known/TERMS.length*100));
    if(known<TERMS.length/2) addError("Từ vựng Bài 16","Cần ôn lại các thuật ngữ Toán tiếng Nhật trước khi đọc đề dài.");
    state.dna.vocab=clamp(state.dna.vocab+(known>=6?8:3));
    track("vocab_complete",{known});save();render();
  });

  document.querySelectorAll("[data-grammar-answer]").forEach(el=>el.addEventListener("click",function(){
    const i=+this.dataset.grammarAnswer;state.grammarAnswer=i;
    const ok=i===QUESTIONS.grammar.correct;
    state.progress.grammar=100;
    state.dna.grammar=clamp(state.dna.grammar+(ok?10:-4));
    if(!ok)addError("Ngữ pháp yêu cầu","Cần ôn mẫu 「N を求めてください」 = hãy tìm/xác định N.");
    track("grammar_answer",{correct:ok,selected:i});save();render();
  }));
  document.querySelectorAll("[data-reading-answer]").forEach(el=>el.addEventListener("click",function(){
    const i=+this.dataset.readingAnswer;state.readingAnswer=i;
    const ok=i===QUESTIONS.reading.correct;
    state.dna.reading=clamp(state.dna.reading+(ok?10:-5));
    if(!ok)addError("Đọc đề Toán","Cần ôn 頂点, 対称軸 và mẫu 求めてください.");
    track("reading_answer",{correct:ok,selected:i});save();render();
  }));
  document.getElementById("checkWriting")?.addEventListener("click",()=>{
    const text=document.getElementById("writingInput")?.value.trim()||"";
    state.writingText=text;
    const hasVertex=/頂点|đỉnh/i.test(text);
    const hasAxis=/対称軸|trục/i.test(text);
    const has2=/(2|２)/.test(text);
    const hasMinus1=/(-1|−1|－1)/.test(text);
    state.writingPassed=hasVertex&&hasAxis&&has2&&hasMinus1;
    state.progress.readingWriting=state.writingPassed && state.readingAnswer===QUESTIONS.reading.correct?100:70;
    state.dna.writing=clamp(state.dna.writing+(state.writingPassed?10:-4));
    if(!state.writingPassed)addError("Viết câu trả lời","Cần luyện cách diễn đạt: 頂点は (2,-1) です。対称軸は x=2 です。");
    track("writing_check",{passed:state.writingPassed,length:text.length});save();render();
  });

  document.getElementById("playTeacher")?.addEventListener("click",playTeacherLine);
  document.getElementById("sendSpeak")?.addEventListener("click",()=>{
    const input=document.getElementById("speakInput");const text=input?.value.trim()||"";if(text)handleSpeaking(text);
  });
  document.getElementById("startSpeech")?.addEventListener("click",startSpeech);
  document.querySelectorAll("[data-quick-response]").forEach(el=>el.addEventListener("click",function(){handleSpeaking(this.dataset.quickResponse);}));

  document.getElementById("resetLesson")?.addEventListener("click",resetLesson);
  document.getElementById("resetAll")?.addEventListener("click",resetAll);
  document.getElementById("exportCsv")?.addEventListener("click",exportCsv);
}

function runSearch(){
  const q=(document.getElementById("searchInput")?.value||"").toLowerCase().trim();
  if(!q)return;
  if(q.includes("16")||q.includes("bậc hai")||q.includes("ham so bac hai")||q.includes("二次")){
    state.view="lesson";state.lessonTab="overview";save();render();
  }else{
    alert("Bản demo hiện có nội dung đầy đủ cho Bài 16 — Hàm số bậc hai.");
  }
}

function addError(title,detail){
  const key=title+"|"+detail;
  if(!state.errors.some(e=>e.key===key)) state.errors.push({key,title,detail,time:new Date().toISOString()});
}

function playTeacherLine(){
  if(!("speechSynthesis" in window)){setSpeechStatus("Trình duyệt không hỗ trợ phát giọng nói.");return;}
  const text=state.conversationStep===0?"この放物線の頂点はどこですか。":"対称軸は何ですか。";
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang="ja-JP";u.rate=.82;
  window.speechSynthesis.speak(u);
  setSpeechStatus("Đang phát câu hỏi tiếng Nhật...");
  track("speech_play",{step:state.conversationStep});
}
function startSpeech(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){setSpeechStatus("Trình duyệt chưa hỗ trợ nhận giọng nói. Hãy nhập câu trả lời bằng bàn phím.");return;}
  const rec=new SR();rec.lang="ja-JP";rec.interimResults=false;rec.maxAlternatives=1;
  setSpeechStatus("Đang nghe...");
  rec.onresult=function(e){
    const text=e.results[0][0].transcript;setSpeechStatus("Nhận được: "+text);handleSpeaking(text);
  };
  rec.onerror=function(){setSpeechStatus("Không nhận được giọng nói. Hãy thử lại hoặc nhập văn bản.");};
  rec.start();
}
function handleSpeaking(text){
  state.conversationMessages.push({who:"student",text});
  let ok=false;
  if(state.conversationStep===0){
    ok=/(2|２).*(-1|−1|マイナス1|マイナス１)|頂点.*2/i.test(text);
    if(ok){
      state.conversationMessages.push({who:"teacher",text:"そうですね。では、対称軸は何ですか。"});
      state.conversationStep=1;
      state.dna.speaking=clamp(state.dna.speaking+7);
    }else{
      state.conversationMessages.push({who:"teacher",text:"もう一度考えてみましょう。頂点は (2,-1) です。"});
      addError("Giao tiếp: trả lời về đỉnh","Cần luyện mẫu 「頂点は (2,-1) です。」");
      state.dna.speaking=clamp(state.dna.speaking-2);
    }
  }else if(state.conversationStep===1){
    ok=/(x\s*=\s*2|x=2|対称軸.*2)/i.test(text);
    if(ok){
      state.conversationMessages.push({who:"teacher",text:"正解です。よくできました。"});
      state.conversationStep=2;state.speakingCompleted=true;state.progress.speaking=100;
      state.dna.speaking=clamp(state.dna.speaking+10);
    }else{
      state.conversationMessages.push({who:"teacher",text:"ヒント：対称軸は x=2 です。"});
      addError("Giao tiếp: trục đối xứng","Cần luyện mẫu 「対称軸は x=2 です。」");
      state.dna.speaking=clamp(state.dna.speaking-2);
    }
  }
  track("speaking_turn",{step:state.conversationStep,text,correct:ok});
  save();render();
}
function setSpeechStatus(text){const el=document.getElementById("speechStatus");if(el)el.textContent=text;}

function resetLesson(){
  const keep={view:"lesson",grade:state.grade,subject:state.subject,lesson:state.lesson};
  state=Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)),keep);
  state.lessonTab="overview";save();render();
}
function resetAll(){localStorage.removeItem("sensakura-product-v1");state=JSON.parse(JSON.stringify(DEFAULT_STATE));render();}
function exportCsv(){
  const rows=[["time","type","data"]];
  state.events.forEach(e=>rows.push([e.time,e.type,JSON.stringify(e)]));
  const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="sensakura-demo-data.csv";a.click();URL.revokeObjectURL(url);
}
function escapeHtml(s){return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function escapeAttr(s){return escapeHtml(s).replaceAll("'","&#39;");}

render();
})();
