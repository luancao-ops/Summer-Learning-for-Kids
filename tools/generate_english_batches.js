const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "content_repository", "english", "lessons");
const manifestDir = path.join(repoRoot, "summer-quest", "content", "manifests");

function optionSet(correctLetter, correctText, distractors) {
  const letters = ["A", "B", "C", "D"];
  const options = [];
  let distractorIndex = 0;
  for (const letter of letters) {
    if (letter === correctLetter) {
      options.push({ id: letter, text: correctText });
    } else {
      options.push({ id: letter, text: distractors[distractorIndex++] });
    }
  }
  return options;
}

function mc(lessonId, orderIndex, text, correctLetter, correctText, distractors, explanation, hint) {
  return {
    id: `${lessonId}-q${orderIndex}`,
    lessonId,
    orderIndex,
    type: "multiple_choice",
    text,
    options: optionSet(correctLetter, correctText, distractors),
    correctAnswer: correctLetter,
    explanation,
    hint,
  };
}

function tf(lessonId, orderIndex, text, correct, explanation, hint) {
  return {
    id: `${lessonId}-q${orderIndex}`,
    lessonId,
    orderIndex,
    type: "true_false",
    text,
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: String(correct),
    explanation,
    hint,
  };
}

function fb(lessonId, orderIndex, text, answer, explanation, hint) {
  return {
    id: `${lessonId}-q${orderIndex}`,
    lessonId,
    orderIndex,
    type: "fill_blank",
    text,
    options: [],
    correctAnswer: answer,
    explanation,
    hint,
  };
}

function distributionString(questions) {
  const mcQuestions = questions.filter((q) => q.type === "multiple_choice");
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  const parts = [];
  for (const q of mcQuestions) {
    counts[q.correctAnswer] += 1;
    parts.push(`Q${q.orderIndex}=${q.correctAnswer}`);
  }
  return `${parts.join(" ")} — A×${counts.A} B×${counts.B} C×${counts.C} D×${counts.D}, no consecutive repeats`;
}

function ensureRule(questions) {
  const mcQuestions = questions.filter((q) => q.type === "multiple_choice");
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (let i = 0; i < mcQuestions.length; i += 1) {
    const letter = mcQuestions[i].correctAnswer;
    counts[letter] += 1;
    if (i > 0 && mcQuestions[i - 1].correctAnswer === letter) {
      throw new Error(`Consecutive answer repeat in ${questions[0].lessonId}`);
    }
  }
  for (const [letter, count] of Object.entries(counts)) {
    if (count > 3) {
      throw new Error(`Answer ${letter} used ${count} times in ${questions[0].lessonId}`);
    }
  }
  if (questions.length !== 10) {
    throw new Error(`Expected 10 questions in ${questions[0].lessonId}`);
  }
}

function lesson({
  id,
  studentTarget,
  grade,
  orderIndex,
  title,
  learningObjective,
  shortExplanation,
  storyContext,
  content,
  questions,
}) {
  ensureRule(questions);
  const checks = questions.map((question) => {
    if (question.type === "multiple_choice") {
      return {
        type: "multiple_choice",
        text: question.text,
        options: question.options.map((option) => option.text),
        correctIndex: ["A", "B", "C", "D"].indexOf(question.correctAnswer),
        explanation: question.explanation,
        hint: question.hint,
      };
    }

    if (question.type === "true_false") {
      return {
        type: "true_false",
        text: question.text,
        correct: question.correctAnswer === "true",
        explanation: question.explanation,
        hint: question.hint,
      };
    }

    return {
      type: "fill_blank",
      text: question.text,
      answer: question.correctAnswer,
      explanation: question.explanation,
      hint: question.hint,
    };
  });
  return {
    id,
    subjectId: "english",
    studentTarget,
    grade,
    phase: "review",
    orderIndex,
    title,
    learningObjective,
    shortExplanation,
    storyContext,
    content,
    rewardConfig: "{\"xp\":10,\"coins\":5}",
    approved: false,
    checks,
    questions,
  };
}

function batch(batchId, sourceReference, lessons, languageLevel) {
  return {
    version: 1,
    batchId,
    sourceReference,
    checks: {
      answerDistribution: lessons
        .map((item) => `${item.id}: ${distributionString(item.questions)}`)
        .join(" | "),
      noConsecutiveSameAnswer: true,
      languageLevel,
      contentOriginal: true,
    },
    defaults: {
      approved: false,
      minimumQuestions: 10,
    },
    lessons,
  };
}

const girl08 = [];
const girl09 = [];
const boy02 = [];
const boy03 = [];

girl08.push(
  lesson({
    id: "girl-g5-en-rea-x001",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 72,
    title: "Kỳ nghỉ ở sân bay và bãi biển",
    learningObjective: "Sau bài này bé sẽ đọc hiểu được một đoạn văn về chuyến đi nghỉ, từ vựng sân bay và cách dùng past simple trong ngữ cảnh quen thuộc.",
    shortExplanation: "Bé sẽ theo chân Mia trong một chuyến đi nghỉ và chú ý xem các sự việc đã xảy ra theo thứ tự nào.",
    storyContext: "Mia viết nhật ký về ngày đầu tiên đi nghỉ cùng gia đình.",
    content: `# On Holiday 📖

> Bé hãy tưởng tượng mình đang kéo va-li ra sân bay cùng Mia nhé.

---

## Đọc đoạn văn sau

Last Friday, Mia and her family went on holiday to Da Nang. They woke up early because their flight left at eight o'clock. At the airport, Mia held her boarding pass and checked the departure board with her dad. Her little brother pushed a small suitcase, but Mia carried the big blue bag with the swimsuits.

After they passed security, they waited near Gate 6 and ate sandwiches. Mia looked out of the window and watched the planes land and take off. When the loudspeaker called their flight, the family walked onto the plane and sat down quickly.

Two hours later, they arrived in Da Nang. The weather was sunny, so they drove straight to the hotel and changed clothes. In the afternoon, Mia played on the beach, collected shells, and built a sandcastle with her brother. In the evening, she wrote in her diary, “Today was busy, but it was the best start to our holiday.”

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| airport | sân bay | "At the airport, Mia held her boarding pass..." |
| boarding pass | thẻ lên máy bay | "Mia held her boarding pass..." |
| departure board | bảng chuyến bay | "checked the departure board with her dad" |
| suitcase | va-li | "Her little brother pushed a small suitcase" |
| security | khu kiểm tra an ninh | "After they passed security..." |
| gate | cổng ra máy bay | "they waited near Gate 6" |

---

## Trước khi làm bài, thử trả lời

- Mia đi đâu vào thứ Sáu tuần trước?
- Gia đình bạn ấy làm gì ở sân bay?
- Buổi chiều Mia làm gì ở bãi biển?`,
    questions: [
      mc(
        "girl-g5-en-rea-x001",
        1,
        "Mia và gia đình đi nghỉ ở đâu?",
        "B",
        "Đà Nẵng",
        ["Nha Trang", "Hà Nội", "Huế"],
        "Đoạn văn nói rõ gia đình Mia bay tới Đà Nẵng vào thứ Sáu tuần trước.",
        "Hãy tìm tên thành phố xuất hiện ở đầu đoạn văn."
      ),
      mc(
        "girl-g5-en-rea-x001",
        2,
        "Ở sân bay, Mia cầm vật gì trên tay?",
        "A",
        "Thẻ lên máy bay",
        ["Hộ chiếu của em trai", "Một cuốn bản đồ", "Chìa khóa khách sạn"],
        "Mia held her boarding pass, tức là Mia cầm thẻ lên máy bay.",
        "Đọc câu có từ 'held' ở đoạn đầu."
      ),
      mc(
        "girl-g5-en-rea-x001",
        3,
        "Gia đình Mia làm gì sau khi qua khu kiểm tra an ninh?",
        "C",
        "Chờ gần Gate 6 và ăn bánh mì",
        ["Đi thẳng lên máy bay", "Mua đồ bơi mới", "Đổi quần áo ở khách sạn"],
        "Sau security, cả nhà waited near Gate 6 and ate sandwiches.",
        "Nhìn vào câu bắt đầu bằng 'After they passed security'."
      ),
      mc(
        "girl-g5-en-rea-x001",
        4,
        "Từ 'departure board' trong bài có nghĩa gần nhất là gì?",
        "D",
        "Bảng thông tin chuyến bay",
        ["Quầy gửi hành lý", "Nhà chờ ăn uống", "Cửa kiểm tra vé"],
        "Departure board là bảng hiển thị giờ bay và cổng ra máy bay.",
        "Đó là nơi hành khách nhìn để biết chuyến bay của mình."
      ),
      mc(
        "girl-g5-en-rea-x001",
        5,
        "Buổi chiều ở Đà Nẵng, Mia KHÔNG làm việc nào sau đây?",
        "B",
        "Mua quà lưu niệm ở chợ đêm",
        ["Chơi trên bãi biển", "Nhặt vỏ sò", "Xây lâu đài cát"],
        "Đoạn văn chỉ kể Mia chơi trên bãi biển, nhặt vỏ sò và xây lâu đài cát.",
        "Đọc đoạn cuối nói về hoạt động buổi chiều."
      ),
      mc(
        "girl-g5-en-rea-x001",
        6,
        "Vì sao câu cuối cho thấy Mia cảm thấy vui về ngày đầu tiên?",
        "C",
        "Vì bạn ấy viết đó là khởi đầu tuyệt vời nhất",
        ["Vì bạn ấy muốn về nhà sớm", "Vì trời bắt đầu mưa", "Vì bạn ấy ngủ trên máy bay"],
        "Nhật ký của Mia nói 'it was the best start to our holiday', cho thấy bạn ấy rất hào hứng.",
        "Hãy chú ý dòng nhật ký trong ngoặc kép."
      ),
      mc(
        "girl-g5-en-rea-x001",
        7,
        "Từ 'suitcase' trong bài nghĩa là gì?",
        "A",
        "Va-li",
        ["Áo bơi", "Vé máy bay", "Ghế gần cửa sổ"],
        "Suitcase là chiếc va-li dùng để đựng quần áo khi đi du lịch.",
        "Đó là đồ em trai của Mia đẩy ở sân bay."
      ),
      mc(
        "girl-g5-en-rea-x001",
        8,
        "Câu nào dùng past simple đúng với nội dung bài đọc?",
        "D",
        "They arrived in Da Nang two hours later.",
        ["They arrive in Da Nang now.", "They are arriving two hours later.", "They have arrive in Da Nang."],
        "Arrived là động từ quá khứ đúng để kể việc đã xảy ra trong chuyến đi.",
        "Tìm câu kể sự việc đã hoàn thành trong ngày hôm đó."
      ),
      tf(
        "girl-g5-en-rea-x001",
        9,
        "Gia đình Mia lên máy bay trước khi nghe loa gọi chuyến bay của mình.",
        false,
        "Sai vì cả nhà chờ gần Gate 6, rồi chỉ khi loa gọi chuyến bay họ mới đi lên máy bay.",
        "So sánh thứ tự: chờ ở cổng trước, lên máy bay sau."
      ),
      fb(
        "girl-g5-en-rea-x001",
        10,
        "Điền vào chỗ trống: Mia looked out of the window and watched the planes land and take _____.",
        "off",
        "Cụm đúng trong bài là 'take off', nghĩa là cất cánh.",
        "Đây là cụm động từ đi cùng với 'land'."
      ),
    ],
  })
);

girl08.push(
  lesson({
    id: "girl-g5-en-rea-x002",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 73,
    title: "Sức khỏe và lời khuyên mỗi ngày",
    learningObjective: "Sau bài này bé sẽ đọc hiểu đoạn văn về sức khỏe, từ vựng bệnh thường gặp và cách dùng should hoặc shouldn't để cho lời khuyên.",
    shortExplanation: "Bé sẽ gặp một nhân vật bị mệt và xem bạn bè, cô giáo đã khuyên bạn ấy thế nào.",
    storyContext: "Linh bị không khỏe ở trường và nhận được nhiều lời khuyên hữu ích.",
    content: `# Health Matters 📖

> Khi cơ thể mệt, mình cần lắng nghe cơ thể và làm theo lời khuyên đúng nhé.

---

## Đọc đoạn văn sau

On Monday morning, Linh did not feel well at school. Her head hurt, her throat felt sore, and she had a small cough. During art class, she looked tired and moved slowly. Her friend Anna touched Linh's arm and said, “You should tell the teacher.”

The teacher took Linh to the school nurse. The nurse checked her temperature and gave her a glass of warm water. “You should rest this afternoon,” the nurse said. “You shouldn't eat ice cream today, and you should drink more water.”

After lunch, Linh called her mum. At home, she lay on the sofa with a blanket and read a comic. Her mum made lemon tea with honey. In the evening, Linh felt a little better because she followed the advice. She brushed her teeth, took her medicine, and went to bed early. The next morning, her cough was softer and her throat did not hurt so much.

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| sore throat | đau họng | "her throat felt sore" |
| cough | ho | "she had a small cough" |
| temperature | nhiệt độ cơ thể | "The nurse checked her temperature" |
| rest | nghỉ ngơi | "You should rest this afternoon" |
| medicine | thuốc | "she took her medicine" |
| advice | lời khuyên | "she followed the advice" |

---

## Trước khi làm bài, thử trả lời

- Linh bị đau ở đâu?
- Cô y tá khuyên Linh làm gì?
- Buổi tối Linh thấy thế nào?`,
    questions: [
      mc(
        "girl-g5-en-rea-x002",
        1,
        "Triệu chứng nào của Linh được nhắc tới ở đầu bài?",
        "C",
        "Đau đầu, đau họng và ho nhẹ",
        ["Đau chân, sốt cao và chóng mặt", "Đau bụng và đau tai", "Mỏi mắt và chảy nước mũi"],
        "Đoạn đầu nói Linh đau đầu, đau họng và có một cơn ho nhẹ.",
        "Tìm ba triệu chứng xuất hiện cùng nhau trong đoạn đầu."
      ),
      mc(
        "girl-g5-en-rea-x002",
        2,
        "Anna đã khuyên Linh làm gì?",
        "A",
        "Nói với cô giáo",
        ["Về nhà ngay lập tức", "Ăn kem cho dễ chịu", "Tiếp tục chạy ngoài sân"],
        "Anna nói 'You should tell the teacher.'",
        "Đọc câu bạn Anna nói trực tiếp."
      ),
      mc(
        "girl-g5-en-rea-x002",
        3,
        "Cô y tá cho Linh uống gì?",
        "D",
        "Một cốc nước ấm",
        ["Nước cam lạnh", "Sữa chocolate", "Nước đá chanh"],
        "The nurse gave her a glass of warm water, tức là một cốc nước ấm.",
        "Tìm câu mô tả việc cô y tá giúp Linh."
      ),
      mc(
        "girl-g5-en-rea-x002",
        4,
        "Theo lời cô y tá, hôm đó Linh không nên làm gì?",
        "B",
        "Ăn kem",
        ["Ngủ sớm", "Uống thêm nước", "Nghỉ buổi chiều"],
        "Cô y tá nói rõ 'You shouldn't eat ice cream today.'",
        "Hãy tìm câu có từ shouldn't."
      ),
      mc(
        "girl-g5-en-rea-x002",
        5,
        "Từ 'medicine' trong bài nghĩa là gì?",
        "D",
        "Thuốc",
        ["Khăn chăn", "Nước chanh", "Nhiệt kế"],
        "Medicine là thuốc, thứ Linh uống trước khi đi ngủ.",
        "Đó là thứ Linh dùng vào buổi tối để khỏe hơn."
      ),
      mc(
        "girl-g5-en-rea-x002",
        6,
        "Vì sao tối hôm đó Linh cảm thấy đỡ hơn?",
        "A",
        "Vì bạn ấy làm theo lời khuyên",
        ["Vì bạn ấy ăn rất nhiều kem", "Vì bạn ấy chơi ngoài trời lâu", "Vì bạn ấy không nghỉ ngơi"],
        "Bài đọc nói Linh felt a little better because she followed the advice.",
        "Hãy tìm câu bắt đầu bằng 'In the evening'."
      ),
      mc(
        "girl-g5-en-rea-x002",
        7,
        "Từ 'rest' trong bài gần nghĩa nhất với từ nào?",
        "C",
        "Nghỉ ngơi",
        ["Chạy nhanh", "Nói chuyện", "Uống thuốc"],
        "Rest nghĩa là nghỉ ngơi để cơ thể hồi phục.",
        "Đó là việc cô y tá bảo Linh làm vào buổi chiều."
      ),
      mc(
        "girl-g5-en-rea-x002",
        8,
        "Câu nào thể hiện lời khuyên đúng theo bài đọc?",
        "B",
        "You should drink more water.",
        ["You should eat ice cream today.", "You shouldn't go to bed early.", "You should skip your medicine."],
        "Câu đúng được nêu trực tiếp trong lời cô y tá dành cho Linh.",
        "Tìm câu khuyên Linh làm điều tốt cho cổ họng."
      ),
      tf(
        "girl-g5-en-rea-x002",
        9,
        "Sáng hôm sau, cơn ho của Linh nặng hơn đêm hôm trước.",
        false,
        "Sai vì sáng hôm sau cơn ho của Linh nhẹ hơn và cổ họng cũng đỡ đau hơn.",
        "Đọc câu cuối cùng của đoạn văn."
      ),
      fb(
        "girl-g5-en-rea-x002",
        10,
        "Điền vào chỗ trống: Her mum made lemon tea with _____.",
        "honey",
        "Mẹ của Linh pha trà chanh với mật ong để giúp cổ họng dễ chịu hơn.",
        "Từ này là thứ ngọt tự nhiên do ong làm ra."
      ),
    ],
  })
);

