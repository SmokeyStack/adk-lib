# adk-lib:on_player_destroy_spawn_item

## What does it do?

This component will spawn an item when a player destroys the block.

## How to use

Add `adk-lib:on_player_destroy_spawn_item` to the `minecraft:custom_components` array in your block json file. Since custom components do not have parameter support yet, this component utilizes block tags.

To indicate what block your block should turn into, add the following tag: `adk-lib:spawn_item_[identifier of the block]`

### Example

```json
"tag:adk-lib:spawn_item_minecraft:bedrock": {}
```
