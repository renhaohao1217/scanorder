# scanorder(扫码点餐)

> github : https://github.com/renhaohao1217/scanorder.git

## 微信小程序端

### 1 数据库设计

> 非关系型数据库：MongoDB

#### 1.1 集合(collection)清单

| 集合名      | 描述                             | 所属模块                                                     |
| ----------- | -------------------------------- | ------------------------------------------------------------ |
| so_shop     | 商家集合，记载注册后的商家信息   | 注册模块<br />登录模块<br />个人中心<br />点餐模块<br />菜单模块 |
| so_classify | 商品分类集合，记载商品的分类信息 | 点餐模块<br />菜单模块                                       |
| so_goods    | 商品信息集合，记载商品的详细信息 | 点餐模块<br />菜单模块                                       |
| so_cart     | 购物车集合，记载用户的购物车信息 | 点餐模块                                                     |
| so_order    | 订单集合，记载商家的订单信息     | 报表模块<br />订单模块<br />任务模块                         |
| so_task     | 任务集合，记载商家的任务信息     | 任务模块                                                     |
| so_serial   | 餐牌集合，用来给用户提供餐牌     |                                                              |

#### 1.2 商家信息集合(so_shop)

| 字段名称 | 类型   | 字段描述         |
| -------- | ------ | ---------------- |
| _id      | String | 唯一标志一条记录 |
| _openid  | String | 标志记录的创建者 |
| username | String | 用户名           |
| password | String | 用户密码         |
| phone    | String | 手机号           |
| shop     | String | 商家店铺名       |
| address  | String | 商家店铺地址     |
| image    | String | 商家头像         |

#### 1.3 商品分类集合(so_classify)

| 字段名称 | 类型   | 字段描述           |
| -------- | ------ | ------------------ |
| _id      | String | 唯一标志一条记录   |
| _openid  | String | 标志记录的创建者   |
| classify | String | 商品分类名称       |
| shop_id  | String | 商家id             |
| time     | String | 用来对分类进行排序 |

#### 1.4 商品信息集合(so_goods)

| 字段名称    | 类型    | 字段描述            |
| ----------- | ------- | ------------------- |
| _id         | String  | 唯一标志一条记录    |
| _openid     | String  | 标志记录的创建者    |
| image       | String  | 商品图片            |
| images      | Array   | 商品轮播图          |
| title       | String  | 商品名称            |
| price       | Number  | 商品价格            |
| cook        | String  | 所属后厨 / 无需烹饪 |
| description | String  | 商品描述            |
| sale        | Boolean | 售馨                |
| shop_id     | String  | 商家id              |
| classify_id | String  | 商品分类id          |
| time        | String  | 用来对商品进行排序  |

#### 1.5 购物车集合(so_cart)

| 字段名称 | 类型   | 字段描述           |
| -------- | ------ | ------------------ |
| _id      | String | 唯一标志一条记录   |
| _openid  | String | 标志记录的创建者   |
| amount   | String | 记录单件商品的数量 |
| goods_id | String | 商品id             |

#### 1.6 订单信息集合(so_order)

| 字段名称 | 类型    | 字段描述                    |
| -------- | ------- | --------------------------- |
| _id      | String  | 唯一标志一条记录            |
| _openid  | String  | 标志记录的创建者            |
| classify | String  | 订单的分类：桌位号 / 流水号 |
| state    | Boolean | 订单的状态                  |
| time     | String  | 订单的时间                  |
| goods    | Array   | 订单包含的商品              |
| shop_id  | String  | 商家id                      |

#### 1.7 订单任务集合(so_task)

| 字段名称 | 类型   | 字段描述                         |
| -------- | ------ | -------------------------------- |
| _id      | String | 唯一标志一条记录                 |
| _openid  | String | 标志记录的创建者                 |
| order_id | String | 订单id                           |
| shop_id  | String | 商家id                           |
| state    | Array  | 存放任务中每个商品是否完成的状态 |

#### 1.8 餐牌信息集合(so_serial)

