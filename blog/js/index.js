window.onload = function() {
    initBg();
    initCanvasBg();
    
}

function iniNav(){

}

//初始化数据背景
function initBg(){
    let vbg = new Vue({
        el: '#bg',
        data: {
            style: {
                position: "absolute",
                width: window.screen.width + "px",
                height: window.screen.height + "px",
                overflow: "hidden",
                perspective: window.screen.width + "px",
                display: "none"
            },
            items: []
        },
        mounted: function() {
            let apos = Math.floor(showArrays.length * Math.random())
            let array = showArrays[apos].array,
                type = showArrays[apos].type;
            let len = Math.min(array.length, 20 + Math.ceil(Math.random() * 30));
            let opacity, x, y, z, angle, top, left, fpos, html, fontSize, slen;
            while (len--) {
                opacity = Math.random();
                x = Math.random();
                y = Math.random();
                z = Math.random();
                angle = Math.random();
                top = window.screen.height * Math.random();
                left = window.screen.width * Math.random();
                fpos = Math.floor(Math.random() * array.length);
                //console.log(array[fpos])
                if (type == "Latex") {
                    html = katex.renderToString(array[fpos]);
                } else {
                    html = array[fpos];
                }

                fontSize = 25 * opacity + 75 / array[fpos].length;
                slen = array[fpos].length
                array.splice(fpos, 1);
                this.items.push({
                    html: html,
                    style: {
                        position: "absolute",
                        top: top + "px",
                        left: left + "px",
                        opacity: opacity,
                        fontSize: fontSize + "px",
                        transform: `rotate3d(${x},${y},${z},${angle}deg)`,
                    },
                    record: {
                        top: top,
                        left: left,
                        x: x,
                        y: y,
                        z: z,
                        angle: angle,
                        slen: slen
                    }
                });
            }
            let vObj = this,
                interval = 20;
            setInterval(function() {
                for (var i = 0; i < vObj.items.length; i++) {
                    x = vObj.items[i].record.x;
                    y = vObj.items[i].record.y;
                    z = vObj.items[i].record.z;
                    top = vObj.items[i].record.top;
                    left = vObj.items[i].record.left;
                    slen = vObj.items[i].record.slen;

                    opacity = vObj.items[i].style.opacity;

                    if (top <= -300) {
                        top = window.screen.height;
                        left = Math.random() * window.screen.width
                    }
                    top = top - (1 - opacity);
                    angle = (vObj.items[i].record.angle + 360 * interval / (1200 * Math.min(slen + 3, 40))) % 360;
                    vObj.items[i].style.top = top + "px";
                    vObj.items[i].style.left = left + "px";
                    vObj.items[i].style.transform = `rotate3d(${x},${y},${z},${angle}deg)`;
                    vObj.items[i].record.x = x;
                    vObj.items[i].record.y = y;
                    vObj.items[i].record.z = z;
                    vObj.items[i].record.angle = angle;
                    vObj.items[i].record.top = top;
                    vObj.items[i].record.left = left;
                }
            }, interval);

        }
    })
}

