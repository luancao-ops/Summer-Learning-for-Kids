import { PrismaClient } from "@prisma/client";
import { themes } from "../lib/themes";

const prisma = new PrismaClient();

type Check =
  | {
      type: "multiple_choice";
      text: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      hint?: string;
    }
  | {
      type: "true_false";
      text: string;
      correct: boolean;
      explanation: string;
      hint?: string;
    }
  | {
      type: "fill_blank";
      text: string;
      answer: string;
      explanation: string;
      hint?: string;
    };

type LessonSeed = {
  id: string;
  studentTarget: "girl" | "boy";
  grade: number;
  phase: "review" | "prep";
  subjectId: "math" | "vietnamese" | "english";
  orderIndex: number;
  title: string;
  learningObjective: string;
  shortExplanation: string;
  content: string;
  storyContext: string;
  rewardType: string;
  approved?: boolean;
  checks: Check[];
};

const subjects = [
  { id: "math", label: "Toán", emoji: "🔢", orderIndex: 1 },
  { id: "vietnamese", label: "Tiếng Việt", emoji: "📖", orderIndex: 2 },
  { id: "english", label: "Tiếng Anh", emoji: "🌍", orderIndex: 3 },
];

const choreTemplates = [
  { name: "Rửa bát", icon: "🍽️", description: "Rửa sạch và xếp gọn bát đĩa sau bữa ăn." },
  { name: "Quét nhà", icon: "🧹", description: "Quét sạch sàn phòng khách và phòng ngủ." },
  { name: "Lau bàn", icon: "🧽", description: "Lau sạch mặt bàn ăn và bàn học." },
  { name: "Tưới cây", icon: "🌿", description: "Tưới nước cho cây trong nhà và ngoài ban công." },
  { name: "Gấp quần áo", icon: "👕", description: "Gấp gọn quần áo đã phơi khô và xếp vào tủ." },
  { name: "Dọn phòng ngủ", icon: "🛏️", description: "Dọn dẹp và sắp xếp lại phòng ngủ của mình." },
  { name: "Đổ rác", icon: "🗑️", description: "Mang túi rác ra thùng rác ngoài cửa." },
  { name: "Phụ mẹ giao hàng", icon: "🛵", description: "Đi cùng mẹ giao đồ hoặc hỗ trợ mang đồ đến đúng nơi cần gửi." },
  { name: "Phơi đồ", icon: "🧺", description: "Mang quần áo ra phơi gọn gàng và kiểm tra đồ đã được treo chắc chắn." },
  { name: "Dọn vệ sinh toilet", icon: "🚽", description: "Cọ rửa và lau sạch khu vực toilet theo hướng dẫn của ba mẹ." },
];

function mc(text: string, options: string[], correctIndex: number, explanation: string, hint?: string): Check {
  return { type: "multiple_choice", text, options, correctIndex, explanation, hint };
}

function tf(text: string, correct: boolean, explanation: string, hint?: string): Check {
  return { type: "true_false", text, correct, explanation, hint };
}

function blank(text: string, answer: string, explanation: string, hint?: string): Check {
  return { type: "fill_blank", text, answer, explanation, hint };
}

function baseContent(title: string, objective: string, examples: string[]): string {
  return [
    `Bài học: ${title}`,
    objective,
    "Mình đọc chậm từng ý, nhìn ví dụ, rồi thử tự giải một câu nhỏ.",
    ...examples.map((example, index) => `Ví dụ ${index + 1}: ${example}`),
    "Khi chưa chắc, mình dùng gợi ý và thử lại nhẹ nhàng.",
  ].join("\n\n");
}

