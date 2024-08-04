# adk-lib:on_hit_entity_summon_particle

# **EXPERIMENTAL**

## What does it do?

This component allows the item to spawn an entity at the position of the entity that this item hit.

## How to use

Add `adk-lib:on_hit_entity_summon_particle` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk-lib:on_hit_summon_particle_[particle id]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:on_hit_summon_particle_minecraft:crop_growth_area_emitter"
    ]
}
```
