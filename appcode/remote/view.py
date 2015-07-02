__author__ = 'aub3'
#!/usr/bin/env python
from flask import render_template, redirect, request, abort
from functools import wraps
from google.appengine.api import users
from .. import auth

def login_required(func):
    """Requires standard login credentials"""
    @wraps(func)
    def decorated_view(*args, **kwargs):
        current = users.get_current_user()
        if not current:
            return redirect(users.create_login_url(request.url))
        elif current.email() == 'akshayubhat@gmail.com':
            return func(*args, **kwargs)
        else:
            return redirect(users.create_logout_url(request.url))
    return decorated_view


def admin_required(func):
    """Requires App Engine admin credentials"""
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if users.get_current_user():
            if not users.is_current_user_admin():
                abort(401)  # Unauthorized
            return func(*args, **kwargs)
        return redirect(users.create_login_url(request.url))
    return decorated_view



def home():
    payload = {
        'gae_mode':True
    }
    return render_template('home.html',payload = payload)


def add_views(app):
    app.add_url_rule('/',view_func=home)


