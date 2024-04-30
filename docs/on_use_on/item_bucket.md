# adk-lib:on_use_on_bucket

## What does it do?

This component enables the bucket functionality. It allows items to pickup or place liquids and turn into a different item.

## How to use

Add `adk-lib:on_use_on_bucket` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate that your item is an "empty bucket", add the `adk-lib:fluid_empty` tag to your item file. To indicate what liquid your item should pickup, add the following tag: `adk-lib:fluid_[identifier of the liquid]_turn_into_[identifier of the item that this item turns into]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:fluid_empty",
        "adk-lib:fluid_minecraft:water_turn_into_minecraft:water_bucket",
        "adk-lib:fluid_minecraft:lava_turn_into_minecraft:lava_bucket",
        "adk-lib:fluid_minecraft:powder_snow_turn_into_minecraft:powder_snow_bucket"
    ]
}
```

To indicate that your item has liquid, add the `adk-lib:fluid_[identifier of the liquid]_[identifier of the item that this item turns into]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:fluid_minecraft:water_minecraft:bucket"
    ]
}
```
