from flask import Flask, render_template, request, jsonify
import business

app = Flask(__name__)


@app.route('/hello')
def hello_world():
    return 'Hello Flask!'

@app.route('/')
def index():
    return render_template("index.html",title = 'Home')

@app.route('/get_hfq_share', methods=['GET','POST'])
def get_hfq_share():
    dict = request.form.to_dict()
    code = str(dict.get("code"))
    conn = business.get_connection()
    ret = business.get_hfq_share(conn,code)
    business.close_connection(conn)
    return jsonify(result = ret)

#http://docs.jinkan.org/docs/jinja2/ 模板文档说明 http://docs.jinkan.org/docs/flask/
if __name__ == '__main__':
    app.run()
