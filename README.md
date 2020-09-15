# scanorder(扫码点餐)

> github : https://github.com/renhaohao1217/scanorder.git

## 微信小程序端

### 1 数据库设计

> 非关系型数据库：MongoDB

#### 1.1 集合(collection)清单

| 集合名      | 描述                             | 所属模块                                           |
| ----------- | -------------------------------- | -------------------------------------------------- |
| so_shop     | 商家集合，记载注册后的商家信息   | 基础模块<br />个人中心<br />点餐模块<br />菜单模块 |
| so_classify | 商品分类集合，记载商品的分类信息 | 点餐模块<br />菜单模块                             |
| so_goods    | 商品信息集合，记载商品的详细信息 | 点餐模块<br />菜单模块                             |
| so_cart     | 购物车集合，记载用户的购物车信息 | 点餐模块                                           |

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

#### 2.1 获取openid

云函数名称：getOpenid

接收数据：

```js
success:res=>{
    // 接收数据
    res.result.openid
}
```

#### 2.2 商品信息集合(so_goods)和购物车集合(so_cart)联表查询

云函数名称：lookup

请求参数说明：

| 名称         | 类型   | 说明                             |
| ------------ | ------ | -------------------------------- |
| collection   | String | 要查询的集合名称                 |
| from         | String | 要进行连接的另一个集合的名字     |
| localField   | String | 输入记录的要进行相等匹配的字段   |
| foreignField | String | 被连接集合的要进行相等匹配的字段 |
| as           | String | 输出的数组字段名                 |
| match        | Object | 筛选条件                         |

接收数据：

```js
success:res=>{
    // 接收数据
    console.log(res.result.list)
}
```

#### 2.3 购物车集合(so_cart)和商品信息集合(so_goods)联表查询

云函数名称：lookup_cart

请求参数说明：

| 名称         | 类型   | 说明                             |
| ------------ | ------ | -------------------------------- |
| collection   | String | 要查询的集合名称                 |
| from         | String | 要进行连接的另一个集合的名字     |
| localField   | String | 输入记录的要进行相等匹配的字段   |
| foreignField | String | 被连接集合的要进行相等匹配的字段 |
| as           | String | 输出的数组字段名                 |

接收数据：

```js
success:res=>{
    // 接收数据
    res.result.list
}
```





### 用户



### 菜单

- 规格
  - 添加规格

### 点餐

- 桌台点餐
  - 桌台号
- 流水号点餐
  - 流水号

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

