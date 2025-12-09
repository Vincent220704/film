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