const lessons: LessonSeed[] = [
  {
    id: "boy-g3-math-1",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "math",
    orderIndex: 1,
    title: "Cộng trừ có nhớ trong phạm vi 1000",
    learningObjective: "Ôn cách cộng, trừ có nhớ và kiểm tra kết quả bằng phép tính ngược.",
    shortExplanation: "Xếp thẳng hàng trăm, chục, đơn vị rồi tính từ phải sang trái.",
    content: baseContent("Cộng trừ có nhớ trong phạm vi 1000", "Mục tiêu: tính cẩn thận từng hàng số.", [
      "248 + 175 = 423 vì 8 + 5 viết 3 nhớ 1.",
      "621 - 278 = 343, có mượn ở hàng chục và hàng trăm.",
    ]),
    storyContext: "Robo-X đang sắp xếp linh kiện vào các hộp số.",
    rewardType: "robot_part",
    checks: [
      mc("248 + 175 bằng bao nhiêu?", ["413", "423", "433", "523"], 1, "248 + 175 = 423 khi cộng đúng từng hàng.", "Cộng từ hàng đơn vị trước."),
      tf("621 - 278 = 343.", true, "621 trừ 278 còn 343.", "Có mượn ở hàng chục."),
      blank("Điền kết quả: 356 + 129 = ___", "485", "356 + 129 = 485.", "6 + 9 viết 5 nhớ 1."),
      mc("Một hộp có 315 ốc vít, thêm 208 ốc vít. Có tất cả bao nhiêu?", ["513", "523", "533", "613"], 1, "315 + 208 = 523.", "Từ khóa 'thêm' thường dùng phép cộng."),
      tf("Muốn kiểm tra phép trừ, ta có thể dùng phép cộng ngược lại.", true, "Ví dụ 621 - 278 = 343 thì 343 + 278 = 621.", "Phép cộng giúp kiểm tra kết quả trừ."),
    ],
  },
  {
    id: "boy-g3-math-2",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "math",
    orderIndex: 2,
    title: "Bảng nhân 2, 3, 4, 5",
    learningObjective: "Nhớ lại các bảng nhân nhỏ và dùng nhân để cộng nhanh các nhóm bằng nhau.",
    shortExplanation: "Phép nhân là cách viết gọn của nhiều nhóm có số lượng bằng nhau.",
    content: baseContent("Bảng nhân 2, 3, 4, 5", "Mục tiêu: nhận ra nhóm bằng nhau và chọn phép nhân phù hợp.", [
      "4 nhóm, mỗi nhóm 5 viên bi: 4 x 5 = 20.",
      "3 hàng, mỗi hàng 4 khối Lego: 3 x 4 = 12.",
    ]),
    storyContext: "Phòng lab cần chia đều khối Lego cho các robot nhỏ.",
    rewardType: "lego_block",
    checks: [
      mc("7 x 4 bằng bao nhiêu?", ["24", "28", "32", "34"], 1, "7 nhóm 4 là 28.", "Có thể cộng 4 bảy lần."),
      tf("5 x 6 bằng 30.", true, "5 x 6 = 30.", "Bảng nhân 5 có đuôi 0 hoặc 5."),
      blank("Điền kết quả: 8 x 3 = ___", "24", "8 x 3 = 24.", "3 + 3 + ... tám lần."),
      mc("Có 4 túi, mỗi túi 5 viên pin. Có tất cả bao nhiêu viên pin?", ["9", "16", "20", "25"], 2, "4 x 5 = 20.", "Các túi có số pin bằng nhau."),
      tf("3 + 3 + 3 + 3 có thể viết là 4 x 3.", true, "Có 4 nhóm, mỗi nhóm 3.", "Đếm số nhóm trước."),
    ],
  },
  {
    id: "boy-g3-math-3",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "math",
    orderIndex: 3,
    title: "Bảng nhân 6, 7, 8, 9",
    learningObjective: "Luyện các bảng nhân lớn hơn bằng cách tách thành phép nhân quen thuộc.",
    shortExplanation: "Có thể tách 8 x 6 thành 5 x 6 cộng 3 x 6.",
    content: baseContent("Bảng nhân 6, 7, 8, 9", "Mục tiêu: tự tin với bảng nhân 6 đến 9.", [
      "8 x 6 = 48 vì 6 x 6 = 36 và thêm 2 x 6 = 12.",
      "9 x 7 = 63 vì 10 x 7 = 70 rồi bớt 7.",
    ]),
    storyContext: "Robo-X cần tính nhanh điểm năng lượng trong đấu trường.",
    rewardType: "arena_level",
    checks: [
      mc("8 x 6 bằng bao nhiêu?", ["42", "46", "48", "56"], 2, "8 x 6 = 48.", "Tách thành 5 x 6 và 3 x 6."),
      tf("9 x 7 = 63.", true, "9 nhóm 7 là 63.", "10 x 7 rồi bớt 7."),
      blank("Điền kết quả: 7 x 8 = ___", "56", "7 x 8 = 56.", "8 x 7 cũng bằng 56."),
      mc("Một đội có 6 bạn, mỗi bạn cầm 9 thẻ. Cả đội có bao nhiêu thẻ?", ["45", "54", "63", "69"], 1, "6 x 9 = 54.", "Có 6 nhóm, mỗi nhóm 9."),
      tf("8 x 9 nhỏ hơn 8 x 8.", false, "8 x 9 lớn hơn 8 x 8 vì thêm một nhóm 8.", "So sánh số nhóm."),
    ],
  },
  {
    id: "boy-g3-math-4",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "math",
    orderIndex: 4,
    title: "Chu vi hình chữ nhật",
    learningObjective: "Tính chu vi hình chữ nhật bằng tổng độ dài bốn cạnh.",
    shortExplanation: "Chu vi hình chữ nhật = (dài + rộng) x 2.",
    content: baseContent("Chu vi hình chữ nhật", "Mục tiêu: biết cộng bốn cạnh quanh một hình.", [
      "Dài 8 cm, rộng 3 cm: chu vi = (8 + 3) x 2 = 22 cm.",
      "Dài 6 cm, rộng 5 cm: chu vi = 22 cm.",
    ]),
    storyContext: "Kỹ sư cần đo hàng rào quanh sân robot.",
    rewardType: "lab_tool",
    checks: [
      mc("Hình chữ nhật dài 8 cm, rộng 3 cm có chu vi là bao nhiêu?", ["11 cm", "19 cm", "22 cm", "24 cm"], 2, "(8 + 3) x 2 = 22 cm.", "Cộng dài và rộng rồi nhân 2."),
      tf("Chu vi là độ dài đi quanh hình.", true, "Chu vi đo đường bao quanh hình.", "Tưởng tượng đi một vòng quanh sân."),
      blank("Điền kết quả: dài 7 cm, rộng 4 cm, chu vi = ___ cm", "22", "(7 + 4) x 2 = 22.", "7 + 4 = 11."),
      mc("Sân Lego dài 9 ô, rộng 2 ô. Chu vi là?", ["11 ô", "18 ô", "22 ô", "27 ô"], 2, "(9 + 2) x 2 = 22 ô.", "Hai cạnh dài và hai cạnh rộng."),
      tf("Chỉ cần lấy dài x rộng là ra chu vi.", false, "Dài x rộng là diện tích, không phải chu vi.", "Chu vi đi quanh viền."),
    ],
  },
  {
    id: "boy-g3-math-5",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "math",
    orderIndex: 5,
    title: "Bài toán chia đều",
    learningObjective: "Dùng phép chia để tìm số đồ vật trong mỗi nhóm bằng nhau.",
    shortExplanation: "Khi chia đều, mỗi nhóm nhận số lượng như nhau.",
    content: baseContent("Bài toán chia đều", "Mục tiêu: nhận ra khi nào cần dùng phép chia.", [
      "24 khối chia đều cho 4 bạn: 24 : 4 = 6.",
      "36 thẻ chia đều vào 6 hộp: mỗi hộp có 6 thẻ.",
    ]),
    storyContext: "Robo-X phân phát năng lượng đều cho các trạm lab.",
    rewardType: "robot_part",
    checks: [
      mc("24 viên kẹo chia đều cho 4 bạn, mỗi bạn được bao nhiêu?", ["4", "5", "6", "8"], 2, "24 : 4 = 6.", "Tìm số trong mỗi nhóm."),
      tf("Chia đều nghĩa là các nhóm có số lượng bằng nhau.", true, "Đó là ý chính của chia đều.", "Mỗi nhóm nhận giống nhau."),
      blank("Điền kết quả: 36 : 6 = ___", "6", "36 : 6 = 6.", "6 x 6 = 36."),
      mc("30 khối Lego chia đều vào 5 hộp. Mỗi hộp có bao nhiêu khối?", ["5", "6", "7", "10"], 1, "30 : 5 = 6.", "Hỏi mỗi hộp."),
      tf("Nếu 18 : 3 = 6 thì 6 x 3 = 18.", true, "Nhân là cách kiểm tra phép chia.", "Dùng phép tính ngược."),
    ],
  },
  {
    id: "boy-g3-vi-1",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 1,
    title: "Vần khó: uyên, ươn, ươm",
    learningObjective: "Nhận ra và đọc đúng một số vần dễ nhầm.",
    shortExplanation: "Nhìn kỹ phần vần ở cuối tiếng để đọc và viết chính xác.",
    content: baseContent("Vần khó: uyên, ươn, ươm", "Mục tiêu: phân biệt ba vần quen mà dễ nhầm.", [
      "chuyến có vần uyên.",
      "vườn có vần ươn, bướm có vần ươm.",
    ]),
    storyContext: "Robo-X quét chữ trên bản đồ thiên nhiên.",
    rewardType: "lab_tool",
    checks: [
      mc("Từ nào có vần uyên?", ["vườn", "chuyến", "bướm", "hươu"], 1, "chuyến có vần uyên.", "Nhìn phần cuối của tiếng."),
      tf("Từ bướm có vần ươm.", true, "bướm chứa vần ươm.", "Đọc chậm: b-ươm-s."),
      blank("Điền vần còn thiếu: v___ hoa", "ườn", "vườn hoa dùng vần ươn.", "Từ chỉ nơi có cây và hoa."),
      mc("Từ nào hợp với câu: Em đi một ___ xe vui vẻ?", ["chuyến", "vườn", "bướm", "lượm"], 0, "Ta nói một chuyến xe.", "Từ này có vần uyên."),
      tf("Vần ươn và ươm viết giống hệt nhau.", false, "Hai vần khác nhau ở âm cuối n và m.", "So sánh chữ cuối."),
    ],
  },
  {
    id: "boy-g3-vi-2",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 2,
    title: "Từ ngữ về thiên nhiên",
    learningObjective: "Xếp các từ chỉ sự vật thiên nhiên vào nhóm phù hợp.",
    shortExplanation: "Từ thiên nhiên có thể chỉ trời, nước, cây cối, con vật hoặc cảnh vật.",
    content: baseContent("Từ ngữ về thiên nhiên", "Mục tiêu: gọi tên và phân nhóm sự vật quanh mình.", [
      "mây, nắng, gió thuộc nhóm bầu trời/thời tiết.",
      "sông, suối, biển thuộc nhóm nước.",
    ]),
    storyContext: "Robo-X khám phá bản đồ ngoài trời.",
    rewardType: "arena_level",
    checks: [
      mc("Từ nào chỉ hiện tượng thời tiết?", ["cái bàn", "cơn gió", "chiếc bút", "quyển vở"], 1, "Cơn gió là hiện tượng thời tiết.", "Nghĩ đến bầu trời."),
      tf("Sông, suối, biển đều liên quan đến nước.", true, "Các từ này đều chỉ nơi có nước.", "Cùng một nhóm nghĩa."),
      blank("Điền từ phù hợp: Trên trời có nhiều đám ___ trắng.", "mây", "Đám mây trắng là cách nói quen thuộc.", "Từ này bay trên trời."),
      mc("Từ nào khác nhóm với núi, đồi, rừng?", ["suối", "ghế", "thác", "biển"], 1, "Ghế là đồ vật trong nhà, không phải cảnh thiên nhiên.", "Tìm từ không thuộc thiên nhiên."),
      tf("Cây phượng là từ chỉ đồ dùng học tập.", false, "Cây phượng là cây trong thiên nhiên.", "Đồ dùng học tập là bút, thước, vở."),
    ],
  },
  {
    id: "boy-g3-vi-3",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 3,
    title: "Câu đơn: Chủ ngữ và vị ngữ",
    learningObjective: "Tìm phần nói về ai/cái gì và phần nói làm gì/thế nào.",
    shortExplanation: "Chủ ngữ trả lời ai/cái gì; vị ngữ cho biết hoạt động hoặc đặc điểm.",
    content: baseContent("Câu đơn: Chủ ngữ và vị ngữ", "Mục tiêu: tách câu thành hai phần rõ ràng.", [
      "Con mèo đang ngủ. Chủ ngữ: Con mèo. Vị ngữ: đang ngủ.",
      "Chiếc xe chạy nhanh. Chủ ngữ: Chiếc xe.",
    ]),
    storyContext: "Robo-X phân tích câu như phân tích mạch điện.",
    rewardType: "lab_tool",
    checks: [
      mc("Trong câu 'Con mèo đang ngủ', chủ ngữ là gì?", ["Con mèo", "đang ngủ", "ngủ", "đang"], 0, "Chủ ngữ là Con mèo.", "Hỏi ai đang ngủ?"),
      tf("Vị ngữ thường cho biết chủ ngữ làm gì hoặc thế nào.", true, "Đó là vai trò của vị ngữ.", "Vị ngữ nằm sau chủ ngữ trong nhiều câu đơn."),
      blank("Điền vị ngữ: Bạn Nam ___ bóng.", "đá", "Bạn Nam đá bóng là câu hoàn chỉnh.", "Hoạt động với quả bóng."),
      mc("Câu nào là câu đơn rõ ràng?", ["Mưa", "Bạn Lan đọc sách.", "Và rồi", "Rất đẹp"], 1, "Câu có chủ ngữ Bạn Lan và vị ngữ đọc sách.", "Cần nói đủ ai làm gì."),
      tf("Trong câu 'Bông hoa nở', 'Bông hoa' là vị ngữ.", false, "Bông hoa là chủ ngữ; nở là vị ngữ.", "Hỏi cái gì nở?"),
    ],
  },
  {
    id: "boy-g3-vi-4",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 4,
    title: "Dấu câu cơ bản",
    learningObjective: "Chọn dấu chấm, dấu hỏi, dấu chấm than phù hợp với ý câu.",
    shortExplanation: "Câu hỏi dùng dấu hỏi, câu kể dùng dấu chấm, câu cảm dùng dấu chấm than.",
    content: baseContent("Dấu câu cơ bản", "Mục tiêu: đọc ý câu để chọn dấu cuối câu.", [
      "Bạn tên là gì? là câu hỏi.",
      "Hôm nay trời đẹp. là câu kể.",
    ]),
    storyContext: "Robo-X cần đặt đúng tín hiệu cuối mỗi dòng lệnh.",
    rewardType: "robot_part",
    checks: [
      mc("Câu 'Bạn đang làm gì___' cần dấu nào?", [".", "?", "!", ","], 1, "Đây là câu hỏi nên dùng dấu hỏi.", "Có từ hỏi 'gì'."),
      tf("Câu bộc lộ cảm xúc mạnh có thể dùng dấu chấm than.", true, "Dấu chấm than thể hiện cảm xúc.", "Ví dụ: Hay quá!"),
      blank("Điền dấu: Hôm nay em học Toán___", ".", "Đây là câu kể nên dùng dấu chấm.", "Câu kể thông báo một việc."),
      mc("Câu nào dùng dấu chấm than hợp lý?", ["Bạn ở đâu!", "Ôi, đẹp quá!", "Em ăn cơm?", "Quyển sách,"], 1, "Câu cảm 'Ôi, đẹp quá!' hợp với dấu chấm than.", "Tìm câu có cảm xúc."),
      tf("Mọi câu đều kết thúc bằng dấu hỏi.", false, "Chỉ câu hỏi mới dùng dấu hỏi.", "Dấu câu phụ thuộc ý câu."),
    ],
  },
  {
    id: "boy-g3-vi-5",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 5,
    title: "Viết câu hoàn chỉnh",
    learningObjective: "Viết câu đủ ý, có chủ ngữ, vị ngữ và dấu câu.",
    shortExplanation: "Một câu hoàn chỉnh thường nói rõ ai/cái gì và làm gì/thế nào.",
    content: baseContent("Viết câu hoàn chỉnh", "Mục tiêu: biến cụm từ ngắn thành câu đủ ý.", [
      "vui vẻ -> Em chơi với bạn rất vui vẻ.",
      "sân trường -> Sân trường hôm nay sạch sẽ.",
    ]),
    storyContext: "Robo-X lắp các mảnh chữ thành câu hoàn chỉnh.",
    rewardType: "lego_block",
    checks: [
      mc("Câu nào hoàn chỉnh nhất?", ["Vui vẻ", "Bạn Minh vui vẻ chào cô.", "Đang chạy", "Ngoài sân"], 1, "Câu này đủ chủ ngữ, vị ngữ và dấu chấm.", "Tìm câu nói đủ ý."),
      tf("Câu hoàn chỉnh nên có dấu câu ở cuối.", true, "Dấu câu giúp người đọc hiểu câu kết thúc.", "Nhìn cuối câu."),
      blank("Điền từ để thành câu: Em ___ sách trong thư viện.", "đọc", "Em đọc sách trong thư viện là câu đủ ý.", "Hoạt động với sách."),
      mc("Từ nào phù hợp để đặt câu tả cảm xúc?", ["vui vẻ", "cái bàn", "thước kẻ", "ba lô"], 0, "Vui vẻ là từ chỉ cảm xúc.", "Cảm xúc là trạng thái của người."),
      tf("Cụm 'trên bàn' đã là một câu hoàn chỉnh.", false, "Cụm này chưa nói rõ chuyện gì xảy ra.", "Cần thêm ai/cái gì và làm gì/thế nào."),
    ],
  },
  {
    id: "boy-g3-en-1",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "english",
    orderIndex: 1,
    title: "Numbers 1-20",
    learningObjective: "Review reading and matching numbers from one to twenty.",
    shortExplanation: "Read the word, then match it with the number symbol.",
    content: baseContent("Numbers 1-20", "Mục tiêu: nối số tiếng Anh với chữ số đúng.", [
      "eleven = 11.",
      "twenty = 20.",
    ]),
    storyContext: "Robo-X counts energy cells in English.",
    rewardType: "lab_tool",
    checks: [
      mc("'Eleven' là số nào?", ["7", "9", "11", "15"], 2, "Eleven nghĩa là 11.", "Âm đầu nghe giống e-le-ven."),
      tf("'Twenty' là 20.", true, "Twenty nghĩa là 20.", "Số tròn sau nineteen."),
      blank("Điền số: fourteen = ___", "14", "Fourteen là 14.", "four + teen."),
      mc("Số 18 viết tiếng Anh là gì?", ["eight", "eighteen", "eighty", "eleven"], 1, "18 là eighteen.", "Có đuôi teen."),
      tf("'Sixteen' là 60.", false, "Sixteen là 16; sixty mới là 60.", "Teen khác ty."),
    ],
  },
  {
    id: "boy-g3-en-2",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "english",
    orderIndex: 2,
    title: "Colors and shapes",
    learningObjective: "Name simple colors and shapes.",
    shortExplanation: "Use color words with shape words, such as red circle.",
    content: baseContent("Colors and shapes", "Mục tiêu: nhận ra màu sắc và hình cơ bản.", [
      "red circle = hình tròn màu đỏ.",
      "blue square = hình vuông màu xanh dương.",
    ]),
    storyContext: "Robo-X sorts colored Lego blocks.",
    rewardType: "lego_block",
    checks: [
      mc("'Red' nghĩa là màu gì?", ["xanh", "đỏ", "vàng", "đen"], 1, "Red là màu đỏ.", "Màu của quả táo đỏ."),
      tf("'Circle' là hình tròn.", true, "Circle nghĩa là hình tròn.", "Giống bánh xe."),
      blank("Điền tiếng Anh: hình vuông = ___", "square", "Square là hình vuông.", "Từ này bắt đầu bằng s."),
      mc("'Blue triangle' là gì?", ["tam giác xanh dương", "hình tròn đỏ", "vuông vàng", "sao tím"], 0, "Blue là xanh dương, triangle là tam giác.", "Dịch từng từ."),
      tf("'Yellow' nghĩa là màu tím.", false, "Yellow là màu vàng.", "Màu của nắng."),
    ],
  },
  {
    id: "boy-g3-en-3",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "english",
    orderIndex: 3,
    title: "Greetings",
    learningObjective: "Use simple greetings and polite replies.",
    shortExplanation: "Greeting words help us start a friendly conversation.",
    content: baseContent("Greetings", "Mục tiêu: chào hỏi đơn giản bằng tiếng Anh.", [
      "Good morning = Chào buổi sáng.",
      "How are you? - I am fine.",
    ]),
    storyContext: "Robo-X greets teammates before a match.",
    rewardType: "sport_medal",
    checks: [
      mc("'Good morning' dùng khi nào?", ["buổi sáng", "buổi tối", "khi đi ngủ", "khi tạm biệt"], 0, "Good morning là chào buổi sáng.", "Morning là buổi sáng."),
      tf("'How are you?' dùng để hỏi thăm.", true, "Câu này hỏi bạn có khỏe không.", "Một câu chào hỏi quen thuộc."),
      blank("Điền từ: I am ___, thank you.", "fine", "I am fine, thank you là câu trả lời lịch sự.", "Từ nghĩa là khỏe/ổn."),
      mc("Khi gặp bạn, câu nào phù hợp?", ["Goodbye forever", "Hello!", "No table", "Blue ruler"], 1, "Hello là lời chào.", "Câu ngắn nhất để chào."),
      tf("'Goodbye' là lời chào tạm biệt.", true, "Goodbye dùng khi rời đi.", "Bye là tạm biệt."),
    ],
  },
  {
    id: "boy-g3-en-4",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "english",
    orderIndex: 4,
    title: "Body parts",
    learningObjective: "Name simple body parts in English.",
    shortExplanation: "Learn words like head, hand, knee, and foot.",
    content: baseContent("Body parts", "Mục tiêu: gọi tên bộ phận cơ thể quen thuộc.", [
      "head = đầu.",
      "hand = bàn tay.",
    ]),
    storyContext: "Robo-X checks its arms and legs before practice.",
    rewardType: "robot_part",
    checks: [
      mc("'Head' nghĩa là gì?", ["tay", "đầu", "chân", "mắt"], 1, "Head là đầu.", "Head ở trên cùng cơ thể."),
      tf("'Hand' là bàn tay.", true, "Hand nghĩa là bàn tay.", "Dùng để cầm đồ."),
      blank("Điền tiếng Anh: chân = ___", "leg", "Leg là chân.", "Robot cũng có leg."),
      mc("'Eyes' là bộ phận nào?", ["tai", "mắt", "mũi", "gối"], 1, "Eyes là mắt.", "Dùng để nhìn."),
      tf("'Foot' là cánh tay.", false, "Foot là bàn chân.", "Nằm dưới cùng."),
    ],
  },
  {
    id: "boy-g3-en-5",
    studentTarget: "boy",
    grade: 3,
    phase: "review",
    subjectId: "english",
    orderIndex: 5,
    title: "School objects",
    learningObjective: "Name everyday classroom objects.",
    shortExplanation: "Use English words for things in a school bag.",
    content: baseContent("School objects", "Mục tiêu: nói tên đồ dùng học tập bằng tiếng Anh.", [
      "book = sách.",
      "ruler = thước kẻ.",
    ]),
    storyContext: "Robo-X packs a school bag for lab class.",
    rewardType: "lab_tool",
    checks: [
      mc("'Pencil' nghĩa là gì?", ["bút chì", "cặp sách", "bàn", "ghế"], 0, "Pencil là bút chì.", "Dùng để viết và có thể tẩy."),
      tf("'Book' là quyển sách.", true, "Book nghĩa là sách.", "Dùng để đọc."),
      blank("Điền tiếng Anh: thước kẻ = ___", "ruler", "Ruler là thước kẻ.", "Từ này bắt đầu bằng r."),
      mc("'School bag' là gì?", ["hộp bút", "cặp sách", "bảng", "cục tẩy"], 1, "School bag là cặp sách.", "Bag là túi/cặp."),
      tf("'Eraser' dùng để xóa.", true, "Eraser là cục tẩy.", "Erase nghĩa là xóa."),
    ],
  },
  {
    id: "girl-g4-math-1",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "math",
    orderIndex: 1,
    title: "Nhân và chia số có nhiều chữ số",
    learningObjective: "Ôn nhân một số có nhiều chữ số với số có một chữ số và phép chia đơn giản.",
    shortExplanation: "Tính từng bước, kiểm tra bằng phép tính ngược khi cần.",
    content: baseContent("Nhân và chia số có nhiều chữ số", "Mục tiêu: giữ hàng số thẳng và tính cẩn thận.", [
      "234 x 5 = 1170.",
      "864 : 4 = 216.",
    ]),
    storyContext: "Vương quốc cần chia ngọc và may ruy băng thật đều.",
    rewardType: "crown",
    checks: [
      mc("234 x 5 bằng bao nhiêu?", ["1070", "1170", "1270", "1350"], 1, "234 x 5 = 1170.", "Nhân từng hàng từ phải sang trái."),
      tf("864 : 4 = 216.", true, "4 x 216 = 864.", "Dùng nhân để kiểm tra chia."),
      blank("Điền kết quả: 125 x 6 = ___", "750", "125 x 6 = 750.", "100 x 6 cộng 25 x 6."),
      mc("Có 3 hộp, mỗi hộp 245 hạt cườm. Có tất cả bao nhiêu?", ["635", "725", "735", "745"], 2, "245 x 3 = 735.", "Các hộp có số hạt bằng nhau."),
      tf("Phép chia có thể kiểm tra bằng phép nhân.", true, "Thương nhân với số chia sẽ ra số bị chia nếu tính đúng.", "Phép tính ngược rất hữu ích."),
    ],
  },
  {
    id: "girl-g4-math-2",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "math",
    orderIndex: 2,
    title: "Số lớn đến hàng triệu",
    learningObjective: "Đọc, viết và so sánh các số lớn đến hàng triệu.",
    shortExplanation: "Tách số thành từng nhóm ba chữ số để đọc dễ hơn.",
    content: baseContent("Số lớn đến hàng triệu", "Mục tiêu: đọc số lớn theo lớp triệu, nghìn, đơn vị.", [
      "4 500 000 đọc là bốn triệu năm trăm nghìn.",
      "3 020 100 lớn hơn 3 002 100.",
    ]),
    storyContext: "Công chúa đếm sao trên bản đồ vương quốc.",
    rewardType: "castle_room",
    checks: [
      mc("4 500 000 đọc là gì?", ["bốn nghìn năm trăm", "bốn triệu năm trăm nghìn", "bốn trăm năm mươi", "bốn triệu năm mươi"], 1, "Số này đọc là bốn triệu năm trăm nghìn.", "Nhìn nhóm triệu trước."),
      tf("1 000 000 là một triệu.", true, "Một triệu có sáu chữ số 0 sau số 1.", "Đếm các số 0."),
      blank("Điền số: hai triệu ba trăm nghìn = ___", "2300000", "Hai triệu ba trăm nghìn viết là 2 300 000.", "Có nhóm triệu và nhóm nghìn."),
      mc("Số nào lớn nhất?", ["3 120 000", "3 102 000", "2 999 999", "3 012 000"], 0, "3 120 000 lớn nhất vì nhóm nghìn là 120.", "So sánh từ trái sang phải."),
      tf("Khi so sánh số lớn, ta bắt đầu từ hàng nhỏ nhất.", false, "Ta so sánh từ hàng lớn nhất bên trái.", "Bên trái quyết định trước."),
    ],
  },
  {
    id: "girl-g4-math-3",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "math",
    orderIndex: 3,
    title: "Phân số cơ bản",
    learningObjective: "Đọc, viết phân số và xác định tử số, mẫu số.",
    shortExplanation: "Tử số ở trên, mẫu số ở dưới và cho biết tổng số phần bằng nhau.",
    content: baseContent("Phân số cơ bản", "Mục tiêu: hiểu phân số qua bánh, hoa, và đồ thủ công.", [
      "3/5 đọc là ba phần năm.",
      "Trong 3/5, 3 là tử số và 5 là mẫu số.",
    ]),
    storyContext: "Công chúa chia bánh trong buổi tiệc vườn.",
    rewardType: "dress",
    checks: [
      mc("Phân số 3/5 đọc là gì?", ["năm phần ba", "ba phần năm", "ba phần tư", "năm phần tám"], 1, "Đọc tử số trước rồi đọc mẫu số.", "Số trên đọc trước."),
      tf("Trong 7/9, số 9 là mẫu số.", true, "9 ở dưới nên là mẫu số.", "Mẫu số ở dưới."),
      blank("Điền mẫu số trong phân số 4/8: ___", "8", "Trong 4/8, mẫu số là 8.", "Số ở dưới gạch."),
      mc("Một dải ruy băng chia 6 phần, dùng 2 phần. Phân số phần đã dùng là?", ["6/2", "2/6", "4/6", "2/4"], 1, "Dùng 2 trên tổng 6 phần nên là 2/6.", "Phần dùng là tử số."),
      tf("Tử số nằm dưới gạch phân số.", false, "Tử số nằm trên gạch.", "Nhớ: tử ở trên."),
    ],
  },
  {
    id: "girl-g4-math-4",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "math",
    orderIndex: 4,
    title: "So sánh phân số cùng mẫu",
    learningObjective: "So sánh hai phân số có cùng mẫu số bằng cách nhìn tử số.",
    shortExplanation: "Cùng mẫu số nghĩa là chia cùng số phần; tử số lớn hơn thì phân số lớn hơn.",
    content: baseContent("So sánh phân số cùng mẫu", "Mục tiêu: so sánh nhanh khi mẫu số giống nhau.", [
      "5/7 lớn hơn 3/7 vì 5 > 3.",
      "2/9 nhỏ hơn 8/9 vì 2 < 8.",
    ]),
    storyContext: "Công chúa chọn phần vải lớn hơn để may váy.",
    rewardType: "craft_material",
    checks: [
      mc("Phân số nào lớn hơn: 3/7 hay 5/7?", ["3/7", "5/7", "bằng nhau", "không so sánh được"], 1, "Cùng mẫu 7, tử số 5 lớn hơn 3.", "So sánh số phía trên."),
      tf("Khi hai phân số cùng mẫu, tử số lớn hơn thì phân số lớn hơn.", true, "Vì các phần chia bằng nhau.", "Mẫu giống nhau rồi."),
      blank("Điền dấu > hoặc <: 2/9 ___ 8/9", "<", "2/9 nhỏ hơn 8/9.", "2 nhỏ hơn 8."),
      mc("Bạn Mai tô 6/10 bức tranh, bạn An tô 4/10. Ai tô nhiều hơn?", ["Mai", "An", "bằng nhau", "không biết"], 0, "6/10 lớn hơn 4/10.", "Cùng mẫu 10."),
      tf("1/5 lớn hơn 4/5.", false, "Cùng mẫu 5, tử số 1 nhỏ hơn 4.", "Nhìn tử số."),
    ],
  },
  {
    id: "girl-g4-math-5",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "math",
    orderIndex: 5,
    title: "Diện tích hình chữ nhật",
    learningObjective: "Tính diện tích hình chữ nhật bằng chiều dài nhân chiều rộng.",
    shortExplanation: "Diện tích cho biết phần mặt phẳng bên trong hình.",
    content: baseContent("Diện tích hình chữ nhật", "Mục tiêu: dùng công thức dài x rộng.", [
      "Dài 6 cm, rộng 4 cm: diện tích = 24 cm2.",
      "Dài 8 m, rộng 3 m: diện tích = 24 m2.",
    ]),
    storyContext: "Công chúa đo nền phòng mới trong lâu đài.",
    rewardType: "castle_room",
    checks: [
      mc("Hình chữ nhật dài 6 cm, rộng 4 cm có diện tích là?", ["10 cm2", "20 cm2", "24 cm2", "28 cm2"], 2, "6 x 4 = 24 cm2.", "Diện tích = dài x rộng."),
      tf("Diện tích đo phần bên trong hình.", true, "Chu vi đo quanh viền, diện tích đo bên trong.", "Tưởng tượng lát gạch mặt sàn."),
      blank("Điền kết quả: dài 7 m, rộng 5 m, diện tích = ___ m2", "35", "7 x 5 = 35.", "Nhân dài với rộng."),
      mc("Một tấm thảm dài 9 m, rộng 2 m. Diện tích là?", ["11 m2", "18 m2", "22 m2", "36 m2"], 1, "9 x 2 = 18 m2.", "Dùng công thức diện tích."),
      tf("Diện tích hình chữ nhật tính bằng (dài + rộng) x 2.", false, "Đó là công thức chu vi.", "Diện tích dùng phép nhân."),
    ],
  },
  {
    id: "girl-g4-vi-1",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 1,
    title: "Từ ghép và từ láy",
    learningObjective: "Phân biệt từ ghép và từ láy qua nghĩa và âm.",
    shortExplanation: "Từ ghép thường ghép các tiếng có nghĩa; từ láy lặp lại âm hoặc vần.",
    content: baseContent("Từ ghép và từ láy", "Mục tiêu: nhận ra cách tạo từ trong tiếng Việt.", [
      "hoa lá là từ ghép.",
      "lung linh là từ láy.",
    ]),
    storyContext: "Công chúa trang trí sổ tay bằng những từ đẹp.",
    rewardType: "craft_material",
    checks: [
      mc("'Lung linh' là loại từ nào?", ["từ ghép", "từ láy", "danh từ riêng", "số từ"], 1, "Lung linh là từ láy vì lặp âm/vần.", "Nghe âm hai tiếng giống nhau một phần."),
      tf("'Bàn ghế' là từ ghép.", true, "Bàn và ghế đều có nghĩa, ghép lại thành nhóm đồ vật.", "Hai tiếng đều có nghĩa rõ."),
      blank("Điền loại từ: 'xinh xắn' là từ ___", "láy", "Xinh xắn là từ láy.", "Hai tiếng có âm gần nhau."),
      mc("Từ nào là từ ghép?", ["rì rào", "xanh xanh", "sách vở", "long lanh"], 2, "Sách vở là từ ghép.", "Hai tiếng đều chỉ đồ học tập."),
      tf("Mọi từ có hai tiếng đều là từ láy.", false, "Từ hai tiếng có thể là từ ghép hoặc từ láy.", "Cần xem nghĩa và âm."),
    ],
  },
  {
    id: "girl-g4-vi-2",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 2,
    title: "Câu kể, câu hỏi, câu cảm",
    learningObjective: "Nhận biết mục đích của câu qua nội dung và dấu câu.",
    shortExplanation: "Câu kể trình bày sự việc, câu hỏi dùng để hỏi, câu cảm bộc lộ cảm xúc.",
    content: baseContent("Câu kể, câu hỏi, câu cảm", "Mục tiêu: đọc đúng mục đích của câu.", [
      "Bạn đang làm gì? là câu hỏi.",
      "Ôi, bông hoa đẹp quá! là câu cảm.",
    ]),
    storyContext: "Công chúa viết lời thoại cho câu chuyện lâu đài.",
    rewardType: "doll_accessory",
    checks: [
      mc("Câu 'Bạn đang làm gì vậy?' thuộc loại nào?", ["câu kể", "câu hỏi", "câu cảm", "câu khiến"], 1, "Có dấu hỏi và dùng để hỏi.", "Nhìn dấu cuối câu."),
      tf("Câu cảm thường bộc lộ cảm xúc.", true, "Câu cảm dùng khi vui, ngạc nhiên, khen ngợi...", "Ví dụ có từ ôi, quá."),
      blank("Điền loại câu: 'Hôm nay trời nắng.' là câu ___", "kể", "Câu này kể một sự việc.", "Không hỏi, không cảm thán."),
      mc("Câu nào là câu cảm?", ["Em học bài.", "Bạn đi đâu?", "Ôi, đẹp quá!", "Lan có quyển vở."], 2, "Câu này bộc lộ cảm xúc.", "Có dấu chấm than."),
      tf("Câu hỏi luôn dùng để thông báo một sự việc.", false, "Câu hỏi dùng để hỏi.", "Câu thông báo là câu kể."),
    ],
  },
  {
    id: "girl-g4-vi-3",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 3,
    title: "Tìm ý chính trong đoạn văn",
    learningObjective: "Xác định câu hoặc ý bao quát nội dung đoạn văn ngắn.",
    shortExplanation: "Ý chính thường trả lời: đoạn này nói về điều gì?",
    content: baseContent("Tìm ý chính trong đoạn văn", "Mục tiêu: đọc đoạn văn và nắm điều quan trọng nhất.", [
      "Nếu đoạn kể về khu vườn buổi sáng, ý chính là vẻ đẹp của khu vườn.",
      "Chi tiết nhỏ giúp làm rõ ý chính.",
    ]),
    storyContext: "Công chúa đọc thư từ các bạn trong vương quốc.",
    rewardType: "castle_room",
    checks: [
      mc("Ý chính trả lời câu hỏi nào?", ["Đoạn này nói về điều gì?", "Có bao nhiêu dấu phẩy?", "Từ nào dài nhất?", "Chữ nào viết hoa?"], 0, "Ý chính là nội dung bao quát của đoạn.", "Tìm điều lớn nhất đoạn nói tới."),
      tf("Chi tiết nhỏ có thể giúp làm rõ ý chính.", true, "Chi tiết bổ sung cho nội dung chính.", "Ý chính là thân cây, chi tiết là cành lá."),
      blank("Điền từ: Ý ___ là nội dung quan trọng nhất của đoạn.", "chính", "Ý chính là nội dung quan trọng nhất.", "Từ cần điền là chính."),
      mc("Đoạn văn tả mưa, gió, bầu trời xám. Ý chính có thể là gì?", ["Bữa cơm gia đình", "Cơn mưa chiều", "Một trận bóng", "Một món đồ chơi"], 1, "Các chi tiết đều hướng về cơn mưa chiều.", "Gộp các chi tiết lại."),
      tf("Ý chính luôn là câu cuối đoạn.", false, "Ý chính có thể ở đầu, giữa, cuối hoặc cần tự rút ra.", "Không nên chỉ nhìn vị trí."),
    ],
  },
  {
    id: "girl-g4-vi-4",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 4,
    title: "Chính tả d, gi, r",
    learningObjective: "Luyện chọn d, gi, r trong một số từ quen thuộc.",
    shortExplanation: "Đọc kỹ nghĩa của từ và ghi nhớ các từ thường gặp.",
    content: baseContent("Chính tả d, gi, r", "Mục tiêu: viết đúng các âm đầu dễ nhầm.", [
      "gia đình viết bằng gi.",
      "rực rỡ viết bằng r.",
    ]),
    storyContext: "Công chúa sửa chữ trên thiệp mời lễ hội.",
    rewardType: "craft_material",
    checks: [
      mc("Từ nào viết đúng?", ["da đình", "gia đình", "ra đình", "dza đình"], 1, "Gia đình viết bằng gi.", "Từ chỉ người thân trong nhà."),
      tf("'rực rỡ' viết bằng r ở cả hai tiếng.", true, "rực rỡ đều bắt đầu bằng r.", "Nghĩ đến ánh sáng đẹp."),
      blank("Điền âm đầu: ___ày dép", "gi", "Giày dép viết bằng gi.", "Đồ mang ở chân."),
      mc("Chọn từ đúng trong câu: Bông hoa rất ___ rỡ.", ["dực", "giực", "rực", "zực"], 2, "Ta viết rực rỡ.", "Từ này chỉ màu sắc sáng đẹp."),
      tf("'dòng sông' viết bằng gi.", false, "Dòng sông viết bằng d.", "Từ này bắt đầu bằng d."),
    ],
  },
  {
    id: "girl-g4-vi-5",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "vietnamese",
    orderIndex: 5,
    title: "Luyện viết câu miêu tả",
    learningObjective: "Viết câu có hình ảnh, đặc điểm và cảm xúc nhẹ nhàng.",
    shortExplanation: "Câu miêu tả giúp người đọc hình dung sự vật rõ hơn.",
    content: baseContent("Luyện viết câu miêu tả", "Mục tiêu: thêm màu sắc, hình dáng, hoạt động vào câu.", [
      "Con mèo trắng nằm cuộn tròn bên cửa sổ.",
      "Bông hoa hồng tỏa hương nhẹ trong nắng sớm.",
    ]),
    storyContext: "Công chúa viết nhật ký về khu vườn thủ công.",
    rewardType: "doll_accessory",
    checks: [
      mc("Câu nào miêu tả rõ nhất?", ["Con mèo.", "Con mèo trắng nằm bên cửa sổ.", "Mèo.", "Có một con."], 1, "Câu có màu sắc và hoạt động rõ.", "Tìm câu giúp em hình dung được."),
      tf("Câu miêu tả có thể nói về màu sắc, hình dáng, hoạt động.", true, "Đó là các chi tiết miêu tả.", "Miêu tả làm hình ảnh rõ hơn."),
      blank("Điền từ gợi tả: Bông hoa ___ trong nắng.", "nở", "Bông hoa nở trong nắng là câu tự nhiên.", "Hoạt động của hoa."),
      mc("Từ nào phù hợp để tả mây?", ["bồng bềnh", "rầm rầm", "sắc nhọn", "ồn ào"], 0, "Bồng bềnh thường dùng để tả mây.", "Từ gợi cảm giác nhẹ."),
      tf("Câu miêu tả càng rõ thì người đọc càng dễ hình dung.", true, "Chi tiết rõ giúp hình ảnh hiện lên trong đầu.", "Thêm đặc điểm phù hợp."),
    ],
  },
  {
    id: "girl-g4-en-1",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "english",
    orderIndex: 1,
    title: "Colors and shapes review",
    learningObjective: "Review color and shape words in short phrases.",
    shortExplanation: "Put color before shape: a pink star, a blue square.",
    content: baseContent("Colors and shapes review", "Mục tiêu: dùng màu sắc và hình dạng trong cụm từ ngắn.", [
      "pink star = ngôi sao màu hồng.",
      "green rectangle = hình chữ nhật màu xanh lá.",
    ]),
    storyContext: "The princess sorts craft stickers by color and shape.",
    rewardType: "craft_material",
    checks: [
      mc("'Pink star' nghĩa là gì?", ["ngôi sao hồng", "hình vuông xanh", "trái tim đỏ", "vòng tròn vàng"], 0, "Pink là hồng, star là ngôi sao.", "Dịch từng từ."),
      tf("'Rectangle' là hình chữ nhật.", true, "Rectangle nghĩa là hình chữ nhật.", "Có hai cạnh dài hơn."),
      blank("Điền tiếng Anh: màu tím = ___", "purple", "Purple là màu tím.", "Màu hợp với vương miện."),
      mc("'Green circle' là gì?", ["tròn xanh lá", "tam giác đỏ", "vuông vàng", "sao xanh"], 0, "Green là xanh lá, circle là tròn.", "Color + shape."),
      tf("'Black' nghĩa là màu trắng.", false, "Black là màu đen; white là màu trắng.", "Hai màu đối lập."),
    ],
  },
  {
    id: "girl-g4-en-2",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "english",
    orderIndex: 2,
    title: "Family members",
    learningObjective: "Name family members and use them in simple sentences.",
    shortExplanation: "Family words help introduce people at home.",
    content: baseContent("Family members", "Mục tiêu: gọi tên người thân bằng tiếng Anh.", [
      "mother = mẹ.",
      "brother = anh/em trai.",
    ]),
    storyContext: "The princess introduces her royal family album.",
    rewardType: "doll_accessory",
    checks: [
      mc("'Mother' nghĩa là gì?", ["bố", "mẹ", "chị gái", "ông"], 1, "Mother là mẹ.", "Mum cũng là mẹ."),
      tf("'Sister' là chị hoặc em gái.", true, "Sister chỉ người nữ cùng thế hệ trong gia đình.", "Brother là trai."),
      blank("Điền tiếng Anh: bố = ___", "father", "Father là bố.", "Dad cũng là cách gọi thân mật."),
      mc("'Grandmother' là ai?", ["bà", "ông", "cô giáo", "bạn"], 0, "Grandmother là bà.", "Grand nghĩa là thế hệ lớn hơn."),
      tf("'Brother' là mẹ.", false, "Brother là anh hoặc em trai.", "Mẹ là mother."),
    ],
  },
  {
    id: "girl-g4-en-3",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "english",
    orderIndex: 3,
    title: "Animals",
    learningObjective: "Review common animal names and simple descriptions.",
    shortExplanation: "Use animal words with simple adjectives like small, big, cute.",
    content: baseContent("Animals", "Mục tiêu: gọi tên con vật quen thuộc.", [
      "rabbit = thỏ.",
      "bird = chim.",
    ]),
    storyContext: "The princess visits a gentle garden full of animals.",
    rewardType: "castle_room",
    checks: [
      mc("'Rabbit' là con gì?", ["mèo", "chó", "thỏ", "cá"], 2, "Rabbit là con thỏ.", "Tai dài."),
      tf("'Bird' có thể bay.", true, "Nhiều loài chim biết bay.", "Bird là chim."),
      blank("Điền tiếng Anh: con cá = ___", "fish", "Fish là con cá.", "Sống dưới nước."),
      mc("'A cute cat' nghĩa là gì?", ["một con mèo dễ thương", "một con chó to", "một con chim xanh", "một con cá nhỏ"], 0, "Cat là mèo, cute là dễ thương.", "Dịch từ cuối trước cũng được."),
      tf("'Dog' nghĩa là con chim.", false, "Dog là con chó.", "Chim là bird."),
    ],
  },
  {
    id: "girl-g4-en-4",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "english",
    orderIndex: 4,
    title: "School objects review",
    learningObjective: "Review classroom and school bag object words.",
    shortExplanation: "Use 'I have a ...' to talk about one object.",
    content: baseContent("School objects review", "Mục tiêu: dùng từ đồ dùng học tập trong câu đơn giản.", [
      "I have a pencil case.",
      "This is my notebook.",
    ]),
    storyContext: "The princess prepares a craft study table.",
    rewardType: "craft_material",
    checks: [
      mc("'Notebook' nghĩa là gì?", ["vở", "thước", "cục tẩy", "bàn"], 0, "Notebook là vở.", "Book là sách, notebook là vở."),
      tf("'Pencil case' là hộp bút.", true, "Pencil case dùng để đựng bút.", "Case là hộp/túi nhỏ."),
      blank("Điền từ: I have a ___ . (một cái thước)", "ruler", "Ruler là thước.", "Dùng để kẻ đường thẳng."),
      mc("'This is my bag' nghĩa là gì?", ["Đây là cặp của tôi", "Kia là bút của bạn", "Tôi có một quyển sách", "Nó màu đỏ"], 0, "This is my bag = Đây là cặp của tôi.", "Bag là cặp/túi."),
      tf("'Eraser' là cái kéo.", false, "Eraser là cục tẩy.", "Cái kéo là scissors."),
    ],
  },
  {
    id: "girl-g4-en-5",
    studentTarget: "girl",
    grade: 4,
    phase: "review",
    subjectId: "english",
    orderIndex: 5,
    title: "Simple sentences",
    learningObjective: "Build simple English sentences with I have and I like.",
    shortExplanation: "Use a short pattern, then change one word to make a new sentence.",
    content: baseContent("Simple sentences", "Mục tiêu: nói câu ngắn rõ nghĩa.", [
      "I have a book.",
      "I like rabbits.",
    ]),
    storyContext: "The princess writes simple labels for her collection.",
    rewardType: "dress",
    checks: [
      mc("Câu nào nghĩa là 'Tôi có một quyển sách'?", ["I have a book.", "I am a book.", "I like blue.", "This is red."], 0, "I have a book là Tôi có một quyển sách.", "Have là có."),
      tf("'I like cats' nghĩa là Tôi thích mèo.", true, "Like là thích, cats là mèo.", "Câu bắt đầu bằng I."),
      blank("Điền từ: I ___ a pencil.", "have", "I have a pencil nghĩa là Tôi có một cây bút chì.", "Từ nghĩa là có."),
      mc("Chọn câu đúng để nói 'Tôi thích màu hồng'.", ["I have pink.", "I like pink.", "I pink like.", "Pink I book."], 1, "I like pink là câu đúng.", "Mẫu: I like + từ."),
      tf("Trong câu đơn giản, thứ tự từ rất quan trọng.", true, "Đổi sai thứ tự có thể làm câu khó hiểu.", "Mẫu câu giúp mình nói đúng."),
    ],
  },
  {
    id: "boy-g4-prep-math-1",
    studentTarget: "boy",
    grade: 4,
    phase: "prep",
    subjectId: "math",
    orderIndex: 6,
    title: "Số La Mã cơ bản",
    learningObjective: "Làm quen với I, V, X và một số số La Mã nhỏ.",
    shortExplanation: "I = 1, V = 5, X = 10; đặt trước để trừ, đặt sau để cộng.",
    content: baseContent("Số La Mã cơ bản", "Mục tiêu: nhận ra các số La Mã thường gặp.", [
      "III = 3.",
      "IV = 4 vì I đứng trước V.",
    ]),
    storyContext: "Robo-X đọc ký hiệu trên cổng đấu trường cổ.",
    rewardType: "arena_level",
    checks: [
      mc("Ký hiệu V là số nào?", ["1", "3", "5", "10"], 2, "V là 5.", "I là 1, V là 5."),
      tf("X là 10.", true, "Trong số La Mã, X = 10.", "Nhìn như hai chữ V ghép lại."),
      blank("Điền số thường: IV = ___", "4", "IV là 4 vì I đứng trước V.", "Một trước năm."),
      mc("Số 3 viết La Mã là gì?", ["III", "VI", "XI", "VV"], 0, "III là 1 + 1 + 1 = 3.", "Ba chữ I."),
      tf("VI nhỏ hơn IV.", false, "VI = 6, IV = 4 nên VI lớn hơn.", "V + I = 6."),
    ],
  },
  {
    id: "boy-g4-prep-vi-1",
    studentTarget: "boy",
    grade: 4,
    phase: "prep",
    subjectId: "vietnamese",
    orderIndex: 6,
    title: "Chủ ngữ và vị ngữ mở rộng",
    learningObjective: "Nhận ra chủ ngữ, vị ngữ trong câu dài hơn.",
    shortExplanation: "Câu dài vẫn có phần nói về ai/cái gì và phần nói điều gì về nó.",
    content: baseContent("Chủ ngữ và vị ngữ mở rộng", "Mục tiêu: tách câu dài thành hai phần chính.", [
      "Buổi sáng, những chú chim nhỏ hót vang trên cành.",
      "Chủ ngữ: những chú chim nhỏ. Vị ngữ: hót vang trên cành.",
    ]),
    storyContext: "Robo-X nâng cấp bộ phân tích ngôn ngữ.",
    rewardType: "lab_tool",
    checks: [
      mc("Trong câu 'Những chú chim nhỏ hót vang', chủ ngữ là gì?", ["Những chú chim nhỏ", "hót vang", "nhỏ hót", "vang"], 0, "Chủ ngữ là Những chú chim nhỏ.", "Hỏi ai hót vang?"),
      tf("Câu dài vẫn có thể tìm chủ ngữ và vị ngữ.", true, "Ta bỏ bớt chi tiết phụ để tìm ý chính.", "Tìm ai/cái gì trước."),
      blank("Điền vị ngữ: Chiếc robot nhỏ ___ trên sân.", "chạy", "Chiếc robot nhỏ chạy trên sân là câu đủ ý.", "Hoạt động di chuyển."),
      mc("Trong câu 'Sau giờ học, Nam đọc truyện', vị ngữ là gì?", ["Sau giờ học", "Nam", "đọc truyện", "giờ học"], 2, "Vị ngữ là đọc truyện.", "Nam làm gì?"),
      tf("Trạng ngữ luôn là chủ ngữ.", false, "Trạng ngữ bổ sung thời gian, nơi chốn..., không phải chủ ngữ.", "Ví dụ: Sau giờ học."),
    ],
  },
  {
    id: "boy-g4-prep-en-1",
    studentTarget: "boy",
    grade: 4,
    phase: "prep",
    subjectId: "english",
    orderIndex: 6,
    title: "Daily routines",
    learningObjective: "Learn simple words for daily activities.",
    shortExplanation: "Use I + activity to talk about a routine.",
    content: baseContent("Daily routines", "Mục tiêu: nói hoạt động hằng ngày bằng câu ngắn.", [
      "I wake up.",
      "I brush my teeth.",
    ]),
    storyContext: "Robo-X plans a healthy training day.",
    rewardType: "sport_medal",
    checks: [
      mc("'I wake up' nghĩa là gì?", ["Tôi thức dậy", "Tôi đi ngủ", "Tôi ăn trưa", "Tôi chạy"], 0, "Wake up là thức dậy.", "Việc đầu buổi sáng."),
      tf("'Brush my teeth' là đánh răng.", true, "Brush teeth nghĩa là đánh răng.", "Dùng bàn chải."),
      blank("Điền từ: I ___ breakfast.", "eat", "I eat breakfast nghĩa là Tôi ăn sáng.", "Eat là ăn."),
      mc("Câu nào là hoạt động hằng ngày?", ["I fly a rocket every minute.", "I brush my teeth.", "I become a table.", "I color the moon."], 1, "Đánh răng là thói quen hằng ngày.", "Hoạt động rất quen thuộc."),
      tf("'Go to school' nghĩa là đi bơi.", false, "Go to school là đi học.", "School là trường học."),
    ],
  },
  {
    id: "girl-g5-prep-math-1",
    studentTarget: "girl",
    grade: 5,
    phase: "prep",
    subjectId: "math",
    orderIndex: 6,
    title: "Số thập phân cơ bản",
    learningObjective: "Làm quen với số thập phân qua phần mười và phần trăm.",
    shortExplanation: "Số thập phân dùng dấu phẩy để biểu diễn phần nhỏ hơn một đơn vị.",
    content: baseContent("Số thập phân cơ bản", "Mục tiêu: hiểu 0,5 là một nửa và 0,25 là một phần tư.", [
      "0,5 = 5/10 = một nửa.",
      "0,25 = 25/100.",
    ]),
    storyContext: "Công chúa đo chiều dài ruy băng thật chính xác.",
    rewardType: "crown",
    checks: [
      mc("0,5 bằng phân số nào?", ["5/10", "5/100", "1/5", "10/5"], 0, "0,5 là 5 phần mười.", "Một chữ số sau dấu phẩy là phần mười."),
      tf("0,25 là 25 phần trăm.", true, "0,25 = 25/100.", "Hai chữ số sau dấu phẩy là phần trăm."),
      blank("Điền số thập phân: 3/10 = ___", "0,3", "3/10 viết là 0,3.", "Ba phần mười."),
      mc("Số nào lớn hơn?", ["0,4", "0,7", "0,2", "0,1"], 1, "0,7 lớn nhất trong các số này.", "So sánh phần mười."),
      tf("0,8 nhỏ hơn 0,3.", false, "0,8 lớn hơn 0,3.", "8 phần mười nhiều hơn 3 phần mười."),
    ],
  },
  {
    id: "girl-g5-prep-vi-1",
    studentTarget: "girl",
    grade: 5,
    phase: "prep",
    subjectId: "vietnamese",
    orderIndex: 6,
    title: "Từ đồng nghĩa và trái nghĩa",
    learningObjective: "Nhận ra từ có nghĩa giống nhau hoặc ngược nhau.",
    shortExplanation: "Từ đồng nghĩa giúp câu phong phú; từ trái nghĩa giúp so sánh rõ hơn.",
    content: baseContent("Từ đồng nghĩa và trái nghĩa", "Mục tiêu: chọn từ đúng theo quan hệ nghĩa.", [
      "vui vẻ gần nghĩa với hân hoan.",
      "cao trái nghĩa với thấp.",
    ]),
    storyContext: "Công chúa chọn từ đẹp cho cuốn nhật ký.",
    rewardType: "dress",
    checks: [
      mc("Từ nào gần nghĩa với 'vui vẻ'?", ["buồn bã", "hân hoan", "cao lớn", "lặng im"], 1, "Hân hoan gần nghĩa với vui vẻ.", "Cùng cảm xúc tích cực."),
      tf("'Cao' và 'thấp' là hai từ trái nghĩa.", true, "Hai từ có nghĩa ngược nhau.", "Dùng để so sánh chiều cao."),
      blank("Điền từ: 'nhanh' trái nghĩa với ___", "chậm", "Nhanh trái nghĩa với chậm.", "Tốc độ ngược lại."),
      mc("Cặp nào là đồng nghĩa?", ["sáng - tối", "nhỏ - bé", "xa - gần", "mở - đóng"], 1, "Nhỏ và bé gần nghĩa nhau.", "Cùng chỉ kích thước ít lớn."),
      tf("Từ trái nghĩa là từ có nghĩa hoàn toàn giống nhau.", false, "Đó là đồng nghĩa; trái nghĩa là ngược nhau.", "Trái là ngược."),
    ],
  },
  {
    id: "girl-g5-prep-en-1",
    studentTarget: "girl",
    grade: 5,
    phase: "prep",
    subjectId: "english",
    orderIndex: 6,
    title: "Simple present: I like",
    learningObjective: "Use simple present patterns with I like and I do not like.",
    shortExplanation: "Use I like + noun/activity to talk about habits and preferences.",
    content: baseContent("Simple present: I like", "Mục tiêu: nói sở thích bằng mẫu câu hiện tại đơn.", [
      "I like drawing.",
      "I do not like loud noise.",
    ]),
    storyContext: "The princess describes hobbies in her craft diary.",
    rewardType: "doll_accessory",
    checks: [
      mc("Câu nào nghĩa là 'Tôi thích vẽ'?", ["I like drawing.", "I drawing like.", "I do drawing not.", "Drawing am I."], 0, "I like drawing là câu đúng.", "Mẫu: I like + hoạt động."),
      tf("'I do not like' dùng để nói không thích.", true, "Đây là dạng phủ định đơn giản.", "Do not = không."),
      blank("Điền từ: I ___ reading books.", "like", "I like reading books nghĩa là Tôi thích đọc sách.", "Từ nghĩa là thích."),
      mc("Chọn câu đúng.", ["I likes cats.", "I like cats.", "Cats I like do.", "I am like cats."], 1, "Với I, dùng like.", "Không thêm s sau like với I."),
      tf("'I like music' nghĩa là Tôi ghét âm nhạc.", false, "Like là thích, không phải ghét.", "Ghét là dislike hoặc do not like."),
    ],
  },
  {
    id: "girl-g5-prep-math-ai-draft-1",
    studentTarget: "girl",
    grade: 5,
    phase: "prep",
    subjectId: "math",
    orderIndex: 7,
    title: "Bản nháp AI: Số thập phân trong vườn sao",
    learningObjective: "Làm quen thêm với cách đọc số thập phân đơn giản trước khi phụ huynh duyệt.",
    shortExplanation: "Bài này là nội dung chờ duyệt, chỉ hiện cho bé sau khi phụ huynh bấm Duyệt.",
    content: baseContent("Số thập phân trong vườn sao", "Mục tiêu: đọc và so sánh số thập phân một chữ số.", [
      "0,6 nghĩa là sáu phần mười.",
      "0,8 lớn hơn 0,5 vì tám phần mười nhiều hơn năm phần mười.",
    ]),
    storyContext: "Công chúa đếm các viên sao nhỏ trong khu vườn trước khi cất vào hộp thủ công.",
    rewardType: "craft_material",
    approved: false,
    checks: [
      mc("0,6 đọc là gì?", ["sáu phần mười", "sáu phần trăm", "mười phần sáu", "sáu đơn vị"], 0, "0,6 có một chữ số sau dấu phẩy nên đọc là sáu phần mười.", "Nhìn số đứng sau dấu phẩy."),
      tf("0,8 lớn hơn 0,5.", true, "0,8 là tám phần mười, còn 0,5 là năm phần mười.", "So sánh 8 với 5."),
      blank("Điền số thập phân: 4/10 = ___", "0,4", "Bốn phần mười viết là 0,4.", "Một chữ số sau dấu phẩy."),
      mc("Số nào nhỏ nhất?", ["0,9", "0,2", "0,7", "0,5"], 1, "0,2 là hai phần mười, nhỏ nhất trong các lựa chọn.", "So sánh chữ số sau dấu phẩy."),
      tf("0,3 và 0,30 có giá trị bằng nhau.", true, "Thêm số 0 ở cuối phần thập phân không làm đổi giá trị.", "0,30 là ba mươi phần trăm, bằng ba phần mười."),
    ],
  },
];

