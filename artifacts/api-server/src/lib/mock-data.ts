export const MOCK_USER = {
  id: 1,
  name: "Học viên",
  currentLevel: 1,
  targetLevel: 4,
  onboardingCompleted: true,
  totalXp: 120,
  dailyGoalMinutes: 15,
  currentStreak: 5,
  longestStreak: 7,
  lastStudyDate: new Date().toISOString().split("T")[0],
  createdAt: new Date("2026-05-01"),
};

type LessonType = "dialogue" | "vocabulary" | "pinyin_basics" | "grammar" | "review";

interface MockLesson {
  id: number;
  level: number;
  unit: number;
  lessonNumber: number;
  title: string;
  titleChinese: string;
  type: LessonType;
  xpReward: number;
  estimatedMinutes: number;
}

export const MOCK_LESSONS: MockLesson[] = [
  // ── HSK 1 — Sơ cấp ──────────────────────────────────────────────
  { id: 101, level: 1, unit: 1, lessonNumber: 1, title: "Phát âm Pinyin",     titleChinese: "拼音基础",   type: "pinyin_basics", xpReward: 10, estimatedMinutes: 8  },
  { id: 102, level: 1, unit: 1, lessonNumber: 2, title: "Chào hỏi",           titleChinese: "问候语",     type: "dialogue",      xpReward: 15, estimatedMinutes: 10 },
  { id: 103, level: 1, unit: 1, lessonNumber: 3, title: "Số đếm 1–10",        titleChinese: "数字一到十", type: "vocabulary",    xpReward: 15, estimatedMinutes: 8  },
  { id: 104, level: 1, unit: 2, lessonNumber: 1, title: "Gia đình",           titleChinese: "家庭成员",   type: "vocabulary",    xpReward: 15, estimatedMinutes: 10 },
  { id: 105, level: 1, unit: 2, lessonNumber: 2, title: "Màu sắc",            titleChinese: "颜色",       type: "vocabulary",    xpReward: 10, estimatedMinutes: 8  },
  { id: 106, level: 1, unit: 2, lessonNumber: 3, title: "Đồ ăn & uống",      titleChinese: "食物与饮料", type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 107, level: 1, unit: 3, lessonNumber: 1, title: "Ngữ pháp cơ bản",   titleChinese: "基础语法",   type: "grammar",       xpReward: 20, estimatedMinutes: 12 },
  { id: 108, level: 1, unit: 3, lessonNumber: 2, title: "Ôn tập HSK 1",      titleChinese: "复习一级",   type: "review",        xpReward: 30, estimatedMinutes: 15 },

  // ── HSK 2 — Cơ bản ───────────────────────────────────────────────
  { id: 201, level: 2, unit: 1, lessonNumber: 1, title: "Thời gian",          titleChinese: "时间表达",   type: "vocabulary",    xpReward: 15, estimatedMinutes: 10 },
  { id: 202, level: 2, unit: 1, lessonNumber: 2, title: "Mua sắm",            titleChinese: "购物对话",   type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 203, level: 2, unit: 1, lessonNumber: 3, title: "Giao thông",         titleChinese: "交通工具",   type: "vocabulary",    xpReward: 15, estimatedMinutes: 10 },
  { id: 204, level: 2, unit: 2, lessonNumber: 1, title: "Sức khỏe",          titleChinese: "身体健康",   type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 205, level: 2, unit: 2, lessonNumber: 2, title: "Thời tiết",          titleChinese: "天气描述",   type: "vocabulary",    xpReward: 15, estimatedMinutes: 8  },
  { id: 206, level: 2, unit: 2, lessonNumber: 3, title: "Nơi chốn",          titleChinese: "地方与位置", type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 207, level: 2, unit: 3, lessonNumber: 1, title: "Ngữ pháp trung cấp",titleChinese: "进阶语法",   type: "grammar",       xpReward: 25, estimatedMinutes: 15 },
  { id: 208, level: 2, unit: 3, lessonNumber: 2, title: "Ôn tập HSK 2",      titleChinese: "复习二级",   type: "review",        xpReward: 35, estimatedMinutes: 15 },

  // ── HSK 3 — Trung cấp ────────────────────────────────────────────
  { id: 301, level: 3, unit: 1, lessonNumber: 1, title: "Công việc",          titleChinese: "工作职场",   type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 302, level: 3, unit: 1, lessonNumber: 2, title: "Trường học",         titleChinese: "学校生活",   type: "dialogue",      xpReward: 20, estimatedMinutes: 12 },
  { id: 303, level: 3, unit: 1, lessonNumber: 3, title: "Du lịch",            titleChinese: "旅行计划",   type: "vocabulary",    xpReward: 20, estimatedMinutes: 10 },
  { id: 304, level: 3, unit: 2, lessonNumber: 1, title: "Cảm xúc",           titleChinese: "情感表达",   type: "vocabulary",    xpReward: 20, estimatedMinutes: 10 },
  { id: 305, level: 3, unit: 2, lessonNumber: 2, title: "Văn hóa TQ",        titleChinese: "中国文化",   type: "dialogue",      xpReward: 25, estimatedMinutes: 15 },
  { id: 306, level: 3, unit: 2, lessonNumber: 3, title: "Thể thao",          titleChinese: "体育运动",   type: "vocabulary",    xpReward: 20, estimatedMinutes: 10 },
  { id: 307, level: 3, unit: 3, lessonNumber: 1, title: "Ngữ pháp nâng cao", titleChinese: "高级语法",   type: "grammar",       xpReward: 30, estimatedMinutes: 15 },
  { id: 308, level: 3, unit: 3, lessonNumber: 2, title: "Ôn tập HSK 3",      titleChinese: "复习三级",   type: "review",        xpReward: 40, estimatedMinutes: 20 },

  // ── HSK 4 — Khá ──────────────────────────────────────────────────
  { id: 401, level: 4, unit: 1, lessonNumber: 1, title: "Kinh doanh",         titleChinese: "商业谈判",   type: "dialogue",      xpReward: 25, estimatedMinutes: 15 },
  { id: 402, level: 4, unit: 1, lessonNumber: 2, title: "Xã hội",            titleChinese: "社会议题",   type: "vocabulary",    xpReward: 25, estimatedMinutes: 12 },
  { id: 403, level: 4, unit: 1, lessonNumber: 3, title: "Môi trường",        titleChinese: "环境保护",   type: "dialogue",      xpReward: 25, estimatedMinutes: 15 },
  { id: 404, level: 4, unit: 2, lessonNumber: 1, title: "Khoa học & CN",     titleChinese: "科学技术",   type: "vocabulary",    xpReward: 25, estimatedMinutes: 12 },
  { id: 405, level: 4, unit: 2, lessonNumber: 2, title: "Nghệ thuật",        titleChinese: "艺术欣赏",   type: "dialogue",      xpReward: 25, estimatedMinutes: 15 },
  { id: 406, level: 4, unit: 2, lessonNumber: 3, title: "Lịch sử TQ",       titleChinese: "中国历史",   type: "vocabulary",    xpReward: 25, estimatedMinutes: 12 },
  { id: 407, level: 4, unit: 3, lessonNumber: 1, title: "Ngữ pháp phức tạp", titleChinese: "复杂语法",   type: "grammar",       xpReward: 35, estimatedMinutes: 20 },
  { id: 408, level: 4, unit: 3, lessonNumber: 2, title: "Ôn tập HSK 4",      titleChinese: "复习四级",   type: "review",        xpReward: 50, estimatedMinutes: 20 },

  // ── HSK 5 — Nâng cao ─────────────────────────────────────────────
  { id: 501, level: 5, unit: 1, lessonNumber: 1, title: "Kinh tế vĩ mô",     titleChinese: "宏观经济",   type: "dialogue",      xpReward: 30, estimatedMinutes: 18 },
  { id: 502, level: 5, unit: 1, lessonNumber: 2, title: "Văn học cổ điển",   titleChinese: "古典文学",   type: "vocabulary",    xpReward: 30, estimatedMinutes: 15 },
  { id: 503, level: 5, unit: 1, lessonNumber: 3, title: "Chính trị & XH",   titleChinese: "政治社会",   type: "dialogue",      xpReward: 30, estimatedMinutes: 18 },
  { id: 504, level: 5, unit: 2, lessonNumber: 1, title: "Y học & Sức khỏe", titleChinese: "医学健康",   type: "vocabulary",    xpReward: 30, estimatedMinutes: 15 },
  { id: 505, level: 5, unit: 2, lessonNumber: 2, title: "Triết học",         titleChinese: "哲学思想",   type: "dialogue",      xpReward: 30, estimatedMinutes: 18 },
  { id: 506, level: 5, unit: 2, lessonNumber: 3, title: "Công nghệ mới",     titleChinese: "新兴科技",   type: "vocabulary",    xpReward: 30, estimatedMinutes: 15 },
  { id: 507, level: 5, unit: 3, lessonNumber: 1, title: "Ngữ pháp cấp 5",   titleChinese: "五级语法",   type: "grammar",       xpReward: 40, estimatedMinutes: 20 },
  { id: 508, level: 5, unit: 3, lessonNumber: 2, title: "Ôn tập tổng hợp",  titleChinese: "综合复习",   type: "review",        xpReward: 60, estimatedMinutes: 25 },
];

