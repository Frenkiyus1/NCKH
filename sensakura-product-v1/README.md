# SenSakura Product v1

Bản này được làm lại theo yêu cầu:

- Có luồng chọn **Lớp → Môn → Bài**.
- Giao diện dạng cổng học tập giống tinh thần các website học tập Việt Nam: tìm kiếm, mục lục theo lớp/môn/chương/bài, nội dung trung tâm và sidebar tiến độ; nhưng thiết kế tối giản và hiện đại hơn.
- Chỉ **Bài 16 – Hàm số bậc hai, Toán 10 Kết nối tri thức** được mở đầy đủ.
- Các nội dung khác vẫn xuất hiện trong mục lục nhưng khóa / “đang mở rộng”.
- Bài 16 có đủ 4 mô-đun:
  1. Từ vựng
  2. Ngữ pháp
  3. Đọc & Viết
  4. Giao tiếp (nghe + nói/nhập văn bản)
- Giao tiếp dùng Web Speech API của trình duyệt:
  - SpeechSynthesis để phát câu hỏi tiếng Nhật.
  - SpeechRecognition nếu trình duyệt hỗ trợ.
  - Luôn có fallback nhập bàn phím.
- Có Learning DNA, Sổ lỗi và xuất CSV.
- Không có dependency, không có npm, không có bundler nên tránh lỗi trắng do build.

## GitHub → Cloudflare Pages

Cấu trúc repo:

```text
/
├─ README.md
└─ public/
   ├─ index.html
   ├─ main.js
   └─ style.css
```

Cloudflare Pages:

- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`
- Root directory: `/`

## Demo trước hội đồng

1. Trang chủ: giải thích mô hình lớp → môn → bài.
2. Mục lục: cho thấy 9 chương Toán 10 và các bài bị khóa.
3. Mở Bài 16.
4. Từ vựng: đánh dấu vài từ đã biết.
5. Ngữ pháp: làm câu mẫu.
6. Đọc & Viết: giải bài tìm đỉnh và viết câu trả lời tiếng Nhật.
7. Giao tiếp:
   - nhấn “Nghe câu hỏi”
   - trả lời bằng micro hoặc nút câu trả lời nhanh
   - hoàn thành hai lượt hội thoại.
8. Learning DNA: cho thấy từng kỹ năng thay đổi độc lập.
9. Sổ lỗi: cho thấy lỗi được lưu và có thể xuất CSV.

## Lưu ý

Bản demo cố tình không gọi mô hình AI bên ngoài trong critical path để đảm bảo chạy ổn định trên Cloudflare. Phần “cá nhân hóa” hiện được thể hiện bằng Learning DNA và thuật toán thích ứng minh bạch. Khi cần tích hợp GenAI thật, nên đặt ở một Worker/API riêng để lỗi AI không làm hỏng toàn bộ giao diện.
