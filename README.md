
# LevelExp 等级系统


#版本:1.3.0


#命令列表：

#常规类

/lvl 主命令(可以打开GUI)

/lvl levelup 升级命令(需要开启手动升级开关)

/lvl my 查看等级(打开设置GUI)

/lvl info [玩家名] 查询玩家信息

/lvl reload 重载配置(限后台)

#等级类

/lvl addlevel [玩家名] [数量] 添加玩家等级

/lvl dellevel [玩家名] [数量] 减少玩家等级

/lvl setlevel [玩家名] [数量] 设置玩家等级


#经验类

/lvl addexp [玩家名] [数量] 添加玩家经验

/lvl delexp [玩家名] [数量] 减少玩家经验

/lvl setexp [玩家名] [数量] 设置玩家经验

#属性点类

/lvl addpoints [玩家名] [数量] 添加玩家属性点

/lvl delpoints [玩家名] [数量] 减少玩家属性点

/lvl setpoints [玩家名] [数量] 设置玩家属性点

#API接口：

#常规类

#获得等级(xuid)

lxl.import('LevelExp', 'LevelExp_getLevel');

#等级的添减设(xuid, count)

lxl.import('LevelExp', 'LevelExp_addLevel');

lxl.import('LevelExp', 'LevelExp_delLevel');

lxl.import('LevelExp', 'LevelExp_setLevel');

#获得经验(xuid)

lxl.import('LevelExp', 'LevelExp_getExp');

#经验的添减设(xuid, count)

lxl.import('LevelExp', 'LevelExp_addExp');

lxl.import('LevelExp', 'LevelExp_delExp');

lxl.import('LevelExp', 'LevelExp_setExp');

#获得属性点(xuid)

lxl.import('LevelExp', 'LevelExp_getPoints');

#属性点的添减设(xuid, count)

lxl.import('LevelExp', 'LevelExp_addPoints');

lxl.import('LevelExp', 'LevelExp_delPoints');

lxl.import('LevelExp', 'LevelExp_setPoints');

#PAPI接口：

%lvl_nextexp%  #获得升级所需经验

%lvl_getlevel%  #获得等级

%lvl_getexp%   #获得经验

%lvl_gethead%  #获得总经验

%lvl_getpoint%  #获得属性点

%lvl_gethealth% #获得血量

%lvl_getattack% #获得攻击力

%lvl_getdiane% #获得防御力


# 没有允许禁止整合和转载

