# adk-lib:before_on_player_place_turn_into

## What does it do?

This component allows the block to turn into another block before the player places it.

## How to use

Add `adk-lib:before_on_player_place_turn_into` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes block tags.

To indicate what block your block should turn into, add the following tag: `adk-lib:before_on_player_place_turn_into_[identifier of the block]`

### Example

```json
"tag:adk-lib:before_on_player_place_turn_into_minecraft:bedrock": {}
```