girl08.push(
  lesson({
    id: "girl-g5-en-rea-x003",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 74,
    title: "Hành tinh xanh và điều kiện đầu tiên",
    learningObjective: "Sau bài này bé sẽ đọc hiểu một bài về bảo vệ môi trường và nhận ra cấu trúc If + present, will + verb trong ngữ cảnh gần gũi.",
    shortExplanation: "Bé sẽ xem câu lạc bộ xanh ở trường đã làm gì và điều gì sẽ xảy ra nếu mọi người cùng giúp Trái Đất.",
    storyContext: "Câu lạc bộ Green Team đang chuẩn bị cho Ngày Trái Đất ở trường.",
    content: `# Our Planet 📖

> Trái Đất sẽ vui hơn nếu mỗi bạn nhỏ làm một việc tốt cho môi trường mỗi ngày.

---

## Đọc đoạn văn sau

The Green Team at Hoa Binh School met on Wednesday to plan Earth Day. Mai brought old newspapers, Nam carried two cloth bags, and Lucy drew bright posters with the words “Save Water” and “Plant Trees.” Their teacher said, “If we work together, our playground will look cleaner.”

First, the team picked up plastic bottles and empty cans near the school gate. Then they sorted the rubbish into paper, plastic, and metal boxes. After that, they planted three young trees beside the fence. Mai smiled and said, “If these trees get enough water, they will grow tall and strong.”

At the end of the afternoon, the students visited each classroom to share simple ideas. “If you turn off the lights, you will save electricity,” Lucy told the younger children. “If you use a reusable bottle, you will make less waste.” Everyone clapped because the message was easy to understand. The Green Team went home tired, but they felt proud because they had helped the planet in a real way.

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| cloth bag | túi vải | "Nam carried two cloth bags" |
| sort | phân loại | "they sorted the rubbish" |
| reusable | có thể dùng lại | "use a reusable bottle" |
| waste | rác thải | "you will make less waste" |
| electricity | điện năng | "you will save electricity" |
| planet | hành tinh | "they had helped the planet" |

---

## Trước khi làm bài, thử trả lời

- Green Team đã dọn những gì?
- Các bạn ấy trồng cây ở đâu?
- Câu nào trong bài dùng If + present, will + verb?`,
    questions: [
      mc(
        "girl-g5-en-rea-x003",
        1,
        "Green Team gặp nhau để chuẩn bị cho ngày nào?",
        "D",
        "Earth Day",
        ["Sports Day", "Teachers' Day", "Book Fair"],
        "Ngay câu đầu nói nhóm gặp nhau để plan Earth Day.",
        "Tìm tên ngày đặc biệt xuất hiện ở câu đầu."
      ),
      mc(
        "girl-g5-en-rea-x003",
        2,
        "Nam mang theo vật gì?",
        "B",
        "Hai chiếc túi vải",
        ["Ba cây non", "Một hộp kim loại", "Những chai nhựa cũ"],
        "Bài đọc nói Nam carried two cloth bags.",
        "Nhìn vào danh sách mỗi bạn mang gì đến buổi họp."
      ),
      mc(
        "girl-g5-en-rea-x003",
        3,
        "Sau khi nhặt rác, nhóm đã làm gì tiếp theo?",
        "A",
        "Phân loại rác vào các hộp",
        ["Về nhà ngay", "Tưới cây trong vườn", "Tắt hết đèn trong lớp"],
        "Các bạn nhặt chai lọ xong rồi sorted the rubbish into boxes.",
        "Đọc chuỗi hoạt động với từ First, Then, After that."
      ),
      mc(
        "girl-g5-en-rea-x003",
        4,
        "Từ 'reusable' gần nghĩa nhất với cách hiểu nào?",
        "C",
        "Có thể dùng lại nhiều lần",
        ["Rất nặng để mang", "Được làm bằng kim loại", "Chỉ dùng được một lần"],
        "Reusable bottle là bình có thể dùng lại, giúp giảm rác.",
        "Hãy nghĩ đến một chai nước không bị vứt đi sau một lần dùng."
      ),
      mc(
        "girl-g5-en-rea-x003",
        5,
        "Mai nói điều gì sẽ xảy ra nếu cây được tưới đủ nước?",
        "D",
        "Chúng sẽ lớn cao và khỏe",
        ["Chúng sẽ đổi màu xanh sang vàng", "Chúng sẽ biến thành hoa", "Chúng sẽ cần ít ánh nắng hơn"],
        "Mai nói rõ: If these trees get enough water, they will grow tall and strong.",
        "Tìm câu nói trực tiếp của Mai."
      ),
      mc(
        "girl-g5-en-rea-x003",
        6,
        "Câu nào dưới đây đúng theo cấu trúc first conditional trong bài?",
        "A",
        "If you turn off the lights, you will save electricity.",
        ["If you will turn off the lights, you save electricity.", "If you turned off the lights, you will save electricity.", "If you turn off the lights, you saving electricity."],
        "Đây là mẫu đúng: If + present simple, will + động từ nguyên mẫu.",
        "Tìm câu cô bé Lucy nói với các em nhỏ."
      ),
      mc(
        "girl-g5-en-rea-x003",
        7,
        "Vì sao mọi người vỗ tay ở cuối buổi chiều?",
        "C",
        "Vì thông điệp của nhóm dễ hiểu",
        ["Vì trời bắt đầu mưa lớn", "Vì các hộp rác bị đổ", "Vì các bạn được nghỉ học sớm"],
        "Bài đọc viết everyone clapped because the message was easy to understand.",
        "Đọc phần cuối sau khi nhóm đi từng lớp học."
      ),
      mc(
        "girl-g5-en-rea-x003",
        8,
        "Từ 'waste' trong bài nghĩa là gì?",
        "B",
        "Rác thải",
        ["Năng lượng mặt trời", "Nước sạch", "Đất trồng cây"],
        "Waste là rác thải, thứ sẽ ít hơn khi dùng chai có thể tái sử dụng.",
        "Đó là thứ môi trường muốn giảm bớt."
      ),
      tf(
        "girl-g5-en-rea-x003",
        9,
        "Green Team chỉ dọn dẹp mà không đi chia sẻ ý tưởng với các lớp khác.",
        false,
        "Sai vì cuối buổi chiều các bạn còn tới từng lớp để chia sẻ những ý tưởng đơn giản giúp bảo vệ môi trường.",
        "Hãy đọc đoạn cuối xem nhóm có làm thêm việc gì sau khi trồng cây."
      ),
      fb(
        "girl-g5-en-rea-x003",
        10,
        "Điền vào chỗ trống: If you use a reusable bottle, you will make less _____.",
        "waste",
        "Câu trong bài nói dùng bình có thể dùng lại sẽ tạo ra ít rác thải hơn.",
        "Đó là từ chỉ thứ bị vứt đi."
      ),
    ],
  })
);

girl08.push(
  lesson({
    id: "girl-g5-en-rea-x004",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 75,
    title: "Một ngày ở bảo tàng",
    learningObjective: "Sau bài này bé sẽ đọc hiểu đoạn văn về chuyến đi bảo tàng và nhận ra sự khác nhau cơ bản giữa past simple và present perfect qua ngữ cảnh.",
    shortExplanation: "Bé sẽ theo dõi chuyến tham quan bảo tàng và tìm các câu kể việc đã xảy ra cùng các trải nghiệm đã từng có.",
    storyContext: "Sara ghi lại chuyến đi tới bảo tàng thành phố cùng lớp học.",
    content: `# A Day at the Museum 📖

> Có những việc xảy ra vào một thời điểm rõ ràng trong quá khứ, và cũng có những trải nghiệm ta chỉ nói là đã từng có.

---

## Đọc đoạn văn sau

Yesterday, Sara's class visited the city museum for a history project. They arrived at nine o'clock, left their bags in a locker, and followed a guide named Mr. Ben. First, the class walked into a room with old maps, coins, and family photos from one hundred years ago. Sara wrote notes because she wanted to remember every detail.

Later, the guide asked, “Have you ever seen a machine like this before?” He pointed to a large printing press. Sara had not seen one before, but her friend Leo had read about it in a book. In another room, the children looked at dinosaur bones. Leo whispered, “I have never stood this close to such huge fossils.”

At noon, the class ate lunch in the museum garden. After lunch, Sara bought a postcard for her grandmother. Before going home, the students completed a short quiz. Sara felt happy because she learned many new facts, and she has already decided to visit the museum again with her family next month.

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| locker | tủ để đồ có khóa | "left their bags in a locker" |
| guide | hướng dẫn viên | "followed a guide named Mr. Ben" |
| printing press | máy in cổ | "He pointed to a large printing press" |
| fossil | hóa thạch | "such huge fossils" |
| postcard | bưu thiếp | "Sara bought a postcard" |
| decide | quyết định | "she has already decided" |

---

## Trước khi làm bài, thử trả lời

- Sara làm gì lúc chín giờ?
- Câu hỏi của hướng dẫn viên dùng thì nào?
- Sara đã quyết định điều gì vào cuối bài?`,
    questions: [
      mc(
        "girl-g5-en-rea-x004",
        1,
        "Lớp của Sara đến bảo tàng vào lúc mấy giờ?",
        "A",
        "Chín giờ",
        ["Bảy giờ", "Mười một giờ", "Một giờ chiều"],
        "Đoạn đầu nói rõ they arrived at nine o'clock.",
        "Tìm mốc thời gian ở câu đầu."
      ),
      mc(
        "girl-g5-en-rea-x004",
        2,
        "Các bạn nhỏ để túi ở đâu trước khi tham quan?",
        "C",
        "Trong một tủ có khóa",
        ["Dưới bàn ăn trưa", "Trong xe buýt", "Tại quầy bán bưu thiếp"],
        "They left their bags in a locker, nghĩa là trong tủ cất đồ có khóa.",
        "Từ cần tìm nằm trong đoạn đầu."
      ),
      mc(
        "girl-g5-en-rea-x004",
        3,
        "Hướng dẫn viên hỏi: 'Have you ever seen a machine like this before?' Câu hỏi này dùng để hỏi về điều gì?",
        "B",
        "Một trải nghiệm đã từng có",
        ["Một kế hoạch cho ngày mai", "Một hành động đang diễn ra", "Một thói quen mỗi ngày"],
        "Present perfect với 'Have you ever...?' hỏi xem ai đó đã từng có trải nghiệm đó chưa.",
        "Nhìn vào cụm 'Have you ever'."
      ),
      mc(
        "girl-g5-en-rea-x004",
        4,
        "Leo nói rằng bạn ấy chưa từng đứng gần vật gì như vậy?",
        "D",
        "Những bộ hóa thạch rất lớn",
        ["Một chiếc xe buýt cũ", "Một cái máy ảnh mới", "Một cây cổ thụ"],
        "Leo nói 'I have never stood this close to such huge fossils.'",
        "Tìm câu Leo thì thầm trong phòng thứ hai."
      ),
      mc(
        "girl-g5-en-rea-x004",
        5,
        "Từ 'postcard' trong bài nghĩa là gì?",
        "A",
        "Bưu thiếp",
        ["Vé vào cổng", "Bản đồ cổ", "Quyển sổ ghi chép"],
        "Postcard là bưu thiếp, món Sara mua cho bà.",
        "Đó là món quà giấy nhỏ thường có hình đẹp."
      ),
      mc(
        "girl-g5-en-rea-x004",
        6,
        "Việc nào xảy ra sau bữa trưa?",
        "C",
        "Sara mua một bưu thiếp cho bà",
        ["Cả lớp cất túi vào locker", "Các bạn nhìn bản đồ cổ", "Hướng dẫn viên bắt đầu chuyến tham quan"],
        "Sau bữa trưa trong vườn, Sara bought a postcard for her grandmother.",
        "Đọc câu ngay sau 'After lunch'."
      ),
      mc(
        "girl-g5-en-rea-x004",
        7,
        "Câu nào trong bài là một ví dụ của present perfect?",
        "B",
        "She has already decided to visit the museum again.",
        ["They arrived at nine o'clock.", "Sara bought a postcard for her grandmother.", "The class ate lunch in the museum garden."],
        "Has already decided là present perfect, nhấn mạnh quyết định đã có trước hiện tại.",
        "Hãy tìm câu có has + past participle."
      ),
      mc(
        "girl-g5-en-rea-x004",
        8,
        "Theo bài đọc, vì sao Sara cảm thấy vui?",
        "D",
        "Vì bạn ấy học được nhiều điều mới",
        ["Vì bạn ấy được nghỉ học cả tuần", "Vì bạn ấy không phải làm bài kiểm tra", "Vì bạn ấy mua rất nhiều quà"],
        "Câu cuối nói Sara felt happy because she learned many new facts.",
        "Đọc phần kết của đoạn văn."
      ),
      tf(
        "girl-g5-en-rea-x004",
        9,
        "Sara đã từng nhìn thấy chiếc máy in cổ trước chuyến đi này.",
        false,
        "Sai vì bài đọc nói Sara had not seen one before.",
        "So sánh trải nghiệm của Sara với bạn Leo."
      ),
      fb(
        "girl-g5-en-rea-x004",
        10,
        "Điền vào chỗ trống: Sara has already decided to visit the museum again next _____.",
        "month",
        "Cuối bài cho biết Sara đã quyết định sẽ quay lại bảo tàng cùng gia đình vào tháng sau.",
        "Đây là đơn vị thời gian dài hơn tuần."
      ),
    ],
  })
);

