from flask import Flask, render_template

app = Flask(__name__)


@app.route('/hello')
def hello_world():
    return 'Hello Flask!'

@app.route('/')
def index():
    return render_template("index.html",title = 'Home')

#http://docs.jinkan.org/docs/jinja2/ 模板文档说明 http://docs.jinkan.org/docs/flask/
if __name__ == '__main__':
    app.run()
