/*
# ╔════════════════════════════════════════════════╗
# ║⿴███⿴⿴⿴⿴███⿴⿴⿴████⿴⿴⿴█████⿴⿴⿴█████⿴⿴⿴██⿴⿴██████⿴║
# ║⿴████⿴⿴████⿴⿴██⿴⿴██⿴⿴⿴█⿴⿴██⿴⿴⿴█⿴⿴██⿴⿴⿴⿴⿴⿴██⿴⿴⿴⿴⿴║
# ║⿴██⿴████⿴██⿴⿴██████⿴⿴⿴█⿴⿴██⿴⿴⿴█⿴⿴██⿴⿴██⿴⿴██████⿴║
# ║⿴██⿴⿴██⿴⿴██⿴⿴██⿴⿴██⿴⿴⿴█⿴⿴██⿴⿴⿴█⿴⿴██⿴⿴██⿴⿴██⿴⿴⿴⿴⿴║
# ║⿴██⿴⿴⿴⿴⿴⿴██⿴⿴██⿴⿴██⿴⿴█████⿴⿴⿴█████⿴⿴⿴██⿴⿴██████⿴║
# ╚════════════════════════════════════════════════╝
/**/
const Gpt = new Map(); /*别动*//*重要代码*/
/*插件名称*/
const PLUGIN_Name = "LevelExp";
/*插件版本*/
const PLUGIN_Version = [1, 3, 0];
/*插件作者*/
const PLUGIN_Author = "MineFeng";
/*插件介绍*/
const PLUGIN_Introduce = "一个有点不简单的等级系统";
/*游戏tell开头*/
const Gm_Tell = "§l§f[§d系统§f] §a";	/*游戏开头头衔*/
/*托管地址*/
const Git_hub = "https://www.github.com/MC-MineFeng/LevelExp/"; /*托管网站*/
/*插件注册*/
ll.registerPlugin(/*插件名字*/PLUGIN_Name, /*介绍*/PLUGIN_Introduce, /*版本*/PLUGIN_Version, /*信息*/{"Github": Git_hub})
/*文件路径*/
const _filePath = `.\\plugins\\${PLUGIN_Name}\\MainData\\`; /*文件配置所在位置*///千万别动会崩服(/"≡ _ ≡)=
/*初始化文件夹*/
if (!file.checkIsDir(_filePath + "SQLData")) file.mkdir(`.\\plugins\\${PLUGIN_Name}\\MainData\\SQLData\\`);
/**存储地址*/
const sqlite = new DBSession("sqlite3", { path: _filePath + "SQLData\\XuidData.db", create: true, }); /*sqline数据库*/
/*创建数据库*///获得经验总额 //COMMENT ''
sqlite.execute(`CREATE TABLE IF NOT EXISTS "HeadExp" ( "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
		"Xuid" TEXT NOT NULL, 
		"Name" TEXT NOT NULL, 
		"Exp" INTEGER NOT NULL DEFAULT 0, 
		"Time" DATETIME DEFAULT CURRENT_TIMESTAMP, 
		CONSTRAINT "UNI_NAME" UNIQUE ("Xuid") ON CONFLICT ABORT, 
		CONSTRAINT "UNI_NAME" UNIQUE ("Name") ON CONFLICT ABORT);
	`);	/*数据库数据/执行*/

/*创建数据库*///状态版//经常用
sqlite.execute(`CREATE TABLE IF NOT EXISTS "LevelEXP" ( "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
		"Xuid" TEXT NOT NULL, 
		"Name" TEXT NOT NULL, 
		"Level" TEXT NOT NULL DEFAULT 1, 
		"Exp" INTEGER NOT NULL DEFAULT 0, 
		"Points" TEXT NOT NULL DEFAULT 1, 
		"Health" TEXT NOT NULL DEFAULT 20, 
		"Attack" TEXT NOT NULL DEFAULT 1, 
		"Defence" TEXT NOT NULL DEFAULT 1, 
		"Time" DATETIME DEFAULT CURRENT_TIMESTAMP, 
		CONSTRAINT "UNI_NAME" UNIQUE ("Xuid") ON CONFLICT ABORT, 
		CONSTRAINT "UNI_NAME" UNIQUE ("Name") ON CONFLICT ABORT);
	`);	/*数据库数据执行*/

/**预释放文件*/
const Config_init = {
		/* 配置文件 */
		"Config": {
			/*是否开启自动*//*关闭了需要自己升级，《如:/lvl levelup》*/
			AutoLevelUp: true, /*自动升级开关*/
			/*最小等级，■推荐1■*/
			MinLevel: 1,
			/*每个等级经验获取 ( 2 * MaxExp ) = 1000 */
			MaxExp: 500,
			/*最大等级(满了=Max)*/
			MaxLevel: 200, 

			/*最大血量上限*/
			MaxHealth: 60, /*如:加属性加到60无法继续加*/
			/*最大攻击上限*/
			MaxAttack: 100, /*同上*/
			/*最大防御上限*/
			MaxDiane: 100, /*同上*/
			/*最大属性点上限*/
			MaxPoints: 200000, /*上限*/

			/*防止精准采集开关*/
			AccurateCollection: true,

			/*领地防护开关*/
			PlayLandEnable: true, /*开启*/

			/*玩家通知事件*/
			PlayJoinEnable: true, /*进入*/
			PlayLeftEnable: true, /*退出*/

			/*动态显示开关*/
			DisPlayMEnable: true, /*底部开关*/
			DisPlayTEnable: true, /*头部开关*/
			DisPlayTime: 1400, /*显示速度*/

			/*玩家死亡是否扣除经验或者等级*/
			PlayerDeathEnable: true, /*开启*/

			/*玩家列表显示*/
			ListEnable: true, /*开关*/
			PlayList: "§l§a等级系统", /*显示名称*/

			/*注意的是必须写清楚*/
			PlayDeathMode: "Exp", /*扣除模式*//*Level = Exp*/
			DeathMinLevel: 10, /*最小*//*比如10~200之间选一个值*/
			DeathMaxLevel: 200, /*最大*/

			/*玩家获得经验的声音*/
			PlayExpEnable: true, /*总开关*/
			PlayExpSound: "random.orb", /*经验声*/

			/*玩家升级的声音*/
			PlayLevelEnable: true, /*总开关*/
			PlayLevelSound: "random.levelup", /*升级声*/

			/*玩家吃东西获得经验开关*/
			onAteEventEnable: true,
			onAteExp: 1, /*获得默认的经验*/

			/*杀死任何生物获得经验开关*/
			ModDieExpEnable: true, /*总开关*/
			ModDieExp: 1, /*默认获得经验*/

			/*破坏方块获取经验开关*/
			BlockExpEnable: true, /*总开关*/
			BlockExp: 1, /*默认获得经验*/

			/*方块放置获得经验开关*/
			PlaceEventEnable: false, /*总开关●推荐关闭●*/
			PlaceEventExp: 1, /*默认获得经验*/

			/*经验事件获取经验开关*/
			EventMainEnable: true, /*总开关*/
			ExpEventEnable: false, /*是否开启默认经验*/
			ExpEventExp: 1, /*默认经验*/
		}
	}; /*配置*/

/**奖励*/
const Level_Award = {
		/*升级奖励*//*每个等级可以有无数个奖励，就看你怎么加了*/
		Award: [
			{
				/*这一行不要删，不然会报错*/
				"levelRange": [1, 9999], /*1~9999级都有奖励*/
				"type": "mine", /*常规*/
				"name": "属性点+1", /*显示名字*/
				"value": 1, /*模式[1, 2, 3, 4] | 1属性,2血量,3攻击,4防御*/
				"amount": 1, /*数量*/
			},
			{
				"levelRange": [1, 9999], /*1~9999级都有奖励*/
				"type": "command", /*命令*/
				"name": "绿宝石+1", /*显示名字*/
				"value": "give {realName} minecraft:emerald 1", /*命令*/
				"amount": 0, /*命令模式下无用*/
			},
			{
				"LevelFormula": "level % 12 === 0", /*每12级奖励*/
				"type": "mine", /*常规*/
				"name": "攻击+1", /*显示名字*/
				"value": 3, /*模式[1, 2, 3, 4]*/
				"amount": 1, /*数量*/
			},
			{
				"LevelFormula": "level % 13 === 0", /*每13级奖励*/
				"type": "mine", /*常规*//**/
				"name": "防御+1", /*显示名字*/
				"value": 4, /*模式[1, 2, 3, 4]*/
				"amount": 1, /*数量*/
			},
			{
				"LevelFormula": "level % 10 === 0", /*同上*/
				"type": "item", /*物品*/
				"name": "钻石+2", /*这里显示名字*/
				"value": "minecraft:diamond", /*物品标准名*/
				"amount": 2, /*数量*/
				"aux": 0, /*特殊*/
			},
			{
				"LevelFormula": "level % 15 === 0", /*每15级奖励*/
				"type": "mine", /*常规*//**/
				"name": "血量+2", /*显示名字*//*一颗星*/
				"value": 2, /*模式[1, 2, 3, 4]*/
				"amount": 2, /*数量*/
			},
			{
				"levelRange": [50, 50], /*固定在50级才能获得经验*/
				"type": "command", /*命令*/
				"name": "钻石+10", /*显示名字*/
				"value": "give {realName} minecraft:diamond 10", /*命令*/
				"amount": 0, /*命令模式下无用*/
			},
			{
				"LevelFormula": "level % 20 === 0", /*每20级才能获得*/
				"type": "command", /*命令*/
				"name": "铁剑+1", /*这里显示名字*/  /*{realName} = 玩家名*/
				"value": "give {realName} minecraft:iron_sword 1", /*命令*/
				"amount": 0, /*命令模式下没用*/
			},
			{
				"LevelFormula": "level % 5 === 0", /*同上*/
				"type": "llmoney", /*llmoney*/
				"name": "金币+500", /*这里显示名字*/
				"value": "money", /*名称*/
				"amount": 500, /*金币数量*/
			},
			/*{*/
			/*	"LevelFormula": "level % 6 === 0", /*同上*/
			/*	"type": "score", /*记分板*/
			/*	"name": "分数+1000", /*显示名字*/
			/*	"value": "Money", /*名称♦重要*/
			/*	"amount": 1000,
			/*},*/
			{
				"LevelFormula": "level % 30 === 0", /*同上*/
				"type": "gift", /*礼包*//**/
				"name": "礼包+1", /*这里显示名字*/
				"value": "K45S1SEHHH18D", /*礼包码(不存在)*/
				"amount": 1, /*数量*/
			},
		]
	};

