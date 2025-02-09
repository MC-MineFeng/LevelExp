/*
说明
此扩展属于飞行
只有达到指定的等级就可以飞行了
如：你的等级达到LV.10 
就可以飞行，每秒消耗1点经验。
也可以在配置中修改消耗以及需求等级
*/
//LevelExp-v3 查询经验(XUID)
let getExp = lxl.import("LevelExp", "LevelExp_getExp");

//LevelExp-v3 减少经验(XUID, CONST)
let delExp = lxl.import("LevelExp", "LevelExp_delExp");

//LevelExp-v3 查询总经验(XUID)
let getHeadExp = lxl.import("LevelExp", "LevelExp_getHeadExp");

//LevelExp-v3 减少总经验(XUID, CONST)
let delHeadExp = lxl.import("LevelExp", "LevelExp_delHeadExp");

//LevelExp-v3 数据查询(XUID)
let getPlayData = lxl.import("LevelExp", "LevelExp_getPlayData");

//配置文件 
const Config = new JsonConfigFile(".\\plugins\\LevelExp\\plugins\\LvFlys\\Config.json", JSON.stringify({
		"VERSION": 1,									//配置版本
		"BUGLogs": false,								//后台聊天输出
		"DemandLevel": 15,								//需求飞行等级 // 10 级以上
		"TypeName": "Exp",								//模式 [ Head / Exp ]
		"Consume": 1,									//每秒消耗多少
		"Time": 1200,
	}));

//要求 //消耗
let Demand = Config.get("DemandLevel"), Consume = Config.get("Consume");	//本地
//模式 //刷新时间
let TypeName = Config.get("TypeName"), Times = Config.get("Time");			//本地


/* 监听进服事件 */
mc.listen('onJoin', function (pl) => { onJoinEvent(pl) });


function onJoinEvent(pl) {
		let tm = setInterval(function () {
			/*检查是否是NPC*/
			if (pl.isSimulatedPlayer() || !pl) return;
			if (pl.inWorld !== 1) {
			let one = mc.getOnlinePlayers();
			if (pl.xuid == one.xuid) return;
			if (getPlayData(pl.xuid).Level <= Demand) {		//等级小于需求关闭飞行
				if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
					pl.setAbility(10, false);				//关闭飞行
				}
				return false;
			}

			if (getPlayData(pl.xuid).Level >= Demand) {		//等级大于等于需求开启飞行
				if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
					pl.setAbility(10, true);				//开启飞行
				}
			}

			if (TypeName == "Exp") {
				if (getExp(pl.xuid) && getExp(pl.xuid) >= 1) {
					if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
						pl.setAbility(10, true);
					}
				}

				if (getExp(pl.xuid) && getExp(pl.xuid) <= 1) {
					if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
						pl.setAbility(10, false);
						//pl.tell("经验不足，无法飞行！");
					}
				}
			}

			if (TypeName == "Head") {
				if (getHeadExp(pl.xuid) && getHeadExp(pl.xuid) >= 1) {
					if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
						pl.setAbility(10, true);
					}
				}

				if (getHeadExp(pl.xuid) && getHeadExp(pl.xuid) <= 1) {
					if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
						pl.setAbility(10, false);
						//pl.tell("经验不足，无法飞行！");
					}
				}
			}

			if (pl.isFlying) {	//在飞行
				if (!(pl.gameMode === 1 || pl.gameMode === 6)) {
					if (TypeName == "Head") {
						if (getHeadExp(pl.xuid) == 0) return
						return delHeadExp(pl.xuid, Consume);	//消耗总经验
					}
					if (TypeName == "Exp") {
						if (getExp(pl.xuid) == 0) return
						return delExp(pl.xuid, Consume);		//消耗经验
					}
				}
			}

			} else return clearInterval(tm);
		}, Times); //速度//一秒
	}

