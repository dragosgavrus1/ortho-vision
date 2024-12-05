import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from supabase import create_client, Client
from datetime import datetime, date

app = Flask(__name__)

load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/users/signup', methods=['POST'])
def signUp():
    data = supabase.table('Users').insert({
        'first_name': 'John',
        'last_name': 'Baston',
        'email': 'johnbaston@gmail.com',
        'password': 'johnbaston232#',
        'role': 'doctor'
    }).execute()
    
    assert len(data.data) > 0
    return jsonify(data.data)


if __name__ == '__main__':
    app.run()
