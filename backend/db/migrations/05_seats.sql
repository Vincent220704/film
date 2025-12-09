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