girl08.push(
  lesson({
    id: "girl-g5-en-wri-x001",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 76,
    title: "Viết lời khuyên với should và shouldn't",
    learningObjective: "Sau bài này bé sẽ viết được câu khuyên bảo đơn giản với should và shouldn't, đồng thời tránh các lỗi thường gặp khi thêm to hoặc chia sai động từ.",
    shortExplanation: "Should dùng để khuyên nên làm gì, còn shouldn't dùng để khuyên không nên làm gì.",
    storyContext: "Yumi đang viết bảng lời khuyên sức khỏe cho câu lạc bộ chăm sóc bản thân ở trường.",
    content: `# Should / Shouldn't ✏️

## Quy tắc ngữ pháp

Ta dùng **should** để đưa ra lời khuyên tích cực và **shouldn't** để nói điều không nên làm. Sau cả hai từ này, động từ luôn ở dạng nguyên mẫu, không thêm **to**, không thêm **-s**.

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Khẳng định | Subject + should + verb | "You should drink water." |
| Phủ định | Subject + shouldn't + verb | "You shouldn't stay up late." |
| Câu hỏi | Should + subject + verb? | "Should I take this medicine?" |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "You should rest after school." | Đúng vì sau should là động từ nguyên mẫu. |
| ❌ "You should to rest after school." | Sai vì không dùng **to** sau should. |
| ✅ "He shouldn't eat too much candy." | Đúng vì shouldn't + eat. |
| ❌ "He shouldn't eats too much candy." | Sai vì không thêm **-s** vào động từ sau modal verb. |
| ✅ "Should we open the window?" | Đúng vì câu hỏi bắt đầu bằng Should. |
| ❌ "Do we should open the window?" | Sai vì không dùng do với should. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "She should to sleep early."
> ✅ Hãy viết: "She should sleep early."
> Lý do: modal verb đi với động từ nguyên mẫu không có **to**.

> ❌ Đừng viết: "He shouldn't drinks cola."
> ✅ Hãy viết: "He shouldn't drink cola."
> Lý do: sau shouldn't, động từ không thêm **-s**.`,
    questions: [
      mc(
        "girl-g5-en-wri-x001",
        1,
        "Câu nào viết đúng ngữ pháp?",
        "B",
        "You should drink more water.",
        ["You should to drink more water.", "You should drinks more water.", "You should drinking more water."],
        "Sau should dùng động từ nguyên mẫu: drink.",
        "Nhìn xem câu nào không có to và không thêm -s."
      ),
      mc(
        "girl-g5-en-wri-x001",
        2,
        "Câu nào là lời khuyên phủ định đúng?",
        "D",
        "You shouldn't stay up late.",
        ["You shouldn't to stay up late.", "You shouldn't stayed up late.", "You shouldn't stays up late."],
        "Shouldn't đi với động từ nguyên mẫu: stay.",
        "Hãy chọn câu có shouldn't + verb."
      ),
      mc(
        "girl-g5-en-wri-x001",
        3,
        "Câu hỏi nào viết đúng với should?",
        "A",
        "Should I call my mum now?",
        ["Do I should call my mum now?", "Should I to call my mum now?", "Shoulds I call my mum now?"],
        "Câu hỏi đúng bắt đầu bằng Should + subject + verb.",
        "Đừng dùng do hay to trong mẫu này."
      ),
      mc(
        "girl-g5-en-wri-x001",
        4,
        "Câu nào đúng khi khuyên bạn bị ho?",
        "C",
        "She should rest at home.",
        ["She should to rest at home.", "She should resting at home.", "She should rests at home."],
        "Should + rest là cấu trúc đúng.",
        "Động từ sau should phải ở dạng nguyên mẫu."
      ),
      mc(
        "girl-g5-en-wri-x001",
        5,
        "Lỗi phổ biến trong câu 'You should to sleep early' là gì?",
        "B",
        "Thêm 'to' sau should",
        ["Thiếu chủ ngữ", "Sai thì quá khứ", "Thiếu mạo từ a"],
        "Should không đi với to, nên phải viết 'should sleep'.",
        "Hãy nhìn ngay sau từ should."
      ),
      mc(
        "girl-g5-en-wri-x001",
        6,
        "Câu nào dùng should để nói ý nghĩa 'nên đeo áo mưa'?",
        "D",
        "You should wear a raincoat.",
        ["You should wears a raincoat.", "You should to wear a raincoat.", "You should wearing a raincoat."],
        "Wear là động từ nguyên mẫu đúng sau should.",
        "Chọn câu có should + wear."
      ),
      mc(
        "girl-g5-en-wri-x001",
        7,
        "Câu nào phù hợp nhất nếu muốn khuyên không nên ăn quá nhiều đồ ngọt?",
        "A",
        "You shouldn't eat too many sweets.",
        ["You shouldn't eats too many sweets.", "You shouldn't to eat too many sweets.", "You don't should eat too many sweets."],
        "Cấu trúc đúng là shouldn't + eat.",
        "Hãy tránh cả to lẫn -s."
      ),
      mc(
        "girl-g5-en-wri-x001",
        8,
        "Sau should hoặc shouldn't, dạng đúng của động từ là gì?",
        "C",
        "Động từ nguyên mẫu",
        ["Danh từ", "Động từ thêm -ing", "Động từ quá khứ"],
        "Modal verb should luôn đi với động từ nguyên mẫu.",
        "Hãy nhớ công thức trong bảng."
      ),
      tf(
        "girl-g5-en-wri-x001",
        9,
        "Trong câu với should, động từ phía sau không thêm to.",
        true,
        "Đúng vì should + verb nguyên mẫu là quy tắc cơ bản.",
        "Nhìn lại dòng công thức trong bài."
      ),
      fb(
        "girl-g5-en-wri-x001",
        10,
        "Điền vào chỗ trống: You shouldn't _____ too much cola before bed.",
        "drink",
        "Sau shouldn't phải dùng drink ở dạng nguyên mẫu.",
        "Đây là động từ chỉ hành động uống."
      ),
    ],
  })
);

girl09.push(
  lesson({
    id: "girl-g5-en-wri-x002",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 77,
    title: "Câu điều kiện loại 1 với if",
    learningObjective: "Sau bài này bé sẽ viết được câu điều kiện loại 1 với If + hiện tại đơn, will + động từ nguyên mẫu và tránh lỗi dùng will ở cả hai mệnh đề.",
    shortExplanation: "First conditional dùng để nói: nếu điều này xảy ra, thì kết quả có thể xảy ra trong tương lai.",
    storyContext: "Mia đang viết poster cho câu lạc bộ môi trường và cần các câu dự đoán rõ ràng, đúng ngữ pháp.",
    content: `# First Conditional ✏️

## Quy tắc ngữ pháp

Ta dùng **first conditional** để nói về điều có thể xảy ra trong tương lai nếu một điều kiện được đáp ứng. Công thức chuẩn là **If + simple present, will + verb**.

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Khẳng định | If + subject + verb, subject + will + verb | "If it rains, we will stay inside." |
| Phủ định kết quả | If + subject + verb, subject + won't + verb | "If you hurry, you won't miss the bus." |
| Đảo vị trí | Subject + will + verb if + subject + verb | "We will plant trees if it is sunny." |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "If she studies, she will pass." | Đúng vì mệnh đề sau if dùng hiện tại đơn. |
| ❌ "If she will study, she will pass." | Sai vì không dùng **will** ngay sau if. |
| ✅ "If we save water, we will help the planet." | Đúng vì kết quả ở mệnh đề will. |
| ❌ "If we saved water, we will help the planet." | Sai vì động từ sau if không ở hiện tại đơn. |
| ✅ "We will stay home if it rains." | Đúng dù đổi vị trí hai mệnh đề. |
| ❌ "We will stay home if it will rain." | Sai vì sau if vẫn không dùng will. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "If she will come, I will smile."
> ✅ Hãy viết: "If she comes, I will smile."
> Lý do: mệnh đề if dùng hiện tại đơn, không dùng will.

> ❌ Đừng viết: "If the weather is nice, we going to the park."
> ✅ Hãy viết: "If the weather is nice, we will go to the park."
> Lý do: mệnh đề kết quả cần có will + động từ nguyên mẫu.`,
    questions: [
      mc(
        "girl-g5-en-wri-x002",
        1,
        "Câu nào đúng theo first conditional?",
        "C",
        "If it rains, we will stay inside.",
        ["If it will rain, we will stay inside.", "If it rains, we stay inside will.", "If it raining, we will stay inside."],
        "Sau if dùng hiện tại đơn: rains. Mệnh đề kết quả dùng will stay.",
        "Kiểm tra xem will đứng ở mệnh đề nào."
      ),
      mc(
        "girl-g5-en-wri-x002",
        2,
        "Lỗi trong câu 'If she will come, I will smile' là gì?",
        "A",
        "Dùng will sau if",
        ["Thiếu chủ ngữ", "Sai dấu phẩy", "Thiếu mạo từ the"],
        "Sau if không dùng will, phải là 'If she comes...'.",
        "Hãy nhìn ngay sau từ if."
      ),
      mc(
        "girl-g5-en-wri-x002",
        3,
        "Câu nào viết đúng nếu nói 'Nếu em học, em sẽ nhớ bài'?",
        "D",
        "If you study, you will remember the lesson.",
        ["If you will study, you will remember the lesson.", "If you studied, you will remember the lesson.", "If you study, you remembering the lesson."],
        "Study là hiện tại đơn trong mệnh đề if, will remember là kết quả tương lai.",
        "Cần đúng cả hai phần của công thức."
      ),
      mc(
        "girl-g5-en-wri-x002",
        4,
        "Câu nào đúng khi đổi vị trí hai mệnh đề?",
        "B",
        "We will plant trees if it is sunny.",
        ["We plant trees if it will be sunny.", "We will plant trees if it will sunny.", "We will planted trees if it is sunny."],
        "Dù mệnh đề kết quả đứng trước, phần sau if vẫn là hiện tại đơn: it is sunny.",
        "Đừng thêm will vào mệnh đề if."
      ),
      mc(
        "girl-g5-en-wri-x002",
        5,
        "Chọn câu viết đúng về việc tiết kiệm điện:",
        "C",
        "If you turn off the fan, you will save electricity.",
        ["If you will turn off the fan, you save electricity.", "If you turn off the fan, you will saving electricity.", "If you turned off the fan, you will save electricity."],
        "Cấu trúc đúng là If + turn off, will save.",
        "Một vế hiện tại đơn, một vế will + verb."
      ),
      mc(
        "girl-g5-en-wri-x002",
        6,
        "Cụm nào phải đứng ở mệnh đề kết quả của first conditional?",
        "A",
        "will + động từ nguyên mẫu",
        ["động từ thêm -ing", "động từ quá khứ", "has + past participle"],
        "Mệnh đề kết quả dùng will + verb để nói điều sẽ xảy ra.",
        "Nhìn bảng công thức ở giữa bài."
      ),
      mc(
        "girl-g5-en-wri-x002",
        7,
        "Câu nào là ví dụ đúng của mệnh đề if?",
        "D",
        "If the bus is late",
        ["If the bus will be late", "If the bus being late", "If the bus was late yesterday"],
        "Mệnh đề if trong first conditional dùng hiện tại đơn: is late.",
        "Chỉ xét phần điều kiện, chưa cần phần kết quả."
      ),
      mc(
        "girl-g5-en-wri-x002",
        8,
        "Nếu muốn nói 'Nếu em dậy sớm, em sẽ không lỡ xe buýt', câu nào đúng?",
        "B",
        "If you get up early, you won't miss the bus.",
        ["If you will get up early, you won't miss the bus.", "If you got up early, you won't miss the bus.", "If you get up early, you won't misses the bus."],
        "Get up là hiện tại đơn, won't miss là kết quả phủ định đúng.",
        "Nhớ rằng won't cũng đi với động từ nguyên mẫu."
      ),
      tf(
        "girl-g5-en-wri-x002",
        9,
        "Trong first conditional, mệnh đề sau if không dùng will.",
        true,
        "Đúng. Sau if ta dùng hiện tại đơn, còn will nằm ở mệnh đề kết quả.",
        "Đây là lỗi phổ biến nhất của cấu trúc này."
      ),
      fb(
        "girl-g5-en-wri-x002",
        10,
        "Điền vào chỗ trống: If she comes on time, we will _____ the game together.",
        "start",
        "Sau will phải dùng start ở dạng nguyên mẫu.",
        "Đây là động từ nghĩa là 'bắt đầu'."
      ),
    ],
  })
);

girl09.push(
  lesson({
    id: "girl-g5-en-wri-x003",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 78,
    title: "Past simple với động từ đều và bất quy tắc",
    learningObjective: "Sau bài này bé sẽ viết đúng past simple với cả động từ thêm -ed và động từ bất quy tắc như go, eat, see.",
    shortExplanation: "Một số động từ chỉ cần thêm -ed, nhưng có những động từ phải học dạng đặc biệt trong quá khứ.",
    storyContext: "Mia đang viết nhật ký cuối tuần và phải chọn đúng dạng quá khứ cho từng việc đã làm.",
    content: `# Past Simple Review ✏️

## Quy tắc ngữ pháp

Past simple dùng để kể việc đã xảy ra và kết thúc trong quá khứ. Với động từ đều, ta thường thêm **-ed**; với động từ bất quy tắc, ta phải nhớ dạng riêng như **go → went**, **eat → ate**, **see → saw**.

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Khẳng định | Subject + past simple verb | "We visited the park." |
| Phủ định | Subject + did not + base verb | "We did not visit the park." |
| Câu hỏi | Did + subject + base verb? | "Did you see the show?" |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "Yesterday, we watched a film." | Đúng vì watch là động từ đều → watched. |
| ❌ "Yesterday, we watch a film." | Sai vì thiếu dạng quá khứ. |
| ✅ "She ate breakfast early." | Đúng vì eat → ate là bất quy tắc. |
| ❌ "She eated breakfast early." | Sai vì không thêm -ed vào eat. |
| ✅ "Did you see the museum?" | Đúng vì sau did dùng động từ nguyên mẫu. |
| ❌ "Did you saw the museum?" | Sai vì sau did không dùng saw. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "We goed home."
> ✅ Hãy viết: "We went home."
> Lý do: go là động từ bất quy tắc.

> ❌ Đừng viết: "Did she ate lunch?"
> ✅ Hãy viết: "Did she eat lunch?"
> Lý do: sau did quay về động từ nguyên mẫu.`,
    questions: [
      mc(
        "girl-g5-en-wri-x003",
        1,
        "Câu nào đúng ở thì quá khứ đơn?",
        "D",
        "We visited our aunt yesterday.",
        ["We visit our aunt yesterday.", "We visiting our aunt yesterday.", "We did visited our aunt yesterday."],
        "Visited là past simple đúng của visit.",
        "Câu kể quá khứ cần động từ quá khứ, không thêm did nếu đã có past form."
      ),
      mc(
        "girl-g5-en-wri-x003",
        2,
        "Dạng quá khứ đúng của 'go' là gì?",
        "B",
        "went",
        ["goed", "gone", "goes"],
        "Go là động từ bất quy tắc nên dạng quá khứ là went.",
        "Đây là một trong ba động từ đặc biệt được nhắc rõ trong bài."
      ),
      mc(
        "girl-g5-en-wri-x003",
        3,
        "Câu nào viết đúng với động từ 'eat'?",
        "A",
        "She ate lunch at noon.",
        ["She eated lunch at noon.", "She eat lunch at noon yesterday.", "She did ate lunch at noon."],
        "Eat là bất quy tắc, quá khứ đúng là ate.",
        "Đừng thêm -ed vào eat."
      ),
      mc(
        "girl-g5-en-wri-x003",
        4,
        "Câu hỏi nào đúng ở past simple?",
        "C",
        "Did you see the new poster?",
        ["Did you saw the new poster?", "Did you seen the new poster?", "You did see the new poster?"],
        "Sau did dùng động từ nguyên mẫu: see.",
        "Tìm câu có did + subject + base verb."
      ),
      mc(
        "girl-g5-en-wri-x003",
        5,
        "Động từ nào là dạng quá khứ đúng của 'see'?",
        "B",
        "saw",
        ["seed", "seen", "seeed"],
        "See ở past simple là saw. Seen là past participle, không dùng ở đây.",
        "Bài đang ôn past simple, không phải present perfect."
      ),
      mc(
        "girl-g5-en-wri-x003",
        6,
        "Câu nào đúng với động từ đều thêm -ed?",
        "D",
        "They played football after school.",
        ["They play football after school yesterday.", "They plaied football after school.", "They did played football after school."],
        "Play là động từ đều, quá khứ đơn là played.",
        "Chọn câu có dạng thêm -ed đúng."
      ),
      mc(
        "girl-g5-en-wri-x003",
        7,
        "Lỗi trong câu 'Did she ate breakfast?' là gì?",
        "A",
        "Sau did phải dùng động từ nguyên mẫu",
        ["Thiếu chủ ngữ she", "Thiếu từ yesterday", "Dùng sai dấu hỏi"],
        "Sau did không dùng ate mà phải quay về eat.",
        "Hãy xem động từ đứng sau did."
      ),
      mc(
        "girl-g5-en-wri-x003",
        8,
        "Câu nào viết đúng về chuyến đi hôm qua?",
        "C",
        "We went to the museum yesterday.",
        ["We goed to the museum yesterday.", "We go to the museum yesterday.", "We did went to the museum yesterday."],
        "Went là dạng quá khứ đúng của go.",
        "Đừng vừa dùng did vừa dùng past form."
      ),
      tf(
        "girl-g5-en-wri-x003",
        9,
        "Trong câu hỏi với did, động từ phía sau trở về dạng nguyên mẫu.",
        true,
        "Đúng. Vì did đã mang dấu hiệu quá khứ nên động từ sau đó dùng dạng gốc.",
        "Nhìn lại ví dụ 'Did you see...?' trong bài."
      ),
      fb(
        "girl-g5-en-wri-x003",
        10,
        "Điền vào chỗ trống: Last night, we _____ a funny film on TV. (see)",
        "saw",
        "See ở past simple là saw, nên câu đúng là 'we saw a funny film'.",
        "Đây là dạng quá khứ bất quy tắc của see."
      ),
    ],
  })
);