export const MOCK_COMPLETED_IDS = new Set([101, 102, 103]);

export function getMockLessons(currentLevel = 1) {
  return MOCK_LESSONS.map((l) => ({
    id: l.id,
    level: l.level,
    unit: l.unit,
    lessonNumber: l.lessonNumber,
    title: l.title,
    titleChinese: l.titleChinese,
    type: l.type,
    isLocked: l.level > currentLevel,
    isCompleted: MOCK_COMPLETED_IDS.has(l.id),
    xpReward: l.xpReward,
    estimatedMinutes: l.estimatedMinutes,
  }));
}

export function getMockDashboardStats() {
  const today = new Date();
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const xpValues = [0, 30, 15, 45, 20, 10, 0];
    const minValues = [0, 12, 8, 18, 10, 5, 0];
    return {
      day: days[d.getDay()],
      xp: xpValues[i],
      minutes: minValues[i],
    };
  });

  return {
    totalXp: MOCK_USER.totalXp,
    currentLevel: MOCK_USER.currentLevel,
    targetLevel: MOCK_USER.targetLevel,
    levelProgressPercent: Math.round((MOCK_COMPLETED_IDS.size / 8) * 100),
    vocabularyLearned: MOCK_COMPLETED_IDS.size * 8,
    completedLessons: MOCK_COMPLETED_IDS.size,
    currentStreak: MOCK_USER.currentStreak,
    todayMinutes: 10,
    dailyGoalMinutes: MOCK_USER.dailyGoalMinutes,
    weeklyActivity,
  };
}

