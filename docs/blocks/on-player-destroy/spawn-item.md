# adk_lib:on_player_destroy_spawn_item

## What does it do?

This component will spawn an item when a player destroys the block.

## How to use

Add `"adk_lib:on_player_destroy_spawn_item": {}` to your block json file. Since custom components do not have parameter support yet, this component utilizes block tags.

### Parameters

- `"items"`: Identifier(s) of the item to spawn

### Example

```json
"adk_lib:on_player_destroy_spawn_item": {
    "items": ["minecraft:bedrock"]
}
```
