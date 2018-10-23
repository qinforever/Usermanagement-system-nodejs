php  二阶段的项目

  index.html   ->  localhost/index.html
  abc.html -> localhost/abc.html

              localhost/images/pig.jpg


  因为  www 目录作为根路径，并且要访问里面的文件内容，只需要根据需要访问的文件的路径来构建url地址就ok



nodejs 三阶段的项目


  localhost/app.js  xxxxxxxxxx
  localhost/views/login.ejs    xxxxxx



  如果要让浏览器显示登录页面

  1. 要自定义路由
  2. 想好这个url地址什么结构，比如： localhost:3000/login.html, 就需要在 routes/index.js 里面定一个 路由名称为 /login.html 的路由代码。
  3. 比如： localhost:3000/users/login.html，来访问 登录页面

  
  如果你想访问某个页面有两种方式：

  1. 先想好 url 地址，然后写 路由处理代码。
  2. 先写好 路由处理代码，然后就知道他的url地址


  如果想在页面上访问一些 静态资源文件<css、js、images>

  1. 先想好 url 地址， localhost:3000/images/pig.jpg

  上面这种方式非常的麻烦（静态资源太多的情况，你会手抽筋）

  express 提供了一个中间件  express.static

  这个中间件，： 他能将当前项目下的某个文件夹，进行静态文件托管。比如说 是 public,
  这个时候，public这个文件夹，拥有了 php wampserver www 文件夹相同的功能

  localhost:3000/images/pig.jpg


  除了 public 文件夹之外的文件内容，你想通过浏览器地址栏url地址访问的话，必须定义路由的方式去访问。



# 项目思路

1. 先写静态页面 （定义路由）
2. 你再写后台的操作。
