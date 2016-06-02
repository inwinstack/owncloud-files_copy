<?php
/**
 * ownCloud - files_copy
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author simon <simon.l@inwinstack.com>
 * @copyright simon 2016
 */

namespace OCA\Files_Copy\AppInfo;

use OC\AppFramework\Utility\SimpleContainer;
use OCA\Files\Controller\ApiController;
use OCP\AppFramework\App;
use \OCA\Files\Service\TagService;
use \OCP\IContainer;

class Application extends App {
    public function __construct(array $urlParams=array()) {
        parent::__construct('files_copy', $urlParams);
        $container = $this->getContainer();

        /**
         * UserFolder
         */
         $container->registerService('UserFolder', function (IContainer $c) {
            return $c->query('ServerContainer')->getUserFolder();
         });
    }
}
