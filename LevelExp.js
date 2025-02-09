/*
#    ╔════════════════════════════════════════════════════════════════════╗
#    ║▓▓██▓▓▓▓▓▓▓▓▓██▓▓▓▓▓███▓▓▓▓▓▓███████▓▓▓▓▓███████▓▓▓▓▓██▓▓▓▓██████▓▓▓║
#    ║▓▓████▓▓▓▓▓████▓▓▓██▓▓▓██▓▓▓▓▓█▓▓▓▓██▓▓▓▓▓█▓▓▓▓██▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓║
#    ║▓▓██▓▓█████▓▓██▓▓▓███████▓▓▓▓▓█▓▓▓▓██▓▓▓▓▓█▓▓▓▓██▓▓▓▓██▓▓▓▓██████▓▓▓║
#    ║▓▓██▓▓▓███▓▓▓██▓▓▓██▓▓▓██▓▓▓▓▓█▓▓▓▓██▓▓▓▓▓█▓▓▓▓██▓▓▓▓██▓▓▓▓██▓▓▓▓▓▓▓║
#    ║▓▓██▓▓▓▓▓▓▓▓▓██▓▓▓██▓▓▓██▓▓▓▓███████▓▓▓▓▓███████▓▓▓▓▓██▓▓▓▓██████▓▓▓║
#    ╚════════════════════════════════════════════════════════════════════╝
/**/
/*记录玩家奖励物品名称*/
const Gpt = new Map();															//别动//重要代码

const Repeat = new Map();														/////////

const PLUGIN_Name = "LevelExp";													//插件名称

const PLUGIN_Version = [1, 4, 3];												//插件版本

const PLUGIN_Author = "MineFeng";												//插件作者

const PLUGIN_Introduce = "有点不简单的等级系统";									//插件介绍

const Git_hub = "https://www.github.com/MC-MineFeng/LevelExp/";					//托管网站

ll.registerPlugin(/*插件名*/PLUGIN_Name,/*介绍*/PLUGIN_Introduce,/*版本*/PLUGIN_Version,/*信息*/{"Github": Git_hub});

const _filePath = `.\\plugins\\${PLUGIN_Name}\\`;								//文件配置所在位置//千万别动会崩服(/"≡ _ ≡)=

if (!file.checkIsDir(_filePath + "Data")) file.mkdir(_filePath + "Data");		//初始化文件夹

/*加载提示*/logger.info("如有bug请加QQ反馈： 1455278082");						//QQ号

/*加载提示*/logger.info(`版本: ${PLUGIN_Version} 作者: ${PLUGIN_Author} !!!`);

/**SQL数据库 */const fist = _filePath + "Data\\XuidData.db";
const Lite = new DBSession("sqlite3", { path: fist, create: true, });			//SQLite数据库

/**KVDB数据库 *///现阶段不可用，准备下次在用这个。
//const db = new KVDatabase(_filePath + "Data");								//KVDB 数据库

/*创建数据库*///状态版//经常用
Lite.query(`CREATE TABLE IF NOT EXISTS "LevelEXP" (
		"ID"		INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
		"Xuid"		TEXT NOT NULL, 
		"Name"		TEXT NOT NULL, 
		"Level"		INTEGER NOT NULL DEFAULT 1, 
		"Exp"		INTEGER NOT NULL DEFAULT 0, 
		"HeadExp"	INTEGER NOT NULL DEFAULT 0, 
		"Health"	INTEGER NOT NULL DEFAULT 20, 
		"Points"	INTEGER NOT NULL DEFAULT 1, 
		"Attack"	INTEGER NOT NULL DEFAULT 1, 
		"DeFence"	INTEGER NOT NULL DEFAULT 1, 
		"Luck"		INTEGER NOT NULL DEFAULT 1, 
		"Time"		DATETIME DEFAULT CURRENT_TIMESTAMP, 
		CONSTRAINT "UNI_XUID" UNIQUE ("Xuid") ON CONFLICT ABORT, 
		CONSTRAINT "UNI_NAME" UNIQUE ("Name") ON CONFLICT ABORT);
	`);																			//数据库数据执行


/**预释放文件*/
const _init = {
		/* 配置文件 */
		Config: {
			"Version":			1,												//配置文件版本
			"Gm_Tell":			"§l§f| §a",
			"Language":			"zh-CN",										//语言模式

			/*升级方式*/
			ValueManner: {
				"UPManner":		"递增",											//玩家玩家升级方式[ 固定 | 递增 | 未知]
				"MaxExp":		500,											//每个等级经验获取 ( 2 * MaxExp ) = 1000 
				"AutoUP":		true,											//是否自动升级开关《如:/lvl levelup》
				"UPLvZero":		false,											//每次升级是否清除经验归零
			},

			/*常规开关*/
			ValueLevel: {
				"LogBook":		false,											//日志开关
				"ConsoleLog":	false,											//控制台消息Message.
				"isResetting":	true,											//是否允许玩家重置属性
				"isDeletion":	false,											//是否允许玩家删除账号
			},

			/*获得默认值*/
			DefaultValue: {
				"MinLevel":		1,												//最小等级，■推荐1■
				"MaxLevel":		200,											//最大等级(满了=Max)
				"MaxHealth":	60,												//最大血量上限//如:加属性加到60无法继续加
				"MaxAttack":	100, 											//最大攻击上限
				"MaxDeFence":	100,											//最大防御上限
				"MaxLuck":		50,												//最大幸运上限
				"MaxPoints":	200000,											//最大属性点上限
				"ResetTing":	500,											//重置属性点单价
				"ImfoConsume":	250,											//消耗金币查询玩家
			},

			/*其他开关*/
			Conventional: {
				/*精准采集防护*/
				"AccurateColl":	true,											//防精准采集开关
				/*领地防护*/
				"LandEnable":	false,											//领地防护开关
				/*成就消息*/
				"onToastChat":	true,											//成就消息开关
				/*攻击BOSS显示*/
				"DemandBOSS":	false,											//攻击boss显示
				/*玩家通知*/
				"JoinEnable":	true,											//进入
				"LeftEnable":	true,											//退出
			},

			/*自定义攻击*/
			AttackEntity: {
				"Switch":		true,											//生物开关
				"Enable":		false,											//玩家开关
				"AttMinimum":	0.5,											//最低伤害
				"Advanced":		100,											//越阶击杀
				"Ordinary":		50,												//普通击杀
			},

			/*列表显示*/
			ListDisplay: {
				"Enable":		true,											//玩家列表显示开关
				"Name":			"Level",										//积分版名称
				"DisName":		"§l§a等级系统",									//显示名称
			},

			/*经验声音*/
			ExpSound: {
				"Enable":		true,											//总开关//玩家获得经验的声音
				"Sound":		"random.orb",									//经验声
			},

			/*升级声音*/
			LevelSound: {
				"Enable":		true,											//总开关//玩家升级的声音
				"Sound":		"random.levelup",								//升级声
			},

			/*死亡扣除*/
			Death: {
				"Switch":		true,											//玩家死亡是否扣除经验或者等级//开启
				"Mode":			"Exp",											//扣除模式// Level or Exp //注意的是必须写清楚
				"Max":			100,											//最大
				"Min":			5,												//最小//比如5~200之间选一个值
			},

			/*不死图腾*/
			ConsumeTotem: {
				"Switch":		false,											//总开关
				"Enable":		false,											//提示开关
				"DefaultExp":	50,												//获得的经验
			},

			/*吃东西*/
			AteEvent: {
				"Switch":		true,											//玩家吃东西获得经验开关//总开关
				"Enable":		false,											//默认开关
				"DefaultExp":	1,												//获得默认的经验
			},

			/*杀死*/
			MobDie: {
				"Switch":		true,											//杀死任何生物获得经验开关//总开关
				"Enable":		false,											//默认开关
				"DefaultExp":	1,												//默认获得经验
			},

			/*破坏*/
			DestroyBlock: {
				"Switch":		true,											//破坏方块获取经验开关//总开关
				"Enable":		false,											//默认开关
				"DefaultExp":	1,												//默认获得经验
			},

			/*放置*/
			PlaceBlock: {
				"Switch":		false,											//方块放置获得经验开关//总开关●推荐关闭●
				"Enable":		false,											//默认开关
				"DefaultExp":	1,												//默认获得经验
			},

			/*经验事件*/
			Experience: {
				"Switch":		true,											//是否开启经验事件获得经验//总开关
				"Enable":		false,											//默认开关
				"DefaultExp":	1,												//默认经验
			}
		}
	};


/**奖励*/
// 函数
// LevelFormula == 函数计算, 如 level % 5 === 0  就是每升5级才能获得奖励
// LevelRange == 获得范围，如 [1,10] 就是一级到十级都可以获得奖励
// Levels == 指定等级 如 [1, 5, 10] 就是 一级 5级 10级 指定的等级获得奖励
// 类型
// mine == 常规 1=属性, 2=血量, 3=攻击, 4=防御
// command == 命令, 特殊值 {realName} == 玩家
// item == 物品, minecraft:air 空气
// llmoney == 不说也是知道是什么
// score == 顾名思义就是积分版
// gift 
const Level_Award = {															//升级奖励////每个等级可以有无数个奖励，就看你怎么加了
		Award: [
			{	/*这一行不要删，不然会报错*/
				LevelRange:		[1, 9999],										//1~9999级都有奖励
				type:			"mine",											//常规
				name:			"属性点+1",										//显示名字
				value:			1,												//模式[1, 2, 3, 4] | 1属性,2血量,3攻击,4防御
				amount:			1,												//数量
			},// = = = = = = = = = = = //
			{
				LevelFormula:	"level % 2 === 0",								//每2级奖励
				type:			"command",										//命令
				name:			"绿宝石+1",										//显示名字
				value:			"give {realName} minecraft:emerald 1",			//命令
				amount:			null,											//命令模式下无用
			},
			{
				Levels:			[5, 10, 15],									//指定等级
				type:			"item",											//物品
				name:			"绿宝石+3",										//名称
				value:			"minecraft:emerald",							//物品
				amount:			3,												//数量
				aux:			0,												//特殊
			},
			{
				Levels:			[50, 100, 200],									//指定等级，这里代表 50 级、100 级，和 200 级
				type:			"command",										//命令
				name:			"钻石+10",										//显示名字
				value:			"give {realName} minecraft:diamond 10",			//命令
				amount:			null,											//命令模式下没有用的
			},
			{
				LevelFormula:	"level % 12 === 0",								//每12级奖励
				type:			"mine",											//常规
				name:			"攻击+1",										//显示名字
				value:			3,												//模式[1, 2, 3, 4]
				amount:			1,												//数量
			},
			{
				LevelFormula:	"level % 13 === 0",								//每13级奖励
				type:			"mine",											//常规
				name:			"防御+1",										//显示名字
				value:			4,												//模式[1, 2, 3, 4]
				amount:			1,												//数量
			},
			{
				LevelFormula:	"level % 18 === 0",								//每18级奖励
				type:			"mine",											//常规
				name:			"幸运+1",										//显示名字
				value:			5,												//模式[1, 2, 3, 4， 5]
				amount:			1,												//数量
			},
			{
				LevelFormula:	"level % 10 === 0",								//每19级奖励
				type:			"item",											//物品
				name:			"钻石+2", 										//这里显示名字
				value:			"minecraft:diamond",							//物品标准名
				amount:			2,												//数量
				aux:			0,												//特殊值
			},
			{
				LevelFormula:	"level % 15 === 0",								//每15级奖励
				type:			"mine",											//常规
				name:			"血量+2",										//显示名字////一颗星
				value:			2,												//模式[1, 2, 3, 4]
				amount:			2,												//数量
			},
			{
				LevelRange:		[1, 20],										//固定在1到20级之内获得奖励
				type:			"command",										//命令
				name:			"钻石+1",										//显示名字
				value:			"give {realName} minecraft:diamond 1",			//命令
				amount:			null,											//命令模式下没有用
			},
			{
				LevelFormula:	"level % 20 === 0",								//每20级才能获得
				type:			"command",										//命令
				name:			"铁剑+1",										//这里显示名字 //{realName} = 玩家名
				value:			"give {realName} minecraft:iron_sword 1",		//命令
				amount:			null,											//命令模式下没用
			},
			{
				LevelFormula:	"level % 5 === 0",								//同上
				type:			"llmoney",										//llmoney
				name:			"金币+500",										//这里显示名字
				value:			"money",										//名称
				amount:			500,											//金币数量
			},
			{
				LevelFormula:	"level % 6 === 0",								//同上
				type:			"score",										//记分板
				name:			"分数+1000",										//显示名字
				value:			"Money",										//名称♦很重要//============
				amount:			1000,											//金币数量
			},
			//{
			//	Levels:			[1, 20],										//指定等级1~20
			//	type:			"snbt",											//nbt
			//	name:			"名字+1",										//显示名字
			//	value:			"{/*若*/}",										//nbt
			//	amount:			null,											//不能用
			//},
		]
	};


/* 预释放文件 */
//////////////////
//杀死生物获得经验//
/////////////////
const Config_Mode = {
		/*杀死生物获得经验列表*/
		KillMobDie: {
			"minecraft:zombie": {												//标准名
				"name": "僵尸",													//名称NAME
				"Exp": 10														//经验
			},
			"minecraft:skeleton": {												//TYPE
				"name": "骷髅",													//太难了
				"Exp": 15														//不行了
			},
			"minecraft:spider": {
				"name": "蜘蛛",
				"Exp": 15
			},
			"minecraft:witch": {
				"name": "女巫",
				"Exp": 20
			},
			"minecraft:enderman": {
				"name": "末影人",
				"Exp": 20
			},
			"minecraft:silverfish": {
				"name": "蠹虫",
				"Exp": 5
			},
			"minecraft:ghast": {
				"name": "恶魂",
				"Exp": 15
			},
			"minecraft:slime": {
				"name": "史莱姆",
				"Exp": 5
			},
			"minecraft:husk": {
				"name": "尸壳",
				"Exp": 10
			},
			"minecraft:stray": {
				"name": "流浪者",
				"Exp": 10
			},
			"minecraft:phantom": {
				"name": "幻翼怪",
				"Exp": 20
			},
			"minecraft:drowned": {
				"name": "溺尸",
				"Exp": 10
			},
			"minecraft:pillager": {
				"name": "掠夺者",
				"Exp": 10
			},
			"minecraft:vindicator": {
				"name": "卫道士",
				"Exp": 10
			},
			"minecraft:ravager": {
				"name": "劫毁兽",
				"Exp": 10
			},
			"minecraft:blaze": {
				"name": "烈焰人",
				"Exp": 10
			},
			"minecraft:creeper": {
				"name": "爬行者",
				"Exp": 15
			},
			"minecraft:sheep": {
				"name": "羊",
				"Exp": 3
			},
			"minecraft:pig": {
				"name": "猪",
				"Exp": 3
			},
			"minecraft:cow": {
				"name": "牛",
				"Exp": 3
			},
			"minecraft:ender_dragon": {
				"name": "末影龙",
				"Exp": 500
			}
		}
	};


/* 预释放文件 */
///////////////////
//破坏方块获得经验///
//////////////////
const Config_Break = {
		/*破坏方块获得经验列表*/
		BlockBreak: {
			"minecraft:sand": {													//类型标准名TYPE
				"name": "沙子",													//名称NAME
				"Exp": 2														//经验
			},
			"minecraft:gravel": {												//类型标准名TYPE
				"name": "砂砾",													//名称NAME
				"Exp": 2														//经验
			},
			"minecraft:soul_soil": {
				"name": "灵魂土",
				"Exp": 3
			},
			"minecraft:clay_ball": {
				"name": "粘土",
				"Exp": 5
			},
			"minecraft:glowstone": {
				"name": "荧石",
				"Exp": 5
			},
			"minecraft:coal_ore": {
				"name": "煤矿石",
				"Exp": 5
			},
			"minecraft:deepslate_coal_ore": {
				"name": "深层煤矿石",
				"Exp": 6
			},
			"minecraft:lapis_ore": {
				"name": "青金石矿石",
				"Exp": 15
			},
			"minecraft:deepslate_lapis_ore": {
				"name": "深层青金石矿石",
				"Exp": 16
			},
			"minecraft:diamond_ore": {
				"name": "钻石矿石",
				"Exp": 50
			},
			"minecraft:deepslate_diamond_ore": {
				"name": "深层钻石矿石",
				"Exp": 51
			},
			"minecraft:emerald_ore": {
				"name": "绿宝石矿石",
				"Exp": 100
			},
			"minecraft:deepslate_emerald_ore": {
				"name": "深层绿宝石矿石",
				"Exp": 101
			},
			"minecraft:gold_ore": {
				"name": "金矿石",
				"Exp": 15
			},
			"minecraft:deepslate_gold_ore": {
				"name": "深层金矿石",
				"Exp": 16
			},
			"minecraft:iron_ore": {
				"name": "铁矿石",
				"Exp": 20
			},
			"minecraft:deepslate_iron_ore": {
				"name": "深层铁矿石",
				"Exp": 21
			},
			"minecraft:quartz_ore": {
				"name": "石英矿石",
				"Exp": 3
			},
			"minecraft:lit_redstone_ore": {
				"name": "红石矿石",
				"Exp": 10
			},
			"minecraft:deepslate_redstone_ore": {
				"name": "深层红石矿石",
				"Exp": 11
			},
			"minecraft:nether_gold_ore": {
				"name": "地狱金矿石",
				"Exp": 5
			},
			"minecraft:ancient_debris": {
				"name": "远古残骸",
				"Exp": 50
			},
			"minecraft:copper_ore": {
				"name": "铜矿石",
				"Exp": 5
			},
			"minecraft:deepslate_copper_ore": {
				"name": "深层铜矿石",
				"Exp": 6
			}
		}
	};


