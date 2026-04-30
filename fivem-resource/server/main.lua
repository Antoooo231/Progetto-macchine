RegisterNetEvent('debadge:logApplied', function(vehicleModel)
    local src = source
    local name = GetPlayerName(src) or ('player_' .. tostring(src))
    print(('[debadge_studio] %s ha applicato preset su model %s'):format(name, tostring(vehicleModel)))
end)
