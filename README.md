本项目用于记录游玩Galgame的信息，因为我文笔匮乏实在是写不出感想，便只好写代码了。

目前主要分为添加、查询、展示三个模块：

- 添加模块：

    向MySQL插入新数据，使用[class validator](https://github.com/typestack/class-validator)进行数据校验

- 查询模块：

    向MySQL查询数据，并以表格形式展示

- 展示模块：

    展示相关的静态资源，如BGM和CG，静态资源文件存放于`/public/static`目录下

  

建表语句：

```mysql
create table game_info
(
    game_id          int auto_increment comment '游戏ID'
        primary key,
    game_name        varchar(50)   not null comment '游戏原名',
    game_alias       varchar(50)   not null comment '游戏别名',
    game_brand_name  varchar(20)   not null comment '品牌原名',
    game_brand_alias varchar(20)   null comment '品牌别名',
    start_date       date          not null,
    bgm              int default 0 not null comment '配乐个数'
);

create table character_info
(
    character_id    int auto_increment comment '角色ID'
        primary key,
    character_name  varchar(50)   not null comment '角色原名',
    character_alias varchar(50)   not null comment '角色别名',
    roma_onn        varchar(20)   null comment '罗马音',
    character_voice varchar(30)   not null comment '声优名称',
    game_id_main    int           not null comment '主要出场游戏ID',
    game_id_other   varchar(20)   null comment '次要出场游戏ID，CSV格式',
    img             int default 0 not null comment '图片个数',
    constraint character_info_game_info_null_fk
        foreign key (game_id_main) references game_info (game_id)
)
    comment '角色信息';
    
create table play_log
(
    log_id       int auto_increment comment '日志ID'
        primary key,
    target       varchar(20)  not null comment '游戏线路',
    game_id      int          not null comment '游戏ID',
    character_id int          null comment '角色ID',
    start_date   date         not null comment '开始日期',
    end_date     date         null comment '完成日期',
    comment      varchar(200) null comment '游玩感想',
    constraint play_log_character_info_null_fk
        foreign key (character_id) references character_info (character_id),
    constraint play_log_game_info_null_fk
        foreign key (game_id) references game_info (game_id)
)
    comment 'Galgame游戏日志，记录玩过的游戏';
```

---

> 主要使用的技术：[Vite](https://github.com/vitejs/vite)，[Electron](https://github.com/electron/electron)，[TypeScript](https://github.com/microsoft/TypeScript)，[React](https://github.com/facebook/react)，[FP-TS](https://github.com/gcanti/fp-ts)，[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)，[Ant Design](https://github.com/ant-design/ant-design)，[aHooks](https://github.com/alibaba/hooks)，[MySQL](https://github.com/sidorares/node-mysql2)
