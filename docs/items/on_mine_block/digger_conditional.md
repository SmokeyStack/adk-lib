# adk-lib:on_mine_block_digger_conditional

## What does it do?

This component modifies the durability damage when you hit an entity.

## How to use

Add `adk-lib:on_mine_block_digger_conditional` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk-lib:digger_conditional_block_[block id]_amount_[amount]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:digger_conditional_block_minecraft:stone_amount_5",
        "adk-lib:digger_conditional_block_minecraft:dirt_amount_15"
    ]
}
```
