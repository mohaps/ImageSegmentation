__author__ = 'aub3'
import jinja2,os
from directories import *
TEST = True
DBNAME = 'visiondb'
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates')))
S3BUCKET = ""
CONFIG_PATH = __file__.split('__init__.py')[0]


