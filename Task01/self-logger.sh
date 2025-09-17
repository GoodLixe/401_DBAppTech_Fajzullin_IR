#!/bin/bash

# Путь к базе данных
DB_FILE="self_logger.db"

# Проверяем, существует ли БД. Если нет - создаем структуру.
if [ ! -f "$DB_FILE" ]; then
    sqlite3 "$DB_FILE" "
        CREATE TABLE IF NOT EXISTS run_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            run_date TEXT NOT NULL
        );
    "
    echo "База данных создана."
fi

# Получаем текущие данные
current_user=$(whoami)
current_date=$(date '+%Y.%m.%d %H:%M')

# Вставляем новую запись о запуске
sqlite3 "$DB_FILE" "
    INSERT INTO run_log (username, run_date) VALUES ('$current_user', '$current_date');
"

# Считаем общее количество запусков
total_runs=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM run_log;")

# Находим дату первого запуска
first_run=$(sqlite3 "$DB_FILE" "SELECT run_date FROM run_log ORDER BY id ASC LIMIT 1;")

# Выводим общую статистику
echo "Имя программы: self-logger.sh"
echo "Количество запусков: $total_runs"
echo "Первый запуск: $first_run"
echo "---------------------------------------------"
echo "User      | Date"
echo "---------------------------------------------"

# Выводим историю всех запусков
sqlite3 "$DB_FILE" -header -column "
    SELECT username as 'User', run_date as 'Date'
    FROM run_log
    ORDER BY id DESC;
"

echo "---------------------------------------------"
