/** 显示美化

一：头显支持PAPI。
二：底显支持PAPI。

核心：
${health}   = //当前血量
${maxheal}  = //最大血量

${name}     = //玩家名字
${level}    = //等级
${myexp}    = //经验
${mynex}    = //需求
${admin}    = //权限

[以及其他PAPI]

支持其他PAPI
*/

/*LevelExp-v3 查询数据*/
let getPlayData = lxl.import("LevelExp", "LevelExp_getPlayData");

//LevelExp-v3 等级需求
let getNextLevelExp = lxl.import("LevelExp", "LevelExp_getNextLevelExp");

//PAPI
const PAPI = ll.hasExported('BEPlaceholderAPI', 'translateStringWithPlayer') ? ll.import('BEPlaceholderAPI', 'translateStringWithPlayer') : str => str;

//配置文件 
const Config = new JsonConfigFile(".\\plugins\\LevelExp\\plugins\\LvTips\\Config.json", JSON.stringify({
		"VERSION": 1,																//配置版本
		/*动态显示开关*/
		"Mode": "TIPS",																/*模式[ TIPS / BOSS ]*/
		"Calle": true,																/*底部开关*/
		"Title": true,																/*头部开关*/
		"TitleText": "§l§aLV.${level} §f${name}",								//例如 Lv.100\nMineFeng
		"display": "§l§f等级: §aLV.${level} §f(§6${myPen}§f) §f经验: §b[ §e${myexp}§d/§6${mynex} §b]",
		"Time": 1200																/*显示速度*/
	}));

//头部显示开关 //动态显示开关
let isTitle = Config.get("Title"), isCall = Config.get("Calle");					//本地配置
//模式 //刷新时间
let onMode = Config.get("Mode"), Times = Config.get("Time");						//本地配置

/* 监听进服事件 */
mc.listen('onJoin', function (pl) => { onJoinEvent(pl) });

/*动态显示*///这个我本来是想删除的，但是我想了想，还是加上去了 
function onJoinEvent(pl) {
		let tm = setInterval(function () {
		/*检查是否是NPC*/
		if (pl.isSimulatedPlayer() || !pl) return;
		if (pl.inWorld !== 1) {
			mc.getOnlinePlayers().forEach(one => {
			if (pl.xuid == one.xuid) {
				let content = getreplace(pl, JSON.stringify(Config.get("TitleText")));
				if (isTitle) pl.rename(PAPI((content), pl));						//头部显示
				if (isCall == true) {												//开关检测
					let barid = 8765; //Math.floor(Math.random() * 9999);			//生成ID
					let chat = getreplace(pl, JSON.stringify(Config.get("display")));
					//let chat = "§l   §f等级: §aLV."+myLvl+" §f经验: §b[ §e"+myExp+"§d/§6"+myNex+" §b]";
					if (onMode == "BOSS") pl.setBossBar(barid, PAPI((chat), pl), 100, 6);	//设置BOSS显示
					if (onMode == "TIPS") pl.removeBossBar(barid);					//删除BOSS显示
					if (onMode == "TIPS") pl.tell(PAPI((chat), pl), 5);
				}
			}
			});
		} else return clearInterval(tm);
		}, Times); //速度
	}


function getreplace(pl, key) {
		//let cmd = mc.runcmdEx("level reload");
		//if (!cmd) return
		let Conf = new JsonConfigFile(".\\plugins\\LevelExp\\Conf\\Config.json");
		//////////////////
		if (Conf.length <= 0) return
		//查询等级上限
		let Vmax = Conf.get('DefaultValue').MaxLevel;								//主配置
		//列表显示开关
		let isList = Conf.get('ListDisplay').Enable;								//主配置
		//获得列表积分版名称
		let Anm = Conf.get('ListDisplay').Name;										//主配置
		//查询数据
		let play = getPlayData(pl.xuid);											//查询数据
		if (!play) return															//不存在
		let Next = getNextLevelExp(play.Level);										//查询数据
		let myLvl = play.Level >= Vmax ? "Max" : play.Level;
		let myExp = play.Level >= Vmax ? "Max" : play.Exp;
		let myNex = play.Level >= Vmax ? "Max" : Next;

		let myPen = play.Level >= Vmax ? "Max" : ((play.Exp/Next)*100).toFixed(2)+"%";

		if (pl.isOP()) { Nats = "§cAdmin"; } else { Nats = "§bPLAYER"; }	//
		return key.replace(/"/g, "").replace(/\$\{nn\}/, "\n")
			.replace(/\$\{admin\}/, Nats)
			.replace(/\$\{health\}/, pl.health)
			.replace(/\$\{maxheal\}/, pl.maxHealth)
			.replace(/\$\{name\}/, pl.realName)
			.replace(/\$\{level\}/, myLvl.toString())
			.replace(/\$\{myexp\}/, myExp.toString())
			.replace(/\$\{mynex\}/, myNex.toString())
			.replace(/\$\{myPen\}/, myPen)
			.replace(/\$\{admin\}/, Nats);
	}



















