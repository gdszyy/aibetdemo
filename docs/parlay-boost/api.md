# 串关加赔接口文档

本文记录串关加赔 CMS、体育数据选择器、首页推荐卡片、前台 `xp-service` 的接口与表结构。

## 1. CMS 活动配置

### 1.1 活动配置表

表名：`xp_activity_parlay_boost_rule`

```sql
CREATE TABLE `xp_activity_parlay_boost_rule` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `country_id` int NOT NULL DEFAULT '0' COMMENT '国家ID',
  `name` varchar(300) NOT NULL DEFAULT '' COMMENT '活动名称',
  `country_code` varchar(100) NOT NULL DEFAULT '0' COMMENT '国家编码',
  `version` int NOT NULL DEFAULT '1' COMMENT '版本号，每次更新+1',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `legs` int NOT NULL DEFAULT '0' COMMENT '封顶串数 0=不限制',
  `min_odds_per_leg` decimal(18,8) NOT NULL DEFAULT '0.00000000' COMMENT '单场最低赔率，0=不限',
  `boost_cap_per_bet` decimal(18,8) NOT NULL DEFAULT '0.00000000' COMMENT '单注加赔金额上限',
  `ladder` json NOT NULL COMMENT '阶梯配置',
  `scope_include` json NOT NULL COMMENT '适用范围',
  `pre_match_only` tinyint NOT NULL DEFAULT '0' COMMENT '仅赛前',
  `allow_tags` json NOT NULL COMMENT '准入标签 数组格式',
  `deny_tags` json NOT NULL COMMENT '拒绝标签 数组格式',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态 1=已发布 2=已下线',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='投注活动规则表';
```

### 1.2 保存活动模版

接口地址：`/v1/event/boost/create`

请求方式：`POST`

Content-Type：`application/json`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 活动名称 |
| `country_id` | `int` | 国家 ID |
| `country_code` | `string` | 国家编码 |
| `start_time` | `int` | 开始时间，Unix 秒 |
| `end_time` | `int` | 结束时间，Unix 秒 |
| `legs` | `int` | 封顶串数 |
| `min_odds_per_leg` | `decimal(12,2)` | 单关最低赔率 |
| `boost_cap_per_bet` | `decimal(12,2)` | 单注加赔金额上限 |
| `ladder` | `json` | 阶梯配置，例如 `[{ "legs": 3, "boost": 0.5 }]` |
| `scope_include` | `json` | 适用范围 |
| `pre_match_only` | `int` | 是否仅赛前 |
| `allow_tags` | `json` | 准入标签 |
| `deny_tags` | `json` | 拒绝标签 |
| `status` | `int` | 状态：`1` 进行，`2` 下线 |

`scope_include` 示例：

```json
[
  {
    "source_id": "lsports",
    "sport_id": 1,
    "category_id": "",
    "tournament_id": "",
    "event_id": "",
    "mode": "include"
  }
]
```

请求示例：

```json
{
  "name": "Euro Boost 3 Legs",
  "country_code": 1,
  "start_time": 1756713600,
  "end_time": 1757318399,
  "legs": 8,
  "min_odds_per_leg": "1.20",
  "boost_cap_per_bet": "88.00",
  "ladder": [
    {
      "legs": 3,
      "boost": "0.50",
      "multiplier": "1.50"
    },
    {
      "legs": 4,
      "boost": "0.80",
      "multiplier": "1.80"
    },
    {
      "legs": 5,
      "boost": "1.00",
      "multiplier": "2.00"
    }
  ],
  "scope_include": [
    {
      "source_id": "lsports",
      "sport_id": 1,
      "region_id": "",
      "league_id": "",
      "mode": "include",
      "last_synced_at": 1756710000
    },
    {
      "source_id": "lsports",
      "sport_id": 2,
      "region_id": "1001",
      "league_id": "",
      "mode": "exclude",
      "last_synced_at": 1756710000
    }
  ],
  "pre_match_only": 1,
  "allow_tags": ["vip", "sport_user"],
  "deny_tags": ["risk_user"],
  "status": 1
}
```

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 12
  }
}
```

### 1.3 获得当前正在生效活动模版

接口地址：`/v1/event/boost/getConfig`

请求方式：`GET`

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "activity_info": {
      "id": 12,
      "name": "Euro Boost 3 Legs",
      "country_code": 1,
      "version": 1,
      "start_time": 1756713600,
      "end_time": 1757318399,
      "legs": 8,
      "min_odds_per_leg": "1.20",
      "boost_cap_per_bet": "88.00",
      "ladder": [
        {
          "legs": 3,
          "boost": "0.50",
          "multiplier": "1.50"
        },
        {
          "legs": 4,
          "boost": "0.80",
          "multiplier": "1.80"
        }
      ],
      "scope_include": [
        {
          "source_id": "lsports",
          "sport_id": 1,
          "region_id": "",
          "league_id": "",
          "mode": "include",
          "last_synced_at": 1756710000
        }
      ],
      "pre_match_only": 1,
      "allow_tags": ["vip", "sport_user"],
      "deny_tags": ["risk_user"],
      "status": 1,
      "created_at": 1756713700,
      "updated_at": 1756713700
    },
    "stat_info": {
      "bet_count": 248,
      "total_amount": 186420
    }
  }
}
```