girl09.push(
  lesson({
    id: "girl-g5-en-lis-x001",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 79,
    title: "Đoạn hội thoại ở sân bay",
    learningObjective: "Sau bài này bé sẽ hiểu được đoạn hội thoại ngắn ở sân bay, nhận ra từ vựng quen thuộc về chuyến bay và trả lời câu hỏi theo từng lời thoại.",
    shortExplanation: "Bé hãy đọc kỹ từng câu trong hội thoại vì nhiều câu hỏi sẽ hỏi trực tiếp nhân vật đã nói gì.",
    storyContext: "Mia và bố đang chuẩn bị lên máy bay đi nghỉ hè.",
    content: `# At the Airport 🎧

> 🎧 Nghe đoạn hội thoại sau.

---

## Đoạn hội thoại (Transcript)

[Dad]: "Mia, please check your boarding pass. Our flight is at 8:30."
[Mia]: "I have it here, Dad. We are at Gate 6, right?"
[Dad]: "Yes. Put your suitcase next to the chair and keep your backpack with you."
[Mia]: "Okay. Can I buy a bottle of water before we board?"
[Dad]: "Yes, but come back quickly. They will call our flight in ten minutes."
[Mia]: "I will be fast. I don't want to miss the plane!"

---

## Từ mới (New Words)

| English | Vietnamese | Heard in dialogue |
|---|---|---|
| boarding pass | thẻ lên máy bay | "check your boarding pass" |
| flight | chuyến bay | "Our flight is at 8:30." |
| gate | cổng ra máy bay | "We are at Gate 6" |
| suitcase | va-li | "Put your suitcase next to the chair" |
| board | lên máy bay | "before we board" |
| miss | lỡ | "I don't want to miss the plane" |

---

## Ghi nhớ sau khi nghe

- Mia và bố đang chờ gần Gate 6.
- Bố nhắc Mia giữ ba lô bên mình.
- Mia muốn mua nước nhưng phải quay lại nhanh.`,
    questions: [
      mc(
        "girl-g5-en-lis-x001",
        1,
        "Trong lời thoại đầu tiên, bố nói chuyến bay của họ lúc mấy giờ?",
        "B",
        "8:30",
        ["7:30", "8:00", "9:30"],
        "Dad nói rõ: 'Our flight is at 8:30.'",
        "Nhìn vào dòng đầu tiên của bố."
      ),
      mc(
        "girl-g5-en-lis-x001",
        2,
        "Mia hỏi cả hai đang ở cổng số mấy?",
        "D",
        "Gate 6",
        ["Gate 4", "Gate 5", "Gate 8"],
        "Mia nói: 'We are at Gate 6, right?'",
        "Đọc dòng thứ hai của Mia."
      ),
      mc(
        "girl-g5-en-lis-x001",
        3,
        "Bố bảo Mia đặt va-li ở đâu?",
        "A",
        "Bên cạnh cái ghế",
        ["Dưới bàn", "Gần cửa sổ", "Trong quầy hàng"],
        "Dad nói 'Put your suitcase next to the chair'.",
        "Tìm câu có từ suitcase."
      ),
      mc(
        "girl-g5-en-lis-x001",
        4,
        "Mia muốn mua gì trước khi lên máy bay?",
        "C",
        "Một chai nước",
        ["Một chiếc bản đồ", "Một chiếc áo khoác", "Một hộp bánh"],
        "Mia hỏi: 'Can I buy a bottle of water before we board?'",
        "Đọc dòng thứ tư của Mia."
      ),
      mc(
        "girl-g5-en-lis-x001",
        5,
        "Bố nói họ sẽ được gọi chuyến bay sau bao lâu?",
        "B",
        "Mười phút nữa",
        ["Hai phút nữa", "Ba mươi phút nữa", "Một giờ nữa"],
        "Dad nói: 'They will call our flight in ten minutes.'",
        "Tìm cụm thời gian ở lời thoại thứ năm."
      ),
      mc(
        "girl-g5-en-lis-x001",
        6,
        "Trong câu cuối, Mia lo điều gì?",
        "D",
        "Bị lỡ máy bay",
        ["Bị mất ba lô", "Bị khát nước", "Bị quên boarding pass"],
        "Mia nói: 'I don't want to miss the plane!'",
        "Xem dòng cuối Mia nói gì."
      ),
      mc(
        "girl-g5-en-lis-x001",
        7,
        "Từ 'board' trong đoạn hội thoại nghĩa là gì?",
        "A",
        "Lên máy bay",
        ["Mua vé", "Xách hành lý", "Rời sân bay"],
        "Board ở đây nghĩa là bước lên máy bay để bắt đầu chuyến đi.",
        "Đó là việc xảy ra ngay trước khi cất cánh."
      ),
      mc(
        "girl-g5-en-lis-x001",
        8,
        "Từ 'boarding pass' nghĩa là gì?",
        "C",
        "Thẻ lên máy bay",
        ["Bảng giờ bay", "Giấy khai sức khỏe", "Cổng kiểm tra an ninh"],
        "Boarding pass là thẻ cho phép hành khách lên máy bay.",
        "Đây là thứ bố bảo Mia kiểm tra ngay từ đầu."
      ),
      tf(
        "girl-g5-en-lis-x001",
        9,
        "Bố bảo Mia để ba lô trên ghế và đi mua nước thật chậm.",
        false,
        "Sai vì bố bảo Mia giữ ba lô bên mình và quay lại nhanh.",
        "So sánh lời dặn về backpack và about coming back."
      ),
      fb(
        "girl-g5-en-lis-x001",
        10,
        "Điền vào chỗ trống theo lời thoại: 'I don't want to miss the _____!'",
        "plane",
        "Mia nói bạn ấy không muốn lỡ máy bay: miss the plane.",
        "Đây là phương tiện mà cả hai sắp đi."
      ),
    ],
  })
);

girl09.push(
  lesson({
    id: "girl-g5-en-lis-x002",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 80,
    title: "Lời khuyên của bác sĩ",
    learningObjective: "Sau bài này bé sẽ hiểu đoạn hội thoại giữa bác sĩ và bệnh nhân, nhận ra từ vựng về đau ốm và lời khuyên đơn giản bằng tiếng Anh.",
    shortExplanation: "Bé hãy đọc kỹ từng lời của bác sĩ để biết bệnh nhân nên và không nên làm gì.",
    storyContext: "Linh đến phòng khám sau khi bị đau họng và ho.",
    content: `# Doctor's Advice 🎧

> 🎧 Nghe đoạn hội thoại sau.

---

## Đoạn hội thoại (Transcript)

[Doctor]: "Hello, Linh. What is the matter today?"
[Linh]: "My throat hurts, and I have a cough."
[Doctor]: "You should drink warm water and rest after school."
[Linh]: "Can I eat ice cream tonight?"
[Doctor]: "No, you shouldn't. You should take this medicine after dinner."
[Linh]: "Okay, doctor. I will go to bed early."

---

## Từ mới (New Words)

| English | Vietnamese | Heard in dialogue |
|---|---|---|
| matter | vấn đề, bị sao | "What is the matter today?" |
| throat | cổ họng | "My throat hurts" |
| cough | cơn ho | "I have a cough" |
| warm water | nước ấm | "drink warm water" |
| medicine | thuốc | "take this medicine" |
| go to bed early | đi ngủ sớm | "I will go to bed early" |

---

## Ghi nhớ sau khi nghe

- Linh bị đau họng và ho.
- Bác sĩ khuyên uống nước ấm, nghỉ ngơi và uống thuốc.
- Linh không nên ăn kem tối hôm đó.`,
    questions: [
      mc(
        "girl-g5-en-lis-x002",
        1,
        "Trong câu đầu, bác sĩ hỏi Linh điều gì?",
        "C",
        "Hôm nay em bị sao",
        ["Em đã ăn gì sáng nay", "Em mấy tuổi", "Em đến từ lớp nào"],
        "Doctor hỏi: 'What is the matter today?' nghĩa là hôm nay em bị sao.",
        "Đọc lời chào đầu tiên của bác sĩ."
      ),
      mc(
        "girl-g5-en-lis-x002",
        2,
        "Linh nói mình bị gì?",
        "A",
        "Đau họng và ho",
        ["Đau tai và sốt", "Đau bụng và chóng mặt", "Đau đầu và đau chân"],
        "Linh nói: 'My throat hurts, and I have a cough.'",
        "Xem câu trả lời đầu tiên của Linh."
      ),
      mc(
        "girl-g5-en-lis-x002",
        3,
        "Bác sĩ khuyên Linh uống gì?",
        "D",
        "Nước ấm",
        ["Nước đá", "Nước ngọt", "Sữa lạnh"],
        "Doctor nói Linh should drink warm water.",
        "Tìm đồ uống trong lời khuyên của bác sĩ."
      ),
      mc(
        "girl-g5-en-lis-x002",
        4,
        "Linh hỏi liệu tối nay có thể ăn gì?",
        "B",
        "Kem",
        ["Bánh mì", "Canh nóng", "Táo đỏ"],
        "Linh hỏi: 'Can I eat ice cream tonight?'",
        "Đọc câu hỏi của Linh ở dòng thứ tư."
      ),
      mc(
        "girl-g5-en-lis-x002",
        5,
        "Bác sĩ bảo Linh uống thuốc vào lúc nào?",
        "C",
        "Sau bữa tối",
        ["Trước giờ học", "Ngay lúc đó", "Sau khi chơi thể thao"],
        "Doctor nói: 'take this medicine after dinner.'",
        "Tìm cụm thời gian ở lời khuyên thứ hai của bác sĩ."
      ),
      mc(
        "girl-g5-en-lis-x002",
        6,
        "Linh hứa sẽ làm gì ở câu cuối?",
        "A",
        "Đi ngủ sớm",
        ["Ăn thêm kem", "Uống nước lạnh", "Đến trường thật muộn"],
        "Linh nói: 'I will go to bed early.'",
        "Đọc câu cuối cùng của Linh."
      ),
      mc(
        "girl-g5-en-lis-x002",
        7,
        "Từ 'medicine' trong đoạn hội thoại nghĩa là gì?",
        "D",
        "Thuốc",
        ["Khăn ấm", "Bác sĩ", "Bữa tối"],
        "Medicine là thuốc mà bác sĩ bảo Linh uống sau bữa tối.",
        "Đó là thứ giúp Linh khỏe hơn."
      ),
      mc(
        "girl-g5-en-lis-x002",
        8,
        "Câu nào là lời khuyên trực tiếp của bác sĩ?",
        "B",
        "You should drink warm water and rest after school.",
        ["My throat hurts, and I have a cough.", "Can I eat ice cream tonight?", "I will go to bed early."],
        "Đây là câu bác sĩ dùng để khuyên Linh nên làm gì.",
        "Hãy tìm câu bắt đầu bằng You should."
      ),
      tf(
        "girl-g5-en-lis-x002",
        9,
        "Bác sĩ đồng ý cho Linh ăn kem tối hôm đó.",
        false,
        "Sai vì bác sĩ trả lời 'No, you shouldn't.'",
        "Đọc kỹ câu trả lời sau câu hỏi về kem."
      ),
      fb(
        "girl-g5-en-lis-x002",
        10,
        "Điền vào chỗ trống theo lời thoại: 'My _____ hurts, and I have a cough.'",
        "throat",
        "Linh nói cổ họng mình đau, nên từ đúng là throat.",
        "Đây là bộ phận nằm giữa miệng và ngực."
      ),
    ],
  })
);

