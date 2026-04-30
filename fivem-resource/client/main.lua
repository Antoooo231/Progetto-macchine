local function notify(msg)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(msg)
    EndTextCommandThefeedPostTicker(false, false)
end

local function applyDebadgePreset(vehicle, preset)
    if preset.removeLivery then
        SetVehicleLivery(vehicle, 0)
    end

    for _, extraId in ipairs(preset.disableExtraBadges or {}) do
        if DoesExtraExist(vehicle, extraId) then
            SetVehicleExtra(vehicle, extraId, 1)
        end
    end

    for _, modType in ipairs(preset.modTypeRemovals or {}) do
        SetVehicleMod(vehicle, modType, -1, false)
    end
end

RegisterNetEvent('debadge:applyPreset', function(preset)
    local ped = PlayerPedId()
    if not IsPedInAnyVehicle(ped, false) then
        notify('~r~Debadge: devi essere in un veicolo.')
        return
    end

    local vehicle = GetVehiclePedIsIn(ped, false)
    if GetPedInVehicleSeat(vehicle, -1) ~= ped then
        notify('~r~Debadge: solo il guidatore può applicare il preset.')
        return
    end

    SetVehicleModKit(vehicle, 0)
    applyDebadgePreset(vehicle, preset or Config.DefaultPreset)
    TriggerServerEvent('debadge:logApplied', GetEntityModel(vehicle))
    notify('~g~Debadge applicato con successo.')
end)

RegisterCommand(Config.Command, function()
    TriggerEvent('debadge:applyPreset', Config.DefaultPreset)
end, false)