/**预释放文件*/
//////////////////
//无法获得经验的列表
//////////////////
const Block_UnBreak = {
		/*无法获得经验的方块*/
		/*下面是不能获得经验的目录*/
		/*应该还有可以获得经验，小心玩家刷经验哦*/
		UnBreak: {
			"minecraft:grass": {												//标准名
				"name": "草",													//名称
			},
			"minecraft:stone": {												//标准名
				"name": "石头",													//名称
			},
			"minecraft:deadbush": {												//标准名
				"name": "枯萎的灌木",												//名称
			},
			"minecraft:yellow_flower": {										//标准名
				"name": "蒲公英",												//名称
			},
			"minecraft:red_flower": {
				"name": "花",													//名称
			},
			"minecraft:brown_mushroom": {
				"name": "蘑菇",													//名称
			},
			"minecraft:red_mushroom": {
				"name": "红蘑菇",
			},
			"minecraft:torch": {
				"name": "火把",
			},
			"minecraft:redstone_wire": {
				"name": "红石线",
			},
			"minecraft:redstone_torch": {
				"name": "红石火把",
			},
			"minecraft:sapling": {
				"name": "树苗 ",
			},
			"minecraft:leaves": {
				"name": "树叶",
			},
			"minecraft:double_plant": {
				"name": "双层植物",
			},
			"minecraft:seagrass": {
				"name": "海草",
			},
			"minecraft:kelp": {
				"name": "海带",
			},
			"minecraft:snow_layer": {
				"name": "雪",
			},
		}
	};


/**预释放文件*/
//////////////////
//放置方块获得经验//
//////////////////
const Config_Place = {
		/*放置方块获得经验列表*/
		/*这个是新加入的*/
		PlaceBlock: {
			"minecraft:air": {													//标准名
				"name": "空气",													//名称
				"Exp": 0														//经验
			},
			"minecraft:snow_layer": {											//同上
				"name": "雪",													//名称
				"Exp": 0														//经验
			},
			"minecraft:bedrock": {
				"name": "基岩",
				"Exp": 0
			},
		} /*需要添加的方块自行添加*/
	};


/**预释放文件*/
///////////////////
//玩家吃东西获得经验//
///////////////////
const Config_Item = {
		/*玩家吃东西获得经验列表*/
		/*必须是可以吃的东西*/
		ItemExp: {
			"minecraft:apple": {												//标准名
				"name": "苹果",													//名字
				"Exp": 5														//经验
			},
			"minecraft:bread": {												//标准名
				"name": "面包",													//名字
				"Exp": 5														//经验
			},
			"minecraft:carrot": {												//标准名
				"name": "胡萝卜",												//名字
				"Exp": 2														//经验
			},
			"minecraft:melon_slice": {											//标准名
				"name": "西瓜",													//名字
				"Exp": 2														//经验
			},
			"minecraft:pumpkin_pie": {
				"name": "南瓜派",
				"Exp": 5
			},
			"minecraft:rabbit_stew": {
				"name": "兔肉煲",
				"Exp": 12
			},
			"minecraft:beetroot_soup": {
				"name": "甜菜汤",
				"Exp": 8
			},
		}
	};


/**预释放文件*/
///////////////////
//玩家获得效果列表////
///////////////////
const Config_Effect = {
		/*玩家获得效果列表*/
		AllocateEffect: [
			{
				"DemandLevel": 10,												//要求等级//如到10级以上都能获得修改
				"EffectName": "迅捷",											//效果中文名
				"EffectID": 1,													//效果ID
				"Level": 1,														//效果等级
			},
			{
				"DemandLevel": 5,												//要求等级
				"EffectName": "急迫",											//效果中文名
				"EffectID": 3,													//效果ID
				"Level": 1,														//效果等级
			},
			{
				"DemandLevel": 30,												//要求等级
				"EffectName": "力量",											//效果中文名
				"EffectID": 5,													//效果ID
				"Level": 1,														//效果等级
			},
			{
				"DemandLevel": 50,												//要求等级
				"EffectName": "生命恢复",										//效果中文名
				"EffectID": 10,													//效果ID
				"Level": 1,														//效果等级
			},
			{
				"DemandLevel": 60,												//要求等级
				"EffectName": "夜视",											//效果中文名
				"EffectID": 16,													//效果ID
				"Level": 1,														//效果等级
			},
			{
				"DemandLevel": 150,												//要求等级
				"EffectName": "饱和",											//效果中文名
				"EffectID": 23,													//效果ID
				"Level": 1,														//效果等级
			}
		],
	};



let Config   =  /*{}*/_init.Config;												/*配置*/
let Daemon   =  /*{}*/Level_Award;												/*奖励*/
let Break    =  /*{}*/Config_Break;												/*放置*/
let Place    =  /*{}*/Config_Place;												/*破坏*/
let UnBlock  =  /*{}*/Block_UnBreak;											/*无法获得经验的方块*/
let Mode     =  /*{}*/Config_Mode;												/*生物*/
let AItem    =  /*{}*/Config_Item;												/*食物*/
let Effect   =  /*{}*/Config_Effect;											/*效果*/
let isList   =  /*{}*/[], ListName =  /*{}*/[], ListPlay =  /*{}*/[];			/*{  }*/
let Gm_Tell  =  /*{}*/[];														/*插件头显*/

//配置调查
class FileOperation {
	// 配置文路径_filePath
	static _Config  =  _filePath + "Conf\\Config.json";							//定义位置
	static _Award   =  _filePath + "Conf\\Award.json";							//定义位置
	static _Break   =  _filePath + "Conf\\Break.json";							//定义位置
	static _Place   =  _filePath + "Conf\\Place.json";							//定义位置
	static _UnBlock =  _filePath + "Conf\\UnBlock.json";						//定义位置
	static _Mode    =  _filePath + "Conf\\Mode.json";							//定义位置
	static _Item    =  _filePath + "Conf\\Item.json";							//定义位置
	static _Effect  =  _filePath + "Conf\\Effect.json";							//定义位置
	static setConfig(newConfig) { return FileOperation; }

	/**检查文件 */
	static async auditFile() {													//检查存在，不存在创建
		if (!file.exists(this._Config)) {										//1
			logger.warn("未检测到 [ Config.json ] 正在建立....");
			file.writeTo(this._Config, JSON.stringify(_init.Config, null, '\t'));
		}
		if (!file.exists(this._Award)) {										//5
			logger.warn("未检测到 [ Award.json ] 正在建立....");
			file.writeTo(this._Award, JSON.stringify(Level_Award, null, '\t'));
		}
		if (!file.exists(this._Break)) {										//2
			logger.warn("未检测到 [ Break.json ] 正在建立....");
			file.writeTo(this._Break, JSON.stringify(Config_Break, null, '\t'));
		}
		if (!file.exists(this._Place)) {										//4
			logger.warn("未检测到 [ Place.json ] 正在建立....");
			file.writeTo(this._Place, JSON.stringify(Config_Place, null, '\t'));
		}
		if (!file.exists(this._UnBlock)) {										//3
			logger.warn("未检测到 [ UnBlock.json ] 正在建立....");
			file.writeTo(this._UnBlock, JSON.stringify(Block_UnBreak, null, '\t'));
		}
		if (!file.exists(this._Mode)) {											//6
			logger.warn("未检测到 [ Mode.json ] 正在建立....");
			file.writeTo(this._Mode, JSON.stringify(Config_Mode, null, '\t'));
		}
		if (!file.exists(this._Item)) {											//7
			logger.warn("未检测到 [ Item.json ] 正在建立....");
			file.writeTo(this._Item, JSON.stringify(Config_Item, null, '\t'));
		}
		if (!file.exists(this._Effect)) {										//8
			logger.warn("未检测到 [ Effect.json ] 正在建立....");
			file.writeTo(this._Effect, JSON.stringify(Config_Effect, null, '\t'));
		}
	}

	/**读取文件 */
	static async readFile() {
		try {
			this.auditFile();
			Config   =  JSON.parse(file.readFrom(this._Config));				//配置文件
			Daemon   =  new JsonConfigFile(this._Award);						//奖励
			Break    =  new JsonConfigFile(this._Break);						//放置
			Place    =  new JsonConfigFile(this._Place);						//破坏
			UnBlock  =  new JsonConfigFile(this._UnBlock);						//屏蔽
			Mode     =  new JsonConfigFile(this._Mode);							//生物
			AItem    =  new JsonConfigFile(this._Item);							//食物
			Effect   =  new JsonConfigFile(this._Effect);						//效果
			isList   =  Config.ListDisplay.Enable;								//列表显示
			ListName =  Config.ListDisplay.Name;								//积分板名称
			ListPlay =  Config.ListDisplay.DisName;								//显示名称
			Gm_Tell  =  Config.Gm_Tell;											//????
		} catch (e) {
			logger.error(`[文件] 捕获错误：\n${e}\n${e.stack}`);
		}
	}
	}


/**初始化 */ 
mc.listen('onServerStarted', () => { /**初始化 */ 
		if(!init()) return; let count = 0;
		/////////////////////////////////
		let plugins = File.getFilesList(`.\\plugins\\${PLUGIN_Name}\\plugins`);
		let plugins_file = plugins.filter(ma => ma.endsWith('.js'));
		/////////////////////////////////
		plugins_file.forEach((name) => { require(`./${PLUGIN_Name}/plugins/${name}`); count++ });
		log(Format.DarkGreen + tr('load.plugins', [count]));
		/////////////////////////////////
		if (Config.ListDisplay.Enable == true) {								/*关闭显示请修改成false*/
			if (mc.removeScoreObjective(ListName));								//移除一个存在的积分板
			if (mc.newScoreObjective(ListName, ListPlay));						//创建计分板
			if (mc.getScoreObjective(ListName).setDisplay("list", 1));			//建立显示板 (ll reload) 需要两次
		} else mc.removeScoreObjective(ListName);								//删除计分板
	});


/*伤害显示boss*/ ///
mc.listen("onAttackEntity", (att, mob) => {
		let barid = 5211;														//生成ID
		if (Config.Conventional.DemandBOSS == false) return;					//开关
		att.removeBossBar(barid);												//删除BOSS显示
		att.setExtraData("AttBossbar", barid);
		let bt = Format.Blue + tr('play.attack.bossbar', [mob.health, mob.maxHealth])
		let cm = (mob.health * 100) / mob.maxHealth;							//百分比
		att.setBossBar(barid, bt, parseInt(cm), 2);								//设置BOSS显示
		setTimeout(() => {														//确认期间变动 #5秒
			if (att.getExtraData("AttBossbar") == barid){
				att.removeBossBar(barid);										//删除BOSS显示
			}
		}, 5000)
	});


/* 监听攻击事件 */
mc.listen('onAttackEntity', function(pl, entity, damage) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		let play  =  pl.realName;												//攻击者
		let pllv  =  getLevel(pl.xuid);											//攻击者等级
		let platt =  getAttack(pl.xuid);										//获得攻击力
		let mata  =  Math.round(Math.random() * (platt * 0.2) + 1);				//攻击计算
		/*{ | }*/entity.addTag("attack");										//TAG
		if (entity.hasTag("attack") && !entity.isPlayer()) {					//是实体非玩家
			if (Config.AttackEntity.Switch == false) return;					//总开关
			mc.runcmdEx(`damage @e[tag=attack] ${mata} entity_attack entity ${play}`);
			pl.tell(tr('attack.entity.tell', [entity.name, mata]), 4);
		}	entity.removeTag("attack");											//移除标签
		if (entity && entity.isPlayer()) {										//这里才是玩家对象
			if (Config.AttackEntity.Enable == false) return;					//开关
			let ta     = entity.toPlayer(), plta = ta.realName;					//定义到玩家//被攻击者
			let Amin   = Config.AttackEntity.AttMinimum;						//默认
			let talv   = getLevel(ta.xuid);										//被攻击者等级
			let taatt  = getDeFence(ta.xuid);									//获得防御力
			//let luck   = getLuck(pl.xuid);									//幸运
			let mete   = Math.round(Math.random() * (taatt * 0.2) + 1);			//防御计算
			let maddie = mata - mete;
			if (mete >= mata && maddie <= 0) maddie = Number(Amin);				//提示：如=对方防御比我方攻击高，就使强制扣0.5个血
			ta.hurt(maddie);													//执行攻击
			pl.tell(tr('attack.entity.tell', [plta, maddie]), 4);
			if (Number(ta.health) <= Number(maddie) && Number(ta.health) <= 0) {//调查查询
				if (Number(pllv) < Number(talv)) {								//等级对比;
					let xp   = Config.AttackEntity.Advanced;					//越阶
					let chat = tr('attack.entity.advanced', [talv, plta, pllv, play]);
					if (addExp(pl.xuid, xp));									//加经验
					/*全服*/mc.broadcast(Gm_Tell + chat);						//全服消息
					if (Config.ValueLevel.LogBook) LogBook(pl, chat);
					if (Config.ConsumeTotem.Enable) ToastChat(pl, "§l§c|§r "+chat);
					if (Config.ValueLevel.ConsoleLog) logger.info(chat);
				} else {
					let xp   = Config.AttackEntity.Ordinary;					//普通
					let chat = tr('attack.entity.ordinary', [talv, plta, pllv, play]);
					if (addExp(pl.xuid, xp));									//加经验
					/*全服*/mc.broadcast(Gm_Tell + chat);						//全服消息
					if (Config.ValueLevel.LogBook) LogBook(pl, chat);
					if (Config.ConsumeTotem.Enable) ToastChat(pl, "§l§c|§r "+chat);
					if (Config.ValueLevel.ConsoleLog) logger.info(chat);
				}
			}
		}
	});


/*玩家死亡*/
mc.listen('onPlayerDie', (pl) => {
		logger.debug(pl.isSimulatedPlayer());									/*防止错误*/
		if (pl.isSimulatedPlayer() /* 兼容NPC */ || !pl || !pl.pos) return;
		if (Config.Death.Switch == false) return;
		let lvl  =   getLevel(pl.xuid), name = pl.realName;
		let max  =   Config.Death.Max;											//大
		let min  =   Config.Death.Min;											//小
		let luck =   getLuck(pl.xuid);											//幸运
		let mate =   Math.floor(Math.random() * (max - min) + min);				/*随机匹配数量*/
		if (Config.Death.Mode == "Level") {
			if (mate >= getLevel(pl.xuid)) return;								/*限制*//*防止被扣除到负数(ー_ー)!!*/
			if (delLevel(pl.xuid, Number(mate)));								/*执行是否成功*//*扣等级*/
			let logs = tr('playlog.death.level', [lvl, name, mate]);
			let chat = tr('play.death.level', [mate]);
			/* { } */pl.tell(Gm_Tell + chat);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);
		}
		if (Config.Death.Mode == "Exp") {
			if (mate >= getExp(pl.xuid)) return;								//限制*/防止被扣除到负数(ー_ー)!!
			if (delExp(pl.xuid, Number(mate)));									//执行是否成功//扣经验
			let logs = tr('playlog.death.exp', [lvl, name, mate]);
			let chat = tr('play.death.exp', [mate]);
			/* { } */pl.tell(Gm_Tell + chat);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);
		}
	});


/* 生物死亡 */
mc.listen('onMobDie', function(mob, source, cause) => {
		if (source && source.isPlayer()) {										//定义到玩家
			let pl = source.toPlayer();
			if (pl.isCreative) return;											//检测是否为创造模式
			if (Config.MobDie.Switch == false) return;							//总开关
			if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;		//等级上限检测
			let lvl  = getLevel(pl.xuid), name = pl.realName;
			let luck = getLuck(pl.xuid);										//幸运
			let kme  = Mode.get("KillMobDie");									//配置文件
			if (onDetectionMode(pl, kme, mob, tr('info.texta'))) return true;	//杀死生物
			if (Config.MobDie.Enable == true) {									//默认开关
				let xp = Config.MobDie.DefaultExp;
				if (addExp(pl.xuid, xp));										//添加自定义经验
				let logs = tr('playlog.kill.log', [lvl, name, xp]);
				if (Config.ValueLevel.LogBook) LogBook(pl, logs);
				if (Config.ValueLevel.ConsoleLog) logger.info(logs);			//控制台消息
				/*消息*/	//pl.tell(Gm_Tell + "杀死 生物 获得自定义经验 +" + xp);
				return true;
			}
		}
	});


