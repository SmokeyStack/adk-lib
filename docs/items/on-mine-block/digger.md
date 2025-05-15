# adk_lib:on_mine_block_digger

## What does it do?

This component modifies the durability damage when you mine a block.

## How to use

Add `adk_lib:on_mine_block_digger` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what command your item should should, add the following tag: `adk_lib:digger_[amount]`

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:digger_75"
    ]
}
```
