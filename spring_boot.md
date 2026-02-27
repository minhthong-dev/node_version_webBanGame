# TÀI LIỆU ĐẶC TẢ CHI TIẾT DỰ ÁN WEB BÁN GAME (NODEJS -> SPRING BOOT)

Tài liệu này cung cấp đầy đủ thông tin kỹ thuật, logic nghiệp vụ và cấu trúc để một AI Agent có thể tạo ra dự án Spring Boot hoàn chỉnh, có thể chạy ngay lập tức.

## 1. Cấu trúc Dự án (Standard Maven)
```text
src/main/java/com/example/game/
├── config/             # Cấu hình Security, CORS, Cloudinary, PayOS, Socket
├── controller/         # API Endpoints
├── dto/                # Request/Response Data Transfer Objects
├── entity/             # MongoDB Documents
├── exception/          # Centralized Error Handling
├── repository/         # Spring Data MongoDB Repositories
├── security/           # JWT Filter, UserDetailsService, Auth Providers
├── service/            # Business Logic Implementation
└── utils/              # AES Decryptor, OTP Generator, JwtUtils
```

## 2. Dependencies (pom.xml)
- `spring-boot-starter-web`: Xây dựng RESTful API.
- `spring-boot-starter-data-mongodb`: Kết nối và thao tác MongoDB.
- `spring-boot-starter-security`: Bảo mật hệ thống.
- `spring-boot-starter-validation`: Validate dữ liệu đầu vào (@Valid).
- `spring-boot-starter-mail`: Gửi email xác thực, OTP, Key game.
- `lombok`: Giảm bớt code boilerplate (Getter, Setter, NoArgs...).
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson`: Xử lý JWT.
- `payos-java`: SDK chính thức của PayOS.
- `cloudinary-http44`: SDK Cloudinary để quản lý ảnh.

## 3. Cấu hình Hệ thống (application.yml)
```yaml
spring:
  data:
    mongodb:
      uri: ${MONGO_URI}
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

jwt:
  secret: ${JWT_SECRET}
  expiration: 3600000 # 1 hour

crypto:
  aes-secret: ${CRYPTO_JS_SECRET} # Dùng để decrypt query từ frontend

payos:
  client-id: ${BANK_CLIENT_ID}
  api-key: ${BANK_API_KEY}
  checksum-key: ${BANK_CHEKSUM_KEY}

cloudinary:
  cloud-name: ${CLOUDINARY_NAME}
  api-key: ${CLOUDINARY_API_KEY}
  api-secret: ${CLOUDINARY_API_SECRET}
