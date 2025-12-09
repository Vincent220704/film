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