function toQuestionData(check: Check, lessonId: string, index: number) {
  if (check.type === "multiple_choice") {
    const optionIds = ["A", "B", "C", "D"];
    return {
      id: `${lessonId}-q${index + 1}`,
      lessonId,
      orderIndex: index + 1,
      type: check.type,
      text: check.text,
      options: JSON.stringify(check.options.map((text, optionIndex) => ({ id: optionIds[optionIndex], text }))),
      correctAnswer: optionIds[check.correctIndex],
      explanation: check.explanation,
      hint: check.hint,
    };
  }

  if (check.type === "true_false") {
    return {
      id: `${lessonId}-q${index + 1}`,
      lessonId,
      orderIndex: index + 1,
      type: check.type,
      text: check.text,
      options: JSON.stringify([
        { id: "true", text: "Đúng" },
        { id: "false", text: "Chưa đúng" },
      ]),
      correctAnswer: check.correct ? "true" : "false",
      explanation: check.explanation,
      hint: check.hint,
    };
  }

  return {
    id: `${lessonId}-q${index + 1}`,
    lessonId,
    orderIndex: index + 1,
    type: check.type,
    text: check.text,
    options: JSON.stringify([]),
    correctAnswer: check.answer,
    explanation: check.explanation,
    hint: check.hint,
  };
}

