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

RegisterCommand(Config.Command, function()
    local ped = PlayerPedId()
    if not IsPedInAnyVehicle(ped, false) then
        TriggerEvent('chat:addMessage', { args = { '^1Debadge', 'Devi essere dentro un veicolo.' } })
        return
    end

    local vehicle = GetVehiclePedIsIn(ped, false)
    if GetPedInVehicleSeat(vehicle, -1) ~= ped then
        TriggerEvent('chat:addMessage', { args = { '^1Debadge', 'Solo il guidatore può applicare il preset.' } })
        return
    end

    SetVehicleModKit(vehicle, 0)
    applyDebadgePreset(vehicle, Config.DefaultPreset)
    TriggerServerEvent('debadge:logApplied', GetEntityModel(vehicle))

    TriggerEvent('chat:addMessage', { args = { '^2Debadge', 'Preset applicato con successo.' } })
end, false)
