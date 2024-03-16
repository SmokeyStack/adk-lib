# ADK LIB

ADK LIB is a library for SmokeyStack's [adk](https://github.com/SmokeyStack/adk) project. This library offers [custom components](https://learn.microsoft.com/en-us/minecraft/creator/documents/customcomponents?view=minecraft-bedrock-stable) that allow reusability across all add-ons.

This library is a work in progress as custom components are still experimental and emerging in the add-on development space.

## Using ADK LIB to play with add-ons

Download the proper version the add-on requires in the [release](https://github.com/SmokeyStack/adk-lib/releases) page. Once you have it downloaded, import it into Minecraft and you should be good to play your add-on. Make sure to apply the pack in the world you're playing on.

## Using ADK LIB to develop add-ons

To use ADK LIB in your add-on, simply add the following to your behaviour pack's manifest.json in the modules section.

```json
{
    "type": "data",
    "uuid": "5e2eda3e-6eaf-4068-9076-0a7f0587b8bb",
    "version": [1, 0, 0]
}
```

Download the desired version from the [release][https://github.com/SmokeyStack/adk-lib/releases] page. Once you have it downloaded, import it into Minecraft and you should be good to develop your add-on. Make sure to apply the pack in the world you're developing on.

## Distributing

Under the [License](LICENSE), you are allowed to distribute this add-on with or without modifications. However, I would much appreciate if instead you direct your users to this [Github Page](https://github.com/SmokeyStack/adk-lib) and ask them to download from the [release](https://github.com/SmokeyStack/adk-lib/releases) page.

## Donate

Help support the development and maintenance of this library.

[![kofi](https://img.shields.io/badge/kofi-%23F16061.svg?&style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/smokeystack)

## License

See [License](LICENSE).
