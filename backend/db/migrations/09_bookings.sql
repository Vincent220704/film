CREATE TABLE IF NOT EXISTS bookings (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED   NOT NULL,
    showtime_id     BIGINT UNSIGNED   NOT NULL,
    voucher_id      BIGINT UNSIGNED   DEFAULT NULL,
    booking_code    VARCHAR(50)       NOT NULL UNIQUE,
    status          ENUM('PENDING','PAID','CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_amount    DECIMAL(10,2)     NOT NULL,
    discount_amount DECIMAL(10,2)     NOT NULL DEFAULT 0,
    final_amount    DECIMAL(10,2)     NOT NULL,
    payment_method  VARCHAR(50)       DEFAULT NULL,
    payment_ref     VARCHAR(100)      DEFAULT NULL,
    created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    paid_at         DATETIME          DEFAULT NULL,
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_showtime
        FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_voucher
        FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