| 字段名称 | 类型   | 字段描述                       |
| -------- | ------ | ------------------------------ |
| _id      | String | 唯一标志一条记录               |
| _openid  | String | 标志记录的创建者               |
| type     | String | 餐牌信息的类型(table / serial) |
| value    | String | 餐牌信息的值                   |
| shop_id  | String | 商家的_id                      |

### 2 云函数

```js
// 调用云函数
wx.cloud.callFunction({
    name:'云函数名称',
    data:{
        // 云函数的参数对象
    },
    success:res=>{
        
    }
})
```

#### 2.1 getOpenid

> 获取openid

- 云函数名称：getOpenid


- 接收数据：


```js
success:res=>{
    // 接收数据
    res.result.openid
}
```

#### 2.2 lookup

> 商品信息集合(so_goods)和购物车集合(so_cart)联表查询

- 云函数名称：lookup


- 请求参数说明：


| 名称         | 类型   | 说明                             |
| ------------ | ------ | -------------------------------- |
| collection   | String | 要查询的集合名称                 |
| from         | String | 要进行连接的另一个集合的名字     |
| localField   | String | 输入记录的要进行相等匹配的字段   |
| foreignField | String | 被连接集合的要进行相等匹配的字段 |
| as           | String | 输出的数组字段名                 |
| match        | Object | 筛选条件                         |

- 接收数据：


```js
success:res=>{
    // 接收数据
    console.log(res.result.list)
}
```

#### 2.3 lookup_cart

> 购物车集合(so_cart)和商品信息集合(so_goods)联表查询

- 云函数名称：lookup_cart


- 请求参数说明：


| 名称         | 类型   | 说明                             |
| ------------ | ------ | -------------------------------- |
| collection   | String | 要查询的集合名称                 |
| from         | String | 要进行连接的另一个集合的名字     |
| localField   | String | 输入记录的要进行相等匹配的字段   |
| foreignField | String | 被连接集合的要进行相等匹配的字段 |
| as           | String | 输出的数组字段名                 |
| match        | Object | 筛选条件                         |

- 接收数据：


```js
success:res=>{
    // 接收数据
    res.result.list
}
```

#### 2.4 remove

> 删除数据库中符合条件的多条数据

- 云函数名称：remove
- 请求参数说明：

| 名称       | 类型   | 说明         |
| ---------- | ------ | ------------ |
| collection | String | 数据库的名称 |
| where      | Object | 筛选条件     |

### 3 小程序功能描述

#### 3.1 首页

> pages/index/index

- `onLoad`生命周期回调函数执行时通过`wx.cloud.database().collection('so_shop').get()`获取全部商家的`_id`、`image`、`shop`

##### 3.1.1 商家登录

> pages/login/login

- 用户输入**用户名**或者**手机号**和**密码**，访问数据库`so_shop`进行匹配，如果返回数据，则验证通过，将`_id`通过`wx.setStorageSync()`缓存到本地作为登录状态，在退出登录的时候将本地缓存移除。

##### 3.1.2 商家注册

> pages/register/register

- 用户输入**用户名**、**手机号**、**店名**、**地址**、**登录密码**等信息进行注册，首先通过正则表达式对用户输入的信息进行格式验证，验证通过后将数据添加到`so_shop`数据库中。

