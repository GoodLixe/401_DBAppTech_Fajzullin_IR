<?php
namespace Goodlixe\GuessNumber;

class DatabaseORM
{
    private $dbPath;

    public function __construct($dbPath = 'game_database.db')
    {
        // Правильный путь из папки src
        $facadePath = __DIR__ . '/../vendor/gabordemooij/redbean/RedBeanPHP/Facade.php';
        
        if (!file_exists($facadePath)) {
            throw new \Exception("RedBeanPHP Facade not found at: $facadePath");
        }
        
        require_once $facadePath;
        $this->dbPath = $dbPath;
        $this->connect();
    }

    private function connect()
    {
        \RedBeanPHP\R::setup('sqlite:' . $this->dbPath);
    }

    public function setupSchema()
    {
        try {
            $test = \RedBeanPHP\R::findOne('game', ' LIMIT 1');
        } catch (\Exception $e) {
            // Игнорируем ошибки
        }
    }
}
?>