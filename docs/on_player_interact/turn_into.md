# adk-lib:on_player_interact_turn_into

## What does it do?

This component allows the block to turn into another block when interacted with a specific item.

## How to use

Add `adk-lib:on_player_interact_turn_into` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes block tags.

To indicate what block your block should turn into, add the following tag: `adk-lib:turn_into_[identifier of the block]_[identifier of the item to check]`

### Example

```json
"tag:adk-lib:turn_into_minecraft:farmland_minecraft:wooden_hoe": {}
```
