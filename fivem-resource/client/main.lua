local uiOpen = false

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

local function closeUi()
    uiOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

local function applyForCurrentVehicle()
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
    applyDebadgePreset(vehicle, Config.DefaultPreset)
    TriggerServerEvent('debadge:logApplied', GetEntityModel(vehicle))
    notify('~g~Debadge applicato con successo.')
end

RegisterNUICallback('applyPreset', function(_, cb)
    applyForCurrentVehicle()
    cb({ ok = true })
end)

RegisterNUICallback('closeUi', function(_, cb)
    closeUi()
    cb({ ok = true })
end)

RegisterCommand(Config.Command, function()
    uiOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open' })
end, false)

RegisterKeyMapping(Config.Command, 'Apri Debadge Studio', 'keyboard', 'F6')

CreateThread(function()
    while true do
        Wait(0)
        if uiOpen and IsControlJustPressed(0, 322) then
            closeUi()
        end
    end
end)