1. 用户名:`/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/`
2. 手机号:`/^1[3456789]\d{9}$/`
3. 密码:`/^[a-zA-Z0-9_-]{6,20}$/

##### 3.1.3 点击商家头像开始点餐

- 点击头像时通过使用路由参数跳转到商家的`pages/business`页面

#### 3.2 点餐

> pages/order/order

- `onLoad`生命周期回调函数执行时访问数据库`so_serial`获取商家添加的桌位号`table`和流水号`serial`信息，跳转页面`pages/business`时传递参数点餐方式`method`、桌位号/序列号`order`、商家id`shop_id`

##### 3.2.1 点餐页面

> pages/business/business

- `onLoad`生命周期回调函数执行时判断路由参数`order`是否是`undefined`，如果是则调用`wx.showActionSheet`来获取`order`，通过`shop_id`访问数据库`so_shop`获取商家信息。
- `onShow`生命周期回调函数执行时通过`shop_id`访问数据库`so_classify`获取分类信息和通过调用云函数`lookup`得到分类信息对应的商品信息。

##### 3.2.2 商品详情页面

> pages/goods-info/goods-info

- `onLoad`生命周期回调函数执行时根据路由参数传进来的商品id`_id` 访问数据库`so_goods`获得商品详细信息。

##### 3.2.3 订单详情页面

> pages/indent-info/indent-info

- `onLoad`生命周期回调函数执行时接收路由参数`indent`。
- 支付功能：更新数据库`so_order`，将订单`_id`的状态`state`更新为`已支付`，同时新建任务，订单id`order_id`、商家id`shop_id`，添加到数据库`so_task`中

#### 3.3 菜单

> pages/menu/menu

- `onShow`生命周期回调函数执行时根据商家`id`访问数据库`so_classify `并根据`classify_id`访问数据库`so_goods`得到对应的商品

#### 3.4 我的任务

> pages/task/task

- `onLoad`生命周期回调函数执行时建立`watcher`监听数据库`so_task`的更新，当有`shop_id`为商家id的新数据时，将新数据添加到任务列表中。在`onUnload`生命周期回调函数执行时关闭`watcher`数据监听。

#### 3.5 订单

> pages/indent/indent

- `onLoad`生命周期回调函数执行时获取今天的日期，并根据日期作为筛选条件访问数据库`so_order`获取订单信息。建立`watcher`实时监听数据更新，在`onUnload`生命周期回调函数执行时关闭实时监听数据更新`watcher`。

#### 3.6 我的

> pages/home/home

- `onShow`生命周期回调函数执行时通过`wx.getStorageSync('_id')`获取商家`_id`，然后查询数据库`so_shop`获得商家的信息。

##### 3.6.1 用户详细信息页面

> pages/user-info/user-info

- `onLoad`生命周期回调函数执行时接收路由参数传进来的值。
- 通过`wx.chooseImage()`方法更新头像。
- 通过`wx.getLocation`获得定位信息，然后通过第三方库`qqmap-wx-jssdk1.0`将经纬度转换成地址地区信息。
- 修改用户信息的时候，在输入框失去焦点的时候通过`event.detail.value`获取输入框的值，然后对值进行格式的校验，比`bindinput`事件触发的次数少。
- 通过hash值来记录哪些用户信息进行了修改，然后在保存修改的时候，只更新这些修改了的数据，减少了数据库的操作。

##### 3.6.2 餐牌页面

> pages/serial/serial

- `onLoad`生命周期回调函数执行时从数据库`so_serial`查询出`shop_id`为商家id的信息。通过添加按钮可以添加 桌位号 / 流水号。

##### 3.6.3 报表页面

> pages/report/report

- 首先通过`picker`组件设置日期选择器，查看对应日期的订单信息，把`shop_id`、`time`作为查询条件查询`so_order`数据库，返回的数据如下，对数据进行处理之后，通过canvas将数据以柱状图的形式展示出来。

```js
// res.data
{
    "_id": // 订单唯一标识符,
    "_openid": // 提交订单的用户,
    "classify": // 分类信息,
   	"state": // 订单的状态,
    "time": // 订单创建的时间,
    "shop_id": // 商家的_id,
    "goods": [ // 订单包含的商品
     	{
            "_id": // ,
            "_openid": //,
            "amount": // 商品的数量,
            "goodsList": [ // 商品的详细信息,
            	{
            		"_id": // 商品的_id,
            		"_openid": // 上传商品的商家的_openid,
            		"classify_id": // 商品的分类,
            		"cook": // 商品所属后厨,
            		"description": // 商品的描述,
            		"image": // 商品的封面图片,
            		"images": // 商品的轮播图,
            		"price": // 商品的价格,
            		"sale": // 商品是否售馨,
            		"shop_id": // 商家的_id,
            		"time": // 商品上传的时间,
            		"title": // 商品的名称,
        		}
            ]
            "goods_id": // 商品的_id
        }   
    ]
}
```

##### 3.6.4 修改密码页面

> pages/update_pwd/update_pwd

- 首先验证数据格式，然后访问集合`so_shop`进行数据验证，如果验证通过则更新密码。

##### 3.6.5 退出登录页面

- 通过`wx.removeStorage`删除`_id`标识，退出到登录页面。

#### 3.7 组件

##### 3.7.1 导航栏组件

> components/navigation-bar/navigation-bar

- 接收参数：导航栏标题`title`、是否有返回按钮`icon`、背景颜色`background`、是否占位`placeholder`。

##### 3.7.2 底部购物车组件

> components/tab-cart/tab-cart

- 接收参数：是否隐藏购物车详细信息`hidden`、购物车数组`cart_arr`、购物车数量`num`、购物车总价`sum`、桌位号/流水号`order`、商家的id`_id`。
- 获取购物车信息：使用promise封装调用云函数`lookup_cart`，通过`this.triggerEvent('event',{})`触发父组件自定义函数的方式向父组件传参。
- 支付：生成订单，存到数据库`so_order`中，提交订单之后通过云函数`getOpenid`获取`_openid`，访问`so_cart`数据库，以`_openid`为条件删除购物车的内容。

##### 3.7.3 底部购物车详细信息组件

> components/tabcart-info/tabcart-info

- 接收参数：商品列表`goods_arr`、购物车列表`cart_arr`、购物车数量`num`、总价`sum`。
- 清空购物车：使用云函数`getOpenid`获取用户的`_openid`，然后使用云函数`remove`清空购物车。
- 计算购物车：对商品数量 + / - 操作时，进行防抖处理，在用户操作300ms之后更新数据库。

##### 3.7.4 分类和商品信息组件

> components/classify-list/classify-list

- 接收参数：是否是用户`source`、分类列表`classify_arr`、商品列表`goods_arr`、购物车数量`num`、购物车总价`sum`。
- 切换商品分类：调用云函数`lookup`进行联表查询获得选中分类对应的商品。
- 添加分类名称：向`so_classify`中添加分类信息，包括：`classify`分类名称、`shop_id`商家id、`time`添加时间。
- 展示商品信息：通过`source`判断是用户还是商家，来展示修改页面(pages/standard)或者详情页面(pages/goods-info)。
- 删除分类 / 商品：如果删除分类，则调用云函数`remove`将数据库`so_goods`中`classify_id`为该分类的商品都删除。
- 向上 / 向下移动：从数据库中获取数据的时候通过`time`进行排序，所以向上 / 向下移动就是交换对应的`time`。
- 计算购物车：
  - 数量 -  / 数量 + 并且 num 不为 0：进行数据修改，并且更新数据库`so_cart`。
  - 数量 + 并且 num 为 0：给数据库`so_cart`添加一条新数据数量`amount`为1，`goods_id`为该商品的`_id`。

##### 3.7.5 任务列表组件

> components/task-list/task-list

- 接收参数：任务信息`item`
- 切换商品是否已完成的状态`toggle`，如果一个任务中的所有商品状态全部是已完成，则询问商家是否删除该任务。

#### 3.8 过滤器

##### 3.8.1 日期过滤器

```js
var filter = {
  date: function (time) {
    return getDate(time).toLocaleString();
  }
}
// 导出模块
module.exports = {
  date: filter.date
}
```







### 用户



### 二维码

- 桌位
- 流水号

### 订单

- 实时订单
  - 桌号 / 流水号
  - 下单时间
  - 结账状态
  - 菜品 / 数量
  - 价格
  - 历史订单

### 厨房任务列表

- 订单排序
  - 时间排序
- 数量排序
  - 数量排序

### 报表

- 日期
- 实收金额
- 优免金额
- 菜品销售排行榜

## 2 后台API列表

## 3 前端功能描述

### 3.1 扫码点餐

### 3.2 前台点餐 / 服务员点餐

### 3.3 商家管理

#### 3.3.1 菜单

- 分类管理
- 菜品管理
- 规格管理

### 3.4 小票

### 3.5 智能语音播报

### 3.6 厨显系统

### 3.7 报表

### 3.8 电子发票

> 响应式界面设置缩放比1.5