/**预释放文件*/
const Config_Mode = {
		/*杀死生物获得经验列表*/
		KillMobDie: { 
			"minecraft:player": {
				"name": "玩家",
				"Exp": 50
			},
			"minecraft:zombie": {
				"name": "僵尸",
				"Exp": 10
			},
			"minecraft:skeleton": {
				"name": "骷髅",
				"Exp": 15
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
		} /*需要添加生物请自行添加*/
	};

/**预释放文件*/
const Config_Break = {
		/*破坏方块获得经验列表*/
		BlockBreak: {
			"minecraft:sand": {
				"name": "沙子",
				"Exp": 2
			},
			"minecraft:gravel": {
				"name": "砂砾",
				"Exp": 2
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
			"minecraft:redstone_ore": {
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
		}, /*需要添加的方块自行添加*/

		/*无法获得经验的方块*/
		/*下面是不能获得经验的方块*/
		/*应该还有可以获得经验，小心玩家刷经验哦*/
		BlockUnableExp: {
			"minecraft:tallgrass": {
				"name": "草",
			},
			"minecraft:deadbush": {
				"name": "枯萎的灌木",
			},
			"minecraft:yellow_flower": {
				"name": "蒲公英",
			},
			"minecraft:red_flower": {
				"name": "花",
			},
			"minecraft:brown_mushroom": {
				"name": "蘑菇",
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
const Config_Place = {
		/*放置方块获得经验列表*/
		/*这个是新加入的*/
		PlaceBlock: {
			"minecraft:air": {
				"name": "空气",
				"Exp": 0
			},
			"minecraft:snow_layer": {
				"name": "雪",
				"Exp": 0
			},
			"minecraft:bedrock": {
				"name": "基岩",
				"Exp": 0
			},
		}, /*需要添加的方块自行添加*/
	};

/**预释放文件*/
const Config_Item = {
		/*玩家吃东西获得经验列表*/
		/*必须是可以吃的东西*/
		ItemExp: {
			"minecraft:apple": {
				"name": "苹果",
				"Exp": 5
			},
			"minecraft:bread": {
				"name": "面包",
				"Exp": 5
			},/**/
			"minecraft:carrot": {
				"name": "胡萝卜",
				"Exp": 2
			},
		}
	};

/*配置*/
const Config = data.openConfig(_filePath + "Config.json", "json", data.toJson(Config_init.Config));
/*放置*/
const Break = data.openConfig(_filePath + "Break.json", "json", data.toJson(Config_Break));
/*破坏*/
const Place = data.openConfig(_filePath + "Place.json", "json", data.toJson(Config_Place));
/*生物*/
const Mode = data.openConfig(_filePath + "Mode.json", "json", data.toJson(Config_Mode));
/*食物*/
const AItem = data.openConfig(_filePath + "Item.json", "json", data.toJson(Config_Item));
/*奖励*/
File.writeTo(_filePath + "Award.json", JSON.stringify(Level_Award, null, '\t'));
/*奖励配置文件*/
const Daemon = new JsonConfigFile(_filePath + "Award.json");

/**初始化数据库 */ 
mc.listen('onServerStarted', () => { 
		/*注册命令*/
		LevelCmd();//真命令
		//创建计分板
		if (Config.get("ListEnable") == true) { /*关闭显示请修改成false*/
		mc.runcmdEx(`/scoreboard objectives add Level dummy ${Config.get("PlayList")}`);
		//把计分板记录在列表中
		mc.runcmdEx("/scoreboard objectives setdisplay list Level ascending"); // descending
		}
		try {
		regPapi();//前置库加载
		} catch (e) {
		logger.warn(`注册PAPI变量失败，可能是没有安装PAPI，跳过\n` + `${e}\n${e instanceof Error ? e.stack : ''}`);
		}
		logger.info(Gm_Tell + `版本: ${PLUGIN_Version} 作者: ${PLUGIN_Author} !!!`);
	});

/*动态显示*///这个我本来是想删除的，但是我想了想，还是加上去了 
function OnEvent(pl) {
	let tm = setInterval(function () {
		/*检查是否是NPC*/
		if (pl.isSimulatedPlayer() || !pl) return;
		if (pl.inWorld == 1) {
			let name = pl.realName,/*玩家名*/plh = pl.health;/*血量*/
			let plw = pl.maxHealth,/*最大血量*/mylevel = getLevel(pl.xuid);/*等级*/
			//开关检测
			if (Config.get("DisPlayTEnable") == true) {
			pl.rename(Format.Bold + Format.Green + "LV." + mylevel + "\n" + Format.White + name); /*头部显示*/
			}
			//开关检测
			if (Config.get("DisPlayMEnable") == true) {
				mc.getOnlinePlayers().forEach(pl => { /*底部显示*/
				let Next = getNextLevelExp(getLevel(pl.xuid));
				pl.tell(`§l   §f等级: §aLV.${getLevel(pl.xuid)} §f经验: §b[ §e${getExp(pl.xuid)}§d/§6${Next} §b]`, 5);
				});
			}
		}else{
		return clearInterval(tm);
		}
	}, Config.get("DisPlayTime")); //速度
	}

/*玩家死亡*/
mc.listen('onPlayerDie', (pl) => {
		logger.debug(pl.isSimulatedPlayer());/*防止错误*/
		if (pl.isSimulatedPlayer() /* 兼容NPC */ || !pl || !pl.pos) return;
		const data = { time: system.getTimeStr(), x: pl.blockPos.x, y: pl.blockPos.y, z: pl.blockPos.z, dimid: pl.blockPos.dimid };
		let posx = pl.blockPos.x, posy = pl.blockPos.y, posz = pl.blockPos.z, dimids = pl.blockPos.dimid;
		if (Config.get("PlayerDeathEnable") == false) return;
		let max = Config.get("DeathMaxLevel");
		let min = Config.get("DeathMinLevel");
		let mate = Math.floor(Math.random() * (max - min) + min);/*随机匹配数量*/
		if (Config.get("PlayDeathMode") == "Level") {
			if (mate >= getLevel(pl.xuid)) return; /*限制*//*防止被扣除到负数(ー_ー)!!*/
			if (delLevel(pl.xuid, Number(mate)));/*执行是否成功*//*扣等级*/
			pl.tell(Gm_Tell + "§c你已死亡被扣除 §6LV -"+Number(mate)+" §c!!!");
		}
		if (Config.get("PlayDeathMode") == "Exp") {
			if (mate >= getExp(pl.xuid)) return; /*限制*//*防止被扣除到负数(ー_ー)!!*/
			if (delExp(pl.xuid, Number(mate)));/*执行是否成功*//*扣经验*/
			pl.tell(Gm_Tell + "§c你已死亡被扣除 §6Exp -"+Number(mate)+" §c!!!");
		}
	});

/* 生物死亡 */
mc.listen('onMobDie', function(mob, source, cause) => {
		if (source && source.isPlayer()) {
		//检测是否为创造模式
		let pl = source.toPlayer();
		new onUpData(pl.xuid);
		//检测是否为创造模式
		if (pl.isCreative) return;
		const modzv = Mode.get("KillMobDie");
		if(onMobAlgorithm(pl, modzv, mob, "杀死")) return true;//杀死生物
		/*默认奖励//开关检测*/
		if (Config.get("ModDieExpEnable") == true) {
			/*添加默认经验*/
			new addExp(pl.xuid, Config.get("ModDieExp")); 
			/*消息*///pl.tell(Gm_Tell + "获得经验 + "+Config.get("ModDieExp"));
			return true;
			}
		}
	});

/* 玩家破坏方块 */
mc.listen("onDestroyBlock", function(pl, block) => { 
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		new onUpData(pl.xuid);
		//检测是否为创造模式
		if (pl.isCreative) return;
		const blacf = Break.get("BlockBreak");
		const unable = Break.get("BlockUnableExp");
		//防止在有保护的领地中获得经验
		if (isiLandDisabled(pl, block)) { //如果能获得经验在其他位置计算
		//防精准采集开关
		if (Config.get("AccurateCollection") ? !isCollection(pl.getHand()) : true) {
		//无法获得经验方块
		for (let buble in unable) { if (buble == block.type) return true; }
		if (onMobAlgorithm(pl, blacf, block, "破坏")) return true;//可获得
		} /*精准采集*///如果发现是精准采集，然后直接获得默认经验
		/*默认奖励//开关检测*/
		if (Config.get("BlockExpEnable") == true) {	/*添加默认经验*/
			new addExp(pl.xuid, Config.get("BlockExp"));
			/*消息*///pl.tell(Gm_Tell + "获得经验 + "+Config.get("BlockExp"));
			return true;
		}
		} //领地防护
	});

/* 玩家放置方块后 */
mc.listen('afterPlaceBlock', (pl, block) => {
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		new onUpData(pl.xuid);
		//检测是否为创造模式
		if (pl.isCreative) return;
		const aplace = Place.get("PlaceBlock");
		//防止在有保护的领地中获得经验
		if (isiLandDisabled(pl, block)) { //如果能获得经验在其他位置计算
		if(onMobAlgorithm(pl, aplace, block, "放置")) return true;//放置物品
		//开关检测
		if (Config.get("PlaceEventEnable") == true) {	/*添加默认经验*/
			new addExp(pl.xuid, Config.get("PlaceEventExp")); 
			/*消息*///pl.tell(Gm_Tell + "获得经验 + "+Config.get("PlaceEventExp"));
			return true;
		}
		} //领地防护
	});

/* 玩家吃东西 */
mc.listen('onAte', function (pl, item) => {
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		let lvl = getLevel(pl.xuid), name = pl.realName;
		new onUpData(pl.xuid);
		//检测是否为创造模式
		if (pl.isCreative) return;
		const aitem = AItem.get("ItemExp");
		if(onMobAlgorithm(pl, aitem, item, "吃下")) return true;//吃东西
		//开关检测
		if (Config.get("onAteEventEnable") == true) {	/*添加默认经验*/
			new addExp(pl.xuid, Config.get("onAteExp")); 
			/*消息*///pl.tell(Gm_Tell + "获得经验 + "+Config.get("onAteExp")); //onAteExp
			return true;
		}
	});

/* 玩家获得经验 */
mc.listen("onExperienceAdd", function(pl, exp) => {
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		//检测是否为创造模式
		if (pl.isCreative) return;
		new onUpData(pl.xuid);
		//开关检测
		if (Config.get("EventMainEnable") == true) {
			//两个模式[一个经验是多少就获得多少]，[一个捡经验直接获得自定义经验]
			if (Config.get("ExpEventEnable") == true) {
			new addExp(pl.xuid, Config.get("ExpEventExp"));//获得自定义经验
			/*消息*///pl.tell(Gm_Tell + "获得经验 + "+Config.get("ExpEventExp"));
			} else addExp(pl.xuid, exp);//经验是多少他就加多少ಠ_ರೃ
			/*消息*///pl.tell(Gm_Tell + "获得经验 + " + exp);
			return true;
		}
	});

/*进入服检测数据//进入前*/
mc.listen("onPreJoin", function (pl) {
		if (pl == null) return //玩家为空
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		//查询存在/*不存在建立数据*/
		if (!isTable(pl.xuid)) {
		/*入库*/ new JoinCreate(pl.xuid);
		let lvl = getLevel(pl.xuid), name = pl.realName;
		setTimeout(() => { // 延时防止过快
		/*后台消息*/
		logger.info(Gm_Tell + `§a玩家 §f${name} §a首次进入本服!!`);
		/*全服消息*/
		mc.broadcast(Gm_Tell + `§aLV.${lvl} §f${name} §a首次进入本服!!`);
		if (Config.get("ListEnable") == true) { /*关闭显示请修改成false*/
		/*列表*/let scoreboard = mc.getScoreObjective("Level");
		mc.runcmdEx(`/scoreboard players set ${nane} Level ${lvl}`);
		}
		}, 1200);
		}/*else{ log("数据已存在!");	}*/
	});

/* 监听进服事件 */
mc.listen('onJoin', function (pl) => {
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		let lvl = getLevel(pl.xuid), name = pl.realName;
		/*加载头显*/OnEvent(pl);	/*更新*/onUpData(pl.xuid);
		/*发控制台消息*/
		logger.info(Gm_Tell + `§aLV.${lvl} §f${name} §a已进入本服!!`);
		//开关检测机制
		if (Config.get("PlayJoinEnable") == true) {
		mc.broadcast(Gm_Tell + `§aLV.${lvl} §f${name} §a已进入本服!!`);
		}
	});

/* 监听退出事件 */
mc.listen('onLeft', function (pl) => {
		//查询是否为模拟玩家
		if (pl.isSimulatedPlayer()) return;
		let lvl = getLevel(pl.xuid), name = pl.realName;
		//删除记录
		if(Gpt.has(pl.xuid)) Gpt.delete(pl.xuid);//删除记录数据
		/*删除列表显示*/
		mc.deletePlayerScore(pl.xuid, "Level");/*没必要限制*/
		mc.deletePlayerScore(pl.realName, "Level");
		/*发控制台消息*/
		logger.info(Gm_Tell + `§aLV.${lvl} §f${name} §e已退出本服!!`);
		//开关检测
		if (Config.get("PlayLeftEnable") == true) {
		mc.broadcast(Gm_Tell + `§aLV.${lvl} §f${name} §e已退出本服!!`);
		}
	});

/** 保存玩家数据*/
function JoinCreate(xuid) {
	try { //玩家为空
		if (xuid == null) return
		//获取玩家对象
		let pl = mc.getPlayer(xuid);
		//检测是否存在
		if(!isTable(pl.xuid)) {
		logger.warn(`玩家 ${pl.realName} 的等级不存在，正在新建...`);
		//执行数据库
		const stmt = sqlite.prepare("INSERT INTO LevelExp ('Xuid', 'Name', 'Level') VALUES ($a, $b, $c);");
		stmt.bind([pl.xuid, pl.realName, Config.get("MinLevel")]).execute();
		//总经验
		const stm1 = sqlite.prepare("INSERT INTO HeadExp ('Xuid', 'Name') VALUES ($a, $b);");
		stm1.bind([pl.xuid, pl.realName]).execute();
		return stmt.insertId || -1;
		}/*else{ log("数据存在, 无需创建!");	}*/
		} catch (error) {
		/*错误消息*/logger.log(error);
		return -1;
		}
	}

//■■■■■■■■■■■■■■
//这里我都还没有弄清楚。不太清楚攻击和防御力的增加算法。懂的人给我说一声
/** 更新玩家数据
* @param xuid 玩家
* @return bool */
function onUpData(xuid) {
		//玩家为空
		if (xuid == null) return
		//获得玩家对象
		let pl = mc.getPlayer(xuid);
		//查询玩家等级
		let lvl = getLevel(xuid);
		//设置幸运属性
		pl.setLuck(Number(lvl));//幸运
		//查询玩家血量
		let health = getHealth(xuid);
		//查询玩家攻击
		let val = getAttack(xuid);
		//查询玩家防御力
		let alu = getDiane(xuid);
		//设置最大血量
		pl.setMaxHealth(Number(health)); //最大血量
		//为玩家设置最大攻击伤害
		//pl.setMaxAttackDamage(Math.floor(val * 0.2) + 1); //最大攻击
		//为玩家设置击退抵抗属性
		//pl.setKnockbackResistance(Math.floor(alu * 0.1) + 1);//击退抵抗(防御)
		/*控制台信息*/
		//logger.info(Gm_Tell + `已更新玩家 ${pl.realName} 数据!!`);
		//#■■谁知道怎么动下面数据吗■■都开飞机了ʕ  •ᴥ•ʔ……
		//#	//为玩家设置移动速度属性
		//#	pl.setMovementSpeed(level * 0.1);
		//#	//为玩家设置水下移动速度属性
		//#	pl.setUnderwaterMovementSpeed(level + 0.1);
		//#	//为玩家设置岩浆上移动速度属性
		//#	//pl.setLavaMovementSpeed(level + 0.1);
		if (Config.get("ListEnable") == true) { /*关闭显示请修改成false*/
		let scoreboard = mc.getScoreObjective("Level");
		mc.runcmdEx(`/scoreboard players set ${pl.realName} Level ${lvl}`);
		}
	}

//■■■■■■■■■■■■■■

/** 等级升级信息
* @param xuid 玩家
* @return bool */
function LevelUp(xuid, AutoUp = true) {
		//玩家为空
		if (xuid == null) return
		//获得玩家对象
		let pl = mc.getPlayer(xuid);
		//目前有的经验值
		let xp = getExp(xuid);
		/*两个模式*/
		if (AutoUp == true) {
		//等级上限检测
		if (getLevel(xuid) >= Config.get("MaxLevel") || getLevel(xuid) == "Max") return
		/*获取玩家等级*/ 
		let level = getLevel(xuid); /*等级*/
		let count = 1, lvl = Number(level) + Number(count);
		/*加个等级*/addLevel(xuid, count);	/*等级+1*/
		if (getAward(xuid, level)); //等级奖励
		/*满饥饿*/pl.setHungry(20);/*更新*/onUpData(pl.xuid);
		let onlin = mc.getOnlinePlayers();/*获得在线玩家*/
		//药水效果//生命提升
		pl.addEffect(10, 5*20, 3, Boolean(true).valueOf());
		//药水效果//伤害吸收
		pl.addEffect(22, 15*20, 2, Boolean(true).valueOf());
		//药水效果//力量
		pl.addEffect(5, 10*20, 1, Boolean(true).valueOf());
		/*主标题*/	/*副标题*/
		pl.setTitle("§l§d↑↑ §fLevel UP §d↑↑");//主
		pl.setTitle(`§l§eLV.${level} §f=> §dLV.${lvl}`, 3);//副
		/*聊天框显示*/
		pl.tell("\n\n\n");//用来清屏
		pl.tell(Gm_Tell + `§l§f=========================`);
		pl.tell(Gm_Tell + `| §a恭喜你升级了!!!`);
		pl.tell(Gm_Tell + `| §b现在等级为 §f=> §aLV.${lvl}`);
		pl.tell(Gm_Tell + `| §e获得以下升级奖励: `);
		pl.tell(Gm_Tell + `| §6${Gpt.get(pl.xuid)}`);
		pl.tell(Gm_Tell + `§l§f=========================`);
		/*全体消息*/
		mc.broadcast(Gm_Tell + `§b恭喜 §f${pl.realName} §b升级至 §aLV.${lvl} §b!!!`);
		pl.tell("\n\n\n\n");//用来清屏
		/*粒子效果*/
		mc.spawnParticle(pl.blockPos, "minecraft:totem_particle");
		mc.spawnParticle(pl.blockPos, "minecraft:splash_spell_emitter");
		//奖励删除记录
		if(Gpt.has(pl.xuid)) Gpt.delete(pl.xuid);//然后删除
		//升级声音开关
		if (Config.get("PlayLevelEnable") == true) {
		/*升级的提示音*/
		mc.runcmdEx(`execute as ${pl.realName} run playsound ${Config.get("PlayLevelSound")}`);
		}/*控制台消息*/
		logger.info(Gm_Tell + `玩家 ${pl.realName} 已从 LV.${level} 升到 LV.${lvl} !!`);
		}
		if (AutoUp == false) {
		//检测是否正常
		if (xp >= getNextLevelExp(getLevel(xuid))) {
		//计算//字符串，防止出错
		let eep = Number(xp) - Number(getNextLevelExp(getLevel(xuid)));
		//添加经验并且升级
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		//执行数据//反过来
		stmt.bind([eep, xuid]).execute();
		/*升级*/
		if (LevelUp(xuid, true));	/*升级以及奖励*/
		/*控制台消息*/
		logger.info(Gm_Tell + `玩家 ${pl.realName} 正在进行升级 !!!`);
		/*嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎*/
		} else {
		let Con = getNextLevelExp(getLevel(xuid)) - Number(xp);
		mc.getPlayer(xuid).tell(Gm_Tell + `§c经验不足，无法升级 还需要§6 ${Con} §c!!!`);
		}
		}
	}

/** 等级奖励
 * @param xuid 玩家
 * @param {number} level 等级 */
function getAward(xuid, level) {
		//玩家为空或者等级为0
		if (xuid == null && level == 0) return
		/*获得玩家对象*///Gpt.set(xuid, ""); /*防止出错*/
		let pl = mc.getPlayer(xuid);
		let award = Daemon.get("Award");
		//■■■■■■■■■■
		const aa = (award) => {
			const { levelRange, LevelFormula } = award;
			//指定等级奖励
			if (levelRange && levelRange.length) {
			const [min, max] = levelRange;
			return (max ? level <= max : true) && (min ? min <= level : true);
			}
			//JS函数奖励
			if (LevelFormula) {
			return Boolean(onfuncEval(LevelFormula, { level }));
			}
			return true;
		};
		//■■■■■■■■■■
		const bb = (award) => {
			const { type, name, value, amount, aux } = award;
			/*Gpt.set(pl.xuid, "");*//*限制级*//*防止underlined*/
			if (type === 'mine') {
				/*模式[1, 2, 3, 4] 1属性,2血量,3攻击,4防御*/
				switch (Number(value)) {
					case 1: { //属性点
					if (getPoints(xuid) >= Config.get("MaxPoints")) return; //限制
					addPoints(xuid, amount);//属性
					Gpt.set(pl.xuid, name);/**/
					return null;
					}
					case 2: { //血量
					if (getHealth(xuid) >= Config.get("MaxHealth")) return; //限制
					addHealth(xuid, amount);//血量
					Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
					return null;
					}
					case 3: { //攻击力
					if (getAttack(xuid) >= Config.get("MaxAttack")) return; //限制
					addAttack(xuid, amount);//攻击
					Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
					return null;
					}
					case 4: { //防御力
					if (getDiane(xuid) >= Config.get("MaxDiane")) return; //限制
					addDiane(xuid, amount); //防御
					Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
					return null;
					}
				}
				return true;
			}
			if (type === 'command') { //命令
			mc.runcmdEx(value.replace(/{realName}/g, pl.realName));
			Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
			return null;
			}
			if (type === 'llmoney') { //金币
			mc.getPlayer(xuid).addMoney(amount);
			Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
			return null;
			}
			if (type === 'score') { //分数
			let scoreObj = mc.getScoreObjective(value);
			if (!scoreObj) mc.newScoreObjective(value);/*不存在建立*/
			mc.getPlayer(xuid).addScore(value, amount);
			Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
			return scoreObj;
			}
			if (type === 'item') { //物品
			var item = mc.newItem(value, amount); //物品
			if (!item) throw TypeError('创建物品对象失败(￣ ‘i ￣;) ');
			if (typeof aux === 'number') item.setAux(aux);
			mc.getPlayer(xuid).giveItem(item); /*给物*/
			mc.getPlayer(xuid).refreshItems(); /*刷新*/
			Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
			return item;
			}
			if (type === 'gift') { //礼包
			//xuid=玩家，value=礼包码
			new addCDKData(xuid, value);//执行礼包 
			Gpt.set(pl.xuid, Gpt.get(pl.xuid) + name);
			return null;
			}
		};
		Level_Award.Award.filter(aa).map(bb).filter((v) => v);
		pl.refreshItems();
		return true;
	}

//执行CDK
function addCDKData(xuid, value) {
		if (xuid == null && value == null) return
		//获得玩家对象
		let pl = mc.getPlayer(xuid);
		//礼包领取
		const { name, cdk, code } = value;
		//执行	//删了(/"≡ _ ≡)=
		return true;
	}

/** 添加玩家经验
* @param xuid 玩家
* @param exp 经验
* @return bool */
function addExp(xuid, exp) {
		//玩家为空或者经验为0
		if (xuid == null) return
		//等级上限检测
		if (getLevel(xuid) >= Config.get("MaxLevel") || getLevel(xuid) == "Max") return
		//目前有的经验值
		let xp = getExp(xuid);
		//获得玩家对象
		let pl = mc.getPlayer(xuid);
		///获得经验声音开关
		if (Config.get("PlayExpEnable") == true) {
		/*获得经验声音*/
		mc.runcmdEx(`execute as ${pl.realName} run playsound ${Config.get("PlayExpSound")}`);
		}//获得经验显示
		mc.getPlayer(xuid).tell(Format.Bold+Format.Yellow+"EXP"+Format.Red+"+"+Format.White+exp, 4);
		/*添加总经验*/
		if(addHeadExp(xuid, Number(exp))); //添加玩家总经验
		//是否可以升级
		if (xp + exp >= getNextLevelExp(getLevel(xuid))) {
		//是否自动升级
		if (Config.get("AutoLevelUp")) { /*检测开关*//*如果想自己动手升级，把这个设置成false*/
		//计算//字符串，防止出错
		let pxp = Number(xp) + Number(exp) - Number(getNextLevelExp(getLevel(xuid)));
		/*升级*/
		if (LevelUp(xuid, true));	/*升级以及奖励*/
		//添加经验并且升级
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		//执行数据//反过来
		return stmt.bind([pxp, xuid]).execute();
		}else{
		//直接添加经验
		let ext = Number(xp) + Number(exp);
		//添加经验不升级
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		//执行数据//反过来
		return stmt.bind([ext, xuid]).execute();
		}
		} else {
		//直接添加经验
		let tat = Number(xp) + Number(exp);
		//添加经验
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		//执行数据//反过来
		return stmt.bind([tat, xuid]).execute();
		}
	}

//■■■■■■■■■■■■■■
/** 查询玩家的等级
* @param xuid 玩家
* @return bool */
function getLevel(xuid) { //获取等级
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Level FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		if (result["Level"] >= Config.get("MaxLevel")) {
		return "Max";
		} else return result["Level"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的总经验
* @param xuid 玩家
* @return bool */
function getHeadExp(xuid){ //获取总经验
	try { /*玩家为空*///■■■■■■■■■■
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Exp FROM HeadExp WHERE Xuid = $a;");
		/*执行*/
		stmt.bind(xuid).execute();
		/*查找*/
		let result = stmt.fetch();
		/*检测存在*/
		if(result === false) return 0;
		return result["Exp"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的经验数量
* @param xuid 玩家
* @return bool */
function getExp(xuid){ //获取经验
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Exp FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		if (getLevel(xuid) == "Max") {
		return "Max";
		} else return result["Exp"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的属性点
* @param xuid 玩家
* @return bool */
function getPoints(xuid) { //属性点
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Points FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		return result["Points"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的血量
* @param xuid 玩家
* @return bool */
function getHealth(xuid) { //获取血量
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Health FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		return result["Health"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的攻击力
* @param xuid 玩家
* @return bool */
function getAttack(xuid) { //获取攻击
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Attack FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		return result["Attack"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/** 查询玩家的防御
* @param xuid 玩家
* @return bool */
function getDiane(xuid) {
	try { //玩家为空
		if (xuid == null) return
		const stmt = sqlite.prepare("SELECT Defence FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		return result["Defence"];
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

//■■■■■■■■■■■■■■
/** 设置玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setLevel(xuid, amount) { //设置等级
	try { //玩家为空
		if (xuid == null) return
		//设置等级
		let count = Number(amount); // getLevel(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Level = $a WHERE Xuid = $b;");
		//执行设置等级
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function setHeadExp(xuid, amount){ //设置总经验
	try { //玩家为空
		if (xuid == null) return
		//添加总经验
		let count = Number(amount); // getHeadExp(xuid);
		const stmt = sqlite.prepare("UPDATE HeadExp SET Exp = $a WHERE Xuid = $b;");
		//执行设置经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function setExp(xuid, amount){ //设置经验
	try { //玩家为空
		if (xuid == null) return
		//设置经验
		let count = Number(amount); // getExp(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = $a WHERE Xuid = $b;");
		//执行设置经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function setPoints(xuid, amount){ //设置属性点
	try { //玩家为空
		if (xuid == null) return
		//设置属性点
		let count = Number(amount); // getPoints(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Points = $a WHERE Xuid = $b;");
		//执行设置属性点
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function setHealth(xuid, amount){ //设置血量
	try { //玩家为空
		if (xuid == null) return
		//设置血量
		let count = Number(amount); // getHealth(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Health = $a WHERE Xuid = $b;");
		//执行设置血量
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家攻击力
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setAttack(xuid, amount) { //设置攻击力
	try { //玩家为空
		if (xuid == null) return
		//设置攻击
		let count = Number(amount); // getAttack(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Attack = $a WHERE Xuid = $b;");
		//执行设置攻击力
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 设置玩家防御
* @param xuid 玩家
* @param amount 数量
* @return bool */
function setDiane(xuid, amount) { //设置防御
	try { //玩家为空
		if (xuid == null) return
		//设置防御
		let count = Number(amount); // getDiane(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Defence = $a WHERE Xuid = $b;");
		//执行设置防御
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

//■■■■■■■■■■■■■■
/** 添加玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function addLevel(xuid, amount) { //添加等级
	try { //玩家为空
		if (xuid == null) return
		//添加等级
		let count = Number(amount); // getLevel(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Level = Level + $a WHERE Xuid = $b;");
		//执行添加等级
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 添加玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function addHeadExp(xuid, amount){ //添加总经验
	try { //玩家为空
		if (xuid == null) return
		//添加总经验
		let count = Number(amount); // getHeadExp(xuid);
		const stmt = sqlite.prepare("UPDATE HeadExp SET Exp = Exp + $a WHERE Xuid = $b;");
		//执行设置经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 直接添加玩家经验//不升级
* @param xuid 玩家
* @param amount 经验
* @return bool */ 
function addExps(xuid, amount){ //添加经验
	try { //玩家为空
		if (xuid == null) return
		//添加经验
		let count = Number(amount); // getExp(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = Exp + $a WHERE Xuid = $b;");
		//执行添加经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 添加玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function addPoints(xuid, amount){ //添加属性点
	try { //玩家为空
		if (xuid == null) return
		//添加属性点
		let count = Number(amount); // getPoints(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Points = Points + $a WHERE Xuid = $b;");
		//执行添加属性点
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 添加玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function addHealth(xuid, amount){ //添加血量
	try { //玩家为空
		if (xuid == null) return
		//添加血量
		let count = Number(amount); // getHealth(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Health = Health + $a WHERE Xuid = $b;");
		//执行添加血量
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家攻击力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function addAttack(xuid, amount){ //减少攻击力
	try { //玩家为空
		if (xuid == null) return
		//添加攻击力
		let count = Number(amount); // getAttack(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Attack = Attack + $a WHERE Xuid = $b;");
		//执行添加攻击力
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 添加玩家防御
* @param xuid 玩家
* @param amount 防御
* @return bool */
function addDiane(xuid, amount){ //添加防御力
	try { //玩家为空
		if (xuid == null) return
		//添加防御
		let count = Number(amount); // getAttack(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Defence = Defence + $a WHERE Xuid = $b;");
		//执行添加防御
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

//■■■■■■■■■■■■■■

/** 减少玩家等级
* @param xuid 玩家
* @param amount 数量
* @return bool */
function delLevel(xuid, amount) { //减少等级
	try { //玩家为空
		if (xuid == null) return
		//减少等级
		let count = Number(amount); // getLevel(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Level = Level - $a WHERE Xuid = $b;");
		//执行减少等级
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家总经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function delHeadExp(xuid, amount){ //减少总经验
	try { //玩家为空
		if (xuid == null) return
		//添加总经验
		let count = Number(amount); // getHeadExp(xuid);
		const stmt = sqlite.prepare("UPDATE HeadExp SET Exp = Exp - $a WHERE Xuid = $b;");
		//执行设置经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家经验
* @param xuid 玩家
* @param amount 经验
* @return bool */
function delExp(xuid, amount){ //减少经验
	try { //玩家为空
		if (xuid == null) return
		//减少经验
		let count = Number(amount); // getExp(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Exp = Exp - $a WHERE Xuid = $b;");
		//执行减少经验
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家属性点
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delPoints(xuid, amount){ //减少属性点
	try { //玩家为空
		if (xuid == null) return
		//减少属性点
		let count = Number(amount); // getPoints(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Points = Points - $a WHERE Xuid = $b;");
		//执行减少属性点
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家血量
* @param xuid 玩家
* @param amount 血量
* @return bool */
function delHealth(xuid, amount){ //减少血量
	try { //玩家为空
		if (xuid == null) return
		//减少血量
		let count = Number(amount); // getHealth(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Health = Health - $a WHERE Xuid = $b;");
		//执行减少血量
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家攻击力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delAttack(xuid, amount){ //减少攻击力
	try { //玩家为空
		if (xuid == null) return
		//减少攻击力
		let count = Number(amount); // getAttack(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Attack = Attack - $a WHERE Xuid = $b;");
		//执行减少攻击力
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

/** 减少玩家防御力
* @param xuid 玩家
* @param amount 属性点
* @return bool */
function delDiane(xuid, amount){ //减少防御力
	try { //玩家为空
		if (xuid == null) return
		//减少防御力
		let count = Number(amount); // getDiane(xuid);
		const stmt = sqlite.prepare("UPDATE LevelExp SET Defence = Defence - $a WHERE Xuid = $b;");
		//执行减少防御力
		return stmt.bind([count, xuid]).execute();
		} catch (error) {
		/*错误消息*/logger.log(error);
		return false;
		}
	}

//■■■■■■■■■■■■■■

/* 判断指定玩家是否存在
* @param {String} xuid 玩家
* @return bool */
function isTable(xuid) {
		//数据为空
		if (xuid == null) return
		//语句
		let result = sqlite.query("SELECT count(*) count FROM LevelExp WHERE Xuid = '" + xuid + "';");
		//结果=0 + 或者=1
		return result[1][0] > 0 ? true : false;
	}

/* 查询某个玩家消息
* @param xuid 玩家
* @return bool */
function getInfo(xuid) {
	try { //数据为空
		if (xuid == null) return
		//语句
		const stmt = sqlite.prepare("SELECT * FROM LevelExp WHERE Xuid = $a;");
		//执行
		stmt.bind(xuid).execute();
		//查找
		let result = stmt.fetch();
		//检测存在
		if(result === false) return 0;
		return result; /*result["xuid"], result["level"]*/
		} catch (error) {
		/*错误消息*/logger.log(error);
		return 0;
		}
	}

/*注册列表*/
function onDataAll() {
		let stmt = sqlite.prepare("SELECT * FROM LevelExp");
		do { // 准备并执行后，默认在第一行
		let result = stmt.fetchAll();
		return result;
		} while (stmt.step()); // 第一次执行时步进到第二行，并成功获取到结果，返回true；最后一行时再步进则返回false
	}

/** 获得玩家等级上限
* @param level 等级
* @return bool */
function getNextLevelExp(lvl) { //等级上限
		//数据为空
		if (lvl == null) return/**/
		//转换成数字
		let level = Number(lvl);
		// 转换数据
		if (level >= Config.get("MinLevel") && level <= Config.get("MaxLevel")) {
		//转换经验
		return level * Config.get("MaxExp");
		//别的数据
		}else{	return "Max"; /*等级满了*/
		}
	}

//转码我也看不懂("▔□▔)从其他地方抄过来的(/"≡ _ ≡)=
function onfuncEval(value, vars = {}) {
		const vacant = Object.entries(vars).map(([n, v]) => `const ${n} = ${v}`).join('; ');
		const count = `${vacant}; return (${value});`;//是或者不是
		return new Function(count)();
	}

/* //精准采集检测
 * @param {Item} it 物品
 * @returns {boolean} */
function isCollection(item) {
		if (!item.isEnchanted || item.isEnchantingBook) return false;
		const nbt = item.getNbt().toObject();//精准附魔NBT
		for (const ench of nbt.tag.ench) if (ench && ench.id === 16) return true;
		return false;
	}

/* 算法
 * @param {pos} 坐标 */
function toRawPos(pos) { 
		return { x: pos.x, y: pos.y, z: pos.z, dimid: pos.dimid } 
	}

/*防止在无权限领地破坏方块增加经验
 * @param {player} 玩家
 * @param {block} 方块
 * @param {blacf} 配置
 * PS 注意插件必须是iLand-Core */
function isiLandDisabled(pl, block) {
		// 当玩家在领地内破坏方块时，发出一个提示。
		if (Config.get("PlayLandEnable") == false) { /*关闭直接跳过false*/
		/*需要插件*/
		let GetLand = lxl.import('ILAPI_PosGetLand'); //通过坐标查询领地
		let GetOwner = lxl.import('ILAPI_IsLandOwner'); //玩家是否是领地主人
		let GetPerm = lxl.import('ILAPI_CheckPerm'); //检查领地某权限开启状态
		let GetTrust = lxl.import('ILAPI_IsPlayerTrusted'); //玩家是否被领地信任
		let land = GetLand(toRawPos(block.pos));
		if (land != -1) {
			let xuid = String(pl.xuid);//玩家xuid
			let isOwner = GetOwner(land, xuid);//是否主人
			let isTrust = GetTrust(land, xuid);//是否被信任
			let isPerm = GetPerm(land, "allow_destroy"); //领地权限
			if (isOwner || isTrust || isPerm) {
				//logger.info(Gm_Tell + "已被信任！");
				return true;
			} else {//logger.info(Gm_Tell + "这里无权限破坏！");
				return false; 
			}
		}//logger.info(Gm_Tell + "这里不是领地已跳过！");
		}
		return true;
	}

/* pl 玩家 type 类型 mobile 模式 *///转换
function onMobAlgorithm(pl, type, mobile, name) {
		//检测模式//看看是否为空
		if (pl == null && type == null && mobile == null) return
		for (let i in type) {
			let Inside = i /*标准名称*/
			if (Inside == mobile.type) { //对比
			let acc = type[Inside].name;//名称
			let aexp = type[Inside].Exp;//经验
			new addExp(pl.xuid, aexp);/*添加经验*/
			//如果想开启消息的提示，直接把下面两个杠取消就行
			/*消息*///pl.tell(Gm_Tell + name +" "+acc+" 获得经验 + "+aexp);
			return true;
			}
		}
	}

//■■■■■■■■■■■■■■
/*命令注册*/
function LevelCmd() {
	try {
		const cmd = mc.newCommand("level", "LevelExp等级系统主命令", PermType.Any);
		cmd.setAlias("lvl");//别名=(如:/lvl addlevel <name> <count>)
		cmd.setEnum("PointsAction", ["addpoints", "delpoints", "setpoints"]);//属性点模式
		cmd.setEnum("LevelAction", ["addlevel", "dellevel", "setlevel"]);//等级模式
		cmd.setEnum("ExpAction", ["addexp", "delexp", "setexp"]);//经验模式
		cmd.setEnum("NaAction", ["my", "levelup"]);//个人等级
		cmd.setEnum("ReAction", ["reload"]);//重载以及配置
		cmd.setEnum("InfoAction", ["info"]);//查询某个玩家

		cmd.mandatory("action", ParamType.Enum, "PointsAction", 1);
		cmd.mandatory("action", ParamType.Enum, "LevelAction", 1);
		cmd.mandatory("action", ParamType.Enum, "ExpAction", 1);
		cmd.mandatory("action", ParamType.Enum, "InfoAction", 1);
		cmd.mandatory("action", ParamType.Enum, "ReAction", 1);
		cmd.mandatory("action", ParamType.Enum, "NaAction", 1);

		cmd.mandatory("name", ParamType.String);//玩家名
		cmd.optional("count", ParamType.Int);//数量

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
		logger.error("注册命令失败！");
		logger.error("请检查命令是否被其他插件注册！");
		}
	}

//好像某些原因。有的限制没有限到(ー_ー)!!
function CallBack(_cmd, ori, out, res) {
		logger.debug(JSON.stringify(res.name)); 
		let plxuid, pl = ori.player;
		let acc = ""; /*嘿嘿嘿*/
		switch (res.action) {

		//重载配置(仅后台)
		case "reload":
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			/*重载*/Config.reload(); /*生物*/Mode.reload(); 
			/*方块*/Break.reload(); /*方块*/Place.reload();
			/*奖励*/Daemon.reload(); 
			return out.success(Gm_Tell + "---配置文件重载完成---");
		break;

		//玩家信息(仅玩家)
		case "my":
			if (!ori.player) return out.error(Gm_Tell + '获取玩家对象失败！');
			return onPlayForm(pl, acc, acc, acc, acc, acc); /*自己*/
		break;

		//进行升级(限玩家)
		case "levelup":
			if (!ori.player) return out.error(Gm_Tell + '获取玩家对象失败！');
			if (Config.get("AutomaticLevelUp") == true) {
				return out.error(Gm_Tell + "已开启自动升级，无需使用此命令");
			}else{
				if (Config.get("AutoLevelUp")) return out.error(Gm_Tell + "§l§e已开启自动升级，无需升级");
				return LevelUp(pl.xuid, false); //执行手动升级
			}
		break;

		//查询玩家信息(无限制)
		case "info":
			/*if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");*/
			/*if (!ori.player) return out.error('获取玩家对象失败！');*/
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `获取玩家 [ ${res.name} ] 的XUID失败!`);
			}
			let dat = getInfo(plxuid); /*查询玩家数据*/
			/*查询玩家是否存在*/
			if (dat["Name"] == null || dat["Name"] == "undefined") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 信息不存在!`);
			}
			/*查询等级是否存在*/
			if (dat["Level"] == null || dat["Level"] == "undefined") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 等级不存在!`);
			}
			let Na = dat["Name"], Lv = dat["Level"], Ex = dat["Exp"], Po = dat["Points"];
			let He = dat["Health"], At = dat["Attack"], De = dat["Defence"], Ti = dat["Time"];
			let Next = getNextLevelExp(Lv);/*所需经验*/
			let info = ""; /*嘎嘎嘎*/
			info += `§l---------- 查询玩家信息 ---------- \n`;
			info += `§l | §b查询玩家: §aLV.${Lv} §f${Na} \n`;
			info += `§l | §b经验值: §f[ §6${Ex} §f/ §e${Next} §f] §f[ §5${getHeadExp(plxuid)} §f]\n`;
			info += `§l | §b属性点: §f[ §e${Po} §f] \n`;
			info += `§l | §b血量: §f[ §c${He} §f] \n`;
			info += `§l | §b攻击: §f[ §d${At} §f] \n`;
			info += `§l | §b防御: §f[ §3${De} §f] \n`;
			info += `§l | §b注册时间: §d[ §f${Ti} §d] \n§r`;
			info += `§l-----------------------------`;
			return out.success(info);
		break;

		//添加属性点(仅后台)
		case "addpoints": 
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要添加的属性点!!`);
			}
			if (res.count <= Config.get("MaxPoints") && res.count >= Config.get("MaxPoints")) {
				return out.error(Gm_Tell + `输入的属性点必须在 ${Config.get("MinLevel")} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (addPoints(plxuid, res.count)) out.success(Gm_Tell + `已添加 [ ${res.name} ] 的属性点为 [ ${res.count} ] !!`);
		break;


		//添加属性点(仅后台)
		case "delpoints": 
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要添加的属性点!!`);
			}
			if (res.count <= Config.get("MaxPoints") && res.count >= Config.get("MaxPoints")) {
				return out.error(Gm_Tell + `输入的属性点必须在 ${Config.get("MinLevel")} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (delPoints(plxuid, res.count)) out.success(Gm_Tell + `已减少 [ ${res.name} ] 的属性点为 [ ${res.count} ] !!`);
		break;

		//添加属性点(仅后台)
		case "setpoints": 
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要添加的属性点!!`);
			}
			if (res.count <= Config.get("MaxPoints") && res.count >= Config.get("MaxPoints")) {
				return out.error(Gm_Tell + `输入的属性点必须在 ${Config.get("MinLevel")} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (setPoints(plxuid, res.count)) out.success(Gm_Tell + `已设置 [ ${res.name} ] 的属性点为 [ ${res.count} ] !!`);
		break;

		//添加等级(仅后台)
		case "addlevel":
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要添加的等级!!`);
			}
			if (getLevel(plxuid) == "Max") {
				return out.error(Gm_Tell + `玩家 ${res.name} 等级已满无法继续添加!!`);
			}
			if (res.count <= Config.get("MinLevel")-1 && res.count >= Config.get("MaxLevel")+1) {
				return out.error(Gm_Tell + `输入的等级必须在 ${Config.get("MinLevel")} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (addLevel(plxuid, res.count)) out.success(Gm_Tell + `已添加 [ ${res.name} ] 的等级为 [ ${res.count} ] !`);
		break;

		//减少等级(仅后台)
		case "dellevel":
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要减少的等级!!`);
			}
			if (res.count <= Config.get("MinLevel")-1 && res.count >= Config.get("MaxLevel")+1) {
				return out.error(Gm_Tell + `输入的等级必须在 ${Config.get("MinLevel")-1} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (delLevel(plxuid, res.count)) out.success(Gm_Tell + `已减少 [ ${res.name} ] 的等级为 [ ${res.count} ] !`);
		break;

		//设置等级(仅后台)
		case "setlevel":
			if (ori.type !== 7) return out.error(Gm_Tell + "此命令仅限控制台执行");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要设置的等级!!`);
			}
			if (res.count <= Config.get("MinLevel")-1 && res.count >= Config.get("MaxLevel")+1) {
				return out.error(Gm_Tell + `输入的等级必须在 ${Config.get("MinLevel")-1} ~ ${Config.get("MaxLevel")} 之内!!`);
			}
			//查询是否成功
			if (setLevel(plxuid, res.count)) out.success(Gm_Tell + `已设置 [ ${res.name} ] 的等级为 [ ${res.count} ] !`);
		break;

		//添加经验(仅后台)
		case "addexp":
			if (ori.type !== 7) return out.error(Gm_Tell + "请在控制台上使用此命令");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要添加的经验!!`);
			}
			//查询是否成功
			if (addExps(plxuid, res.count)) out.success(Gm_Tell + `已添加 [ ${res.name} ] 的经验为 [ ${res.count} ] !`);
		break;

		//减少经验(仅后台)
		case "delexp":
			if (ori.type !== 7) return out.error(Gm_Tell + "请在控制台上使用此命令");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要减少的经验!!`);
			}
			//查询是否成功
			if (delExp(plxuid, res.count)) out.success(Gm_Tell + `已减少 [ ${res.name} ] 的经验为 [ ${res.count} ] !`);
		break;

		//设置经验(仅后台)
		case "setexp":
			if (ori.type !== 7) return out.error(Gm_Tell + "请在控制台上使用此命令");
			if (res.name == null || res.name == "") {
				return out.error(Gm_Tell + `请输入玩家名!`);
			}
			/*获取Xuid*/plxuid = data.name2xuid(res.name);
			if (plxuid == null || plxuid == "") {
				return out.error(Gm_Tell + `玩家 [ ${res.name} ] 的XUID获取失败!`);
			}
			if (res.count == null || res.count == "") {
				return out.error(Gm_Tell + `请输入要设置的经验!!`);
			}
			//查询是否成功
			if (setExp(plxuid, res.count)) out.success(Gm_Tell + `已设置 [ ${res.name} ] 的经验为 [ ${res.count} ] !`);
		break;

		/*默认*/
		default: /*默认*/
			if (!ori.player) return out.error(Gm_Tell + '获取对象失败, 或者是命令不完整!');
			return onAdminForm(pl, "");//进入GUI(玩家使用)
		}
	}


/**还没写不要在意
* @param {Player} pl 操作玩家
*////GUI设置
function onAdminForm(pl, txt = "") {
		if (pl == null) return
		const fm = mc.newSimpleForm();
		let mcc = ""; /*嘿嘿嘿*/
		fm.setTitle("§l§f===== [ 等级系统 ] =====");
		fm.addButton('§l§f==§6升级§f==\n'+txt);//0
		fm.addButton('§l§a我的等级');//1
		fm.addButton('§l§d排 行 榜');//2
		if (pl.isOP()) {
		fm.addButton('§l§4修改玩家');//3
		fm.addButton('§l§6配置文件');//4
		}
		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return
				switch (dt) {
					case 0:
						if (Config.get("AutoLevelUp")) return onAdminForm(pl, "§l§e已开启自动升级，无需升级");
						pl.tell(Gm_Tell + "正在进行升级操作 !!!");
						LevelUp(pl.xuid, false);/*执行升级操作*/
					break; //升级

					case 1: 
						onPlayForm(pl, mcc, mcc, mcc, mcc, mcc); 
					break; //玩家设置

					case 2: 
						onPlayTopForm(pl); 
					break; //排行榜

					case 3: 
						let players = {}
						for(let i of mc.getOnlinePlayers()) {
							if (i.xuid!=pl.realName){
							players[i.realName] = i.xuid
							}
						}
						LevelForm(pl, players, mcc); 
					break; //修改玩家
					/*配置文件*/
					case 4: PlayerSetingForm(pl); break; //配置文件
				}
		});
	}

//■■■■■■■■■■■■■■
/* @param {Player} pl 玩家
*////玩家个人信息
function onPlayForm(pl, mo, t1, t2, t3, t4) {
		if (pl == null && getLevel(pl.xuid) == "undefined") return
		let texture = getNextLevelExp(getLevel(pl.xuid));
		const fm = mc.newSimpleForm();
		fm.setTitle("§l§f===== [ 个人信息 ] =====");
		let minr = ""
		minr += `\n | §b玩家名: §aLV.${getLevel(pl.xuid)} §f${pl.realName}`;
		minr += `\n | §b经验值: §f[§6${getExp(pl.xuid)}§f/§e${texture}§f] §f[§5${getHeadExp(pl.xuid)}§f]`;
		minr += `\n | §b属性点: §f[§d${getPoints(pl.xuid)}§f]`+t1;
		minr += `\n | §b总血量: §f[§c${getHealth(pl.xuid)}§f]`+t2;
		minr += `\n | §b攻击力: §f[§6${getAttack(pl.xuid)}§f]`+t3;
		minr += `\n | §b防御力: §f[§3${getDiane(pl.xuid)}§f]`+t4;
		fm.setContent("§l§f以下是目标玩家信息: " + minr + "\n\n" + mo);

		let mh = getHealth(pl.xuid), maxh = Config.get("MaxHealth");
		fm.addButton(`§l§f血量 §f[§6${mh}§f/§4${maxh}§f]\n§e点击加点`);//0

		let ma = getAttack(pl.xuid), maxa = Config.get("MaxAttack");
		fm.addButton(`§l§f攻击 §f[§6${ma}§f/§4${maxa}§f]\n§e点击加点`);//1

		let md = getDiane(pl.xuid), maxd = Config.get("MaxDiane");
		fm.addButton(`§l§f防御 §f[§6${md}§f/§4${maxd}§f]\n§e点击加点`);//2

		fm.addButton('§l§b上一页', 'textures/ui/icon_import');//3
		fm.addButton(`§l§c关闭`, 'textures/ui/cancel');//4

		pl.sendForm(fm, (pl, dt) => {
			if (dt == null) return
				let a = " §f=>  §c-1",	b = " §f=>  §6+1";
				let mc = "";
				switch (dt) {
					case 0: 
						if (getPoints(pl.xuid) >= 1) { //属性点必须大于等于0
							let maxh = Config.get("MaxHealth");
							if (getHealth(pl.xuid) >= maxh) return onPlayForm(pl, "§l§f=== §c血量已达上限 §f===", mc, mc, mc, mc);
								if (delPoints(pl.xuid, 1));//减属性
								if (addHealth(pl.xuid, 1));//加血量
								if (onUpData(pl.xuid));//刷新
								if (onPlaySound(pl, true));
								onPlayForm(pl, "§l§f=== §a血量添加成功 §f===", a, b, mc, mc);
						} else {
							if (onPlaySound(pl, false));
							onPlayForm(pl, "§l§f=== §c你的属性点不足 §f===", mc, mc, mc, mc);
						}
					break; //加血量

					case 1: 
						if (getPoints(pl.xuid) >= 1) { //属性点必须大于等于0
							let maxa = Config.get("MaxAttack");
							if (getAttack(pl.xuid) >= maxa) return onPlayForm(pl, "§l§f=== §c攻击力已达上限 §f===", mc, mc, mc, mc);
								if (delPoints(pl.xuid, 1));//减属性
								if (addAttack(pl.xuid, 1));//加攻击
								if (onUpData(pl.xuid));//刷新
								if (onPlaySound(pl, true));
								onPlayForm(pl, "§l§f=== §a攻击添加成功 §f===", a, mc, b, mc);
						} else {
							if (onPlaySound(pl, false));
							onPlayForm(pl, "§l§f=== §c你的属性点不足 §f===", mc, mc, mc, mc);
						}
					break; //加攻击

					case 2: 
						if (getPoints(pl.xuid) >= 1) { //属性点必须大于等于0
							let maxd = Config.get("MaxDiane");
							if (getDiane(pl.xuid) >= maxd) return onPlayForm(pl, "§l§f=== §c防御力已达上限 §f===", mc, mc, mc, mc);
								if (delPoints(pl.xuid, 1));//减属性
								if (addDiane(pl.xuid, 1));//加防御
								if (onUpData(pl.xuid));//刷新
								if (onPlaySound(pl, true));
								onPlayForm(pl, "§l§f=== §a防御添加成功 §f===", a, mc, mc, b);
						} else {
							if (onPlaySound(pl, false));
							onPlayForm(pl, "§l§f=== §c你的属性点不足 §f===", mc, mc, mc, mc);
						}
					break; //加防御

					case 3: onAdminForm(pl, ""); break;//返回
					case 3: /*空白符号*/ break;//关闭
				}
		});
	}

/*声音列表*/
/*单独写出来，为了在其他地方使用*/
function onPlaySound(pl, mode) {
		if (pl == null) return
		if (mode == true){
		mc.runcmdEx(`execute as ${pl.realName} run playsound note.pling`);
		}else{
		mc.runcmdEx(`execute as ${pl.realName} run playsound mob.villager.no`);
		}
	}

/** 等级排行榜
* @param {Object} pl 玩家对象
* @returns {Boolean}*/
function onPlayTopForm(pl) {
		if (pl == null) return
		let xuid1 = data.getAllPlayerInfo(); /*onDataAll()*/
		xuid1.sort((a, b) => { getLevel(a.xuid) - getLevel(b.xuid); });
		let str = ""
			xuid1.forEach((key, i) => str += `§l§f>  §l§a${i+1}§b   ◆   §aLV.${getLevel(key.xuid)}   §f${key.name}   ${getHeadExp(key.xuid)}\n`);
		pl.sendModalForm("§l§f===== [ 等级排行榜 ] =====", str, "§l§b上一页", "§l§c关闭", (pl, res) => {
			if(res){ 
				onAdminForm(pl, ""); /*点击上一页返回到其他GUI*/
			}
		});
	}

/*玩家列表*/
function LevelForm(pl, players, txt) {
		if (players == null) return
		if (!pl.isOP()) return pl.tell(Gm_Tell + "§c你没有权限!");
		let pllist = Object.keys(players);
		const fm = mc.newCustomForm();
		fm.setTitle("§l§f===== [ 修改玩家配置 ] =====");
		fm.addLabel("§l§b请选择目标玩家进行处理!");//0
		fm.addSwitch("§l§e选择§f[开启] §f-- §d输入§f[关闭]", true); //1
		fm.addDropdown("§l§e请选择指定玩家(在线)", pllist);//2
		fm.addInput("§l§d请输入玩家名(离线) "+txt, "玩家名");//3
		fm.addSwitch("§l§e当前§f[开启] §d-- §b返回§f[关闭]", true); //4

		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return
			if(dt[4] == false){ //返回
			onAdminForm(pl, "");
			return
			}else{
			if(dt[1] == true){ //模式
			let topl = players[pllist[dt[2]]];
			if(topl == null){ 
			for(let i of mc.getOnlinePlayers()) {
			if (i.xuid!=pl.realName){
			players[i.realName] = i.xuid
			}	}
			LevelForm(pl, players, "§l §c无法获取目标玩家对象!");
			return
			}
			SetPlayerForm(pl, topl, "");
			}else{
			if(dt[3] == "") {
			LevelForm(pl, players, "§l §c请输入离线玩家ID!");
			return
			}
			let office = {}
			let kong = data.getAllPlayerInfo()
			for (let i of kong){
			if(i.name.toUpperCase().includes(dt[3].toUpperCase()) && (i.xuid!=pl.realName)){
			office[i.name] = i.xuid
			}	}
			SiteForm(pl, office, "");
			}
			}
		});
	}

function SiteForm(pl, office, txt) {
		if (pl == null) return
		if (office == null) return
		let pllist = Object.keys(office)
		const fm = mc.newCustomForm();
		fm.setTitle("§l§f===== [ 选择离线玩家 ] =====");
		fm.addLabel("§l§a请在下列选择目标玩家!");//0
		fm.addDropdown("§l§e请选择玩家 " + txt, pllist);//1
		fm.addSwitch("§l§e当前§f[开启] §d-- §b返回§f[关闭]", true); //2

		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return
			if(dt[2] == false){ //模式
			let players = {}
			for(let i of mc.getOnlinePlayers()) {
			if (i.xuid!=pl.realName){
			players[i.realName] = i.xuid
			}	}
			new LevelForm(pl, players, ""); 
			}else{
			let topl = office[pllist[dt[1]]];
			if(topl == null){ 
			SiteForm(pl, office, "§l§c无法获取目标玩家对象!");
			return
			}
			SetPlayerForm(pl, topl, "");
			}
		});
	}

/*修改某玩家属性*/
function SetPlayerForm(pl, topl, txt) {
		if (pl == null && topl == null) return
		if (!pl.isOP()) {
			return pl.tell(Gm_Tell + "§c你没有权限!");
		}
		const fm = mc.newCustomForm();
		let ta = data.xuid2name(topl); let tan = "";
		let texture = getNextLevelExp(getLevel(topl));
		fm.setTitle("§l§f===== [ 修改玩家等级 ] =====");
		tan += `\n | §b玩家名: §aLV.${getLevel(topl)} §f${ta}`;
		tan += `\n | §b经验值: §f[§6${getExp(topl)}§f/§e${texture}§f] §f[§5${getHeadExp(topl)}§f]`;
		tan += `\n | §b属性点: §f[§d${getPoints(topl)}§f]`;
		tan += `\n | §b血量: §f[§c${getHealth(topl)}§f]`;
		tan += `\n | §b攻击: §f[§6${getAttack(topl)}%§f]`;
		tan += `\n | §b防御: §f[§3${getDiane(topl)}%§f]`;
		fm.addLabel("§l§e注意!修改请注意不要乱修因为没有限制!\n§f以下是目标玩家信息:" + tan);//0
		fm.addDropdown("§l§e请选择属性 ", ["等级", "经验", "属性点", "血量", "攻击", "防御"], 0);//1
		fm.addDropdown("§l§b请选择模式 ", ["添加", "减少", "设置"], 0);//2
		fm.addInput("§l§d请输入数量: " + txt, "数量");//3
		fm.addSwitch("§l§e当前§f[开启] §d-- §b返回§f[关闭]", true); //4

		pl.sendForm(fm, (pl, dt) => {
			if(dt == null) return
			if(dt[4] == false) return onAdminForm(pl, "");/*返回*/
			if(dt[1] == 0){ //属性//等级
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addLevel(topl, Number(dt[3]));//添加
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家等级成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delLevel(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家等级成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setLevel(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a设置玩家等级成功!!!");
				}
			return
			}

			if(dt[1] == 1){ //经验
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addExps(topl, Number(dt[3]));//添加//注意:这里只是加经验，不会升级的(ー_ー)!!
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家经验成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delExp(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家经验成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setExp(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a设置玩家经验成功!!!");
				}
			return
			}

			if(dt[1] == 2){ //属性点
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addPoints(topl, Number(dt[3]));//添加
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家属性点成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delPoints(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家属性点成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setPoints(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a设置玩家属性点成功!!!");
				}
			return
			}

			if(dt[1] == 3){ //血量
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addHealth(topl, Number(dt[3]));//添加
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家血量成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delHealth(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家血量成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setHealth(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a设置玩家血量成功!!!");
				}
			return
			}

			if(dt[1] == 4){ //攻击
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addAttack(topl, Number(dt[3]));//添加
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家攻击成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delAttack(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家攻击成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setAttack(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a设置玩家攻击成功!!!");
				}
			return
			}

			if(dt[1] == 5){ //防御
				if(dt[2] == 0){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					addDiane(topl, Number(dt[3]));//添加
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a添加玩家防御成功!!!");
				}
				if(dt[2] == 1){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					delDiane(topl, Number(dt[3]));//减少
					if (onPlaySound(pl, true));
					SetPlayerForm(pl, topl, "§a减少玩家防御成功!!!");
				}
				if(dt[2] == 2){
					if (dt[3] == null && dt[3] == "undefined") return SetPlayerForm(pl, topl, "§c你没有输入数量!!!");
					if (dt[3] <= 0) return SetPlayerForm(pl, topl, "§c不能小于零!!!");
					setDiane(topl, Number(dt[3]));//减少
					mc.runcmdEx(`execute as ${pl.realName} run playsound random.anvil_use`);
					SetPlayerForm(pl, topl, "§a设置玩家防御成功!!!");
				}
			return
			}
		});
	}

/*配置文件*/
function PlayerSetingForm(pl) {
		if (pl == null) return
		if (!pl.isOP()) return pl.tell(Gm_Tell + "§c你没有权限!");
		const fm = mc.newCustomForm();
		fm.setTitle("§l===== [ 配置系统列表 ] =====");

		fm.addSwitch("§l§e当前§f[开启] §d-- §b返回§f[关闭]", true); //0

		fm.addSwitch("§l是否自动升级", Config.get("AutoLevelUp"));//1
		
		fm.addInput("§l最小等级下限", "1", `${Config.get("MinLevel")}`);//2
		fm.addInput("§l最大等级上限", "100", `${Config.get("MaxLevel")}`);//3
		fm.addInput("§l每级所需经验: 如:(50*2=100)", "200", `${Config.get("MaxExp")}`);//4

		fm.addInput("§l最大血量上限", "60", `${Config.get("MaxHealth")}`);//5
		fm.addInput("§l最大攻击上限", "100", `${Config.get("MaxAttack")}`);//6
		fm.addInput("§l最大防御上限", "100", `${Config.get("MaxDiane")}`);//7
		fm.addInput("§l最大属性点上限", "20000", `${Config.get("MaxPoints")}`);//8

		fm.addSwitch("§l是否防止精准采集", Config.get("AccurateCollection"));//9

		fm.addSwitch("§l玩家进入游戏显示", Config.get("PlayJoinEnable"));//10
		fm.addSwitch("§l玩家退出游戏显示", Config.get("PlayLeftEnable"));//11

		fm.addSwitch("§l玩家底部显示", Config.get("DisPlayMEnable"));//12
		fm.addSwitch("§l玩家头部显示", Config.get("DisPlayTEnable"));//13
		fm.addInput("§l显示速度", "600", `${Config.get("DisPlayTime")}`);//14

		fm.addSwitch("§l玩家死亡是否扣除等级", Config.get("PlayerDeathEnable"));//15
		fm.addInput("§l被扣除的模式( Level ~ Exp )", "Exp", `${Config.get("PlayDeathMode")}`);//16
		fm.addInput("§l最小扣除等级", "1", `${Config.get("DeathMinLevel")}`);//17
		fm.addInput("§l最大扣除等级", "5", `${Config.get("DeathMaxLevel")}`);//18

		fm.addSwitch("§l获得经验提示音", Config.get("PlayExpEnable"));//19
		fm.addInput("§l经验提示音", "random.orb", `${Config.get("PlayExpSound")}`);//20

		fm.addSwitch("§l玩家升级提示音", Config.get("PlayLevelEnable"));//21
		fm.addInput("§l升级提示音", "random.levelup", `${Config.get("PlayLevelSound")}`);//22

		fm.addSwitch("§l吃东西获得是否经验", Config.get("onAteEventEnable"));//23
		fm.addInput("§l自定义经验", "1", `${Config.get("onAteExp")}`);//24

		fm.addSwitch("§l杀死生物是否获得经验", Config.get("ModDieExpEnable"));//25
		fm.addInput("§l自定义经验", "1", `${Config.get("ModDieExp")}`);//26

		fm.addSwitch("§l破坏方块是否获得经验", Config.get("BlockExpEnable"));//27
		fm.addInput("§l自定义经验", "1", `${Config.get("BlockExp")}`);//28

		fm.addSwitch("§l放置方块是否获得经验", Config.get("PlaceEventEnable"));//29
		fm.addInput("§l自定义经验", "1", `${Config.get("PlaceEventExp")}`);//30

		fm.addSwitch("§l是否开启掉落获得经验", Config.get("EventMainEnable"));//31
		fm.addSwitch("§l是否获得自定义经验", Config.get("ExpEventEnable"));//32
		fm.addInput("§l自定义经验", "1", `${Config.get("ExpEventExp")}`);//33

		pl.sendForm(fm, (pl, dt) => {
		if (dt == null) return
		if (dt[0] == false) return onAdminForm(pl, ""); 
		//for (const i = 0; i > 28; i++) {}/*后面才用*/
		let conf = {
			"AutoLevelUp": Boolean(dt[1]).valueOf(), /*是否自动升级*/
			"MinLevel": Number(dt[2]), /*最小*/
			"MaxLevel": Number(dt[3]), /*最大*/
			"MaxExp": Number(dt[4]), /*所需*/

			"MaxHealth": Number(dt[5]), /*血量*/
			"MaxAttack": Number(dt[6]), /*攻击*/
			"MaxDiane": Number(dt[7]), /*防御*/
			"MaxPoints": Number(dt[8]), /*属性点*/

			"AccurateCollection": Boolean(dt[9]).valueOf(), /*精准采集*/

			"PlayJoinEnable": Boolean(dt[10]).valueOf(), /*进入*/
			"PlayLeftEnable": Boolean(dt[11]).valueOf(), /*退出*/

			"DisPlayMEnable": Boolean(dt[12]).valueOf(), /*头显*/
			"DisPlayTEnable": Boolean(dt[13]).valueOf(), /*底显*/
			"DisPlayTime": Number(dt[14]), /*显示速度*/

			"PlayerDeathEnable": Boolean(dt[15]).valueOf(), /*死亡扣等级*/
			"PlayDeathMode": dt[16], /*扣除模式*/
			"DeathMinLevel": Number(dt[17]), /*小*/
			"DeathMaxLevel": Number(dt[18]), /*大*/

			"PlayExpEnable": Boolean(dt[19]).valueOf(), /*声音开关*/
			"PlayExpSound": dt[20], /*获得经验声*/

			"PlayLevelEnable": Boolean(dt[21]).valueOf(), /*声音开关*/
			"PlayLevelSound": dt[22], /*升级声*/

			"onAteEventEnable": Boolean(dt[23]).valueOf(), /*吃东西开关*/
			"onAteExp": Number(dt[24]), /*自定义*/

			"ModDieExpEnable": Boolean(dt[25]).valueOf(), /*杀生物开关*/
			"ModDieExp": Number(dt[26]), /*自定义*/

			"BlockExpEnable": Boolean(dt[27]).valueOf(), /*破坏方块开关*/
			"BlockExp": Number(dt[28]), /*自定义*/

			"PlaceEventEnable": Boolean(dt[29]).valueOf(), /*放置方块开关*/
			"PlaceEventExp": Number(dt[30]), /*自定义*/

			"EventMainEnable": Boolean(dt[31]).valueOf(), /*掉落的经验开关*/
			"ExpEventEnable": Boolean(dt[32]).valueOf(), /*自定义开关*/
			"ExpEventExp": Number(dt[33]), /*自定义*/
		};//浪费空间
		File.writeTo(_filePath + "Config.json", JSON.stringify(conf, null, '\t'));
		Config.reload(); /*刷新配置*/
		pl.sendModalForm("§l提示",`§l§a操作已保存!`,"§l§b上一页","§l§c关闭", (pl, res) => { if(res){ PlayerSetingForm(pl) } });
		});
	}

//■■■■■■■■■■■■
//新版导出API

/*前置库*/
function regPapi() {
		const { Version } = require('./GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS');
		const PAPI = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS.js').PAPI;
		if (!Version || !PAPI) {
		logger.error("加载插件失败！找不到前置库 GMLIB LegacyRemoteCallApi！");
		logger.error("请安装GMLIB LegacyRemoteCallApi！");
		return;
		}
		PAPI.registerPlayerPlaceholder(getNextLevelExp, PLUGIN_Name, "lvl_nextexp");//所需升级经验
		PAPI.registerPlayerPlaceholder(getLevel, PLUGIN_Name, "lvl_getlevel");//获得等级
		PAPI.registerPlayerPlaceholder(getExp, PLUGIN_Name, "lvl_getexp");//获得经验
		PAPI.registerPlayerPlaceholder(getHeadExp, PLUGIN_Name, "lvl_gethead");//获得总经验
		PAPI.registerPlayerPlaceholder(getPoints, PLUGIN_Name, "lvl_getpoint");//获得属性点
		PAPI.registerPlayerPlaceholder(getHealth, PLUGIN_Name, "lvl_gethealth");//或者血量
		PAPI.registerPlayerPlaceholder(getAttack, PLUGIN_Name, "lvl_getattack");//获得攻击力
		PAPI.registerPlayerPlaceholder(getDiane, PLUGIN_Name, "lvl_getdiane");//获得防御力
		logger.info('注册PAPI变量完毕');
	}

//获得需要升级的经验大小
ll.export((level) => {
		return getNextLevelExp(level); 
		/*获取经验*/	
	}, "LevelExp", "LevelExp_getNextLevelExp");

//获得等级
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getLevel(xuid); 
		/*获取等级*/
	}, "LevelExp", "LevelExp_getLevel");

//获得总经验
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getHeadExp(xuid); 
		/*获取总经验*/
	},  "LevelExp", "LevelExp_getHeadExp");

//获得经验
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getExp(xuid); 
		/*获取经验*/
	},  "LevelExp", "LevelExp_getExp");

//获得属性点
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getPoints(xuid); 
		/*获取属性点*/
	}, "LevelExp", "LevelExp_getPoints");

//获得最大血量
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getHealth(xuid); 
		/*获取属性点*/
	}, "LevelExp", "LevelExp_getHealth");

//获得攻击力
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getAttack(xuid); 
		/*获取属性点*/
	}, "LevelExp", "LevelExp_getAttack");

//获得防御力
ll.export((xuid) => {
		if (!isTable(xuid)) return null; 
		return getDiane(xuid); 
		/*获取属性点*/
	}, "LevelExp", "LevelExp_getDiane");

//■■■■■■■■■■■■

//添加等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return addLevel(xuid, count); 
		/*添加等级*/
	}, "LevelExp", "LevelExp_addLevel");

//添加总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return addHeadExp(xuid, count); 
		/*添加总经验*/
	}, "LevelExp", "LevelExp_addHeadExp");

//添加经验《不升级》
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return addExps(xuid, count); //注意有 s ★★
		/*添加经验*/
	}, "LevelExp", "LevelExp_addExp");

//添加属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return addPoints(xuid, count); 
		/*添加属性点*/
	}, "LevelExp", "LevelExp_addPoints");

//■■■■■■■■■■■■

//减少等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return delLevel(xuid, count); 
		/*减少等级*/
	}, "LevelExp", "LevelExp_delLevel");

//减少总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return delHeadExp(xuid, count); 
		/*减少总经验*/
	}, "LevelExp", "LevelExp_delHeadExp");

//减少经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return delExp(xuid, count); 
		/*减少经验*/
	}, "LevelExp", "LevelExp_delExp");

//减少属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return delPoints(xuid, count); 
		/*添加等级*/
	}, "LevelExp", "LevelExp_delPoints");

//■■■■■■■■■■■■

//设置等级
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return setLevel(xuid, count); 
		/*设置等级*/
	}, "LevelExp", "LevelExp_setLevel");

//设置总经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return setHeadExp(xuid, count); 
		/*添加经验*/
	}, "LevelExp", "LevelExp_setHeadExp");

//设置经验
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return setExp(xuid, count); 
		/*设置经验*/
	}, "LevelExp", "LevelExp_setExp");

//设置属性点
ll.export((xuid, count) => {
		if (!isTable(xuid)) return null; 
		return setPoints(xuid, count); 
		/*添加等级*/
	}, "LevelExp", "LevelExp_setPoints");

/* 傻瓜式操作●如●
ll.require("LevelExp.js"); //接入插件
let getLevel = lxl.import("LevelExp", "LevelExp_getLevel');
let getExp = lxl.import("LevelExp", "LevelExp_getExp');
let lvl = getLevel(xuid); //获得等级(xuid)
let exp = getExp(xuid); //获得经验(xuid)
*/