//初始化canvas背景
function initCanvasBg(){
    let vca = new Vue({
        el: "#ca",
        data: {
            easel: {
                canvas: null,
                stage: null,
                redTag: null,
                vTag: null,
                vContainer: null,
            },
            style: {
                background: "rgba(255,255,255,0)",
                width: window.screen.width,
                height: window.screen.height,
                position:"absolute"
            }
        },
        mounted: function() {
            //createjs.CSSPlugin.install();
            let obj = this,
                vSize = 80;
            this.easel.canvas = obj.$el;
            this.easel.stage = new createjs.Stage(obj.$el);
            this.easel.redTag = new createjs.Shape();
            this.easel.vTag = new createjs.Text("v", vSize + "px Times ", "#F00").set({
                textAlign: "center",
                textBaseline: "middle",
                x: vSize / 2,
                y: vSize / 2
            })
            this.easel.vContainer = new createjs.Container();

            //简写
            let redTag = obj.easel.redTag;
            let stage = obj.easel.stage;
            let vTag = obj.easel.vTag;
            let vContainer = obj.easel.vContainer;

            stage.enableMouseOver(10);
            stage.addChild(vContainer).set({
                name: "vContainer",
                x: (window.innerWidth - vSize) / 2,
                y: (window.innerHeight - vSize) / 2
            });
            //vContainer.cursor = "poiter";
            let vTagArea = new createjs.Shape();
            vTagArea.graphics.beginFill("#FFF").drawRect(0, 0, vSize, vSize);
            vContainer.addChild(vTagArea)
            vContainer.addChild(vTag)

            //vTag.x = (window.innerWidth-vSize)/2;
            //vTag.y = (window.innerHeight-vSize)/2;
            //点击弹出内容
            //stage.addEventListener("click", function(){}, true);

            //stage.addChild(vTag);

            vContainer.addEventListener("click", function(event) {
                console.log("click")
            });
            vContainer.addEventListener("mouseover", function(event) {
                vContainer.cursor = "pointer";
                createjs.Tween.get(vTag, { loop: true, bounce: true, reversed: true })
                    .to({ rotation: -10 }, 100)
                    .to({ rotation: 0 }, 100)
                    .to({ rotation: 10 }, 100)
            });
            vContainer.addEventListener("mouseout", function(event) {
                createjs.Tween.removeTweens(vTag)
                createjs.Tween.get(vTag).to({ rotation: 0 }, 100)
            });



            createjs.Ticker.framerate = 20;
            createjs.Ticker.addEventListener("tick", stage);

            function drawCanvas() {
                redTag.graphics.clear().setStrokeStyle(30, 'round', 'round').beginStroke("#F00").moveTo(window.innerWidth - 150, -30).lineTo(window.innerWidth + 30, 150)
                stage.addChild(redTag);
                stage.update();
                createjs.Tween.get(vContainer)
                    .to({ x: (window.innerWidth - vSize) / 2, y: (window.innerHeight - vSize) / 2, alpha: 0.7 }, 700, createjs.Ease.get(1))
                    .to({ alpha: 1 }, 300)
            }
            drawCanvas();
            window.onresize = drawCanvas;
        }
    })
}


