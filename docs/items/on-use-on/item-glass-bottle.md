# adk_lib:on_use_on_glass_bottle

## What does it do?

This component enables the glass bottle functionality. It allows items to pickup liquids and turn into a different item.

## How to use

Add `adk_lib:on_use_on_glass_bottle` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what liquid your item should pickup, add the following tag: `adk_lib:fluid_[identifier of the liquid]_turn_into_[identifier of the item that this item turns into]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:fluid_minecraft:water_turn_into_minecraft:water_bucket",
        "adk_lib:fluid_minecraft:lava_turn_into_minecraft:lava_bucket",
        "adk_lib:fluid_minecraft:powder_snow_turn_into_minecraft:powder_snow_bucket"
    ]
}
```
