# adk-lib:on_mine_block_digger

## What does it do?

This component modifies the durability damage when you hit an entity.

## How to use

Add `adk-lib:on_mine_block_digger` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk-lib:digger_[amount]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk-lib:digger_75"
    ]
}
```
