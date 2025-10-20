<?php
namespace Goodlixe\GuessNumber;

class GameRepositoryORM
{
    private $db;

    public function __construct(DatabaseORM $db)
    {
        $this->db = $db;
        $this->db->setupSchema();
    }

    public function createGame($playerName, $secretNumber, $maxAttempts = 10)
    {
        $game = \RedBeanPHP\R::dispense('game');
        $game->playerName = $playerName;
        $game->secretNumber = $secretNumber;
        $game->maxAttempts = $maxAttempts;
        $game->attemptsCount = 0;
        $game->result = 'in_progress';
        $game->createdAt = date('Y-m-d H:i:s');
        
        return \RedBeanPHP\R::store($game);
    }

    public function saveAttempt($gameId, $attemptNumber, $guess, $result)
    {
        $attempt = \RedBeanPHP\R::dispense('attempt');
        $attempt->gameId = $gameId;
        $attempt->attemptNumber = $attemptNumber;
        $attempt->guess = $guess;
        $attempt->result = $result;
        $attempt->createdAt = date('Y-m-d H:i:s');
        
        \RedBeanPHP\R::store($attempt);
    }

    public function updateGameResult($gameId, $result, $attemptsCount)
    {
        $game = \RedBeanPHP\R::load('game', $gameId);
        if ($game->id) {
            $game->result = $result;
            $game->attemptsCount = $attemptsCount;
            \RedBeanPHP\R::store($game);
        }
    }

    public function getAllGames($filter = null)
    {
        if ($filter === 'win') {
            return \RedBeanPHP\R::find('game', ' result = ? ORDER BY createdAt DESC', ['win']);
        } elseif ($filter === 'loose') {
            return \RedBeanPHP\R::find('game', ' result = ? ORDER BY createdAt DESC', ['loose']);
        } else {
            return \RedBeanPHP\R::findAll('game', ' ORDER BY createdAt DESC');
        }
    }

    public function getGameById($gameId)
    {
        return \RedBeanPHP\R::load('game', $gameId);
    }

    public function getGameAttempts($gameId)
    {
        return \RedBeanPHP\R::find('attempt', ' game_id = ? ORDER BY attempt_number', [$gameId]);
    }

    public function getTopPlayers()
    {
        $sql = "
            SELECT 
                player_name,
                COUNT(*) as total_games,
                SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN result = 'loose' THEN 1 ELSE 0 END) as losses
            FROM game 
            WHERE result IN ('win', 'loose')
            GROUP BY player_name
            ORDER BY wins DESC, total_games DESC
        ";
        
        return \RedBeanPHP\R::getAll($sql);
    }
}
?>