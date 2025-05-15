# adk_lib:on_use_on_dye

## What does it do?

This component enables the dye functionality. It allows items to dye signs.

## How to use

Add `adk_lib:on_use_on_dye` to the `minecraft:custom_components` array in your item json file. Since custom components do not have parameter support yet, this component utilizes item tags.

To indicate what dye colour your item is, add the `adk_lib:dye_[colour of the dye]` tag to your item file.

### Example

```json
"minecraft:tags": {
    "tags": [
        "adk_lib:dye_Lime"
    ]
}
```

## Allowed Values

-   Black
-   Blue
-   Brown
-   Cyan
-   Gray
-   Green
-   LightBlue
-   Lime
-   Magenta
-   Orange
-   Pink
-   Purple
-   Red
-   Silver
-   White
-   Yellow
