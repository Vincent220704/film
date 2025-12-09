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
