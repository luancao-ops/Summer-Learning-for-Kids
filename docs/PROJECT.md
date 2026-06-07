# Summer Quest — Project Overview

> *"Biến mùa hè thành một cuộc phiêu lưu học tập — nơi mỗi đứa trẻ là nhân vật chính trong câu chuyện của riêng mình."*

Local-first learning app for two Vietnamese children on summer holiday. Runs on a family Windows PC — no cloud, no accounts, no tracking.

---

## Children

| | Bé gái — Yumi | Bé trai — Johnny |
|---|---|---|
| **Student ID** | `girl` | `boy` |
| **Grade completed** | 4 | 3 |
| **Preparing for** | Grade 5 | Grade 4 |
| **Theme** | Princess Craft Kingdom 👑 | Robot Sport Lab 🤖 |
| **Theme ID** | `princess_craft_kingdom` | `robot_sport_lab` |
| **Mascot** | White Bunny Princess | Robo-X |

**Personas in brief:**
- **Yumi** — motivated by story, imagination, unlocking castle decorations. Needs gentle feedback; dislikes feeling judged. Give hints freely.
- **Johnny** — motivated by logic, numbers, upgrading robot parts. Explain WHY answers are correct. Keep feedback factual, not harsh.

---

## Game Mechanics

### XP & Levels

| Action | XP |
|---|---|
| Correct answer (1st try) | +10 |
| Correct answer (2nd try) | +7 |
| Complete quiz | +20 |
| 100% quiz score | +30 bonus |
| Daily mission complete | +50 |
| 7-day streak milestone | +100 |
| Resolve a mistake in review | +5 |

**Level formula:** `Level = floor(totalXP / 100) + 1`

**Princess level names:** 🌱 Tiểu Học Viên → 🌸 Cô Bé Thông Minh → ✨ Công Chúa Sáng Suốt → 👑 Công Chúa Hiểu Biết → 🔮 Nàng Tiên Học Giỏi → 🌟 Công Chúa Xuất Sắc → 💫 Nữ Hoàng Tri Thức

**Robot level names:** 🔩 Robot Tập Sự → ⚙️ Kỹ Sư Cơ Bản → 🤖 Kỹ Sư Lành Nghề → 🔧 Chuyên Gia Lập Trình → 🏆 Kỹ Sư Hạng Nhất → 🚀 Nhà Khoa Học Trẻ → 💎 Siêu Kỹ Sư Robot

### Coins

| Action | Coins |
|---|---|
| Complete quiz | +20 |
| 100% quiz score | +10 bonus |
| Daily mission complete | +30 |
| Streak every 5 days | +50 |
| Use hint | -5 |

### Streak

Streak +1 when student completes at least 1 quiz per day. Resets to 0 if a day is missed. Displayed as 🔥 with count.

| Streak | Reward |
|---|---|
| 3 days | Badge + 30 XP |
| 7 days | Badge + 100 XP + 50 coins |
| 14 days | Badge + 200 XP + 100 coins |
| 30 days | Badge + 500 XP + 200 coins |

### Badges

Universal badges (both students):

| Badge | Condition |
|---|---|
| 🌱 Bước Đầu Tiên | Complete first quiz |
| 🔥 Học 3 Ngày | Streak = 3 |
| 📚 Ham Học | Complete 5 lessons |
| 🎯 Chính Xác | 100% on any quiz |
| 🔥🔥 Tuần Chăm Chỉ | Streak = 7 |
| 🌟 Toán Học Giỏi | Complete 5 Math lessons |
| 📖 Ngôn Ngữ Hay | Complete 5 Vietnamese lessons |
| 🌍 Tiếng Anh Tốt | Complete 5 English lessons |
| 💪 Chiến Binh | Resolve 10 mistakes |
| 🏆 Hoàn Thành Hè | Complete 15 lessons |

Princess-only: 👑 🌸 ✨ 🎀 🔮 · Robot-only: ⚙️ 🤖 📡 🌐 🚀

### Habits Module (chores + reading)

