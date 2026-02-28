#!/bin/bash
# =============================================================
# IELTS Data Seed Script - Tạo dữ liệu bài thi IELTS
# =============================================================

BASE_URL="http://localhost:5000"
ADMIN_EMAIL="admin@ielts.com"
ADMIN_PASSWORD="Admin@123"

echo "=========================================="
echo "🚀 BẮT ĐẦU SEED DỮ LIỆU IELTS"
echo "=========================================="

# -----------------------------------------------
# 1. Đăng ký tài khoản admin
# -----------------------------------------------
echo ""
echo "📌 [1/8] Đăng ký tài khoản admin..."
REGISTER_RES=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IELTS Admin",
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'"
  }')
echo "Register response: $REGISTER_RES"

# Cập nhật role thành admin trực tiếp trong MongoDB
echo ""
echo "📌 [1.5/8] Cập nhật role thành admin trong MongoDB..."
mongosh --quiet --eval "
  db = db.getSiblingDB('my_project_1');
  db.users.updateOne(
    { email: '$ADMIN_EMAIL' },
    { \$set: { role: 'admin' } }
  );
  print('Updated role to admin for: $ADMIN_EMAIL');
"

# -----------------------------------------------
# 2. Đăng nhập admin lấy token
# -----------------------------------------------
echo ""
echo "📌 [2/8] Đăng nhập admin lấy token..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'"
  }')
echo "Login response: $LOGIN_RES"

TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Không lấy được token! Kiểm tra lại server."
  exit 1
fi
echo "✅ Token: ${TOKEN:0:30}..."

AUTH_HEADER="Authorization: Bearer $TOKEN"

# -----------------------------------------------
# 3. Tạo khóa học IELTS
# -----------------------------------------------
echo ""
echo "📌 [3/8] Tạo khóa học IELTS..."