/* 玩家吃东西 */
mc.listen('onAte', function (pl, item) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (pl.isCreative) return;												//检测是否为创造模式
		if (Config.AteEvent.Switch == false) return;							//总开关
		if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;			//等级上限检测
		let lvl  = getLevel(pl.xuid), name = pl.realName;
		let luck = getLuck(pl.xuid);											//幸运
		let itp  = AItem.get("ItemExp");
		if (onDetectionMode(pl, itp, item, tr('info.textd'))) return true;		//吃东西
		if (Config.AteEvent.Enable == true) {									//默认开关
			let xp   = Config.AteEvent.DefaultExp;
			if (addExp(pl.xuid, xp));											//添加自定义经验
			let logs = tr('playlog.ateitem.log', [lvl, name, xp]);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台消息
			/*消息*/	//pl.tell(Gm_Tell + "吃 东西 获得自定义经验 +" + xp);
			return true;
		}
	});


/* 玩家破坏方块 */
mc.listen("onDestroyBlock", function(pl, block) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (pl.isCreative) return;												//检测是否为创造模式
		if (Config.DestroyBlock.Switch == false) return;						//总开关
		if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;			//等级上限检测
		let lvl  = getLevel(pl.xuid), name = pl.realName;
		let luck = getLuck(pl.xuid);											//幸运
		let unbk = UnBlock.get("UnBreak");
		let blk  = Break.get("BlockBreak");
		//防止在有保护的领地中获得经验
		if (isiLandDisabled(pl, block)) {										//防精准采集开关
			let access = Config.Conventional.AccurateColl;
			if (access ? !isCollection(pl.getHand()) : true) {
				if (NotAvailableMode(pl, unbk, block, tr('info.textb'))) return true;	//不获得
				if (onDetectionMode(pl, blk, block, tr('info.textb'))) return true;		//可获得
				/////////////////////////////////////////
				if (Config.DestroyBlock.Enable == true) {						//默认开关
					let xp = Config.DestroyBlock.DefaultExp;
					if (addExp(pl.xuid, xp));									//添加自定义经验
					let logs = tr('playlog.break.log', [lvl, name, xp]);
					if (Config.ValueLevel.LogBook) LogBook(pl, logs);
					if (Config.ValueLevel.ConsoleLog) logger.info(logs);		//控制台消息
					/*消息*/	//pl.tell(Gm_Tell + "破坏 方块 获得自定义经验 +" + xp);
					return true;
				}
			}//领地防护
		}
	});


/* 玩家放置方块后 */
mc.listen('afterPlaceBlock', (pl, block) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (pl.isCreative) return;												//检测是否为创造模式
		if (Config.PlaceBlock.Switch == false) return;							//总开关
		if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;			//等级上限检测
		let lvl  =  getLevel(pl.xuid), name = pl.realName;
		let luck =  getLuck(pl.xuid);											//幸运
		let unbk =  UnBlock.get("UnBreak");
		let pbk  =  Place.get("PlaceBlock");
		//防止在有保护的领地中获得经验
		if (isiLandDisabled(pl, block)) {										//如果能获得经验在其他位置计算
			if (NotAvailableMode(pl,unbk,block, tr('info.textc'))) return true;	//不可获得
			if (onDetectionMode(pl, pbk, block, tr('info.textc'))) return true;	//放置物品
			if (Config.PlaceBlock.Enable == true) {								//默认开关
				let xp   = Config.PlaceBlock.DefaultExp;
				if (addExp(pl.xuid, xp));										//添加自定义经验
				let logs = tr('playlog.place.log', [lvl, name, xp]);
				if (Config.ValueLevel.LogBook) LogBook(pl, logs);
				if (Config.ValueLevel.ConsoleLog) logger.info(logs);			//控制台消息
				/*消息*/	//pl.tell(Gm_Tell + "放置 方块 获得自定义经验 +" + xp);
				return true;
			}
		}//领地防护
	});


/* 玩家获得经验 */
// 两个模式:
// [一个经验是多少就获得多少] = true
// [一个捡经验直接获得自定义经验] = false
mc.listen("onExperienceAdd", function(pl, exp) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (pl.isCreative) return;												//检测是否为创造模式
		if (Config.Experience.Switch == false) return;							//总开关
		if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;			//等级上限检测
		let lvl   = getLevel(pl.xuid), name = pl.realName;
		let luck  = getLuck(pl.xuid);											//幸运
		if (Config.Experience.Enable == true) {									//更换模式
			let xp = Config.Experience.DefaultExp;
			if (addExp(pl.xuid, xp));											//添加自定义经验
			let logs = tr('playlog.erience.log', [lvl, name, xp]);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台消息
			/*消息*/	//pl.tell(Gm_Tell + "捡到 掉落经验 获得默认经验 +" + xp);
		} else {
			if (addExp(pl.xuid, exp));											//经验是多少他就加多少ಠ_ರೃ
			let logs = tr('playlog.exp.erience.info', [lvl, name, exp]);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台消息
			/*消息*/	//pl.tell(Gm_Tell + "捡到 掉落经验 获得常规经验 +" + xp);
			return true;
		}
	});


/* 监听消耗图腾事件 */
mc.listen('onConsumeTotem', function (pl) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (pl.isCreative) return;												//好像在这里没有用 +—_—+
		if (Config.ConsumeTotem.Switch == false) return;						//总开关
		if (getLevel(pl.xuid) >= Config.DefaultValue.MaxLevel) return;			//等级上限检测
		let lvl   = getLevel(pl.xuid), name = pl.realName;
		let luck  = getLuck(pl.xuid);											//幸运
		//const a = Math.floor(Math.random() * (max - min + 1)) + min;			//生成随机数
		let xp    = Config.ConsumeTotem.DefaultExp;								//获得自定义经验
		if (addExp(pl.xuid, xp));												//添加经验
		let chat = tr('playlog.consume.totem', [lvl, name]);
		if (Config.ValueLevel.LogBook) LogBook(pl, chat);
		if (Config.ConsumeTotem.Enable) ToastChat(pl, "§l§c|§r "+chat);			//提示
		if (Config.ValueLevel.ConsoleLog) logger.info(chat);					//控制台消息
	});


/*进入服检测数据//进入前*/
mc.listen("onPreJoin", function (pl) {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (!isTable(pl.xuid)) {												//查询存在//不存在建立数据
			if (JoinCreate(pl.xuid));											//不存在就创建
			let logs = tr('broadcast.prejoin.info', [pl.realName]);
			/*全服*/mc.broadcast(Gm_Tell + logs);								//全服消息
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ConsumeTotem.Enable) ToastChat(pl, "§l§c|§r "+logs);		//提示
			if (Config.ValueLevel.ConsoleLog) logger.info(chat);				//控制台消息
		}																		/*else{ log("数据已存在!");	}*/
	});


/* 监听进服事件 */
mc.listen('onJoin', function (pl) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (onJoinTick(pl));													//开启刷新
		let lvl  = getLevel(pl.xuid), name = pl.realName;
		//let luck   = getLuck(pl.xuid);										//幸运
		let logs = tr('broadcast.join.info', [lvl, name]);
		if (Config.ValueLevel.LogBook) LogBook(pl, logs);						//log
		if (Config.Conventional.JoinEnable) mc.broadcast(Gm_Tell + logs);		//提示
		if (Config.ValueLevel.ConsoleLog) logger.info(logs);					//控制台消息
		if (Config.ListDisplay.Enable == true) {								//关闭显示请修改成false
			let plat = mc.getPlayerScore(name, ListName);						//mc.getScoreObjective(ListName);
			if (!plat) pl.setScore(ListName, Number(lvl));
		}
	});


/* 监听退出事件 */
mc.listen('onLeft', function (pl) => {
		if (pl.isSimulatedPlayer()) return;										//查询是否为模拟玩家
		if (Gpt.has(pl.xuid)) Gpt.delete(pl.xuid);								//删除记录数据
		let lvl  = getLevel(pl.xuid), name = pl.realName;
		//let luck   = getLuck(pl.xuid);										//幸运
		let logs = tr('broadcast.left.info', [lvl, name]);
		if (Config.ValueLevel.LogBook) LogBook(pl, logs);						//log
		if (Config.Conventional.LeftEnable) mc.broadcast(Gm_Tell + logs);		//提示
		if (Config.ValueLevel.ConsoleLog) logger.info(logs);					//控制台消息
		if (Config.ListDisplay.Enable == true) {								//关闭显示请修改成false
			let plat = mc.getScoreObjective(ListName);							//mc.getPlayerScore(name, ListName);
			if (plat) return mc.runcmdEx(`/scoreboard players reset ${name} ${ListName}`);
		}
	});


/* 更新系统
* @param pl 玩家
* @return bool */
function onJoinTick(pl) {
		let tim = setInterval(function () {
		if (pl.inWorld == 1) {
			let play   = getPlayData(pl.xuid);									//查询数据
			let luck   = getLuck(pl.xuid);										//幸运
			let mobile = Effect.get("AllocateEffect");							//效果文件
			AddALLocateEffect(pl, Number(play.Level), mobile);					//获得效果
			pl.setMaxHealth(Number(play.Health));								//设置血量
			pl.setLuck(Number(luck));											//设置幸运属性||不知道用处
			////////////////////////////////////////
			if (Config.ListDisplay.Enable == true) {							//关闭显示请修改成false
				let plat = mc.getPlayerScore(play.Name, ListName);				//mc.getScoreObjective(ListName);
				if (!plat) pl.setScore(ListName, Number(play.Level));			//玩家列表显示
			}
		}else return clearInterval(tim);
		}, 1500);																//速度
	}


// 等级升级信息
// @param xuid 玩家 
// @param AutoUp 升级模式 = 【 true / false 】
/* @return bool */
function LevelUp(xuid) {
		if (xuid == null) return;
		let pl  = mc.getPlayer(xuid), xp = getExp(xuid);						//玩家对象和拥有经验值
		let Max = Config.DefaultValue.MaxLevel;
		if (getLevel(xuid) >= Max || pl == undefined) return;					//等级上限检测
		let level = getLevel(xuid);												/*获取玩家等级*/
		let count = 1, lvl = Number(level) + Number(count);
		if (addLevel(xuid, count)) getAward(xuid, level);						/*等级+1*//*并且执行奖励*/
		pl.setHungry(20);														/*满饥饿*/
		pl.addEffect(22, 15 * 20, 2, Boolean(true).valueOf());					//药水效果//伤害吸收
		pl.addEffect(10, 5  * 20, 3, Boolean(true).valueOf());					//药水效果//生命提升
		pl.addEffect(5,  10 * 20, 1, Boolean(true).valueOf());					//药水效果//力量
		/*主标题*/ /*副标题*/
		pl.setTitle(tr('levelup.title1'));										//主
		pl.setTitle(tr('levelup.title2', [level, lvl]), 3);						//副
		/*聊天框显示*/
		pl.tell("\n\n\n");														//用来清屏
		pl.tell(Gm_Tell + tr('levelup.tell1'));
		pl.tell(Gm_Tell + tr('levelup.tell2'));
		pl.tell(Gm_Tell + tr('levelup.tell3', [lvl]));
		pl.tell(Gm_Tell + tr('levelup.tell4'));
		pl.tell(Gm_Tell + tr('levelup.tell5', [Gpt.get(pl.xuid)]));
		pl.tell(Gm_Tell + tr('levelup.tell6'));
		mc.broadcast(Gm_Tell + tr('levelup.broadcast', [pl.realName, lvl]));
		pl.tell("\n\n\n\n");													//用来清屏
		////////////////////////////////////////
		mc.spawnParticle(pl.blockPos, "minecraft:totem_particle");				/*粒子效果*/
		for (let i = 0; i < 2 * Math.PI; i += (Math.PI / 6)) {
			let setX = pl.pos.x + 1 * Math.cos(i);
			let setZ = pl.pos.z + 1 * Math.sin(i);
			mc.spawnParticle(setX, pl.pos.y+0.5, setZ, pl.pos.dimid, "minecraft:heart_particle");
			mc.spawnParticle(setX, pl.pos.y,     setZ, pl.pos.dimid, "minecraft:falling_border_dust_particle");
			mc.spawnParticle(setX, pl.pos.y-0.5, setZ, pl.pos.dimid, "minecraft:basic_crit_particle");
		}	////////////////////////////////////////
		if (Gpt.has(pl.xuid)) Gpt.delete(pl.xuid);								//删除记录
		if (Config.LevelSound.Enable) onPlaySound(pl, "UP");					//升级提示音
		if (Config.ValueManner.UPLvZero == true) resetExp(pl.xuid);				//归零经验[有开关]
		setTimeout(() => { isLevelUp(xuid) }, 2500);							//检测升级[两点五秒钟]
		////////////////////////////////////////
		let chat = tr('levelup.toastchat', [pl.realName, lvl]);
		if (Config.ValueLevel.LogBook) LogBook(pl, chat);
		if (Repeat.get(pl.xuid) !== true) {										//防成就消息重复
			Repeat.set(pl.xuid, true);											//？？？
			if (ToastChat(pl, "§l§c|§r "+chat));								//成就消息
			setTimeout(() => { Repeat.delete(pl.xuid) }, 10000);				//十秒
		}
	}


/** 检测经验是否满了
* @param xuid 玩家
* @return bool */
function isLevelUp(xuid) {
	try { //玩家为空
		if (xuid == null) return;
		let pl  = mc.getPlayer(xuid), xp = getExp(xuid);
		let eep = xp - getNextLevelExp(getLevel(xuid));
		if (xp < getNextLevelExp(getLevel(xuid))) return;						//检测是否正常
		if (setExp(xuid, Number(eep))) return LevelUp(xuid);					/*升级以及奖励*/
	} catch (error) {
		/*错误消息*/logger.log(error);
	}
	}


/** 等级奖励
 * @param xuid 玩家
 * @param {number} level 等级 */
function getAward(xuid, level) {
		if (xuid == null && level == 0) return									//玩家为空或者等级为0
		let pl    = mc.getPlayer(xuid); if (pl == null) return					//获得玩家对象
		let award = Daemon.get("Award");										//获得奖励数据
		let maxp  = Config.DefaultValue.MaxPoints;								//最大的属性点
		let maxh  = Config.DefaultValue.MaxHealth;								//最大的血量
		let maxa  = Config.DefaultValue.MaxAttack;								//最大的攻击
		let maxd  = Config.DefaultValue.MaxDeFence;								//最大的防御
		let maxl  = Config.DefaultValue.MaxLuck;								//最大的幸运
		//■■■■■■■■■■
		let aa = (award) => {
			let { LevelRange, Levels, LevelFormula } = award;
			if (LevelRange && LevelRange.length) {								//指定等级奖励
				let [min, max] = LevelRange;
				return (max ? level <= max : true) && (min ? min <= level : true);
			}
			if (LevelFormula) return Boolean(onFuncEval(LevelFormula,{level}));	//JS函数奖励
			if (Levels && Levels.length) return Levels.includes(level);			//对等函数
			return true;
		};
		//■■■■■■■■■■
		let bb = (award) => {
			let { type, name, value, amount, aux } = award;
			/*Gpt.set(pl.xuid, "");*/											/*限制级*/ /*防止underlined*/
			if (type === 'mine') {
				/* 模式 [1, 2, 3, 4] 1属性, 2血量, 3攻击, 4防御, 5幸运 */
				switch (Number(value)) {
					case 1: {													//属性点
						if (getPoints(xuid) >= maxp) return;					//限制
						addPoints(xuid, amount);								//属性
						Gpt.set(pl.xuid, name);									/**/
						return null;
					}
					////////////////////////////////////////
					case 2: {													//血量
						if (getHealth(xuid) >= maxh) return;					//限制
						addHealth(xuid, amount);								//血量
						Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
						return null;
					}
					////////////////////////////////////////
					case 3: {													//攻击力
						if (getAttack(xuid) >= maxa) return;					//限制
						addAttack(xuid, amount);								//攻击
						Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
						return null;
					}
					////////////////////////////////////////
					case 4: {													//防御力
						if (getDeFence(xuid) >= maxd) return;					//限制
						addDeFence(xuid, amount);								//防御
						Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
						return null;
					}
					////////////////////////////////////////
					case 5: {													//幸运值
						if (getLuck(xuid) >= maxl) return;						//限制
						addLuck(xuid, amount);									//幸运
						Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
						return null;
					}
				}
				return true;
			}
			////////////////////////////////////////
			if (type === 'command') {											//命令
				mc.runcmdEx(value.replace(/{realName}/g, pl.realName));			//执行命令
				Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
				return null;
			}
			////////////////////////////////////////
			if (type === 'llmoney') {											//金币
				mc.getPlayer(xuid).addMoney(amount);							//添加金币
				//money.add(xuid, amount);										//添加金币
				Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
				return null;
			}
			////////////////////////////////////////
			if (type === 'score') {												//分数
				let scoreObj = mc.getScoreObjective(value);						//积分版
				if (!scoreObj) mc.newScoreObjective(value);						/*不存在建立*/
				mc.getPlayer(xuid).addScore(value, amount);						//添加积分
				Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
				return scoreObj;
			}
			////////////////////////////////////////
			if (type === 'item') {												//物品
				var item = mc.newItem(value, amount);							//物品
				if (!item) throw TypeError('Failed to create item object!(￣ ‘i ￣;) ');
				if (typeof aux === 'number') item.setAux(aux);					//特殊值
				mc.getPlayer(xuid).giveItem(item);								/*给物*/
				mc.getPlayer(xuid).refreshItems();								/*刷新*/
				Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
				return item;
			}
			////////////////////////////////////////
			if (type === 'snbt') {												//NBT物品
				let nbt = NBT.parseSNBT(value);									//NBT
				if (!nbt) throw TypeError("Failed to parse sNbt");				//失败
				let item = mc.newItem(nbt);										//给
				if (!item) throw TypeError('Failed to create item object');		//失败
				mc.getPlayer(xuid).giveItem(item);								/*给物*/
				mc.getPlayer(xuid).refreshItems();								/*刷新*/
				Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
				return nbt;
			}
		};	//Level_Award.Award
		Daemon.get("Award").filter(aa).map(bb).filter((v) => v);
		let logs = tr('levelup.play.give', [pl.realName, Gpt.get(pl.xuid)]);
		if (Config.ValueLevel.LogBook) LogBook(pl, logs);
		if (Config.ValueLevel.ConsoleLog) logger.info(logs);					/*控制台消息*/
		pl.refreshItems();
		return true;
	}