Added in Sprint 4. Parent assigns daily chores from a template library. Student ticks them off with a checkbox UX + short description. Reading log: student records book title, pages, summary, feelings.

| Chore completion level | XP | Coins |
|---|---|---|
| great | +10 | +5 |
| okay | +5 | +3 |
| partial | +2 | 0 |

Reading entry (first per day): +15 XP, +8 coins.

### Content Safety Gate

All lessons have `approved` flag. **Student-facing queries must always filter `where: { approved: true }`** — this is the only guard between AI-generated content and children. New lessons from AI imports default to `approved: false` and appear in `/parent/review` queue.

---

## Curriculum

### 8-Week Summer Plan (per child per week)

| Weeks | Theme | Daily time |
|---|---|---|
| 1–2 | Warm-up review (last grade basics) | 20–30 min |
| 3–4 | Core review (main topics of last grade) | 25–35 min |
| 5–6 | Prep phase (key topics of next grade) | 30–40 min |
| 7–8 | End-of-summer challenge + review | 30 min |

**Yumi (Grade 4 → 5):** Fractions, decimal basics, descriptive writing, synonyms/antonyms, Simple Present tense.
**Johnny (Grade 3 → 4):** Multiplication 6–9, word problems, compound sentences, Greetings & introductions, daily routines.

### Long-Term Content Targets

| Subject | Target lessons/child | Focus areas |
|---|---|---|
| Math | 100 | 40 number sense, 20 word problems, 15 measurement, 15 geometry, 10 bridge lessons |
| Vietnamese | 100 | 30 vocabulary, 20 grammar, 20 reading, 15 writing, 15 bridge lessons |
| English | 100 | 30 vocabulary, 20 grammar, 20 reading, 15 writing/use, 15 exam strategy |
| English mock exams | 4–6 | Full mocks every 2 weeks |

**English exam targets:** Johnny → Cambridge Movers · Yumi → Cambridge Flyers

Mock exam schedule (3-month version): Week 2 / 4 / 6 / 8 / 10 / 12

### Content Import Strategy

Never add expansion content to `prisma/seed.ts` once children have real progress. Use JSON manifests in `summer-quest/content/manifests/` and import with:

```powershell
npm.cmd run content:import -- content/manifests/your-batch.json
```

Recommended batch size: 5–15 lessons. Each batch: import → parent review → smoke-test → next batch.

Suggested lesson ID pattern: `boy-expansion-math-001`, `girl-expansion-flyers-mock-02`

---

## Roadmap

### Completed

| Milestone | Deliverable |
|---|---|
| M0 — Bootstrap | Next.js + Prisma + SQLite setup, seed data, 2 student profiles |
| M1 — Core Engine | Quiz engine, question types, score saving, result screen |
| M2 — Lesson + Dashboard | Lesson viewer, subject list, XP bar, streak, daily missions |
| M3 — Gamification | XP/level/coins/streak/badges, reward items, daily missions |
| M4 — Mistake Review + Parent | Mistake review flow, parent dashboard, progress chart |
| M5 — Polish | Bug fixes, LAN access, production launcher |
| M6 — Habits Module | Chores + reading log, Sprint 4–5 UX redesign |

### Post-MVP (Planned)

| Feature | Notes |
|---|---|
| Boss Challenge | 15-question end-of-phase quiz with narrative |
| Mini-games | Pizza Fractions, Word Match, Balloon Vocabulary |
| Sound & music | Non-blocking improvement |
| PDF reports | Exam-style progress export for parents |
| Year-round AI teacher | Daily lesson generation, adaptive pacing |
| Mobile app | Out of current scope |

---

## UX Principles

- **No timer**: children work without time pressure
- **No "Game Over"**: always allow retry, never block progress
- **Hints always available**: before or after trying
- **Positive feedback only**: never say "Sai", "Thất bại", "0 điểm" standalone
- **Parent gating**: nothing AI-generated reaches children without approval

See `docs/UX_FLOW.md` for full ASCII wireframes of every screen.
