# adk_lib:before_durability_damage_modify_durability_damage_conditional

# **RC**

## What does it do?

This component modifies the durability damage when you hit specific entities.

## How to use

Add `adk_lib:before_durability_damage_modify_durability_damage_conditional` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk_lib:modify_durability_damage_conditional_entity_[entity id]_amount_[amount]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:modify_durability_damage_conditional_entity_minecraft:pig_amount_50",
        "adk_lib:modify_durability_damage_conditional_entity_minecraft:cow_amount_25",
        "adk_lib:modify_durability_damage_conditional_entity_minecraft:sheep_amount_100"
    ]
}
```
