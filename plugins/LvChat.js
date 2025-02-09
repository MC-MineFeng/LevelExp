
/** 聊天美化
一：支持PAPI。

二：内部配置。

核心：
${Y}         = 年
${M}         = 月
${D}         = 日
${h}         = 时
${m}         = 分
${s}         = 秒

${admin}    = //权限显示
${dim}      = //维度
${dimid}    = //维度
${name}     = //玩家名字

${ping}     = //延迟
${health}   = //当前血量
${maxheal}  = //最大血量

${bdsv}     = //版本
${speed}    = //速度
${loss}     = //
${tps}      = //TPS

${X}        = //坐标X
${Y}        = //坐标Y
${Z}        = //坐标Z

${lvnext}   = //需求
${level}    = //等级

${yuan}     = 金币名称
${money}    = 金币
${msg}      = 聊天
*/

/*LevelExp-v3 插件*/
let getNextLevelExp = lxl.import("LevelExp", "LevelExp_getNextLevelExp");

/*LevelExp-v3 插件*/
let getPlayData = lxl.import("LevelExp", "LevelExp_getPlayData");

/*LevelExp-v3 插件*/
let LogBook = lxl.import("LevelExp", "LevelExp_LogBook");


let getTitle = lxl.import("LevelExp", "LevelExp_title");

//PAPI
const PAPI = ll.hasExported('BEPlaceholderAPI', 'translateStringWithPlayer') ? ll.import('BEPlaceholderAPI', 'translateStringWithPlayer') : str => str;

//配置文件 
const Config = new JsonConfigFile(".\\plugins\\LevelExp\\plugins\\LvChat\\Config.json", JSON.stringify({
		"VERSION": 1,														//配置版本
		"COINNAME": "金币",													//金币名称
		"TEXT": '§l| §f[${admin}§f] §f[§6${lvtitle}§f] §aLV.${level} §7${name} §c> §f${msg}',	//自定义内容
	}));	// §f[§c${health}§f/§6${maxheal}§f] 

/* 监听聊天事件 */
mc.listen("onChat", function (pl, msg) { onChatEvent(pl, msg); return false; });

//聊天
function onChatEvent(pl, msg) {
		let Nats, play = getPlayData(pl.xuid);								/*查询数据*/
		let mylevel = play.Level || '0';									//等级
		let lvnext = getNextLevelExp(play.Level);							//需求
		let time = system.getTimeObj();
		let lvtitle = getTitle(pl.xuid);
		let info = pl.getDevice(), hand = pl.getHand(), pos = pl.pos;		//
		if (pl.isOP()) { Nats = "§cAdmin"; } else { Nats = "§bPLAYER"; }	//
		let tinew = new Date().getTime(), tiold = new Date().getTime(),
		content = JSON.stringify(Config.get("TEXT")).replace(/"/g, '')
			.replace(/\/\n/g, "\n")
			.replace(/\$\{admin\}/, Nats)
			.replace(/\$\{lvtitle\}/, lvtitle.toString())

			.replace(/\$\{speed\}/, pl.speed.toFixed(2))
			.replace(/\$\{level\}/, mylevel.toString())

			.replace(/\$\{lvnext\}/, lvnext.toString())
			.replace(/\$\{bdsv\}/, mc.getBDSVersion())

			.replace(/\$\{X\}/, pos.x.toFixed(2))
			.replace(/\$\{Y\}/, pos.y.toFixed(2))
			.replace(/\$\{Z\}/, pos.z.toFixed(2))

			.replace(/\$\{Y\}/, time.Y)
			.replace(/\$\{M\}/, time.M)
			.replace(/\$\{D\}/, time.D)
			.replace(/\$\{h\}/, time.h)
			.replace(/\$\{m\}/, time.m)
			.replace(/\$\{s\}/, time.s)

			.replace(/\$\{health\}/, pl.health)
			.replace(/\$\{maxheal\}/, pl.maxHealth)
			.replace(/\$\{name\}/, pl.realName)
			.replace(/\$\{ping\}/, info.avgPing)

			.replace(/\$\{dim\}/, pos.dim)
			.replace(/\$\{dimid\}/, pos.dimid)
			.replace(/\$\{loss\}/, info.avgPacketLoss.toFixed(2))
			.replace(/\$\{tps\}/, (1000*20 / (tinew-tiold)).toFixed(1))

			.replace(/\$\{yuan\}/, Config.get("COINNAME"))
			.replace(/\$\{money\}/, money.get(pl.xuid))
			.replace(/\$\{msg\}/, msg.toString());							/*聊天*/

		if (LogBook(pl, PAPI((content), pl)));
		return mc.broadcast(PAPI((content), pl));

	}