//-------数据部分---------
var showArrays = [{
        type: "Latex",
        array: [
            "\\alpha ", "\\beta ", "\\gamma ", "\\delta ", "\\epsilon ", "\\varepsilon ", "\\zeta ", "\\eta ", "\\theta ", "\\vartheta ", "\\iota ", "\\kappa ", "\\lambda ", "\\mu ", "\nu ", "\\xi ", "\\pi ", "\\varpi ", "\\rho ", "\\varrho ", "\\sigma ", "\\varsigma ", "\\tau ", "\\upsilon ", "\\phi ", "\\varphi ", "\\chi ", "\\psi ", "\\omega ", "\\Gamma ", "\\Delta ", "\\Theta ", "\\Lambda ", "\\Xi ", "\\Pi ", "\\Sigma ", "\\Upsilon ", "\\Phi ", "\\Psi ", "\\Omega "
        ]
    },
    {
        type: "Latex",
        array: [
            "e^{i\\pi}+1=0", //欧拉公式
            "F=ma", //牛顿第二定律
            "a^2+b^2=c^2", //勾股定理
            "E_{0}=mc^{2}", //质能方程
            "i\\hbar\\frac{\\partial }{\\partial t}\\Psi (r,t) = \\hat{H}\\Psi (r,t)", //薛定谔方程
            //"1+1=2",
            "\\begin{matrix} p=\\hbar k \\\\ E = \\hbar\\omega \\end{matrix} ", //德布罗意方程组
            "\\hat{f}(\\xi )=\\int_{\\infty }^{\\infty }f(x)e{{_{}}^{-2\\pi i x\\xi }}dx", //傅里叶变换
            "\\begin{matrix} \\oint_{S}D\\cdot dA = Q_{f,S} \\\\ \\oint_{S}B\\cdot dA = 0 \\\\ \\oint_{\\partial S}E\\cdot dl= -\\frac{\\partial \\Phi_{B,S}}{\\partial t} \\\\ \\oint_{\\partial S}H\\cdot dl= I_{f,S}+\\frac{\\partial \\Phi_{D,S}}{\\partial t} \\end{matrix}",
            "c=2 \\pi r"
        ]
    },
    {
        type: "value",
        array: [
            "Java", "C", "C++", "Python", "C#", "JavaScript", "Visual Basic.NET", "R", "PHP", "MATLAB", "Swift",
            "Objective-C", "Assembly language", "Perl", "Ruby", "Delphi/Object Pascal", "Go", "Scratch", "PL/SQL",
            "Visual Basic",
            "SAS", "D", "Dart", "ABAP", "COBOL", "Ada", "Lua", "Transact-SQL", "Fortran", "Scala", "Bash", "Lisp", "Prolog",
            "LabVIEW", "Logo", "Hack", "Rust", "Apex", "Haskell", "Ladder Logic", "F#", "Scheme", "Kotlin", "Awk", "Erlang",
            "MQL4", "Q", "RPG(OS/400)", "Groovy", "Alice"
        ]
    },
    {
        type: "value",
        array: [
            "计算机没什么用.他们只会告诉你答案.--巴勃罗·毕加索",
            "计算机会不会思考这个问题就像问潜水艇会不会游泳一样.--Edsger W. Dijkstra",
            "硬件:计算机系统中可被踢的部分--Jeff Pesis",
            "我终于明白'向上兼容性'是怎么回事了.\n这是指我们得保留所有原有错误.--Dennie van Tassel",
            "2038年1月19日,凌晨3点14分07秒",
            "互联网?那个东西还在吗?--Homer Simpson",
            "真正的创新经常来自于那些贴近市场、\n但无力拥有市场的的小型初创公司.--Timm Martin",
            "这无关比特、字节和协议,而关乎利润和损益.--郭士纳",
            "不管演示在彩排的时候有多好,\n一旦在观众面前展示时,\n演示不出错的几率与观众人数成反比,\n与投入的金钱总额成正比.--Mark Gibbs",
            "控制复杂性是计算机编程的本质.--Brian Kernigan",
            "进行软件设计有两种方式.\n一种是让它尽量简单,\n让人看不出明显的不足.\n另一种是弄得尽量复杂,\n让人看不出明显的缺陷.--C.A.R. Hoare",
            "只有两个行业把客户称为'用户'.--Edward Tufte",
            "你们当中很多人都知道程序员的美德.\n当然啦,有三种:那就是懒惰、急躁以及傲慢.--Larry Wall",
            "程序员的问题是你无法预料他在做什么,直到为时已晚.--Seymour Cray",
            "不像学学涂涂画画也能让某人成为专家级画家,\n计算机科学教育不会让任何人成为一名编程大师.--埃里克·雷蒙",
            "最好的程序员跟好的程序员相比可不止好那么一点点.\n这种好不是一个数量级的,\n取决于标准怎么定:概念创造性、速度、设计的独创性或者解决问题的能力.--兰德尔·E·斯特劳斯",
            "就算它工作不正常也别担心.如果一切正常,你早该失业了.",
            "首先学习计算机科学及理论.接着形成自己编程的风格.\n然后把这一切都忘掉,尽管改程序就是了.--George Carrette",
            "先解决问题再写代码.--John Johnson",
            "乐观主义是编程行业的职业病;用户反馈则是治疗方法.--Kent Beck",
            "只有两种编程语言:一种是天天挨骂的,另一种是没人用的.--Bjarne Stroustrup",
            "COBOL的使用摧残大脑;其教育应被视为刑事犯罪.--E.W. Dijkstra",
            "把良好的编程风格教给那些之前曾经接触过BASIC的学生几乎是不可能的.\n作为可能的程序员,他们已精神残废,无重塑的可能了.--E. W. Dijkstra",
            "计算机语言设计犹如在公园里漫步.我是说侏罗纪公园.--Larry Wall",
            "写C或者C++就像是在用一把卸掉所有安全防护装置的链锯.--Bob Gray",
            "C++ : 友人可造访你的私有成员之地也. --Gavin Russell Baker",
            "Java从许多方面来说就是C++–. --Michael Feldman",
            "要是Java真的有垃圾回收的话,大部分程序在执行的时候就会把自己干掉了.--Robert Sewell",
            "好代码本身就是最好的文档.--Steve McConnell",
            "你自己的代码如果超过6个月不看,再看的时候也一样像是别人写的.",
            "没有伟大的团队就没有伟大的软件,\n可大部分的软件团队举止就像是支离破碎的家庭.--吉姆·麦卡锡",
            "调试难度本来就是写代码的两倍.\n因此,如果你写代码的时候聪明用尽,根据定义,你就没有能耐去调试它了.--Brian Kernighan",
            "我才不管它能不能在你的机器上运行呢!我们又没装到你的机器上!--Vidiu Platon",
            "有两种写出无错程序的办法;只有第三种有用.--Alan J. Perlis",
            "永远要这样写代码,好像最终维护你代码的人是个狂暴的、知道你住在哪里的精神病患者.--Martin Golding",
            "软件质量与指针算法不可兼得.--Bertrand Meyer",
            "我认为全球市场约需5台计算机.--托马斯·沃森 1977年",
            "640K对每一个人来说都已足够.--比尔·盖茨 1981年",
            "长此以往,除了按键的手指外,人类的肢体将全部退化.--弗兰克•劳埃德•赖特"
        ]
    }
]