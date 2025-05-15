# adk_lib:on_hit_entity_summon_entity

# **RC**

## What does it do?

This component allows the item to spawn an entity at the position of the entity that this item hit.

## How to use

Add `adk_lib:on_hit_entity_summon_entity` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk_lib:on_hit_summon_entity_[entity id]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:on_hit_summon_entity_minecraft:pig",
        "adk_lib:on_hit_summon_entity_minecraft:lightning_bolt"
    ]
}
```
