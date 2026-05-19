fx_version("cerulean")
game("gta5")

authors("Codexis, Yatsu")
description("VStack - High Performance Stack for FiveM")
version("1.0.0")

ui_page("dist/index.html")

files({
	-- Configs files
	"configs/client.lua",
	"configs/shared.lua",

	-- Locales files
	"locales/*.json",

	-- UI files
	"dist/index.html",
	"dist/**/*",
})

shared_scripts({
	"@ox_lib/init.lua",
})

client_scripts({
	"client/main.lua",
})

server_scripts({
	"@oxmysql/lib/MySQL.lua",
	"server/main.lua",
})

dependencies({
	"ox_lib",
	"oxmysql",
})
