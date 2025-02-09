/*LevelExp-v3 查询数据*/
let getPlayData = lxl.import("LevelExp", "LevelExp_getPlayData");

let getTitle = [
		'淬体境', 
		'开元境', 
		'灵海境', 
		'离合境', 
		'真元境', 
		'神游境', 
		'超凡境', 
		'伪圣境', 
		'入圣境', 
		'圣王境', 
		'圣者境', 
		'返虚境', 
		'虚王境', 
		'道源境', 
		'帝尊境', 
		'准帝境', 
		'大帝境', 
		'仙帝境',
		'红尘仙',
		'主宰',
	];


//function regPapi() {
//		const { Version } = require('/plugins/GMLIB-LegacyRemoteCallApi/lib/GMLIB_API-JS');
//		const PAPI = require('/plugins/GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS.js').PAPI;
//		if (!Version || !PAPI) return;
//		PAPI.registerPlayerPlaceholder(PlayTitlet, "LevelExp", "lvl_title");	//注册
//	} //regPapi();



//获得幸运
ll.export((xuid) => { return PlayTitlet(xuid); }, "LevelExp", "LevelExp_title");


function PlayTitlet(pl) {
		if (!pl) return logger.warn('玩家对象错误!!!');
		if (pl != null) {
			let play = getPlayData(pl);
			return getLevelTitle(play.Level);
		} else return 0;
	}


function getLevelTitle(Lvl) {
		if (Lvl == null) return													//不存在
		const Level = Number(Lvl);												//定义
		if (Level > 0 && Level < 11) {
			return getTitle[0];
		}
		if (Level > 10 && Level < 21) {
			return getTitle[1];
		}
		if (Level > 20 && Level < 31) {
			return getTitle[2];
		}
		if (Level > 30 && Level < 41) {
			return getTitle[3];
		}
		if (Level > 40 && Level < 51) {
			return getTitle[4];
		}
		if (Level > 50 && Level < 61) {
			return getTitle[5];
		}
		if (Level > 60 && Level < 71) {
			return getTitle[6];
		}
		if (Level > 70 && Level < 81) {
			return getTitle[7];
		}
		if (Level > 80 && Level < 91) {
			return getTitle[8];
		}
		if (Level > 90 && Level < 101) {
			return getTitle[9];
		}
		if (Level > 100 && Level < 111) {
			return getTitle[10];
		}
		if (Level > 110 && Level < 121) {
			return getTitle[11];
		}
		if (Level > 120 && Level < 131) {
			return getTitle[12];
		}
		if (Level > 120 && Level < 131) {
			return getTitle[13];
		}
		if (Level > 140 && Level < 151) {
			return getTitle[14];
		}
		if (Level > 150 && Level < 161) {
			return getTitle[15];
		}
		if (Level > 160 && Level < 171) {
			return getTitle[16];
		}
		if (Level > 170 && Level < 181) {
			return getTitle[17];
		}
		if (Level > 180 && Level < 191) {
			return getTitle[18];
		}
		if (Level > 190 && Level < 201) {
			return getTitle[19];
		}
		if (Level >= 200) {
			return getTitle[19];
		}
	}

