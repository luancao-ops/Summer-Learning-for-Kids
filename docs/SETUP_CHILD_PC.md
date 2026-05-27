# Setup Child PC — Summer Quest

Hướng dẫn chuyển Summer Quest sang máy khác để các bé học hằng ngày.

## 1. Máy cần chuẩn bị

Cài trước:

- Windows 10/11
- Node.js LTS, khuyến nghị bản 22.x hoặc 24.x
- Trình duyệt Chrome hoặc Edge

Kiểm tra sau khi cài Node.js:

```powershell
node -v
npm -v
```

## 2. Copy project sang máy mới

Copy nguyên thư mục:

```text
D:\Project Learning For Kids
```

Sang máy mới, có thể đặt cùng đường dẫn hoặc một đường dẫn dễ nhớ, ví dụ:

```text
D:\Project Learning For Kids
```

Nếu muốn copy nhẹ hơn, có thể bỏ qua các thư mục sau:

```text
summer-quest\node_modules
summer-quest\.next
```

Sau đó chạy `npm install` lại trên máy mới.

## 3. Cài dependencies

Mở PowerShell tại thư mục root:

```powershell
cd "D:\Project Learning For Kids"
npm install --prefix summer-quest
```

## 4. Chuẩn bị database

### Cách A — Máy mới hoàn toàn, chưa cần giữ tiến độ cũ

Chạy:

```powershell
npm run prisma:migrate
npm run prisma:seed
```

Lưu ý: `prisma:seed` tạo lại dữ liệu mẫu và reset tiến độ.

### Cách B — Copy cả tiến độ hiện tại sang máy mới

Không chạy `prisma:seed`.

Đảm bảo đã copy file database này từ máy cũ:

```text
summer-quest\prisma\dev.db
```

Sau đó chỉ chạy:

```powershell
npm run prisma:migrate
```

## 5. Start app cho các bé học

Cách dễ nhất: double-click file:

```text
D:\Project Learning For Kids\start-dev.ps1
```

Nếu Windows hỏi quyền chạy script, mở PowerShell và chạy:

```powershell
powershell -ExecutionPolicy Bypass -File "D:\Project Learning For Kids\start-dev.ps1"
```

Sau khi server báo ready, mở:

```text
http://127.0.0.1:3000
```

Giữ cửa sổ server mở trong lúc dùng app.

## 6. Tạo shortcut cho bé

Tạo 2 shortcut trên Desktop:

1. Shortcut start server:

```text
D:\Project Learning For Kids\start-dev.ps1
```

2. Shortcut mở app:

```text
http://127.0.0.1:3000
```

Quy trình hằng ngày:

1. Ba/mẹ double-click `start-dev.ps1`
2. Bé mở shortcut `Summer Quest`
3. Học xong thì đóng browser
4. Đóng cửa sổ server nếu không dùng nữa

## 7. Backup dữ liệu

Dữ liệu local nằm trong:

```text
summer-quest\prisma\dev.db
```

Nên backup định kỳ file này sang USB/OneDrive/Google Drive.

Muốn chuyển tiến độ sang máy khác, copy file `dev.db` này sang đúng vị trí trên máy mới.

## 8. Troubleshooting

Nếu web không mở được:

1. Kiểm tra cửa sổ server còn mở không.
2. Kiểm tra URL là `http://127.0.0.1:3000`.
3. Nếu bị kẹt `Rendering...`, đảm bảo script đang dùng Webpack mode:

```powershell
npm run dev
```

Trong `summer-quest/package.json`, script dev phải có:

```json
"dev:local": "next dev --webpack --hostname 127.0.0.1 --port 3000"
```

Nếu port 3000 bị chiếm, đóng các cửa sổ server cũ rồi chạy lại.