girl09.push(
  lesson({
    id: "girl-g5-en-spe-x001",
    studentTarget: "girl",
    grade: 5,
    orderIndex: 81,
    title: "Phân biệt âm /ɪ/ và /iː/",
    learningObjective: "Sau bài này bé sẽ nhận ra và phát âm tốt hơn hai nguyên âm /ɪ/ và /iː/ qua bảng từ, cặp từ dễ nhầm và hội thoại mẫu.",
    shortExplanation: "Âm /ɪ/ ngắn hơn và miệng thả lỏng hơn, còn /iː/ dài hơn, kéo ra rõ hơn.",
    storyContext: "Yumi đang luyện phát âm trước giờ kể chuyện bằng tiếng Anh ở lớp.",
    content: `# /ɪ/ and /iː/ 🗣️

## Quy tắc phát âm

Âm **/ɪ/** là âm ngắn, miệng mở vừa và đọc nhanh như trong **ship** hay **sit**. Âm **/iː/** dài hơn, môi kéo nhẹ sang hai bên và giữ âm lâu hơn như trong **sheep** hay **seat**.

---

## Hướng dẫn phát âm

| English word | Gợi ý phát âm (Vietnamese) | Ví dụ câu |
|---|---|---|
| ship | /sip ngắn/ | "The ship is big." |
| sit | /sit ngắn/ | "Please sit here." |
| bit | /bit ngắn/ | "I ate a bit of cake." |
| sheep | /siiip dài/ | "The sheep is white." |
| seat | /siit dài/ | "This seat is mine." |
| feel | /fiiil dài/ | "I feel happy." |

---

## Cặp từ dễ nhầm

| Word A | Word B | Khác nhau ở |
|---|---|---|
| ship | sheep | /ɪ/ ngắn vs /iː/ dài |
| sit | seat | /ɪ/ ngắn vs /iː/ dài |
| bit | beat | /ɪ/ ngắn vs /iː/ dài |
| fill | feel | /ɪ/ ngắn vs /iː/ dài |

---

## Hội thoại mẫu

[Yumi]: "Please **sit** on this **seat**."
[Mina]: "Thank you! I can **feel** the cool breeze."
[Yumi]: "Look at the **sheep** near the hill."
[Mina]: "Yes, and the small **ship** on the lake is pretty."

Luyện đọc chậm từng cặp từ rồi tăng tốc dần để tai nghe rõ sự khác nhau.`,
    questions: [
      mc(
        "girl-g5-en-spe-x001",
        1,
        "Từ nào có âm /ɪ/ ngắn?",
        "A",
        "ship",
        ["sheep", "seat", "feel"],
        "Ship có âm /ɪ/ ngắn ở giữa từ.",
        "Hãy chọn từ đi với âm ngắn, không kéo dài."
      ),
      mc(
        "girl-g5-en-spe-x001",
        2,
        "Từ nào có âm /iː/ dài?",
        "C",
        "seat",
        ["sit", "bit", "ship"],
        "Seat có nguyên âm dài /iː/.",
        "Âm này cần kéo dài hơn khi đọc."
      ),
      mc(
        "girl-g5-en-spe-x001",
        3,
        "Cặp từ nào minh họa đúng sự khác nhau giữa /ɪ/ và /iː/?",
        "B",
        "fill / feel",
        ["cat / cut", "ship / sheep", "hot / hat"],
        "Ship / sheep và fill / feel đều là minimal pairs, nhưng đáp án được hỏi trực tiếp là fill / feel.",
        "Chọn cặp chỉ khác nhau ở độ dài của nguyên âm i."
      ),
      mc(
        "girl-g5-en-spe-x001",
        4,
        "Theo bài học, âm /iː/ được đọc như thế nào?",
        "D",
        "Dài hơn và giữ âm lâu hơn",
        ["Rất ngắn và bật nhanh", "Gần giống âm /a/", "Không mở miệng"],
        "Bài giải thích /iː/ là âm dài, môi kéo nhẹ và giữ âm lâu hơn.",
        "So sánh phần mô tả hai âm ở đầu bài."
      ),
      mc(
        "girl-g5-en-spe-x001",
        5,
        "Trong hội thoại mẫu, từ nào có âm /iː/ dài?",
        "A",
        "feel",
        ["sit", "ship", "hill"],
        "Feel có âm /iː/ dài.",
        "Tìm từ trong câu thứ hai của Mina."
      ),
      mc(
        "girl-g5-en-spe-x001",
        6,
        "Từ nào có cùng âm với 'bit'?",
        "C",
        "sit",
        ["seat", "sheep", "feel"],
        "Bit và sit cùng có âm /ɪ/ ngắn.",
        "Hãy tìm từ có nguyên âm ngắn giống nhau."
      ),
      mc(
        "girl-g5-en-spe-x001",
        7,
        "Câu nào chứa cả một từ âm /ɪ/ và một từ âm /iː/?",
        "B",
        "Please sit on this seat.",
        ["The sheep is white.", "I feel happy today.", "This ship is old."],
        "Sit có /ɪ/, còn seat có /iː/, nên câu này chứa cả hai âm.",
        "Tìm câu có một cặp từ dễ nhầm xuất hiện cùng nhau."
      ),
      mc(
        "girl-g5-en-spe-x001",
        8,
        "Nếu muốn luyện âm /iː/, từ nào phù hợp nhất?",
        "D",
        "sheep",
        ["ship", "bit", "fill"],
        "Sheep là từ mẫu rõ nhất cho âm /iː/ dài.",
        "Chọn từ có thể kéo dài phần nguyên âm ở giữa."
      ),
      tf(
        "girl-g5-en-spe-x001",
        9,
        "Âm /ɪ/ thường ngắn hơn âm /iː/.",
        true,
        "Đúng. /ɪ/ là âm ngắn, còn /iː/ là âm dài.",
        "Nhìn lại phần quy tắc phát âm ở đầu bài."
      ),
      fb(
        "girl-g5-en-spe-x001",
        10,
        "Điền từ còn thiếu trong cặp tối thiểu: sit / ____",
        "seat",
        "Sit / seat là một minimal pair quen thuộc để so sánh /ɪ/ với /iː/.",
        "Từ cần điền là từ chỉ 'ghế ngồi'."
      ),
    ],
  })
);

boy02.push(
  lesson({
    id: "boy-g4-en-rea-x001",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 41,
    title: "Đi quanh thành phố",
    learningObjective: "Sau bài này bé sẽ đọc hiểu một đoạn chỉ đường trong thành phố và nhận ra các giới từ chuyển động như go past, turn left, cross.",
    shortExplanation: "Johnny đang tìm đường tới thư viện, nên bé hãy chú ý từng bước di chuyển trong bài đọc.",
    storyContext: "Johnny và bạn robot đi bộ qua thành phố để tới thư viện mới.",
    content: `# In the City 📖

> Khi đi trong thành phố, mình cần biết tên các nơi chốn và cách chỉ đường thật rõ ràng.

---

## Đọc đoạn văn sau

On Saturday morning, Johnny and his robot friend Max went to the new city library. They started at the bus station because Johnny's dad dropped them there. Max looked at the map and said, “First, go past the bakery. Then turn left at the bank.”

Johnny counted the streets carefully. They walked past a toy shop, crossed the road at the traffic lights, and stopped in front of a post office. “Are we lost?” Johnny asked. Max smiled and pointed ahead. “No. The library is next to the park. We only need to go straight for one more block.”

Soon they reached the park gate. Children were flying kites on the grass, and an old man was feeding pigeons near the fountain. Beside the park, the new library stood between a museum and a small café. Johnny felt proud because he followed every direction correctly. Inside the library, he borrowed a book about space and promised to come back next week.

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| bakery | tiệm bánh | "go past the bakery" |
| turn left | rẽ trái | "turn left at the bank" |
| cross the road | băng qua đường | "crossed the road at the traffic lights" |
| block | dãy nhà, một quãng phố | "one more block" |
| beside | bên cạnh | "Beside the park" |
| borrow | mượn | "he borrowed a book" |

---

## Trước khi làm bài, thử trả lời

- Johnny bắt đầu từ đâu?
- Thư viện nằm cạnh nơi nào?
- Max đã cho Johnny những chỉ dẫn nào?`,
    questions: [
      mc(
        "boy-g4-en-rea-x001",
        1,
        "Johnny và Max bắt đầu hành trình ở đâu?",
        "B",
        "Bến xe buýt",
        ["Công viên", "Bảo tàng", "Tiệm bánh"],
        "Hai bạn bắt đầu ở bus station vì bố Johnny thả họ ở đó.",
        "Đọc câu đầu của đoạn văn."
      ),
      mc(
        "boy-g4-en-rea-x001",
        2,
        "Max bảo Johnny làm gì sau khi đi qua tiệm bánh?",
        "D",
        "Rẽ trái ở ngân hàng",
        ["Rẽ phải ở bảo tàng", "Qua đường ngay", "Vào quán cà phê"],
        "Max nói: 'Then turn left at the bank.'",
        "Xem lời chỉ đường trực tiếp của Max."
      ),
      mc(
        "boy-g4-en-rea-x001",
        3,
        "Hai bạn băng qua đường ở đâu?",
        "A",
        "Ở đèn giao thông",
        ["Ở trước công viên", "Ở bến xe buýt", "Bên cạnh tiệm bánh"],
        "Bài viết nói they crossed the road at the traffic lights.",
        "Tìm cụm 'crossed the road'."
      ),
      mc(
        "boy-g4-en-rea-x001",
        4,
        "Thư viện mới nằm ở đâu?",
        "C",
        "Bên cạnh công viên",
        ["Sau bến xe buýt", "Trong tiệm đồ chơi", "Đối diện ngân hàng"],
        "Max nói library is next to the park, và đoạn cuối cũng xác nhận điều đó.",
        "Hãy chú ý từ next to và beside."
      ),
      mc(
        "boy-g4-en-rea-x001",
        5,
        "Johnny mượn gì khi vào thư viện?",
        "B",
        "Một cuốn sách về không gian",
        ["Một bản đồ thành phố", "Một chiếc diều", "Một bộ rô-bốt"],
        "Câu cuối nói Johnny borrowed a book about space.",
        "Đọc kết thúc của bài."
      ),
      mc(
        "boy-g4-en-rea-x001",
        6,
        "Từ 'cross the road' nghĩa là gì?",
        "D",
        "Băng qua đường",
        ["Đi dọc con đường", "Rẽ vào đường nhỏ", "Đứng ở lề đường"],
        "Cross the road là đi từ bên này sang bên kia đường.",
        "Đó là hành động làm ở chỗ có đèn giao thông."
      ),
      mc(
        "boy-g4-en-rea-x001",
        7,
        "Vì sao Johnny cảm thấy tự hào?",
        "A",
        "Vì bạn ấy đi đúng theo các chỉ dẫn",
        ["Vì bạn ấy mua được bánh", "Vì bạn ấy bay diều rất giỏi", "Vì bạn ấy lái xe buýt"],
        "Bài đọc nói Johnny felt proud because he followed every direction correctly.",
        "Tìm câu gần cuối đoạn văn."
      ),
      mc(
        "boy-g4-en-rea-x001",
        8,
        "Từ 'bakery' trong bài nghĩa là gì?",
        "C",
        "Tiệm bánh",
        ["Thư viện", "Ngân hàng", "Bưu điện"],
        "Bakery là nơi bán bánh mì và bánh ngọt.",
        "Đây là địa điểm đầu tiên Max nhắc tới."
      ),
      tf(
        "boy-g4-en-rea-x001",
        9,
        "Thư viện mới nằm giữa bảo tàng và một quán cà phê nhỏ.",
        true,
        "Đúng. Đoạn cuối nói thư viện đứng giữa một museum và một small café.",
        "Đọc câu mô tả vị trí thư viện ở đoạn cuối."
      ),
      fb(
        "boy-g4-en-rea-x001",
        10,
        "Điền vào chỗ trống: The library is next to the _____.",
        "park",
        "Thư viện nằm cạnh công viên, nên từ cần điền là park.",
        "Đó là nơi trẻ em đang thả diều."
      ),
    ],
  })
);

boy02.push(
  lesson({
    id: "boy-g4-en-rea-x002",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 42,
    title: "Món ăn tuyệt vời và công thức đơn giản",
    learningObjective: "Sau bài này bé sẽ đọc hiểu một đoạn về nấu ăn, từ vựng món ăn và cách dùng can hoặc can't để nói khả năng.",
    shortExplanation: "Johnny đang giúp làm món salad trái cây và học xem ai có thể làm những việc gì trong bếp.",
    storyContext: "Johnny và chị gái làm một bữa ăn nhẹ cho buổi dã ngoại của gia đình.",
    content: `# Fantastic Food 📖

> Trong bếp, mỗi người có thể giúp một việc khác nhau và làm theo từng bước rất vui.

---

## Đọc đoạn văn sau

On Sunday, Johnny and his sister Emma made fruit salad for a family picnic. First, Emma washed the apples and grapes. Johnny could peel bananas, but he couldn't cut the pineapple alone, so Dad helped him with a sharp knife.

Next, Emma mixed the fruit in a large bowl. She added yogurt and a little honey. Johnny read the recipe aloud: “First wash the fruit. Then cut it into small pieces. After that, mix everything together and put it in the fridge for twenty minutes.”

While they waited, Johnny set the table outside. He could carry plates and cups, and Emma could make lemonade. When the salad was ready, everyone tasted it. Mum smiled and said, “This is fresh and sweet!” Johnny felt happy because he learned that he can help in the kitchen when he listens carefully and follows each step.

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| peel | bóc vỏ | "Johnny could peel bananas" |
| pineapple | quả dứa | "cut the pineapple" |
| recipe | công thức nấu ăn | "Johnny read the recipe aloud" |
| mix | trộn | "Emma mixed the fruit" |
| fridge | tủ lạnh | "put it in the fridge" |
| fresh | tươi mát | "This is fresh and sweet" |

---

## Trước khi làm bài, thử trả lời

- Johnny làm được việc gì trong bếp?
- Công thức có mấy bước chính?
- Món salad được để ở đâu trong 20 phút?`,
    questions: [
      mc(
        "boy-g4-en-rea-x002",
        1,
        "Johnny và Emma đã làm món gì?",
        "C",
        "Salad trái cây",
        ["Bánh mì nướng", "Súp rau", "Trứng rán"],
        "Câu đầu nói hai chị em made fruit salad for a family picnic.",
        "Tìm tên món ăn ở câu đầu."
      ),
      mc(
        "boy-g4-en-rea-x002",
        2,
        "Johnny có thể tự làm việc nào?",
        "A",
        "Bóc vỏ chuối",
        ["Cắt dứa một mình", "Làm nước chanh", "Rửa nho và táo"],
        "Bài đọc nói Johnny could peel bananas, nhưng không thể tự cắt dứa.",
        "Xem câu đầu đoạn hai chị em chuẩn bị trái cây."
      ),
      mc(
        "boy-g4-en-rea-x002",
        3,
        "Vì sao bố phải giúp Johnny?",
        "D",
        "Vì Johnny không thể tự cắt quả dứa",
        ["Vì Johnny làm đổ sữa chua", "Vì Emma quên công thức", "Vì bàn ăn quá nặng"],
        "Johnny couldn't cut the pineapple alone, nên Dad helped him.",
        "Hãy tìm câu có couldn't."
      ),
      mc(
        "boy-g4-en-rea-x002",
        4,
        "Theo công thức, sau khi cắt trái cây nhỏ ra thì làm gì tiếp theo?",
        "B",
        "Trộn mọi thứ lại với nhau",
        ["Rửa trái cây lại lần nữa", "Mang ra ngoài sân", "Cho thêm nhiều đường"],
        "Recipe nói: First wash, then cut, after that mix everything together.",
        "Đọc phần Johnny đọc to công thức."
      ),
      mc(
        "boy-g4-en-rea-x002",
        5,
        "Món salad được để ở đâu trong 20 phút?",
        "C",
        "Trong tủ lạnh",
        ["Trên bàn ngoài sân", "Trong lò nướng", "Trong bồn rửa"],
        "Công thức yêu cầu put it in the fridge for twenty minutes.",
        "Tìm từ fridge trong công thức."
      ),
      mc(
        "boy-g4-en-rea-x002",
        6,
        "Từ 'recipe' nghĩa là gì?",
        "A",
        "Công thức nấu ăn",
        ["Chiếc dao sắc", "Bàn ăn ngoài trời", "Bát to để trộn"],
        "Recipe là công thức hướng dẫn các bước nấu món ăn.",
        "Đó là thứ Johnny đọc to cho cả nhà nghe."
      ),
      mc(
        "boy-g4-en-rea-x002",
        7,
        "Ai làm nước chanh?",
        "D",
        "Emma",
        ["Johnny", "Dad", "Mum"],
        "Bài đọc nói Emma could make lemonade.",
        "Đọc phần nói về lúc chờ salad trong tủ lạnh."
      ),
      mc(
        "boy-g4-en-rea-x002",
        8,
        "Câu nào đúng với ý của bài đọc?",
        "B",
        "Johnny can help in the kitchen when he follows each step.",
        ["Johnny can't carry plates and cups.", "Emma can't mix fruit in a bowl.", "Dad can't use a sharp knife."],
        "Câu cuối nói Johnny can help in the kitchen when he listens carefully and follows each step.",
        "Nhìn ý kết luận của bài."
      ),
      tf(
        "boy-g4-en-rea-x002",
        9,
        "Mẹ nói món salad tươi và ngọt.",
        true,
        "Đúng. Mum smiled and said, 'This is fresh and sweet!'",
        "Đọc câu gần cuối đoạn văn."
      ),
      fb(
        "boy-g4-en-rea-x002",
        10,
        "Điền vào chỗ trống: Johnny couldn't cut the _____ alone.",
        "pineapple",
        "Johnny không thể tự cắt quả dứa, nên bố đã giúp bạn ấy.",
        "Đây là loại trái cây có vỏ xù và mắt nhỏ."
      ),
    ],
  })
);

