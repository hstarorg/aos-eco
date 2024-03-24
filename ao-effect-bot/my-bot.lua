-- Initializing global variables to store the latest game state and game host process.
LatestGameState = LatestGameState or nil
-- Game = "0rVZYFxvfJpO__EfOz0_PUQ3GFE9kEaES0GkUDNXjvE" 
Game = "tm1jYBC0F2gTZ0EuUQKq5q_esxITDFkAG6QEpLbpI9I" -- the new game process
local colors = {
    red = "\27[31m",
    green = "\27[32m",
    blue = "\27[34m",
    reset = "\27[0m",
    gray = "\27[90m"
}

-- Checks if two points are within a given range.
-- @param x1, y1: Coordinates of the first point.
-- @param x2, y2: Coordinates of the second point.
-- @param range: The maximum allowed distance between the points.
-- @return: Boolean indicating if the points are within the specified range.
local function inRange(x1, y1, x2, y2, range)
    return math.abs(x1 - x2) <= range and math.abs(y1 - y2) <= range
end

local function calcDistance(x1, y1, x2, y2)
    return math.sqrt(math.pow(x1 - x2, 2) + math.pow(y1 - y2, 2))
end

local function selectDirection(source, target)
    local yDirection = ""
    if (target.y == source.y) then
        yDirection = ""
    elseif (target.y < source.y) then
        yDirection = "Up"
    else
        yDirection = "Down"
    end

    local xDirection = ""
    if (target.x == source.x) then
        xDirection = ""
    elseif (target.x < source.x) then
        xDirection = "Left"
    else
        xDirection = "Right"
    end

    -- local directionMap = { "Up", "Down", "Left", "Right", "UpRight", "UpLeft", "DownRight", "DownLeft" }
    return yDirection .. xDirection
end

-- Decides the next action based on player proximity and energy.
-- If any player is within range, it initiates an attack; otherwise, moves randomly.
local function decideNextAction()
    local player = LatestGameState.Players[ao.id]
    local targetInRange = false

    local minDistance = 160
    -- the min distance user
    local minDisState = { x = 0, y = 0 }
    for target, state in pairs(LatestGameState.Players) do
        if (target ~= ao.id) then
            local dis = calcDistance(player.x, player.y, state.x, state.y)
            if (dis < minDistance) then
                minDistance = dis
                minDisState = state
            end
        end
        if target ~= ao.id and inRange(player.x, player.y, state.x, state.y, 3) then
            targetInRange = true
            break
        end
    end

    if player.energy > 5 and targetInRange then
        print(colors.red .. "Player in range. Attacking." .. colors.reset)
        ao.send({ Target = Game, Action = "PlayerAttack", AttackEnergy = tostring(player.energy) })
    else
        if (minDistance < 3) then
            print("distance <3, stop pursuing... ")
            return
        end
        print(colors.red .. "No player in range or insufficient energy. Pursuing..." .. colors.reset)
        -- local directionMap = { "Up", "Down", "Left", "Right", "UpRight", "UpLeft", "DownRight", "DownLeft" }
        -- local randomIndex = math.random(#directionMap)
        local direction = selectDirection(player, minDisState)
        if (direction ~= "") then
            print(colors.blue .. "Move to " .. direction .. colors.reset)
            ao.send({ Target = Game, Action = "PlayerMove", Direction = direction })
        end
    end
end

function SendGetGameStateEvent()
    ao.send({ Target = Game, Action = "GetGameState" })
end

-- Handler to print game announcements and trigger game state updates.
Handlers.add(
    "PrintAnnouncements",
    Handlers.utils.hasMatchingTag("Action", "Announcement"),
    function(msg)
        -- waiting to join game
        if msg.Event == "Started-Waiting-Period" then
            print("Auto-paying confirmation fees.")
            ao.send({ Target = Game, Action = "Transfer", Recipient = Game, Quantity = "1000" })
        elseif (msg.Event == "Tick" or msg.Event == "Started-Game") then
            SendGetGameStateEvent()
        end
        print(colors.green .. msg.Event .. ": " .. msg.Data .. colors.reset)
    end
)

-- Handler to update the game state upon receiving game state information.
Handlers.add(
    "UpdateGameState",
    Handlers.utils.hasMatchingTag("Action", "GameState"),
    function(msg)
        local json = require("json")
        LatestGameState = json.decode(msg.Data)

        -- decide next ation
        print("Deciding next action.")
        decideNextAction()
        -- Get next state
        SendGetGameStateEvent()

        print(LatestGameState)
    end
)

-- Handler to automatically attack when hit by another player.
Handlers.add(
    "ReturnAttack",
    Handlers.utils.hasMatchingTag("Action", "Hit"),
    function(msg)
        local playerEnergy = LatestGameState.Players[ao.id].energy
        if playerEnergy == undefined then
            print(colors.red .. "Unable to read energy." .. colors.reset)
            ao.send({ Target = Game, Action = "Attack-Failed", Reason = "Unable to read energy." })
        elseif playerEnergy == 0 then
            print(colors.red .. "Player has insufficient energy." .. colors.reset)
            ao.send({ Target = Game, Action = "Attack-Failed", Reason = "Player has no energy." })
        else
            print(colors.red .. "Returning attack." .. colors.reset)
            ao.send({ Target = Game, Action = "PlayerAttack", AttackEnergy = tostring(playerEnergy) })
        end
        ao.send({ Target = ao.id, Action = "Tick" })
    end
)
