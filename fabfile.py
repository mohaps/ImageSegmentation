from fabric.api import env,local,run,sudo,put,cd,lcd,puts,task
from fabric.operations import local as lrun, run
from fabric.state import env
import os,sys,logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                    datefmt='%m-%d %H:%M',
                    filename='logs/fab.log',
                    filemode='a')
sys.path.insert(1, os.path.join(os.path.abspath('.'), 'appcode/vendor'))
vendor_dir = os.path.join(os.path.dirname(__file__), 'appcode/vendor')


@task
def test():
    """
    Test GAE version
    """
    local('dev_appserver.py .')

@task
def deploy():
    """
    Deploy GAE version
    """
    local('appcfg.py --oauth2 update . ')

@task
def clear():
    """
    remove logs
    """
    local('rm logs/*.log &')

