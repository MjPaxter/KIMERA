from flask import Flask
from webapp import app

if __name__=="__main__":
    app.run(debug=False,port=5000,host="0.0.0.0")