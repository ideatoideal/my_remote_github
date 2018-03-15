//frendy自定义插件 需要jquery插件 
(function($) {
    $("[data-catalog]").each(function() {
        let contentName = $(this).attr("data-catalog");
        let content = $(`[data-content='${contentName}']`);
        $(this).find("[data-catalog-el]").each(function() {
            let contentElName = $(this).attr("data-catalog-el");
            let contentEl = content.find(`[data-content-el='${contentElName}']`);
            let obj = this;
            $(obj).click(function() {
                 content.stop();
                content.animate({ scrollTop: content.scrollTop() + contentEl.position().top }, 1000) //滑动时间自行改
            })
        })
    })
}(JQuery))


//使用说明  在html上设置 4个属性 data-catalog会关联指定data-content  元素data-catalog-el点击对应滑动到元素data-content-el  点击data-catalog则会自动滚到data-content指定位置,css部分请自行设置样式
//应该可以一对多 未测试过 例如点击一个目录同时滑动多个内容 设置好四个参数就好 如果想要多对多自己在这个基础上手动改写下 用逗号分隔,添加split参数之类 不过一般用不上 我就不写了滑稽
//data-catalog相当于目录框 data-content是滑动内容框 相互对应

/* 
//html部分 例子
<div id="demo">
    <ul data-catalog="article" style="width: 30%;position: absolute; height: 100%:">
        <li data-catalog-el="item1">咖啡</li>
        <li data-catalog-el="item2">茶</li>
        <li data-catalog-el="item3">牛奶</li>
        <ul>
            <li>咖啡</li>
            <li>茶</li>
            <li>牛奶</li>
        </ul>
    </ul>
    <div data-content="article" style="width: 60%;margin-left:30%;position: absolute; height: 300px;overflow: auto;margin-top: 100px;">
        <h1 data-content-el="item1">
            <p>第1段</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
            <p>13</p>
            <p>14</p>
            <p>15</p>
        </h1>
            <h1 data-content-el="item2">
            <p>第2段</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
            <p>13</p>
            <p>14</p>
            <p>15</p>
        </h1>
            <h1 data-content-el="item3">
            <p>第3段</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
            <p>13</p>
            <p>14</p>
            <p>15</p>
        </h1>
    <div>
</div>
*/