<?php
/**
 * Controller for automated source code execution
 *
 * @author Chandra Shekhar <shekharsharma705@gmail.com>
 * @package controllers
 * @since Sept 07, 2014
 */
class ExecuteController extends AbstractController {

    const MODULE_KEY = 'execute';
    const ERROR_FILE = '/tmp/errors';
    const SH_SCRIPT  = '/tmp/code_exec_script.sh';

    protected $executionResponse;

    public function __construct() {
        parent::__construct();
        $this->view = new ExecuteView();
        $this->executionResult = array(
            'code' => '',
            'msg'  => ''
        );
    }

    protected function getExecResponse($code, $msg) {
        $this->executionResponse['code'] = $code;
        $this->executionResponse['msg']  = $msg;
        return $this->executionResponse;
    }
    
    /**
     * @see AbstractController::run()
     */
    public function run(Resource $resource) {
        $pid = RequestManager::getParam('id');
        $this->execute($pid);
    }

    protected function execute($pid) {
        $details = (new ProgramDetailsController())->getProgramListById($pid);
        $language = $details[ProgramDetails_DBTable::FK_LANGUAGE_ID];
        $category = $details[ProgramDetails_DBTable::FK_CATEGORY_ID];
        $fileDir = Configuration::get(Configuration::CODE_BASE_DIR)
        . $language . '/' . $category;
        $fileName = $details[ProgramDetails_DBTable::STORED_FILE_NAME];
        switch ($language) {
            case 'c':
                $this->cLang($fileDir, $fileName);
                break;
            default:
                echo 'This feature currently support only C Language programs!';
        }
    }

    protected function cLang($fileDir, $fileName) {
        chdir($fileDir);
        $cmd = '`gcc ' . $fileName . ' &> '.self::ERROR_FILE.'`';
        file_put_contents(self::SH_SCRIPT, $cmd);
        shell_exec('bash ' . self::SH_SCRIPT);
        $errors = file_get_contents(self::ERROR_FILE);
        if (empty($errors)) {
            if (is_file('a.out')) {
                $output = shell_exec('./a.out');
                $this->setBean($this->getExecResponse(Constants::SUCCESS_RESPONSE, $output));
            } else {
                $msg = 'a.out: No such file or directory';
                $this->setBean($this->getExecResponse(Constants::SUCCESS_RESPONSE, $msg));
            }
        } else {
            $this->setBean($this->getExecResponse(Constants::FAILURE_RESPONSE, $errors));
        }
        $this->getView()->setViewName(self::MODULE_KEY)->display();
    }
}