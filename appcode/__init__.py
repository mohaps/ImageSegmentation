__author__ = 'aub3'
import os,logging
import config
from flask import Flask
app = Flask(__name__,static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.jinja_env = config.jinja_env






if os.environ.get('SERVER_SOFTWARE',''):
    # print os.environ.get('SERVER_SOFTWARE','')
    from remote import view
    view.add_views(app)
    if os.environ.get('SERVER_SOFTWARE','').startswith('Development'):
        app.debug = True
else:
    raise NotImplementedError