boy02.push(
  lesson({
    id: "boy-g4-en-rea-x003",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 43,
    title: "Cơ thể tuyệt vời và so sánh hơn",
    learningObjective: "Sau bài này bé sẽ đọc hiểu đoạn văn về cơ thể con người và dùng comparative adjectives như stronger, faster, taller trong ngữ cảnh đơn giản.",
    shortExplanation: "Bé sẽ khám phá một ngày hội thể thao và xem các bạn so sánh khả năng của mình thế nào.",
    storyContext: "Trường của Johnny tổ chức ngày hội thể thao với nhiều thử thách cơ thể.",
    content: `# Amazing Bodies 📖

> Cơ thể chúng ta có thể chạy, nhảy, giữ thăng bằng và lớn lên khỏe mạnh mỗi ngày.

---

## Đọc đoạn văn sau

At school sports day, Johnny joined three fun activities. In the first game, he ran across the playground with Ben. Ben was taller, but Johnny was faster, so he reached the finish line first. Their teacher laughed and said, “Different bodies are good at different things.”

Next, the class tried a climbing wall. Mai had stronger arms than Johnny, so she climbed higher and touched the red flag at the top. Johnny did not win that game, but he was proud because he stayed balanced and did not give up.

In the final activity, the children measured how far they could jump. Emma jumped farther than her little brother because her legs were longer. After the games, the coach talked about healthy habits. “If you sleep well and exercise often, your body will grow stronger,” he said. Johnny went home tired but excited. He wrote in his notebook, “Today I learned that being faster is great, but being brave is important too.”

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| taller | cao hơn | "Ben was taller" |
| faster | nhanh hơn | "Johnny was faster" |
| stronger | khỏe hơn | "Mai had stronger arms" |
| balanced | giữ thăng bằng | "he stayed balanced" |
| farther | xa hơn | "Emma jumped farther" |
| brave | dũng cảm | "being brave is important too" |

---

## Trước khi làm bài, thử trả lời

- Ai chạy nhanh hơn ở trò đầu tiên?
- Vì sao Mai leo cao hơn?
- Huấn luyện viên khuyên điều gì để cơ thể khỏe hơn?`,
    questions: [
      mc(
        "boy-g4-en-rea-x003",
        1,
        "Ai về đích trước ở trò chạy đầu tiên?",
        "D",
        "Johnny",
        ["Ben", "Mai", "Emma"],
        "Ben cao hơn nhưng Johnny chạy nhanh hơn nên về đích trước.",
        "Đọc câu nói về first game."
      ),
      mc(
        "boy-g4-en-rea-x003",
        2,
        "Ben được miêu tả như thế nào so với Johnny?",
        "B",
        "Cao hơn",
        ["Nhanh hơn", "Khỏe tay hơn", "Nhảy xa hơn"],
        "Đoạn văn nói rõ Ben was taller.",
        "Tìm tính từ so sánh đi với Ben."
      ),
      mc(
        "boy-g4-en-rea-x003",
        3,
        "Vì sao Mai leo được cao hơn Johnny?",
        "A",
        "Vì tay của bạn ấy khỏe hơn",
        ["Vì bạn ấy chạy nhanh hơn", "Vì chân bạn ấy dài hơn", "Vì bạn ấy có dây thừng riêng"],
        "Mai had stronger arms than Johnny, nên leo cao hơn.",
        "Đọc đoạn nói về climbing wall."
      ),
      mc(
        "boy-g4-en-rea-x003",
        4,
        "Trong hoạt động cuối, ai nhảy xa hơn em trai mình?",
        "C",
        "Emma",
        ["Mai", "Ben", "Teacher"],
        "Emma jumped farther than her little brother.",
        "Tìm tên người trong đoạn nói về jumping."
      ),
      mc(
        "boy-g4-en-rea-x003",
        5,
        "Từ 'balanced' trong bài gần nghĩa nhất với gì?",
        "B",
        "Giữ thăng bằng tốt",
        ["Bị mệt", "Rất cao", "Rất nhanh"],
        "Balanced nghĩa là giữ cơ thể vững và không bị ngã.",
        "Đó là điều Johnny làm tốt ở trò leo tường."
      ),
      mc(
        "boy-g4-en-rea-x003",
        6,
        "Huấn luyện viên nói điều gì sẽ giúp cơ thể khỏe hơn?",
        "D",
        "Ngủ tốt và tập thể dục thường xuyên",
        ["Ăn thật nhiều kẹo", "Leo tường mỗi ngày không nghỉ", "Chỉ chạy nhanh vào cuối tuần"],
        "Coach nói nếu ngủ tốt và exercise often, body will grow stronger.",
        "Đọc lời khuyên trực tiếp của coach."
      ),
      mc(
        "boy-g4-en-rea-x003",
        7,
        "Từ 'stronger' là dạng so sánh của từ nào?",
        "A",
        "strong",
        ["strength", "arm", "sport"],
        "Stronger là comparative adjective của strong.",
        "Hãy bỏ phần -er để tìm từ gốc."
      ),
      mc(
        "boy-g4-en-rea-x003",
        8,
        "Theo Johnny, ngoài việc nhanh hơn thì điều gì cũng quan trọng?",
        "C",
        "Dũng cảm",
        ["Cao hơn", "Nặng hơn", "Yên lặng hơn"],
        "Johnny viết rằng being brave is important too.",
        "Tìm điều Johnny ghi trong sổ ở câu cuối."
      ),
      tf(
        "boy-g4-en-rea-x003",
        9,
        "Johnny thắng trò leo tường vì bạn ấy có cánh tay khỏe nhất.",
        false,
        "Sai vì Mai có cánh tay khỏe hơn và leo cao hơn Johnny.",
        "So sánh Johnny với Mai ở hoạt động thứ hai."
      ),
      fb(
        "boy-g4-en-rea-x003",
        10,
        "Điền vào chỗ trống: Ben was taller, but Johnny was _____, so he reached the finish line first.",
        "faster",
        "Johnny chạy nhanh hơn nên thắng cuộc đua đầu tiên.",
        "Đây là tính từ so sánh nói về tốc độ."
      ),
    ],
  })
);

boy02.push(
  lesson({
    id: "boy-g4-en-rea-x004",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 44,
    title: "Chuyến đi nghỉ với động từ quá khứ đều",
    learningObjective: "Sau bài này bé sẽ đọc hiểu đoạn văn về chuyến đi nghỉ và nhận ra các động từ quá khứ đều thêm -ed trong bối cảnh kể chuyện.",
    shortExplanation: "Johnny ghi nhật ký về chuyến đi biển, vì thế nhiều động từ sẽ ở thì quá khứ đơn.",
    storyContext: "Gia đình Johnny vừa trở về sau một chuyến nghỉ cuối tuần ở biển.",
    content: `# Going on Holiday 📖

> Khi kể lại chuyến đi đã qua, mình thường dùng past simple để nói từng hoạt động theo thứ tự.

---

## Đọc đoạn văn sau

Last weekend, Johnny travelled to Vung Tau with his family. They packed their bags on Friday night and started the trip early on Saturday morning. During the drive, Johnny listened to music and counted the motorbikes on the road.

When the family arrived at the hotel, they opened the windows and smelled the salty sea air. After lunch, Johnny walked on the beach and collected smooth shells. His sister painted a small picture, and Dad carried a kite to the sand. The children played near the water until the sky turned orange.

In the evening, the family visited a seafood market and watched the bright boats in the harbor. Johnny tasted grilled corn and laughed with a friendly shopkeeper. On Sunday, they climbed a hill, looked at the sea again, and returned home before dinner. Johnny wrote, “We enjoyed every part of the trip, and I wanted one more day by the beach.”

---

## Từ mới

| English | Vietnamese | Example from passage |
|---|---|---|
| travelled | đã đi du lịch | "Johnny travelled to Vung Tau" |
| packed | đã đóng gói | "They packed their bags" |
| arrived | đã đến nơi | "the family arrived at the hotel" |
| collected | đã nhặt, sưu tập | "collected smooth shells" |
| visited | đã ghé thăm | "visited a seafood market" |
| returned | đã trở về | "returned home before dinner" |

---

## Trước khi làm bài, thử trả lời

- Gia đình Johnny đi đâu?
- Johnny làm gì trên bãi biển?
- Đoạn văn có những động từ nào thêm -ed?`,
    questions: [
      mc(
        "boy-g4-en-rea-x004",
        1,
        "Johnny đi đâu vào cuối tuần trước?",
        "A",
        "Vũng Tàu",
        ["Đà Lạt", "Huế", "Cần Thơ"],
        "Câu đầu nói Johnny travelled to Vung Tau with his family.",
        "Tìm tên địa điểm ở câu đầu."
      ),
      mc(
        "boy-g4-en-rea-x004",
        2,
        "Gia đình đóng gói hành lý khi nào?",
        "C",
        "Tối thứ Sáu",
        ["Sáng thứ Bảy", "Chiều Chủ nhật", "Trưa thứ Sáu"],
        "Bài đọc nói they packed their bags on Friday night.",
        "Đọc chi tiết về thời gian chuẩn bị chuyến đi."
      ),
      mc(
        "boy-g4-en-rea-x004",
        3,
        "Johnny đã làm gì trên bãi biển sau bữa trưa?",
        "B",
        "Đi bộ và nhặt vỏ sò",
        ["Bay diều và bơi xa", "Mua cá ở chợ", "Ngủ trong khách sạn"],
        "Sau lunch, Johnny walked on the beach and collected smooth shells.",
        "Xem đoạn giữa nói về buổi chiều."
      ),
      mc(
        "boy-g4-en-rea-x004",
        4,
        "Buổi tối cả nhà ghé thăm nơi nào?",
        "D",
        "Một chợ hải sản",
        ["Một bảo tàng", "Một thư viện", "Một sân bóng"],
        "In the evening, the family visited a seafood market.",
        "Đọc đoạn bắt đầu bằng 'In the evening'."
      ),
      mc(
        "boy-g4-en-rea-x004",
        5,
        "Từ 'returned' trong bài nghĩa là gì?",
        "A",
        "Trở về",
        ["Mua thêm", "Đi bộ ra", "Nhảy lên"],
        "Returned home before dinner nghĩa là trở về nhà trước bữa tối.",
        "Đó là hành động cuối của chuyến đi."
      ),
      mc(
        "boy-g4-en-rea-x004",
        6,
        "Câu nào có động từ quá khứ đều đúng theo bài?",
        "C",
        "They packed their bags on Friday night.",
        ["They pack their bags on Friday night.", "They packeding their bags on Friday night.", "They did packed their bags on Friday night."],
        "Packed là past simple đúng của pack.",
        "Động từ đều thường thêm -ed."
      ),
      mc(
        "boy-g4-en-rea-x004",
        7,
        "Johnny nếm món gì ở chợ hải sản?",
        "B",
        "Ngô nướng",
        ["Bánh ngọt", "Súp nóng", "Nước cam"],
        "Đoạn văn nói Johnny tasted grilled corn.",
        "Tìm món ăn được nếm vào buổi tối."
      ),
      mc(
        "boy-g4-en-rea-x004",
        8,
        "Theo đoạn văn, vào Chủ nhật cả nhà làm gì trước khi về nhà?",
        "D",
        "Leo lên một ngọn đồi và ngắm biển",
        ["Đến công viên giải trí", "Mua một chiếc thuyền nhỏ", "Ngủ thêm ở khách sạn"],
        "On Sunday, they climbed a hill, looked at the sea again, and returned home.",
        "Đọc phần gần cuối của bài."
      ),
      tf(
        "boy-g4-en-rea-x004",
        9,
        "Johnny viết rằng bạn ấy muốn có thêm một ngày ở bãi biển.",
        true,
        "Đúng. Câu cuối ghi 'I wanted one more day by the beach.'",
        "Xem phần nhật ký cuối cùng trong ngoặc kép."
      ),
      fb(
        "boy-g4-en-rea-x004",
        10,
        "Điền vào chỗ trống: After lunch, Johnny walked on the beach and _____ smooth shells.",
        "collected",
        "Collected là động từ quá khứ đều mô tả việc Johnny nhặt vỏ sò.",
        "Đây là động từ nghĩa là nhặt, sưu tập."
      ),
    ],
  })
);

boy02.push(
  lesson({
    id: "boy-g4-en-wri-x001",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 45,
    title: "Can và can't để nói khả năng",
    learningObjective: "Sau bài này bé sẽ viết đúng câu với can và can't để nói khả năng, đồng thời tránh lỗi thêm to sau can.",
    shortExplanation: "Can dùng để nói làm được, còn can't dùng để nói không làm được.",
    storyContext: "Johnny đang viết hồ sơ cho câu lạc bộ kỹ năng và phải mô tả mình làm được những gì.",
    content: `# Can / Can't ✏️

## Quy tắc ngữ pháp

Ta dùng **can** để nói một người có thể làm được điều gì. Ta dùng **can't** để nói không thể làm được điều gì. Sau **can / can't**, động từ luôn ở dạng nguyên mẫu, không thêm **to**.

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Khẳng định | Subject + can + verb | "I can swim." |
| Phủ định | Subject + can't + verb | "He can't drive." |
| Câu hỏi | Can + subject + verb? | "Can she cook?" |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "I can swim fast." | Đúng vì can + swim. |
| ❌ "I can to swim fast." | Sai vì không dùng **to** sau can. |
| ✅ "She can't lift the box." | Đúng vì can't + lift. |
| ❌ "She can't lifts the box." | Sai vì không thêm **-s** sau can't. |
| ✅ "Can you draw a cat?" | Đúng vì câu hỏi bắt đầu bằng Can. |
| ❌ "Do you can draw a cat?" | Sai vì không dùng do với can. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "I can to swim."
> ✅ Hãy viết: "I can swim."
> Lý do: can đi với động từ nguyên mẫu.

> ❌ Đừng viết: "He can't rides a bike."
> ✅ Hãy viết: "He can't ride a bike."
> Lý do: sau can't, động từ không thêm **-s**.`,
    questions: [
      mc(
        "boy-g4-en-wri-x001",
        1,
        "Câu nào đúng ngữ pháp?",
        "C",
        "I can ride a bike.",
        ["I can to ride a bike.", "I can rides a bike.", "I can riding a bike."],
        "Sau can dùng ride ở dạng nguyên mẫu.",
        "Không dùng to, -s hay -ing sau can."
      ),
      mc(
        "boy-g4-en-wri-x001",
        2,
        "Câu nào đúng với nghĩa 'Bạn ấy không thể bơi'?",
        "A",
        "He can't swim.",
        ["He can't to swim.", "He can't swims.", "He doesn't can swim."],
        "Can't + swim là cấu trúc phủ định đúng.",
        "Chọn câu có can't + verb."
      ),
      mc(
        "boy-g4-en-wri-x001",
        3,
        "Lỗi chính trong câu 'I can to swim' là gì?",
        "D",
        "Thêm 'to' sau can",
        ["Thiếu chủ ngữ", "Sai dấu chấm", "Dùng sai đại từ"],
        "Can không đi với to, nên phải viết 'can swim'.",
        "Nhìn vào từ đứng ngay sau can."
      ),
      mc(
        "boy-g4-en-wri-x001",
        4,
        "Câu hỏi nào viết đúng với can?",
        "B",
        "Can she cook noodles?",
        ["Do she can cook noodles?", "Can she to cook noodles?", "Cans she cook noodles?"],
        "Câu hỏi đúng là Can + subject + verb.",
        "Đừng dùng do hay thêm s vào can."
      ),
      mc(
        "boy-g4-en-wri-x001",
        5,
        "Câu nào đúng để nói khả năng của Johnny?",
        "C",
        "Johnny can carry the plates.",
        ["Johnny can carries the plates.", "Johnny can to carry the plates.", "Johnny can carrying the plates."],
        "Can + carry là cấu trúc chuẩn.",
        "Động từ sau can phải ở dạng gốc."
      ),
      mc(
        "boy-g4-en-wri-x001",
        6,
        "Câu nào là phủ định đúng?",
        "A",
        "We can't open the jar.",
        ["We can't opens the jar.", "We can't to open the jar.", "We don't can open the jar."],
        "Can't + open là đúng.",
        "Chọn câu có can't + verb nguyên mẫu."
      ),
      mc(
        "boy-g4-en-wri-x001",
        7,
        "Sau can hoặc can't, dạng nào của động từ được dùng?",
        "D",
        "Động từ nguyên mẫu",
        ["Động từ thêm -ed", "Động từ thêm -s", "Động từ thêm -ing"],
        "Can và can't đều đi với động từ nguyên mẫu.",
        "Hãy nhớ bảng công thức."
      ),
      mc(
        "boy-g4-en-wri-x001",
        8,
        "Câu nào viết đúng với nghĩa 'Em có thể vẽ một con rô-bốt'?",
        "B",
        "I can draw a robot.",
        ["I can to draw a robot.", "I can draws a robot.", "I can drawing a robot."],
        "Can + draw là cấu trúc đúng.",
        "Đừng thêm gì sau draw."
      ),
      tf(
        "boy-g4-en-wri-x001",
        9,
        "Sau can, động từ không đi với to.",
        true,
        "Đúng. Can luôn đi với động từ nguyên mẫu không có to.",
        "Nhìn lại ví dụ đầu tiên trong bài."
      ),
      fb(
        "boy-g4-en-wri-x001",
        10,
        "Điền vào chỗ trống: She can't _____ the heavy box.",
        "lift",
        "Sau can't phải dùng lift ở dạng nguyên mẫu.",
        "Đây là động từ nghĩa là nhấc lên."
      ),
    ],
  })
);