/** 添加玩家经验
* @param xuid 玩家
* @param exp 经验
* @return bool */
function addExp(xuid, exp) {
		if (xuid == null && exp == 0) return false;								//玩家为空或者经验为0
		let Max = Config.DefaultValue.MaxLevel;
		if (getLevel(xuid) >= Max) return false;								//等级上限检测
		let pl  = mc.getPlayer(xuid);											//获取玩家对象
		let lvl = getLevel(pl.xuid);											//获得玩家等级
		pl.tell(Format.Bold+Format.Yellow+"EXP"+Format.Red+"+"+Format.White+exp, 4);
		if (Config.ExpSound.Enable || exp >= 1) onPlaySound(pl, "EXP");			//获得经验声音
		if (addHeadExp(xuid, Number(exp)));										//添加玩家总经验
		let pxp = getExp(xuid) + exp - getNextLevelExp(lvl);
		let axp = getExp(xuid) + exp;											//计算经验总数
		if (getExp(xuid) + exp >= getNextLevelExp(lvl)) {						//是否可以升级
			if (Config.ValueManner.AutoUP == true) {							//自动升级开关
				if (setExp(xuid, Number(pxp))) return LevelUp(xuid);			//升级以及奖励
			} else if (setExp(xuid, Number(axp))) return;						//经验不够
		} else if (setExp(xuid, Number(axp))) return;							//直接添加
	}


/** 根据Xuid查询玩家名
* @param xuid 玩家
* @return bool */
function getXuidToName(xuid) {													//根据Xuid查询玩家名
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Name FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Name == undefined) return null;								//不存在显示null
		return result.Name;														//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return null;
	}
	}


/** 根据玩家名查询Xuid
* @param name 玩家
* @return bool */
function getNameToXuid(name) {													//根据玩家名查询Xuid
	try { //玩家为空
		if (name == null) return;
		let stmt = Lite.prepare("SELECT Xuid FROM LevelExp WHERE Name = $a;");
		stmt.bind(name).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Xuid == undefined) return null;								//不存在显示null
		return result.Xuid;														//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return null;
	}
	}


/* 查询某个玩家信息
* @param xuid 玩家
* @return bool */
function getPlayData(xuid) {
	try { //数据为空就取消
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT * FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result == undefined) return null;									//不存在显示null
		return result;															//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return null;
	}
	} /**///比如 获得等级 = getPlayData(xuid).Level


/** 查询玩家的等级
* @param xuid 玩家
* @return bool */
function getLevel(xuid) {														//获取等级
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Level FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Level == undefined) return 0;									//不存在显示0
		return result.Level;													//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的经验数量
* @param xuid 玩家
* @return bool */
function getExp(xuid) {															//获取经验
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Exp FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Exp == undefined) return 0;									//不存在显示0
		return result.Exp;														//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的属性点
* @param xuid 玩家
* @return bool */
function getPoints(xuid) {														//属性点
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Points FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Points == undefined) return 0;								//不存在显示0
		return result.Points;													//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的总经验
* @param xuid 玩家
* @return bool */
function getHeadExp(xuid) {														//获取总经验
	try { /*玩家为空*/
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT HeadExp FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.HeadExp == undefined) return 0;								//不存在显示0
		return result.HeadExp;													//获得
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}


/** 查询玩家的血量
* @param xuid 玩家
* @return bool */
function getHealth(xuid) {														//获取血量
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Health FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Health == undefined) return 0;								//不存在显示0
		return result.Health;													//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的攻击力
* @param xuid 玩家
* @return bool */
function getAttack(xuid) {														//获取攻击
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Attack FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Attack == undefined) return 0;								//不存在显示0
		return result.Attack;													//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的防御
* @param xuid 玩家
* @return bool */
function getDeFence(xuid) {														//获得防御
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT DeFence FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.DeFence == undefined) return 0;								//不存在显示0
		return result.DeFence;													//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 查询玩家的幸运
