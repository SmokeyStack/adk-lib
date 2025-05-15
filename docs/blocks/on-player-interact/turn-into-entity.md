# adk_lib:on_player_interact_turn_into_entity

## What does it do?

This component allows the block to turn into an entity when interacted with a specific item.

## How to use

Add `"adk_lib:on_player_interact_turn_into_entity": {}` to your block json file.

### Parameters

- Key: Represents the entity it transforms to.
- Value: A list of items (string array) that can trigger the transformation when interacted with.

### Example

```json
"adk_lib:on_player_interact_turn_into_entity": [
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
            "name": "minecraft:creeper",
            "spawn_event": "minecraft:become_charged"
        },
        "transform_from": [
            "test"
        ]
    }
]
```