export interface MockVocabWord {
  id: number;
  level: number;
  chinese: string;
  pinyin: string;
  meaning: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleMeaning: string;
}

export const MOCK_VOCABULARY: MockVocabWord[] = [
  // HSK 1
  { id: 1,  level: 1, chinese: "你好",   pinyin: "nǐ hǎo",     meaning: "Xin chào",       exampleChinese: "你好！我是学生。",          examplePinyin: "Nǐ hǎo! Wǒ shì xuésheng.",       exampleMeaning: "Xin chào! Tôi là học sinh." },
  { id: 2,  level: 1, chinese: "谢谢",   pinyin: "xiè xie",    meaning: "Cảm ơn",         exampleChinese: "谢谢你的帮助。",             examplePinyin: "Xièxie nǐ de bāngzhù.",          exampleMeaning: "Cảm ơn sự giúp đỡ của bạn." },
  { id: 3,  level: 1, chinese: "再见",   pinyin: "zài jiàn",   meaning: "Tạm biệt",       exampleChinese: "再见，明天见！",              examplePinyin: "Zàijiàn, míngtiān jiàn!",        exampleMeaning: "Tạm biệt, hẹn gặp ngày mai!" },
  { id: 4,  level: 1, chinese: "我",     pinyin: "wǒ",         meaning: "Tôi / Mình",     exampleChinese: "我是中国人。",               examplePinyin: "Wǒ shì Zhōngguórén.",            exampleMeaning: "Tôi là người Trung Quốc." },
  { id: 5,  level: 1, chinese: "你",     pinyin: "nǐ",         meaning: "Bạn / Anh / Chị",exampleChinese: "你叫什么名字？",             examplePinyin: "Nǐ jiào shénme míngzi?",         exampleMeaning: "Bạn tên là gì?" },
  { id: 6,  level: 1, chinese: "是",     pinyin: "shì",        meaning: "Là (động từ)",   exampleChinese: "这是我的书。",               examplePinyin: "Zhè shì wǒ de shū.",             exampleMeaning: "Đây là cuốn sách của tôi." },
  { id: 7,  level: 1, chinese: "不",     pinyin: "bù",         meaning: "Không",          exampleChinese: "我不是老师。",               examplePinyin: "Wǒ bù shì lǎoshī.",              exampleMeaning: "Tôi không phải giáo viên." },
  { id: 8,  level: 1, chinese: "好",     pinyin: "hǎo",        meaning: "Tốt / Khỏe",    exampleChinese: "今天天气很好。",              examplePinyin: "Jīntiān tiānqì hěn hǎo.",        exampleMeaning: "Hôm nay thời tiết rất đẹp." },
  { id: 9,  level: 1, chinese: "人",     pinyin: "rén",        meaning: "Người",          exampleChinese: "他是一个好人。",             examplePinyin: "Tā shì yī gè hǎo rén.",          exampleMeaning: "Anh ấy là một người tốt." },
  { id: 10, level: 1, chinese: "中国",   pinyin: "Zhōngguó",   meaning: "Trung Quốc",     exampleChinese: "中国很大。",                 examplePinyin: "Zhōngguó hěn dà.",               exampleMeaning: "Trung Quốc rất rộng lớn." },
  { id: 11, level: 1, chinese: "学生",   pinyin: "xuésheng",   meaning: "Học sinh",       exampleChinese: "她是大学生。",               examplePinyin: "Tā shì dàxuéshēng.",             exampleMeaning: "Cô ấy là sinh viên đại học." },
  { id: 12, level: 1, chinese: "老师",   pinyin: "lǎoshī",     meaning: "Giáo viên",      exampleChinese: "老师很好。",                 examplePinyin: "Lǎoshī hěn hǎo.",                exampleMeaning: "Giáo viên rất tốt." },
  { id: 13, level: 1, chinese: "一",     pinyin: "yī",         meaning: "Một (số 1)",     exampleChinese: "我有一本书。",               examplePinyin: "Wǒ yǒu yī běn shū.",             exampleMeaning: "Tôi có một cuốn sách." },
  { id: 14, level: 1, chinese: "两",     pinyin: "liǎng",      meaning: "Hai (số lượng)", exampleChinese: "我有两个苹果。",             examplePinyin: "Wǒ yǒu liǎng gè píngguǒ.",      exampleMeaning: "Tôi có hai quả táo." },
  { id: 15, level: 1, chinese: "三",     pinyin: "sān",        meaning: "Ba (số 3)",      exampleChinese: "她有三个孩子。",             examplePinyin: "Tā yǒu sān gè háizi.",           exampleMeaning: "Cô ấy có ba đứa con." },
  { id: 16, level: 1, chinese: "吃",     pinyin: "chī",        meaning: "Ăn",             exampleChinese: "我想吃米饭。",               examplePinyin: "Wǒ xiǎng chī mǐfàn.",            exampleMeaning: "Tôi muốn ăn cơm." },
  { id: 17, level: 1, chinese: "喝",     pinyin: "hē",         meaning: "Uống",           exampleChinese: "她喜欢喝茶。",               examplePinyin: "Tā xǐhuān hē chá.",              exampleMeaning: "Cô ấy thích uống trà." },
  { id: 18, level: 1, chinese: "水",     pinyin: "shuǐ",       meaning: "Nước",           exampleChinese: "请给我一杯水。",             examplePinyin: "Qǐng gěi wǒ yī bēi shuǐ.",      exampleMeaning: "Cho tôi một ly nước." },
  { id: 19, level: 1, chinese: "爸爸",   pinyin: "bàba",       meaning: "Bố / Cha",       exampleChinese: "我爸爸是医生。",             examplePinyin: "Wǒ bàba shì yīshēng.",           exampleMeaning: "Bố tôi là bác sĩ." },
  { id: 20, level: 1, chinese: "妈妈",   pinyin: "māma",       meaning: "Mẹ / Mẹ ơi",    exampleChinese: "妈妈在家。",                 examplePinyin: "Māma zài jiā.",                  exampleMeaning: "Mẹ đang ở nhà." },
  // HSK 2
  { id: 21, level: 2, chinese: "时间",   pinyin: "shíjiān",    meaning: "Thời gian",      exampleChinese: "我没有时间。",               examplePinyin: "Wǒ méiyǒu shíjiān.",             exampleMeaning: "Tôi không có thời gian." },
  { id: 22, level: 2, chinese: "钱",     pinyin: "qián",       meaning: "Tiền",           exampleChinese: "这个多少钱？",               examplePinyin: "Zhège duōshǎo qián?",            exampleMeaning: "Cái này bao nhiêu tiền?" },
  { id: 23, level: 2, chinese: "买",     pinyin: "mǎi",        meaning: "Mua",            exampleChinese: "我想买这件衣服。",           examplePinyin: "Wǒ xiǎng mǎi zhè jiàn yīfu.",   exampleMeaning: "Tôi muốn mua cái áo này." },
  { id: 24, level: 2, chinese: "医院",   pinyin: "yīyuàn",     meaning: "Bệnh viện",      exampleChinese: "医院在哪里？",               examplePinyin: "Yīyuàn zài nǎlǐ?",              exampleMeaning: "Bệnh viện ở đâu?" },
  { id: 25, level: 2, chinese: "天气",   pinyin: "tiānqì",     meaning: "Thời tiết",      exampleChinese: "今天天气怎么样？",           examplePinyin: "Jīntiān tiānqì zěnmeyàng?",     exampleMeaning: "Hôm nay thời tiết thế nào?" },
];

export function getMockVocabulary(level?: number): MockVocabWord[] {
  if (level !== undefined) return MOCK_VOCABULARY.filter(v => v.level === level);
  return MOCK_VOCABULARY;
}

export function getMockDailyTasks() {
  const level1Lessons = MOCK_LESSONS.filter((l) => l.level === 1).slice(0, 4);
  const today = new Date().toISOString().split("T")[0];
  const tasks = level1Lessons.map((l, i) => ({
    lessonId: l.id,
    title: l.title,
    type: l.type,
    estimatedMinutes: l.estimatedMinutes,
    isCompleted: MOCK_COMPLETED_IDS.has(l.id),
    order: i + 1,
  }));
  const completedMinutes = tasks
    .filter((t) => t.isCompleted)
    .reduce((s, t) => s + t.estimatedMinutes, 0);
  return {
    date: today,
    totalMinutes: MOCK_USER.dailyGoalMinutes,
    completedMinutes,
    tasks,
    motivationMessage:
      completedMinutes >= MOCK_USER.dailyGoalMinutes
        ? "Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay!"
        : "Hãy tiếp tục! Mỗi ngày một bước, bạn sẽ thành công!",
  };
}
