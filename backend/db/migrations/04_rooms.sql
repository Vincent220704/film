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
