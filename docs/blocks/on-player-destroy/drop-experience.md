# adk-lib:on_player_destroy_drop_experience

## What does it do?

This component will spawn experience orbs when a player destroys the block.

## How to use

Add `adk-lib:on_player_destroy_drop_experience` to the `minecraft:custom_components` array in your block json file. Since custom components do not have parameter support yet, this component utilizes block tags.

To indicate what block your block should turn into, add the following tag: `adk-lib:drop_experience_[amount of xp]`

### Example

```json
"tag:adk-lib:drop_experience_10": {}
```
