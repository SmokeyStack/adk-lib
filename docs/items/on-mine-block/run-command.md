# adk-lib:on_hit_entity_run_command

# **RC**

## What does it do?

This component allows the item to run a command when used.

## How to use

Add `adk-lib:on_hit_entity_run_command` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk-lib:on_hit_entity_[command]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:on_hit_entity_tp ~~10~",
        "adk-lib:on_hit_entity_say hi"
    ]
}
```