### 1.4 下线活动

接口地址：`/boost/update/:id`

请求方式：`POST`

Content-Type：`application/json`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `status` | `int` | `1` 进行，`2` 下线 |

响应示例：

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

## 2. 体育数据选择器

体育数据选择器按 6 层目录选择：数据源、体育类型、地区、联赛、比赛、盘口。

### 2.1 L1 列所有数据源

接口地址：`/sports/sources`

请求方式：`GET`

响应示例：

```json
{
  "code": 0,
  "message": "",
  "data": {
    "list": [
      {
        "source": "ls"
      }
    ]
  }
}
```

### 2.2 L2 体育类型

接口地址：`/sports/{source_id}/types`

请求方式：`GET`

响应示例：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "sport_id": "131506",
        "sport_code": "",
        "name": "American Football"
      },
      {
        "sport_id": "154914",
        "sport_code": "3",
        "name": "Baseball"
      },
      {
        "sport_id": "48242",
        "sport_code": "2",
        "name": "Basketball"
      },
      {
        "sport_id": "452674",
        "sport_code": "21",
        "name": "Cricket"
      },
      {
        "sport_id": "6046",
        "sport_code": "1",
        "name": "Football"
      },
      {
        "sport_id": "265917",
        "sport_code": "20",
        "name": "Table Tennis"
      },
      {
        "sport_id": "54094",
        "sport_code": "5",
        "name": "Tennis"
      },
      {
        "sport_id": "154830",
        "sport_code": "23",
        "name": "Volleyball"
      }
    ]
  },
  "message": ""
}
```

### 2.3 L3 地区

接口地址：`/sports/{source_id}/{sport_id}/regions`

请求方式：`GET`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `sport_id` | `string` | 体育类型 ID |
| `lang` | `string` | 语言 |

响应示例：

```json
{
  "code": 0,
  "message": "",
  "data": {
    "list": [
      {
        "id": 3,
        "sport_id": "6046",
        "category_id": "137",
        "name": "Algeria",
        "match_count": 2
      },
      {
        "id": 10,
        "sport_id": "6046",
        "category_id": "203",
        "name": "Argentina",
        "match_count": 30
      }
    ]
  }
}
```

### 2.4 L4 联赛

接口地址：`/sports/{source_id}/{sport_id}/leagues`

请求方式：`GET`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `tournament_id` | `string` | 联赛 ID |
| `lang` | `string` | 语言 |

响应示例：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 3129,
        "sport_id": "6046",
        "category_id": "138",
        "tournament_id": "11646",
        "name": "Liga Pro Serie B",
        "match_count": 1
      },
      {
        "id": 6099,
        "sport_id": "6046",
        "category_id": "138",
        "tournament_id": "33446",
        "name": "Liga Pro Serie A",
        "match_count": 9
      }
    ]
  },
  "message": ""
}
```

### 2.5 L5 比赛

接口地址：`/sports/{source_id}/{sport_id}/events`

请求方式：`GET`

带参数示例：`/xxx?status=1&from=1716345600&to=1716432000`

响应示例：

```json
{
  "code": 0,
  "data": {
    "list": {
      "sport_id": "",
      "tournament_id": "1730",
      "tournament_name": "",
      "events": [
        {
          "event_id": "18989046",
          "event_id_type": "",
          "start_time": 1779721200,
          "status": 1,
          "match_status": 0,
          "home_competitor": {
            "competitor_id": "51981784",
            "logo": "",
            "name": "USM Khenchela",
            "score": 0
          },
          "away_competitor": {
            "competitor_id": "208217",
            "logo": "",
            "name": "USM Alger",
            "score": 0
          }
        }
      ]
    }
  },
  "message": ""
}
```

### 2.6 L6 盘口

接口地址：`/sports/{source_id}/{event_id}/markets`

请求方式：`GET`

响应结构待补充。

### 2.7 关键词跨层级搜索

接口地址：`/sports/{source_id}/{sport_id}/search`

请求方式：`GET`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `keyword` | `string` | 搜索关键词 |
| `category_id` | `string` | 地区 ID |

