CREATE TABLE IF NOT EXISTS showtimes (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    movie_id     BIGINT UNSIGNED   NOT NULL,
    room_id      BIGINT UNSIGNED   NOT NULL,
    start_time   DATETIME          NOT NULL,
    end_time     DATETIME          NOT NULL,
    base_price   DECIMAL(10,2)     NOT NULL,
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