```

## 4. Đặc tả Entity (MongoDB)

### User Entity
- `String id` (ObjectId)
- `String username`, `String email`, `String password` (BCrypt)
- `String avatar`, `String themePic`
- `boolean isBlock` (default: false)
- `Boolean isVerified`
- `String verifyToken`, `Date verifyTokenExpiry`
- `Role role` (Enum: USER, ADMIN, SUPER_ADMIN)
- `Double amount` (default: 0.0)
- `String otpForgotPassword`, `Date otpForgotPasswordExpiry`

### Game Entity
- `String id`
- `String name`, `String content`, `String downloadKey`, `Double price`
- `Date releaseDate`
- `List<String> genre`
- `Media media` (Embedded: `coverImage`, `screenshots (List)`, `trailer`)
- `List<String> like` (userIds), `List<String> wishlist` (userIds)

### History Entity
- `String userId` (Ref: User)
- `HistoryType type` (AMOUNT, BUYING)
- `Double totalValue`
- `List<String> gameIds` (Chỉ dùng khi type=BUYING)
- `boolean isHide`

## 5. Logic Nghiệp Vụ Quan Trọng (Must Implementation)

### A. AES Decryption (Tương thích CryptoJS)
Frontend gửi query search mã hóa AES. Backend Java phải dùng `Cipher` (AES/ECB/PKCS5Padding hoặc tương đương) để giải mã.
- **Key**: Lấy từ `crypto.aes-secret`.

### B. Hệ thống Thanh toán (PayOS)
1. **Tạo Link**: Gọi PayOS SDK tạo yêu cầu thanh toán. `orderCode` sử dụng `System.currentTimeMillis()`.
2. **Webhook**: Sau khi thanh toán, PayOS gọi Webhook. Phải verify checksum bằng `PayOS.verifyWebhookData(data)`.
3. **Cập nhật**: Nếu thành công, cộng tiền vào `user.amount` và lưu `History`. Gửi thông báo qua Socket.

### C. Luồng Mua Game
1. Transactional: Đảm bảo quá trình trừ tiền và lưu lịch sử là nguyên tử.
2. Kiểm tra số dư: `if (user.getAmount() < totalAmount) throw InsufficientBalanceException`.
3. Sinh Key: Mỗi game mua thành công sinh 1 chuỗi 8 ký tự Hex: `UUID.randomUUID().toString().substring(0, 8).toUpperCase()`.
4. Gửi Mail: Sử dụng `Thymeleaf` template để gửi email danh sách game và Key vừa mua.

## 6. Real-time (Socket.io Java)
Sử dụng thư viện `netty-socketio`:
- Khi user kết nối, lưu `socketId` map với `userId`.
- Các Event:
    - `buy_success`: Gửi về client để update balance dashboard.
    - `receive_user_message`: Server trung chuyển tin nhắn giữa User và Admin.
    - `receive_user_block`: Buộc user logout ngay lập tức khi admin block.

## 7. Security chi tiết
- **JWTFilter**: Kiểm tra Header `Authorization: Bearer <token>`, parse ra `userId` và `role`, sau đó set vào `SecurityContextHolder`.
- **CORS**: Cho phép `http://localhost:5173`, `http://localhost:5174`, cho phép đầy đủ phương thức (GET, POST, PUT, DELETE) và AllowCredentials.
- **Phân quyền**:
    - `/api/games/**` (GET): Public.
    - `/api/games/**` (POST/PUT/DELETE): Admin only.
    - `/api/buy/**`: User authenticated.

## 8. Đặc tả chi tiết Service Layer

### IUserService
- `UserResponseDTO register(RegisterRequestDTO)`: 
    - Validate email/username duy nhất. Encode password (BCrypt).
    - Sinh `verifyToken`. Lưu User (isVerified=false). Gửi mail xác thực.
- `LoginResponseDTO login(LoginRequestDTO)`: 
    - Kiểm tra credentials. Check `isBlock`. 
    - Tạo JWT chứa `userId`, `role`, `username`, `email`.
- `void verifyEmail(String token)`: Active user, xóa token.
- `void forgotPassword(String email, String username)`: Sinh OTP (15p), gửi mail reset.
- `void resetPassword(String otp, String newPassword)`: Cập nhật pass mới.
- `Double getBalance(String userId)`: Lấy số dư hiện tại.
- `void updateAmount(String userId, Double amount, String type)`: Cộng/trừ tiền + tạo History record + Emit Socket `nap_tien_thanh_cong`.
- `void blockUser(String id)` / `void unblockUser(String id)`: Admin khóa/mở khóa.

### IGameService
- `List<GameResponseDTO> findAll()`: Toàn bộ game.
- `GameResponseDTO findById(String id)`: Chi tiết game.
- `GameResponseDTO create(GameRequestDTO)`: Admin thêm game.
- `GameResponseDTO update(String id, GameRequestDTO)`: Admin sửa game.
- `void delete(String id)`: Admin xóa game.
- `List<GameResponseDTO> search(String encryptedQuery)`: 
    - Giải mã query (AES). 
    - Build `Query` động: `name` (regex), `genre` (regex), `price` (between min/max), `releaseDate`.
- `void toggleLike(String gameId, String userId)`: Thêm/Xóa userId vào mảng `like`.
- `void toggleWishlist(String gameId, String userId)`: Thêm/Xóa userId vào mảng `wishlist`.
- `long countLikes(String gameId)`: Đếm số lượt thích.