boy03.push(
  lesson({
    id: "boy-g4-en-wri-x002",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 46,
    title: "Tính từ so sánh hơn",
    learningObjective: "Sau bài này bé sẽ viết đúng comparative adjectives với từ ngắn, từ dài và hai dạng bất quy tắc better, worse.",
    shortExplanation: "Tính từ ngắn thường thêm -er, tính từ dài dùng more, còn good và bad có dạng đặc biệt.",
    storyContext: "Johnny đang so sánh các vận động viên trong ngày hội thể thao của lớp.",
    content: `# Comparative Adjectives ✏️

## Quy tắc ngữ pháp

Khi so sánh hai người hoặc hai vật, ta dùng **comparative adjectives**. Với tính từ ngắn, thường thêm **-er**; với tính từ dài, dùng **more**. Hai dạng đặc biệt cần nhớ là **good → better** và **bad → worse**.

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Tính từ ngắn | A + be + adj-er + than + B | "Ben is taller than Tom." |
| Tính từ dài | A + be + more + adj + than + B | "A train is more comfortable than a bike." |
| Bất quy tắc | good → better / bad → worse | "This book is better than that one." |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "My bag is heavier than yours." | Đúng vì heavy → heavier. |
| ❌ "My bag is more heavy than yours." | Sai vì heavy là tính từ ngắn. |
| ✅ "A bus is more crowded than a bike." | Đúng vì crowded dài hơn. |
| ❌ "A bus is crowded-er than a bike." | Sai vì không thêm -er cho crowded. |
| ✅ "This game is better than the old one." | Đúng vì good → better. |
| ❌ "This game is gooder than the old one." | Sai vì good không thành gooder. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "badder"
> ✅ Hãy viết: "worse"
> Lý do: bad là tính từ bất quy tắc khi so sánh.

> ❌ Đừng viết: "more tall"
> ✅ Hãy viết: "taller"
> Lý do: tall là tính từ ngắn nên thêm -er.`,
    questions: [
      mc(
        "boy-g4-en-wri-x002",
        1,
        "Câu nào viết đúng?",
        "B",
        "Ben is taller than Tom.",
        ["Ben is more tall than Tom.", "Ben is tall than Tom.", "Ben is tallest than Tom."],
        "Tall là tính từ ngắn nên dạng so sánh là taller.",
        "Chọn câu dùng -er đúng."
      ),
      mc(
        "boy-g4-en-wri-x002",
        2,
        "Dạng so sánh đúng của good là gì?",
        "D",
        "better",
        ["gooder", "more good", "best"],
        "Good là bất quy tắc nên comparative là better.",
        "Đây là một trong hai dạng đặc biệt cần nhớ."
      ),
      mc(
        "boy-g4-en-wri-x002",
        3,
        "Câu nào đúng với tính từ dài?",
        "A",
        "A train is more comfortable than a bike.",
        ["A train is comfortabler than a bike.", "A train is comfortable than a bike.", "A train more comfortable than a bike."],
        "Comfortable là tính từ dài nên dùng more comfortable.",
        "Tính từ nhiều âm tiết thường đi với more."
      ),
      mc(
        "boy-g4-en-wri-x002",
        4,
        "Dạng so sánh đúng của bad là gì?",
        "C",
        "worse",
        ["badder", "more bad", "worst"],
        "Bad có comparative đặc biệt là worse.",
        "Đừng chọn dạng tận cùng -er."
      ),
      mc(
        "boy-g4-en-wri-x002",
        5,
        "Câu nào đúng với heavy?",
        "B",
        "My bag is heavier than yours.",
        ["My bag is more heavy than yours.", "My bag is heavyer than yours.", "My bag heavier than yours is."],
        "Heavy đổi y thành i rồi thêm -er: heavier.",
        "Nhớ quy tắc với từ tận cùng bằng y."
      ),
      mc(
        "boy-g4-en-wri-x002",
        6,
        "Từ nào nên dùng với more thay vì thêm -er?",
        "D",
        "interesting",
        ["tall", "fast", "small"],
        "Interesting là tính từ dài nên dùng more interesting.",
        "Chọn từ dài nhất trong bốn từ."
      ),
      mc(
        "boy-g4-en-wri-x002",
        7,
        "Câu nào viết đúng nghĩa 'Bài này tốt hơn bài cũ'?",
        "A",
        "This lesson is better than the old one.",
        ["This lesson is gooder than the old one.", "This lesson is more good than the old one.", "This lesson better than the old one is."],
        "Better là comparative đúng của good.",
        "Đây là dạng bất quy tắc."
      ),
      mc(
        "boy-g4-en-wri-x002",
        8,
        "Lỗi trong câu 'This road is more narrow than that road' là gì?",
        "C",
        "Narrow là tính từ ngắn nên nên dùng narrower",
        ["Thiếu chủ ngữ", "Sai dấu chấm", "Thiếu than"],
        "Với từ ngắn như narrow ở mức tiểu học, cách thường dùng là narrower than.",
        "Hãy xem nên dùng -er hay more."
      ),
      tf(
        "boy-g4-en-wri-x002",
        9,
        "Good và bad có dạng so sánh hơn bất quy tắc.",
        true,
        "Đúng. Good → better và bad → worse.",
        "Nhớ hai cặp đặc biệt trong bài."
      ),
      fb(
        "boy-g4-en-wri-x002",
        10,
        "Điền vào chỗ trống: My brother is _____ than me at running. (fast)",
        "faster",
        "Fast là tính từ ngắn nên thêm -er thành faster.",
        "Đây là từ chỉ tốc độ."
      ),
    ],
  })
);

boy03.push(
  lesson({
    id: "boy-g4-en-wri-x003",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 47,
    title: "Quy tắc thêm -ed trong past simple",
    learningObjective: "Sau bài này bé sẽ viết đúng các động từ quá khứ đều như played, stopped, studied theo các quy tắc thêm -ed phổ biến.",
    shortExplanation: "Có động từ chỉ thêm -ed, có động từ gấp đôi phụ âm cuối, và có động từ đổi y thành i rồi thêm -ed.",
    storyContext: "Johnny đang viết nhật ký sau giờ học và muốn dùng đúng các động từ quá khứ đều.",
    content: `# Past Simple Spelling Rules ✏️

## Quy tắc ngữ pháp

Với nhiều động từ đều, ta tạo thì quá khứ bằng cách thêm **-ed**. Tuy nhiên, cách thêm có vài quy tắc nhỏ: **play → played** (thêm trực tiếp), **stop → stopped** (gấp đôi phụ âm cuối rồi thêm -ed), **study → studied** (đổi y thành i rồi thêm -ed).

---

## Công thức

| Dạng câu | Cấu trúc | Ví dụ |
|---|---|---|
| Thêm trực tiếp | verb + ed | "We played chess." |
| Gấp đôi phụ âm cuối | short vowel + consonant → double + ed | "He stopped the bike." |
| Đổi y thành i | consonant + y → ied | "She studied English." |

---

## Đúng ✅ và Sai ❌

| Câu | Nhận xét |
|---|---|
| ✅ "They played in the yard." | Đúng vì play chỉ thêm -ed. |
| ❌ "They plaied in the yard." | Sai vì play không đổi y. |
| ✅ "The car stopped near the gate." | Đúng vì stop gấp đôi p. |
| ❌ "The car stoped near the gate." | Sai vì thiếu phụ âm gấp đôi. |
| ✅ "She studied for the test." | Đúng vì study → studied. |
| ❌ "She studyed for the test." | Sai vì phải đổi y thành i trước khi thêm -ed. |

---

## Lỗi thường gặp

> ❌ Đừng viết: "stoped"
> ✅ Hãy viết: "stopped"
> Lý do: stop là từ ngắn có nguyên âm ngắn + phụ âm cuối.

> ❌ Đừng viết: "plaied"
> ✅ Hãy viết: "played"
> Lý do: play có nguyên âm + y nên chỉ thêm -ed.`,
    questions: [
      mc(
        "boy-g4-en-wri-x003",
        1,
        "Dạng quá khứ đúng của play là gì?",
        "A",
        "played",
        ["plaied", "playd", "playeded"],
        "Play chỉ cần thêm -ed thành played.",
        "Không đổi y vì trước y là nguyên âm a."
      ),
      mc(
        "boy-g4-en-wri-x003",
        2,
        "Dạng quá khứ đúng của stop là gì?",
        "C",
        "stopped",
        ["stoped", "stopedd", "stopt"],
        "Stop cần gấp đôi p rồi thêm -ed.",
        "Đây là từ ngắn kết thúc bằng phụ âm."
      ),
      mc(
        "boy-g4-en-wri-x003",
        3,
        "Dạng quá khứ đúng của study là gì?",
        "B",
        "studied",
        ["studyed", "studyd", "stopped"],
        "Study đổi y thành i rồi thêm -ed thành studied.",
        "Nhớ quy tắc với phụ âm + y."
      ),
      mc(
        "boy-g4-en-wri-x003",
        4,
        "Câu nào viết đúng?",
        "D",
        "We played football after school.",
        ["We plaied football after school.", "We play football after school yesterday.", "We playing football after school."],
        "Played là dạng quá khứ đều đúng của play.",
        "Chọn câu có spelling đúng."
      ),
      mc(
        "boy-g4-en-wri-x003",
        5,
        "Vì sao 'stoped' là sai?",
        "A",
        "Vì cần gấp đôi phụ âm cuối thành stopped",
        ["Vì phải đổi o thành a", "Vì không được thêm -ed", "Vì stop là bất quy tắc"],
        "Stop là động từ ngắn nên cần gấp đôi p trước khi thêm -ed.",
        "Nhìn vào chữ cuối của từ."
      ),
      mc(
        "boy-g4-en-wri-x003",
        6,
        "Câu nào đúng với động từ study?",
        "C",
        "She studied English last night.",
        ["She studyed English last night.", "She study English last night.", "She was studied English last night."],
        "Studied là dạng past simple đúng.",
        "Đổi y thành i trước khi thêm -ed."
      ),
      mc(
        "boy-g4-en-wri-x003",
        7,
        "Quy tắc nào đúng cho play → played?",
        "B",
        "Chỉ thêm -ed",
        ["Gấp đôi chữ y", "Đổi y thành i", "Bỏ a trước khi thêm -ed"],
        "Play có nguyên âm + y, nên chỉ thêm -ed.",
        "Không phải mọi từ có y đều đổi y."
      ),
      mc(
        "boy-g4-en-wri-x003",
        8,
        "Câu nào có lỗi chính tả past simple?",
        "D",
        "He stoped at the red light.",
        ["They played in the park.", "She studied in her room.", "We cleaned the table."],
        "Stoped sai vì thiếu chữ p gấp đôi.",
        "Tìm câu có dạng quá khứ viết chưa đúng."
      ),
      tf(
        "boy-g4-en-wri-x003",
        9,
        "Với study, ta đổi y thành i rồi thêm -ed.",
        true,
        "Đúng. Study → studied là quy tắc chuẩn.",
        "Đây là ví dụ có phụ âm đứng trước y."
      ),
      fb(
        "boy-g4-en-wri-x003",
        10,
        "Điền vào chỗ trống: The bus _____ near the school gate. (stop)",
        "stopped",
        "Stop là từ ngắn nên phải gấp đôi p thành stopped.",
        "Đừng quên hai chữ p ở giữa."
      ),
    ],
  })
);