响应示例：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "type": 1,
    "tournaments": [
      {
        "sport_id": "6046",
        "category_id": "138",
        "tournament_id": "11646",
        "name": "Liga Pro Serie B"
      }
    ],
    "events": [
      {
        "event_id": "18989046",
        "event_id_type": "",
        "start_time": 1779721200,
        "status": 1,
        "match_status": 0,
        "home_competitor": {
          "competitor_id": "51981784",
          "logo": "",
          "name": "USM Khenchela",
          "score": 0
        },
        "away_competitor": {
          "competitor_id": "208217",
          "logo": "",
          "name": "USM Alger",
          "score": 0
        }
      }
    ]
  }
}
```

`data.type` 说明：

| 值 | 说明 |
| --- | --- |
| `1` | 联赛列表，读取 `tournaments` |
| `2` | 比赛列表，读取 `events` |

## 3. 首页推荐卡片

### 3.1 推荐卡片表

表名：`xp_activity_recommend_card`

```sql
CREATE TABLE `xp_activity_recommend_card` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `title` varchar(300) NOT NULL DEFAULT '' COMMENT '卡片标题',
  `activity_id` int NOT NULL DEFAULT 0 COMMENT '关联活动ID 默认0',
  `legs` json NOT NULL COMMENT '支持串关配置', -- 已移除 DEFAULT '[]'
  `country_code` int NOT NULL DEFAULT 0 COMMENT '国家编码 0=不限',
  `delisted_reason` varchar(500) DEFAULT NULL COMMENT '下架原因',
  `delisted_at` datetime DEFAULT NULL COMMENT '下架时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活动推荐卡片表';
```

### 3.2 新建推荐卡片

接口地址：`/v1/event/recommend_card`

请求方式：`POST`

请求参数：

| 参数 | 类型 | 示例 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `重彩金奖励` | 卡片标题 |
| `activity_id` | `int` | `2` | 关联活动 ID |
| `legs` | `json` | 见下方示例 | 推荐组合的具体投注项列表 |

`legs` 字段说明：

- `legs` 按具体 outcome 保存，不是串数数组。
- `event_id_type` 固定传 `match`。
- `product`：`1` 表示 inplay，`3` 表示 prematch。
- `product_raw`：`inplay` / `prematch`。

请求示例：

```json
{
  "title": "重彩金奖励",
  "activity_id": 2,
  "legs": [
    {
      "source": "ls",
      "event_id": "18989046",
      "event_id_type": "match",
      "product": "3",
      "product_raw": "prematch",
      "market_id": "2",
      "specifiers": "2.5",
      "outcome_id": "48809492518641850"
    },
    {
      "source": "ls",
      "event_id": "18989046",
      "event_id_type": "match",
      "product": "1",
      "product_raw": "inplay",
      "market_id": "2",
      "specifiers": "2.5",
      "outcome_id": "48809492518641850"
    }
  ]
}
```

### 3.3 下架推荐卡片

接口地址：`/v1/event/recommend_card/delist`

请求方式：`POST`

请求参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `int` | 推荐卡片 ID |
| `delisted_reason` | `string` | 下架原因 |

响应示例：

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

### 3.4 删除推荐卡片

接口地址：`/v1/event/recommend_card/:id`

请求方式：`DELETE`

响应示例：

```json
{
  "code": 0,
  "message": "",
  "data": {}
}
```

## 4. 前台 xp-service

### 4.1 获取串关加赔活动规则

接口地址：`/v1/activity/parlay-boost/rule`

请求方式：`GET`

用途：

- 购物车页面展示串关加赔进度。
- 前端根据活动规则自行计算当前串关 selections 的命中进度。
- 数据结构中存在活动信息；活动到期后，首页推荐组合也隐藏。

响应结构待补充。

## 5. 对接待确认

- `country_code` 在表结构中是 `varchar(100)`，示例中是数字 `1`，前后端需统一。
- `scope_include` 文档中同时出现 `source`、`source_id`、`region_id`、`category_id`、`league_id`、`tournament_id`，需统一最终字段名。
- `/boost/update/:id` 是否需要补齐 `/v1/event` 前缀待确认。
- `L6 盘口` 和 `/v1/activity/parlay-boost/rule` 响应结构待补充。

## 6. CMS MVP 后端已对齐项

按 CMS MVP 范围，后端已对齐以下 3 项。

### 6.1 活动更新/下线

沿用 `/boost/update/:id`。

已支持：

- 更新配置。
- 下线时接收下线原因，用于审计/告警。

### 6.2 推荐卡片列表

已新增推荐卡片管理页列表能力。

列表返回：

- 卡片基础信息。
- 下架信息。
- 有效腿数。
- 健康状态。
- 当前命中档位。

### 6.3 推荐卡片创建数据结构

`POST /v1/event/recommend_card` 的 `legs` 需要按具体 outcome 保存，不是串数数组。

已支持：

- `source`。
- `event_id`。
- `event_id_type`，固定 `match`。
- `product`，`1` 表示 inplay，`3` 表示 prematch。
- `product_raw`，`inplay` / `prematch`。
- `market_id`。
- `specifiers`。
- `outcome_id`。
