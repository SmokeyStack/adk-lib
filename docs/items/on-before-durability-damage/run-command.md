# adk_lib:before_durability_damage_run_command

# **RC**

## What does it do?

This component allows the item to run a command when used.

## How to use

Add `adk_lib:before_durability_damage_run_command` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk_lib:before_durability_damage_[command]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:before_durability_damage_tp ~~10~",
        "adk_lib:before_durability_damage_say hi"
    ]
}
```