boy03.push(
  lesson({
    id: "boy-g4-en-lis-x001",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 48,
    title: "Mua đồ ở chợ",
    learningObjective: "Sau bài này bé sẽ hiểu một đoạn hội thoại mua bán ở chợ, giá cả đơn giản và các câu lịch sự như Can I have...?, How much is...?.",
    shortExplanation: "Bé hãy chú ý xem người mua muốn gì, giá bao nhiêu và người bán trả lời ra sao.",
    storyContext: "Johnny đi chợ cùng mẹ và tập nói tiếng Anh với người bán hàng.",
    content: `# At the Market 🎧

> 🎧 Nghe đoạn hội thoại sau.

---

## Đoạn hội thoại (Transcript)

[Buyer]: "Good morning. Can I have two apples and a kilo of tomatoes, please?"
[Seller]: "Of course. The apples are 20,000 dong, and the tomatoes are 30,000 dong."
[Buyer]: "Thank you. How much is the watermelon?"
[Seller]: "It is 40,000 dong today."
[Buyer]: "Great. I will take one watermelon too."
[Seller]: "Here you are. Thank you for shopping here."

---

## Từ mới (New Words)

| English | Vietnamese | Heard in dialogue |
|---|---|---|
| buyer | người mua | "[Buyer]..." |
| seller | người bán | "[Seller]..." |
| kilo | ki-lô | "a kilo of tomatoes" |
| watermelon | dưa hấu | "How much is the watermelon?" |
| take | lấy, mua | "I will take one watermelon too." |
| shopping | mua sắm | "Thank you for shopping here." |

---

## Ghi nhớ sau khi nghe

- Người mua muốn táo, cà chua và thêm một quả dưa hấu.
- Người bán nói giá của từng món rất rõ.
- Câu hỏi lịch sự và câu hỏi giá đều xuất hiện trong đoạn hội thoại.`,
    questions: [
      mc(
        "boy-g4-en-lis-x001",
        1,
        "Người mua muốn bao nhiêu quả táo?",
        "B",
        "Hai quả",
        ["Một quả", "Ba quả", "Bốn quả"],
        "Buyer nói rõ: 'two apples'.",
        "Đọc dòng đầu tiên của người mua."
      ),
      mc(
        "boy-g4-en-lis-x001",
        2,
        "Người mua muốn thêm bao nhiêu cà chua?",
        "D",
        "Một ki-lô",
        ["Hai ki-lô", "Ba quả", "Một túi nhỏ"],
        "Buyer nói 'a kilo of tomatoes'.",
        "Tìm đơn vị đi với tomatoes."
      ),
      mc(
        "boy-g4-en-lis-x001",
        3,
        "Táo giá bao nhiêu?",
        "A",
        "20,000 đồng",
        ["30,000 đồng", "40,000 đồng", "50,000 đồng"],
        "Seller nói apples are 20,000 dong.",
        "Đọc câu trả lời đầu tiên của người bán."
      ),
      mc(
        "boy-g4-en-lis-x001",
        4,
        "Người mua hỏi giá của món nào?",
        "C",
        "Dưa hấu",
        ["Táo", "Cà chua", "Nước cam"],
        "Buyer hỏi: 'How much is the watermelon?'",
        "Đọc dòng thứ ba của người mua."
      ),
      mc(
        "boy-g4-en-lis-x001",
        5,
        "Dưa hấu hôm nay giá bao nhiêu?",
        "B",
        "40,000 đồng",
        ["20,000 đồng", "30,000 đồng", "60,000 đồng"],
        "Seller trả lời watermelon is 40,000 dong today.",
        "Tìm con số ở lời thoại thứ tư."
      ),
      mc(
        "boy-g4-en-lis-x001",
        6,
        "Người mua quyết định làm gì sau khi nghe giá dưa hấu?",
        "D",
        "Lấy thêm một quả dưa hấu",
        ["Bỏ luôn cả cà chua", "Chỉ mua táo thôi", "Xin giảm giá"],
        "Buyer nói: 'I will take one watermelon too.'",
        "Đọc dòng thứ năm."
      ),
      mc(
        "boy-g4-en-lis-x001",
        7,
        "Từ 'seller' trong hội thoại nghĩa là gì?",
        "A",
        "Người bán",
        ["Người mua", "Người chở hàng", "Người trồng cây"],
        "Seller là người bán hàng ở chợ.",
        "Nhìn tên người nói đứng trong ngoặc vuông."
      ),
      mc(
        "boy-g4-en-lis-x001",
        8,
        "Câu nào là cách hỏi giá lịch sự trong đoạn hội thoại?",
        "C",
        "How much is the watermelon?",
        ["Can I have two apples?", "I will take one watermelon too.", "Thank you for shopping here."],
        "Đây là câu hỏi trực tiếp về giá của dưa hấu.",
        "Tìm câu bắt đầu bằng How much."
      ),
      tf(
        "boy-g4-en-lis-x001",
        9,
        "Người mua chỉ mua táo và không mua thêm gì khác.",
        false,
        "Sai vì người mua còn mua cà chua và thêm một quả dưa hấu.",
        "Đếm lại các món trong toàn bộ đoạn hội thoại."
      ),
      fb(
        "boy-g4-en-lis-x001",
        10,
        "Điền vào chỗ trống: 'How much is the _____?'",
        "watermelon",
        "Người mua hỏi giá quả dưa hấu nên từ đúng là watermelon.",
        "Đây là loại quả to, xanh bên ngoài và đỏ bên trong."
      ),
    ],
  })
);

boy03.push(
  lesson({
    id: "boy-g4-en-lis-x002",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 49,
    title: "Sau giờ học đã làm gì",
    learningObjective: "Sau bài này bé sẽ hiểu một đoạn hội thoại về các việc đã làm sau giờ học và trả lời các câu hỏi ở thì quá khứ đơn.",
    shortExplanation: "Bé hãy chú ý xem hai người bạn đã làm gì, ở đâu và vào thời điểm nào.",
    storyContext: "Johnny và Ben đang kể cho nhau nghe buổi chiều hôm qua của mình.",
    content: `# After School 🎧

> 🎧 Nghe đoạn hội thoại sau.

---

## Đoạn hội thoại (Transcript)

[Ben]: "Hi Johnny! What did you do after school yesterday?"
[Johnny]: "I played football for an hour and then I visited my grandma."
[Ben]: "Nice! Did you walk to her house?"
[Johnny]: "No, I didn't. Dad drove me there because it started to rain."
[Ben]: "I stayed at home and finished my science project."
[Johnny]: "That was a busy afternoon for both of us!"

---

## Từ mới (New Words)

| English | Vietnamese | Heard in dialogue |
|---|---|---|
| after school | sau giờ học | "after school yesterday" |
| visited | đã thăm | "I visited my grandma" |
| drove | đã chở bằng xe | "Dad drove me there" |
| stayed | đã ở lại | "I stayed at home" |
| finished | đã hoàn thành | "finished my science project" |
| busy | bận rộn | "a busy afternoon" |

---

## Ghi nhớ sau khi nghe

- Johnny chơi bóng và thăm bà.
- Trời mưa nên bố chở Johnny đi.
- Ben ở nhà để hoàn thành dự án khoa học.`,
    questions: [
      mc(
        "boy-g4-en-lis-x002",
        1,
        "Ben hỏi Johnny về thời gian nào?",
        "C",
        "Sau giờ học hôm qua",
        ["Sáng nay", "Cuối tuần trước", "Ngày mai"],
        "Ben hỏi: 'What did you do after school yesterday?'",
        "Đọc câu hỏi đầu tiên của Ben."
      ),
      mc(
        "boy-g4-en-lis-x002",
        2,
        "Johnny nói mình đã chơi môn gì?",
        "A",
        "Bóng đá",
        ["Cầu lông", "Bóng rổ", "Cờ vua"],
        "Johnny trả lời: 'I played football for an hour.'",
        "Tìm hoạt động đầu tiên Johnny nhắc tới."
      ),
      mc(
        "boy-g4-en-lis-x002",
        3,
        "Sau khi chơi bóng, Johnny đã đi đâu?",
        "D",
        "Đến thăm bà",
        ["Về thư viện", "Ra chợ", "Tới công viên"],
        "Johnny nói sau đó mình visited my grandma.",
        "Đọc hết câu trả lời đầu tiên của Johnny."
      ),
      mc(
        "boy-g4-en-lis-x002",
        4,
        "Johnny có đi bộ đến nhà bà không?",
        "B",
        "Không",
        ["Có", "Chỉ đi nửa đường", "Bài không nói"],
        "Johnny trả lời 'No, I didn't.'",
        "Đọc câu trả lời cho câu hỏi của Ben."
      ),
      mc(
        "boy-g4-en-lis-x002",
        5,
        "Vì sao bố chở Johnny đi?",
        "C",
        "Vì trời bắt đầu mưa",
        ["Vì bà ở quá gần", "Vì Johnny quên giày", "Vì bố muốn mua đồ"],
        "Johnny nói Dad drove me there because it started to rain.",
        "Tìm mệnh đề bắt đầu bằng because."
      ),
      mc(
        "boy-g4-en-lis-x002",
        6,
        "Ben đã làm gì ở nhà?",
        "A",
        "Hoàn thành dự án khoa học",
        ["Nấu bữa tối", "Chơi điện tử", "Đạp xe quanh hồ"],
        "Ben nói mình stayed at home and finished my science project.",
        "Đọc lời thoại thứ năm."
      ),
      mc(
        "boy-g4-en-lis-x002",
        7,
        "Từ 'drove' trong đoạn hội thoại nghĩa là gì?",
        "D",
        "Đã chở hoặc lái xe",
        ["Đã đi bộ", "Đã đứng chờ", "Đã chạy nhanh"],
        "Drove là quá khứ của drive, nghĩa là lái hoặc chở bằng xe.",
        "Đó là việc bố làm vì trời mưa."
      ),
      mc(
        "boy-g4-en-lis-x002",
        8,
        "Câu nào cho thấy cả hai đều bận vào buổi chiều?",
        "B",
        "That was a busy afternoon for both of us!",
        ["Hi Johnny!", "Did you walk to her house?", "I stayed at home."],
        "Johnny kết luận rằng đó là một buổi chiều bận rộn cho cả hai.",
        "Tìm câu cuối cùng của đoạn hội thoại."
      ),
      tf(
        "boy-g4-en-lis-x002",
        9,
        "Ben ra ngoài chơi bóng cùng Johnny sau giờ học.",
        false,
        "Sai vì Ben ở nhà và hoàn thành dự án khoa học.",
        "So sánh hoạt động của Johnny và Ben."
      ),
      fb(
        "boy-g4-en-lis-x002",
        10,
        "Điền vào chỗ trống theo lời thoại: 'Dad drove me there because it started to _____.'",
        "rain",
        "Lý do bố chở Johnny là vì trời bắt đầu mưa.",
        "Đây là động từ chỉ thời tiết xấu có nước từ trời rơi xuống."
      ),
    ],
  })
);

boy03.push(
  lesson({
    id: "boy-g4-en-spe-x001",
    studentTarget: "boy",
    grade: 4,
    orderIndex: 50,
    title: "Phát âm /θ/ và /ð/ với th",
    learningObjective: "Sau bài này bé sẽ phân biệt tốt hơn hai âm /θ/ và /ð/ trong các từ think, three, mouth và the, this, that.",
    shortExplanation: "Cả hai âm đều đặt lưỡi gần răng, nhưng /θ/ bật hơi mạnh hơn còn /ð/ có tiếng rung nhẹ hơn.",
    storyContext: "Johnny đang luyện đọc một đoạn giới thiệu khoa học trước lớp.",
    content: `# /θ/ and /ð/ 🗣️

## Quy tắc phát âm

Âm **/θ/** là âm gió, không rung cổ họng, như trong **think**, **three**, **mouth**. Âm **/ð/** có rung nhẹ ở cổ họng, như trong **the**, **this**, **that**. Cả hai âm thường viết bằng **th**.

---

## Hướng dẫn phát âm

| English word | Gợi ý phát âm (Vietnamese) | Ví dụ câu |
|---|---|---|
| think | /thinh gió/ | "Think about the answer." |
| three | /thrii gió/ | "I have three books." |
| mouth | /mao-th gió/ | "Open your mouth." |
| the | /dờ nhẹ/ | "The cat is black." |
| this | /đis nhẹ/ | "This is my pen." |
| that | /đat nhẹ/ | "That toy is mine." |

---

## Cặp từ dễ nhầm

| Word A | Word B | Khác nhau ở |
|---|---|---|
| think | this | /θ/ gió vs /ð/ rung |
| three | the | /θ/ gió vs /ð/ rung |
| mouth | that | cuối từ /θ/ vs đầu từ /ð/ |

---

## Hội thoại mẫu

[Johnny]: "This is the third thing I want to show."
[Ben]: "I think that is a good idea."
[Johnny]: "Put your thumb near your mouth and say three."
[Ben]: "Then say this and that more softly."

Luyện đọc chậm từng từ rồi đặt tay lên cổ để cảm nhận âm /ð/ có rung nhẹ hơn.`,
    questions: [
      mc(
        "boy-g4-en-spe-x001",
        1,
        "Từ nào có âm /θ/ gió?",
        "D",
        "think",
        ["this", "the", "that"],
        "Think có âm /θ/ không rung cổ họng.",
        "Chọn từ mở đầu bằng th nhưng nghe như hơi gió."
      ),
      mc(
        "boy-g4-en-spe-x001",
        2,
        "Từ nào có âm /ð/ rung nhẹ?",
        "B",
        "this",
        ["three", "mouth", "think"],
        "This có âm /ð/ rung nhẹ ở đầu từ.",
        "Đặt tay lên cổ để nhớ nhóm từ này."
      ),
      mc(
        "boy-g4-en-spe-x001",
        3,
        "Cặp từ nào cho thấy rõ sự khác nhau giữa /θ/ và /ð/?",
        "A",
        "think / this",
        ["cat / cut", "ship / sheep", "pen / pan"],
        "Think dùng /θ/, còn this dùng /ð/ nên là cặp so sánh tốt.",
        "Chọn cặp có cả hai âm th khác nhau."
      ),
      mc(
        "boy-g4-en-spe-x001",
        4,
        "Theo bài học, âm /ð/ có điểm gì khác âm /θ/?",
        "C",
        "Âm /ð/ có rung nhẹ ở cổ họng",
        ["Âm /ð/ luôn rất dài", "Âm /ð/ không cần dùng lưỡi", "Âm /ð/ không viết bằng th"],
        "Bài giải thích /ð/ là âm có rung nhẹ, còn /θ/ là âm gió.",
        "So sánh phần quy tắc đầu bài."
      ),
      mc(
        "boy-g4-en-spe-x001",
        5,
        "Từ nào trong hội thoại mẫu chứa âm /θ/?",
        "B",
        "third",
        ["this", "that", "the"],
        "Third có âm /θ/ ở đầu.",
        "Đọc dòng đầu của Johnny."
      ),
      mc(
        "boy-g4-en-spe-x001",
        6,
        "Từ nào có cùng âm đầu với 'the'?",
        "D",
        "that",
        ["think", "three", "mouth"],
        "The và that đều bắt đầu bằng /ð/.",
        "Chọn từ cùng nhóm với this, the, that."
      ),
      mc(
        "boy-g4-en-spe-x001",
        7,
        "Câu nào nên dùng để luyện cả hai âm /θ/ và /ð/?",
        "A",
        "I think that is the third toy.",
        ["This cat is small.", "She sees three trees.", "The dog runs fast."],
        "Câu này có think /θ/ và that, the /ð/, third /θ/.",
        "Tìm câu chứa nhiều từ có th nhất."
      ),
      mc(
        "boy-g4-en-spe-x001",
        8,
        "Nếu muốn luyện âm cuối /θ/, từ nào phù hợp nhất?",
        "C",
        "mouth",
        ["this", "the", "that"],
        "Mouth kết thúc bằng âm /θ/ rõ ràng.",
        "Chọn từ mà âm th nằm ở cuối."
      ),
      tf(
        "boy-g4-en-spe-x001",
        9,
        "Các từ the, this, that thường thuộc nhóm âm /ð/.",
        true,
        "Đúng. Đây là ba ví dụ cơ bản của âm /ð/ trong bài.",
        "Nhìn lại bảng phát âm."
      ),
      fb(
        "boy-g4-en-spe-x001",
        10,
        "Điền từ còn thiếu trong cặp luyện âm: think / _____",
        "this",
        "Think / this là cặp so sánh hai âm th rất quen thuộc.",
        "Từ cần điền nghĩa là 'này'."
      ),
    ],
  })
);

const batches = [
  {
    filename: "batch-girl-g5-en-08.json",
    data: batch(
      "batch-girl-g5-en-08",
      "Family and Friends 5 (Oxford University Press) — Units 6-8",
      girl08,
      "CEFR A2 Grade 5"
    ),
  },
  {
    filename: "batch-girl-g5-en-09.json",
    data: batch(
      "batch-girl-g5-en-09",
      "Family and Friends 5 (Oxford University Press) — Units 6-8",
      girl09,
      "CEFR A2 Grade 5"
    ),
  },
  {
    filename: "batch-boy-g4-en-02.json",
    data: batch(
      "batch-boy-g4-en-02",
      "Family and Friends 4 (Oxford University Press) — Units 2-8",
      boy02,
      "CEFR A1-A2 Grade 4"
    ),
  },
  {
    filename: "batch-boy-g4-en-03.json",
    data: batch(
      "batch-boy-g4-en-03",
      "Family and Friends 4 (Oxford University Press) — Units 2-8",
      boy03,
      "CEFR A1-A2 Grade 4"
    ),
  },
];

for (const target of [outputDir, manifestDir]) {
  fs.mkdirSync(target, { recursive: true });
}

for (const item of batches) {
  const json = JSON.stringify(item.data, null, 2);
  fs.writeFileSync(path.join(outputDir, item.filename), json);
  fs.writeFileSync(path.join(manifestDir, item.filename), json);
}

console.log("Generated English lesson batches:");
for (const item of batches) {
  console.log(`- ${item.filename}`);
}
