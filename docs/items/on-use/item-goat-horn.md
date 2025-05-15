# adk_lib:on_use_goat_horn

## What does it do?

This component enables the goat horn functionality. It allows items to play a sound.

## How to use

Add `adk_lib:on_use_goat_horn` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what instrument your item should play, add the following tag: `adk_lib:instrument_[identifier of the sound]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:instrument_horn.call.5"
    ]
}
```
