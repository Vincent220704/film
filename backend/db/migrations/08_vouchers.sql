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
