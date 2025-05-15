# adk_lib:on_random_tick_effect

## What does it do?

This component will give the entity that steps off the block the specified effect.

## How to use

Add `"adk_lib:on_random_tick_effect": {}` to your block json file.

### Parameters

- `"effect"`: Specifies the name of the status effect to be applied
- `"duration"`: Determines how long the effect will last in ticks
- `"radius"`:  Defines the area of effect measured in blocks. Entities within this radius from the block will be affected.
- `"amplifier"`: Sets the strength level of the effect. Default is 0 if omitted.
- `"show_particles"`: Indicates whether particles should be visible when the effect is applied. Default is true if omitted.
- `"entity_type"`: A list of entity types that can be affected. If omitted, all entities within the radius will be affected.

### Example

```json
"adk_lib:on_random_tick_effect": [
    {
        "effect": "darkness",
        "duration": 100,
        "radius": 5
    },
    {
        "effect": "poison",
        "duration": 100,
        "radius": 1
    },
    {
        "effect": "levitation",
        "duration": 100,
        "radius": 10,
        "entity_type": [
            "minecraft:pig"
        ]
    }
]
```