* @param xuid 玩家
* @return bool */
function getLuck(xuid) {														//获得幸运
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("SELECT Luck FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();												//执行
		let result = stmt.fetch();												//查询
		if(result.Luck == undefined) return 0;									//不存在显示0
		return result.Luck;														//获得
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 直接添加玩家经验//不升级
* @param xuid 玩家
* @param amount 经验
* @return bool */ 
function addExps(xuid, amount) {												//添加经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Exp = Exp + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function delExp(xuid, amount) {													//减少经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Exp = Exp - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function setExp(xuid, amount) {													//设置经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 重置玩家经验
* @param xuid 玩家
* @return bool */
function resetExp(xuid) {														//重置经验
	try { //玩家为空
		if (xuid == null) return;
		let stmt = Lite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		stmt.bind([0, xuid]).execute();
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function addLevel(xuid, amount) {												//添加等级
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLevel(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Level = Level + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加等级
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function delLevel(xuid, amount) {												//减少等级
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLevel(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Level = Level - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少等级
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setLevel(xuid, amount) {												//设置等级
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLevel(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Level = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置等级
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function addPoints(xuid, amount) {												//添加属性点
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getPoints(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Points = Points + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加属性点
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delPoints(xuid, amount) {												//减少属性点
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getPoints(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Points = Points - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少属性点
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function setPoints(xuid, amount) {												//设置属性点
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getPoints(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Points = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置属性点
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function addHeadExp(xuid, amount) {												//添加总经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHeadExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET HeadExp = HeadExp + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function delHeadExp(xuid, amount) {												//减少总经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHeadExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET HeadExp = HeadExp - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function setHeadExp(xuid, amount) {												//设置总经验
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHeadExp(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET HeadExp = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置总经验
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function addHealth(xuid, amount) {												//添加血量
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHealth(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Health = Health + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加血量
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function delHealth(xuid, amount) {												//减少血量
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHealth(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Health = Health - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少血量
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function setHealth(xuid, amount) {												//设置血量
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getHealth(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Health = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置血量
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家攻击力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function addAttack(xuid, amount) {												//减少攻击力
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getAttack(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Attack = Attack + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加攻击力
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家攻击力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delAttack(xuid, amount) {												//减少攻击力
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getAttack(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Attack = Attack - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少攻击力
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家攻击力
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setAttack(xuid, amount) {												//设置攻击力
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getAttack(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Attack = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置攻击力
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家防御
* @param xuid 玩家
* @param amount 防御
* @return bool */
function addDeFence(xuid, amount) {												//添加防御力
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getAttack(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET DeFence = DeFence + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加防御
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 减少玩家防御力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delDeFence(xuid, amount) {												//减少防御力
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getDeFence(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET DeFence = DeFence - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少防御力
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 设置玩家防御
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setDeFence(xuid, amount) {												//设置防御
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getDeFence(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET DeFence = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行设置防御
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 添加玩家的幸运
* @param xuid 玩家
* @param amount 数量
* @return bool */
function addLuck(xuid, amount) {												//添加幸运
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLuck(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Luck = Luck + $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行添加
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 减少玩家的幸运
* @param xuid 玩家
* @param amount 数量
* @return bool */
function delLuck(xuid, amount) {												//减少幸运
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLuck(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Luck = Luck - $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/** 设置玩家的幸运
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setLuck(xuid, amount) {												//设置幸运
	try { //玩家为空
		if (xuid == null) return;
		let count = Number(amount);												// getLuck(xuid);
		let stmt = Lite.prepare("UPDATE LevelExp SET Luck = $a WHERE Xuid = $b;");
		stmt.bind([count, xuid]).execute();										//执行减少
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/* 获得全部数据
* @return bool */
function getDataAll() {
	try { //数据为空就取消
		let result = [];														//定义
		let stmt = Lite.query("SELECT ID,Xuid,Name,Level,Exp,HeadExp,Points,Health,Attack,DeFence,Luck,Time FROM LevelExp");
		stmt.shift();															//跟
		for (let i of stmt)														//转换
		result.push({ 
			ID: i[0], Xuid: i[1], Name: i[2], Level: i[3], Exp: i[4], HeadExp: i[5], Points: i[6], 
			Health: i[7], Attack: i[8], DeFence: i[9], Luck: i[10], Time: i[11] 
		});																		//存储记录
		return result;															//返回
	} catch (error) {															//错误
		/*错误消息*/logger.log(error);
		return 0;
	}
	}


/* 更新某个玩家消息
* @param xuid 玩家
* @param data 数据X6
* @return bool */
function onUpdate(xuid, data) {													//更新玩家数据
	try { //玩家和数据为空时取消
		if (xuid == null && data == null) return;								//数据为空取消
		let pl   = mc.getPlayer(xuid);											//获得玩家对象
		//let count = JSON.stringify(data);										// Update
		let line = "UPDATE LevelExp SET Level=$a,Exp=$b,Points=$c,Health=$d,Attack=$e,DeFence=$f,Luck=$g WHERE Xuid = $h;"
		let stmt = Lite.prepare(line);
		stmt.bind([data[0], data[1], data[2], data[3], data[4], data[5], data[6], xuid]).execute();
		if(pl == undefined) return pl = mc.getPlayer(xuid);
		let logs = tr('playlog.play.updata', [pl.realName, data]);
		if (Config.ValueLevel.LogBook) LogBook(pl, logs);
		if (Config.ValueLevel.ConsoleLog) logger.warn(logs);					//控制台信息
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/* 完全删除玩家全部记录
* 此操作将无法恢复数据，请谨慎操作。
* @param {String} xuid 玩家
* @return bool */
function DeleteTable(xuid) {													//查询玩家数据是否存在
	try { //玩家为空
		if (xuid == null) return;												//不存在
		if(!isTable(xuid)) return false;										//存不存在
		let pl = mc.getPlayer(xuid);											//获得玩家对象
		let stmt = Lite.prepare("DELETE FROM LevelExp WHERE Xuid = $a;");
		stmt.bind(xuid).execute();
		if(pl == undefined) return pl = mc.getPlayer(xuid);
		let logs = tr('playlog.play.delete', [pl.realName]);
		if (Config.ValueLevel.LogBook) LogBook(pl, logs);
		if (Config.ValueLevel.ConsoleLog) logger.warn(logs);					//控制台信息
		return true;
	} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
	}
	}


/** 建立玩家数据*/
function JoinCreate(xuid) {
	try { //玩家为空
		if (xuid == null) return;
		if(!isTable(xuid)) {													//检测是否存在
			let pl = mc.getPlayer(xuid);										//获得玩家对象
			logger.warn(tr('play.absent.create', [pl.realName]));				//控制台信息
			let Lvl = Number(Config.DefaultValue.MinLevel);
			let stmt = Lite.prepare("INSERT INTO LevelExp ('Xuid', 'Name', 'Level') VALUES ($a, $b, $c);");
			if(pl == undefined) return pl = mc.getPlayer(xuid);
			stmt.bind([pl.xuid, pl.realName, Lvl]).execute();
			return stmt.insertId || -1;											//成功还是失败
		}/* else { log("数据存在, 无需创建!");	}*/
	} catch (error) {
		/*错误消息*/logger.log(error);
		return -1;
	}
	}


/* 判断指定玩家是否存在
* @param {String} xuid 玩家
* @return bool */
function isTable(xuid) {														//查询玩家数据是否存在
		if (xuid == null) return;												//不存在
		let result = Lite.query("SELECT count(*) count FROM LevelExp WHERE Xuid = '"+xuid+"';");
		//let result = stmt.fetch();											//查询
		return result[1][0] > 0 ? true : false;									//获得存不存在
	}


/** 获得玩家等级上限
* @param level 等级
* @return bool */
function getNextLevelExp(Lvl) {													//等级上限
		if (Lvl == null) return;												//不存在
		let Level = Number(Lvl);												//定义
		let Max   = Config.DefaultValue.MaxLevel;								//大
		let Min   = Config.DefaultValue.MinLevel;								//小
		if (Level > Min - 1 && Level < Max) {
			let manner = Config.ValueManner.UPManner;
			if (manner == "递增") return Level * Config.ValueManner.MaxExp;		//例如 2 * 200 = 400
			if (manner == "固定") return Config.ValueManner.MaxExp;				//例如 固定经验//如1000 必须到1000才能升级
		} else return 0;
	}


/**其它加载*/
function init() {
	try { //错误
		regPapi();																//前置库加载 
		LevelCmd();																/*注册命令*///真命令
		FileOperation.readFile();												/*读取文件*/
		////////////////////////////
		logger.setTitle(PLUGIN_Name);
		logger.setConsole(true, 4);
		return true;
	} catch (e) {
		logger.warn(tr('papi.install.warn')+`\n` + `${e}\n${e instanceof Error ? e.stack : ''}`);
		return false;
	}
	}


/* 翻译模块
 * @return {string} */
//function tr(/*{key}*/) {
function tr(sentence, replacer = []) {
		let langs = data.parseJson(File.readFrom('./plugins/LevelExp/Lang/' + Config.Language + '.json'));
		if (!langs[sentence]) {													//翻译错误
			return 'Language Error';
		}
		let output = langs[sentence];											//对比
		for (let ii = 0; ii < replacer.length; ii++) {							//检测
			const element = replacer[ii];										//定义
			output = output.replace('%%', element);								//定义
		}
		return output;
	}


/* //精准采集检测
 * @param {Item} it 物品
 * @returns {boolean} */
function isCollection(item) {
		if (!item.isEnchanted || item.isEnchantingBook) return false;			//不是
		let nbt = item.getNbt().toObject();										//精准附魔NBT
		for (let ench of nbt.tag.ench) if (ench && ench.id === 16) return true;	//是
		return false;
	}


//转码我也看不懂("▔□▔)从其他地方抄过来的(/"≡ _ ≡)=
function onFuncEval(value, vars = {}) {
		let vacant = Object.entries(vars).map(([n, v]) => `const ${n} = ${v}`).join('; ');
		let count = `${vacant}; return (${value});`;							//是或者不是
		return new Function(count)();
	}


/* 记录玩家行为log
 * @param pl 玩家
 * @param key 数据
 * @return bool */
function LogBook(pl, key) {
		if (pl == null && key == null) return;
		let now_time = system.getTimeStr();
		let midde = key.replace(/§[a-z0-9]/g, "");								//清理§
		let figs = _filePath+`\\Conf\\Logs\\${pl.realName}.Log`;
		new File(figs, file.AppendMode).writeLineSync(""+now_time+" · "+midde);
	}


/* 成就消息
 * @param pl 玩家
 * @returns {boolean} */
function ToastChat(pl, chat) {
		if (Config.Conventional.onToastChat == true) {							//开关
		mc.getOnlinePlayers().forEach(onl => onl.sendToast(tr('consume.totem'), chat));
		}
	}


//获得验证码
function randID(length = 6) {
		var res = '', mcc = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];						//随机码
		for (let i = 0; i < length; i++) res += mcc[Math.round(Math.random() * (mcc.length - 1))];
		return res;
	}


/*声音列表*/
/*单独写出来，为了在其他地方使用*/
function onPlaySound(pl, mode) {
		if (pl == null && mode == null) return;
		let name = pl.realName;
		let xpos = Config.ExpSound.Sound;
		let leos = Config.LevelSound.Sound;
		let aaa = `execute as ${name} run playsound mob.villager.no`;
		if (mode == "NO") mc.runcmdEx(aaa);										//不可以
		////////////////////////////////////////
		let moi = `execute as ${name} run playsound item.book.page_turn`;
		if (mode == "OK") mc.runcmdEx(moi);										//翻书声
		////////////////////////////////////////
		let bbb = `execute as ${name} run playsound note.pling`;
		if (mode == "YES") mc.runcmdEx(bbb);									//提示声
		////////////////////////////////////////
		let ccc = `execute as ${name} run playsound ${xpos}`;
		if (mode == "EXP") mc.runcmdEx(ccc);									//经验声
		////////////////////////////////////////
		let ddd = `execute as ${name} run playsound ${leos}`;
		if (mode == "UP") mc.runcmdEx(ddd);										//升级声
	}


/* pl 玩家 level 等级 mobile 效果 *///效果
function AddALLocateEffect(pl, level, mobile, Time = 1222) {
		//检测模式//看看是否为空
		if (pl == null && level == null && mobile == null) return;
		let lvl = getLevel(pl.xuid), plat = pl.realName;						//定义玩家名
		for (let i = 0; i < mobile.length; i++) {
			let Eff = mobile[i]
			if (level >= Eff["DemandLevel"]) {									//对比等级
			pl.getAllEffects().includes(Eff["EffectID"])
			pl.addEffect(Eff["EffectID"], Time, Eff["Level"] - 1, false);		//效果
			//let logs = "§aLV."+level+" §f"+plat+" §b获得效果 §c+"+Eff["EffectName"]+" §b!!!";
			//if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			//if (Config.ValueLevel.ConsoleLog) return;//logger.info(logs);		//控制台信息。(不需要会刷屏的)
			}
		}
	}


/* pl 玩家 type 类型 mobile 模式 *///转换
function onDetectionMode(pl, type, mobile, name) {
		//检测模式//看看是否为空
		if (pl == null && type == null && mobile == null) return;
		let lvl = getLevel(pl.xuid), plat = pl.realName;
		for (let i in type) {
			let Inside = i;														/*标准名称*/
			if (Inside == mobile.type) {										//对比
			let acc = type[Inside].name, aexp = type[Inside].Exp;				//名称//经验
			if (addExp(pl.xuid, aexp));											//添加经验
			let logs = tr('playlog.yes.exp.info', [lvl, plat, name, acc, aexp]);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台信息
			//如果想开启消息的提示，直接把下面两个杠取消就行
			/*消息*///pl.tell(Gm_Tell + "你 " + name +" "+acc+" 获得经验 + " + aexp);
			return true;
			}
		}
	}


/* pl 玩家 type 类型 mobile 模式 *///转换
function NotAvailableMode(pl, type, mobile, name) {
		//检测模式//看看是否为空
		if (pl == null && type == null && mobile == null) return;
		let lvl = getLevel(pl.xuid), plat = pl.realName;
		for (let i in type) {
			let Inside = i;														/*标准名称*/
			if (Inside == mobile.type) {										//对比
			let acc = type[Inside].name;										//名称
			let logs = tr('playlog.not.exp.info', [lvl, plat, name, acc]);
			if (Config.ValueLevel.LogBook) LogBook(pl, logs);
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台信息
			//如果想开启消息的提示，直接把下面两个杠取消就行
			/*消息*///pl.tell(Gm_Tell + "§c你 "+name+" 的 "+acc+" 不获得经验!!");
			return true;
			}
		}
	}


/*防止在无权限领地破坏方块增加经验
 * @param {player} 玩家
 * @param {block} 数据
 * PS 注意插件必须是iLand-Core */
function isiLandDisabled(pl, block) {
		// 当玩家在领地内破坏方块时，发出一个提示。
		if (Config.Conventional.LandEnable == false) return true;				/*关闭直接跳过false*/
		/*需要插件iLand*/
		let GetLand  =  lxl.import('ILAPI_PosGetLand');							//通过坐标查询领地
		let GetOwner =  lxl.import('ILAPI_IsLandOwner');						//玩家是否是领地主人
		let GetPerm  =  lxl.import('ILAPI_CheckPerm');							//检查领地某权限开启状态
		let GetTrust =  lxl.import('ILAPI_IsPlayerTrusted');					//玩家是否被领地信任
		/* 算法 * @param {pos} 坐标 */
		function RawPos(pos) { return { x: pos.x, y: pos.y, z: pos.z, dimid: pos.dimid } }
		/////////////////////////////
		let land = GetLand(RawPos(block.pos));
		if (land != -1) {
			let xuid    =  String(pl.xuid);										//玩家xuid
			let isOwner =  GetOwner(land, xuid);								//是否主人
			let isTrust =  GetTrust(land, xuid);								//是否被信任
			let isPerm  =  GetPerm(land, "allow_destroy");						//领地权限
			if (isOwner || isTrust || isPerm) {
				return true;													//可以
			} else return false;												//不能
		}
	}


//■■■■■■■■■■■■■■
/*命令注册*/
function LevelCmd() {
	try {
		const cmd = mc.newCommand("level", "LevelExp System Command", PermType.Any);
		cmd.setAlias("lvl");													//别名 = (如:/lvl addlevel <name> <count>)
		cmd.setEnum("PointsAction", ["addpoint",  "delpoint",  "setpoint"]);	//属性点模式
		cmd.setEnum("HealthAction", ["addhealth", "delhealth", "sethealth"]);	//血量模式
		cmd.setEnum("LevelAction",  ["addlevel",  "dellevel",  "setlevel"]);	//等级模式
		cmd.setEnum("ExpAction",    ["addexp",    "delexp",    "setexp"]);		//经验模式
		cmd.setEnum("InfoAction",   ["info",      "remove"]);					//查询某个玩家以及删除玩家
		cmd.setEnum("NaAction",     ["my",        "levelup"]);					//个人等级
		cmd.setEnum("ReAction",     ["reload"]);								//重载以及配置

		cmd.mandatory("action", ParamType.Enum, "HealthAction", 1);
		cmd.mandatory("action", ParamType.Enum, "PointsAction", 1);
		cmd.mandatory("action", ParamType.Enum, "LevelAction", 1);
		cmd.mandatory("action", ParamType.Enum, "ExpAction", 1);
		cmd.mandatory("action", ParamType.Enum, "InfoAction", 1);
		cmd.mandatory("action", ParamType.Enum, "ReAction", 1);
		cmd.mandatory("action", ParamType.Enum, "NaAction", 1);

		cmd.mandatory("name", ParamType.String);								//玩家名
		cmd.optional("count", ParamType.Int);									//数量

		cmd.overload(["HealthAction", "name", "count"]);
		cmd.overload(["PointsAction", "name", "count"]);
		cmd.overload(["LevelAction", "name", "count"]);
		cmd.overload(["ExpAction", "name", "count"]);
		cmd.overload(["InfoAction", "name"]);
		cmd.overload(["ReAction"]);
		cmd.overload(["NaAction"]);
		cmd.overload([]);

		cmd.setCallback(CallBack);
		cmd.setup();
		} catch (e) {
			logger.error(tr('command.load.error1'));
			logger.error(tr('command.load.error2'));
		}
	}


//好像某些原因。有的限制没有限到(ー_ー)!!
function CallBack(_cmd, ori, out, res) {
		logger.debug(JSON.stringify(res.name));
		let plxuid, pl = ori.player;
		let MaxL =  Config.DefaultValue.MaxLevel;
		let MaxP =  Config.DefaultValue.MaxPoints;
		switch (res.action) {

			case "my":															//玩家信息(仅玩家)
				if (!ori.player) return out.error(Gm_Tell + tr('command.play.error'));
				return onPlayForm(ori.player); 									/*自己GUI*/
			break;

			case "levelup":														//进行升级(限玩家)
				if (!ori.player) return out.error(Gm_Tell + tr('command.play.error'));
				let lvl = getLevel(pl.xuid);	//plat = pl.realName;
				if (Config.ValueManner.AutoUP) return out.error(Gm_Tell + tr('command.levelup.true'));
				var Con = getNextLevelExp(lvl) - Number(getExp(pl.xuid));
				if (getExp(pl.xuid) >= getNextLevelExp(lvl)) {
					if (isLevelUp(pl.xuid)) return;								/*执行升级操作*/
				} else pl.tell(Gm_Tell + tr('command.levelup.not.exp', [Con]));
			break;

			case "reload":														//重载配置(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				FileOperation.readFile();										//保存配置
				return out.success(Gm_Tell + tr('command.reload.info'));
			break;

			case "remove":														//删除玩家数据(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (DeleteTable(plxuid));
				mc.getOnlinePlayers().forEach(one => {							//在线
					if (plxuid == one.xuid) { one.kick(tr('command.remove.info')) }});
				return out.success(Gm_Tell + tr('command.remove.play', [res.name]));
			break;

			case "addlevel":													//添加等级(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (addLevel(plxuid, res.count));
				var logs = tr('command.level.add', [res.name, res.count, getLevel(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "dellevel":													//减少等级(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (delLevel(plxuid, res.count));
				var logs = tr('command.level.del', [res.name, res.count, getLevel(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "setlevel":													//设置等级(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (setLevel(plxuid, res.count));
				var logs = tr('command.level.set', [res.name, res.count, getLevel(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "addexp":														//添加经验(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (addExps(plxuid, res.count));
				var logs = tr('command.exp.add', [res.name, res.count, getExp(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "delexp":														//减少经验(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (delExp(plxuid, res.count));
				var logs = tr('command.exp.del', [res.name, res.count, getExp(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "setexp":														//设置经验(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (setExp(plxuid, res.count));
				var logs = tr('command.exp.set', [res.name, res.count, getExp(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "addpoint":													//添加属性点(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (addPoints(plxuid, res.count));
				var logs = tr('command.points.add', [res.name, res.count, getPoints(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "delpoint":													//添加属性点(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (delPoints(plxuid, res.count));
				var logs = tr('command.points.del', [res.name, res.count, getPoints(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "setpoint":													//添加属性点(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (setPoints(plxuid, res.count));
				var logs = tr('command.points.set', [res.name, res.count, getPoints(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "addhealth":													//添加血量(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (addHealth(plxuid, res.count));
				var logs = tr('command.health.set', [res.name, res.count, getHealth(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "delhealth":													//减少血量(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (delHealth(plxuid, res.count));
				var logs = tr('command.health.set', [res.name, res.count, getHealth(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "sethealth":													//设置血量(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				if (res.count == null) return out.error(Gm_Tell + tr('command.enter.quantity'));
				if (setHealth(plxuid, res.count));
				var logs = tr('command.health.set', [res.name, res.count, getHealth(plxuid)]);
				return out.success(Gm_Tell + logs);
			break;

			case "info":														//查询玩家信息(仅后台)
				if (ori.type !== 7) return out.error(Gm_Tell + tr('command.permission.no'));
				if (!res.name) return out.error(Gm_Tell + tr('command.play.input'));
				plxuid = getNameToXuid(res.name);//data.name2xuid(res.name);	/*获取Xuid*/
				if (!plxuid) return out.error(Gm_Tell + tr('command.play.info.no', [res.name]));
				let dat = getPlayData(plxuid);									/*查询玩家数据*/
				let Na = dat.Name, Lv = dat.Level, Ex = dat.Exp, Po = dat.Points, Sp = dat.Luck;
				let He = dat.Health, At = dat.Attack, De = dat.DeFence, Ti = dat.Time;
				let hex = getHeadExp(plxuid), Next = getNextLevelExp(Lv);		/*所需经验*/
				//////////////////////////////
				if (ori.player) {
					let lvl = getLevel(ori.player.xuid), name = ori.player.realName;
					var logs = tr('playlog.info.play', [lvl, name, Na]);
					if (Config.ValueLevel.LogBook) LogBook(pl, logs);
					if (Config.ValueLevel.ConsoleLog) logger.info(logs);		//控制台消息
				}
				let info = "";													/*嘎嘎嘎*/
					info += `${tr('info.text1')} \n`;
					info += `§l | ${tr('info.text2')}: §aLV.${Lv} §f${Na} \n`;
					info += `§l | ${tr('info.text3')}: §f[ §6${Ex} §f/ §e${Next} §f] §f[ §5${hex} §f]\n`;
					info += `§l | ${tr('info.text4')}: §f[ §c${He} §f] \n`;
					info += `§l | ${tr('info.text5')}: §f[ §e${Po} §f] \n`;
					info += `§l | ${tr('info.text6')}: §f[ §d${At} §f] \n`;
					info += `§l | ${tr('info.text7')}: §f[ §3${De} §f] \n`;
					info += `§l | ${tr('info.text8')}: §f[ §4${Sp} §f] \n`;
					info += `§l | ${tr('info.text9')}: §d[ §f${Ti} §d] \n§r`;
					info += `§l-------------------------`;
				return out.success(info);
			break;

			default:															/*默认*/
				if (!ori.player) {
					let ploin = "";
						ploin += "========[ LevelExp Command List ]========\n";
						ploin += "/lvl my 【Open GUI】 "+tr('info.admin1')+"\n";
						ploin += "/lvl levelup 【Upgrade】 "+tr('info.admin1')+"\n";
						ploin += "/lvl reload 【Reload all Config】 "+tr('info.admin2')+"\n";
						ploin += "/lvl remove [name] 【Delete Player Data】 "+tr('info.admin2')+"\n";

						ploin += "/lvl addexp [name] [number] 【Add Experience】 "+tr('info.admin2')+"\n";
						ploin += "/lvl delexp [name] [number] 【Del Experience】 "+tr('info.admin2')+"\n";
						ploin += "/lvl setexp [name] [number] 【Set Experience】 "+tr('info.admin2')+"\n";

						ploin += "/lvl addlevel [name] [number] 【Add Level】 "+tr('info.admin2')+"\n";
						ploin += "/lvl dellevel [name] [number] 【Del Level】 "+tr('info.admin2')+"\n";
						ploin += "/lvl setlevel [name] [number] 【Set Level】 "+tr('info.admin2')+"\n";

						ploin += "/lvl addpoint [name] [number] 【Add Points】 "+tr('info.admin2')+"\n";
						ploin += "/lvl delpoint [name] [number] 【Del Points】 "+tr('info.admin2')+"\n";
						ploin += "/lvl setpoint [name] [number] 【Set Points】 "+tr('info.admin2')+"\n";

						ploin += "/lvl addhealth [name] [number] 【Add Health】 "+tr('info.admin2')+"\n";
						ploin += "/lvl delhealth [name] [number] 【Del Health】 "+tr('info.admin2')+"\n";
						ploin += "/lvl sethealth [name] [number] 【Set Health】 "+tr('info.admin2')+"";
					return out.success(ploin);
				} else {
					if (!ori.player) return out.error(Gm_Tell + tr('command.play.error'));//防止错误
					return onAdminForm(ori.player);								//进入GUI(玩家使用)
				}
				break;
		}
	}


/**出现bug请联系我
* @param {Player} pl 操作玩家
*////GUI设置
function onAdminForm(pl, txt = "") {
		if (pl == null) return;
		if (onPlaySound(pl, "OK"));
		const fm = mc.newSimpleForm();
		let mcc = "", lvl = getLevel(pl.xuid);									/*嘿嘿嘿*/
		fm.setTitle(tr('form.main.menu.title'));
		fm.setContent(tr('form.main.menu.content', [lvl, pl.realName]));
		//////////////////////////////////////////////////////////////
		fm.addButton(tr('form.main.menu.button1', [txt]), 'textures/ui/icon_new_item');
		fm.addButton(tr('form.main.menu.button2'),       'textures/ui/icon_agent');
		fm.addButton(tr('form.main.menu.button3'),       'textures/ui/multiplayer_glyph_color');
		fm.addButton(tr('form.main.menu.button4'),       'textures/ui/settings_glyph_color_2x');
		if (pl.isOP()) {
			fm.addButton(tr('form.main.menu.button5'),   'textures/ui/editIcon');
			fm.addButton(tr('form.main.menu.button6'),   'textures/ui/realmsStoriesIcon');
		}
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
				if (onPlaySound(pl, "OK"));
				switch (dt) {
					case 0:
						if (Config.ValueManner.AutoUP) return onAdminForm(pl, tr('form.main.menu.return.txt'));
						if (getExp(pl.xuid) >= getNextLevelExp(lvl)) {
							if (isLevelUp(pl.xuid)) return;						/*执行升级操作*/
						} else {
							let Con = getNextLevelExp(lvl) - Number(getExp(pl.xuid));
							pl.tell(Gm_Tell + tr('form.main.menu.not.enough', [Con]));
							return onAdminForm(pl, tr('form.main.menu.not.experience'));
						}
					break;														//升级

					case 1: onPlayForm(pl, '§l§d#########################'); break;
					case 2: onPlayTopForm(pl); break;							//排行榜
					case 3: onPlayEditorForm(pl); break;						//特殊功能

					case 4: 
						let players = {}
						for(let i of mc.getOnlinePlayers()) { players[i.realName] = i.xuid }
						LevelForm(pl, players);									//修改玩家
					break;

					/*配置文件*/
					case 5: PlayerSetingForm(pl); break;						//配置文件
				}
		});
	}


//■■■■■■■■■■■■■■
/* @param {Player} pl 玩家
*////玩家个人信息
function onPlayForm(pl, mo="", t1="", t2="", t3="", t4="", t5="", Clients = true) {
		if (pl == null && getLevel(pl.xuid) == null) return;
		let texture = getNextLevelExp(getLevel(pl.xuid));
		if (Clients == false) onPlaySound(pl, "NO"); 
		const fm = mc.newSimpleForm();
		fm.setTitle(tr('form.play.Information.title'));
		let minr = "";
			minr += tr('form.play.Information.cons1', [getLevel(pl.xuid), pl.realName, getHeadExp(pl.xuid)]);
			minr += tr('form.play.Information.cons2', [getExp(pl.xuid), texture]);
			minr += tr('form.play.Information.cons3', [getHealth(pl.xuid), t2]);
			minr += tr('form.play.Information.cons4', [getPoints(pl.xuid), t1]);
			minr += tr('form.play.Information.cons5', [getAttack(pl.xuid), t3]);
			minr += tr('form.play.Information.cons6', [getDeFence(pl.xuid), t4]);
			minr += tr('form.play.Information.cons7', [getLuck(pl.xuid), t5]);
		///////////////////////////////////////////////////////////////////////
		let mh = getHealth(pl.xuid),  maxh = Config.DefaultValue.MaxHealth;
		let ma = getAttack(pl.xuid),  maxa = Config.DefaultValue.MaxAttack;
		let md = getDeFence(pl.xuid), maxd = Config.DefaultValue.MaxDeFence;
		let mv = getLuck(pl.xuid),    maxv = Config.DefaultValue.MaxLuck;
		//t1=属性，   t2=血量，   t3=攻击，   t4=防御,   t5=幸运
		fm.setContent(tr('form.play.Information.content', [minr, mo]));
		fm.addButton(tr('form.play.Information.button1', [mh, maxh]), "textures/ui/color_plus");
		fm.addButton(tr('form.play.Information.button2', [ma, maxa]), "textures/ui/color_plus");
		fm.addButton(tr('form.play.Information.button3', [md, maxd]), "textures/ui/color_plus");
		fm.addButton(tr('form.play.Information.button4', [mv, maxv]), "textures/ui/color_plus");
		///////////////////////////////////////////////////////////
		fm.addButton(tr('confirm.info'), 'textures/ui/icon_import');
		///////////////////////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
				let a = "   §f》》》   §c-1", b = "   §f》》》   §6+1", mc = "";
				switch (dt) {
					case 0: 
						if (getPoints(pl.xuid) >= 1) { 							//属性点必须大于等于0
							let maxh = Config.DefaultValue.MaxHealth;
							if (getHealth(pl.xuid) >= maxh) {
								return onPlayForm(pl, tr('form.play.upper.limit'), mc, mc, mc, mc, mc, false);
							}
							if (delPoints(pl.xuid, 1));							//减属性
							if (addHealth(pl.xuid, 1));							//加血量
							if (onPlaySound(pl, "YES"));
							onPlayForm(pl, tr('form.play.add.health'), a, b);
						} else {
							if (onPlaySound(pl, "NO"));
							onPlayForm(pl, tr('form.play.attributes'));
						}
					break; //加血量

					case 1: 
						if (getPoints(pl.xuid) >= 1) {							//属性点必须大于等于0
							let maxa = Config.DefaultValue.MaxAttack;
							if (getAttack(pl.xuid) >= maxa) {
								return onPlayForm(pl, tr('form.play.upper.limit'), mc, mc, mc, mc, mc, false);
							}
							if (delPoints(pl.xuid, 1));							//减属性
							if (addAttack(pl.xuid, 1));							//加攻击
							if (onPlaySound(pl, "YES"));
							onPlayForm(pl, tr('form.play.add.attack'), a, mc, b, mc);
						} else {
							if (onPlaySound(pl, "NO"));
							onPlayForm(pl, tr('form.play.attributes'));
						}
					break;														//加攻击

					case 2: 
						if (getPoints(pl.xuid) >= 1) {							//属性点必须大于等于1
							let maxd = Config.DefaultValue.MaxDeFence;
							if (getDeFence(pl.xuid) >= maxd) {
								return onPlayForm(pl, tr('form.play.upper.limit'), mc, mc, mc, mc, mc, false);
							}
							if (delPoints(pl.xuid, 1));							//减属性
							if (addDeFence(pl.xuid, 1));						//加防御
							if (onPlaySound(pl, "YES"));
							onPlayForm(pl, tr('form.play.add.defence'), a, mc, mc, b);
						} else {
							if (onPlaySound(pl, "NO"));
							onPlayForm(pl, tr('form.play.attributes'));
						}
					break; //加防御

					case 3: 
						if (getPoints(pl.xuid) >= 1) {							//属性点必须大于等于1
							let maxd = Config.DefaultValue.MaxLuck;
							if (getLuck(pl.xuid) >= maxd) {
								return onPlayForm(pl, tr('form.play.upper.limit'), mc, mc, mc, mc, mc, false);
							}
							if (delPoints(pl.xuid, 1));							//减属性
							if (addLuck(pl.xuid, 1));							//加幸运
							if (onPlaySound(pl, "YES"));
							onPlayForm(pl, tr('form.play.add.luck'), a, mc, mc, mc, b);
						} else {
							if (onPlaySound(pl, "NO"));
							onPlayForm(pl, tr('form.play.attributes'));
						}
					break; //加幸运

					case 4: onAdminForm(pl); break;								//返回
				}
		});
	}


/** 更多功能
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function onPlayEditorForm(pl) {
		if (pl == null) return;
		if (onPlaySound(pl, "OK"));
		const fm = mc.newSimpleForm();
		fm.setTitle(tr('form.more.function.title'));
		fm.setContent(tr('form.more.function.content'));
		////////////////////////////////////////////////
		fm.addButton(tr('form.more.function.button1'), 'textures/ui/dust_selectable_3');
		fm.addButton(tr('form.more.function.button2'), 'textures/ui/brewing_fuel_pipes_pocket');
		fm.addButton(tr('form.more.function.button3'), 'textures/ui/recap_glyph_desaturated');
		fm.addButton(tr('form.more.function.button4'), 'textures/ui/icon_trash');
		fm.addButton(tr('form.more.function.confirm'), 'textures/ui/icon_import');
		fm.addButton(tr('form.more.function.close'),   'textures/ui/cancel');
		/////////////////////////////
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			switch (id) {
				case 0: 
					let players = {}
					for(let i of mc.getOnlinePlayers()) { 
					if (i.xuid != pl.xuid){ players[i.realName] = i.xuid } }
					if (onPlaySound(pl, "OK"));
					onGivePlayExp(pl, players, "§l§a在线", "", "");				//在线
					break;
				case 1: onQueryInformation(pl); break;
				case 2: ResetAttributes(pl); break;
				case 3: DeleteAccount(pl); break;
				case 4: onAdminForm(pl); break;
				case 5: /*空白*/ break;
			}
		});
	}


/** 赠送经验
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function onGivePlayExp(pl, players, txt1, txt2, txt3) {
		if (pl == null && players == null) return;
		let pllist = Object.keys(players);
		let fm = mc.newCustomForm();
		fm.setTitle(tr('form.transfer.title'));
		/////////////////////////////////////////////
		fm.addSwitch(tr('select.return.input'), true);							//0
		/////////////////////////////////////////////
		let Tests = getNextLevelExp(getLevel(pl.xuid));
		fm.addLabel(tr('form.transfer.label', [getExp(pl.xuid), Tests]));		//1
		fm.addDropdown(tr('form.transfer.dropdown', [txt1]), pllist);			//2
		/////////////////////////////////////////////
		fm.addInput(tr('form.transfer.offline', [txt2]), "offline");			//3
		fm.addInput(tr('form.transfer.input', [txt3]), "input", '10');			//4
		/////////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);							//5
		/////////////////////////////.replace(/[^\d]/g, '')
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			let topl = players[pllist[dt[2]]];
			let coin = parseInt(dt[4]), play = players;
			if(dt[5] == false) return onPlayEditorForm(pl);
			if(dt[0] == false) {												//离线
				if(dt[3] == null || dt[3] == "") {
					let lon = tr('form.transfer.input.offline');
					return onGivePlayExp(pl, players, txt1, lon, txt3)
				}
				let office = {}
				let skong = getDataAll();	//data.getAllPlayerInfo()			//本地对象
				for (let i of skong) if(i.Name.toUpperCase().includes(dt[3].toUpperCase())){ 
				office[i.Name] = i.Xuid }
				return onGivePlayExp(pl, office, "§l§e离线", "", "");
			}
			if(topl == null) {													//找不到
				if (onPlaySound(pl, "NO"));
				return onGivePlayExp(pl, players, txt1, tr('form.transfer.obtain.error'), "");
			}
			if(getExp(pl.xuid) < coin) {										//经验和自己的经验不对
				if (onPlaySound(pl, "NO"));
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.lack.experience'));
			}
			if(!(coin > 0) || Math.sign(coin) === -1 || dt[4] == "") {			//阿拉伯数字不对
				if (onPlaySound(pl, "NO"));
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.overtake.zero'));
			}
			if (!topl) { if (onPlaySound(pl, "NO"));							//不存在
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.play.error'));
			}
			if(pl.xuid == topl) {												//是自己
				if (onPlaySound(pl, "NO"));
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.not.give.yu'));
			}
			if (!delExp(pl.xuid, coin)) {										//减少转账者经验
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.error1'));
			}
			if (!addExps(topl, coin)) {											//添加对方经验
				//if (addExps(pl.xuid, coin));									//错误退经验
				return onGivePlayExp(pl, players, txt1, "", tr('form.transfer.error2'));
			}
			if (onPlaySound(pl, "YES"));
			let nuns = getXuidToName(topl) == null ? getXuidToName(topl) : getXuidToName(topl);
			pl.tell(Gm_Tell + tr('form.transfer.success.notice', [nuns, coin]));
			topl = mc.getPlayer(topl);											//玩家对象topl.realName
			if(topl != null) topl.tell(Gm_Tell + tr('form.transfer.topl.notice', [pl.realName, coin]));
		});
	}


/** 查询玩家信息
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function onQueryInformation(pl) {
		if (pl == null) return;
		if (onPlaySound(pl, "OK"));
		const fort = Format.Bold + Format.White;
		let kong = getDataAll();	/* data.getAllPlayerInfo() */				//获取全部数据
		const Money = Config.DefaultValue.ImfoConsume;
		const fm = mc.newSimpleForm();
		fm.setTitle(tr("form.gueryinfo.title"));
		fm.setContent(tr('form.site.select.label'));
		fm.addButton(tr('form.gueryinfo.confirm'), 'textures/ui/icon_import');
		for (let i of kong) fm.addButton(fort + i.Name + "\n§l§e$"+Money, 'textures/ui/Friend2');
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			if (id == 0) return onPlayEditorForm(pl);
			if (money.get(pl.xuid) >= Money) {
				money.reduce(pl.xuid, Number(Money));
				//pl.tell(Gm_Tell + "§a查询 §f"+kong[id-1].Name+" §b消耗§e "+Money+" §b金币!");
				let lvl = getLevel(pl.xuid), name = pl.realName;
				var logs = tr('playlog.info.play', [lvl, name, kong[id-1].Name]);
				if (Config.ValueLevel.LogBook) LogBook(pl, logs);
				if (Config.ValueLevel.ConsoleLog) logger.info(logs);			//控制台消息
				if (onPlaySound(pl, "OK"));
				return getPlayQuery(pl, kong[id-1].Name);
			} else {
				if (onPlaySound(pl, "NO"));
				setTimeout(() => { onQueryInformation(pl) }, 666);				//延迟
				return pl.tell(Gm_Tell + tr('form.gueryinfo.reducmy'));
			}
		});
	}


/** 玩家信息
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function getPlayQuery(pl, key) {
		if (pl == null) return;
		const fm = mc.newSimpleForm();
		fm.setTitle("§l§f====== [ §ePLAYER INFO §f] ======");
		let xuid = getNameToXuid(key);											//根据玩家名查询Xuid
		let dat = getPlayData(xuid);											//获取玩家数据
		if (!dat) return onQueryInformation(pl);								//错误并且返回
		let Na = dat.Name, Lv = dat.Level, Ex = dat.Exp, Po = dat.Points, Sp = dat.Luck;
		let He = dat.Health, At = dat.Attack, De = dat.DeFence, Ti = dat.Time;
		let hex = getHeadExp(dat.Xuid), Next = getNextLevelExp(Lv);				/*所需经验*/
		let info = "";															/*嘎嘎嘎*/
			info += `${tr('info.text1')} \n`;
			info += `§l | ${tr('info.text2')}: §aLV.${Lv} §f${Na} \n`;
			info += `§l | ${tr('info.text3')}: §f[ §6${Ex} §f/ §e${Next} §f] §f[ §5${hex} §f]\n`;
			info += `§l | ${tr('info.text4')}: §f[ §c${He} §f] \n`;
			info += `§l | ${tr('info.text5')}: §f[ §e${Po} §f] \n`;
			info += `§l | ${tr('info.text6')}: §f[ §d${At} §f] \n`;
			info += `§l | ${tr('info.text7')}: §f[ §3${De} §f] \n`;
			info += `§l | ${tr('info.text8')}: §f[ §4${Sp} §f] \n`;
			info += `§l | ${tr('info.text9')}: §d[ §f${Ti} §d] \n§r`;
			info += `§l-----------------------`;
		fm.setContent(info);													//info
		fm.addButton(tr('confirm.info'), 'textures/ui/icon_import');
		fm.addButton(tr('close.info'), 'textures/ui/cancel');
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			if (id == 0) return onQueryInformation(pl);
		});
	}


/** 重置属性
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function ResetAttributes(pl) {
		if (pl == null) return;
		if (Config.ValueLevel.isResetting == false) {
			setTimeout(() => { onPlayEditorForm(pl) }, 666);					//延迟
			return pl.tell(Gm_Tell + tr('form.reset.switch'));
		}
		if (onPlaySound(pl, "OK"));
		const fm = mc.newSimpleForm();
		fm.setTitle(tr('form.reset.title'));
		fm.setContent(tr('form.reset.content'));
		const Coin = Config.DefaultValue.ResetTing;
		////////////////////////////////////////////////////////////////////
		let a = Coin * (getHealth(pl.xuid) - 20), aaa = a == 0 ? "FREE" : a;
		let b = Coin * (getAttack(pl.xuid) - 1),  bbb = b == 0 ? "FREE" : b;
		let c = Coin * (getDeFence(pl.xuid) - 1), ccc = c == 0 ? "FREE" : c;
		let d = Coin * (getLuck(pl.xuid) - 1),    ddd = d == 0 ? "FREE" : d;
		////////////////////////////////////////////////////////////////////
		fm.addButton(tr('form.reset.button1', [aaa]), 'textures/ui/glyph_addon_pack');
		fm.addButton(tr('form.reset.button2', [bbb]), 'textures/ui/glyph_addon_pack');
		fm.addButton(tr('form.reset.button3', [ccc]), 'textures/ui/glyph_addon_pack');
		fm.addButton(tr('form.reset.button4', [ddd]), 'textures/ui/glyph_addon_pack');
		fm.addButton(tr('form.reset.confirm1'), 'textures/ui/icon_import');
		fm.addButton(tr('form.reset.close'), 'textures/ui/cancel');
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			let mc = "";
			switch (id) {
				case 0: 
				if (aaa == "FREE") {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					return pl.tell(Gm_Tell + tr('form.reset.attribute'));
				}
				if (money.get(pl.xuid) <= aaa) {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					if (onPlaySound(pl, "NO"));
					return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
				}
				pl.sendModalForm(tr('form.reset.title'), tr('form.reset.play.content1'), tr('form.reset.confirm2'), tr('form.reset.close'), (pl, res) => { 
					if(res){ 
						if (money.reduce(pl.xuid, aaa)) {
							if (onPlaySound(pl, "OK"));
							let hea = getHealth(pl.xuid);
							const coin = Number(hea) - 20;						//计算
							if (addPoints(pl.xuid, coin));						//添加属性点
							if (setHealth(pl.xuid, 20));						//血量
							return pl.tell(Gm_Tell + tr('form.reset.pay.yes1', [aaa]));
						} else {
							setTimeout(() => { ResetAttributes(pl) }, 666);		//延迟
							return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
						}
					}
				});
				break;

				case 1: 
				if (bbb == "FREE") {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					return pl.tell(Gm_Tell + tr('form.reset.attribute'));
				}
				if (money.get(pl.xuid) <= bbb) {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					if (onPlaySound(pl, "NO"));
					return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
				}
				pl.sendModalForm(tr('form.reset.title'), tr('form.reset.play.content2'), tr('form.reset.confirm2'), tr('form.reset.close'), (pl, res) => { 
					if(res){ 
						if (money.reduce(pl.xuid, bbb)) {
							if (onPlaySound(pl, "OK"));
							let att = getAttack(pl.xuid);
							const coin = Number(att) - 1;						//计算
							if (addPoints(pl.xuid, coin));						//添加属性点
							if (setAttack(pl.xuid, 1));							//攻击
							return pl.tell(Gm_Tell + tr('form.reset.pay.yes2', [bbb]));
						} else {
							setTimeout(() => { ResetAttributes(pl) }, 666);		//延迟
							if (onPlaySound(pl, "NO"));
							return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
						}
					}
				});
				break;

				case 2: 
				if (ccc == "FREE") {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					return pl.tell(Gm_Tell + tr('form.reset.attribute'));
				}
				if (money.get(pl.xuid) <= ccc) {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					if (onPlaySound(pl, "NO"));
					return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
				}
				pl.sendModalForm(tr('form.reset.title'), tr('form.reset.play.content3'), tr('form.reset.confirm2'), tr('form.reset.close'), (pl, res) => { 
					if(res){
						if (money.reduce(pl.xuid, ccc)) {
							if (onPlaySound(pl, "OK"));
							let def = getDeFence(pl.xuid);
							const coin = Number(def) - 1;						//计算
							if (addPoints(pl.xuid, coin));						//添加属性点
							if (setDeFence(pl.xuid, 1));						//防御
							return pl.tell(Gm_Tell + tr('form.reset.pay.yes3', [ccc]));
						} else {
							setTimeout(() => { ResetAttributes(pl) }, 666);		//延迟
							if (onPlaySound(pl, "NO"));
							return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
						}
					}
				});
				break;

				case 3: 
				if (ddd == "FREE") {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					return pl.tell(Gm_Tell + tr('form.reset.attribute'));
				}
				if (money.get(pl.xuid) <= ddd) {
					setTimeout(() => { ResetAttributes(pl) }, 666);				//延迟
					if (onPlaySound(pl, "NO"));
					return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
				}
				pl.sendModalForm(tr('form.reset.title'), tr('form.reset.play.content4'), tr('form.reset.confirm2'), tr('form.reset.close'), (pl, res) => { 
					if(res){
						if (money.reduce(pl.xuid, ddd)) {
							if (onPlaySound(pl, "OK"));
							let def = getLuck(pl.xuid);
							const coin = Number(def) - 1;						//计算
							if (addPoints(pl.xuid, coin));						//添加属性点
							if (setLuck(pl.xuid, 1));							//幸运
							return pl.tell(Gm_Tell + tr('form.reset.pay.yes4', [ddd]));
						} else {
							setTimeout(() => { ResetAttributes(pl) }, 666);		//延迟
							if (onPlaySound(pl, "NO"));
							return pl.tell(Gm_Tell + tr('form.reset.not.enough'));
						}
					}
				});
				break;

				case 4: onPlayEditorForm(pl); break;
				case 5: /*空白*/ break;
			}
		});
	}


/** 删号重练
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function DeleteAccount(pl, txt = "") {
		if (pl == null) return;
		if (Config.ValueLevel.isDeletion == false) {
			setTimeout(() => { onPlayEditorForm(pl) }, 666);					//延迟
			return pl.tell(Gm_Tell + tr('form.delete.code.switch'));
		}
		if (onPlaySound(pl, "OK")); let Code = randID();
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.delete.code.title'));
		/////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		/////////////////////////////////////////
		fm.addLabel(tr('form.delete.code.prompt', [getLevel(pl.xuid), pl.realName, Code]));
		fm.addInput(tr('form.delete.code.input', [txt]), "Code");
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			if(dt[0] == false) return onPlayEditorForm(pl);						/*返回*/
			if(dt[2] !== Code || dt[2] == null || dt[2] == "") {
				if (onPlaySound(pl, "NO"));
				setTimeout(() => { DeleteAccount(pl, tr('form.delete.code.error')) }, 666);
				return false;
			}
			if(dt[2] == Code){
				let str = tr('form.delete.play.content');
				if (onPlaySound(pl, "OK"));
				pl.sendModalForm(tr('clue.text'), str, tr('confirm.once'), tr('close.info'), (pl, res) => { 
				if(res){
					pl.kick(tr('form.delete.play.kick')); 
					DeleteTable(pl.xuid);
				}});
			}
		});
	}


/** 等级排行榜
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function onPlayTopForm(pl) {
		if (pl == null) return;
		let List = getDataAll(), str = "", lvl = "", head = "";
		let aaa = tr('form.levellist.title');									//标题
		let bbb = tr('form.levellist.confirm');									//确认
		let ccc = tr('form.levellist.close');									//取消
		List.sort((a, b) => getLevel(b.Xuid) - getLevel(a.Xuid));
		List.forEach((key, i) => str += `§l  §dTOP.${i+1}§b  ◆  §aLV.${getLevel(key.Xuid)}  §f${key.Name}  §e${getHeadExp(key.Xuid)}\n`);
		pl.sendModalForm(aaa, str, bbb, ccc, (pl, res) => { 
			if(res){ onAdminForm(pl); }
		});
	}


/*玩家列表*/
function LevelForm(pl, players, txt = "") {
		if (players == null) return;
		if (!pl.isOP()) return pl.tell(Gm_Tell + tr('permission.info'));
		if (onPlaySound(pl, "OK"));
		let pllist = Object.keys(players);
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.office.edit.title'));
		fm.addLabel(tr('form.site.select.label'));
		//////////////////////////////////////////
		fm.addSwitch(tr('select.return.input'), true);
		//////////////////////////////////////////
		fm.addDropdown(tr('form.office.edit.online'), pllist);
		fm.addInput(tr('form.office.edit.play1', [txt]), "PLAYER");
		//////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		//////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			if(dt[4] == false) return onAdminForm(pl);							//返回
			if(dt[1] == true){													//模式
				let topl = players[pllist[dt[2]]];
				if(topl == null){
					for(let i of mc.getOnlinePlayers()) { players[i.realName] = i.xuid }
					if (onPlaySound(pl, "NO"));
					return LevelForm(pl, players, tr('form.office.edit.wren'));
				}
				if (onPlaySound(pl, "OK"));
				PlayEditForm(pl, topl);
			}else{
				if(dt[3] == "") {
					if (onPlaySound(pl, "NO"));
					return LevelForm(pl, players, tr('form.office.edit.play2'));
				}
				let office = {}
				let kong = getDataAll();	//data.getAllPlayerInfo()
				for (let i of kong) if(i.Name.toUpperCase().includes(dt[3].toUpperCase())){ 
				office[i.Name] = i.Xuid }
				if (onPlaySound(pl, "OK"));
				SiteForm(pl, office, "");
			}
		});
	}


/*选择玩家*/
function SiteForm(pl, office, txt = "") {
		if (pl == null) return;
		if (office == null) return;
		let pllist = Object.keys(office)
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.site.select.title'));
		fm.addLabel(tr('form.site.select.label'));
		fm.addDropdown(tr('form.site.select.play', [txt]), pllist);
		//////////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		//////////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			if(dt[2] == false){													//模式
				let players = {}
				for(let i of mc.getOnlinePlayers()) { players[i.realName] = i.xuid }
				LevelForm(pl, players, ""); 
			}else{
				let topl = office[pllist[dt[1]]];
				if(topl == null){
					if (onPlaySound(pl, "NO")) 
					return SiteForm(pl, office, tr('form.site.wren.play'));
				}
				PlayEditForm(pl, topl);
			}
		});
	}


/*选择修改模式*/
function PlayEditForm(pl, topl) {
		if (pl == null) return;
		if (onPlaySound(pl, "OK")); let players = {}
		for(let i of mc.getOnlinePlayers()) { players[i.realName] = i.xuid }
		const fm = mc.newSimpleForm();
		fm.setTitle(tr('form.edit.select.title'));
		fm.setContent(tr('form.edit.select.content', [getXuidToName(topl)]));
		fm.addButton(tr('form.edit.select.button1'), 'textures/ui/editIcon');
		fm.addButton(tr('form.edit.select.button2'), 'textures/ui/editIcon');
		fm.addButton(tr('form.edit.select.confirm'), 'textures/ui/icon_import');
		////////////////////////////////////////
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			if (onPlaySound(pl, "OK"));
			switch (id) {
				case 0: SetPlayerForm(pl, topl);   break;
				case 1: SetPlayEditForm(pl, topl); break;
				case 2: LevelForm(pl, players);    break;
			}
		});
	}


/*修改玩家全部定义属性*/
function SetPlayEditForm(pl, topl) {
		if (pl == null && topl == null) return;
		if (!pl.isOP()) return pl.tell(Gm_Tell + tr('permission.info'));
		if (onPlaySound(pl, "OK"));
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.edit.play.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		const texture = getNextLevelExp(getLevel(topl));
		const wewe = tr('form.edit.wewe.info', [getXuidToName(topl)]);
		const aaa = tr('form.edit.numer.info', [getLevel(topl)]);
		const bbb = tr('form.edit.numer.exp',  [getExp(topl), texture]);
		const ccc = tr('form.edit.numer.info', [getPoints(topl)]);
		const ddd = tr('form.edit.numer.info', [getHealth(topl)]);
		const eee = tr('form.edit.numer.info', [getAttack(topl)]);
		const fff = tr('form.edit.numer.info', [getDeFence(topl)]);
		const ggg = tr('form.edit.numer.info', [getLuck(topl)]);
		////////////////////////////////////////
		fm.addLabel(tr('form.edit.mine1', [wewe]));								//1
		fm.addInput(tr('form.edit.mine2', [aaa]),	`${getLevel(topl)}`);		//2
		fm.addInput(tr('form.edit.mine3', [bbb]),	`${getExp(topl)}`);			//3
		fm.addInput(tr('form.edit.mine4', [ccc]),	`${getPoints(topl)}`);		//4
		fm.addInput(tr('form.edit.mine5', [ddd]),	`${getHealth(topl)}`);		//5
		fm.addInput(tr('form.edit.mine6', [eee]),	`${getAttack(topl)}`);		//6
		fm.addInput(tr('form.edit.mine7', [fff]),	`${getDeFence(topl)}`);		//7
		fm.addInput(tr('form.edit.mine8', [ggg]),	`${getLuck(topl)}`);		//8
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			if(dt[0] == false) return PlayEditForm(pl, topl)					/*返回*/
			if(dt[2] == null && dt[3] == null && dt[4] == null && dt[5] == null && dt[6] == null && dt[7] == null) return;
			if (onPlaySound(pl, "YES"));
			const aa = Number(dt[2]) <= 0 ? getLevel(topl)   : Number(dt[2]);
			const bb = Number(dt[3]) <= 0 ? getExp(topl)     : Number(dt[3]);
			const cc = Number(dt[4]) <= 0 ? getPoints(topl)  : Number(dt[4]);
			const dd = Number(dt[5]) <= 0 ? getHealth(topl)  : Number(dt[5]);	//防止修改成为0//无限死亡
			const ee = Number(dt[6]) <= 0 ? getAttack(topl)  : Number(dt[6]);
			const ff = Number(dt[7]) <= 0 ? getDeFence(topl) : Number(dt[7]);
			const gg = Number(dt[8]) <= 0 ? getLuck(topl)    : Number(dt[8]);
			let data = [ aa, bb, cc, dd, ee, ff, gg, ];
			if (onUpdate(topl, data)) pl.tell(Gm_Tell + tr('form.edit.updata.uuid', [getXuidToName(topl)]));
			const logs = tr('form.edit.data.points', [getXuidToName(topl), data.toString()]);
			pl.sendModalForm(tr('clue.text'), logs, tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); SetPlayEditForm(pl, topl) }
			});
			if (Config.ValueLevel.ConsoleLog) logger.info(logs);				//控制台信息
		});
	}


/*修改某玩家属性*/
function SetPlayerForm(pl, topl, txt = "", Clients = true) {
		if (pl == null && topl == null) return;
		if (!pl.isOP()) return pl.tell(Gm_Tell + tr('permission.info'));
		if (Clients == false) { if (onPlaySound(pl, "NO")); }
		const fm = mc.newCustomForm();
		const texture = getNextLevelExp(getLevel(topl));
		fm.setTitle(tr('form.set.player.title'));
		let mode1 = ["LEVEL", "EXP", "POINTS", "HEALTH", "TAAACK", "DEFENCE", "LUCK"];
		let mode2 = [tr('info.textadd'), tr('info.textdel'), tr('info.textset')];
		let tan = "";
			tan += tr('form.set.player.level',   [getLevel(topl),  getXuidToName(topl)]);
			tan += tr('form.set.player.exp',     [getExp(topl),    texture, getHeadExp(topl)]);
			tan += tr('form.set.player.health',  [getHealth(topl)]);
			tan += tr('form.set.player.points',  [getPoints(topl)]);
			tan += tr('form.set.player.attack',  [getAttack(topl)]);
			tan += tr('form.set.player.defence', [getDeFence(topl)]);
			tan += tr('form.set.player.luck',    [getLuck(topl)]);
		/////////////////////////////////////////////
		fm.addLabel(tr('form.set.player.warn', [tan]));
		fm.addDropdown(tr('form.set.player.attribute'), mode1, 0);				//1
		fm.addDropdown(tr('form.set.player.mode'), mode2, 0);					//2
		fm.addInput(tr('form.set.player.number', [txt]), "input");				//3
		/////////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);							//4
		/////////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return;
			if(dt[4] == false) return PlayEditForm(pl, topl);					/*返回*/
			if (dt[3] == null) return SetPlayerForm(pl, topl, tr('form.set.number.no.error'), false);
			if (dt[3] <= 0) return SetPlayerForm(pl, topl, tr('form.set.number.min.error'), false);
			if (onPlaySound(pl, "YES"));
			if(dt[1] == 0){														//属性//等级
				if(dt[2] == 0){
					addLevel(topl, Number(dt[3]));								//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delLevel(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setLevel(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 1){														//经验
				if(dt[2] == 0){
					addExps(topl, Number(dt[3]));								//添加//注意:这里只是加经验，不会升级的(ー_ー)!!
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delExp(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setExp(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 2){														//属性点
				if(dt[2] == 0){
					addPoints(topl, Number(dt[3]));								//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delPoints(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setPoints(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 3){														//血量
				if(dt[2] == 0){
					addHealth(topl, Number(dt[3]));								//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delHealth(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setHealth(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 4){														//攻击
				if(dt[2] == 0){
					addAttack(topl, Number(dt[3]));								//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delAttack(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setAttack(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 5){														//防御
				if(dt[2] == 0){
					addDeFence(topl, Number(dt[3]));							//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delDeFence(topl, Number(dt[3]));							//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setDeFence(topl, Number(dt[3]));							//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}

			if(dt[1] == 6){														//幸运
				if(dt[2] == 0){
					addLuck(topl, Number(dt[3]));								//添加
					SetPlayerForm(pl, topl, tr('form.set.number.add')); }
				if(dt[2] == 1){
					delLuck(topl, Number(dt[3]));								//减少
					SetPlayerForm(pl, topl, tr('form.set.number.del')); }
				if(dt[2] == 2){
					setLuck(topl, Number(dt[3]));								//设置
					SetPlayerForm(pl, topl, tr('form.set.number.set')); }
			return
			}
		});
	}


/*配置文件*/
function PlayerSetingForm(pl) {
		if (pl == null) return;
		if (!pl.isOP()) return pl.tell(Gm_Tell + tr('permission.info'));
		if (onPlaySound(pl, "OK"));
		const fm = mc.newSimpleForm();
		fm.setTitle(tr('form.configuration.title'));
		fm.setContent(tr('form.configuration.content', [pl.realName]));
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_0'), 'textures/ui/Wrenches1');	//0
		fm.addButton(tr('form.configuration.info_1'), "textures/ui/Wrenches1");	//1
		fm.addButton(tr('form.configuration.info_2'), "textures/ui/Wrenches1");	//2
		fm.addButton(tr('form.configuration.info_3'), "textures/ui/Wrenches1");	//3
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_4'), "textures/ui/Wrenches1");	//4
		fm.addButton(tr('form.configuration.info_5'), "textures/ui/Wrenches1");	//5
		fm.addButton(tr('form.configuration.info_6'), "textures/ui/Wrenches1");	//6
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_7'), "textures/ui/Wrenches1");	//7
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_8'), "textures/ui/Wrenches1");	//8
		fm.addButton(tr('form.configuration.info_9'), "textures/ui/Wrenches1");	//9
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_10'), "textures/ui/Wrenches1");//10
		fm.addButton(tr('form.configuration.info_11'), "textures/ui/Wrenches1");//11
		////////////////////////////////////////
		fm.addButton(tr('form.configuration.info_12'), "textures/ui/Wrenches1");//12
		fm.addButton(tr('form.configuration.info_13'), "textures/ui/Wrenches1");//13
		fm.addButton(tr('form.configuration.info_14'), "textures/ui/Wrenches1");//14
		////////////////////////////////////////
		fm.addButton(tr('confirm.info'), 'textures/ui/icon_import');			//15
		////////////////////////////////////////
		pl.sendForm(fm, (pl, id) => {
			if (id == null) return;
			if (onPlaySound(pl, "OK"));
			if (id == 0) return MaddieForm(pl);
			if (id == 1) return AForm(pl, true);
			if (id == 2) return BForm(pl, true);
			if (id == 3) return CForm(pl, true);
			if (id == 4) return DForm(pl, true);
			if (id == 5) return EForm(pl, true);
			if (id == 6) return FForm(pl, true);
			if (id == 7) return GForm(pl, true);
			///////////////////////////////////
			if (id == 8) return G1Form(pl, true);
			if (id == 9) return G2Form(pl, true);
			///////////////////////////////////
			if (id == 10) return HForm(pl, true);
			if (id == 11) return IForm(pl, true);
			if (id == 12) return JForm(pl, true);
			if (id == 13) return KForm(pl, true);
			if (id == 14) return LForm(pl, true);
			if (id == 15) return onAdminForm(pl);
		});
	}


//经验获取方式
function MaddieForm(pl, Clients = true) {
		const Manner = [ "递增", "固定" ];
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.levelexp.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addLabel("§l++++++++++++++++++++++");
		fm.addDropdown(tr('form.levelexp.mymode',  [Config.ValueManner.UPManner]), Manner);
		fm.addInput(tr('form.levelexp.limit.exp'), '500', `${Config.ValueManner.MaxExp}`);
		fm.addSwitch(tr('form.levelexp.autoup'),   Config.ValueManner.AutoUP);
		fm.addSwitch(tr('form.levelexp.not.zero'), Config.ValueManner.UPLvZero);

		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"UPManner":		Manner[dt[2]],									//玩家玩家升级方式 [ 固定 | 递增 ]
				"MaxExp":		Number(dt[3]), 									//每个等级经验获取 ( 2 * MaxExp ) = 1000 
				"AutoUP":		Boolean(dt[4]).valueOf(),						//是否自动升级开关《如:/lvl levelup》*/
				"UPLvZero":		Boolean(dt[5]).valueOf(),						//每次升级是否清除经验归零
			}
			Conf.set("ValueManner", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//默认配置
function AForm(pl, Clients = true, tell = "§l§f[§d系统§f] §a") {
		let lang1 = File.getFilesList(`.\\plugins\\${PLUGIN_Name}\\Lang`);
		let fl = lang1.filter(ma => ma.endsWith('.json')), lang = [];
		for (let i = 0; i < fl.length; i++) { let na = fl[i].replace(/.json/g, ""); lang.push(na); }
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.foundation.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addDropdown(tr('form.foundation.lands', [Config.Language]), lang);
		fm.addInput(tr('form.foundation.gm_tell'), tell, `${Config.Gm_Tell}`);
		fm.addSwitch(tr('form.foundation.logbook'),		Config.ValueLevel.LogBook);
		fm.addSwitch(tr('form.foundation.consolelog'),	Config.ValueLevel.ConsoleLog);
		fm.addSwitch(tr('form.foundation.resetting'),	Config.ValueLevel.isResetting);
		fm.addSwitch(tr('form.foundation.deletion'),	Config.ValueLevel.isDeletion);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"LogBook":		Boolean(dt[3]).valueOf(),
				"ConsoleLog":	Boolean(dt[4]).valueOf(),						//控制台消息Message.
				"isResetting":	Boolean(dt[5]).valueOf(),						//是否允许玩家重置属性
				"isDeletion":	Boolean(dt[6]).valueOf(),						//是否允许玩家删除账号
			}
			Conf.set("Language",   lang[dt[1]]);
			Conf.set("Gm_Tell",    dt[2]);
			Conf.set("ValueLevel", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) } 
			});
		});
	}


//上限
function BForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.value.limit.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		const aaa = Config.DefaultValue.MinLevel;
		const bbb = Config.DefaultValue.MaxLevel;
		const ddd = Config.DefaultValue.MaxHealth;
		const eee = Config.DefaultValue.MaxAttack;
		const fff = Config.DefaultValue.MaxDeFence;
		const jjj = Config.DefaultValue.MaxLuck;
		const ggg = Config.DefaultValue.MaxPoints;
		const hhh = Config.DefaultValue.ResetTing;
		const xxx = Config.DefaultValue.ImfoConsume;
		////////////////////////////////////////
		fm.addInput(tr('form.value.limit.minlevel'),	'1',		`${aaa}`);
		fm.addInput(tr('form.value.limit.maxlevel'),	'100',		`${bbb}`);
		fm.addInput(tr('form.value.limit.health'),		'60',		`${ddd}`);
		fm.addInput(tr('form.value.limit.attack'),		'100',		`${eee}`);
		fm.addInput(tr('form.value.limit.defence'),		'100',		`${fff}`);
		fm.addInput(tr('form.value.limit.luck'),		'20',		`${jjj}`);
		fm.addInput(tr('form.value.limit.points'),		'20000',	`${ggg}`);
		fm.addInput(tr('form.value.resetting'),			'1000',		`${hhh}`);
		fm.addInput(tr('form.value.infoconsue'),		'200',		`${xxx}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"MinLevel":		Number(dt[1]), 
				"MaxLevel":		Number(dt[2]), 
				"MaxHealth":	Number(dt[3]), 
				"MaxAttack":	Number(dt[4]), 
				"MaxDeFence":	Number(dt[5]), 
				"MaxLuck":		Number(dt[6]), 
				"MaxPoints":	Number(dt[7]), 
				"ResetTing":	Number(dt[8]), 
				"ImfoConsume":	Number(dt[9]), 
			}
			Conf.set("DefaultValue", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//常规开关
function CForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.base.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.base.enable.accura'),		Config.Conventional.AccurateColl);
		fm.addSwitch(tr('form.base.enable.iland'),		Config.Conventional.LandEnable);
		////////////////////////////////////////
		fm.addSwitch(tr('form.base.enable.demamd'),		Config.Conventional.DemandBOSS);
		fm.addSwitch(tr('form.base.enable.toast'),		Config.Conventional.onToastChat);
		////////////////////////////////////////
		fm.addSwitch(tr('form.base.enable.join'),		Config.Conventional.JoinEnable);
		fm.addSwitch(tr('form.base.enable.left'),		Config.Conventional.LeftEnable);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"AccurateColl":	Boolean(dt[1]).valueOf(), 
				"LandEnable":	Boolean(dt[2]).valueOf(), 
				"DemandBOSS":	Boolean(dt[3]).valueOf(), 
				"onToastChat":	Boolean(dt[4]).valueOf(), 
				"JoinEnable":	Boolean(dt[5]).valueOf(), 
				"LeftEnable":	Boolean(dt[6]).valueOf(), 
			}
			Conf.set("Conventional", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//攻击开关
function G1Form(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.attack.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		let aaa = Config.AttackEntity.AttMinimum;
		let bbb = Config.AttackEntity.Advanced;
		let ccc = Config.AttackEntity.Ordinary;
		////////////////////////////////////////
		fm.addSwitch(tr('form.attack.entity.switch'),	Config.AttackEntity.Switch);
		fm.addSwitch(tr('form.attack.player.switch'),	Config.AttackEntity.Enable);
		fm.addInput(tr('form.attack.playmin'),	'0.5',	`${aaa}`);
		fm.addInput(tr('form.attack.advanced'),	'100',	`${bbb}`);
		fm.addInput(tr('form.attack.ordinary'),	'50',	`${ccc}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"AttMinimum":	Number(dt[3]), 
				"Advanced":		Number(dt[4]), 
				"Ordinary":		Number(dt[5]), 
			}
			Conf.set("AttackEntity", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//列表显示
function DForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.display.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		const bbb = Config.ListDisplay.Name;
		const ccc = Config.ListDisplay.DisName;
		////////////////////////////////////////
		fm.addSwitch(tr('form.display.switch'),		Config.ListDisplay.Enable);
		fm.addInput(tr('form.display.input1'),		"Level",			`${bbb}`);
		fm.addInput(tr('form.display.input2'),		"§l§a等级系统§r",	`${ccc}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Enable":	Boolean(dt[1]).valueOf(), 
				"Name":		dt[2], 
				"DisName":	dt[3], 
			}
			Conf.set("ListDisplay", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//经验声音
function EForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.sound.exp.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		/////////////////////////////////
		fm.addSwitch(tr('form.sound.exp.enable'), Config.ExpSound.Enable);
		const aaa = Config.ExpSound.Sound;
		fm.addInput(tr('form.sound.exp.wew'), "random.orb", `${aaa}`);
		/////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Enable":	Boolean(dt[1]).valueOf(), 
				"Sound":	dt[2], 
			}
			Conf.set("ExpSound", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//升级声音
function FForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.sound.level.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.sound.level.enable'), Config.LevelSound.Enable);
		const bbb = Config.LevelSound.Sound;
		fm.addInput(tr('form.sound.level.wew'), "random.levelup", `${bbb}`);
		////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Enable":	Boolean(dt[1]).valueOf(), 
				"Sound":	dt[2], 
			}
			Conf.set("LevelSound", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//死亡扣除
function GForm(pl, Clients = true) {
		let mods = ["Exp", "Level"];
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.death.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.death.switch'),		Config.Death.Switch);
		fm.addDropdown(tr('form.death.mode',		Config.Death.Mode), mods);
		fm.addInput(tr('form.death.max'),	'1',	`${Config.Death.Max}`);
		fm.addInput(tr('form.death.min'),	'5',	`${Config.Death.Min}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":	Boolean(dt[1]).valueOf(), 
				"Mode":		mods[dt[2]], 
				"Max":		Number(dt[3]), 
				"Min":		Number(dt[4]), 
			}
			Conf.set("Death", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//死亡图腾
function G2Form(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.totem.title'));
		////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////
		fm.addSwitch(tr('form.totem.switch'),			Config.ConsumeTotem.Switch);
		fm.addSwitch(tr('form.totem.notice'),			Config.ConsumeTotem.Enable);
		fm.addInput(tr('form.totem.default'),	'50',	`${Config.ConsumeTotem.DefaultExp}`);
		////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("ConsumeTotem", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//吃东西
function HForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.ateevent.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.ateevent.switch'),			Config.AteEvent.Switch);
		fm.addSwitch(tr('form.ateevent.enable'),			Config.AteEvent.Enable);
		fm.addInput(tr('form.ateevent.default'),	'1',	`${Config.AteEvent.DefaultExp}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("AteEvent", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//杀敌
function IForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.mobdie.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.mobdie.switch'),			Config.MobDie.Switch);
		fm.addSwitch(tr('form.mobdie.enable'),			Config.MobDie.Enable);
		fm.addInput(tr('form.mobdie.default'),	'1',	`${Config.MobDie.DefaultExp}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("MobDie", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//破坏
function JForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.break.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.break.switch'),			Config.DestroyBlock.Switch);
		fm.addSwitch(tr('form.break.enable'),			Config.DestroyBlock.Enable);
		fm.addInput(tr('form.break.default'),	'1',	`${Config.DestroyBlock.DefaultExp}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("DestroyBlock", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//放置
function KForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.place.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.place.switch'),			Config.PlaceBlock.Switch);
		fm.addSwitch(tr('form.place.enable'),			Config.PlaceBlock.Enable);
		fm.addInput(tr('form.place.default'),	'1',	`${Config.PlaceBlock.DefaultExp}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("PlaceBlock", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


//经验事件
function LForm(pl, Clients = true) {
		const fm = mc.newCustomForm();
		fm.setTitle(tr('form.experience.title'));
		////////////////////////////////////////
		fm.addSwitch(tr('current.return.init'), true);
		////////////////////////////////////////
		fm.addSwitch(tr('form.experience.switch'),			Config.Experience.Switch);
		fm.addSwitch(tr('form.experience.enable'),			Config.Experience.Enable);
		fm.addInput(tr('form.experience.default'),	'1',	`${Config.Experience.DefaultExp}`);
		////////////////////////////////////////
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return;
			if (dt[0] == false) return PlayerSetingForm(pl);
			const Conf = new JsonConfigFile(FileOperation._Config, "{}");
			let Data = {
				"Switch":		Boolean(dt[1]).valueOf(), 
				"Enable":		Boolean(dt[2]).valueOf(), 
				"DefaultExp":	Number(dt[3]), 
			}
			Conf.set("Experience", Data);
			FileOperation.readFile();
			if (onPlaySound(pl, "YES"));
			pl.sendModalForm(tr('clue.text'), tr('clue.info'), tr('confirm.info'), tr('close.info'), (pl, res) => { 
				if(res){ if (onPlaySound(pl, "OK")); PlayerSetingForm(pl) }
			});
		});
	}


/*前置库*/
const APIs = {
		getLevelAPI(pl) {														//等级
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getLevel(pl.xuid).toString();  //这里可以用.toString()转为字符类型
			} else return 0;
		},
		////////////////////////////////////////
		getExpAPI(pl) {															//经验
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getExp(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getHeadExpAPI(pl) {														//总经验
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getHeadExp(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getPointAPI(pl) {														//属性点
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getPoints(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getHealthAPI(pl) {														//血量
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getHealth(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getAttackAPI(pl) {														//攻击
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getAttack(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getDeFenceAPI(pl) {														//防御
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getDeFence(pl.xuid).toString();
			} else return 0;
		},
		////////////////////////////////////////
		getLuckAPI(pl) {														//幸运
			if (!pl) return logger.warn(tr('play.object.warn', [pl]));
			if (pl != null) {
				return getLuck(pl.xuid).toString();
			} else return 0;
		},
	}


function regPapi() {
		const { Version } = require('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS');
		const PAPI = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS.js').PAPI;
		if (!Version || !PAPI) {
		logger.error(tr('papi.install.warn1'));
		logger.error(tr('papi.install.warn2'));
		return;
		}
		////////////////////////////////////////
		let a = APIs.getLevelAPI, b = APIs.getExpAPI, c = APIs.getHeadExpAPI;
		let d = APIs.getPointAPI, e = APIs.getHealthAPI, f = APIs.getAttackAPI;
		let g = APIs.getDeFenceAPI, h = APIs.getLuckAPI;
		/*重新编译*/ //感谢 [干物清城] 提醒 //话说PAPI只定义player吗？没咋用PAPI
		////////////////////////////////////////
		PAPI.registerPlayerPlaceholder(a, PLUGIN_Name, "lvl_getlevel");			//获得等级
		PAPI.registerPlayerPlaceholder(b, PLUGIN_Name, "lvl_getexp");			//获得经验
		PAPI.registerPlayerPlaceholder(c, PLUGIN_Name, "lvl_gethead");			//获得总经验
		PAPI.registerPlayerPlaceholder(d, PLUGIN_Name, "lvl_getpoint");			//获得属性点
		PAPI.registerPlayerPlaceholder(e, PLUGIN_Name, "lvl_gethealth");		//获得血量
		PAPI.registerPlayerPlaceholder(f, PLUGIN_Name, "lvl_getattack");		//获得攻击力
		PAPI.registerPlayerPlaceholder(g, PLUGIN_Name, "lvl_getdefence");		//获得防御力
		PAPI.registerPlayerPlaceholder(h, PLUGIN_Name, "lvl_getLuck");			//获得幸运值
		////////////////////////////////////////
		logger.info(tr('papi.install.load.ok'));
	}


//玩家LOG记录
ll.export((pl, key) => { 
	if (pl == undefined) return false;
	return LogBook(pl, key);
	}, "LevelExp", "LevelExp_LogBook");

//获得需要升级的经验大小
ll.export((level) => {
		return getNextLevelExp(level);											/*获取经验*/
	}, "LevelExp", "LevelExp_getNextLevelExp");

//■■■■■■■■■■■■		//新版导出API
//更新与修改玩家信息//多服数据同步用
ll.export((xuid, data) => {
		if (!isTable(xuid)) return false; 
		//例如 data = { lvl, exp, point, health, attack, DeFence, Luck };
		return onUpdate(xuid, data);											/*更新数据*/
	}, "LevelExp", "LevelExp_onUpdate");

//查询玩家数据
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getPlayData(xuid);												/*获取信息*/
	}, "LevelExp", "LevelExp_getPlayData");

//获得等级
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getLevel(xuid);													/*获取等级*/
	}, "LevelExp", "LevelExp_getLevel");

//获得总经验
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getHeadExp(xuid);												/*获取总经验*/
	},  "LevelExp", "LevelExp_getHeadExp");

//获得经验
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getExp(xuid);													/*获取经验*/
	},  "LevelExp", "LevelExp_getExp");

//获得属性点
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getPoints(xuid);													/*获取属性点*/
	}, "LevelExp", "LevelExp_getPoints");

//获得最大血量
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getHealth(xuid);													/*获取血量*/
	}, "LevelExp", "LevelExp_getHealth");

//获得攻击力
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getAttack(xuid);													/*获取攻击*/
	}, "LevelExp", "LevelExp_getAttack");

//获得防御力
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getDeFence(xuid);												/*获取防御*/
	}, "LevelExp", "LevelExp_getDefence");

//获得幸运
ll.export((xuid) => {
		if (!isTable(xuid)) return false; 
		return getLuck(xuid);													/*获取幸运*/
	}, "LevelExp", "LevelExp_getLuck");


//■■■■■■■■■■■■
//添加等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return addLevel(xuid, count);											/*添加等级*/
	}, "LevelExp", "LevelExp_addLevel");

//添加总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return addHeadExp(xuid, count);											/*添加总经验*/
	}, "LevelExp", "LevelExp_addHeadExp");

//添加经验《不升级》
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return addExps(xuid, count);											//注意有 S ★★	/*添加经验*/
	}, "LevelExp", "LevelExp_addExp");

//添加属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return addPoints(xuid, count);											/*添加属性点*/
	}, "LevelExp", "LevelExp_addPoints");


//■■■■■■■■■■■■
//减少等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return delLevel(xuid, count);											/*减少等级*/
	}, "LevelExp", "LevelExp_delLevel");

//减少总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return delHeadExp(xuid, count);											/*减少总经验*/
	}, "LevelExp", "LevelExp_delHeadExp");

//减少经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return delExp(xuid, count);												/*减少经验*/
	}, "LevelExp", "LevelExp_delExp");

//减少属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return delPoints(xuid, count);											/*添加等级*/
	}, "LevelExp", "LevelExp_delPoints");


//■■■■■■■■■■■■
//设置等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return setLevel(xuid, count);											/*设置等级*/
	}, "LevelExp", "LevelExp_setLevel");

//设置总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return setHeadExp(xuid, count);											/*添加经验*/
	}, "LevelExp", "LevelExp_setHeadExp");

//设置经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return setExp(xuid, count);												/*设置经验*/
	}, "LevelExp", "LevelExp_setExp");

//设置属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return false; 
		return setPoints(xuid, count);											/*添加等级*/
	}, "LevelExp", "LevelExp_setPoints");


// 傻瓜式操作●如●
//ll.require("LevelExp.js");													//接入插件
//let getLevel = lxl.import("LevelExp", "LevelExp_getLevel');					//获得等级
//let getExp = lxl.import("LevelExp", "LevelExp_getExp');						//获得经验
//let lvl = getLevel(xuid);														//获得等级(xuid)
//let exp = getExp(xuid);														//获得经验(xuid)
