# adk-lib:on_consume_food_effect

## What does it do?

This component enables the item to give a food effect upon consumption.

## How to use

Add `adk-lib:on_consume_food_effect` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate the effect that your item will give upon consumption, add the `adk-lib:food_[effect name]_[duration in ticks]_[amplifier]_[true or false, this is optional]` tag to your item file. By default, `showParticles` is set to true.

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:food_absorption_2400_3",
        "adk-lib:food_regeneration_600_4",
        "adk-lib:food_fire_resistance_6000_0",
        "adk-lib:food_resistance_6000_0",
        "adk-lib:food_resistance_6000_0_false",
    ]
}
```