### ICartService
- `void addToCart(String userId, String gameId)`: Check trùng game trong cart, push gameId vào mảng.
- `List<GameResponseDTO> getCart(String userId)`: Lấy danh sách game trong giỏ hàng.
- `void removeFromCart(String userId, String gameId)`: Pull gameId khỏi mảng.

### ICategoryService
- `List<Category> findAll()`: Lấy tất cả category.
- `Category create(String name)`: Admin thêm category.
- `void update(String id, String name)`: Admin sửa tên category.
- `void delete(String id)`: Admin xóa category.

### IDiscountService
- `List<Discount> findAll()`: Danh sách mã giảm giá.
- `Discount create(DiscountRDTO)`: Validate không được trùng categoryId/gameId đang có discount active.
- `void update(String id, DiscountRDTO)`: Cập nhật thông tin.

### IBuyService (Transactional)
- `void processPurchase(String userId, List<String> gameIds)`: 
    - Tính tổng giá. Check số dư. 
    - Trừ tiền User. 
    - Tạo `History` (type: buying). 
    - Sinh list 8-char hex Key cho mỗi game. 
    - Gửi mail template `Giao Dịch Thành Công`. 
    - Emit Socket `buy_success`.

### IPaymentService (PayOS)
- `String createPaymentLink(Double amount, String description, Long orderCode)`: Gọi PayOS SDK.
- `void processWebhook(PayOSWebhookData)`: Verify checksum -> `userService.updateAmount`.

### IHistoryService
- `List<HistoryDTO> findByUserId(String userId)`: Lịch sử nạp/mua của user.
- `List<HistoryDTO> findAll()`: Admin xem toàn bộ history.

## 9. Đặc tả chi tiết Controller (REST Endpoints)

### Auth & User (`/api/users`)
- `POST /register`, `POST /login`, `GET /verify-email`, `POST /forgot-password`, `POST /reset-password`.
- `PUT /block/{id}`, `PUT /unblock/{id}` (ADMIN).
- `GET /amount/{userId}`.

### Game (`/api/games`)
- `GET /`, `GET /{id}`, `POST /` (ADMIN), `PUT /{id}` (ADMIN), `DELETE /{id}` (ADMIN).
- `GET /search?q=...`: Nhận query AES.
- `POST /like`, `POST /unlike`, `GET /likes/count/{gameId}`.
- `POST /wishlist`, `POST /wishlist/remove`, `GET /wishlist/{userId}`.

### Cart (`/api/cart`)
- `POST /add`, `POST /remove`, `GET /{userId}`.

### Category (`/api/categories`)
- `GET /`, `POST /` (ADMIN), `PUT /{id}` (ADMIN), `DELETE /{id}` (ADMIN).

### Discount (`/api/discount`)
- `GET /`, `POST /` (ADMIN), `DELETE /{id}` (ADMIN).

### Buy (`/api/buy`)
- `POST /game`: Nhận list gameIds.

### Payment (`/api/payment`)
- `POST /create-link`, `POST /webhook`.

### History (`/api/history`)
- `GET /{userId}`, `GET /all` (ADMIN).

## 10. Các Lớp DTO Quan Trọng
- `RegisterRequest`, `LoginResponse`, `GameResponse`, `CartResponse`, `PaymentLinkResponse`.

## 11. Hướng dẫn AI Agent Thực Thi (CRITICAL)
1. **Dữ liệu**: Entity MongoDB phải mapping đúng kiểu `List<String>` cho genre/like/wishlist.
2. **Real-time**: Phải có `SocketIOService` để gửi event `nap_tien_thanh_cong` và `buy_success`.
3. **Mã hóa**: `AESUtils` phải giải mã được dữ liệu mã hóa từ `crypto-js` (ECB/PKCS5Padding).
4. **Format Trả về**: Luôn bọc kết quả trong `ResponseEntity` với các HTTP Status phù hợp.
5. **Security**: Cấu hình `HttpSecurity` để permit/deny các Role ADMIN/USER chính xác.