COURSE_RES=$(curl -s -X POST "$BASE_URL/courses" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{
    "title": "IELTS Academic Preparation",
    "description": "Khóa học luyện thi IELTS Academic đầy đủ 4 kỹ năng: Listening, Reading, Writing, Speaking. Mục tiêu IELTS 6.5+",
    "level": "B2",
    "isActive": true
  }')
echo "Course response: $COURSE_RES"

COURSE_ID=$(echo $COURSE_RES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Course ID: $COURSE_ID"

# -----------------------------------------------
# 4. Tạo 4 bài thi IELTS (Listening, Reading, Writing, Speaking)
# -----------------------------------------------
echo ""
echo "📌 [4/8] Tạo bài thi IELTS..."

# --- LISTENING ---
EXAM_LISTEN_RES=$(curl -s -X POST "$BASE_URL/exams" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{
    "courseId": "'$COURSE_ID'",
    "title": "IELTS Listening Practice Test 1",
    "description": "Bài thi Listening gồm 4 sections với các dạng câu hỏi: multiple choice, fill in blank, true/false. Nội dung bao gồm hội thoại đời thường và bài giảng học thuật.",
    "durationMinutes": 30,
    "passScore": 60,
    "isActive": true
  }')
EXAM_LISTEN_ID=$(echo $EXAM_LISTEN_RES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Listening Exam ID: $EXAM_LISTEN_ID"

# --- READING ---
EXAM_READ_RES=$(curl -s -X POST "$BASE_URL/exams" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{
    "courseId": "'$COURSE_ID'",
    "title": "IELTS Reading Practice Test 1",
    "description": "Bài thi Reading Academic gồm 3 passages với độ khó tăng dần. Các dạng câu hỏi: True/False/Not Given, Multiple Choice, Matching Headings, Fill in the Blank.",
    "durationMinutes": 60,
    "passScore": 60,
    "isActive": true
  }')
EXAM_READ_ID=$(echo $EXAM_READ_RES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Reading Exam ID: $EXAM_READ_ID"

# --- WRITING ---
EXAM_WRITE_RES=$(curl -s -X POST "$BASE_URL/exams" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{
    "courseId": "'$COURSE_ID'",
    "title": "IELTS Writing Practice Test 1",
    "description": "Bài thi Writing Academic gồm 2 tasks: Task 1 - Mô tả biểu đồ/bảng số liệu (150 từ), Task 2 - Viết essay về chủ đề xã hội/giáo dục (250 từ).",
    "durationMinutes": 60,
    "passScore": 50,
    "isActive": true
  }')
EXAM_WRITE_ID=$(echo $EXAM_WRITE_RES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Writing Exam ID: $EXAM_WRITE_ID"

# --- SPEAKING ---
EXAM_SPEAK_RES=$(curl -s -X POST "$BASE_URL/exams" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{
    "courseId": "'$COURSE_ID'",
    "title": "IELTS Speaking Practice Test 1",
    "description": "Bài thi Speaking gồm 3 parts: Part 1 - Introduction & Interview, Part 2 - Long Turn (Cue Card), Part 3 - Discussion chuyên sâu về chủ đề trong Part 2.",
    "durationMinutes": 15,
    "passScore": 50,
    "isActive": true
  }')
EXAM_SPEAK_ID=$(echo $EXAM_SPEAK_RES | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Speaking Exam ID: $EXAM_SPEAK_ID"

# -----------------------------------------------
# 5. Tạo câu hỏi cho từng bài thi
# -----------------------------------------------
echo ""
echo "📌 [5/8] Tạo câu hỏi cho từng bài thi..."

# =============================================
# LISTENING QUESTIONS (10 câu)
# =============================================
echo ""
echo "  🎧 Tạo câu hỏi Listening..."

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "multiple_choice",
  "content": "Section 1: You will hear a conversation between a student and a landlord about renting a flat. What is the monthly rent for the apartment?",
  "options": ["$500", "$650", "$750", "$800"],
  "correctAnswer": "$750",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "fill_in_blank",
  "content": "Section 1: The apartment is located on ______ Street, near the university campus.",
  "correctAnswer": "Oxford",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "multiple_choice",
  "content": "Section 2: In the museum tour guide speech, what time does the museum close on Sundays?",
  "options": ["4:00 PM", "5:00 PM", "5:30 PM", "6:00 PM"],
  "correctAnswer": "5:30 PM",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "true_false",
  "content": "Section 2: The museum offers free guided tours every day of the week.",
  "options": ["True", "False"],
  "correctAnswer": "False",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "multiple_choice",
  "content": "Section 3: In the academic discussion about climate change, which greenhouse gas does the professor identify as the most significant contributor?",
  "options": ["Methane", "Carbon Dioxide", "Nitrous Oxide", "Water Vapor"],
  "correctAnswer": "Carbon Dioxide",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "fill_in_blank",
  "content": "Section 3: According to the lecture, global temperatures have risen by approximately ______ degrees Celsius since the pre-industrial era.",
  "correctAnswer": "1.1",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "multiple_choice",
  "content": "Section 4: What is the main topic of the university lecture?",
  "options": ["Marine biology and ocean conservation", "The history of space exploration", "Renewable energy technologies", "Ancient Egyptian architecture"],
  "correctAnswer": "Renewable energy technologies",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "true_false",
  "content": "Section 4: The speaker states that solar energy currently accounts for more than 50% of global electricity production.",
  "options": ["True", "False"],
  "correctAnswer": "False",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "fill_in_blank",
  "content": "Section 4: Wind turbines can generate electricity when wind speeds exceed ______ kilometers per hour.",
  "correctAnswer": "12",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_LISTEN_ID'",
  "type": "multiple_choice",
  "content": "Section 4: Which country does the lecturer mention as the world leader in wind energy production?",
  "options": ["United States", "Germany", "China", "Denmark"],
  "correctAnswer": "China",
  "points": 10
}' > /dev/null

echo "  ✅ Đã tạo 10 câu hỏi Listening"

# =============================================
# READING QUESTIONS (10 câu)
# =============================================
echo "  📖 Tạo câu hỏi Reading..."

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "true_false",
  "content": "Passage 1 - The Impact of Social Media on Modern Society: Social media platforms were originally designed primarily for commercial advertising purposes.",
  "options": ["True", "False", "Not Given"],
  "correctAnswer": "False",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "true_false",
  "content": "Passage 1: Research has shown that excessive use of social media can lead to increased feelings of anxiety and depression among teenagers.",
  "options": ["True", "False", "Not Given"],
  "correctAnswer": "True",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "multiple_choice",
  "content": "Passage 1: According to the passage, what percentage of teenagers report using social media daily?",
  "options": ["45%", "62%", "78%", "91%"],
  "correctAnswer": "91%",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "fill_in_blank",
  "content": "Passage 1: The author suggests that social media companies should implement stronger ______ policies to protect young users.",
  "correctAnswer": "privacy",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "multiple_choice",
  "content": "Passage 2 - Artificial Intelligence in Healthcare: What is the primary advantage of using AI in medical diagnosis mentioned in the passage?",
  "options": ["Lower cost of treatment", "Faster and more accurate detection of diseases", "Replacing human doctors entirely", "Reducing hospital wait times"],
  "correctAnswer": "Faster and more accurate detection of diseases",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "true_false",
  "content": "Passage 2: The passage states that AI systems have already completely replaced radiologists in analyzing X-ray images.",
  "options": ["True", "False", "Not Given"],
  "correctAnswer": "False",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "fill_in_blank",
  "content": "Passage 2: Machine learning algorithms can analyze thousands of medical ______ in a fraction of the time it would take a human specialist.",
  "correctAnswer": "images",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "multiple_choice",
  "content": "Passage 3 - The Future of Sustainable Architecture: Which of the following is NOT mentioned as a feature of green buildings?",
  "options": ["Solar panel integration", "Rainwater harvesting systems", "Underground parking structures", "Natural ventilation design"],
  "correctAnswer": "Underground parking structures",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "true_false",
  "content": "Passage 3: The author claims that sustainable buildings are always more expensive to construct than traditional buildings.",
  "options": ["True", "False", "Not Given"],
  "correctAnswer": "Not Given",
  "points": 10
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_READ_ID'",
  "type": "multiple_choice",
  "content": "Passage 3: What does the author conclude about the future of sustainable architecture?",
  "options": ["It will remain a niche market", "It will become the standard for all new constructions", "It is too expensive to implement widely", "It only works in tropical climates"],
  "correctAnswer": "It will become the standard for all new constructions",
  "points": 10
}' > /dev/null

echo "  ✅ Đã tạo 10 câu hỏi Reading"

# =============================================
# WRITING QUESTIONS (4 câu - Task 1 & Task 2)
# =============================================
echo "  ✍️ Tạo câu hỏi Writing..."

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_WRITE_ID'",
  "type": "fill_in_blank",
  "content": "Task 1: The bar chart below shows the number of international students enrolled in universities in four different countries (USA, UK, Australia, Canada) from 2015 to 2023. Summarize the information by selecting main features, and make comparisons where relevant. Write at least 150 words. In your overview, you should mention that ______ had the highest number of international students throughout the period.",
  "correctAnswer": "USA",
  "points": 25
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_WRITE_ID'",
  "type": "multiple_choice",
  "content": "Task 1: When describing a line graph that shows an upward trend followed by a sharp decline, which of the following phrases is most appropriate?",
  "options": ["remained stable throughout the period", "experienced a steady increase before plummeting dramatically", "fluctuated wildly without any clear pattern", "showed a consistent downward trend"],
  "correctAnswer": "experienced a steady increase before plummeting dramatically",
  "points": 25
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_WRITE_ID'",
  "type": "fill_in_blank",
  "content": "Task 2: Some people believe that university education should be free for all students. Others argue that students should pay tuition fees. Discuss both views and give your own opinion. A strong essay should have a clear ______ statement in the introduction.",
  "correctAnswer": "thesis",
  "points": 25
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_WRITE_ID'",
  "type": "multiple_choice",
  "content": "Task 2: Which of the following is the best topic sentence for a body paragraph discussing the advantages of free university education?",
  "options": ["Free education is good.", "There are several compelling arguments in favor of making higher education accessible to all, regardless of financial background.", "Some people think education should be free.", "Money is important for education."],
  "correctAnswer": "There are several compelling arguments in favor of making higher education accessible to all, regardless of financial background.",
  "points": 25
}' > /dev/null

echo "  ✅ Đã tạo 4 câu hỏi Writing"

# =============================================
# SPEAKING QUESTIONS (6 câu - Part 1, 2, 3)
# =============================================
echo "  🎤 Tạo câu hỏi Speaking..."

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "multiple_choice",
  "content": "Part 1 - Introduction: The examiner asks: \"Do you prefer to study in the morning or in the evening?\" Which response demonstrates the best IELTS Speaking technique?",
  "options": ["Morning.", "I prefer to study in the morning because I find my concentration levels are significantly higher when I am well-rested. Additionally, the quiet atmosphere in the early hours helps me focus on complex topics.", "I do not know, maybe morning or evening, both are fine for me.", "In my country, people usually study in the morning."],
  "correctAnswer": "I prefer to study in the morning because I find my concentration levels are significantly higher when I am well-rested. Additionally, the quiet atmosphere in the early hours helps me focus on complex topics.",
  "points": 15
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "multiple_choice",
  "content": "Part 1 - Introduction: \"What kind of music do you enjoy listening to?\" Which answer would score highest for fluency and coherence?",
  "options": ["Pop music.", "I am quite keen on indie and alternative rock music. I find the raw, authentic sound particularly appealing, and I often discover new artists through streaming platforms like Spotify.", "Music is very important in life. Everyone likes music.", "I like all types of music, no preference."],
  "correctAnswer": "I am quite keen on indie and alternative rock music. I find the raw, authentic sound particularly appealing, and I often discover new artists through streaming platforms like Spotify.",
  "points": 15
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "multiple_choice",
  "content": "Part 2 - Cue Card: \"Describe a book that you have recently read that made a strong impression on you. You should say: what the book was about, why you decided to read it, what you learned from it, and explain why it made a strong impression on you.\" How long should you speak for in Part 2?",
  "options": ["30 seconds to 1 minute", "1 to 2 minutes", "2 to 3 minutes", "3 to 5 minutes"],
  "correctAnswer": "1 to 2 minutes",
  "points": 20
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "fill_in_blank",
  "content": "Part 2: When preparing for the cue card topic, you are given ______ minute(s) to make notes before you start speaking.",
  "correctAnswer": "1",
  "points": 15
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "multiple_choice",
  "content": "Part 3 - Discussion: \"Do you think technology has changed the way people read books?\" Which response best demonstrates critical thinking and vocabulary range?",
  "options": ["Yes, technology changed reading.", "Absolutely. Technology has revolutionized reading habits in profound ways. E-readers and audiobooks have made literature more accessible, while social media platforms like Goodreads have created vibrant online reading communities. However, I believe there is still an irreplaceable charm in holding a physical book.", "I think people read less now because of phones.", "Technology is very important in modern society."],
  "correctAnswer": "Absolutely. Technology has revolutionized reading habits in profound ways. E-readers and audiobooks have made literature more accessible, while social media platforms like Goodreads have created vibrant online reading communities. However, I believe there is still an irreplaceable charm in holding a physical book.",
  "points": 20
}' > /dev/null

curl -s -X POST "$BASE_URL/questions" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d '{
  "examId": "'$EXAM_SPEAK_ID'",
  "type": "multiple_choice",
  "content": "Part 3 - Discussion: \"What are the benefits of learning a foreign language?\" Which linking phrase best introduces an additional point?",
  "options": ["But", "Furthermore", "Because", "However"],
  "correctAnswer": "Furthermore",
  "points": 15
}' > /dev/null

echo "  ✅ Đã tạo 6 câu hỏi Speaking"

# -----------------------------------------------
# 6. TEST: Lấy danh sách bài thi
# -----------------------------------------------
echo ""
echo "=========================================="
echo "🧪 BẮT ĐẦU TEST CÁC API"
echo "=========================================="

echo ""
echo "📌 [6/8] Test GET /exams - Lấy danh sách bài thi..."
EXAMS_RES=$(curl -s -X GET "$BASE_URL/exams" -H "$AUTH_HEADER")
EXAM_COUNT=$(echo $EXAMS_RES | grep -o '"_id"' | wc -l)
echo "✅ Số bài thi: $EXAM_COUNT"
echo "Response (truncated): $(echo $EXAMS_RES | head -c 200)..."

echo ""
echo "📌 Test GET /exams/:id - Lấy chi tiết bài thi Listening..."
EXAM_DETAIL=$(curl -s -X GET "$BASE_URL/exams/$EXAM_LISTEN_ID" -H "$AUTH_HEADER")
echo "✅ Exam Detail: $(echo $EXAM_DETAIL | head -c 200)..."

# -----------------------------------------------
# 7. TEST: Lấy câu hỏi theo bài thi
# -----------------------------------------------
echo ""
echo "📌 [7/8] Test GET /questions?examId=... - Lấy câu hỏi theo bài thi..."

echo ""
echo "  🎧 Câu hỏi Listening:"
Q_LISTEN=$(curl -s -X GET "$BASE_URL/questions?examId=$EXAM_LISTEN_ID" -H "$AUTH_HEADER")
Q_LISTEN_COUNT=$(echo $Q_LISTEN | grep -o '"_id"' | wc -l)
echo "  ✅ Số câu hỏi Listening: $Q_LISTEN_COUNT"

echo ""
echo "  📖 Câu hỏi Reading:"
Q_READ=$(curl -s -X GET "$BASE_URL/questions?examId=$EXAM_READ_ID" -H "$AUTH_HEADER")
Q_READ_COUNT=$(echo $Q_READ | grep -o '"_id"' | wc -l)
echo "  ✅ Số câu hỏi Reading: $Q_READ_COUNT"

echo ""
echo "  ✍️ Câu hỏi Writing:"
Q_WRITE=$(curl -s -X GET "$BASE_URL/questions?examId=$EXAM_WRITE_ID" -H "$AUTH_HEADER")
Q_WRITE_COUNT=$(echo $Q_WRITE | grep -o '"_id"' | wc -l)
echo "  ✅ Số câu hỏi Writing: $Q_WRITE_COUNT"

echo ""
echo "  🎤 Câu hỏi Speaking:"
Q_SPEAK=$(curl -s -X GET "$BASE_URL/questions?examId=$EXAM_SPEAK_ID" -H "$AUTH_HEADER")
Q_SPEAK_COUNT=$(echo $Q_SPEAK | grep -o '"_id"' | wc -l)
echo "  ✅ Số câu hỏi Speaking: $Q_SPEAK_COUNT"

# -----------------------------------------------
# 8. TEST: Lấy khóa học, test PATCH, test GET courses
# -----------------------------------------------
echo ""
echo "📌 [8/8] Test các API khác..."

echo ""
echo "  Test GET /courses..."
COURSES_RES=$(curl -s -X GET "$BASE_URL/courses" -H "$AUTH_HEADER")
echo "  ✅ Courses: $(echo $COURSES_RES | head -c 200)..."

echo ""
echo "  Test PATCH /exams/:id - Cập nhật bài thi Listening..."
PATCH_RES=$(curl -s -X PATCH "$BASE_URL/exams/$EXAM_LISTEN_ID" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d '{"description": "Bài thi Listening IELTS Academic - Updated: Gồm 4 sections, 40 câu hỏi, thời gian 30 phút."}')
echo "  ✅ Patch result: $(echo $PATCH_RES | head -c 200)..."

echo ""
echo "  Test GET /exams?courseId=... - Lọc bài thi theo khóa học..."
FILTERED_EXAMS=$(curl -s -X GET "$BASE_URL/exams?courseId=$COURSE_ID" -H "$AUTH_HEADER")
FILTERED_COUNT=$(echo $FILTERED_EXAMS | grep -o '"_id"' | wc -l)
echo "  ✅ Số bài thi thuộc khóa IELTS: $FILTERED_COUNT"

# -----------------------------------------------
# TỔNG KẾT
# -----------------------------------------------
echo ""
echo "=========================================="
echo "📊 TỔNG KẾT"
echo "=========================================="
echo "✅ Khóa học IELTS: 1"
echo "✅ Bài thi: 4 (Listening, Reading, Writing, Speaking)"
echo "✅ Câu hỏi Listening: $Q_LISTEN_COUNT"
echo "✅ Câu hỏi Reading: $Q_READ_COUNT"
echo "✅ Câu hỏi Writing: $Q_WRITE_COUNT"
echo "✅ Câu hỏi Speaking: $Q_SPEAK_COUNT"
echo "✅ Tổng câu hỏi: $(($Q_LISTEN_COUNT + $Q_READ_COUNT + $Q_WRITE_COUNT + $Q_SPEAK_COUNT))"
echo ""
echo "🎉 SEED DỮ LIỆU VÀ TEST API HOÀN TẤT!"
echo "=========================================="
