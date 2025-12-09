CREATE TABLE IF NOT EXISTS users (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100)        NOT NULL,
    email         VARCHAR(150)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)        NOT NULL,
    phone         VARCHAR(20),
    role          ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP           NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movies (
    id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(255)       NOT NULL,
    original_title   VARCHAR(255),
    description      TEXT,
    duration_minutes INT                NOT NULL,
    language         VARCHAR(50),
    age_rating       VARCHAR(20),
    genre            VARCHAR(255),
    poster_url       VARCHAR(500),
    backdrop_url     VARCHAR(500),
    trailer_url      VARCHAR(500),
    release_date     DATE,
    is_active        TINYINT(1)         NOT NULL DEFAULT 1,
    created_at       TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP          NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cinemas (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)      NOT NULL,
    address     VARCHAR(255)      NOT NULL,
    city        VARCHAR(100),
    hotline     VARCHAR(20),
    description TEXT,
    logo_url    VARCHAR(500),
    map_url     VARCHAR(500),
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS rooms (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cinema_id   BIGINT UNSIGNED   NOT NULL,
    name        VARCHAR(100)      NOT NULL,
    total_rows  INT               NOT NULL,
    total_cols  INT               NOT NULL,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rooms_cinema
        FOREIGN KEY (cinema_id) REFERENCES cinemas(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS seats (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_id     BIGINT UNSIGNED   NOT NULL,
    row_label   VARCHAR(5)        NOT NULL,
    seat_number INT               NOT NULL,
    seat_type   ENUM('NORMAL','VIP','COUPLE') NOT NULL DEFAULT 'NORMAL',
    is_active   TINYINT(1)        NOT NULL DEFAULT 1,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_seats_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_seat_unique_per_room
        UNIQUE (room_id, row_label, seat_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS showtimes (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    movie_id     BIGINT UNSIGNED   NOT NULL,
    room_id      BIGINT UNSIGNED   NOT NULL,
    start_time   DATETIME          NOT NULL,
    end_time     DATETIME          NOT NULL,
    base_price   DECIMAL(10,2)     NOT NULL,
    format       VARCHAR(50),      -- 2D, 3D, IMAX, 4DX, 4K,...
    language     VARCHAR(50),      -- phụ đề, lồng tiếng,...
    status       ENUM('SCHEDULED','CANCELLED','FINISHED') NOT NULL DEFAULT 'SCHEDULED',
    created_at   TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_showtimes_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_showtimes_room
        FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_showtimes_movie_start_time (movie_id, start_time),
    INDEX idx_showtimes_room_start_time (room_id, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS combos (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)      NOT NULL,
    description TEXT,
    price       DECIMAL(10,2)     NOT NULL,
    image_url   VARCHAR(255),     -- trường để lưu đường dẫn ảnh
    is_active   TINYINT(1)        NOT NULL DEFAULT 1,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP         NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS vouchers (
    id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code                 VARCHAR(50)       NOT NULL UNIQUE,
    description          VARCHAR(255),
    discount_type        ENUM('PERCENT','AMOUNT') NOT NULL,
    discount_value       DECIMAL(10,2)    NOT NULL,
    max_discount_amount  DECIMAL(10,2)    DEFAULT NULL,
    min_order_total      DECIMAL(10,2)    DEFAULT NULL,
    start_date           DATETIME         NOT NULL,
    end_date             DATETIME         NOT NULL,
    usage_limit          INT              DEFAULT NULL,
    usage_count          INT              NOT NULL DEFAULT 0,
    is_active            TINYINT(1)       NOT NULL DEFAULT 1,
    created_at           TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP        NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE IF NOT EXISTS booking_seats (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id  BIGINT UNSIGNED   NOT NULL,
    seat_id     BIGINT UNSIGNED   NOT NULL,
    price       DECIMAL(10,2)     NOT NULL,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_seats_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_booking_seats_seat
        FOREIGN KEY (seat_id) REFERENCES seats(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_booking_seat_unique
        UNIQUE (booking_id, seat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS booking_combos (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id  BIGINT UNSIGNED   NOT NULL,
    combo_id    BIGINT UNSIGNED   NOT NULL,
    quantity    INT               NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2)     NOT NULL,
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_combos_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_booking_combos_combo
        FOREIGN KEY (combo_id) REFERENCES combos(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'MOMO',
  order_id VARCHAR(64) NOT NULL,
  request_id VARCHAR(64) NOT NULL,
  amount BIGINT NOT NULL,
  status ENUM('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  raw_response TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_order_id (order_id),
  INDEX idx_booking_id (booking_id),
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);