# adk_lib:on_player_interact_turn_into

## What does it do?

This component allows the block to turn into another block when interacted with a specific item.

## How to use

Add `"adk_lib:on_player_interact_turn_into": {}` to your block json file.

### Parameters

- Key: Represents the block it transforms to.
- Value: A list of items (string array) that can trigger the transformation when interacted with.

### Example

```json
"adk_lib:on_player_interact_turn_into": [
    {
        "transform_to": "test",
        "transform_from": [
            "test",
            {
                "tag": "air"
            }
        ]
    },
    {
        "transform_to": {
            "name": "furnace",
            "states": {
                "minecraft:cardinal_direction": "east",
                "test": 2
            }
        },
        "transform_from": [
            "test"
        ]
    }
]
```
