-- / Starling UI Theme Configuration
-- Paste into server.cfg or your resource's config.lua:
--
-- Light Mode
-- setr theme:light:accent "#6366f1"
-- setr theme:light:bg "#ffffff"
-- setr theme:light:panel "#ffffff"
-- setr theme:light:surface "#f4f4f5"
-- setr theme:light:border "#e4e4e7"
-- setr theme:light:fg "#09090b"
-- setr theme:light:muted "#71717a"
-- setr theme:light:radius "12px"
-- setr theme:light:font "sans"
-- setr theme:light:headerFont "sans"
-- setr theme:light:shadow "md"
-- setr theme:light:btnShadow "md"
--
-- Dark Mode
-- setr theme:dark:accent "#6366f1"
-- setr theme:dark:bg "#0f0f0f"
-- ...etc

local function collect_theme(prefix)
    return {
        accent     = GetConvar(prefix .. ":accent",     "#6366f1"),
        bg         = GetConvar(prefix .. ":bg",         "#ffffff"),
        panel      = GetConvar(prefix .. ":panel",      "#ffffff"),
        surface    = GetConvar(prefix .. ":surface",    "#f4f4f5"),
        border     = GetConvar(prefix .. ":border",     "#e4e4e7"),
        fg         = GetConvar(prefix .. ":fg",         "#09090b"),
        muted      = GetConvar(prefix .. ":muted",      "#71717a"),
        radius     = GetConvar(prefix .. ":radius",     "12px"),
        font       = GetConvar(prefix .. ":font",       "sans"),
        headerFont = GetConvar(prefix .. ":headerFont", "sans"),
        shadow     = GetConvar(prefix .. ":shadow",     "md"),
        btnShadow  = GetConvar(prefix .. ":btnShadow",  "md"),
    }
end

CreateThread(function()
    Wait(1000) -- Give the NUI time to mount

    local light = collect_theme("theme:light")
    local dark  = collect_theme("theme:dark")

    SendNuiMessage(json.encode({
        action = "updateTheme",
        data = {
            light = light,
            dark  = dark,
        },
    }))
end)
