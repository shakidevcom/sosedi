<?php

namespace App\Libs;

class Logger
{

    protected $logs = [];

    protected static $datetime = null;

    protected $type;
    protected $isEnabled;

    public function __construct($type, $isEnabled = true)
    {
        $this->type = $type;
        $this->isEnabled = $isEnabled;
        if (!file_exists(\path('logs'))) {
            $logs = 'logs';
            mkdir(\path($logs), 0777, true);
        }
        $files = [];
        foreach (scandir(\path('logs')) as $file) {
            if (stripos($file, $type) !== false) {
                $files[] = $file;
            }
        }
        $unsets = 3;
        $total_files = count($files);
        if ($total_files > $unsets) {
            for ($i = 1; $i <= $unsets; $i++) {
                unset($files[$total_files - $i]);
            }
            foreach ($files as $file) {
                @unlink(\path('logs/' . $file));
            }
        }
    }

    public function log($message)
    {
        if (!$this->isEnabled) return;

        if (is_array($message)) {
            foreach ($message as $item) {
                $this->log($item);
            }

            return;
        }

        $datetime = date('Y-m-d H:i:s');

        $this->display($message, $datetime);
        $this->storeFile($message, $datetime);
    }

    protected function display($message, $datetime)
    {
        $output = "{$datetime}: {$message}";

        if (php_sapi_name() === 'cli') {
            echo $output, "\n";
        } else {
            echo htmlspecialchars($output), "<br>\n";
        }
    }

    protected function storeFile($message, $datetime)
    {
        if(is_null(self::$datetime)){
            self::$datetime = date('Y-m-d H:i:s');
        }
        $file = fopen(\path("logs/{$this->type}-".self::$datetime.".log"), 'a');
        fwrite($file, "{$datetime}: {$message}\n");
        fclose($file);
    }

    public function line()
    {
        if (!$this->isEnabled) return;

        $message = '=================================================================================';

        if (php_sapi_name() === 'cli') {
            echo $message, "\n";
        } else {
            echo $message, "<br>\n";
        }
    }

    public function getFile()
    {
        return \path("logs/" . $this->type . "/" . self::$datetime . ".log");
    }

}