async function main() {
  for (const lesson of lessons) {
    if (lesson.checks.length < 5) {
      throw new Error(`Lesson ${lesson.id} must have at least 5 quiz questions.`);
    }
  }

  await prisma.studentReward.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.studentBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.choreCompletion.deleteMany();
  await prisma.choreAssignment.deleteMany();
  await prisma.choreTemplate.deleteMany();
  await prisma.readingEntry.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.themeConfig.deleteMany();

  for (const theme of Object.values(themes)) {
    await prisma.themeConfig.create({
      data: {
        id: theme.id,
        name: theme.name,
        visualDirection: theme.visualDirection,
        feedbackExamples: JSON.stringify(theme.feedback),
        rewardTypes: JSON.stringify(theme.rewards),
        colors: JSON.stringify(theme.palette),
      },
    });
  }

  await prisma.student.createMany({
    data: [
      {
        id: "girl",
        displayName: "Yumi",
        currentGrade: 4,
        nextGrade: 5,
        themeId: "princess_craft_kingdom",
        rewardStyle: JSON.stringify(["dresses", "crowns", "doll accessories", "craft materials", "castle rooms"]),
        feedbackStyle: "gentle_encouraging",
      },
      {
        id: "boy",
        displayName: "Johnny",
        currentGrade: 3,
        nextGrade: 4,
        themeId: "robot_sport_lab",
        rewardStyle: JSON.stringify(["robot parts", "Lego blocks", "sport medals", "lab tools", "arena levels"]),
        feedbackStyle: "warm_logical",
      },
    ],
  });

  await prisma.subject.createMany({ data: subjects });
  await prisma.choreTemplate.createMany({ data: choreTemplates });

  await prisma.badge.createMany({
    data: [
      { id: "first_lesson", name: "Bước Đầu Tiên", description: "Hoàn thành bài học đầu tiên", icon: "🌱", condition: JSON.stringify({ completedLessons: 1 }), xpReward: 10 },
      { id: "streak_3", name: "Ba Ngày Chăm Chỉ", description: "Học 3 ngày liên tiếp", icon: "🔥", condition: JSON.stringify({ streak: 3 }), xpReward: 30 },
      { id: "high_score", name: "Tỏa Sáng", description: "Đạt từ 80% trong một quiz", icon: "🌟", condition: JSON.stringify({ percentage: 80 }), xpReward: 15 },
      { id: "subject_math_5", name: "Nhà Thám Hiểm Toán", description: "Hoàn thành 5 bài Toán", icon: "🔢", condition: JSON.stringify({ subject: "math", completedLessons: 5 }), xpReward: 40 },
      { id: "subject_vietnamese_5", name: "Ngôn Từ Hay", description: "Hoàn thành 5 bài Tiếng Việt", icon: "📖", condition: JSON.stringify({ subject: "vietnamese", completedLessons: 5 }), xpReward: 40 },
      { id: "subject_english_5", name: "English Star", description: "Hoàn thành 5 bài Tiếng Anh", icon: "🌍", condition: JSON.stringify({ subject: "english", completedLessons: 5 }), xpReward: 40 },
    ],
  });

  await prisma.reward.createMany({
    data: [
      { id: "princess-dress", themeId: "princess_craft_kingdom", name: "Váy Sao Nhỏ", type: "dress", icon: "👗", unlockCondition: JSON.stringify({ completedLessons: 1 }) },
      { id: "princess-crown", themeId: "princess_craft_kingdom", name: "Vương Miện Lấp Lánh", type: "crown", icon: "👑", unlockCondition: JSON.stringify({ completedLessons: 3 }) },
      { id: "princess-craft", themeId: "princess_craft_kingdom", name: "Hộp Thủ Công", type: "craft_material", icon: "🎨", unlockCondition: JSON.stringify({ completedLessons: 5 }) },
      { id: "princess-room", themeId: "princess_craft_kingdom", name: "Phòng Vườn Lâu Đài", type: "castle_room", icon: "🏰", unlockCondition: JSON.stringify({ completedLessons: 8 }) },
      { id: "robot-arm", themeId: "robot_sport_lab", name: "Cánh Tay Robo-X", type: "robot_part", icon: "💪", unlockCondition: JSON.stringify({ completedLessons: 1 }) },
      { id: "robot-lego", themeId: "robot_sport_lab", name: "Khối Lego Năng Lượng", type: "lego_block", icon: "🧱", unlockCondition: JSON.stringify({ completedLessons: 3 }) },
      { id: "robot-medal", themeId: "robot_sport_lab", name: "Huy Chương Lab", type: "sport_medal", icon: "🏅", unlockCondition: JSON.stringify({ completedLessons: 5 }) },
      { id: "robot-arena", themeId: "robot_sport_lab", name: "Tầng Đấu Trường", type: "arena_level", icon: "🏟️", unlockCondition: JSON.stringify({ completedLessons: 8 }) },
    ],
  });

  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: {
        id: lesson.id,
        subjectId: lesson.subjectId,
        studentTarget: lesson.studentTarget,
        grade: lesson.grade,
        phase: lesson.phase,
        orderIndex: lesson.orderIndex,
        title: lesson.title,
        learningObjective: lesson.learningObjective,
        shortExplanation: lesson.shortExplanation,
        content: lesson.content,
        storyContext: lesson.storyContext,
        rewardConfig: JSON.stringify({ type: lesson.rewardType, coins: 10, bonusCoins: 5 }),
        approved: lesson.approved ?? true,
        questions: {
          createMany: {
            data: lesson.checks.map((check, index) => {
              const questionData = toQuestionData(check, lesson.id, index);
              return {
                id: questionData.id,
                orderIndex: questionData.orderIndex,
                type: questionData.type,
                text: questionData.text,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                explanation: questionData.explanation,
                hint: questionData.hint,
              };
            }),
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
