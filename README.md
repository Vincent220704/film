Chạy lại từ đầu. cài đặt mới
docker compose down -v
docker compose up --build

chạy lại bình thường
docker compose down
docker compose up --build



momo thành công

http://localhost:3000/api/payments/return?orderId=8-1764509114509&resultCode=0&amount=350000&message=Success

không thành công

http://localhost:3000/api/payments/return?orderId=8-1764509114509&resultCode=0&amount=350000&message=Success

